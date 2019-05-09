import React, {Component} from "react";
import ReactDOM from "react-dom";

import { getDeps } from 'api/deps.js';

import * as d3 from 'd3';

class Charts extends Component {
  /** 
   * 构建出d3所需要的nodes edges
   */
  format = (data) => {
    console.log('data', data)
    let modules = data.moduleMap;
    let root = modules[data.entry];

    //节点数据
    function getNodes(modules) {
      let keys = Object.keys(modules);
      let nodes = [];

      keys.forEach(key => {
        let node = modules[key]
        nodes.push({
          name: node.id,
          id: node.index,
        })
      })

      return nodes;
    }

    let nodes = getNodes(modules);

    function getEdges(root, edges) {
      if (root.isTravel) {
        return
      }

      root.isTravel = true;

      let deps = root.dependencies;

      if (!deps.length) {
        return;
      }

      deps.map(depId => {
        let dep = modules[depId];

        edges.push({
          source: root.index,
          target: dep.index,
          value: 1,
        })

        getEdges(dep, edges);
      })
    }
    let edges = [];
    getEdges(root, edges);

    return {
      nodes,
      edges
    }
  }

  /** 
   * 使用nodes edges在theChart上绘制
   */
  forceChart = (nodes, edges) => {
    const WIDTH = 1000;
    const HEIGHT = 700;
    const R = 18;
    
    this.refs['theChart'].innerHTML = '';

    // 设置一个color的颜色比例尺，为了让不同的扇形呈现不同的颜色
    const colorScale = d3.scaleOrdinal()
      .domain(d3.range(nodes.length))
      .range(d3.schemeCategory10);

    // 创建svg
    const svg = d3.select('#theChart').append('svg') // 在id为‘theChart’的标签内创建svg
      .style('width', WIDTH)
      .style('height', HEIGHT)
  
    const g = svg.append('g'); // 则svg中创建g

    // 1. 定义一个力导向图

    // 1.1 初始化
    const forceSimulation = d3.forceSimulation()
      .force("link", d3.forceLink())
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter());
    
    // 1.2 生成节点数据
    forceSimulation.nodes(nodes)
      .on("tick", ticked); 
    
    // 1.3 生成边数据
    forceSimulation.force("link")
      .links(edges)
      .distance(function (d) { //每一边的长度
        return d.value * 100;
      })
    
    // 1.4 设置图形的中心位置	
    forceSimulation.force("center")
    .x(WIDTH / 2)
    .y(HEIGHT / 2);

    // 2. 绘制边
    const links = g.append("g")
      .selectAll("line")
      .data(edges)
      .enter()
      .append("line")
      .attr("stroke", function (d, i) {
        return colorScale(i);
      })
      .attr("stroke-width", 1);

    // 3. 绘制箭头
    const marker = g.append("marker")
      .attr("id", "resolved")
      .attr("markerUnits", "userSpaceOnUse")
      .attr("viewBox", "0 -5 10 10") //坐标系的区域
      .attr("refX", R * 1.2) //箭头坐标
      .attr("refY", 0)
      .attr("markerWidth", 12) //标识的大小
      .attr("markerHeight", 12)
      .attr("orient", "auto") //绘制方向，可设定为：auto（自动确认方向）和 角度值
      .attr("stroke-width", 2) //箭头宽度
      .append("path")
      .attr("d", "M0,-5L10,0L0,5") //箭头的路径
      .attr('fill', '#000000'); //箭头颜色
    
    // 4. 绘制节点相关

    // 4.1 创建gs
    const gs = g.selectAll(".circleText")
      .data(nodes)
      .enter()
      .append("g")
      .attr("transform", function (d, i) {
        var cirX = d.x;
        var cirY = d.y;
        return "translate(" + cirX + "," + cirY + ")";
      })
      .call(d3.drag()
        .on("start", started)
        .on("drag", dragged)
        .on("end", ended)
      );

    // 4.2 绘制节点
    const nodesCircle = gs.append("circle")
      .attr("r", R)
      .attr("fill", function (d, i) {
        return colorScale(i);
      })
      
    // 4.3 绘制节点文字
    const nodesText = gs.append("text")
      .attr('dy', '.3em') // 偏移量
      .attr('text-anchor', 'middle') // 节点名称放在圆圈中间位置
      .attr("stroke", '#fff')
      .attr("stroke-width", 1)
      .text(function (d) {
        return d.index;
      })
    
    // 4.4 hover的气泡提示
    const nodesTitle = nodesCircle.append('title')
      .text((node) => { // .text设置气泡提示内容
          return node.name; // 气泡提示为node的名称
      });

    function ticked() {
      links
        .attr("x1", function (d) {
          return d.source.x;
        })
        .attr("y1", function (d) {
          return d.source.y;
        })
        .attr("x2", function (d) {
          return d.target.x;
        })
        .attr("y2", function (d) {
          return d.target.y;
        })
        .attr("marker-end", "url(#resolved)");

      gs
        .attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")";
        });
    }

    function started(d) {
      if (!d3.event.active) {
        forceSimulation.alphaTarget(0.8).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function ended(d) {
      if (!d3.event.active) {
        forceSimulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    }
  }

  getDepsList = async () => {
    try {
      let data = await getDeps();
      let {nodes, edges} = this.format(data);
      this.setState({
        nodes,
        edges,
        modules: data.moduleMap,
        root: data.moduleMap[data.entry]
      })
      this.forceChart(nodes, edges)
    } catch(err) {
      console.log(err);
    }
  }

  componentDidMount() {
    this.getDepsList();
  }

  render() {
   
    return (
      <div>
        <div className="theChart" id="theChart" ref="theChart"></div>
      </div>
    )
  }
}

export default Charts;
import React, {Component} from "react";
import ReactDOM from "react-dom";
import Charts from 'components/charts';
import DepList from 'components/dep-list'

import { getDeps } from 'api/deps.js';

import './style.css';

import { Layout, Menu, Icon } from 'antd';

const { Header, Sider, Content } = Layout;

class Page extends Component {
  constructor() {
    super();

    this.state = {
      modules: null,
      entry: null
    }
  }

  render() {
    return (
      <Layout>
        <Sider width="auto">
          <DepList modules={this.state.modules} entry={this.state.entry}/>
        </Sider>
        <Layout>
          <Content>
            <div styleName="page-content">
              <Charts/>
            </div>
          </Content>
        </Layout>
      </Layout>
    )
  }

  getDepsList = async () => {
    try {
      let data = await getDeps();
      this.setState({
        modules: data.moduleMap,
        entry: data.entry
      })
    } catch(err) {
      console.log(err);
    }
  }

  componentDidMount() {
    this.getDepsList();
  }
}

export default Page;
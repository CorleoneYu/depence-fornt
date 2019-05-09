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
      root: null
    }
  }

  render() {
    return (
      <Layout>
        <Sider>
          <DepList/>
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
        root: data.moduleMap[data.entry]
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
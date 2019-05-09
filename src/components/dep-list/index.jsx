import React, {Component} from "react";
import ReactDOM from "react-dom";

import { Button, Menu, Icon, List } from 'antd';

class DepList extends Component {
  mapToAry = () => {
    let modulesMap = this.props.modules;
    const moduleAry = [];
    for (let key in modulesMap) {
      moduleAry.push(modulesMap[key]);
    }

    return moduleAry
  }
  render() {
    const modules = this.mapToAry();

    return (
      <div>
        <Menu theme="dark" mode="inline">
          {
            modules.map(module => {
              return (
                <Menu.Item key={module.id}>
                  <span>{module.index}--->{module.id}</span>
                </Menu.Item>
              )
            })
          }
        </Menu>
      </div>
    )
  }
}

export default DepList;
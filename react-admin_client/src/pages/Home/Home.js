import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
/* import { connect } from 'dva'; */

import logo from '../../assets/logo.jpg'
import menus from './mockMenu'

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    }
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  getMenus = menus => {
    let menu = []
    for (let i = 0; i < menus.length; i++) {
      let m = null
      if (menus[i].children.length > 0) {
        this.getMenus(menus[i].children)
        m = (
          <SubMenu
            key={menus[i].id}
            title={
              <span>
                <Icon type={menus[i].icon} />
                <span>{menus[i].name}</span>
              </span>
            }
          >
            {this.getMenus(menus[i].children)}
          </SubMenu>
        )
      } else {
        m = (
          <Menu.Item 
            key={menus[i].id} 
            onClick={() => {
              this.props.history.push({
                pathname: menus[i].pathname,
                query: {}
              })
            }}
          >
            <Icon type={menus[i].icon} />
            <span>{menus[i].name}</span>
          </Menu.Item>
        )
      }
      menu.push(m)
    }
    return menu
  }

  getContents = () => {
    const com = 'Main'
  }

  render () {
    const { history } = this.props
    return (
      <Layout>
        <Sider
          width='250'
          theme="light"
          style={{
            overflow: 'auto',
            height: '100vh',
            left: 0,
          }}
          trigger={null}
          collapsible 
          collapsed={this.state.collapsed}
        >
          <img src={logo} alt="金蜜果会计事务所Logo" style={{ maxWidth: '60%', margin: '10px 20% 20px 20%' }} />
          <Menu theme="light" mode="inline" defaultSelectedKeys={['0']}>
            {this.getMenus(menus)}
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              style={{
                fontSize: '18px',
                lineHeight: '64px',
                padding: '0 24px',
                cursor: 'pointer',
                transition: 'color 0.3s'
              }}
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <a href="/#/login">注销</a>
          </Header>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <div style={{ padding: 24, background: '#fff', textAlign: 'center' }}>
              {this.getContents()}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>浙江大学城市学院 软件工程1601班 陈佳敏 全栈开发</Footer>
        </Layout>
      </Layout>
    )
  }
}

export default Home;
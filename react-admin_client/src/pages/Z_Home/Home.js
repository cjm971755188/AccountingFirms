import React, { Component } from 'react';
import { Layout, Menu, Icon, message } from 'antd';
import { Router, Route, Switch, Redirect, Link } from 'dva/router';
import { connect } from 'dva';

import routes from '../../router';
import logo from '../../assets/logo.jpg'

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

@connect(({ home, user, loading }) => ({ 
  home, 
  user,
  loading: loading.effects['home/getMenus'], 
}))
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    }
  }

  UNSAFE_componentWillMount = () => {
    const { user: { user: { permissions } }, dispatch } = this.props
    dispatch({
      type: 'home/getMenus',
      payload: {
        permissions
      }
    })
      .catch((e) => { message.error(e) })
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  getMenus = (menus) => {
    return menus.map(item => {
      if (!item.children) {
        return (
          <Menu.Item key={item.path}>
            <Link to={item.path}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        )
      } else {
        return (
          <SubMenu
            key={item.path}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }>
              {this.getMenus(item.children)}
            </SubMenu>
        )
      }
    })
  }

  getRoutes = (routes, beforePath) => {
    return routes.map(route => {
      if (!route.children) {
        return <Route exact={route.exact} key={`${beforePath}${route.path}`} path={`${beforePath}${route.path}`} component={route.component} />
      } else {
        return this.getRoutes(route.children, `${beforePath}${route.path}`)
      }
    })
  }

  render () {
    const { 
      home: {  menus = [] }, 
      location: { pathname = '' },
      history 
    } = this.props
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
          <Menu 
            theme="light" 
            mode="inline" 
            selectedKeys={[pathname]}
          >
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
            <Icon type="arrow-left" onClick={() => { this.props.history.goBack() }} />
            <span style={{ cursor: 'pointer'}} onClick={() => { this.props.history.goBack() }}>返回</span>
            <a href="/user/login" style={{ marginLeft: '16px' }}>注销</a>
          </Header>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <div style={{ padding: 24, background: '#fff', textAlign: 'center' }}>
              <Router history={history}>
                <Switch>
                  {this.getRoutes(routes[1].routes, '/home')}
                  <Redirect exact from="/home" to={`/home${routes[1].routes[0].path}`} />
                </Switch>
              </Router>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>浙江大学城市学院 软件工程1601班 陈佳敏 全栈开发</Footer>
        </Layout>
      </Layout>
    )
  }
}

export default Home;
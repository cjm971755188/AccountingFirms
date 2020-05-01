import React, { Component } from 'react';
import { Layout, Menu, Icon, message, Dropdown, Row, Col, notification, Button, Modal, Form, Input, Radio } from 'antd';
import { Router, Route, Switch, Redirect, Link  } from 'dva/router';
import { connect } from 'dva';

import routes from '../../router';
import logo from '../../assets/logo.jpg'

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

@connect(({ user, loading }) => ({ 
  user,
  loading: loading.effects['user/getMenus'], 
}))
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      editVisible: false,
      name: this.props.user.user.name,
      sex: this.props.user.user.sex,
      phone: this.props.user.user.phone,
      changeVisible: false,
      password1: '',
      password2: ''
    }
  }

  UNSAFE_componentWillMount = () => {
    const { user: { user: { permission, change } }, dispatch } = this.props
    const close = () => {
      console.log(
        'Notification was closed. Either the close button was clicked or duration time elapsed.',
      );
    };
    const openNotificationWithIcon = type => {
      const key = `open${Date.now()}`;
      const btn = (
        <>
          <Button size="small" onClick={() => notification.close(key)} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button type="primary" size="small" onClick={() => { notification.close(key); this.setState({ changeVisible: true })}}>
            修改密码
          </Button>
        </>
      );
      notification[type]({
        btn,
        key,
        onClose: close,
        duration: null,
        message: '修改系统默认密码',
        description:
          '若账号密码与系统默认密码相同，请为了账号安全，建议自行修改密码。',
      });
    };
    if (change === 1) {
      openNotificationWithIcon('warning')
    }
    dispatch({
      type: 'user/getMenus',
      payload: { permission }
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
  
  onClick = ({ key }) => {
    if (key === "3") {
      this.props.history.push({
        pathname: '/user/login'
      })
      message.success("注销成功！");
    } else if (key === "2") {
      this.setState({ changeVisible: true })
    } else if (key === "1") {
      this.setState({ editVisible: true })
    } else {}
  };

  handleOk = (type) => {
    const { user: { user }, dispatch } = this.props
    const { name, sex, phone, password1, password2 } = this.state
    if (type === 'edit') {
      if (name === '') {
        message.error('用户姓名不得为空！')
      } else {
        dispatch({
          type: 'user/edit',
          payload: { 
            uid: user.uid, 
            name: name === user.name ? user.name : name,
            sex: sex === user.sex ? user.sex : sex, 
            phone: phone === user.phone ? user.phone : phone
          }
        })
          .then((res) => {
            message.success('修改个人信息成功！')
            this.setState({ editVisible: false })
          })
          .catch((e) => {
            message.error(e);
          });
      }
    } else {
      if (password1 === '' || password2 === '') {
        message.error('两次输入密码不得有空！')
      } else if (password1.length < 6 || password1.length > 16 || password2.length < 6 || password2.length > 16) {
        message.error('密码输入长度不正确，请重新确认！')
      } else if (password1 !== password2) {
        message.error('两次密码输入不一致，请重新确认！')
      } else if (password1 === 123456) {
        message.error('新密码不得为默认密码，请重新输入')
      } else {
        dispatch({
          type: 'user/change',
          payload: { 
            uid: user.uid, 
            password: password1,
          }
        })
          .then((res) => {
            message.success('修改密码成功！')
            this.setState({ changeVisible: false, password1: '', password2: '' })
          })
          .catch((e) => {
            message.error(e);
          });
      }
    }
  }

  handleCancel = (type) => {
    if (type === 'edit') {
      this.setState({ editVisible: false })
    } else {
      this.setState({ changeVisible: false, password1: '', password2: '' })
    }
  }

  render () {
    const { 
      user: { user, menus: { menus = [] } }, 
      location: { pathname = '' },
      history 
    } = this.props
    const { collapsed, editVisible, name, sex, phone, changeVisible, password1, password2 } = this.state
    const menu = (
      <Menu onClick={(key) => { this.onClick(key) }}>
        <Menu.Item key="1">编辑个人信息</Menu.Item>
        <Menu.Item key="2">修改密码</Menu.Item>
        <Menu.Item key="3">注销</Menu.Item>
      </Menu>
    );
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
          collapsed={collapsed}
        >
          <img src={logo} alt="金蜜果会计事务所Logo" style={{ maxWidth: '60%', margin: '10px 20% 20px 20%' }} />
          <Menu 
            theme="light" 
            mode="inline" 
            selectedKeys={[pathname]}
          >
            {this.getMenus(menus && menus)}
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Row>
              <Col span={22}>
                <Icon
                  style={{
                    fontSize: '18px',
                    lineHeight: '64px',
                    padding: '0 24px',
                    cursor: 'pointer',
                    transition: 'color 0.3s'
                  }}
                  type={collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={this.toggle}
                />
                <Icon type="arrow-left" onClick={() => { this.props.history.goBack() }} />
                <span style={{ cursor: 'pointer'}} onClick={() => { this.props.history.goBack() }}>返回</span>
              </Col>
              <Col span={2}>
                <span>欢迎你，{user.name}</span>
                <Dropdown overlay={menu} placement="bottomRight">
                  <Icon type="setting" style={{ marginLeft: 10 }} />
                </Dropdown>
              </Col>
              <Modal
                visible={editVisible}
                title="编辑个人信息"
                onOk={() => { this.handleOk('edit') }}
                onCancel={() => { this.setState({ editVisible: false }) }}
                footer={[
                  <Button key="back" onClick={() => { this.handleCancel('edit') }}>
                    取消
                  </Button>,
                  <Button key="submit" type="primary" onClick={() => { this.handleOk('edit') }}>
                    确认编辑
                  </Button>,
                ]}
              >
                <Row style={{ height: 50 }}>
                  <Col span={4}>工号</Col>
                  <Col span={20}><Input disabled style={{ width: '100%' }} value={user.username} /></Col>
                </Row>
                <Row style={{ height: 50 }}>
                  <Col span={4}>姓名</Col>
                  <Col span={20}><Input placeholder="请输入员工姓名" style={{ width: '100%' }} defaultValue={name} onChange={(e) => { this.setState({ name: e.target.value })}} /></Col>
                </Row>
                <Row style={{ height: 50 }}>
                  <Col span={4}>性别</Col>
                  <Col span={20}>
                    <Radio.Group defaultValue={sex} onChange={(e) => { this.setState({ sex: e.target.value })}}>
                      <Radio value='男'>男</Radio>
                      <Radio value='女'>女</Radio>
                    </Radio.Group>
                  </Col>
                </Row>
                <Row style={{ height: 50 }}>
                  <Col span={4}>联系方式</Col>
                  <Col span={20}><Input placeholder="请输入员工的手机号" style={{ width: '100%' }} defaultValue={phone} onChange={(e) => { this.setState({ phone: e.target.value })}} /></Col>
                </Row>
              </Modal>
              <Modal
                visible={changeVisible}
                title="修改密码"
                onOk={() => { this.handleOk('change') }}
                onCancel={() => { this.setState({ changeVisible: false }) }}
                footer={[
                  <Button key="back" onClick={() => { this.handleCancel('change') }}>
                    取消
                  </Button>,
                  <Button key="submit" type="primary" onClick={() => { this.handleOk('change') }}>
                    确认修改
                  </Button>,
                ]}
              >
                <Row style={{ height: 50 }}>
                  <Col span={4} style={{ lineHeight: '30px' }}>新密码</Col>
                  <Col span={20}>
                    <Input
                      defaultValue={password1}
                      type='password'
                      placeholder="请输入新设置的密码"
                      onChange={(e) => { this.setState({ password1: e.target.value })}}
                    />
                  </Col>
                </Row>
                <Row style={{ height: 50 }}>
                  <Col span={4} style={{ lineHeight: '30px' }}>确认密码</Col>
                  <Col span={20}>
                    <Input
                      defaultValue={password2}
                      type='password'
                      placeholder="请再次确认输入新设置的密码"
                      onChange={(e) => { this.setState({ password2: e.target.value })}}
                    />
                  </Col>
                </Row>
              </Modal>
            </Row>
          </Header>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial'}}>
            <div style={{ padding: 24, background: '#fff', textAlign: 'center' }}>
              <Router history={history}>
                <Switch>
                  {this.getRoutes(routes[1].routes, '/home')}
                  <Redirect exact from="/home" to={`/home${routes[1].routes[0].path}${routes[1].routes[0].children[0].path}`} />
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

const HomeForm  = Form.create({ name: 'home' })(Home);

export default HomeForm;
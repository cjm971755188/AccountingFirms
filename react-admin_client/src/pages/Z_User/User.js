import React, { Component } from 'react';
import { Card, Row } from 'antd';
import { Router, Route, Switch, Redirect } from 'dva/router';
import { connect } from 'dva';

import routes from '../../router';
import logo from '../../assets/logo.jpg'

@connect(({ login }) => ({ login }))
class User extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  getRoutes = (routes, beforePath) => {
    return routes.map(route => {
      if (!route.children) {
        return <Route exact={route.exact} key={`${beforePath}${route.path}`} path={`${beforePath}${route.path}`} component={route.component} />
      } else {
        return this.getRoutes(route.children, route.path)
      }
    })
  }

  render () {
    const { history } = this.props
    return (
      <div style={{ height: '100vh', display: 'flex' }}>
        <Card style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
          <Row><img src={logo} alt="金蜜果会计事务所Logo" style={{ maxWidth: '40%', margin: '10px 30% 40px 30%' }} /></Row>
          <Router history={history}>
            <Switch>
              {this.getRoutes(routes[0].routes, '/user')}
              <Redirect exact from="/" to={routes[0].routes[0].path} />
            </Switch>
          </Router>
        </Card>
      </div>
    )
  }
}

export default User ;
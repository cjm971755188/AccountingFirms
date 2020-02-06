import React, { Component } from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';

class RouterConfig extends Component {
  render () {
    console.log('this.props: ', this.props);
    const { type, routes, history } = this.props
    return  (
      <Router history={history}>
        <Switch>
          {routes.map(route => { 
            return <Route key = {route.path} path = {route.path} component = {route.component} />
          })}
          <Redirect exact from = {`/${type}`} to = {routes[0].path} />
        </Switch>
      </Router>
    )
  }
}

export default RouterConfig;
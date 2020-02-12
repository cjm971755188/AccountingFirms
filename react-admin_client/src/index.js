import React from 'react';
import dva from 'dva';
import createLoading from 'dva-loading';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'dva/router';
import { createBrowserHistory } from 'history';
import './global.css';

import routes from './router';

// 1. Initialize
const app = dva({
  history: createBrowserHistory()
});

// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(require('./models/login').default);

// 4. Router
app.router(() =>
  <Router>
    <Switch>
      {routes.map(route => { 
        return <Route key={route.path} path={route.path} component={route.component} />
      })}
      <Redirect exact from="/" to={routes[0].path} />
    </Switch>
  </Router>
);

// 5. Start
app.start('#root');

import React from 'react';
import dva from 'dva';
import createLoading from 'dva-loading';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'dva/router';
import { createBrowserHistory } from 'history';
import './global.less';

import routes from './router';

// 1. Initialize
const app = dva({
  history: createBrowserHistory()
});

// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(require('./pages/User_Home/model').default);
app.model(require('./pages/Person/model').default);
app.model(require('./pages/Customer/model').default);
app.model(require('./pages/Business/model').default);
app.model(require('./pages/Absent/model').default);
app.model(require('./pages/Department/model').default);
app.model(require('./pages/CustomerType/model').default);
app.model(require('./pages/BusinessType/model').default);
app.model(require('./pages/Account/model').default);

// 4. Router
app.router(() =>
  <Router>
    <Switch>
      {routes.map(route => { 
        return <Route key={route.path} path={route.path} component={route.component} />
      })}
      <Redirect exact from="/" to={`${routes[0].path}${routes[0].routes[0].path}`} />
    </Switch>
  </Router>
);

// 5. Start
app.start('#root');

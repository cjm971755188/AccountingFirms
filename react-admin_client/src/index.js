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
app.model(require('./models/user').default);
app.model(require('./models/home').default);
app.model(require('./models/personnelManage').default);
app.model(require('./models/customerManage').default);
app.model(require('./models/businessManage').default);
app.model(require('./models/leaveManage').default);
app.model(require('./models/positionManage').default);
app.model(require('./models/settlementTypeManage').default);
app.model(require('./models/businessTypeManage').default);
app.model(require('./models/accountManage').default);
app.model(require('./models/permissionsManage').default);

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

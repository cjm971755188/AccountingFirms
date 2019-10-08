import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Login from './pages/Login/Login'
import Admin from './pages/Admin/Admin'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' component={ Login }></Route>
        <Route path='/admin' component={ Admin }></Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;

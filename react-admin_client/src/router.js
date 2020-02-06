import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Main from './pages/Main/Main';
import PersonnelManage from './pages/PersonnelManage/PersonnelManage';

export default [
  {
    path: '/login',
    component: Login,
    exact: true,
  },
  {
    path: '/home',
    component: Home,
    exact: true,
    routes: [
      { 
        path: '/main', 
        component: Main, 
        exact: true
      },
      { 
        path: '/personnelManage', 
        component: PersonnelManage, 
        exact: true
      }
    ],
  },
];

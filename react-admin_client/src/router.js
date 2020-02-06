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
        path: '/home',
        component: Main,
      },
      {
        path: '/personnelManage',
        icon: 'user',
        component: PersonnelManage,
      },
    ],
  },
];

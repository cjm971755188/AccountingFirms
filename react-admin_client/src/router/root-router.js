import Login from '../pages/Login/Login';
import Home from '../pages/Home/Home';

export default [
  { path: '/login', component: Login, children: [] },
  { path: '/home', component: Home, children: [] }
]
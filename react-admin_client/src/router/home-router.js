import Main from '../pages/Main/Main';
import PersonnelManage from '../pages/PersonnelManage/PersonnelManage';

export default [
  { path: '/home', component: Main, children: [] },
  { path: '/home/personnelManage', component: PersonnelManage, children: [] }
]
import User from './pages/Z_User/User';
import Login from './pages/Z_User/Login';
import Forget from './pages/Z_User/Forget';
import Reset from './pages/Z_User/Reset';

import Home from './pages/Z_Home/Home';
import Main from './pages/Main/Main';

import PersonManage from './pages/PersonManage/PersonManage';
import PersonCreate from './pages/PersonManage/PersonCreateEdit';
import PersonDetail from './pages/PersonManage/PersonDetail';
import PersonEdit from './pages/PersonManage/PersonCreateEdit';

import CustomerManage from './pages/CustomerManage/CustomerManage';
import CustomerCreate from './pages/CustomerManage/CustomerCreateEdit';
import CustomerDetail from './pages/CustomerManage/CustomerDetail';
import CustomerEdit from './pages/CustomerManage/CustomerCreateEdit';

import BusinessManage from './pages/BusinessManage/BusinessManage';
import BusinessCreate from './pages/BusinessManage/BusinessCreate';
import BusinessHelp from './pages/BusinessManage/BusinessHelp';

import LeaveManage from './pages/LeaveManage/LeaveManage';
import LeaveCreate from './pages/LeaveManage/LeaveCreate';

import PositionManage from './pages/PositionManage/PositionManage';
import PositionCreate from './pages/PositionManage/PositionCreateEdit';
import PositionEdit from './pages/PositionManage/PositionCreateEdit';

import SettlementTypeManage from './pages/SettlementTypeManage/SettlementTypeManage';
import SettlementTypeCreate from './pages/SettlementTypeManage/SettlementTypeCreateEdit';
import SettlementTypeEdit from './pages/SettlementTypeManage/SettlementTypeCreateEdit';

import BusinessTypeManage from './pages/BusinessTypeManage/BusinessTypeManage';
import BusinessTypeCreate from './pages/BusinessTypeManage/BusinessTypeCreate';

import AccountManage from './pages/AccountManage/AccountManage';

import PermissionsManage from './pages/PermissionsManage/PermissionsManage';

export default [
  {
    path: '/user',
    component: User,
    exact: true,
    routes: [
      { 
        path: '/login', 
        component: Login, 
        exact: true
      },
      { 
        path: '/forget', 
        component: Forget, 
        exact: true
      },
      { 
        path: '/reset', 
        component: Reset, 
        exact: true
      }
    ],
  },
  {
    path: '/home',
    component: Home,
    exact: true,
    routes: [
      { 
        path: '/main', 
        component: Main, 
        exact: true,
      },
      { 
        path: '/personManage', 
        exact: true,
        children: [
          { 
            path: '/list', 
            component: PersonManage, 
            exact: true,
          },
          { 
            path: '/create', 
            component: PersonCreate, 
            exact: true,
          },
          { 
            path: '/edit', 
            component: PersonEdit, 
            exact: true,
          },
          { 
            path: '/detail', 
            component: PersonDetail, 
            exact: true,
          },
        ]
      },
      { 
        path: '/customerManage', 
        exact: true,
        children: [
          { 
            path: '/list', 
            component: CustomerManage, 
            exact: true,
          },
          { 
            path: '/create', 
            component: CustomerCreate, 
            exact: true,
          },
          { 
            path: '/edit', 
            component: CustomerEdit, 
            exact: true,
          },
          { 
            path: '/detail', 
            component: CustomerDetail, 
            exact: true,
          },
        ]
      },
      { 
        path: '/businessManage', 
        exact: true,
        children: [
          { 
            path: '/list', 
            component: BusinessManage, 
            exact: true,
          },
          { 
            path: '/create', 
            component: BusinessCreate, 
            exact: true,
          },
          { 
            path: '/help', 
            component: BusinessHelp, 
            exact: true,
          },
        ]
      },
      { 
        path: '/leaveManage', 
        exact: true,
        children: [
          { 
            path: '/list', 
            component: LeaveManage, 
            exact: true,
          },
          { 
            path: '/create', 
            component: LeaveCreate, 
            exact: true,
          },
        ]
      },
      { 
        path: '/positionManage', 
        exact: true,
        children: [
          { 
            path: '/list', 
            component: PositionManage, 
            exact: true,
          },
          { 
            path: '/create', 
            component: PositionCreate, 
            exact: true,
          },
          { 
            path: '/edit',
            component: PositionEdit, 
            exact: true,
          },
        ]
      },
      { 
        path: '/settlementTypeManage', 
        exact: true,
        children: [
          { 
            path: '/list', 
            component: SettlementTypeManage, 
            exact: true,
          },
          { 
            path: '/create', 
            component: SettlementTypeCreate, 
            exact: true,
          },
          { 
            path: '/edit',
            component: SettlementTypeEdit, 
            exact: true,
          },
        ]
      },
      { 
        path: '/businessTypeManage', 
        exact: true,
        children: [
          { 
            path: '/list', 
            component: BusinessTypeManage, 
            exact: true,
          },
          { 
            path: '/create', 
            component: BusinessTypeCreate, 
            exact: true,
          },
        ]
      },
      { 
        path: '/accountManage', 
        exact: true,
        children: [
          { 
            path: '/list', 
            component: AccountManage, 
            exact: true,
          },
          /* { 
            path: '/create', 
            component: BusinessTypeCreate, 
            exact: true,
          }, */
        ]
      },
      { 
        path: '/permissionsManage', 
        exact: true,
        children: [
          { 
            path: '/list', 
            component: PermissionsManage, 
            exact: true,
          },
          /* { 
            path: '/create', 
            component: BusinessTypeCreate, 
            exact: true,
          }, */
        ]
      },
    ],
  },
];

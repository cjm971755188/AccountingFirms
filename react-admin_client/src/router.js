import User from './pages/Z_User/User';
import Login from './pages/Z_User/Login';
import Forget from './pages/Z_User/Forget';
import Reset from './pages/Z_User/Reset';

import Home from './pages/Z_Home/Home';
import Main from './pages/Main/Main';

import PersonList from './pages/Person/PersonList';
import PersonCreate from './pages/Person/PersonCreateEdit';
import PersonDetail from './pages/Person/PersonDetail';
import PersonEdit from './pages/Person/PersonCreateEdit';

import CustomerList from './pages/Customer/CustomerList';
import CustomerCreate from './pages/Customer/CustomerCreateEdit';
import CustomerDetail from './pages/Customer/CustomerDetail';
import CustomerEdit from './pages/Customer/CustomerCreateEdit';

import BusinessList from './pages/Business/BusinessList';
import BusinessCreate from './pages/Business/BusinessCreate';
import BusinessHelp from './pages/Business/BusinessHelp';

import LeaveList from './pages/Leave/LeaveList';
import LeaveCreate from './pages/Leave/LeaveCreate';

import PositionList from './pages/Position/PositionList';
import PositionCreate from './pages/Position/PositionCreateEdit';
import PositionEdit from './pages/Position/PositionCreateEdit';

import CustomerTypeList from './pages/CustomerType/CustomerTypeList';
import CustomerTypeCreate from './pages/CustomerType/CustomerTypeCreateEdit';
import CustomerTypeEdit from './pages/CustomerType/CustomerTypeCreateEdit';
import SalaryCreate from './pages/CustomerType/SalaryCreateEdit';
import SalaryEdit from './pages/CustomerType/SalaryCreateEdit';

import BusinessTypeList from './pages/BusinessType/BusinessTypeList';
import BusinessTypeCreate from './pages/BusinessType/BusinessTypeCreateEdit';
import BusinessTypeEdit from './pages/BusinessType/BusinessTypeCreateEdit';
import GuideCreate from './pages/BusinessType/GuideCreateEdit';
import GuideEdit from './pages/BusinessType/GuideCreateEdit';

import AccountList from './pages/Account/AccountList';

import PermissionsList from './pages/Permissions/PermissionsList';

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
        path: '/person', 
        exact: true,
        children: [
          { 
            path: '/list', 
            component: PersonList, 
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
        path: '/customer', 
        exact: true,
        children: [
          { 
            path: '/list', 
            component: CustomerList, 
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
        path: '/business', 
        exact: true,
        children: [
          { 
            path: '/list', 
            component: BusinessList, 
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
        path: '/leave', 
        exact: true,
        children: [
          { 
            path: '/list', 
            component: LeaveList, 
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
        path: '/position', 
        exact: true,
        children: [
          { 
            path: '/list', 
            component: PositionList, 
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
        path: '/CustomerType', 
        exact: true,
        children: [
          { 
            path: '/list', 
            component: CustomerTypeList, 
            exact: true,
          },
          { 
            path: '/createCustomerType', 
            component: CustomerTypeCreate, 
            exact: true,
          },
          { 
            path: '/editCustomerType',
            component: CustomerTypeEdit, 
            exact: true,
          },
          { 
            path: '/createSalary', 
            component: SalaryCreate, 
            exact: true,
          },
          { 
            path: '/editSalary',
            component: SalaryEdit, 
            exact: true,
          },
        ]
      },
      { 
        path: '/businessType', 
        exact: true,
        children: [
          { 
            path: '/list', 
            component: BusinessTypeList, 
            exact: true,
          },
          { 
            path: '/createBusinessType', 
            component: BusinessTypeCreate, 
            exact: true,
          },
          { 
            path: '/editBusinessType', 
            component: BusinessTypeEdit, 
            exact: true,
          },
          { 
            path: '/createGuide', 
            component: GuideCreate, 
            exact: true,
          },
          { 
            path: '/editGuide',
            component: GuideEdit, 
            exact: true,
          },
        ]
      },
      { 
        path: '/account', 
        exact: true,
        children: [
          { 
            path: '/list', 
            component: AccountList, 
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
        path: '/permissions', 
        exact: true,
        children: [
          { 
            path: '/list', 
            component: PermissionsList, 
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

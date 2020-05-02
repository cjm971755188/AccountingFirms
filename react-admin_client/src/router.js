import User from './pages/User_Home/User';
import UserLogin from './pages/User_Home/UserLogin';

import Home from './pages/User_Home/Home';
import Workspace from './pages/Workspace/Workspace';

import PersonList from './pages/Person/PersonList';
import PersonCreate from './pages/Person/PersonCreateEdit';
import PersonDetail from './pages/Person/PersonDetail';
import PersonEdit from './pages/Person/PersonCreateEdit';

import CustomerList from './pages/Customer/CustomerList';
import CustomerCreate from './pages/Customer/CustomerCreateEdit';
import CustomerDetail from './pages/Customer/CustomerDetail';
import CustomerEdit from './pages/Customer/CustomerCreateEdit';
import CustomerAnalysis from './pages/Customer/CustomerAnalysis';

import BusinessList from './pages/Business/BusinessList';
import BusinessCreate from './pages/Business/BusinessCreate';
import BusinessGuide from './pages/Business/BusinessGuide';
import BusinessAnalysis from './pages/Business/BusinessAnalysis';

import AbsentList from './pages/Absent/AbsentList';
import AbsentCreate from './pages/Absent/AbsentCreate';

import DepartmentList from './pages/Department/DepartmentList';
import DepartmentCreate from './pages/Department/DepartmentCreateEdit';
import DepartmentEdit from './pages/Department/DepartmentCreateEdit';

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
import AccountCreate from './pages/Account/AccountCreate';
import ChangePermissions from './pages/Account/ChangePermissions';

export default [
  {
    path: '/user',
    component: User,
    exact: true,
    routes: [
      { 
        path: '/login', 
        component: UserLogin, 
        exact: true
      },
    ],
  },
  {
    path: '/home',
    component: Home,
    exact: true,
    routes: [
      { 
        path: '/main',
        component: Workspace,
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
          }
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
          { 
            path: '/analysis', 
            component: CustomerAnalysis, 
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
            path: '/guide', 
            component: BusinessGuide, 
            exact: true,
          },
          { 
            path: '/analysis', 
            component: BusinessAnalysis, 
            exact: true,
          },
        ]
      },
      { 
        path: '/absent', 
        exact: true,
        children: [
          { 
            path: '/list', 
            component: AbsentList, 
            exact: true,
          },
          { 
            path: '/create', 
            component: AbsentCreate, 
            exact: true,
          },
        ]
      },
      { 
        path: '/department', 
        exact: true,
        children: [
          { 
            path: '/list', 
            component: DepartmentList, 
            exact: true,
          },
          { 
            path: '/createDepartment', 
            component: DepartmentCreate, 
            exact: true,
          },
          { 
            path: '/editDepartment',
            component: DepartmentEdit, 
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
          { 
            path: '/create', 
            component: AccountCreate, 
            exact: true,
          },
          { 
            path: '/changePermissions', 
            component: ChangePermissions, 
            exact: true,
          },
        ]
      },
    ],
  },
];

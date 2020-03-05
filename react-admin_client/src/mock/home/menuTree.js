import { withRouter } from 'react-router-dom';

const menus = {
  code: 200,
  data: [
    {
      title: "首页",
      icon: "global",
      path: "/home/main"
    },
    {
      title: "员工管理",
      icon: "user",
      path: "/home/personManage",
      children: [
        {
          title: "员工列表",
          icon: "user",
          path: "/home/personManage/list"
        },
        {
          title: "请假管理",
          icon: "robot",
          path: "/home/leaveManage/list"
        },
        {
          title: "员工数据分析",
          icon: "area-chart",
          path: "/home/personAnalysis"
        },
      ]
    },
    {
      title: "客户管理",
      icon: "shop",
      path: "/home/customerManage",
      children: [
        {
          title: "客户列表",
          icon: "shop",
          path: "/home/customerManage/list"
        },
        {
          title: "客户数据分析",
          icon: "area-chart",
          path: "/home/customerAnalysis"
        }
      ]
    },
    {
      title: "业务管理",
      icon: "audit",
      path: "/home/businessManage",
      children: [
        {
          title: "业务列表",
          icon: "audit",
          path: "/home/businessManage/list"
        },
        {
          title: "业务数据分析",
          icon: "area-chart",
          path: "/home/businessAnalysis"
        }
      ]
    },
    {
      title: "配置管理",
      icon: "control",
      path: "/home/othersManage",
      children: [
        {
          title: "员工职位管理",
          icon: "branches",
          path: "/home/positionManage/list"
        },
        {
          title: "结算类型管理",
          icon: "dollar",
          path: "/home/settlementTypeManage/list"
        },
        {
          title: "业务类型管理",
          icon: "tags",
          path: "/home/businessTypeManage/list"
        },
      ]
    },
    {
      title: "系统管理",
      icon: "setting",
      path: "/home/settingManage",
      children: [
        {
          title: "账号管理",
          icon: "laptop",
          path: "/home/accountManage/list"
        },
        {
          title: "权限管理",
          icon: "eye",
          path: "/home/permissionsManage/list"
        },
      ]
    },
  ],
  msg: ''
}

export default withRouter(menus)
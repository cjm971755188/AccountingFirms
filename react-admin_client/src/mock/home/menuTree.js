const menus = {
  code: 200,
  data: [
    {
      title: "首页",
      icon: "global",
      path: "/home/main",
      check: true,
    },
    {
      title: "员工管理",
      icon: "user",
      path: "/home/person",
      children: [
        {
          title: "员工列表",
          icon: "user",
          path: "/home/person/list"
        },
        {
          title: "请假管理",
          icon: "robot",
          path: "/home/leave/list"
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
      path: "/home/customer",
      children: [
        {
          title: "客户列表",
          icon: "shop",
          path: "/home/customer/list"
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
      path: "/home/business",
      children: [
        {
          title: "业务列表",
          icon: "audit",
          path: "/home/business/list"
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
      path: "/home/others",
      children: [
        {
          title: "部门管理",
          icon: "branches",
          path: "/home/position/list"
        },
        {
          title: "结算类型与酬金管理",
          icon: "dollar",
          path: "/home/customerType/list"
        },
        {
          title: "业务类型与指南管理",
          icon: "tags",
          path: "/home/businessType/list"
        },
      ]
    },
    {
      title: "系统管理",
      icon: "setting",
      path: "/home/setting",
      children: [
        {
          title: "账号管理",
          icon: "laptop",
          path: "/home/account/list"
        },
        {
          title: "权限管理",
          icon: "eye",
          path: "/home/permissions/list"
        },
      ]
    },
  ],
  msg: ''
}

export default menus
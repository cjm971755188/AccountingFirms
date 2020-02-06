const menus = [
  { id: '0', icon: 'user', name: '首页', pathname: 'main', check: true, children: [] },
    { id: '1', icon: 'user', name: '人员管理', check: true, children: [
    { id: '100', icon: 'user', name: '人员列表', pathname: 'personnelManage', check: true, children: [] },
    { id: '101', icon: 'user', name: '人员数据分析', check: true, children: [] },
  ] },
  { id: '2', icon: 'user', name: '客户管理', check: true, children: [
    { id: '200', icon: 'user', name: '客户列表', check: true, children: [] },
    { id: '201', icon: 'user', name: '客户数据分析', check: true, children: [] },
  ] },
  { id: '3', icon: 'user', name: '业务管理', check: true, children: [
    { id: '300', icon: 'user', name: '公司注册', check: true, children: [] },
    { id: '301', icon: 'user', name: '办公地址', check: true, children: [] },
    { id: '302', icon: 'user', name: '记账报税', check: true, children: [] },
    { id: '303', icon: 'user', name: '公司注销', check: true, children: [] },
    { id: '304', icon: 'user', name: '公司变更', check: true, children: [] },
    { id: '305', icon: 'user', name: '年报年检', check: true, children: [] },
    { id: '306', icon: 'user', name: '异常处理', check: true, children: [] },
    { id: '307', icon: 'user', name: '食品经营', check: true, children: [] },
    { id: '308', icon: 'user', name: '卫生许可', check: true, children: [] },
    { id: '309', icon: 'user', name: '个体保税', check: true, children: [] },
    { id: '310', icon: 'user', name: '个体注册', check: true, children: [] }
  ] },
  { id: '4', icon: 'user', name: '行政管理', check: true, children: [
    { id: '401', icon: 'user', name: '请假管理', check: true, children: [] },
    { id: '402', icon: 'user', name: '人员结构管理', check: true, children: [] },
    { id: '403', icon: 'user', name: '薪资结构管理', check: true, children: [] },
    { id: '404', icon: 'user', name: '办公用品管理', check: true, children: [] },
    { id: '405', icon: 'user', name: '意见反馈管理', check: true, children: [] },
  ] },
  { id: '5', icon: 'user', name: '系统管理', check: true, children: [
    { id: '501', icon: 'user', name: '账号管理', check: true, children: [] },
    { id: '502', icon: 'user', name: '权限管理', check: true, children: [] },
  ] },
]

export default menus
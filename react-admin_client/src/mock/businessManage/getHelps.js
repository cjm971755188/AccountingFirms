const helps = {
  code: 200,
  data: {
      helps: [
          { hid: '1', name: '公司注册', description: '注册一个新公司', steps: [ 
              { id: '1', color: '#FF8C00', title: '接到业务', text: '获取客户联系方式' }, 
              { id: '2', color: '#FF8C00', title: '收集新公司信息', text: '所有股东身份证原件正反面与实名电话、公司的注册地址材料（房产证、门牌证、租房协议）、市场主体类型、冠名类型、是否由个体户转型、注册资本、股权分配比例、经营范围、公司名称等网报所需信息' },
              { id: '3', color: 'red', title: '网报', text: '在浙江政务服务网上根据流程进行网报，所需上传材料：所有股东身份证原件正反面、代理人的身份证原件正反面、公司的注册地址材料' },
              { id: '4', color: 'grey', title: '等待审核', text: '' }, 
              { id: '5', color: 'red', title: '电子签章', text: '所有股东和代理人在手机上签字（下载浙里办APP，登录成功后首页搜索‘工商’，选择工商电子签章--公司名称，第二次设置密码，签字，确认，最后显示签章成功即完成）' },
              { id: '6', color: 'grey', title: '等待审核', text: '' }, 
              { id: '7', color: 'green', title: '完成业务', text: '审核通过，得到电子营业执照即可' } ]
          },
          { hid: '4', name: '公司注销', description: '注销一个公司', steps: [ 
              { id: '1', color: '', title: '接到业务', text: '网报，所需材料：所有股东签字的承诺书（简易注销）、（一般注销）线下' }, 
              { id: '2', color: '', title: '接到业务', text: '等待审核' },
              { id: '2', color: '', title: '接到业务', text: '将网报下载的纸质材料、营业执照正副本原件交给当地市民中心的市场监督管理局窗口办理，完成即可' } ] 
          },
          { hid: '5', name: '公司变更', description: '变更公司信息', steps: [ 
              { id: '1' },
              { id: '2' } ] 
          },
          { hid: '3', name: '记账报税', description: '', steps: [ 
              { id: '1' }, 
              { id: '2' } ] 
          },
          { hid: '6', name: '年报年检', description: '每个企业每年都要工商年检，6月底之前', steps: [ 
              { id: '1' }, 
              { id: '2' } ] 
          },
          { hid: '7', name: '异常处理', description: '具体情况具体分析', steps: [ 
              { id: '1' }, 
              { id: '2' } ] 
          },
          { hid: '8', name: '许可证办理', description: '多种许可证的不同办理手续', steps: [ 
              { id: '1' }, 
              { id: '2' } ] 
          },
      ],
  },
  msg: ''
}

export default helps
const businessTypeManage = {
    code: 200,
    data: {
        data: [
            { btid: '1', name: '公司注册', description: '注册一个新公司', steps: [ 
                { id: '1', name: '第一步', description: '客户提供：市场主体类型、冠名类型、是否由个体户转型', token: '' }, 
                { id: '2', name: '第二步', description: '所有股东身份证原件正反面、实名电话，公司的注册地址材料（房产证、门牌证、租房协议）、注册资本、股权分配比例、经营范围、公司名称', token: '' },
                { id: '2', name: '第二步', description: '会计进行网报（浙江政务服务网->主题集成服务->个人用户办理），所需材料：所有股东身份证原件正反面、代理人的身份证原件正反面、公司的注册地址材料', token: '' },
                { id: '1', name: '第一步', description: '等待审核', token: '' }, 
                { id: '2', name: '第二步', description: '所有股东和代理人在手机上签字（下载浙里办APP~~在浙里办首先新用户注册～~首页搜工商--工商电子签章--公司名称～第二次设置密码～～签字~确认～最后显示签章成功）', token: '' },
                { id: '1', name: '第一步', description: '等待审核', token: '' }, 
                { id: '1', name: '第一步', description: '审核通过，得到电子营业执照', token: '' } ]
            },
            { btid: '2', name: '公司注销', description: '注销一个新公司', steps: [ 
                { id: '1', name: '第一步', description: '网报，所需材料：所有股东签字的承诺书（简易注销）、（一般注销）线下', token: '' }, 
                { id: '2', name: '第二步', description: '等待审核', token: '' },
                { id: '2', name: '第二步', description: '将网报下载的纸质材料、营业执照正副本原件交给当地市民中心的市场监督管理局窗口办理，完成即可', token: '' } ] 
            },
            { btid: '3', name: '公司变更', description: '公司信息的变更', steps: [ 
                { id: '1', name: '第一步', token: '' },
                { id: '2', name: '第二步', token: '' } ] 
            },
            { btid: '4', name: '记账报税', description: '', steps: [ 
                { id: '1', name: '第一步', token: '' }, 
                { id: '2', name: '第二步', token: '' } ] 
            },
            { btid: '5', name: '年报年检', description: '每个企业每年都要工商年检，6月底之前', steps: [ 
                { id: '1', name: '第一步', token: '' }, 
                { id: '2', name: '第二步', token: '' } ] 
            },
            { btid: '6', name: '异常处理', description: '具体情况具体分析', steps: [ 
                { id: '1', name: '第一步', token: '' }, 
                { id: '2', name: '第二步', token: '' } ] 
            },
            { btid: '7', name: '许可证办理', description: '多种许可证的不同办理手续', steps: [ 
                { id: '1', name: '第一步', token: '' }, 
                { id: '2', name: '第二步', token: '' } ] 
            },
        ],
        pageSize: 10,
        current: 0,
        total: 7
    },
    msg: ''
}

export default businessTypeManage
const detail = {
    code: 200,
    data: {
        basis: {
            '税号': 'QAZWSX',
            '公司名称': 'A有限公司',
            '合作时间': '201702140000',
            '合作时长': '3年',
            '联系人': '徐海涛',
            '联系方式': '17764585713',
        },
        business: {
            data: [
                { bid: 'ZC000001', type: '公司注册', accountant: '陈佳敏', money: '5000', startTime: '', endTime: '', progress: '已结束' },
                { bid: 'DZ000001', type: '办公地址', accountant: '陈佳敏', money: '20000', startTime: '', endTime: '', progress: '未开始' },
                { bid: 'DZ000001', type: '办公地址', accountant: '陈佳敏', money: '20000', startTime: '', endTime: '', progress: '进度1' }
            ],
            pageSize: 10,
            current: 0,
            total: 3
        }
    },
    msg: ''
}

export default detail;
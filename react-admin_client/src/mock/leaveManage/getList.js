const leaveManage = {
    code: 200,
    data: {
        data: [
            { lid: '1', type: '事假', accountant: '陈佳敏', detail: '姐姐结婚', date: '202003010000', state: '未审批' },
            { lid: '2', type: '病假', accountant: '陈佳敏', detail: '早上下楼的时候掉下来，腿骨折了，哈哈哈哈哈哈哈哈哈哈或或哈哈哈哈哈哈哈哈哈哈或或', date: '202003010000', state: '已通过' },
            { lid: '3', type: '其他', accountant: '陈佳敏', detail: '累了，不想上班', date: '202003010000', state: '未通过' },
        ],
        pageSize: 10,
        current: 0,
        total: 3
    },
    msg: ''
}

export default leaveManage
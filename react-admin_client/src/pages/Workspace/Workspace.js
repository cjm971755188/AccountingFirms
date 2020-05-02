import React, { Component } from 'react';
import { Card, List, Pagination, Row, Col, Button, Popconfirm, message, Modal, InputNumber, Divider } from 'antd';
import { connect } from 'dva';

@connect(({ workspace, user, loading }) => ({
  workspace,
  user,
}))
class Workspace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNum1: 1,
      pageNum2: 1,
      visible: false,
      pay: 0,
      item: {}
    }
  }

  UNSAFE_componentWillMount () {
    const { user: { user } } = this.props
    const { pageNum1, pageNum2 } = this.state
    if (user.did === 1) {
      this.getCusotmerList(pageNum1)
      this.getBusinessList(pageNum2)
    } else if (user.did === 2) {
      this.getList2(pageNum1)
    } else {
      this.getList3(pageNum2)
    }
  }
  
  getCusotmerList = (pageNum) => {
    const { dispatch } = this.props
    dispatch({
      type: 'workspace/getCustomerList',
      payload: {
        name: '',
        credit: '欠款',
        pageNum,
        pageSize: 8
      },
    });
  }

  getBusinessList = (pageNum) => {
    const { dispatch } = this.props
    dispatch({
      type: 'workspace/getBusinessList',
      payload: {
        progress: '未结算',
        pageNum,
        pageSize: 8
      },
    });
  }

  getList2 = (pageNum) => {
    const { user: { user } } = this.props
    const { dispatch } = this.props
    dispatch({
      type: 'workspace/getCustomerList',
      payload: {
        uid: user.uid,
        name: '',
        progress: '未完成',
        pageNum,
        pageSize: 8
      },
    });
  }

  getList3 = (pageNum) => {
    const { user: { user } } = this.props
    const { dispatch } = this.props
    dispatch({
      type: 'workspace/getBusinessList',
      payload: {
        uid: user.uid,
        progress: '办理中',
        pageNum,
        pageSize: 8
      },
    });
  }

  getDate = () => {
    var now = new Date();
    var year = now.getFullYear(); //得到年份
    var month = now.getMonth();//得到月份
    var date = now.getDate();//得到日期
    var day = now.getDay();//得到周几
    var hour = now.getHours();//得到小时
    var minu = now.getMinutes();//得到分钟
    var sec = now.getSeconds();//得到秒
    var MS = now.getMilliseconds();//获取毫秒
    var week;
    month = month + 1;
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (minu < 10) minu = "0" + minu;
    if (sec < 10) sec = "0" + sec;
    if (MS < 100)MS = "0" + MS;
    var arr_week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    week = arr_week[day];
    var time = "";
    time = year + "年" + month + "月" + date + "日 " + week;
    return time
  }
  
  onChangeCustomer = page => {
    const { user: { user } } = this.props
    this.setState({ pageNum1: page })
    if (user.did === 1) {
      this.getCusotmerList(page)
      this.getBusinessList(page)
    } else if (user.did === 2) {
      this.getList2(page)
    } else {
      this.getList3(page)
    }
  };

  onChangeBusiness = page => {
    const { user: { user } } = this.props
    this.setState({ pageNum2: page })
    if (user.did === 1) {
      this.getCusotmerList(page)
      this.getBusinessList(page)
    } else if (user.did === 2) {
      this.getList2(page)
    } else {
      this.getList3(page)
    }
  };

  title = () => {
    const { user: { user } } = this.props
    if (user.did === 1) { return '待结算业务' }
    else if (user.did === 2) { return '待做账公司' }
    else if (user.did === 3) { return '待办业务' }
    else {}
  }

  render () {
    const { 
      user: { user }, 
      workspace: { 
        businessList, customerList
      },
      dispatch
    } = this.props
    const { pageNum1, pageNum2, visible } = this.state
    return (
      <>
        <div style={{ float: 'left', textAlign: 'left' }}>
          <p style={{ fontSize: 40, marginBottom: 0 }}>
            {user.name}，你好！
          </p>
          <p style={{ fontSize: 20 }}>今天是{this.getDate()}, 祝你开心每一天</p>
          
        </div>
        {user.did !== 1 ? <Button
          icon="plus"
          type="primary"
          style={{ float: 'right' }}
          onClick={() => { 
            this.props.history.push({
              pathname: '/home/absent/create',
              state: { flag: 2 }
            })
          }}
        >
          申请请假
        </Button> : null}
        <div style={{ clear: 'left', marginBottom: 10 }} />
        {user.did !== 3 ? <Card title={user.did === 1 ? `待结算做账业务 (共${customerList.total}笔)` : `待办做账 (共${customerList.total}笔)`}>
          <List
            rowKey="bid"
            grid={{ gutter: 16, column: 4 }}
            dataSource={customerList.data}
            renderItem={item => (
              <List.Item>
                <Card 
                  className="workCard"
                  style={{ textAlign: 'center'}}
                  title={item.name}
                  actions={[
                    <Row>
                      {
                        user.did === 1 ? <Row 
                          type='primary' 
                          icon={user.did === 1 ? 'pay-circle' : 'check'}
                          style={{ width: '100%', fontSize: 20, fontWeight: 600 }}
                          onClick={() => {
                            this.setState({ visible: true, pay: item.debt, item: item })
                          }}
                        >
                          结算
                        </Row> : 
                        <Popconfirm
                          title="确认完成做账吗"
                          onConfirm={() => {
                            dispatch({
                              type: 'customer/didComplete',
                              payload: { cid: item.cid },
                            })
                              .then((res) => {
                                if (res.msg === '') {
                                  message.success(`'${item.name}'完成做账成功`);
                                } else {
                                  message.error(res.msg)
                                }
                                this.getList2(pageNum1);
                              })
                              .catch((e) => {
                                message.error(e);
                                this.getList2(pageNum1);
                              });
                          }}
                          onCancel={() => {}}
                          okText="确认"
                          cancelText="取消"
                        >
                          <Row type='primary' icon={user.did === 1 ? 'pay-circle' : 'check'} style={{ width: '100%', fontSize: 20, fontWeight: 600 }}>
                            确认完成
                          </Row>
                        </Popconfirm>
                      }
                    </Row>
                  ]}
                >
                  <Row>企业税号：{item.ID}</Row>
                  {user.did === 1 ? <Row>欠款总金额：{item.debt}元</Row> : null}
                </Card>
              </List.Item>
            )}
          />
          <Pagination defaultCurrent={customerList.pageNum} total={customerList.total} pageSize={customerList.pageSize} style={{ float: 'right' }} onChange={this.onChangeCustomer} />
        </Card> : null}
        {user.did !== 2 ? <Card title={user.did === 1 ? `待结算其他业务 (共${businessList.total}笔)` : `待办业务 (共${businessList.total}笔)`} style={{ marginTop: 20 }}>
          <List
            rowKey="bid"
            grid={{ gutter: 16, column: 4 }}
            dataSource={businessList.data}
            renderItem={item => (
              <List.Item>
                <Card 
                  className="workCard"
                  style={{ textAlign: 'center'}}
                  title={item.cName}
                  actions={[
                    <Row>
                      <Popconfirm
                        title="确认结算吗?"
                        onConfirm={() => {
                          dispatch({
                            type: 'workspace/didPayB',
                            payload: { bid: item.bid, cid: item.cid, salary: item.salary, uid: item.uid },
                          })
                            .then((res) => {
                              if (res.msg === '') {
                                message.success(`'${item.cName}'的'${item.btName}'业务完成结算成功`);
                              } else {
                                message.error(res.msg)
                              }
                              this.getBusinessList(pageNum2);
                            })
                            .catch((e) => {
                              message.error(e);
                              this.getBusinessList(pageNum2);
                            });
                        }}
                        onCancel={() => {}}
                        okText="确认"
                        cancelText="取消"
                      >
                        <Row type='primary' icon={user.did === 1 ? 'pay-circle' : 'check'} style={{ width: '100%', fontSize: 20, fontWeight: 600 }}>{user.did === 1 ? '结算' : '确认完成'}</Row>
                      </Popconfirm>
                    </Row>
                  ]}
                >
                  <Row>业务类型：{item.btName}</Row>
                  <Row>联系人名：{item.linkName}</Row>
                  <Row>联系人电话：{item.linkPhone}</Row>
                </Card>
              </List.Item>
            )}
          />
          <Pagination defaultCurrent={businessList.pageNum} total={businessList.total} pageSize={businessList.pageSize} style={{ float: 'right' }} onChange={this.onChangeBusiness} />
        </Card> : null}
        <Modal
          title="结算做账业务"
          visible={visible}
          onCancel={() => { this.setState({ visible: false, pay: 0 })}}
          footer={[
            <Button key="back" onClick={() => { this.setState({ visible: false, pay: 0 })}}>
              取消
            </Button>,
            <Button 
              key="submit" 
              type="primary" 
              onClick={() => {
                dispatch({
                  type: 'workspace/didPayC',
                  payload: { 
                    cid: this.state.item.cid,
                    pay: this.state.pay,
                    uid: this.state.item.uid
                  },
                })
                  .then((res) => {
                    if (res.msg === '') {
                      message.success(`'${this.state.item.name}'完成结算成功`);
                    } else {
                      message.error(res.msg)
                    }
                    this.getCusotmerList(pageNum1);
                  })
                  .catch((e) => {
                    message.error(e);
                    this.getCusotmerList(pageNum1);
                  });
                this.setState({ visible: false })
              }}
            >
              确认结算
            </Button>,
          ]}
        >
          <Row style={{ height: 30 }}>
            <Col span={8}>公司名称：</Col>
            <Col span={16}>{this.state.item.name}</Col>
          </Row>
          <Row style={{ height: 30 }}>
            <Col span={8}>共欠款金额：</Col>
            <Col span={16}>{this.state.item.debt}</Col>
          </Row>
          <Divider />
          <Row style={{ height: 30, lineHeight: '30px' }}>
            <Col span={8}>请输入本次结算的金额：</Col>
            <Col span={16}><InputNumber style={{ width: '100%' }} min={0} max={this.state.item.debt} value={this.state.pay} onChange={(value) => { this.setState({ pay: value })}} /></Col>
          </Row>
        </Modal>
      </>
    )
  }
}

export default Workspace;
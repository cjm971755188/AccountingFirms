import React, { Component } from 'react';
import { Card, List, Pagination, Row, Col, Button, Popconfirm, message, Modal, InputNumber, Divider } from 'antd';
import { connect } from 'dva';

import moment from 'moment';

@connect(({ main, user, loading }) => ({
  main,
  user,
}))
class Main extends Component {
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
      type: 'main/getCustomerList',
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
      type: 'main/getBusinessList',
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
      type: 'main/getCustomerList',
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
      type: 'main/getBusinessList',
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
    console.log(page);
    this.setState({ pageNum1: page })
    this.getCusotmerList(page)
  };

  onChangeBusiness = page => {
    console.log(page);
    this.setState({ pageNum2: page })
    this.getBusinessList(page)
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
      main: { 
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
                  title={item.name}
                  extra={
                    user.did === 1 ? <Button 
                      type='primary' 
                      icon={user.did === 1 ? 'pay-circle' : 'check'}
                      onClick={() => {
                        this.setState({ visible: true, pay: item.debt, item: item })
                      }}
                    >
                      结算
                    </Button> : 
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
                      <Button type='primary' icon={user.did === 1 ? 'pay-circle' : 'check'}>
                        确认完成
                      </Button>
                    </Popconfirm>
                  }
                >
                  <Row>
                    <Col span={8}>结算类型：</Col>
                    <Col span={16}>{item.ctName}-{item.salary}</Col>
                  </Row>
                  <Row>
                    <Col span={8}>上次结算时间：</Col>
                    <Col span={16}>{moment(item.payTime).format('YYYY-MM-DD HH:mm:ss')}</Col>
                  </Row>
                  <Row>
                    <Col span={8}>欠款总金额：</Col>
                    <Col span={16}>{item.debt}</Col>
                  </Row>
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
                  title={item.cName}
                  extra={
                    <Popconfirm
                      title="确认结算吗?"
                      onConfirm={() => {
                        dispatch({
                          type: 'main/didPayB',
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
                      <Button type='primary' icon={user.did === 1 ? 'pay-circle' : 'check'}>{user.did === 1 ? '结算' : '确认完成'}</Button>
                    </Popconfirm>
                  }
                >
                  <Row>
                    <Col span={8}>业务类型：</Col>
                    <Col span={16}>{item.btName}</Col>
                  </Row>
                  <Row>
                    <Col span={8}>联系人名：</Col>
                    <Col span={16}>{item.linkName}</Col>
                  </Row>
                  <Row>
                    <Col span={8}>联系人电话：</Col>
                    <Col span={16}>{item.linkPhone}</Col>
                  </Row>
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
                  type: 'main/didPayC',
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

export default Main;
import React, { Component } from 'react';
import { Card, Table, Button, Row, Col, Input, Select, Icon, Divider, Popconfirm, message, InputNumber, Modal } from 'antd';
import { connect } from 'dva';

import moment from 'moment';

const { Option } = Select;

@connect(({ customer, user, loading }) => ({
  customer,
  user,
  loading: loading.effects['customer/fetchList'],
}))
class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: 0,
      username: '',
      name: '',
      visible: false,
      item: {},
      pay: 0
    }
  }

  UNSAFE_componentWillMount () {
    const {
      user: { user },
      customer: {
        list: { pageSize = 10, pageNum = 1 },
        currentParameter: {
          uid = user.uid === 1 ? '' : user.uid,
          name = '',
          isAccount = 'all',
          ctid = 'all',
          credit = 'all'
        },
      },
      history: { action },
      dispatch,
    } = this.props;
    if (action !== 'POP') {
      dispatch({
        type: 'customer/reset',
      });
      dispatch({
        type: 'customer/fetchList',
        payload: {
          uid: user.uid === 1 ? '' : user.uid,
          name: '',
          isAccount: 'all',
          ctid: 'all',
          credit: 'all',
          pageNum: 1,
          pageSize,
        },
      });
      dispatch({
        type: 'customer/save',
        payload: {
          choosedName: '',
          choosedIsAccount: 'all',
          choosedCtid: 'all',
          choosedCredit: 'all'
        },
        index: 'comfirmData',
      });
    } else {
      dispatch({
        type: 'customer/fetchList',
        payload: {
          uid: user.uid === 1 ? uid : user.uid,
          name,
          isAccount,
          ctid,
          credit,
          pageNum,
          pageSize,
        },
      });
      dispatch({
        type: 'customer/save',
        payload: {
          choosedName: name,
          choosedIsAccount: isAccount,
          choosedCtid: ctid,
          choosedCredit: credit
        },
        index: 'comfirmData',
      });
    }
    dispatch({
      type: 'customer/getUsers',
      payload: {}
    })
  }

  query = () => {
    const {
      user: { user },
      customer: {
        list: { pageSize = 10, pageNum = 1 },
        currentParameter: {
          uid = user.uid === 1 ? '' : user.uid,
          name = '',
          isAccount = 'all',
          ctid = 'all',
          credit = 'all'
        },
      },
      dispatch,
    } = this.props;
    dispatch({
      type: 'customer/fetchList',
      payload: {
        uid: user.uid === 1 ? uid : user.uid,
        name,
        isAccount,
        ctid,
        credit,
        pageNum,
        pageSize,
      },
    });
    dispatch({
      type: 'customer/save',
      payload: {
        choosedName: name,
        choosedIsAccount: isAccount,
        choosedCtid: ctid,
        choosedCredit: credit
      },
      index: 'comfirmData',
    });
  };

  reset = () => {
    const { user: { user } } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/fetchList',
      payload: {
        uid: user.uid === 1 ? '' : user.uid,
        name: '',
        isAccount: 'all',
        ctid: 'all',
        credit: 'all',
        pageNum: 1,
        pageSize: 10,
      },
    });
    dispatch({
      type: 'customer/reset',
      payload: {},
    });
  };

  getColumns = () => {
    const { user: { user } } = this.props
    const { dispatch } = this.props
    const columns = [
      { title: '税号', dataIndex: 'ID', key: 'ID' },
      { title: '客户公司名称', dataIndex: 'name', key: 'name' },
      { title: '结算类型', dataIndex: 'ctName', key: 'ctName' },
      { title: '结算酬金', dataIndex: 'salary', key: 'salary' },
      { title: '联系人', dataIndex: 'linkName', key: 'linkName' },
      { title: '联系电话', dataIndex: 'linkPhone', key: 'linkPhone' },
      { title: '是否做账', dataIndex: 'isAccount', key: 'isAccount' },
      { title: '负责会计', dataIndex: 'uName', key: 'uName' },
      { 
        title: '最近结算时间',
        render: record => {
          if (record.payTime) {
            return <span>{moment(record.payTime).format('YYYY-MM-DD')}</span>
          }
          return null
        }
      },
      { 
        title: '做账状态', 
        render: record => {
          if (record.progress === '已完成') {
            return (
              <Row>
                <Icon type="check-circle" theme="twoTone" twoToneColor="#43CD80" />
                <span style={{ marginLeft: '8px' }}>{record.progress}</span>
              </Row>
            )
          } else if (record.progress === '未完成') {
            return (
              <Row>
                <Icon type="info-circle" theme="twoTone" twoToneColor="#FFD700" />
                <span style={{ marginLeft: '8px' }}>{record.progress}</span>
              </Row>
            )
          } else if (record.progress === '已超时') {
            return (
              <Row>
                <Icon type="clock-circle" theme="twoTone" twoToneColor="#CD3333" />
                <span style={{ marginLeft: '8px' }}>{record.progress}</span>
              </Row>
            )
          }
        }
      },
      { 
        title: '信用状态', 
        render: record => {
          if (record.count === 0) {
            return (
              <Row>
                <Icon type="smile" theme="twoTone" twoToneColor="#43CD80" />
                <span style={{ marginLeft: '8px' }}>正常</span>
              </Row>
            )
          }
          return (
            <Row>
              <Icon type="frown" theme="twoTone" twoToneColor="#CD3333" />
              <span style={{ marginLeft: '8px' }}>欠款{record.count}元</span>
            </Row>
          )
        }
      },
      {
        title: '操作',
        width: '20%',
        render: (text, record) => (
          <>
            <span 
              className='spanToa' 
              onClick={() => { 
                this.props.history.push({
                  pathname: '/home/customer/detail',
                  state: { cid: record.cid }
                })
              }}
            >
              查看详情
            </span>
            <Divider type="vertical" />
            <span 
              className='spanToa' 
              onClick={() => { 
                this.props.history.push({
                  pathname: '/home/customer/edit',
                  state: { flag: 'edit', record: record }
                })
              }}
            >
              修改信息
            </span>
            {record.progress !== '已完成' ? <>
            <Divider type="vertical" />
            <Popconfirm
              title="该公司本月的做账确认完成么？"
              cancelText="取消"
              okText="确认"
              onConfirm={() => {
                dispatch({
                  type: 'customer/didComplete',
                  payload: { cid: record.cid },
                })
                  .then((res) => {
                    if (res.msg === '') {
                      message.success(`'${record.name}'做账完成`);
                    } else {
                      message.error(res.msg)
                    }
                    this.query();
                  })
                  .catch((e) => {
                    message.error(e);
                    this.query();
                  });
              }}
            >
              <span className='spanToa'>做账完成</span>
            </Popconfirm></> : null}
            {record.count > 0 && user.did === 1 ? <>
            <Divider type="vertical" />
            <span className='spanToa' onClick={() => { this.setState({ visible: true, item: record, pay: record.count }) }}>确认结算</span></> : null}
            {user.did === 1 && record.progress === '已完成' && record.count === 0 ?  <><Divider type="vertical" />
            <Popconfirm
              title="确认将该客户公司删除么？"
              cancelText="取消"
              okText="确认"
              onConfirm={() => {
                dispatch({
                  type: 'customer/del',
                  payload: { cid: record.cid },
                })
                  .then((res) => {
                    if (res.msg === '') {
                      message.success(`'${record.name}'删除成功`);
                    } else {
                      message.error(res.msg)
                    }
                    this.query();
                  })
                  .catch((e) => {
                    message.error(e);
                    this.query();
                  });
              }}
            >
              <span className='spanToa'>删除</span>
            </Popconfirm></> : null}
          </>
        )
      }
    ]
    if (user.did !== 1) {
      columns.splice(6,2)
    }
    return columns;
  };

  handleTableChange = (pagination, filters, sorter) => {
    const {
      user: { user },
      customer: {
        choosedName = '',
        choosedIsAccount = 'all',
        choosedCtid = 'all',
        choosedCredit = 'all'
      },
      dispatch,
    } = this.props;
    const payload = {
      uid: user.uid === 1 ? '' : user.uid,
      name: choosedName && (choosedName.trim() || null),
      isAccount: choosedIsAccount,
      ctid: choosedCtid,
      credit: choosedCredit,
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    };
    dispatch({
      type: 'customer/fetchList',
      payload,
    });
  };

  render () {
    const { 
      user: { user },
      customer: { 
        list: { 
          data = [], 
          pageSize, 
          pageNum, 
          total 
        },
        currentParameter: {
          name, isAccount, ctid, credit
        },
        customerTypes: { customerTypes = [] },
      }, 
      loading,
      dispatch
    } = this.props;
    return (
      <>
      <Card>
        <Row gutter={[48, 16]} className='searchBox'>
          <Col span={8}>
            <span>公司名称</span>
            <Input
              style={{ width: '100%' }}
              placeholder="请输入公司名称"
              onChange={value => {
                dispatch({
                  type: 'customer/save',
                  payload: { name: value.target.value },
                  index: 'currentParameter',
                });
              }}
              value={name}
              onPressEnter={() => { this.query() }}
            />
          </Col>
          {user.did === 1 ? <Col span={8}>
            <span>是否做账</span>
            <Select 
              defaultValue="all" 
              style={{ width: '100%' }}
              onChange={value => {
                dispatch({
                  type: 'customer/save',
                  payload: { isAccount: value },
                  index: 'currentParameter',
                });
              }}
              value={isAccount}
            >
              <Option value="all">全部</Option>
              <Option value='是'>是</Option>
              <Option value='否'>否</Option>
            </Select>
          </Col> : null}
          <Col span={8}>
            <span>结算类型</span>
            <Select 
              defaultValue="all" 
              style={{ width: '100%' }}
              onChange={value => {
                dispatch({
                  type: 'customer/save',
                  payload: { ctid: value },
                  index: 'currentParameter',
                });
              }}
              onFocus={() => {
                dispatch({
                  type: 'customer/getCustomerTypes',
                  payload: {}
                })
              }}
              value={ctid}
            >
              <Option value="all">全部</Option>
              {customerTypes && customerTypes.map((value, key) => {
                return <Option value={value.ctid} key={value.ctid}>{value.name}</Option>
              })}
            </Select>
          </Col>
          <Col span={8}>
            <span>信用状态</span>
            <Select 
              defaultValue="all" 
              style={{ width: '100%' }}
              onChange={value => {
                dispatch({
                  type: 'customer/save',
                  payload: { credit: value },
                  index: 'currentParameter',
                });
              }}
              value={credit}
            >
              <Option value="all">全部</Option>
              <Option value="正常">正常</Option>
              <Option value="欠款">欠款</Option>
            </Select>
          </Col>
          <Col span={8}>
            <div className="btnContainer">
              <Button type="primary" onClick={this.query}>搜索</Button>
              <Button type="default" onClick={() => { this.reset() }}>重置</Button>
            </div>
          </Col>
        </Row>
      </Card>
      <br/>
      <Card 
        title='客户列表'
        extra={
          user.did === 1 ? <Button
            icon="plus"
            type="primary"
            onClick={() => { 
              this.props.history.push({
                pathname: '/home/customer/create',
                state: { flag: 'create', record: null }
              })
            }}
          >
            添加客户
          </Button> : null
        }
      >
        <Table
          bordered
          loading={loading}
          rowKey={row => row.cid}
          dataSource={data}
          columns={this.getColumns()}
          pagination={{ total, pageSize, current: pageNum }}
          onChange={this.handleTableChange}
        />
        <Modal
          title="结算做账业务"
          visible={this.state.visible}
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
                  },
                })
                  .then((res) => {
                    if (res.msg === '') {
                      message.success(`'${this.state.item.name}'完成做账成功`);
                    } else {
                      message.error(res.msg)
                    }
                    this.query();
                  })
                  .catch((e) => {
                    message.error(e);
                    this.query();
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
            <Col span={16}>{this.state.item.count}</Col>
          </Row>
          <Divider />
          <Row style={{ height: 30, lineHeight: '30px' }}>
            <Col span={8}>请输入本次结算的金额：</Col>
            <Col span={16}><InputNumber style={{ width: '100%' }} min={0} max={this.state.item.count} value={this.state.pay} onChange={(value) => { this.setState({ pay: value })}} /></Col>
          </Row>
        </Modal>
      </Card>
      </>
    )
  }
}

export default Customer;
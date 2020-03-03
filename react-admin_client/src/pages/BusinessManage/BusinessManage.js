import React, { Component } from 'react';
import { Card, Popconfirm, Table, Divider, Button, Row, Col, Input, Icon, message, Select } from 'antd';
import { connect } from 'dva';

const { Option } = Select;

@connect(({ businessManage, loading }) => ({
  businessManage,
  loading: loading.effects['businessManage/fetchList'],
}))
class BusinessManage extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  UNSAFE_componentWillMount () {
    const {
      businessManage: {
        list: { pageSize = 10, pageNum = 0 },
        currentParameter: {
          btid = '',
          accountant = '',
          customer = '',
          type = 'all',
          state = 'all'
        },
      },
      history: { action },
      dispatch,
    } = this.props;
    const payload = {
      btid,
      accountant,
      customer,
      type: type === 'all' ? null : type,
      state: state === 'all' ? null : state,
      pageNum,
      pageSize,
    };
    if (action !== 'POP') {
      dispatch({
        type: 'businessManage/reset',
      });
      dispatch({
        type: 'businessManage/fetchList',
        payload: {
          btid: null,
          accountant: null,
          customer: null,
          type: null,
          state: null,
          pageNum: 0,
          pageSize,
        },
      });
      dispatch({
        type: 'businessManage/save',
        payload: {
          choosedBtid: '',
          choosedAccountant: '',
          choosedCustomer: '',
          choosedType: 'all',
          choosedState: 'all'
        },
        index: 'comfirmData',
      });
    } else {
      dispatch({
        type: 'businessManage/fetchList',
        payload,
      });
      dispatch({
        type: 'businessManage/save',
        payload: {
          choosedBtid: btid,
          choosedAccountant: accountant,
          choosedCustomer: customer,
          choosedType: type,
          choosedState: state
        },
        index: 'comfirmData',
      });
    }
    dispatch({
      type: 'businessManage/getBusinessTypes',
      payload: {}
    })
  }

  query = () => {
    const {
      businessManage: {
        list: { pageSize = 10, pageNum = 0 },
        currentParameter: {
          btid = '',
          accountant = '',
          customer = '',
          type = 'all',
          state = 'all'
        },
      },
      dispatch,
    } = this.props;
    const payload = {
      btid,
      accountant,
      customer,
      type: type === 'all' ? null : type,
      state: state === 'all' ? null : state,
      pageNum,
      pageSize,
    };
    dispatch({
      type: 'businessManage/fetchList',
      payload,
    });
    dispatch({
      type: 'businessManage/save',
      payload: {
        choosedBtid: btid,
        choosedAccountant: accountant,
        choosedCustomer: customer,
        choosedType: type,
        choosedState: state
      },
      index: 'comfirmData',
    });
  };

  getColumns = () => {
    const { dispatch } = this.props
    const columns = [
      { title: '编号', dataIndex: 'bid', key: 'bid' },
      { title: '业务类型', dataIndex: 'type', key: 'type' },
      { title: '税号', dataIndex: 'cID', key: 'cID' },
      { title: '公司名称', dataIndex: 'name', key: 'name' },
      { title: '联系人', dataIndex: 'linkName', key: 'linkName' },
      { title: '联系方式', dataIndex: 'linkPhone', key: 'linkPhone' },
      { title: '联系人身份证号', dataIndex: 'linkID', key: 'linkID' },
      { title: '开始时间', dataIndex: 'startTime', key: 'startTime' },
      { title: '结束时间', dataIndex: 'endTime', key: 'endTime' },
      { title: '酬金', dataIndex: 'salary', key: 'salary' },
      { title: '负责人', dataIndex: 'aName', key: 'aName' },
      { 
        title: '状态', 
        render: record => {
          if (record.state === '已结束') {
            return (
              <Row>
                <Icon type="check-circle" theme="twoTone" twoToneColor="#43CD80" />
                <span style={{ marginLeft: '8px' }}>{record.state}</span>
              </Row>
            )
          } else if (record.state === '未结算') {
            return (
              <Row>
                <Icon type="info-circle" theme="twoTone" twoToneColor="#CD3333" />
                <span style={{ marginLeft: '8px' }}>{record.state}</span>
              </Row>
            )
          }
          return (
            <Row>
              <Icon type="clock-circle" theme="twoTone" twoToneColor="#FFD700" />
              <span style={{ marginLeft: '8px' }}>{record.state}</span>
            </Row>
          )
        }
      },
      {
        title: '操作',
        width: '15%',
        render: (text, record) => (
          <>
            {record.state === '办理中' ? <><Popconfirm
              title="确认该业务已经办理完成么？"
              cancelText="取消"
              okText="确认"
              onConfirm={() => {
                dispatch({
                  type: 'businessManage/didSuccess',
                  payload: {},
                })
                  .then((res) => {
                    message.success(`业务编号'${record.bid}'办理确认完成成功`);
                  })
                  .catch(() => {
                    message.error(`业务编号'${record.bid}'办理确认完成失败`);
                  });
              }}
            >
              <span className='spanToa'>确认完成</span>
            </Popconfirm>
            <Divider type="vertical" /></> : null}
            {record.state === '未结算' ? <><Popconfirm
              title="确认该业务已经结算完成么？"
              cancelText="取消"
              okText="确认"
              onConfirm={() => {
                dispatch({
                  type: 'businessManage/didPay',
                  payload: {},
                })
                  .then((res) => {
                    message.success(`业务编号'${record.bid}'结算成功`);
                  })
                  .catch(() => {
                    message.error(`业务编号'${record.bid}'结算失败`);
                  });
              }}
            >
              <span className='spanToa'>确认结算</span>
            </Popconfirm>
            <Divider type="vertical" /></> : null}
            <Popconfirm
              icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
              title="确认删除该业务么？"
              cancelText="取消"
              okText="确认"
              onConfirm={() => {
                dispatch({
                  type: 'businessManage/del',
                  payload: {},
                })
                  .then(() => {
                    message.success(`'${record.name}'的'${record.type}'业务删除成功`);
                  })
                  .catch(() => {
                    message.error(`'${record.name}'的'${record.type}'业务辞退失败`);
                  });
              }}
            >
              <span className='spanToa'>删除</span>
            </Popconfirm>
          </>
        )
      }
    ]
    return columns;
  };

  handleTableChange = (pagination, filters, sorter) => {
    const {
      businessManage: {
        choosedBtid = '',
        choosedAccountant = '',
        choosedCustomer = '',
        choosedType = 'all',
        choosedState = 'all'
      },
      dispatch,
    } = this.props;
    const payload = {
      btid: choosedBtid && (choosedBtid.trim() || null),
      accountant: choosedAccountant && (choosedAccountant.trim() || null),
      customer: choosedCustomer && (choosedCustomer.trim() || null),
      type: choosedType === 'all' ? null : choosedType,
      state: choosedState === 'all' ? null : choosedState,
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    };
    dispatch({
      type: 'businessManage/fetchList',
      payload,
    });
  };

  render () {
    const { 
      businessManage: { 
        list: { 
          data = [], 
          pageSize, 
          current, 
          total 
        },
        currentParameter: {
          id, accountant, customer, type, state
        },
        businessTypes: { types }
      }, 
      loading,
      dispatch
    } = this.props;
    return (
      <>
      <Card>
        <Row gutter={[48, 16]} className='searchBox'>
          <Col span={8}>
            <span>业务编号</span>
            <Input
              style={{ width: '100%' }}
              placeholder="请输入业务编号"
              onChange={value => {
                dispatch({
                  type: 'businessManage/save',
                  payload: { id: value.target.value },
                  index: 'currentParameter',
                });
              }}
              value={id}
              onPressEnter={() => { this.query() }}
            />
          </Col>
          <Col span={8}>
            <span>负责员工</span>
            <Input
              style={{ width: '100%' }}
              placeholder="请输入员工姓名"
              onChange={value => {
                dispatch({
                  type: 'businessManage/save',
                  payload: { accountant: value.target.value },
                  index: 'currentParameter',
                });
              }}
              value={accountant}
              onPressEnter={() => { this.query() }}
            />
          </Col>
          <Col span={8}>
            <span>公司名称</span>
            <Input
              style={{ width: '100%' }}
              placeholder="请输入客户公司名称"
              onChange={value => {
                dispatch({
                  type: 'businessManage/save',
                  payload: { customer: value.target.value },
                  index: 'currentParameter',
                });
              }}
              value={customer}
              onPressEnter={() => { this.query() }}
            />
          </Col>
        </Row>
        <Row gutter={[48, 16]} className='searchBox'>
          <Col span={8}>
            <span>业务类型</span>
            <Select 
              defaultValue="all" 
              style={{ width: '100%' }}
              onChange={value => {
                dispatch({
                  type: 'businessManage/save',
                  payload: { type: value },
                  index: 'currentParameter',
                });
              }}
              value={type}
            >
              <Option value="all">全部</Option>
              {types && types.map((value, key) => {
                return <Option value={value.btid} key={value.btid}>{value.name}</Option>
              })}
            </Select>
          </Col>
          <Col span={8}>
            <span>业务状态</span>
            <Select 
              defaultValue="all" 
              style={{ width: '100%' }}
              onChange={value => {
                dispatch({
                  type: 'businessManage/save',
                  payload: { state: value },
                  index: 'currentParameter',
                });
              }}
              value={state}
            >
              <Option value="all">全部</Option>
              <Option value='进行中'>进行中</Option>
              <Option value='未结算'>未结算</Option>
              <Option value='已结束'>已结束</Option>
            </Select>
          </Col>
          <Col span={8}>
            <div className="btnContainer">
              <Button type="primary" onClick={this.query}>搜索</Button>
              <Button
                type="default"
                onClick={() => {
                  dispatch({
                    type: 'businessManage/reset',
                  });
                  this.query()
                }}
              >
                重置
              </Button>
            </div>
          </Col>
        </Row>  
      </Card>
      <br/>
      <Card 
        title='业务列表'
        extra={
          <>
            <Button
              icon="gift"
              style={{ marginRight: 8 }}
              onClick={() => { this.props.history.push('/home/BusinessManage/help') }}
            >
              业务指南
            </Button>
              <Button
              icon="plus"
              type="primary"
              onClick={() => { this.props.history.push('/home/BusinessManage/create') }}
            >
              添加业务
            </Button>
          </>
        }
      >
        <Table
          bordered
          loading={loading}
          rowKey={row => row.bid}
          dataSource={data}
          columns={this.getColumns()}
          pagination={{ total, pageSize, current }}
          onChange={this.handleTableChange}
        />
      </Card>
      </>
    )
  }
}

export default BusinessManage;
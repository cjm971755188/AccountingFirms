import React, { Component } from 'react';
import { Card, Table, Button, Row, Col, Input, Select, Icon, Divider, Popconfirm, message, Modal } from 'antd';
import { connect } from 'dva';

const { Option } = Select;

@connect(({ customerManage, loading }) => ({
  customerManage,
  loading: loading.effects['customerManage/fetchList'],
}))
class CustomerManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allotVisible: false,
      allotUid: '',
      allotName: ''
    }
  }

  UNSAFE_componentWillMount () {
    const {
      customerManage: {
        list: { pageSize = 10, pageNum = 0 },
        currentParameter: {
          name = '',
          makeAccount = 'all',
          type = 'all',
          state = 'all'
        },
      },
      history: { action },
      dispatch,
    } = this.props;
    const payload = {
      name,
      makeAccount: makeAccount === 'all' ? null : makeAccount,
      type: type === 'all' ? null : type,
      state: state === 'all' ? null : state,
      pageNum,
      pageSize,
    };
    if (action !== 'POP') {
      dispatch({
        type: 'customerManage/reset',
      });
      dispatch({
        type: 'customerManage/fetchList',
        payload: {
          name: null,
          makeAccount: null,
          type: null,
          state: null,
          pageNum: 0,
          pageSize,
        },
      });
      dispatch({
        type: 'customerManage/save',
        payload: {
          choosedName: '',
          choosedMakeAccount: 'all',
          choosedType: 'all',
          choosedState: 'all'
        },
        index: 'comfirmData',
      });
    } else {
      dispatch({
        type: 'customerManage/fetchList',
        payload,
      });
      dispatch({
        type: 'customerManage/save',
        payload: {
          choosedName: name,
          choosedMakeAccount: makeAccount,
          choosedType: type,
          choosedState: state
        },
        index: 'comfirmData',
      });
    }
    dispatch({
      type: 'customerManage/getAccountTypes',
      payload: {},
    });
  }

  query = () => {
    const {
      customerManage: {
        list: { pageSize = 10, pageNum = 0 },
        currentParameter: {
          name = '',
          makeAccount = 'all',
          type = 'all',
          state = 'all'
        },
      },
      dispatch,
    } = this.props;
    const payload = {
      name,
      makeAccount: makeAccount === 'all' ? null : makeAccount,
      type: type === 'all' ? null : type,
      state: state === 'all' ? null : state,
      pageNum,
      pageSize,
    };
    dispatch({
      type: 'customerManage/fetchList',
      payload,
    });
    dispatch({
      type: 'customerManage/save',
      payload: {
        choosedName: name,
        choosedMakeAccount: makeAccount,
        choosedType: type,
        choosedState: state
      },
      index: 'comfirmData',
    });
  };

  getColumns = () => {
    const { dispatch } = this.props
    const columns = [
      { title: '税号', dataIndex: 'cID', key: 'cID' },
      { title: '客户公司名称', dataIndex: 'name', key: 'name' },
      { title: '结算类型', dataIndex: 'type', key: 'type' },
      { title: '结算酬金', dataIndex: 'salary', key: 'salary' },
      { title: '是否做账', dataIndex: 'makeAccount', key: 'makeAccount' },
      { title: '负责会计', dataIndex: 'aName', key: 'aName' },
      { 
        title: '信用状态', 
        render: record => {
          if (record.state) {
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
              <span style={{ marginLeft: '8px' }}>欠款</span>
            </Row>
          )
        }
      },
      {
        title: '操作',
        width: '30%',
        render: (text, record) => (
          <>
            <span 
              className='spanToa' 
              onClick={() => { 
                this.props.history.push({
                  pathname: '/home/customerManage/detail',
                  query: { cid: record.cid }
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
                  pathname: '/home/customerManage/edit',
                  query: { flag: 'edit', record: record }
                })
              }}
            >
              修改信息
            </span>
            <Divider type="vertical" />
            {record.makeAccount === '是' ? <><span 
              className='spanToa' 
              onClick={() => {
                dispatch({
                  type: 'customerManage/getAccountants',
                  payload: {},
                })
                this.setState({
                  allotVisible: true,
                  allotUid: record.aid === null ? '' : record.aid,
                  allotName: record.aName === '暂无' ? '' : record.aName,
                })
              }}
            >
              {record.aid === null ? '分配会计' : '更换会计'}
            </span>
            <Divider type="vertical" /></> : null}
            {record.state ? null : <><Popconfirm
              title="该公司确认已经结算完成么？"
              cancelText="取消"
              okText="确认"
              onConfirm={() => {
                dispatch({
                  type: 'customerManage/didPay',
                  payload: {},
                })
                  .then((res) => {
                    message.success(`'${record.name}'结算成功`);
                  })
                  .catch(() => {
                    message.error(`'${record.name}'结算失败`);
                  });
              }}
            >
              <span className='spanToa'>确认结算</span>
            </Popconfirm>
            <Divider type="vertical" /></>}
            <Popconfirm
              title="确认将该客户公司删除么？"
              cancelText="取消"
              okText="确认"
              onConfirm={() => {
                dispatch({
                  type: 'customerManage/del',
                  payload: {},
                })
                  .then((res) => {
                    message.success(`'${record.name}'删除成功`);
                  })
                  .catch(() => {
                    message.error(`'${record.name}'删除失败`);
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
      customerManage: {
        choosedName = '',
        choosedMakeAccount = 'all',
        choosedType = 'all',
        choosedState = 'all'
      },
      dispatch,
    } = this.props;
    const payload = {
      name: choosedName && (choosedName.trim() || null),
      makeAccount: choosedMakeAccount === 'all' ? null : choosedMakeAccount,
      type: choosedType === 'all' ? null : choosedType,
      state: choosedState === 'all' ? null : choosedState,
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    };
    dispatch({
      type: 'customerManage/fetchList',
      payload,
    });
  };

  allot = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'customerManage/allot',
      payload: {},
    })
      .then((res) => {
        if (res.code === 200) {
          message.success('分配会计成功！')
          this.setState({ allotVisible: false, allotUid: '', allotName: '' })
        }
      })
  }

  render () {
    const { 
      customerManage: { 
        list: { 
          data = [], 
          pageSize, 
          current, 
          total 
        },
        currentParameter: {
          name, makeAccount, type, state
        },
        accountTypes: { accountTypes = [] },
        accountants: { accountants = [] }
      }, 
      loading,
      dispatch
    } = this.props;
    const { allotName } = this.state
    return (
      <>
      <Card>
        <Row gutter={[48, 16]} className='searchBox'>
          <Col span={8}>
            <span>公司名称</span>
            <Input
              style={{ width: '100%' }}
              placeholder="请输入业务编号"
              onChange={value => {
                dispatch({
                  type: 'customerManage/save',
                  payload: { name: value.target.value },
                  index: 'currentParameter',
                });
              }}
              value={name}
              onPressEnter={() => { this.query() }}
            />
          </Col>
          <Col span={8}>
            <span>是否做账</span>
            <Select 
              defaultValue="all" 
              style={{ width: '100%' }}
              onChange={value => {
                dispatch({
                  type: 'customerManage/save',
                  payload: { makeAccount: value },
                  index: 'currentParameter',
                });
              }}
              value={makeAccount}
            >
              <Option value="all">全部</Option>
              <Option value='是'>是</Option>
              <Option value='否'>否</Option>
            </Select>
          </Col>
          <Col span={8}>
            <span>结算类型</span>
            <Select 
              defaultValue="all" 
              style={{ width: '100%' }}
              onChange={value => {
                dispatch({
                  type: 'customerManage/save',
                  payload: { type: value },
                  index: 'currentParameter',
                });
              }}
              value={type}
            >
              <Option value="all">全部</Option>
              {accountTypes && accountTypes.map((value, key) => {
                return <Option value={value.name} key={value.atid}>{value.name}</Option>
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
                  type: 'customerManage/save',
                  payload: { state: value },
                  index: 'currentParameter',
                });
              }}
              value={state}
            >
              <Option value="all">全部</Option>
              <Option value={true}>正常</Option>
              <Option value={false}>欠款</Option>
            </Select>
          </Col>
          <Col span={8}>
            <div className="btnContainer">
              <Button type="primary" onClick={this.query}>搜索</Button>
              <Button
                type="default"
                onClick={() => {
                  dispatch({
                    type: 'customerManage/reset',
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
        title='客户列表'
        extra={
          <Button
            icon="plus"
            type="primary"
            onClick={() => { 
              this.props.history.push({
                pathname: '/home/customerManage/create',
                query: { flag: 'create', record: null }
              })
            }}
          >
            添加客户
          </Button>
        }
      >
        <Table
          bordered
          loading={loading}
          rowKey={row => row.cid}
          dataSource={data}
          columns={this.getColumns()}
          pagination={{ total, pageSize, current }}
          onChange={this.handleTableChange}
        />
        <Modal
          title="分配会计"
          visible={this.state.allotVisible}
          onOk={this.allot}
          onCancel={() => { this.setState({ allotVisible: false }) }}
          okText="确认"
          cancelText="取消"
        >
          <Row>
            <span>负责的会计：</span>
            <Select 
              style={{ width: '80%' }}
              onChange={(value, key) => {
                this.setState({ allotName: value, allotUid: key.key })
              }}
              value={allotName}
            >
              {accountants && accountants.map((value, key) => {
                return <Option value={value.name} key={value.aid}>{value.name}</Option>
              })}
            </Select>
          </Row>
        </Modal>
      </Card>
      </>
    )
  }
}

export default CustomerManage;
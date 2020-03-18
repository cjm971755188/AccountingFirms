import React, { Component } from 'react';
import { Card, Table, Divider, Button, Row, Col, Input, Icon, message, Modal, Select } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

const { Option } = Select;
const { confirm } = Modal;

@connect(({ account, loading }) => ({
  account,
  loading: loading.effects['account/fetchList'],
}))
class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      permissionsVisible: false,
      permissionsId: '',
      permissionsName: ''
    }
  }

  UNSAFE_componentWillMount () {
    const {
      account: {
        list: { pageSize = 10, pageNum = 1 },
        currentParameter: {
          username = '',
          name = '',
          did = 'all',
          pType = 'all',
          state = 'all'
        },
      },
      history: { action },
      dispatch,
    } = this.props;
    if (action !== 'POP') {
      dispatch({
        type: 'account/reset',
      });
      dispatch({
        type: 'account/fetchList',
        payload: {
          username: '',
          name: '',
          did: 'all',
          pType: 'all',
          state: 'all',
          pageNum: 1,
          pageSize,
        },
      });
      dispatch({
        type: 'account/save',
        payload: {
          choosedUsername: '',
          choosedName: '',
          choosedDid: 'all',
          choosedPType: 'all',
          choosedState: 'all',
        },
        index: 'comfirmData',
      });
    } else {
      dispatch({
        type: 'account/fetchList',
        payload: {
          username,
          name,
          did,
          pType,
          state,
          pageNum,
          pageSize,
        },
      });
      dispatch({
        type: 'account/save',
        payload: {
          choosedUsername: username,
          choosedName: name,
          choosedDid: did,
          choosedPType: pType,
          choosedState: state,
        },
        index: 'comfirmData',
      });
    }
  }

  query = () => {
    const {
      account: {
        list: { pageSize = 10, pageNum = 1 },
        currentParameter: {
          username = '',
          name = '',
          did = 'all',
          pType = 'all',
          state = 'all'
        },
      },
      dispatch,
    } = this.props;
    dispatch({
      type: 'account/fetchList',
      payload: {
        username,
        name,
        did,
        pType,
        state,
        pageNum,
        pageSize,
      },
    });
    dispatch({
      type: 'account/save',
      payload: {
        choosedUsername: username,
        choosedName: name,
        choosedDid: did,
        choosedPType: pType,
        choosedState: state,
      },
      index: 'comfirmData',
    });
  };

  reset = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'account/fetchList',
      payload: { 
        username: '',
        name: '',
        did: 'all',
        pType: 'all',
        state: 'all',
        pageNum: 1,
        pageSize: 10
      },
    });
    dispatch({
      type: 'account/reset',
    })
  };

  getColumns = () => {
    const { dispatch } = this.props
    const columns = [
      { title: '编号', dataIndex: 'uid', key: 'uid' },
      { title: '工号', dataIndex: 'username', key: 'username' },
      { title: '姓名', dataIndex: 'name', key: 'name' },
      { title: '联系方式', dataIndex: 'phone', key: 'phone' },
      { 
        title: '入职时间', 
        render: record => {
          if (record.startTime) {
            return <span>{moment(record.startTime).format('YYYY-MM-DD')}</span>
          }
          return null
        }
      },
      { title: '部门职位', dataIndex: 'dName', key: 'dName' },
      { title: '权限类型', dataIndex: 'pType', key: 'pType' },
      { 
        title: '状态', 
        render: (text, record) => {
          if (record && record.state === 'unlock') {
            return (
              <>
                <Icon type="unlock" theme="twoTone" twoToneColor="#43CD80" />
                <span style={{ marginLeft: 8 }}>未锁定</span>
              </>
            )
          } else {
            return (
              <>
                <Icon type="lock" theme="twoTone" twoToneColor="#CD3333" />
                <span style={{ marginLeft: 8 }}>已锁定</span>
              </>
            )
          }
        }
      },
      {
        title: '操作',
        width: '20%',
        render: (text, record) => {
          if (record && record.did === 0) {
            return null
          } else {
            return (
            <>
            <span 
              className='spanToa' 
              onClick={() => { 
                this.props.history.push({
                  pathname: '/home/account/changePermissions',
                  state: { record }
                })
              }}
            >
              修改权限
            </span>
            <Divider type="vertical" />
            <span 
              className='spanToa' 
              onClick={() => { 
                const that = this
                return (
                  confirm({
                    title: '确认重置该账号的密码么？',
                    icon: <Icon type="question-circle-o" style={{ color: 'red' }} />,
                    content: '注：重置密码为123456',
                    okText: '确认重置',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk() {
                      dispatch({
                        type: 'account/resetPassWord',
                        payload: { uid: record.uid },
                      })
                        .then((res) => {
                          if (res.msg === '') {
                            message.success(`员工'${record.name}'的密码重置成功`);
                          } else {
                            message.error(res.msg)
                          }
                          that.query();
                        })
                        .catch((e) => {
                          message.error(e);
                          that.query();
                        });
                    },
                    onCancel() {},
                  })
                )
              }}
            >
              重置密码
            </span>
            <Divider type="vertical" />
            {record.state === 'lock' ? <span 
              className='spanToa' 
              onClick={() => { 
                const that = this
                return (
                  confirm({
                    title: '确认解锁该账号么？',
                    icon: <Icon type="question-circle-o" style={{ color: 'red' }} />,
                    content: '注：解锁后，该账号即可登录本系统进行账号权限内的相关操作，请谨慎',
                    okText: '确认解锁',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk() {
                      dispatch({
                        type: 'account/lockOrUnlock',
                        payload: { flag: 'unlock', uid: record.uid },
                      })
                        .then((res) => {
                          if (res.msg === '') {
                            message.success(`员工'${record.name}'的账号解锁成功`);
                          } else {
                            message.error(res.msg)
                          }
                          that.query();
                        })
                        .catch((e) => {
                          message.error(e);
                          that.query();
                        });
                    },
                    onCancel() {},
                  })
                )
              }}
            >
              解锁
            </span> : 
            <span 
              className='spanToa' 
              onClick={() => { 
                const that = this
                return (
                  confirm({
                    title: '确认锁定该账号么？',
                    icon: <Icon type="question-circle-o" style={{ color: 'red' }} />,
                    content: '注：锁定后，该账号将无法登录本系统，请谨慎',
                    okText: '确认锁定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk() {
                      dispatch({
                        type: 'account/lockOrUnlock',
                        payload: { flag: 'lock', uid: record.uid },
                      })
                        .then((res) => {
                          if (res.msg === '') {
                            message.success(`员工'${record.name}'的账号锁定成功`);
                          } else {
                            message.error(res.msg)
                          }
                          that.query();
                        })
                        .catch((e) => {
                          message.error(e);
                          that.query();
                        });
                    },
                    onCancel() {},
                  })
                )
              }}
            >
              锁定
            </span>}
          </>)  
          }
        }
      }
    ]
    return columns;
  };

  handleTableChange = (pagination, filters, sorter) => {
    const {
      account: {
        choosedUsername = '',
        choosedName = '',
        choosedDid = 'all',
        choosedPType = 'all',
        choosedState = 'all',
      },
      dispatch,
    } = this.props;
    const payload = {
      username: choosedUsername && (choosedUsername.trim() || null),
      name: choosedName && (choosedName.trim() || null),
      did: choosedDid,
      pType: choosedPType,
      state: choosedState,
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    };
    dispatch({
      type: 'account/fetchList',
      payload,
    });
  };

  render () {
    const { 
      account: { 
        list: { 
          data = [], 
          pageSize, 
          pageNum, 
          total 
        },
        currentParameter: {
          username, name, did, pType, state
        },
        departments: { departments }
      }, 
      loading,
      dispatch
    } = this.props;
    return (
      <>
      <Card>
        <Row gutter={[48, 16]} className='searchBox'>
        <Col span={8}>
            <span>员工工号</span>
            <Input
              style={{ width: '100%' }}
              placeholder="请输入员工工号"
              onChange={value => {
                dispatch({
                  type: 'account/save',
                  payload: { username: value.target.value },
                  index: 'currentParameter',
                });
              }}
              value={username}
              onPressEnter={() => { this.query() }}
            />
          </Col>
          <Col span={8}>
            <span>员工姓名</span>
            <Input
              style={{ width: '100%' }}
              placeholder="请输入员工姓名"
              onChange={value => {
                dispatch({
                  type: 'account/save',
                  payload: { name: value.target.value },
                  index: 'currentParameter',
                });
              }}
              value={name}
              onPressEnter={() => { this.query() }}
            />
          </Col>
          <Col span={8}>
            <span>部门职位</span>
            <Select 
              defaultValue="all" 
              style={{ width: '100%' }}
              onChange={value => {
                dispatch({
                  type: 'account/save',
                  payload: { did: value },
                  index: 'currentParameter',
                });
              }}
              onFocus={() => {
                dispatch({
                  type: 'account/getDepartments',
                  payload: {}
                })
              }}
              value={did}
            >
              <Option value="all">全部</Option>
              {departments && departments.map((value, key) => {
                return <Option value={value.did} key={value.did}>{value.name}</Option>
              })}
            </Select>
          </Col>
          <Col span={8}>
            <span>权限类型</span>
            <Select 
              defaultValue="all" 
              style={{ width: '100%' }}
              onChange={value => {
                dispatch({
                  type: 'account/save',
                  payload: { pType: value },
                  index: 'currentParameter',
                });
              }}
              value={pType}
            >
              <Option value="all">全部</Option>
              <Option value="默认">默认</Option>
              <Option value="自定义">自定义</Option>
            </Select>
          </Col>
          <Col span={8}>
            <span>账号状态</span>
            <Select 
              defaultValue="all" 
              style={{ width: '100%' }}
              onChange={value => {
                dispatch({
                  type: 'account/save',
                  payload: { state: value },
                  index: 'currentParameter',
                });
              }}
              value={state}
            >
              <Option value="all">全部</Option>
              <Option value="unlock">未锁定</Option>
              <Option value="lock">已锁定</Option>
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
        title='账号列表'
        extra={
          <Button
            icon="plus"
            type="primary"
            onClick={() => { 
              this.props.history.push({
                pathname: '/home/account/create',
                state: { flag: 'create', record: null }
              })  
            }}
          >
            添加账号
          </Button>
        }
      >
        <Table
          bordered
          loading={loading}
          rowKey={row => row.uid}
          dataSource={data}
          columns={this.getColumns()}
          pagination={{ total, pageSize, current: pageNum }}
          onChange={this.handleTableChange}
        />
      </Card>
      </>
    )
  }
}

export default Account;
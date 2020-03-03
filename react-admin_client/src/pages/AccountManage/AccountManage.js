import React, { Component } from 'react';
import { Card, Popconfirm, Table, Divider, Button, Row, Col, Input, Icon, message, Modal, Select } from 'antd';
import { connect } from 'dva';

const { Option } = Select

@connect(({ accountManage, loading }) => ({
  accountManage,
  loading: loading.effects['accountManage/getList'],
}))
class AccountManage extends Component {
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
      accountManage: {
        list: { pageSize = 10, pageNum = 0 },
        currentParameter: {
          uid = '',
          name = '',
        },
      },
      history: { action },
      dispatch,
    } = this.props;
    const payload = {
      uid,
      name,
      pageNum,
      pageSize,
    };
    if (action !== 'POP') {
      dispatch({
        type: 'accountManage/reset',
      });
      dispatch({
        type: 'accountManage/fetchList',
        payload: {
          uid: null,
          name: null,
          pageNum: 0,
          pageSize,
        },
      });
      dispatch({
        type: 'accountManage/save',
        payload: {
          choosedUid: '',
          choosedName: '',
        },
        index: 'comfirmData',
      });
    } else {
      dispatch({
        type: 'accountManage/fetchList',
        payload,
      });
      dispatch({
        type: 'accountManage/save',
        payload: {
          choosedUid: uid,
          choosedName: name,
        },
        index: 'comfirmData',
      });
    }
  }

  query = () => {
    const {
      accountManage: {
        list: { pageSize = 10, pageNum = 0 },
        currentParameter: {
          uid = '',
          name = '',
        },
      },
      dispatch,
    } = this.props;
    const payload = {
      uid,
      name,
      pageNum,
      pageSize,
    };
    dispatch({
      type: 'accountManage/fetchList',
      payload,
    });
    dispatch({
      type: 'accountManage/save',
      payload: {
        choosedUid: uid,
        choosedName: name,
      },
      index: 'comfirmData',
    });
  };

  getColumns = () => {
    const { dispatch } = this.props
    const columns = [
      { title: '编号', dataIndex: 'uid', key: 'uid' },
      { title: '工号', dataIndex: 'uID', key: 'uID' },
      { title: '姓名', dataIndex: 'name', key: 'name' },
      { title: '性别', dataIndex: 'sex', key: 'sex' },
      { title: '联系方式', dataIndex: 'phone', key: 'phone' },
      { title: '入职时长', dataIndex: 'time', key: 'time' },
      { title: '部门职位', dataIndex: 'position', key: 'position' },
      { title: '权限', dataIndex: 'permissionsName', key: 'permissionsName' },
      {
        title: '操作',
        width: '30%',
        render: (text, record) => (
          <>
            <span 
              className='spanToa' 
              onClick={() => { 
                dispatch({
                  type: 'accountManage/getPermissions',
                  payload: {}
                })
                this.setState({
                  permissionsVisible: true,
                  permissionsId: record.permissionsId,
                  permissionsName: record.permissionsName
                })
              }}
            >
              修改权限
            </span>
            <Divider type="vertical" />
            <Popconfirm
              title="确认将该员工的密码重置为123456么？"
              cancelText="取消"
              okText="确认"
              onConfirm={() => {
                dispatch({
                  type: 'accountManage/resetPassWord',
                  payload: {},
                })
                  .then((res) => {
                    message.success(`'${record.name}'密码重置成功`);
                  })
                  .catch(() => {
                    message.error(`'${record.name}'密码重置失败`);
                  });
              }}
            >
              <span className='spanToa'>重置密码</span>
            </Popconfirm>
            <Divider type="vertical" />
            <Popconfirm
              icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
              title="确认删除该账号么？"
              cancelText="取消"
              okText="确认"
              onConfirm={() => {
                dispatch({
                  type: 'accountManage/del',
                  payload: {},
                })
                  .then(() => {
                    message.success(`编号'${record.uid}'账号删除成功`);
                  })
                  .catch(() => {
                    message.error(`编号'${record.uid}'账号删除失败`);
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
      accountManage: {
        choosedUid = '',
        choosedName = '',
      },
      dispatch,
    } = this.props;
    const payload = {
      uid: choosedUid && (choosedUid.trim() || null),
      name: choosedName && (choosedName.trim() || null),
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    };
    dispatch({
      type: 'accountManage/fetchList',
      payload,
    });
  };

  changePermissions = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'accountManage/changePermissions',
      payload: {},
    })
      .then((res) => {
        if (res.code === 200) {
          message.success('修改权限成功！')
          this.setState({ permissionsVisible: false, permissionsId: '', permissionsName: '' })
        }
      })
  }

  render () {
    const { 
      accountManage: { 
        list: { 
          data = [], 
          pageSize, 
          current, 
          total 
        },
        currentParameter: {
          uid, name
        },
        permissions: { permissions = []}
      }, 
      loading,
      dispatch
    } = this.props;
    const { permissionsName } = this.state
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
                  type: 'accountManage/save',
                  payload: { uid: value.target.value },
                  index: 'currentParameter',
                });
              }}
              value={uid}
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
                  type: 'accountManage/save',
                  payload: { name: value.target.value },
                  index: 'currentParameter',
                });
              }}
              value={name}
              onPressEnter={() => { this.query() }}
            />
          </Col>
          <Col span={8}>
            <div className="btnContainer">
              <Button type="primary" onClick={this.query}>搜索</Button>
              <Button
                type="default"
                onClick={() => {
                  dispatch({
                    type: 'accountManage/reset',
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
        title='账号列表'
        extra={
          <Button
            icon="plus"
            type="primary"
            onClick={() => { 
              this.props.history.push({
                pathname: '/home/accountManage/create',
                query: { flag: 'create', record: null }
              })  
            }}
          >
            添加员工
          </Button>
        }
      >
        <Table
          bordered
          loading={loading}
          rowKey={row => row.uid}
          dataSource={data}
          columns={this.getColumns()}
          pagination={{ total, pageSize, current }}
          onChange={this.handleTableChange}
        />
        <Modal
          title="修改权限"
          visible={this.state.permissionsVisible}
          onOk={this.changePermissions}
          onCancel={() => { this.setState({ permissionsVisible: false }) }}
          okText="确认"
          cancelText="取消"
        >
          <Row>
            <span>权限：</span>
            <Select 
              style={{ width: '90%' }}
              onChange={(value, key) => {
                this.setState({ permissionsName: value, permissionsId: key.key })
              }}
              value={permissionsName}
            >
              {permissions && permissions.map((value, key) => {
                return <Option value={value.name} key={value.mid}>{value.name}</Option>
              })}
            </Select>
          </Row>
        </Modal>
      </Card>
      </>
    )
  }
}

export default AccountManage;
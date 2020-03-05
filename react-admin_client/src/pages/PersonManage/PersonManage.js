import React, { Component } from 'react';
import { Card, Popconfirm, Table, Divider, Button, Row, Col, Input, Icon, message, Select } from 'antd';
import { connect } from 'dva';

const { Option } = Select;

@connect(({ personManage, loading }) => ({
  personManage,
  loading: loading.effects['personManage/getList'],
}))
class PersonManage extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  UNSAFE_componentWillMount () {
    const {
      personManage: {
        list: { pageSize = 10, pageNum = 0 },
        currentParameter: {
          username = '',
          name = '',
          position = 'all',
          state = 'all'
        },
      },
      history: { action },
      dispatch,
    } = this.props;
    const payload = {
      username,
      name,
      position: position === 'all' ? null : position,
      state: state === 'all' ? null : state,
      pageNum,
      pageSize,
    };
    if (action !== 'POP') {
      dispatch({
        type: 'personManage/reset',
      });
      dispatch({
        type: 'personManage/fetchList',
        payload: {
          username: null,
          name: null,
          position: null,
          state: null,
          pageNum: 0,
          pageSize,
        },
      });
      dispatch({
        type: 'personManage/save',
        payload: {
          choosedUsername: '',
          choosedName: '',
          choosedPosition: 'all',
          choosedState: 'all'
        },
        index: 'comfirmData',
      });
    } else {
      dispatch({
        type: 'personManage/fetchList',
        payload,
      });
      dispatch({
        type: 'personManage/save',
        payload: {
          choosedUsername: username,
          choosedName: name,
          choosedPosition: position,
          choosedState: state
        },
        index: 'comfirmData',
      });
    }
    dispatch({
      type: 'personManage/getPositions',
      payload: {}
    })
  }

  query = () => {
    const {
      personManage: {
        list: { pageSize = 10, pageNum = 0 },
        currentParameter: {
          username = '',
          name = '',
          position = 'all',
          state = 'all'
        },
      },
      dispatch,
    } = this.props;
    const payload = {
      username,
      name,
      position: position === 'all' ? null : position,
      state: state === 'all' ? null : state,
      pageNum,
      pageSize,
    };
    dispatch({
      type: 'personManage/fetchList',
      payload,
    });
    dispatch({
      type: 'personManage/save',
      payload: {
        choosedUsername: username,
        choosedName: name,
        choosedPosition: position,
        choosedState: state
      },
      index: 'comfirmData',
    });
  };

  getColumns = () => {
    const { dispatch } = this.props
    const columns = [
      { title: '工号', dataIndex: 'username', key: 'username' },
      { title: '姓名', dataIndex: 'name', key: 'name' },
      { title: '性别', dataIndex: 'sex', key: 'sex' },
      { title: '联系方式', dataIndex: 'phone', key: 'phone' },
      { title: '入职时长', dataIndex: 'time', key: 'time' },
      { title: '部门职位', dataIndex: 'position', key: 'position' },
      { 
        title: '状态', 
        render: record => {
          if (record.state) {
            return (
              <Row>
                <Icon type="carry-out" theme="twoTone" twoToneColor="#43CD80" />
                <span style={{ marginLeft: '8px' }}>在班</span>
              </Row>
            )
          }
          return (
            <Row>
              <Icon type="calendar" theme="twoTone" twoToneColor="#CD3333" />
              <span style={{ marginLeft: '8px' }}>请假</span>
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
                  pathname: '/home/personManage/detail',
                  query: {}
                })
                dispatch({
                  type: 'personManage/getDetail',
                  payload: {}
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
                  pathname: '/home/personManage/edit',
                  query: { flag: 'edit', record: record }
                })
              }}
            >
              修改信息
            </span>
            <Divider type="vertical" />
            <Popconfirm
              icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
              title="确认辞退该员工么？"
              cancelText="取消"
              okText="确认"
              onConfirm={() => {
                dispatch({
                  type: 'personManage/del',
                  payload: {},
                })
                  .then(() => {
                    message.success(`'${record.name}'辞退成功`);
                  })
                  .catch(() => {
                    message.error(`'${record.name}'辞退失败`);
                  });
              }}
            >
              <span className='spanToa'>辞退</span>
            </Popconfirm>
          </>
        )
      }
    ]
    return columns;
  };

  handleTableChange = (pagination, filters, sorter) => {
    const {
      personManage: {
        choosedUsername = '',
        choosedName = '',
        choosedPosition = 'all',
        choosedState = 'all'
      },
      dispatch,
    } = this.props;
    const payload = {
      username: choosedUsername && (choosedUsername.trim() || null),
      name: choosedName && (choosedName.trim() || null),
      position: choosedPosition === 'all' ? null : choosedPosition,
      state: choosedState === 'all' ? null : choosedState,
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    };
    dispatch({
      type: 'personManage/fetchList',
      payload,
    });
  };

  render () {
    const { 
      personManage: { 
        list: { 
          data = [], 
          pageSize, 
          current, 
          total 
        },
        currentParameter: {
          username, name, position, state
        },
        positions: { positions }
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
                  type: 'personManage/save',
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
                  type: 'personManage/save',
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
                  type: 'personManage/save',
                  payload: { position: value },
                  index: 'currentParameter',
                });
              }}
              value={position}
            >
              <Option value="all">全部</Option>
              {positions && positions.map((value, key) => {
                return <Option value={value.pid} key={value.pid}>{value.name}</Option>
              })}
            </Select>
          </Col>
          <Col span={8}>
            <span>员工状态</span>
            <Select 
              defaultValue="all" 
              style={{ width: '100%' }}
              onChange={value => {
                dispatch({
                  type: 'personManage/save',
                  payload: { state: value },
                  index: 'currentParameter',
                });
              }}
              value={state}
            >
              <Option value="all">全部</Option>
              <Option value='on'>在班</Option>
              <Option value='off'>请假</Option>
            </Select>
          </Col>
          <Col span={8}>
            <div className="btnContainer">
              <Button type="primary" onClick={this.query}>搜索</Button>
              <Button
                type="default"
                onClick={() => {
                  dispatch({
                    type: 'personManage/reset',
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
        title='员工列表'
        extra={
          <Button
            icon="plus"
            type="primary"
            onClick={() => { 
              this.props.history.push({
                pathname: '/home/personManage/create',
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
          rowKey={row => row.username}
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

export default PersonManage;
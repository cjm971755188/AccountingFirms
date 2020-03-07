import React, { Component } from 'react';
import { Card, Popconfirm, Table, Divider, Button, Row, Col, Input, Icon, message, Select } from 'antd';
import { connect } from 'dva';

const { Option } = Select;

@connect(({ person, loading }) => ({
  person,
  loading: loading.effects['person/fetchList'],
}))
class Person extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  UNSAFE_componentWillMount () {
    const {
      person: {
        list: { pageSize = 10, pageNum = 1 },
        currentParameter: {
          username = '',
          name = '',
          pid = 'all',
          absent = 'all'
        },
      },
      history: { action },
      dispatch,
    } = this.props;
    if (action !== 'POP') {
      dispatch({
        type: 'person/reset',
      });
      dispatch({
        type: 'person/fetchList',
        payload: {
          username: '',
          name: '',
          pid: 'all',
          absent: 'all',
          pageNum: 1,
          pageSize,
        },
      });
      dispatch({
        type: 'person/save',
        payload: {
          choosedUsername: '',
          choosedName: '',
          choosedPid: 'all',
          choosedAbsent: 'all'
        },
        index: 'comfirmData',
      });
    } else {
      dispatch({
        type: 'person/fetchList',
        payload: {
          username,
          name,
          pid,
          absent,
          pageNum,
          pageSize,
        },
      });
      dispatch({
        type: 'person/save',
        payload: {
          choosedUsername: username,
          choosedName: name,
          choosedPid: pid,
          choosedAbsent: absent
        },
        index: 'comfirmData',
      });
    }
    dispatch({
      type: 'person/getPositions',
      payload: {}
    })
  }

  query = () => {
    const {
      person: {
        list: { pageSize = 10, pageNum = 1 },
        currentParameter: {
          username = '',
          name = '',
          pid = 'all',
          absent = 'all'
        },
      },
      dispatch,
    } = this.props;
    dispatch({
      type: 'person/fetchList',
      payload: { username, name, pid, absent, pageNum, pageSize },
    });
    dispatch({
      type: 'person/save',
      payload: {
        choosedUsername: username,
        choosedName: name,
        choosedPid: pid,
        choosedAbsent: absent
      },
      index: 'comfirmData',
    });
  };

  reset = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'person/fetchList',
      payload: { 
        username: '',
        name: '',
        pid: 'all',
        absent: 'all',
        pageNum: 1,
        pageSize: 10
      },
    });
    dispatch({
      type: 'person/reset',
    })
  };

  getColumns = () => {
    const { 
      person: { 
        positions: { positions }
      }, 
      dispatch 
    } = this.props
    
    const columns = [
      { title: '工号', dataIndex: 'username', key: 'username' },
      { title: '姓名', dataIndex: 'name', key: 'name' },
      { title: '性别', dataIndex: 'sex', key: 'sex' },
      { title: '联系方式', dataIndex: 'phone', key: 'phone' },
      { 
        title: '部门职位', 
        render: record => {
          if (positions) {
            for (let i = 0; i < positions.length; i++) {
              if (record.pid === positions[i].pid) {
                return <span>{positions[i].name}</span>
              }
            }
          }
        }
      },
      { 
        title: '在班状态', 
        render: record => {
          if (record.absent === '在班') {
            return (
              <Row>
                <Icon type="carry-out" theme="twoTone" twoToneColor="#43CD80" />
                <span style={{ marginLeft: '8px' }}>{record.absent}</span>
              </Row>
            )
          }
          return (
            <Row>
              <Icon type="calendar" theme="twoTone" twoToneColor="#CD3333" />
              <span style={{ marginLeft: '8px' }}>{record.absent}</span>
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
                  pathname: '/home/person/detail',
                  state: {}
                })
                /* dispatch({
                  type: 'person/getDetail',
                  payload: {}
                }) */
              }}
            >
              查看详情
            </span>
            <Divider type="vertical" />
            <span 
              className='spanToa' 
              onClick={() => { 
                this.props.history.push({
                  pathname: '/home/person/edit',
                  state: { flag: 'edit', record: record }
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
                  type: 'person/del',
                  payload: { uid: record.uid },
                })
                  .then((res) => {
                    if (res.msg === '') {
                      message.success(`'${record.name}'辞退成功`);
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
      person: {
        choosedUsername = '',
        choosedName = '',
        choosedPid = 'all',
        choosedAbsent = 'all'
      },
      dispatch,
    } = this.props;
    const payload = {
      username: choosedUsername && (choosedUsername.trim() || null),
      name: choosedName && (choosedName.trim() || null),
      pid: choosedPid,
      absent: choosedAbsent,
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    };
    dispatch({
      type: 'person/fetchList',
      payload,
    });
  };

  render () {
    const { 
      person: { 
        list: { 
          data = [], 
          pageNum,
          pageSize, 
          total 
        },
        currentParameter: {
          username, name, pid, absent
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
                  type: 'person/save',
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
                  type: 'person/save',
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
                  type: 'person/save',
                  payload: { pid: value },
                  index: 'currentParameter',
                });
              }}
              onFocus={() => {
                dispatch({
                  type: 'person/getPositions',
                  payload: {}
                })
              }}
              value={pid}
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
                  type: 'person/save',
                  payload: { absent: value },
                  index: 'currentParameter',
                });
              }}
              value={absent}
            >
              <Option value="all">全部</Option>
              <Option value={1}>在班</Option>
              <Option value={2}>请假</Option>
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
        title='员工列表'
        extra={
          <Button
            icon="plus"
            type="primary"
            onClick={() => { 
              this.props.history.push({
                pathname: '/home/person/create',
                state: { flag: 'create', record: null }
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
          pagination={{ total, pageSize, current: pageNum }}
          onChange={this.handleTableChange}
        />
      </Card>
      </>
    )
  }
}

export default Person;
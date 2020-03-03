import React, { Component } from 'react';
import { Card, Table, Button, Row, Col, Input, Popconfirm, message, Select, Icon, Divider, Modal, Tooltip } from 'antd';
import { connect } from 'dva';

const { Option } = Select;

@connect(({ leaveManage, loading }) => ({
  leaveManage,
  loading: loading.effects['leaveManage/fetchList'],
  loadingApproval: loading.effects['leaveManage/approval'],
}))
class LeaveManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailVisibel: false,
      approval: true
    }
  }

  UNSAFE_componentWillMount () {
    const {
      leaveManage: {
        list: { pageSize = 10, pageNum = 0 },
        currentParameter: {
          name = '',
          type = 'all',
          date = 'all',
          state = 'all'
        },
      },
      history: { action },
      dispatch,
    } = this.props;
    const payload = {
      name,
      type: type === 'all' ? null : type,
      date: date === 'all' ? null : date,
      state: state === 'all' ? null : state,
      pageNum,
      pageSize,
    };
    if (action !== 'POP') {
      dispatch({
        type: 'leaveManage/reset',
      });
      dispatch({
        type: 'leaveManage/fetchList',
        payload: {
          name: null,
          type: null,
          date: null,
          state: null,
          pageNum: 0,
          pageSize,
        },
      });
      dispatch({
        type: 'leaveManage/save',
        payload: {
          choosedName: '',
          choosedType: 'all',
          choosedDate: 'all',
          choosedState: 'all'
        },
        index: 'comfirmData',
      });
    } else {
      dispatch({
        type: 'leaveManage/fetchList',
        payload,
      });
      dispatch({
        type: 'leaveManage/save',
        payload: {
          choosedName: name,
          choosedType: type,
          choosedDate: date,
          choosedState: state
        },
        index: 'comfirmData',
      });
    }
  }

  query = () => {
    const {
      leaveManage: {
        list: { pageSize = 10, pageNum = 0 },
        currentParameter: {
          name = '',
          type = 'all',
          date = 'all',
          state = 'all'
        },
      },
      dispatch,
    } = this.props;
    const payload = {
      name,
      type: type === 'all' ? null : type,
      date: date === 'all' ? null : date,
      state: state === 'all' ? null : state,
      pageNum,
      pageSize,
    };
    dispatch({
      type: 'leaveManage/fetchList',
      payload,
    });
    dispatch({
      type: 'leaveManage/save',
      payload: {
        choosedName: name,
        choosedType: type,
        choosedDate: date,
        choosedState: state
      },
      index: 'comfirmData',
    });
  };

  getColumns = () => {
    const { dispatch } = this.props
    const columns = [
      { title: '编号', dataIndex: 'lid', key: 'lid' },
      { title: '员工名称', dataIndex: 'accountant', key: 'accountant' },
      { title: '请假类型', dataIndex: 'type', key: 'type' },
      { title: '申请日期', dataIndex: 'date', key: 'date' },
      { 
        title: '请假理由',
        dataIndex: 'detail', 
        key: 'detail', 
        width: '20%', 
        onCell: () => {
          return {
            style: {
              maxWidth: 150,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow:'ellipsis',
              cursor:'pointer'
            }
          }
        },
        render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
      },
      { 
        title: '状态', 
        render: record => {
          if (record.state === '已通过') {
            return (
              <Row>
                <Icon type="check-circle" theme="twoTone" twoToneColor="#43CD80" />
                <span style={{ marginLeft: '8px' }}>{record.state}</span>
              </Row>
            )
          } else if (record.state === '未通过') {
            return (
              <Row>
                <Icon type="close-circle" theme="twoTone" twoToneColor="#CD3333" />
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
        width: '30%',
        render: (text, record) => (
          <>
            <span 
              className='spanToa' 
              onClick={() => { 
                this.setState({
                  detailVisibel: true,
                  approval: record.state === '未审批' ? true : false
                })
                dispatch({
                  type: 'leaveManage/getDetail',
                  payload: {}
                })
              }}
            >
              {record.state === '未审批' ? '审批' : '查看详情'}
            </span>
            <Divider type="vertical" />
            <Popconfirm
              title="确认将该请假单删除么？"
              cancelText="取消"
              okText="确认"
              onConfirm={() => {
                dispatch({
                  type: 'leaveManage/del',
                  payload: {},
                })
                  .then((res) => {
                    message.success(`'${record.name}'的请假单删除成功`);
                  })
                  .catch(() => {
                    message.error(`'${record.name}'的请假单删除失败`);
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
      leaveManage: {
        choosedName = '',
        choosedType = 'all',
        choosedDate = 'all',
        choosedState = 'all'
      },
      dispatch,
    } = this.props;
    const payload = {
      name: choosedName && (choosedName.trim() || null),
      type: choosedType === 'all' ? null : choosedType,
      date: choosedDate === 'all' ? null : choosedDate,
      state: choosedState === 'all' ? null : choosedState,
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    };
    dispatch({
      type: 'leaveManage/fetchList',
      payload,
    });
  };

  approval = (flag) => {
    const { dispatch } = this.props
    dispatch({
      type: 'leaveManage/approval',
      payload: {
        flag
      }
    })
      .then(() => {
        this.setState({
          detailVisibel: false
        })
        message.success('审批成功！')
      })
  }

  render () {
    const { 
      leaveManage: { 
        list: { 
          data = [], 
          pageSize, 
          current, 
          total 
        },
        currentParameter: {
          name, type, state, date
        },
        detail: { basis }
      }, 
      loading,
      loadingApproval,
      dispatch
    } = this.props;
    const { detailVisibel, approval } = this.state
    return (
      <>
      <Card>
        <Row gutter={[48, 16]} className='searchBox'>
          <Col span={8}>
            <span>员工名称</span>
            <Input
              style={{ width: '100%' }}
              placeholder="请输入员工名称"
              onChange={value => {
                dispatch({
                  type: 'leaveManage/save',
                  payload: { name: value.target.value },
                  index: 'currentParameter',
                });
              }}
              value={name}
              onPressEnter={() => { this.query() }}
            />
          </Col>
          <Col span={8}>
            <span>请假类型</span>
            <Select 
              defaultValue="all" 
              style={{ width: '100%' }}
              onChange={value => {
                dispatch({
                  type: 'leaveManage/save',
                  payload: { type: value },
                  index: 'currentParameter',
                });
              }}
              value={type}
            >
              <Option value="all">全部</Option>
              <Option value='thing'>事假</Option>
              <Option value='illness'>病假</Option>
              <Option value='others'>其他</Option>
            </Select>
          </Col>
          <Col span={8}>
            <span>请假日期</span>
            <Select 
              defaultValue="all" 
              style={{ width: '100%' }}
              onChange={value => {
                dispatch({
                  type: 'leaveManage/save',
                  payload: { data: value },
                  index: 'currentParameter',
                });
              }}
              value={date}
            >
              <Option value="all">全部</Option>
              <Option value='today'>当天</Option>
              <Option value='week'>最近一个星期</Option>
              <Option value='month'>最近一个月</Option>
            </Select>
          </Col>
          <Col span={8}>
            <span>假单状态</span>
            <Select 
              defaultValue="all" 
              style={{ width: '100%' }}
              onChange={value => {
                dispatch({
                  type: 'leaveManage/save',
                  payload: { state: value },
                  index: 'currentParameter',
                });
              }}
              value={state}
            >
              <Option value="all">全部</Option>
              <Option value='noApproval'>未审批</Option>
              <Option value='yes'>已通过</Option>
              <Option value='no'>未通过</Option>
            </Select>
          </Col>
          <Col span={8}>
            <div className="btnContainer">
              <Button type="primary" onClick={this.query}>搜索</Button>
              <Button
                type="default"
                onClick={() => {
                  dispatch({
                    type: 'leaveManage/reset',
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
        title='请假列表'
        extra={
          <Button
            icon="plus"
            type="primary"
            onClick={() => { this.props.history.push('/home/leaveManage/create') }}
          >
            添加请假单
          </Button>
        }
      >
        <Table
          bordered
          loading={loading}
          rowKey={row => row.pid}
          dataSource={data}
          columns={this.getColumns()}
          pagination={{ total, pageSize, current }}
          onChange={this.handleTableChange}
        />

        <Modal
          title={approval ? "审批请假单": "查看详情"}
          visible={detailVisibel}
          onOk={() => { this.approval('yes')}}
          onCancel={() => { this.setState({ detailVisibel: false })}}
          footer={approval ? [
            <Button key="back" onClick={() => { this.setState({ detailVisibel: false })}}>
              取消
            </Button>,
            <Button key="submit" type="danger" loading={loadingApproval} onClick={() => { this.approval('no')}}>
              不通过
            </Button>,
            <Button key="submit" type="primary" loading={loadingApproval} onClick={() => { this.approval('yes')}}>
              通过
            </Button>,
          ] : [
            <Button key="back" onClick={() => { this.setState({ detailVisibel: false })}}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={() => { this.setState({ detailVisibel: false })}}>
              确认
            </Button>,
          ]}
        >
          {basis && Object.keys(basis).map((value, key) => {
            return (
              <Row style={{ margin: '8px 0' }}>
                <Col span={6}>{value}: </Col>
                <Col span={12}>{basis[value]}</Col>
              </Row>
            )
          })}
        </Modal>
      </Card>
      </>
    )
  }
}

export default LeaveManage;
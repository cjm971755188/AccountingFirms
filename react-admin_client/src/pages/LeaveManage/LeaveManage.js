import React, { Component } from 'react';
import { Card, Table, Button, Row, Col, Input, Popconfirm, message, Select, Icon, Divider, Modal, Tooltip, Timeline, Descriptions } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

const { Option } = Select;

@connect(({ leaveManage, user, loading }) => ({
  leaveManage,
  user,
  loading: loading.effects['leaveManage/fetchList'],
  loadingApproval: loading.effects['leaveManage/approval'],
}))
class LeaveManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailVisibel: false,
      approval: true,
      lid: 0
    }
  }

  UNSAFE_componentWillMount () {
    const {
      leaveManage: {
        list: { pageSize = 10, pageNum = 1 },
        currentParameter: {
          name = '',
          type = 'all',
          progress = 'all'
        },
      },
      history: { action },
      dispatch,
    } = this.props;
    if (action !== 'POP') {
      dispatch({
        type: 'leaveManage/reset',
      });
      dispatch({
        type: 'leaveManage/fetchList',
        payload: {
          name: "",
          type: 'all',
          progress: 'all',
          pageNum: 1,
          pageSize,
        },
      });
      dispatch({
        type: 'leaveManage/save',
        payload: {
          choosedName: '',
          choosedType: 'all',
          choosedProgress: 'all'
        },
        index: 'comfirmData',
      });
    } else {
      dispatch({
        type: 'leaveManage/fetchList',
        payload: {
          name,
          type,
          progress,
          pageNum,
          pageSize,
        },
      });
      dispatch({
        type: 'leaveManage/save',
        payload: {
          choosedName: name,
          choosedType: type,
          choosedProgress: progress
        },
        index: 'comfirmData',
      });
    }
  }

  query = () => {
    const {
      leaveManage: {
        list: { pageSize = 10, pageNum = 1 },
        currentParameter: {
          name = '',
          type = 'all',
          progress = 'all'
        },
      },
      dispatch,
    } = this.props;
    dispatch({
      type: 'leaveManage/fetchList',
      payload: {
        name,
        type,
        progress,
        pageNum,
        pageSize,
      },
    });
    dispatch({
      type: 'leaveManage/save',
      payload: {
        choosedName: name,
        choosedType: type,
        choosedProgress: progress
      },
      index: 'comfirmData',
    });
  };

  reset = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'leaveManage/fetchList',
      payload: {
        name: '',
        type: 'all',
        progress: 'all',
        pageNum: 1,
        pageSize: 10,
      },
    });
    dispatch({
      type: 'leaveManage/reset',
      payload: {}
    });
  };

  getColumns = () => {
    const { dispatch } = this.props
    const { user: { user: { uid, name } } } = this.props
    const columns = [
      { title: '员工名称', dataIndex: 'name', key: 'name' },
      { title: '请假类型', dataIndex: 'type', key: 'type' },
      { 
        title: '申请日期', 
        render: record => {
          if (record.time) {
            return <span>{moment(record.time).format('YYYY-MM-DD')}</span>
          }
          return null
        }
      },
      { 
        title: '请假日期', 
        render: record => {
          if (record.startTime && record.endTime) {
            return <span>{moment(record.startTime).format('YYYY-MM-DD')}至{moment(record.endTime).format('YYYY-MM-DD')}</span>
          }
          return null
        }
      },
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
          if (record.progress === '未审批') {
            return (
              <Row>
                <Icon type="clock-circle" theme="twoTone" twoToneColor="#FFD700" />
                <span style={{ marginLeft: '8px' }}>{record.progress}</span>
              </Row>
            )
          } else if (record.progress === '已通过') {
            return (
              <Row>
                <Icon type="check-circle" theme="twoTone" twoToneColor="#43CD80" />
                <span style={{ marginLeft: '8px' }}>{record.progress}</span>
              </Row>
            )
          } else if (record.progress === '未通过') {
            return (
              <Row>
                <Icon type="close-circle" theme="twoTone" twoToneColor="#CD3333" />
                <span style={{ marginLeft: '8px' }}>{record.progress}</span>
              </Row>
            )
          }
          return (
            <Row>
              <Icon type="stop" theme="twoTone" twoToneColor="#CCCCCC" />
              <span style={{ marginLeft: '8px' }}>{record.progress}</span>
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
                this.setState({
                  detailVisibel: true,
                  approval: record.progress === '未审批' ? true : false,
                  lid: record.lid
                })
                dispatch({
                  type: 'leaveManage/getDetail',
                  payload: { lid: record.lid }
                })
              }}
            >
              {record.progress === '未审批' ? '审批' : '查看详情'}
            </span>
            {record.progress === '已作废' ? null : <><Divider type="vertical" />
            <Popconfirm
              title="确认将该请假单作废么？"
              cancelText="取消"
              okText="确认"
              onConfirm={() => {
                dispatch({
                  type: 'leaveManage/approval',
                  payload: { flag: '作废', lid: record.lid, uid, name },
                })
                  .then((res) => {
                    if (res.msg === '') {
                      message.success(`'${record.name}'的请假单作废成功`);
                      this.query();
                    } else {
                      message.error(res.msg)
                    }
                  })
                  .catch(() => {
                    message.error(`'${record.name}'的请假单作废失败`);
                  });
              }}
            >
              <span className='spanToa'>作废</span>
            </Popconfirm></>}
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
        choosedProgress = 'all'
      },
      dispatch,
    } = this.props;
    const payload = {
      name: choosedName && (choosedName.trim() || null),
      type: choosedType,
      progress: choosedProgress,
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
    const { user: { user: { uid, name } } } = this.props
    const { lid } = this.state
    dispatch({
      type: 'leaveManage/approval',
      payload: { flag, lid, uid, name }
    })
      .then((res) => {
        if (res.msg === '') {
          this.setState({
            detailVisibel: false
          })
          message.success('审批成功！')
          this.query();
        } else {
          message.error(res.msg)
        }
      })
  }

  render () {
    const { 
      leaveManage: { 
        list: { 
          data = [], 
          pageSize, 
          pageNum, 
          total 
        },
        currentParameter: {
          name, type, progress
        },
        detail: { basis, timeLine }
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
              <Option value='事假'>事假</Option>
              <Option value='病假'>病假</Option>
              <Option value='其他'>其他</Option>
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
                  payload: { progress: value },
                  index: 'currentParameter',
                });
              }}
              value={progress}
            >
              <Option value="all">全部</Option>
              <Option value='未审批'>未审批</Option>
              <Option value='已通过'>已通过</Option>
              <Option value='未通过'>未通过</Option>
              <Option value='已作废'>已作废</Option>
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
        title='请假列表'
        extra={
          <>
            <Popconfirm
              title="确认将所有已作废的请假单清除么？"
              cancelText="取消"
              okText="确认"
              onConfirm={() => {
                dispatch({
                  type: 'leaveManage/del',
                  payload: {},
                })
                  .then((res) => {
                    if (res.msg === '') {
                      message.success('清除成功！');
                      this.query();
                    } else {
                      message.error(res.msg)
                    }
                  })
                  .catch(() => {
                    message.error('清除失败');
                  });
              }}
            >
              <Button icon="delete" style={{ marginRight: 8 }}>清除所有已作废请假单</Button>
            </Popconfirm>
            <Button
              icon="plus"
              style={{ marginRight: 8 }}
              onClick={() => { 
                this.props.history.push({
                  pathname: '/home/leaveManage/create',
                  query: { flag: 2 }
                })
              }}
            >
              请假（员工）
            </Button>
            <Button
              icon="plus"
              type="primary"
              onClick={() => { 
                this.props.history.push({
                  pathname: '/home/leaveManage/create',
                  query: { flag: 1 }
                })
              }}
            >
              添加请假单
            </Button>
          </>
        }
      >
        <Table
          bordered
          loading={loading}
          rowKey={row => row.pid}
          dataSource={data}
          columns={this.getColumns()}
          pagination={{ total, pageSize, current: pageNum }}
          onChange={this.handleTableChange}
        />

        <Modal
          title={approval ? "审批请假单": "查看详情"}
          visible={detailVisibel}
          onOk={() => { this.approval('审批通过') }}
          onCancel={() => { this.setState({ detailVisibel: false })}}
          footer={approval ? [
            <Button key="back" onClick={() => { this.setState({ detailVisibel: false })}}>
              取消
            </Button>,
            <Button key="submit" type="danger" loading={loadingApproval} onClick={() => { this.approval('审批不通过') }}>
              不通过
            </Button>,
            <Button key="submit" type="primary" loading={loadingApproval} onClick={() => { this.approval('审批通过') }}>
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
          <Descriptions title="请假信息" column={1}>
            {basis && Object.keys(basis).map((value, key) => {
              return <Descriptions.Item label={value}>{basis[value]}</Descriptions.Item>
            })}
          </Descriptions>
          <Descriptions title="历史流程">
            {timeLine && <Timeline>
              <Timeline.Item>{timeLine.name} 在 {timeLine.time} 提出了 请假申请</Timeline.Item>
              {timeLine.checkName ? <Timeline.Item color={timeLine.checkResult === '通过' ? "green" : 'red'}>{timeLine.checkName} 在 {timeLine.checkTime} {timeLine.checkResult}了 请假申请</Timeline.Item> : null}
              {timeLine.invalidName ? <Timeline.Item color="gray">{timeLine.invalidName} 在 {timeLine.invalidTime} 作废 了请假申请</Timeline.Item> : null}
            </Timeline>}
          </Descriptions>
          
        </Modal>
      </Card>
      </>
    )
  }
}

export default LeaveManage;
import React, { Component } from 'react';
import { Card, Table, Button, Row, Col, Popconfirm, message, Select, Icon, Divider, Modal, Tooltip, Timeline, Descriptions } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

import SearchPerson from '../../components/searchPerson'

const { Option } = Select;
const { confirm } = Modal;

@connect(({ absent, user, loading }) => ({
  absent,
  user,
  loading: loading.effects['absent/fetchList'],
  loadingApproval: loading.effects['absent/approval'],
}))
class Absent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailVisibel: false,
      approval: true,
      aid: 0
    }
  }

  UNSAFE_componentWillMount () {
    const {
      absent: {
        list: { pageSize = 10, pageNum = 1 },
        currentParameter: {
          uid = '',
          type = 'all',
          progress = 'all'
        },
      },
      history: { action },
      dispatch,
    } = this.props;
    if (action !== 'POP') {
      dispatch({
        type: 'absent/reset',
      });
      dispatch({
        type: 'absent/fetchList',
        payload: {
          uid: "",
          type: 'all',
          progress: 'all',
          pageNum: 1,
          pageSize,
        },
      });
      dispatch({
        type: 'absent/save',
        payload: {
          choosedUid: '',
          choosedType: 'all',
          choosedProgress: 'all'
        },
        index: 'comfirmData',
      });
    } else {
      dispatch({
        type: 'absent/fetchList',
        payload: {
          uid,
          type,
          progress,
          pageNum,
          pageSize,
        },
      });
      dispatch({
        type: 'absent/save',
        payload: {
          choosedUid: uid,
          choosedType: type,
          choosedProgress: progress
        },
        index: 'comfirmData',
      });
    }
  }

  query = () => {
    const {
      absent: {
        list: { pageSize = 10, pageNum = 1 },
        currentParameter: {
          uid = '',
          type = 'all',
          progress = 'all'
        },
      },
      dispatch,
    } = this.props;
    dispatch({
      type: 'absent/fetchList',
      payload: {
        uid,
        type,
        progress,
        pageNum,
        pageSize,
      },
    });
    dispatch({
      type: 'absent/save',
      payload: {
        choosedUid: uid,
        choosedType: type,
        choosedProgress: progress
      },
      index: 'comfirmData',
    });
  };

  reset = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'absent/fetchList',
      payload: {
        uid: '',
        type: 'all',
        progress: 'all',
        pageNum: 1,
        pageSize: 10,
      },
    });
    dispatch({
      type: 'absent/reset',
      payload: {}
    });
  };

  getColumns = () => {
    const { dispatch } = this.props
    const { user: { user: { uid, name } } } = this.props
    const columns = [
      { title: '员工名称', dataIndex: 'uName', key: 'uName' },
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
                  aid: record.aid
                })
                dispatch({
                  type: 'absent/getDetail',
                  payload: { aid: record.aid }
                })
              }}
            >
              {record.progress === '未审批' ? '审批' : '查看详情'}
            </span>
            {record.progress === '已作废' ? null : <><Divider type="vertical" />
            <span 
              className='spanToa' 
              onClick={() => { 
                const that = this
                return (
                  confirm({
                    title: '确认将该请假单作废么？',
                    icon: <Icon type="info-circle" />,
                    content: '注：作废会将该请假单无效并无法继续对其操作',
                    okText: '确认作废',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk() {
                      dispatch({
                        type: 'absent/approval',
                        payload: { flag: '作废', aid: record.aid, uid, name },
                      })
                        .then((res) => {
                          if (res.msg === '') {
                            message.success(`员工'${record.uName}'的请假单作废成功`);
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
              作废
            </span></>}
          </>
        )
      }
    ]
    return columns;
  };

  handleTableChange = (pagination, filters, sorter) => {
    const {
      absent: {
        choosedUid = '',
        choosedType = 'all',
        choosedProgress = 'all'
      },
      dispatch,
    } = this.props;
    const payload = {
      uid: choosedUid && (choosedUid.trim() || null),
      type: choosedType,
      progress: choosedProgress,
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    };
    dispatch({
      type: 'absent/fetchList',
      payload,
    });
  };

  approval = (flag) => {
    const { dispatch } = this.props
    const { user: { user: { uid, name } } } = this.props
    const { aid } = this.state
    dispatch({
      type: 'absent/approval',
      payload: { flag, aid, uid, name }
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
      .catch((e) => {
        message.error(e);
        this.query();
      });
  }

  getPersonValues = (values) => {
    const { dispatch } = this.props
    dispatch({
      type: 'absent/save',
      payload: { uid: values.uid },
      index: 'currentParameter',
    });
  }

  render () {
    const { 
      absent: { 
        list: { 
          data = [], 
          pageSize, 
          pageNum, 
          total 
        },
        currentParameter: {
          uid, type, progress
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
            <span>请假员工</span>
            <SearchPerson sendValues={this.getPersonValues} width='100%' uid={uid} />
          </Col>
          <Col span={8}>
            <span>请假类型</span>
            <Select 
              defaultValue="all" 
              style={{ width: '100%' }}
              onChange={value => {
                dispatch({
                  type: 'absent/save',
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
                  type: 'absent/save',
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
          <Col span={9}>
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
                  type: 'absent/del',
                  payload: {},
                })
                  .then((res) => {
                    if (res.msg === '') {
                      message.success('清除成功！');
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
              <Button icon="delete" style={{ marginRight: 8 }}>清除所有已作废请假单</Button>
            </Popconfirm>
            <Button
              icon="plus"
              type="primary"
              onClick={() => { 
                this.props.history.push({
                  pathname: '/home/absent/create',
                  state: { flag: 1 }
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
          rowKey={row => row.did}
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
              {timeLine.checkName ? <Timeline.Item color={timeLine.checkResult === '通过' ? "green" : 'red'}>
                {timeLine.checkName} 在 {timeLine.checkTime} {timeLine.checkResult}了 请假申请
              </Timeline.Item> : null}
              {timeLine.invalidName ? <Timeline.Item color="gray">
                {timeLine.invalidName} 在 {timeLine.invalidTime} 作废 了请假申请
              </Timeline.Item> : null}
            </Timeline>}
          </Descriptions>
        </Modal>
      </Card>
      </>
    )
  }
}

export default Absent;
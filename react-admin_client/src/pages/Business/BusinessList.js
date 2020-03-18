import React, { Component } from 'react';
import { Card, Popconfirm, Table, Divider, Button, Row, Col, Icon, message, Select } from 'antd';
import { connect } from 'dva';

import moment from 'moment';
import SearchPerson from '../../components/searchPerson'
import SearchCustomer from '../../components/searchCustomer'

const { Option } = Select;

@connect(({ business, loading }) => ({
  business,
  loading: loading.effects['business/fetchList'],
}))
class Business extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  UNSAFE_componentWillMount () {
    const {
      business: {
        list: { pageSize = 10, pageNum = 1 },
        currentParameter: {
          uid = '',
          cid = '',
          btid = 'all',
          progress = 'all'
        },
      },
      history: { action },
      dispatch,
    } = this.props;
    if (action !== 'POP') {
      dispatch({
        type: 'business/reset',
      });
      dispatch({
        type: 'business/fetchList',
        payload: {
          uid: '',
          cid: '',
          btid: 'all',
          progress: 'all',
          pageNum: 1,
          pageSize,
        },
      });
      dispatch({
        type: 'business/save',
        payload: {
          choosedUid: '',
          choosedCid: '',
          choosedBtid: 'all',
          choosedProgress: 'all'
        },
        index: 'comfirmData',
      });
    } else {
      dispatch({
        type: 'business/fetchList',
        payload: {
          uid,
          cid,
          btid,
          progress,
          pageNum,
          pageSize,
        },
      });
      dispatch({
        type: 'business/save',
        payload: {
          choosedUid: uid,
          choosedCid: cid,
          choosedBtid: btid,
          choosedProgress: progress
        },
        index: 'comfirmData',
      });
    }
    dispatch({
      type: 'business/getBusinessTypes',
      payload: {}
    })
  }

  query = () => {
    const {
      business: {
        list: { pageSize = 10, pageNum = 1 },
        currentParameter: {
          uid = '',
          cid = '',
          btid = 'all',
          progress = 'all'
        },
      },
      dispatch,
    } = this.props;
    dispatch({
      type: 'business/fetchList',
      payload: {
        uid,
        cid,
        btid,
        progress,
        pageNum,
        pageSize,
      },
    });
    dispatch({
      type: 'business/save',
      payload: {
        choosedUid: uid,
        choosedCid: cid,
        choosedBtid: btid,
        choosedProgress: progress
      },
      index: 'comfirmData',
    });
  };

  reset = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'business/fetchList',
      payload: {
        uid: '',
        cid: '',
        btid: 'all',
        progress: 'all',
        pageNum: 1,
        pageSize: 10,
      },
    });
    dispatch({
      type: 'business/reset',
      payload: {},
    });
  };

  getColumns = () => {
    const { dispatch } = this.props
    const columns = [
      { title: '业务类型', dataIndex: 'btName', key: 'btName' },
      { title: '税号', dataIndex: 'ID', key: 'ID' },
      { title: '公司名称', dataIndex: 'cName', key: 'cName' },
      { title: '联系人', dataIndex: 'linkName', key: 'linkName' },
      { title: '联系方式', dataIndex: 'linkPhone', key: 'linkPhone' },
      { 
        title: '开始时间', 
        render: record => {
          if (record.startTime) {
            return <span>{moment(record.startTime).format('YYYY-MM-DD')}</span>
          }
          return null
        }
      },
      { 
        title: '结束时间',
        render: record => {
          if (record.endTime) {
            return <span>{moment(record.endTime).format('YYYY-MM-DD')}</span>
          }
          return null
        }
      },
      { title: '酬金', dataIndex: 'salary', key: 'salary' },
      { title: '负责人', dataIndex: 'uName', key: 'uName' },
      { 
        title: '状态', 
        render: record => {
          if (record.progress === '已结束') {
            return (
              <Row>
                <Icon type="check-circle" theme="twoTone" twoToneColor="#43CD80" />
                <span style={{ marginLeft: '8px' }}>{record.progress}</span>
              </Row>
            )
          } else if (record.progress === '未结算') {
            return (
              <Row>
                <Icon type="info-circle" theme="twoTone" twoToneColor="#CD3333" />
                <span style={{ marginLeft: '8px' }}>{record.progress}</span>
              </Row>
            )
          }
          return (
            <Row>
              <Icon type="clock-circle" theme="twoTone" twoToneColor="#FFD700" />
              <span style={{ marginLeft: '8px' }}>{record.progress}</span>
            </Row>
          )
        }
      },
      {
        title: '操作',
        width: '15%',
        render: (text, record) => (
          <>
            {record.progress === '办理中' ? <><Popconfirm
              title="确认该业务已经办理完成么？"
              cancelText="取消"
              okText="确认"
              onConfirm={() => {
                dispatch({
                  type: 'business/didComplete',
                  payload: { bid: record.bid },
                })
                  .then((res) => {
                    if (res.msg === '') {
                      message.success(`'${record.cName}'的'${record.btName}'业务完成办理成功`);
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
              <span className='spanToa'>确认完成</span>
            </Popconfirm>
            <Divider type="vertical" /></> : null}
            {record.progress === '未结算' ? <><Popconfirm
              title="确认该业务已经结算完成么？"
              cancelText="取消"
              okText="确认"
              onConfirm={() => {
                dispatch({
                  type: 'business/didPay',
                  payload: { bid: record.bid },
                })
                  .then((res) => {
                    if (res.msg === '') {
                      message.success(`'${record.cName}'的'${record.btName}'业务完成结算成功`);
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
              <span className='spanToa'>确认结算</span>
            </Popconfirm>
            <Divider type="vertical" /></> : null}
            <Popconfirm
              icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
              title="该业务【酬金未结算】，确认删除么？"
              cancelText="取消"
              okText="确认"
              onConfirm={() => {
                dispatch({
                  type: 'business/del',
                  payload: { bid: record.bid },
                })
                  .then((res) => {
                    if (res.msg === '') {
                      message.success(`'${record.cName}'的'${record.btName}'业务删除成功`);
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
            </Popconfirm>
          </>
        )
      }
    ]
    return columns;
  };

  handleTableChange = (pagination, filters, sorter) => {
    const {
      business: {
        choosedUid = '',
        choosedCid = '',
        choosedBtid = 'all',
        choosedProgress = 'all'
      },
      dispatch,
    } = this.props;
    const payload = {
      uid: choosedUid && (choosedUid.trim() || null),
      cid: choosedCid && (choosedCid.trim() || null),
      btid: choosedBtid,
      progress: choosedProgress,
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    };
    dispatch({
      type: 'business/fetchList',
      payload,
    });
  };

  getPersonValues = (values) => {
    const { dispatch } = this.props
    dispatch({
      type: 'business/save',
      payload: { uid: values.uid },
      index: 'currentParameter',
    });
  }
  
  getCustomerValues = (values) => {
    const { dispatch } = this.props
    dispatch({
      type: 'business/save',
      payload: { cid: values.cid },
      index: 'currentParameter',
    });
  }

  render () {
    const { 
      business: { 
        list: { 
          data = [], 
          pageSize, 
          pageNum, 
          total 
        },
        currentParameter: {
          uid, cid, btid, progress
        },
        businessTypes: { businessTypes = [] }
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
            <SearchCustomer sendValues={this.getCustomerValues} width='100%' cid={cid} />
          </Col>
          <Col span={8}>
            <span>负责员工</span>
            <SearchPerson sendValues={this.getPersonValues} width='100%' uid={uid} did='3' />
          </Col>
          <Col span={8}>
            <span>业务类型</span>
            <Select 
              defaultValue="all" 
              style={{ width: '100%' }}
              onChange={value => {
                dispatch({
                  type: 'business/save',
                  payload: { btid: value },
                  index: 'currentParameter',
                });
              }}
              value={btid}
            >
              <Option value="all">全部</Option>
              {businessTypes && businessTypes.map((value, key) => {
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
                  type: 'business/save',
                  payload: { progress: value },
                  index: 'currentParameter',
                });
              }}
              value={progress}
            >
              <Option value="all">全部</Option>
              <Option value='办理中'>办理中</Option>
              <Option value='未结算'>未结算</Option>
              <Option value='已结束'>已结束</Option>
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
        title='业务列表'
        extra={
          <>
            <Button
              icon="gift"
              style={{ marginRight: 8 }}
              onClick={() => { this.props.history.push('/home/business/guide') }}
            >
              业务指南
            </Button>
            <Button
              icon="plus"
              type="primary"
              onClick={() => { 
                this.props.history.push({
                  pathname: '/home/business/create',
                  state: { flag: 'create', record: null }
                }) 
              }}
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
          pagination={{ total, pageSize, current: pageNum }}
          onChange={this.handleTableChange}
        />
      </Card>
      </>
    )
  }
}

export default Business;
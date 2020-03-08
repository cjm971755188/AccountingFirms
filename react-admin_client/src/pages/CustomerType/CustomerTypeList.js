import React, { Component } from 'react';
import { Card, Table, Button, Row, Col, Input, Popconfirm, message, Divider, Tooltip } from 'antd';
import { connect } from 'dva';

@connect(({ customerType, loading }) => ({
  customerType,
  loading: loading.effects['customerType/fetchList'],
}))
class CustomerType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subList: {}
    }
  }

  UNSAFE_componentWillMount () {
    const {
      customerType: {
        list: { pageSize = 10, pageNum = 1 },
        currentParameter: {
          name = '',
        },
      },
      history: { action },
      dispatch,
    } = this.props;
    if (action !== 'POP') {
      dispatch({
        type: 'customerType/reset',
      });
      dispatch({
        type: 'customerType/fetchList',
        payload: {
          name: '',
          pageNum: 1,
          pageSize,
        },
      });
      dispatch({
        type: 'customerType/save',
        payload: {
          choosedName: '',
        },
        index: 'comfirmData',
      });
    } else {
      dispatch({
        type: 'customerType/fetchList',
        payload: {
          name,
          pageNum,
          pageSize,
        },
      });
      dispatch({
        type: 'customerType/save',
        payload: {
          choosedName: name,
        },
        index: 'comfirmData',
      });
    }
  }

  query = () => {
    const {
      customerType: {
        list: { pageSize = 10, pageNum = 1 },
        currentParameter: {
          name = '',
        },
      },
      dispatch,
    } = this.props;
    dispatch({
      type: 'customerType/fetchList',
      payload: {
        name,
        pageNum,
        pageSize,
      },
    });
    dispatch({
      type: 'customerType/save',
      payload: {
        choosedName: name,
      },
      index: 'comfirmData',
    });
  };

  reset = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerType/fetchList',
      payload: {
        name: '',
        pageNum: 1,
        pageSize: 10,
      },
    });
    dispatch({
      type: 'customerType/reset',
      payload: {},
    });
  };

  getColumns = () => {
    const { dispatch } = this.props
    const columns = [
      { title: '编号', dataIndex: 'ctid', key: 'ctid' },
      { title: '结算类型', dataIndex: 'name', key: 'name' },
      { 
        title: '描述',
        dataIndex: 'description', 
        key: 'description', 
        width: '30%', 
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
        title: '操作',
        width: '30%',
        render: (text, record) => (
          <>
            <span 
              className='spanToa' 
              onClick={() => { 
                this.props.history.push({
                  pathname: '/home/customerType/editCustomerType',
                  state: { flag: 'edit', record: record }
                })
              }}
            >
              修改信息
            </span>
            <Divider type="vertical" />
            <span 
              className='spanToa' 
              onClick={() => { 
                this.props.history.push({
                  pathname: '/home/customerType/createSalary',
                  state: { flag: 'create', record: record }
                })
              }}
            >
              添加酬金类型
            </span>
            <Divider type="vertical" />
            <Popconfirm
              title="确认将该类型删除么？"
              cancelText="取消"
              okText="确认"
              onConfirm={() => {
                dispatch({
                  type: 'customerType/deleteCustomerType',
                  payload: { ctid: record.ctid },
                })
                  .then((res) => {
                    if (res.msg === '') {
                      message.success(`结算类型'${record.name}'删除成功`);
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
      customerType: {
        choosedName = '',
      },
      dispatch,
    } = this.props;
    const payload = {
      name: choosedName && (choosedName.trim() || null),
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    };
    dispatch({
      type: 'customerType/fetchList',
      payload,
    });
  };

  expandedRowRender = (record) => {
    const { dispatch } = this.props;
    const { subList } = this.state
    const columns = [
      { title: '酬金', dataIndex: 'salary', key: 'salary' },
      {
        title: '操作',
        width: '30%',
        render: (text, record) => (
          <>
            <span 
              className='spanToa' 
              onClick={() => { 
                this.props.history.push({
                  pathname: '/home/customerType/editSalary',
                  state: { flag: 'edit', record: record }
                })
              }}
            >
              修改金额
            </span>
            <Divider type="vertical" />
            <Popconfirm
              title="确认将该类型删除么？"
              cancelText="取消"
              okText="确认"
              onConfirm={() => {
                dispatch({
                  type: 'customerType/deleteSalary',
                  payload: { sid: record.sid },
                })
                  .then((res) => {
                    if (res.msg === '') {
                      message.success(`酬金金额'${record.name}'删除成功`);
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
    ];
    return <Table columns={columns} dataSource={subList[record.ctid]} pagination={false} rowKey={row => row.sid} style={{ margin: 2 }} />
  };

  onExpand = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerType/getSalaryList',
      payload: { ctid: record.ctid },
    })
      .then((res) => {
        if (res.msg === '') {
          let temp = this.state.subList
          let list = res.data.data
          temp[record.ctid] = list
          this.setState({
            subList: temp
          })
        }
      })
  }

  render () {
    const { 
      customerType: { 
        list: { 
          data = [], 
          pageSize, 
          pageNum, 
          total 
        },
        currentParameter: { name },
      }, 
      loading,
      dispatch
    } = this.props;
    return (
      <>
      <Card>
        <Row gutter={[48, 16]} className='searchBox'>
          <Col span={8}>
            <span>结算类型</span>
            <Input
              style={{ width: '100%' }}
              placeholder="请输入结算类型名称"
              onChange={value => {
                dispatch({
                  type: 'customerType/save',
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
              <Button type="default" onClick={() => { this.reset() }}>重置</Button>
            </div>
          </Col>
        </Row>
      </Card>
      <br/>
      <Card 
        title='结算类型列表'
        extra={
          <Button
            icon="plus"
            type="primary"
            onClick={() => { 
              this.props.history.push({
                pathname: '/home/customerType/createCustomerType',
                state: { flag: 'create', record: null }
              })
            }}
          >
            添加结算类型
          </Button>
        }
      >
        <Table
          bordered
          loading={loading}
          rowKey={row => row.ctid}
          dataSource={data}
          columns={this.getColumns()}
          pagination={{ total, pageSize, current: pageNum }}
          onChange={this.handleTableChange}
          expandedRowRender={this.expandedRowRender}
          onExpand={(expanded, record) => { this.onExpand(record) }}
        />
      </Card>
      </>
    )
  }
}

export default CustomerType;
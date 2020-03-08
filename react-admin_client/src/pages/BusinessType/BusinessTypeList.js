import React, { Component } from 'react';
import { Card, Table, Button, Row, Col, Input, Popconfirm, message, Divider, Tooltip } from 'antd';
import { connect } from 'dva';

@connect(({ businessType, loading }) => ({
  businessType,
  loading: loading.effects['businessType/fetchList'],
}))
class BusinessType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subList: {}
    }
  }

  UNSAFE_componentWillMount () {
    const {
      businessType: {
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
        type: 'businessType/reset',
      });
      dispatch({
        type: 'businessType/fetchList',
        payload: {
          name: '',
          pageNum: 1,
          pageSize,
        },
      });
      dispatch({
        type: 'businessType/save',
        payload: {
          choosedName: '',
        },
        index: 'comfirmData',
      });
    } else {
      dispatch({
        type: 'businessType/fetchList',
        payload: {
          name,
          pageNum,
          pageSize,
        },
      });
      dispatch({
        type: 'businessType/save',
        payload: {
          choosedName: name,
        },
        index: 'comfirmData',
      });
    }
  }

  query = () => {
    const {
      businessType: {
        list: { pageSize = 10, pageNum = 1 },
        currentParameter: {
          name = '',
        },
      },
      dispatch,
    } = this.props;
    dispatch({
      type: 'businessType/fetchList',
      payload: {
        name,
        pageNum,
        pageSize,
      },
    });
    dispatch({
      type: 'businessType/save',
      payload: {
        choosedName: name,
      },
      index: 'comfirmData',
    });
  };

  reset = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'businessType/fetchList',
      payload: {
        name: '',
        pageNum: 1,
        pageSize: 10,
      },
    });
    dispatch({
      type: 'businessType/reset',
      payload: {},
    });
  };

  getColumns = () => {
    const { dispatch } = this.props
    const columns = [
      { title: '编号', dataIndex: 'btid', key: 'btid' },
      { title: '类型名称', dataIndex: 'name', key: 'name' },
      { 
        title: '类型描述',
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
                  pathname: '/home/businessType/editBusinessType',
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
                dispatch({
                  type: 'businessType/getGuideList',
                  payload: { btid: record.btid },
                })
                  .then((res) => {
                    if (res.msg === '') {
                      this.props.history.push({
                        pathname: '/home/businessType/createGuide',
                        state: { flag: 'create', record: record, steps: res.data.data.length }
                      })
                    }
                  })
              }}
            >
              添加新步骤            
            </span>
            <Divider type="vertical" />
            <Popconfirm
            title="确认将该业务类型删除么？"
            cancelText="取消"
            okText="确认"
            onConfirm={() => {
              dispatch({
                type: 'businessType/deleteBusinessType',
                payload: { btid: record.btid },
              })
                .then((res) => {
                  if (res.msg === '') {
                    message.success(`业务类型'${record.name}'删除成功`);
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
      businessType: {
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
      type: 'businessType/fetchList',
      payload,
    });
  };

  expandedRowRender = (record) => {
    const { dispatch } = this.props;
    const { subList } = this.state
    const columns = [
      { title: '步骤', dataIndex: 'step', key: 'step' },
      { title: '主题', dataIndex: 'title', key: 'title' },
      { 
        title: '具体描述',
        dataIndex: 'detail', 
        key: 'detail', 
        width: '40%', 
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
                  pathname: '/home/businessType/editGuide',
                  state: { flag: 'edit', record: record }
                })
              }}
            >
              修改信息
            </span>
            <Divider type="vertical" />
            <Popconfirm
              title="确认将该步骤删除么？"
              cancelText="取消"
              okText="确认"
              onConfirm={() => {
                dispatch({
                  type: 'businessType/deleteGuide',
                  payload: { gid: record.gid, step: record.step },
                })
                  .then((res) => {
                    if (res.msg === '') {
                      message.success(`业务步骤'${record.title}'删除成功`);
                    } else {
                      message.error(res.msg)
                    }
                    this.onExpand(record);
                  })
                  .catch((e) => {
                    message.error(e);
                    this.onExpand(record);
                  });
              }}
            >
              <span className='spanToa'>删除</span>
            </Popconfirm>
          </>
        )
      }
    ];
    return <Table columns={columns} dataSource={subList[record.btid]} pagination={false} rowKey={row => row.gid} style={{ margin: 2 }} />
  };

  onExpand = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'businessType/getGuideList',
      payload: { btid: record.btid },
    })
      .then((res) => {
        if (res.msg === '') {
          let temp = this.state.subList
          let list = res.data.data
          temp[record.btid] = list
          this.setState({
            subList: temp
          })
        }
      })
  }

  render () {
    const { 
      businessType: { 
        list: { 
          data = [], 
          pageSize, 
          pageNum, 
          total 
        },
        currentParameter: {
          name
        },
      }, 
      loading,
      dispatch
    } = this.props;
    return (
      <>
      <Card>
        <Row gutter={[48, 16]} className='searchBox'>
          <Col span={8}>
            <span>业务类型</span>
            <Input
              style={{ width: '100%' }}
              placeholder="请输入业务类型名称"
              onChange={value => {
                dispatch({
                  type: 'businessType/save',
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
        title='业务类型列表'
        extra={
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              this.props.history.push({
                pathname: '/home/businessType/createBusinessType',
                state: { flag: 'create', record: null }
              })
            }}
          >
            添加类型
          </Button>
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
          expandedRowRender={this.expandedRowRender}
          onExpand={(expanded, record) => { this.onExpand(record) }}
        />
      </Card>
      </>
    )
  }
}

export default BusinessType;
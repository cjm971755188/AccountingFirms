import React, { Component } from 'react';
import { Card, Table, Button, Row, Col, Input, Popconfirm, message, Divider, Tooltip } from 'antd';
import { connect } from 'dva';

@connect(({ department, loading }) => ({
  department,
  loading: loading.effects['department/fetchList'],
}))
class Department extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  UNSAFE_componentWillMount () {
    const {
      department: {
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
        type: 'department/reset',
      });
      dispatch({
        type: 'department/fetchList',
        payload: {
          name: '',
          pageNum: 1,
          pageSize,
        },
      });
      dispatch({
        type: 'department/save',
        payload: {
          choosedName: '',
        },
        index: 'comfirmData',
      });
    } else {
      dispatch({
        type: 'department/fetchList',
        payload: {
          name,
          pageNum,
          pageSize,
        },
      });
      dispatch({
        type: 'department/save',
        payload: {
          choosedName: name,
        },
        index: 'comfirmData',
      });
    }
  }

  query = () => {
    const {
      department: {
        list: { pageSize = 10, pageNum = 1 },
        currentParameter: {
          name = '',
        },
      },
      dispatch,
    } = this.props;
    dispatch({
      type: 'department/fetchList',
      payload: {
        name,
        pageNum,
        pageSize,
      },
    });
    dispatch({
      type: 'department/save',
      payload: {
        choosedName: name,
      },
      index: 'comfirmData',
    });
  };

  reset = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'department/fetchList',
      payload: {
        name: '',
        pageNum: 1,
        pageSize: 10,
      },
    });
    dispatch({
      type: 'department/reset',
      payload: {},
    });
  };

  getColumns = () => {
    const { dispatch } = this.props
    const columns = [
      { title: '编号', dataIndex: 'did', key: 'did' },
      { title: '职位名称', dataIndex: 'name', key: 'name' },
      { 
        title: '描述',
        dataIndex: 'description', 
        key: 'description', 
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
                  pathname: '/home/department/editDepartment',
                  state: { flag: 'edit', record: record }
                })
              }}
            >
              修改信息与默认权限
            </span>
            <Divider type="vertical" />
            <Popconfirm
              title="确认将该部门职位删除么？"
              cancelText="取消"
              okText="确认"
              onConfirm={() => {
                dispatch({
                  type: 'department/deleteDepartment',
                  payload: { did: record.did },
                })
                  .then((res) => {
                    if (res.msg === '') {
                      message.success(`'${record.name}'删除成功`);
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
      department: {
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
      type: 'department/fetchList',
      payload,
    });
  };

  render () {
    const { 
      department: { 
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
            <span>职位名称</span>
            <Input
              style={{ width: '100%' }}
              placeholder="请输入部门职位名称"
              onChange={value => {
                dispatch({
                  type: 'department/save',
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
        title='部门职位列表'
        extra={
          <Button
            icon="plus"
            type="primary"
            onClick={() => { 
              this.props.history.push({
                pathname: '/home/department/createDepartment',
                state: { flag: 'create', record: null }
              })
            }}
          >
            添加职位
          </Button>
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
      </Card>
      </>
    )
  }
}

export default Department;
import React, { Component } from 'react';
import { Card, Table, Button, Row, Col, Input, Popconfirm, message, Divider } from 'antd';
import { connect } from 'dva';

@connect(({ permissions, loading }) => ({
  permissions,
  loading: loading.effects['permissions/fetchList'],
}))
class Permissions extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  UNSAFE_componentWillMount () {
    const {
      permissions: {
        list: { pageSize = 10, pageNum = 0 },
        currentParameter: {
          name = '',
        },
      },
      history: { action },
      dispatch,
    } = this.props;
    const payload = {
      name,
      pageNum,
      pageSize,
    };
    if (action !== 'POP') {
      dispatch({
        type: 'permissions/reset',
      });
      dispatch({
        type: 'permissions/fetchList',
        payload: {
          name: null,
          pageNum: 0,
          pageSize,
        },
      });
      dispatch({
        type: 'permissions/save',
        payload: {
          choosedName: '',
        },
        index: 'comfirmData',
      });
    } else {
      dispatch({
        type: 'permissions/fetchList',
        payload,
      });
      dispatch({
        type: 'permissions/save',
        payload: {
          choosedName: name,
        },
        index: 'comfirmData',
      });
    }
  }

  query = () => {
    const {
      permissions: {
        list: { pageSize = 10, pageNum = 0 },
        currentParameter: {
          name = '',
        },
      },
      dispatch,
    } = this.props;
    const payload = {
      name,
      pageNum,
      pageSize,
    };
    dispatch({
      type: 'permissions/fetchList',
      payload,
    });
    dispatch({
      type: 'permissions/save',
      payload: {
        choosedName: name,
      },
      index: 'comfirmData',
    });
  };

  getColumns = () => {
    const { dispatch } = this.props
    const columns = [
      { title: '编号', dataIndex: 'mid', key: 'mid' },
      { title: '权限名称', dataIndex: 'name', key: 'name' },
      { title: '默认职位', dataIndex: 'position', key: 'position' },
      {
        title: '操作',
        width: '30%',
        render: (text, record) => (
          <>
            <span 
              className='spanToa' 
              onClick={() => { 
                this.props.history.push({
                  pathname: '/home/permissions/edit',
                  state: { flag: 'edit', record: record }
                })
              }}
            >
              修改
            </span>
            <Divider type="vertical" />
            <Popconfirm
              title="确认将该职位删除么？"
              cancelText="取消"
              okText="确认"
              onConfirm={() => {
                dispatch({
                  type: 'permissions/del',
                  payload: {},
                })
                  .then((res) => {
                    message.success(`'${record.name}'职位删除成功`);
                  })
                  .catch(() => {
                    message.error(`'${record.name}'职位删除失败`);
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
      permissions: {
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
      type: 'permissions/fetchList',
      payload,
    });
  };

  render () {
    const { 
      permissions: { 
        list: { 
          data = [], 
          pageSize, 
          current, 
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
            <span>权限名称</span>
            <Input
              style={{ width: '100%' }}
              placeholder="请输入权限名称"
              onChange={value => {
                dispatch({
                  type: 'permissions/save',
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
                    type: 'permissions/reset',
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
        title='权限列表'
        extra={
          <Button
            icon="plus"
            type="primary"
            onClick={() => { 
              this.props.history.push({
                pathname: '/home/permissions/create',
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
          rowKey={row => row.pid}
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

export default Permissions;
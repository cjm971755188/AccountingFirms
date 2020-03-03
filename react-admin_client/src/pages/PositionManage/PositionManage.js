import React, { Component } from 'react';
import { Card, Table, Button, Row, Col, Input, Popconfirm, message, Divider } from 'antd';
import { connect } from 'dva';

@connect(({ positionManage, loading }) => ({
  positionManage,
  loading: loading.effects['positionManage/fetchList'],
}))
class PositionManage extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  UNSAFE_componentWillMount () {
    const {
      positionManage: {
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
        type: 'positionManage/reset',
      });
      dispatch({
        type: 'positionManage/fetchList',
        payload: {
          name: null,
          pageNum: 0,
          pageSize,
        },
      });
      dispatch({
        type: 'positionManage/save',
        payload: {
          choosedName: '',
        },
        index: 'comfirmData',
      });
    } else {
      dispatch({
        type: 'positionManage/fetchList',
        payload,
      });
      dispatch({
        type: 'positionManage/save',
        payload: {
          choosedName: name,
        },
        index: 'comfirmData',
      });
    }
  }

  query = () => {
    const {
      positionManage: {
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
      type: 'positionManage/fetchList',
      payload,
    });
    dispatch({
      type: 'positionManage/save',
      payload: {
        choosedName: name,
      },
      index: 'comfirmData',
    });
  };

  getColumns = () => {
    const { dispatch } = this.props
    const columns = [
      { title: '编号', dataIndex: 'pid', key: 'pid' },
      { title: '职位名称', dataIndex: 'name', key: 'name' },
      {
        title: '操作',
        width: '30%',
        render: (text, record) => (
          <>
            <span 
              className='spanToa' 
              onClick={() => { 
                this.props.history.push({
                  pathname: '/home/positionManage/edit',
                  query: { flag: 'edit', record: record }
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
                  type: 'positionManage/del',
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
      positionManage: {
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
      type: 'positionManage/fetchList',
      payload,
    });
  };

  render () {
    const { 
      positionManage: { 
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
            <span>职位名称</span>
            <Input
              style={{ width: '100%' }}
              placeholder="请输入职位名称"
              onChange={value => {
                dispatch({
                  type: 'positionManage/save',
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
                    type: 'positionManage/reset',
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
        title='员工职位列表'
        extra={
          <Button
            icon="plus"
            type="primary"
            onClick={() => { 
              this.props.history.push({
                pathname: '/home/positionManage/create',
                query: { flag: 'create', record: null }
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

export default PositionManage;
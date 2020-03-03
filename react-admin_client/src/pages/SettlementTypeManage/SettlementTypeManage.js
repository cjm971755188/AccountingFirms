import React, { Component } from 'react';
import { Card, Table, Button, Row, Col, Input, Popconfirm, message, Divider } from 'antd';
import { connect } from 'dva';

@connect(({ settlementTypeManage, loading }) => ({
  settlementTypeManage,
  loading: loading.effects['settlementTypeManage/fetchList'],
}))
class SettlementTypeManage extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  UNSAFE_componentWillMount () {
    const {
      settlementTypeManage: {
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
        type: 'settlementTypeManage/reset',
      });
      dispatch({
        type: 'settlementTypeManage/fetchList',
        payload: {
          name: null,
          pageNum: 0,
          pageSize,
        },
      });
      dispatch({
        type: 'settlementTypeManage/save',
        payload: {
          choosedName: '',
        },
        index: 'comfirmData',
      });
    } else {
      dispatch({
        type: 'settlementTypeManage/fetchList',
        payload,
      });
      dispatch({
        type: 'settlementTypeManage/save',
        payload: {
          choosedName: name,
        },
        index: 'comfirmData',
      });
    }
  }

  query = () => {
    const {
      settlementTypeManage: {
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
      type: 'settlementTypeManage/fetchList',
      payload,
    });
    dispatch({
      type: 'settlementTypeManage/save',
      payload: {
        choosedName: name,
      },
      index: 'comfirmData',
    });
  };

  getColumns = () => {
    const { dispatch } = this.props
    const columns = [
      { title: '编号', dataIndex: 'atid', key: 'atid' },
      { title: '结算类型', dataIndex: 'name', key: 'name' },
      {
        title: '操作',
        width: '30%',
        render: (text, record) => (
          <>
            <span 
              className='spanToa' 
              onClick={() => { 
                this.props.history.push({
                  pathname: '/home/settlementTypeManage/edit',
                  query: { flag: 'edit', record: record }
                })
              }}
            >
              修改
            </span>
            <Divider type="vertical" />
            <Popconfirm
              title="确认将该类型删除么？"
              cancelText="取消"
              okText="确认"
              onConfirm={() => {
                dispatch({
                  type: 'settlementTypeManage/del',
                  payload: {},
                })
                  .then((res) => {
                    message.success(`'${record.name}'类型删除成功`);
                  })
                  .catch(() => {
                    message.error(`'${record.name}'类型删除失败`);
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
      settlementTypeManage: {
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
      type: 'settlementTypeManage/fetchList',
      payload,
    });
  };

  render () {
    const { 
      settlementTypeManage: { 
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
            <span>结算类型</span>
            <Input
              style={{ width: '100%' }}
              placeholder="请输入结算类型名称"
              onChange={value => {
                dispatch({
                  type: 'settlementTypeManage/save',
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
                    type: 'settlementTypeManage/reset',
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
        title='结算类型列表'
        extra={
          <Button
            icon="plus"
            type="primary"
            onClick={() => { 
              this.props.history.push({
                pathname: '/home/settlementTypeManage/create',
                query: { flag: 'create', record: null }
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

export default SettlementTypeManage;
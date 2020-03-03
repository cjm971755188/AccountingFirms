import React, { Component } from 'react';
import { Card, Table, Button, Row, Col, Input, Popconfirm, message, Divider, Tooltip } from 'antd';
import { connect } from 'dva';

@connect(({ businessTypeManage, loading }) => ({
  businessTypeManage,
  loading: loading.effects['businessTypeManage/fetchList'],
}))
class BusinessTypeManage extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  UNSAFE_componentWillMount () {
    const {
      businessTypeManage: {
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
        type: 'businessTypeManage/reset',
      });
      dispatch({
        type: 'businessTypeManage/fetchList',
        payload: {
          name: null,
          pageNum: 0,
          pageSize,
        },
      });
      dispatch({
        type: 'businessTypeManage/save',
        payload: {
          choosedName: '',
        },
        index: 'comfirmData',
      });
    } else {
      dispatch({
        type: 'businessTypeManage/fetchList',
        payload,
      });
      dispatch({
        type: 'businessTypeManage/save',
        payload: {
          choosedName: name,
        },
        index: 'comfirmData',
      });
    }
  }

  query = () => {
    const {
      businessTypeManage: {
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
      type: 'businessTypeManage/fetchList',
      payload,
    });
    dispatch({
      type: 'businessTypeManage/save',
      payload: {
        choosedName: name,
      },
      index: 'comfirmData',
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
        title: '操作',
        width: '30%',
        render: (text, record) => (
          <>
            <span 
              className='spanToa' 
              onClick={() => { this.props.history.push('/home/businessTypeManage/detail') }}
            >
              查看详情
            </span>
            <Divider type="vertical" />
            <Popconfirm
            title="确认将该业务类型删除么？"
            cancelText="取消"
            okText="确认"
            onConfirm={() => {
              dispatch({
                type: 'businessTypeManage/del',
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
      businessTypeManage: {
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
      type: 'businessTypeManage/fetchList',
      payload,
    });
  };

  render () {
    const { 
      businessTypeManage: { 
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
            <span>类型名称</span>
            <Input
              style={{ width: '100%' }}
              placeholder="请输入业务类型名称"
              onChange={value => {
                dispatch({
                  type: 'businessTypeManage/save',
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
                    type: 'businessTypeManage/reset',
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
        title='业务类型列表'
        extra={
          <Button
            icon="plus"
            type="primary"
            onClick={() => { this.props.history.push('/home/businessTypeManage/create') }}
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
          pagination={{ total, pageSize, current }}
          onChange={this.handleTableChange}
        />
      </Card>
      </>
    )
  }
}

export default BusinessTypeManage;
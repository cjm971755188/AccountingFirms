import React, { Component } from 'react';
import { Card, Row, Col, Table } from 'antd';
import { connect } from 'dva';

@connect(({ customerManage, loading }) => ({
  customerManage,
  loading: loading.effects['customerManage/getDetail'],
}))
class CustomerDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  UNSAFE_componentWillMount () {
    this.getDetail()
  }

  getDetail = () => {
    const { dispatch } = this.props
    /* const { cid } = this.props.location.query */
    dispatch({
      type: 'customerManage/getDetail',
      payload: {}
    })
  }

  getColumns = () => {
    const columns = [
      { title: '业务编号', dataIndex: 'bid', key: 'bid' },
      { title: '业务类型', dataIndex: 'type', key: 'type' },
      { title: '负责人', dataIndex: 'accountant', key: 'accountant' },
      { title: '酬金', dataIndex: 'money', key: 'money' },
      { title: '开始时间', dataIndex: 'startTime', key: 'startTime' },
      { title: '完成时间', dataIndex: 'endTime', key: 'endTime' },
      { title: '进度', dataIndex: 'progress', key: 'progress' },
    ]
    return columns;
  };

  render () {
    const { 
      customerManage: { 
        detail: { 
          basis, 
          business
        } 
      }, 
      loading 
    } = this.props
    return (
      <>
      <Card title='客户详情'>
        <Row className='detailTitie'>基本信息</Row>
        <Row>
          <Col span={4}>图片</Col>
          <Col span={16}>
            {basis && Object.keys(basis).map((value, key) => {
              return (
                <Row key={key} style={{ height: '30px' }}>
                  <Col span={3}>{value}: </Col>
                  <Col span={3}>{basis[value]}</Col>
                </Row>
              )
            })}
          </Col>
        </Row>
        <Row className='detailTitie'>业务列表</Row>
        {business && <Table
          bordered
          size='small'
          loading={loading}
          rowKey={row => row.bid}
          dataSource={business.data}
          columns={this.getColumns()}
          pagination={{ total: business.total, pageSize: business.pageSize, current: business.current }}
        />}
      </Card>
      </>
    )
  }
}

export default CustomerDetail;
import React, { Component } from 'react';
import { Card, Form, Button, message, Select, InputNumber, Row, Col } from 'antd';
import { connect } from 'dva';

import SearchPerson from '../../components/searchPerson'
import SearchCustomer from '../../components/searchCustomer'

const { Option } = Select;

@connect(({ business, loading }) => ({
  business,
  loading: loading.effects['business/create'],
}))
class BusinessCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cid: '',
      uid: '',
    }
  }

  UNSAFE_componentWillMount () {
    const { dispatch } = this.props
    dispatch({
      type: 'business/getBusinessTypes',
      payload: {}
    })
    dispatch({
      type: 'business/getUsers',
      payload: {}
    })
  }

  handleSubmit = e => {
    const { dispatch } = this.props
    const { cid, uid } = this.state
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('edit-values: ', values)
      if (!err) {
        dispatch({
          type: 'business/create',
          payload: {
            cid,
            uid,
            ...values
          }
        })
          .then(() => {
            message.success('添加业务成功！')
            this.props.history.replace('/home/business/list');
            this.props.form.resetFields();
          })
      }
    });
  };

  getPersonValues = (values) => {
    this.setState({
      uid: values.uid
    })
  }

  getCustomerValues = (values) => {
    this.setState({
      cid: values.cid
    })
  }

  render () {
    const { getFieldDecorator, resetFields } = this.props.form;
    const { flag, record } = this.props.history.location.state
    const { business: { businessTypes: { businessTypes }, users: { users = [] } } } = this.props
    const { dispatch } = this.props
    const { cid, uid } = this.state
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
    }
    return (
      <Card title='添加业务'>
        <Form onSubmit={this.handleSubmit} layout='horizontal' labelAlign='left'>
          <Form.Item label='业务类型' {...formItemLayout}>
            {getFieldDecorator('btid', {
              initialValue: flag === 'create' ? '' : record.btid,
              rules: [
                { required: true, message: '业务类型不能为空!' },
              ],
            })(
              <Select 
                placeholder="请选择新建的业务类型" 
                onFocus={() => {
                  dispatch({
                    type: 'business/getBusinessTypes',
                    payload: {}
                  })
                }}
              >
                {businessTypes && businessTypes.map((value, key) => {
                  return <Option value={value.btid} key={value.btid}>{value.name}</Option>
                })}
              </Select>,
            )}
          </Form.Item>
          <Form.Item>
            <Row>
              <Col span={2}>
                <span style={{ color: 'red', fontWeight: 600 }}>* </span>
                <span style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 500 }}>客户公司:</span>
              </Col>
              <Col span={6}>
                <SearchCustomer sendValues={this.getCustomerValues} cid={cid} width='100%' />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item>
            <Row>
              <Col span={2}>
                <span style={{ color: 'red', fontWeight: 600 }}>* </span>
                <span style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 500 }}>负责会计:</span>
              </Col>
              <Col span={6}>
                <SearchPerson sendValues={this.getPersonValues} width='100%' uid={uid} users={users} did='2' />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label='酬金' {...formItemLayout}>
            {getFieldDecorator('salary', {
              initialValue: flag === 'create' ? '' : record.salary,
              rules: [
                { required: true, message: '酬金不能为空!' },
              ],
            })(
              <InputNumber min={1} />
            )}
          </Form.Item>
          <Form.Item>
            <Button 
              style={{ marginRight: '8px' }}
              onClick={() => { 
                this.props.history.goBack();
                resetFields();
              }}
            >
              取消
            </Button>
            <Button type="primary" htmlType="submit">确认添加</Button>
          </Form.Item>
        </Form>
      </Card>
    )
  }
}

const BusinessForm  = Form.create({ name: 'business' })(BusinessCreate);

export default BusinessForm ;
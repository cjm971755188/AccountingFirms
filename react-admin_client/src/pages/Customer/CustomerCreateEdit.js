import React, { Component } from 'react';
import { Card, Form, Input, Button, message, Radio, Select } from 'antd';
import { connect } from 'dva';

import SearchPerson from '../../components/searchPerson'

const { Option } = Select;

@connect(({ customer, loading }) => ({
  customer,
  loading: loading.effects['customer/create'] || loading.effects['customer/edit'],
}))
class CustomerCreateEdit extends Component {
  constructor(props) {
    super(props);
    const { flag, record } = this.props.history.location.state
    this.state = {
      visible: false,
      uid: flag === 'create' ? null : record.cid,
      username: flag === 'create' ? null : record.username,
      name: flag === 'create' ? null : record.name
    }
  }

  UNSAFE_componentWillMount () {
    const { record } = this.props.history.location.state
    if (record && record.isAccount === '是') {
      this.setState({
        visible: true
      })
    }
  }

  handleSubmit = e => {
    const { dispatch } = this.props
    const { uid, username, name } = this.state
    const { flag, record } = this.props.history.location.state
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('create-values: ', values)
      if (!err) {
        dispatch({
          type: flag === 'create' ? 'customer/create' : 'customer/edit',
          payload: {
            cid: flag === 'create' ? null : record.cid,
            uid,
            username,
            uname: name,
            ...values
          }
        })
          .then((res) => {
            if (res.msg === '') {
              message.success(flag === 'create' ? '添加客户成功！': '修改客户信息成功！')
              this.props.history.replace('/home/customer/list');
              this.props.form.resetFields();
            } else {
              message.error(res.msg)
            }
          })
          .catch((e) => {
            message.error(e);
          });
      }
    });
  };

  getPersonValues = (values) => {
    this.setState({
      uid: values.uid,
      username: values.username,
      name: values.name
    })
  }

  render () {
    const { getFieldDecorator, resetFields } = this.props.form;
    const { flag, record } = this.props.history.location.state
    const {
      customer: { 
        customerTypes: { customerTypes = [] }
      },
      dispatch
    } = this.props
    const { visible } = this.state
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
    }
    return (
      <Card title={flag === 'create' ? '添加客户' : '修改客户信息'}>
        <Form onSubmit={this.handleSubmit} layout='horizontal' labelAlign='left'>
          <Form.Item label='税号' {...formItemLayout}>
            {getFieldDecorator('ID', {
              initialValue: flag === 'create' ? '' : record.ID,
              rules: [
                { required: true, message: '税号不能为空!' },
              ],
            })(
              <Input placeholder="请输入客户公司税号" />,
            )}
          </Form.Item>
          <Form.Item label='公司名称' {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: flag === 'create' ? '' : record.name,
              rules: [
                { required: true, message: '公司名称不能为空!' },
              ],
            })(
              <Input placeholder="请输入客户公司名称" />,
            )}
          </Form.Item>
          <Form.Item label='结算类型' {...formItemLayout}>
            {getFieldDecorator('ctid', {
              initialValue: flag === 'create' ? '' : record.ctid,
              rules: [
                { required: true, message: '结算类型不能为空!' },
              ],
            })(
              <Select 
                placeholder="请选择客户的结算类型"
                onFocus={() => {
                  dispatch({
                    type: 'customer/getCustomerTypes',
                    payload: {}
                  })
                }}
              >
                {customerTypes && customerTypes.map((value, key) => {
                  return <Option value={value.ctid} key={value.ctid}>{value.name}</Option>
                })}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label='结算酬金' {...formItemLayout}>
            {getFieldDecorator('salary', {
              initialValue: flag === 'create' ? '' : record.salary,
              rules: [
                { required: true, message: '结算酬金不能为空!' },
              ],
            })(
              <Input placeholder="请输入客户的结算酬金" />,
            )}
          </Form.Item>
          <Form.Item label='是否做账' {...formItemLayout}>
            {getFieldDecorator('isAccount', {
              initialValue: flag === 'create' ? '' : record.isAccount,
              rules: [
                { required: true, message: '做账判定不能为空!' },
              ],
            })(
              <Radio.Group>
                <Radio value='是' onClick={() => { this.setState({ visible: true}) }}>是</Radio>
                <Radio value='否' onClick={() => { this.setState({ visible: false}) }}>否</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          {visible ? <Form.Item label='负责会计' {...formItemLayout}>
            <SearchPerson sendValues={this.getPersonValues} width='100%' username={record ? record.username : null} name={record ? record.uname : null} pid='2' />
          </Form.Item> : null}
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
            <Button type="primary" htmlType="submit" >{flag === 'create' ? '确认添加' : '确认修改'}</Button>
          </Form.Item>
        </Form>
      </Card>
    )
  }
}

const CustomerForm  = Form.create({ name: 'customer' })(CustomerCreateEdit);

export default CustomerForm ;
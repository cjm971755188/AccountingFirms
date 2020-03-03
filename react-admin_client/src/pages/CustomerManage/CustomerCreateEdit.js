import React, { Component } from 'react';
import { Card, Form, Input, Button, message, Radio, Select } from 'antd';
import { connect } from 'dva';

const { Option } = Select;

@connect(({ customerManage, loading }) => ({
  customerManage,
  loading: loading.effects['customerManage/create'] || loading.effects['customerManage/edit'],
}))
class CustomerCreateEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }

  UNSAFE_componentWillMount () {
    const{ dispatch } = this.props
    const { record } = this.props.history.location.query
    dispatch({
      type: 'customerManage/getAccountants',
      payload: {},
    })
    if (record && record.makeAccount === '是') {
      this.setState({
        visible: true
      })
    }
  }

  handleSubmit = e => {
    const { dispatch } = this.props
    const { flag } = this.props.history.location.query
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('create-values: ', values)
      if (!err) {
        dispatch({
          type: flag === 'create' ? 'customerManage/create' : 'customerManage/edit',
          payload: values
        })
          .then(() => {
            message.success(flag === 'create' ? '添加客户成功！': '修改客户信息成功！')
            this.props.history.replace('/home/customerManage/list');
            this.props.form.resetFields();
          })
      }
    });
  };

  render () {
    const { getFieldDecorator, resetFields } = this.props.form;
    const { flag, record } = this.props.history.location.query
    const {
      customerManage: { 
        accountTypes: { accountTypes = [] },
        accountants: { accountants = [] }
      }
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
            {getFieldDecorator('cID', {
              initialValue: flag === 'create' ? '' : record.cID,
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
            {getFieldDecorator('type', {
              initialValue: flag === 'create' ? '' : record.type,
              rules: [
                { required: true, message: '结算类型不能为空!' },
              ],
            })(
              <Select placeholder="请选择客户的结算类型">
                {accountTypes && accountTypes.map((value, key) => {
                  return <Option value={value.name} key={value.atid}>{value.name}</Option>
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
            {getFieldDecorator('makeAccount', {
              initialValue: flag === 'create' ? '' : record.makeAccount,
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
            {getFieldDecorator('aName', {
              initialValue: flag === 'create' ? '' : (record.aName === '暂无' ? null : record.aName),
              rules: [],
            })(
              <Select placeholder="请选择为客户做账的会计">
                {accountants && accountants.map((value, key) => {
                  return <Option value={value.aid} key={value.aid}>{value.name}</Option>
                })}
              </Select>,
            )}
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
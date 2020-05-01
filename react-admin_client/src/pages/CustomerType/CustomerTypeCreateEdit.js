import React, { Component } from 'react';
import { Card, Form, Input, Button, message, InputNumber } from 'antd';
import { connect } from 'dva';

const { TextArea } = Input;

@connect(({ customerType, loading }) => ({
  customerType,
  loading: loading.effects['customerType/createCustomerType'] || loading.effects['customerType/editCustomerType'],
}))
class CustomerTypeCreateEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  handleSubmit = e => {
    const { dispatch } = this.props
    const { flag, record } = this.props.history.location.state
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: flag === 'create' ? 'customerType/createCustomerType': 'customerType/editCustomerType',
          payload: {
            ctid: flag === 'create' ? null : record.ctid,
            ...values
          }
        })
          .then((res) => {
            if (res.msg === '') {
              message.success(flag === 'create' ? '添加结算类型成功！': '修改结算类型成功！')
              this.props.history.replace('/home/customerType/list');
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

  render () {
    const { getFieldDecorator, resetFields } = this.props.form;
    const { flag, record } = this.props.history.location.state
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
    }
    return (
      <Card title={flag === 'create' ? '添加结算类型' : '修改结算类型信息'}>
        <Form onSubmit={this.handleSubmit} layout='horizontal' labelAlign='left'>
          <Form.Item label='结算类型名称' {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: flag === 'create' ? '' : record.name,
              rules: [
                { required: true, message: '结算类型名称不能为空!' },
              ],
            })(
              <Input placeholder="请输入结算类型名称" />,
            )}
          </Form.Item>
          <Form.Item label='描述' {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: flag === 'create' ? '' : record.description,
              rules: [
                { required: true, message: '结算类型名称不能为空!' },
              ],
            })(
              <TextArea
                allowClear 
                placeholder="请输入结算类型的描述（不得超过100个字符）"
                maxLength={100}
                autoSize={{ minRows: 4, maxRows: 10 }}
              />
            )}
          </Form.Item>
          <Form.Item label='结算月数' {...formItemLayout}>
            {getFieldDecorator('count', {
              initialValue: flag === 'create' ? '' : record.count,
              rules: [
                { required: true, message: '月数不能为空!' },
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
            <Button type="primary" htmlType="submit" >{flag === 'create' ? '确认添加' : '确认修改'}</Button>
          </Form.Item>
        </Form>
      </Card>
      
    )
  }
}

const CustomerTypeForm  = Form.create({ name: 'customerType' })(CustomerTypeCreateEdit);

export default CustomerTypeForm ;
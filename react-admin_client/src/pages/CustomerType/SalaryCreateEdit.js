import React, { Component } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { connect } from 'dva';

@connect(({ customerType, loading }) => ({
  customerType,
  loading: loading.effects['customerType/createSalary'] || loading.effects['customerType/editSalary'],
}))
class SalaryCreateEdit extends Component {
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
          type: flag === 'create' ? 'customerType/createSalary': 'customerType/editSalary',
          payload: {
            ctid: record.ctid,
            sid: flag === 'create' ? null : record.sid,
            ctName: record.name,
            ...values
          }
        })
          .then((res) => {
            if (res.msg === '') {
              message.success(flag === 'create' ? '添加酬金类型成功！': '修改酬金金额成功！')
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
      <Card title={flag === 'create' ? '添加酬金类型' : '修改酬金金额'}>
        <Form onSubmit={this.handleSubmit} layout='horizontal' labelAlign='left'>
          {flag === 'create' ? null : <Form.Item label='结算类型名称' {...formItemLayout}>
            {getFieldDecorator('ctName', {
              initialValue: flag === 'create' ? '' : record.ctName,
              rules: [
                { required: true, message: '结算类型名称不能为空!' },
              ],
            })(
              <Input disabled />,
            )}
          </Form.Item>}
          <Form.Item label='酬金金额' {...formItemLayout}>
            {getFieldDecorator('salary', {
              initialValue: flag === 'create' ? '' : record.salary,
              rules: [
                { required: true, message: '酬金金额不能为空!' },
              ],
            })(
              <Input placeholder="请输入酬金金额" />,
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

const SalaryForm  = Form.create({ name: 'salary' })(SalaryCreateEdit);

export default SalaryForm ;
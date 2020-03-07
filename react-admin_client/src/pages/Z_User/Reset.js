import React, { Component } from 'react';
import { Form, Input, Icon, Button } from 'antd';

class Reset extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.history.push({
          pathname: '/user/login',
          state: {}
        })
      }
    });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次密码输入不一致!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  render () {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              { required: true, message: '密码不能为空!' },
              { validator: this.validateToNextPassword },
              { min: 6, message: '密码不能小于6个字符!' }
            ],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type='password'
              placeholder="请输入新设置的密码"
            />,
          )}
        </Form.Item>
        <Form.Item hasFeedback>
          {getFieldDecorator('confirm', {
            rules: [
              { required: true, message: '密码不能为空!' },
              { validator: this.compareToFirstPassword },
              { min: 6, message: '密码不能小于6个字符!' }
            ],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type='password'
              placeholder="请再次输入新设置的密码"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            style={{ width: '100%', margin: '5% 0 0 0' }}
          >
            确认
          </Button>
          <Button 
            style={{ width: '100%', margin: '5% 0 10% 0' }}
            onClick={() => { 
              this.props.history.push({
                pathname: '/user/forget',
                state: {}
              })
            }}
          >
            返回
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

const ResetForm  = Form.create({ name: 'reset' })(Reset);

export default ResetForm ;
import React, { Component } from 'react';
import { Form, Input, Icon, Button } from 'antd';

class Forget extends Component {
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
          pathname: '/user/reset',
          state: {}
        })
      }
    });
  };

  render () {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '工号不得为空!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="请输入工号"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: '手机号不能为空!' }],
          })(
            <Input
              prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="请输入绑定的手机号"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '验证码不能为空!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="验证码"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            style={{ width: '100%', margin: '5% 0 0 0' }}
          >
            重置密码
          </Button>
          <Button 
            style={{ width: '100%', margin: '5% 0 10% 0' }}
            onClick={() => { 
              this.props.history.push({
                pathname: '/user/login',
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

const ForgetForm  = Form.create({ name: 'forget' })(Forget);

export default ForgetForm ;
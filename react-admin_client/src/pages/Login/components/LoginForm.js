import React, { Component } from 'react';
import { Form, Input, Icon, Button } from 'antd';
import { connect } from 'dva';

@connect(({ login }) => ({ login }))
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  handleSubmit = e => {
    const { dispatch } = this.props
    console.log(this.props)
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        dispatch({
          type: 'login/loginUser',
          payload: values
        });
        /* this.props.history.push({
          pathname: '/home/main',
          query: {}
        }) */
      }
    });
  };

  render () {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入工号!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="工号"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [
              { required: true, message: '请输入密码!' },
              { min: 6, message: '密码不能小于6个字符!' }
            ],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="密码"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <a 
            style={{ float: 'right' }} 
            href="/#/login"
            onClick={() => { this.props.sendType('forget') }}
          >
            忘记密码？
          </a>
          <Button 
            type="primary" 
            htmlType="submit" 
            style={{ width: '100%', margin: '5% 0 10% 0' }}
          >
            登录
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

const WrappedNormalLoginForm  = Form.create({ name: 'login' })(Login);

export default WrappedNormalLoginForm ;
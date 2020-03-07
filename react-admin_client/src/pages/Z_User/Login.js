import React, { Component } from 'react';
import { Form, Input, Icon, Button, message } from 'antd';
import { connect } from 'dva';

@connect(({ user, loading }) => ({ 
  user,
  loading: loading.effects['user/userLogin'], 
}))
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  handleSubmit = e => {
    const { dispatch } = this.props
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'user/userLogin',
          payload: values
        })
          .then((res) => {
            if (res.msg === '') {
              this.props.history.push({
                pathname: '/home',
                query: {}
              })
              message.success('登录成功！')
            } else {
              message.error(res.msg)
            }
          })
          .catch((e) => { message.error(e) })
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
          <a style={{ float: 'right' }} href="/user/forget">忘记密码？</a>
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
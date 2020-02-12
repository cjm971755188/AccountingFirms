import React, { Component } from 'react';
import { Card, Row } from 'antd';

import logo from '../../assets/logo.jpg'
import LoginForm from './components/LoginForm'
import ForgetForm from './components/ForgetForm'
import ResetForm from './components/ResetForm'

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'login'
    }
  }

  getForm = type => {
    if (type === 'login') {
      return <LoginForm sendType={this.getType} />
    } else if(type === 'forget') {
      return <ForgetForm sendType={this.getType} />
    } else if(type === 'reset') {
      return <ResetForm sendType={this.getType} />
    }
    return null
  }

  getType = type => {
    this.setState({ type })
  }

  render () {
    const { type } = this.state

    return (
      <div style={{ height: '100vh', display: 'flex' }}>
        <Card style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
          <Row><img src={logo} alt="金蜜果会计事务所Logo" style={{ maxWidth: '40%', margin: '10px 30% 40px 30%' }} /></Row>
          {this.getForm(type)}
        </Card>
      </div>
    )
  }
}

export default Login ;
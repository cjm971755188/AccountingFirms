import React, { Component } from 'react';
import { Card, Form, Button, message, Radio } from 'antd';
import { connect } from 'dva';

import PermissionTree from '../../components/permissionTree'

@connect(({ account, loading }) => ({
  account,
  loading: loading.effects['account/changePermissions'],
}))
class ChangePermissions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pType: this.props.history.location.state.record.pType || '',
      permission: ''
    }
  }

  handleSubmit = e => {
    const { dispatch } = this.props
    const { record } = this.props.history.location.state
    const { permission } = this.state
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'account/changePermissions',
          payload: {
            uid: record.uid,
            did: record.did,
            permission,
            ...values
          }
        })
          .then((res) => {
            if (res.msg === '') {
              message.success('修改权限成功！')
              this.props.history.replace('/home/account/list');
              this.props.form.resetFields();
            } else {
              message.error(res.msg)
            }
          })
      }
    });
  };

  getPermissionValues = (values) => {
    this.setState({ permission: values.permission })
  }

  render () {
    const { getFieldDecorator, resetFields } = this.props.form;
    const { record } = this.props.history.location.state
    const { pType } = this.state
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
    }
    return (
      <Card title={'修改权限信息'}>
        <Form onSubmit={this.handleSubmit} layout='horizontal' labelAlign='left'>
          <Form.Item label='权限类型' {...formItemLayout}>
            {getFieldDecorator('pType', {
              initialValue: record.pType,
              rules: [
                { required: true, message: '权限类型不能为空!' },
              ],
            })(
              <Radio.Group onChange={(value)=> { this.setState({ pType: value.target.value })}}>
                <Radio value='默认'>默认</Radio>
                <Radio value='自定义'>自定义</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          {pType === '自定义' ? <Form.Item label='权限' {...formItemLayout}>
            <PermissionTree permission={record.permission || ''} sendValues={this.getPermissionValues} />
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
            <Button type="primary" htmlType="submit" >确认修改</Button>
          </Form.Item>
        </Form>
      </Card>
      
    )
  }
}

const ChangePermissionsForm  = Form.create({ name: 'changePermissions' })(ChangePermissions);

export default ChangePermissionsForm ;
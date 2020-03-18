import React, { Component } from 'react';
import { Card, Form, Input, Radio, Button, message, Select, Icon, Row, Modal } from 'antd';
import { connect } from 'dva';

import PermissionTree from '../../components/permissionTree'

const { Option } = Select;

@connect(({ account, loading }) => ({
  account,
  loading: loading.effects['account/create'],
}))
class AccountCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pType: '默认',
      permission: ''
    }
  }

  handleSubmit = e => {
    const { dispatch } = this.props
    const { permission } = this.state
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'account/create',
          payload: { 
            permission,
            ...values 
          }
        })
          .then((res) => {
            if (res.msg === '') {
              Modal.info({
                title: '添加账号账号成功！',
                content: (
                  <div>
                    <p>新账号{values.name}的工号为：{res.data.username}，密码为：123456</p>
                    <p>PS: 建议该账号先自行修改登录密码</p>
                  </div>
                ),
                onOk() {},
              })
              this.props.history.replace('/home/account/list');
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

  getPermissionValues = (values) => {
    this.setState({ permission: values.permission })
  }

  render () {
    const { dispatch } = this.props
    const { getFieldDecorator, resetFields } = this.props.form;
    const { account: { departments: { departments = [] } } } = this.props
    const { pType } = this.state
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 16 },
    }
    return (
      <Card title='添加账号'>
        <Form onSubmit={this.handleSubmit} layout='horizontal' labelAlign='left'>
          <Form.Item label='姓名' {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: '',
              rules: [
                { required: true, message: '姓名不能为空!' },
              ],
            })(
              <Input placeholder="请输入账号姓名" style={{ width: '50%' }} />,
            )}
          </Form.Item>
          <Form.Item label='性别' {...formItemLayout}>
            {getFieldDecorator('sex', {
              initialValue: '男',
              rules: [
                { required: true, message: '性别不能为空!' },
              ],
            })(
              <Radio.Group>
                <Radio value='男'>男</Radio>
                <Radio value='女'>女</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          <Form.Item label='联系方式' {...formItemLayout}>
            {getFieldDecorator('phone', {
              initialValue: '',
              rules: [
                { required: true, message: '联系方式不能为空!' },
              ],
            })(
              <Input placeholder="请输入账号的手机号" style={{ width: '50%' }} />,
            )}
          </Form.Item>
          <Form.Item label='部门职位' {...formItemLayout}>
            {getFieldDecorator('did', {
              initialValue: '',
              rules: [
                { required: true, message: '部门职位不能为空!' },
              ],
            })(
              <Select 
                placeholder="请选择账号的部门职位" 
                style={{ width: '50%' }}
                onFocus={() => {
                  dispatch({
                    type: 'account/getDepartments',
                    payload: {}
                  })
                }}
              >
                {departments && departments.map((value, key) => {
                  return <Option value={value.did} key={value.did}>{value.name}</Option>
                })}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label='权限类型' {...formItemLayout}>
            {getFieldDecorator('pType', {
              initialValue: '默认',
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
            <PermissionTree permission='' sendValues={this.getPermissionValues} />
          </Form.Item> : null}
          <Form.Item>
            <Row>
              <Icon type="info-circle" />
              <span>注：账号添加后，默认密码为123456，默认状态为未锁定</span>
            </Row>
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
            <Button type="primary" htmlType="submit">确认添加</Button>
          </Form.Item>
        </Form>
      </Card>
    )
  }
}

const AccountForm  = Form.create({ name: 'account' })(AccountCreate);

export default AccountForm;
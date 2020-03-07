import React, { Component } from 'react';
import { Card, Form, Input, Radio, Button, message, Select, Icon, Row, Modal } from 'antd';
import { connect } from 'dva';

const { Option } = Select;

@connect(({ personManage, loading }) => ({
  personManage,
  loading: loading.effects['personManage/create'] || loading.effects['personManage/edit'],
}))
class PersonCreateEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  handleSubmit = e => {
    const { dispatch } = this.props
    const { flag, record } = this.props.history.location.query
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('values: ', values)
      if (!err) {
        dispatch({
          type: flag === 'create' ? 'personManage/create' : 'personManage/edit',
          payload: flag === 'create' ? values : { uid: record.uid,  ...values }
        })
          .then((res) => {
            if (flag === 'create') {
              Modal.info({
                title: '添加员工成功！',
                content: (
                  <div>
                    <p>新员工{values.name}的工号为：{res.data.username}，密码为：123456</p>
                    <p>PS: 建议该员工先自行修改登录密码</p>
                  </div>
                ),
                onOk() {},
              })
            } else {
              message.success('修改员工信息成功！')
            }
            this.props.history.replace('/home/personManage/list');
            this.props.form.resetFields();
          })
      }
    });
  };

  render () {
    const { dispatch } = this.props
    const { getFieldDecorator, resetFields } = this.props.form;
    const { flag, record } = this.props.history.location.query
    const { personManage: { positions: { positions = [] }, permissions: { permissions = [] } } } = this.props
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 16 },
    }
    return (
      <Card title={flag === 'create' ? '添加员工' : '修改员工信息'}>
        <Form onSubmit={this.handleSubmit} layout='horizontal' labelAlign='left'>
          {flag === 'create' ? null : <Form.Item label='工号' {...formItemLayout}>
            {getFieldDecorator('username', {
              initialValue: record.username,
              rules: [
                { required: true, message: '姓名不能为空!' },
              ],
            })(
              <Input disabled style={{ width: '50%' }} />,
            )}
          </Form.Item>}
          <Form.Item label='姓名' {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: flag === 'create' ? '' : record.name,
              rules: [
                { required: true, message: '姓名不能为空!' },
              ],
            })(
              <Input placeholder="请输入员工姓名" style={{ width: '50%' }} />,
            )}
          </Form.Item>
          <Form.Item label='性别' {...formItemLayout}>
            {getFieldDecorator('sex', {
              initialValue: flag === 'create' ? '' : record.sex,
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
              initialValue: flag === 'create' ? '' : record.phone,
              rules: [
                { required: true, message: '联系方式不能为空!' },
              ],
            })(
              <Input placeholder="请输入员工的手机号" style={{ width: '50%' }} />,
            )}
          </Form.Item>
          <Form.Item label='部门职位' {...formItemLayout}>
            {getFieldDecorator('pid', {
              initialValue: flag === 'create' ? '' : record.pid,
              rules: [
                { required: true, message: '部门职位不能为空!' },
              ],
            })(
              <Select 
                placeholder="请选择员工的部门职位" 
                style={{ width: '50%' }}
                onFocus={() => {
                  dispatch({
                    type: 'personManage/getPositions',
                    payload: {}
                  })
                }}
              >
                {positions && positions.map((value, key) => {
                  return <Option value={value.pid} key={value.pid}>{value.name}</Option>
                })}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label='权限' {...formItemLayout}>
            {getFieldDecorator('mid', {
              initialValue: flag === 'create' ? '' : record.mid,
              rules: [
                { required: true, message: '权限不能为空!' },
              ],
            })(
              <Select 
                placeholder="请选择员工的权限" 
                style={{ width: '50%' }}
                onFocus={() => {
                  dispatch({
                    type: 'personManage/getPermissions',
                    payload: {}
                  })
                }}
              >
                {permissions && permissions.map((value, key) => {
                  return <Option value={value.mid} key={value.mid}>{value.name}</Option>
                })}
              </Select>,
            )}
          </Form.Item>
          {flag === 'create' ? <Form.Item>
            <Row>
              <Icon type="info-circle" />
              <span>注：员工账号添加后，默认密码为123456</span>
            </Row>
          </Form.Item>: null}
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
            <Button type="primary" htmlType="submit">{flag === 'create' ? '确认添加' : '确认修改'}</Button>
          </Form.Item>
        </Form>
      </Card>
    )
  }
}

const PersonForm  = Form.create({ name: 'person' })(PersonCreateEdit);

export default PersonForm ;
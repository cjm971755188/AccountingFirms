import React, { Component } from 'react';
import { Card, Form, Input, Radio, Button, message, Select, Icon, Row } from 'antd';
import { connect } from 'dva';

const { Option } = Select;

@connect(({ personnelManage, loading }) => ({
  personnelManage,
  loading: loading.effects['personnelManage/create'] || loading.effects['personnelManage/edit'],
}))
class PersonCreateEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  UNSAFE_componentWillMount () {
    const { dispatch } = this.props
    dispatch({
      type: 'personnelManage/getPositions',
      payload: {}
    })
  }

  handleSubmit = e => {
    const { dispatch } = this.props
    const { flag } = this.props.history.location.query
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('edit-values: ', values)
      if (!err) {
        dispatch({
          type: flag === 'create' ? 'personnelManage/create' : 'personnelManage/edit',
          payload: values
        })
          .then(() => {
            message.success(flag === 'create' ? '添加员工成功！' : '修改员工信息成功！')
            this.props.history.replace('/home/personnelManage/list');
            this.props.form.resetFields();
          })
      }
    });
  };

  render () {
    const { getFieldDecorator, resetFields } = this.props.form;
    const { flag, record } = this.props.history.location.query
    const { personnelManage: { positions: { positions = [] } } } = this.props
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
    }
    return (
      <Card title={flag === 'create' ? '添加员工' : '修改员工信息'}>
        <Form onSubmit={this.handleSubmit} layout='horizontal' labelAlign='left'>
          {flag === 'create' ? null : <Form.Item label='工号' {...formItemLayout}>
            {getFieldDecorator('uID', {
              initialValue: record.uID,
              rules: [
                { required: true, message: '姓名不能为空!' },
              ],
            })(
              <Input disabled />,
            )}
          </Form.Item>}
          <Form.Item label='姓名' {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: flag === 'create' ? '' : record.name,
              rules: [
                { required: true, message: '姓名不能为空!' },
              ],
            })(
              <Input placeholder="请输入员工姓名" />,
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
              <Input placeholder="请输入员工的手机号" />,
            )}
          </Form.Item>
          <Form.Item label='部门职位' {...formItemLayout}>
            {getFieldDecorator('position', {
              initialValue: flag === 'create' ? '' : record.position,
              rules: [
                { required: true, message: '部门职位不能为空!' },
              ],
            })(
              <Select placeholder="请选择员工的部门职位">
                {positions && positions.map((value, key) => {
                  return <Option value={value.name} key={value.pid}>{value.name}</Option>
                })}
              </Select>,
            )}
          </Form.Item>
          {flag === 'create' ? <Form.Item>
            <Row>
              <Icon type="info-circle" />
              <span>注：员工账号添加后，工号将由系统决定，默认密码为123456，默认权限将于其职位匹配</span>
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
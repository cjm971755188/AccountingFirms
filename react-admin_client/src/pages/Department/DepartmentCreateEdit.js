import React, { Component } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { connect } from 'dva';

import PermissionTree from '../../components/permissionTree'

const { TextArea } = Input;

@connect(({ department, loading }) => ({
  department,
  loading: loading.effects['department/create'] || loading.effects['department/edit'],
}))
class DepartmentCreateEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      permission: ''
    }
  }

  handleSubmit = e => {
    const { dispatch } = this.props
    const { flag, record } = this.props.history.location.state
    const { permission } = this.state
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: flag === 'create' ? 'department/createDepartment': 'department/editDepartment',
          payload: {
            did: flag === 'create' ? null : record.did,
            permission,
            ...values
          }
        })
          .then((res) => {
            if (res.msg === '') {
              message.success(flag === 'create' ? '添加职位成功！': '修改职位成功！')
              this.props.history.replace('/home/department/list');
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
    const { flag, record } = this.props.history.location.state
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
    }
    return (
      <Card title={flag === 'create' ? '添加职位' : '修改职位信息'}>
        <Form onSubmit={this.handleSubmit} layout='horizontal' labelAlign='left'>
          <Form.Item label='职位名称' {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: flag === 'create' ? '' : record.name,
              rules: [
                { required: true, message: '职位名称不能为空!' },
              ],
            })(
              <Input placeholder="请输入职位名称" />,
            )}
          </Form.Item>
          <Form.Item label='描述' {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: flag === 'create' ? '' : record.description,
              rules: [],
            })(
              <TextArea
                allowClear 
                placeholder="请输入部门职位的描述（不得超过100个字符）"
                maxLength={100}
                autoSize={{ minRows: 4, maxRows: 10 }}
              />
            )}
          </Form.Item>
          <Form.Item label='权限' {...formItemLayout}>
            <PermissionTree permission={flag === 'create'  ? '' : (record.permission || '')} sendValues={this.getPermissionValues} />
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

const DepartmentForm  = Form.create({ name: 'department' })(DepartmentCreateEdit);

export default DepartmentForm ;
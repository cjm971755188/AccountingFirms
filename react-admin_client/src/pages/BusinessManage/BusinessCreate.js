import React, { Component } from 'react';
import { Card, Form, Input, Button, message, Select } from 'antd';
import { connect } from 'dva';

const { Option } = Select;

@connect(({ businessManage, loading }) => ({
  businessManage,
  loading: loading.effects['businessManage/create'],
}))
class BusinessCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'new'
    }
  }

  handleSubmit = e => {
    const { dispatch } = this.props
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('edit-values: ', values)
      if (!err) {
        dispatch({
          type: 'businessManage/create',
          payload: values
        })
          .then(() => {
            message.success('添加业务成功！')
            this.props.history.replace('/home/businessManage/list');
            this.props.form.resetFields();
          })
      }
    });
  };

  render () {
    const { getFieldDecorator, resetFields } = this.props.form;
    const { businessManage: { businessTypes: { types } } } = this.props
    const { type } = this.state
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
    }
    return (
      <Card title='添加业务'>
        <Form onSubmit={this.handleSubmit} layout='horizontal' labelAlign='left'>
          <Form.Item label='业务类型' {...formItemLayout}>
            {getFieldDecorator('type', {
              initialValue: '',
              rules: [
                { required: true, message: '业务类型不能为空!' },
              ],
            })(
              <Select 
                placeholder="请选择新建的业务类型" 
                onChange={value => { 
                  if (value === '公司注册') {
                    this.setState({ type: 'new'})
                  } else {
                    this.setState({ type: '' })
                  }
                }}
              >
                {types && types.map((value, key) => {
                  return <Option value={value.name} key={value.btid}>{value.name}</Option>
                })}
              </Select>,
            )}
          </Form.Item>
          {type === 'new' ? null : <><Form.Item label='税号' {...formItemLayout}>
            {getFieldDecorator('cID', {
              initialValue: '',
              rules: [
                { required: true, message: '姓名不能为空!' },
              ],
            })(
              <Input placeholder="请输入公司税号" />,
            )}
          </Form.Item>
          <Form.Item label='公司名称' {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: '',
              rules: [
                { required: true, message: '姓名不能为空!' },
              ],
            })(
              <Input placeholder="请输入公司名称" />,
            )}
          </Form.Item></>}
          <Form.Item label='联系人' {...formItemLayout}>
            {getFieldDecorator('linkName', {
              initialValue: '',
              rules: [
                { required: true, message: '联系人不能为空!' },
              ],
            })(
              <Input placeholder="请输入联系人姓名" />,
            )}
          </Form.Item>
          <Form.Item label='联系电话' {...formItemLayout}>
            {getFieldDecorator('linkPhone', {
              initialValue: '',
              rules: [
                { required: true, message: '联系电话不能为空!' },
              ],
            })(
              <Input placeholder="请输入联系电话" />,
            )}
          </Form.Item>
          <Form.Item label='联系人身份证号' {...formItemLayout}>
            {getFieldDecorator('linkID', {
              initialValue: '',
              rules: [
                { required: true, message: '联系人身份证号不能为空!' },
              ],
            })(
              <Input placeholder="请输入联系人身份证号" />,
            )}
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

const BusinessForm  = Form.create({ name: 'business' })(BusinessCreate);

export default BusinessForm ;
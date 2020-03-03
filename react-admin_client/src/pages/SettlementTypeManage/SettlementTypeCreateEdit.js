import React, { Component } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { connect } from 'dva';

@connect(({ accountTypeManage, loading }) => ({
  accountTypeManage,
  loading: loading.effects['accountTypeManage/create'] || loading.effects['accountTypeManage/edit'],
}))
class SettlementTypeCreateEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  handleSubmit = e => {
    const { dispatch } = this.props
    const { flag } = this.props.history.location.query
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('create-values: ', values)
      if (!err) {
        dispatch({
          type: flag === 'create' ? 'accountTypeManage/create': 'accountTypeManage/edit',
          payload: values
        })
          .then(() => {
            message.success(flag === 'create' ? '添加结算类型成功！': '修改结算类型成功！')
            this.props.history.replace('/home/accountTypeManage/list');
            this.props.form.resetFields();
          })
      }
    });
  };

  render () {
    const { getFieldDecorator, resetFields } = this.props.form;
    const { flag, record } = this.props.history.location.query
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
    }

    return (
      <Card title={flag === 'create' ? '添加结算类型' : '修改结算类型信息'}>
        <Form onSubmit={this.handleSubmit} layout='horizontal' labelAlign='left'>
          <Form.Item label='结算类型名称' {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: flag === 'create' ? '' : record.name,
              rules: [
                { required: true, message: '结算类型名称不能为空!' },
              ],
            })(
              <Input placeholder="请输入结算类型名称" />,
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
            <Button type="primary" htmlType="submit" >{flag === 'create' ? '确认添加' : '确认修改'}</Button>
          </Form.Item>
        </Form>
      </Card>
      
    )
  }
}

const SettlementTypeForm  = Form.create({ name: 'settlementType' })(SettlementTypeCreateEdit);

export default SettlementTypeForm ;
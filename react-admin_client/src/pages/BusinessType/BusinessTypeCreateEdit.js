import React, { Component } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { connect } from 'dva';

const { TextArea } = Input;

@connect(({ businessType, loading }) => ({
  businessType,
  loading: loading.effects['businessType/createBusinessType'] || loading.effects['businessType/editBusinessType'],
}))
class BusinessTypeCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  handleSubmit = e => {
    const { dispatch } = this.props
    const { flag, record } = this.props.history.location.state
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: flag === 'create' ? 'businessType/createBusinessType': 'businessType/editBusinessType',
          payload: {
            btid: flag === 'create' ? null : record.btid,
            ...values
          }
        })
          .then((res) => {
            if (res.msg === '') {
              message.success(flag === 'create' ? '添加业务类型成功！': '修改业务类型成功！')
              this.props.history.replace('/home/businessType/list');
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

  render () {
    const { getFieldDecorator, resetFields } = this.props.form;
    const { flag, record } = this.props.history.location.state
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 16 },
    }
    return (
      <Card title='添加业务类型'>
        <Form onSubmit={this.handleSubmit} layout='horizontal' labelAlign='left'>
          <Form.Item label='业务类型' {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: flag === 'create' ? '' : record.name,
              rules: [
                { required: true, message: '业务类型不能为空!' },
              ],
            })(
              <Input placeholder="请输入业务类型" style={{ width: '50%' }} />,
            )}
          </Form.Item>
          <Form.Item label='类型描述' {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: flag === 'create' ? '' : record.description,
              rules: [
                { required: true, message: '类型描述不能为空!' },
              ],
            })(
              <TextArea
                allowClear 
                style={{ width: '50%' }}
                placeholder="请输入业务类型的描述（不得超过255个字符）"
                maxLength={255}
                autoSize={{ minRows: 4, maxRows: 10 }}
              />
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
            <Button  type="primary" htmlType="submit">{flag === 'create' ? '确认添加' : '确认修改'}</Button>
          </Form.Item>
        </Form>
      </Card>
      
    )
  }
}

const BusinessTypeCreateForm  = Form.create({ name: 'businessTypeCreate' })(BusinessTypeCreate);

export default BusinessTypeCreateForm ;
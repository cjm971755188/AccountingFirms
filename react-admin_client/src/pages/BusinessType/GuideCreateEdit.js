import React, { Component } from 'react';
import { Card, Form, Input, Button, message, Radio, InputNumber } from 'antd';
import { connect } from 'dva';

const { TextArea } = Input;

@connect(({ businessType, loading }) => ({
  businessType,
  loading: loading.effects['businessType/createGuide'] || loading.effects['businessType/editGuide'],
}))
class GuideCreateEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 'next',
      color: '#FF8C00'
    }
  }

  handleSubmit = e => {
    const { dispatch } = this.props
    const { flag, record, steps } = this.props.history.location.state
    const { step, color } = this.state
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: flag === 'create' ? 'businessType/createGuide': 'businessType/editGuide',
          payload: {
            gid: flag === 'create' ? null : record.gid,
            btid: record.btid,
            type: step,
            step: step === 'next' ? steps + 1 : values.step,
            color,
            ...values
          }
        })
          .then((res) => {
            if (res.msg === '') {
              message.success(flag === 'create' ? '添加业务步骤成功！': '修改业务步骤信息成功！')
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
    const { flag, record, steps } = this.props.history.location.state
    const { step, color } = this.state
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
    }
    return (
      <Card title={flag === 'create' ? '添加业务步骤' : '修改业务步骤信息'}>
        <Form onSubmit={this.handleSubmit} layout='horizontal' labelAlign='left'>
          {flag === 'create' ? <Form.Item label='顺序类型' {...formItemLayout}>
            <Radio.Group 
              value={step}
              onChange={(e) => { this.setState({ step: e.target.value }) }} 
            >
              <Radio value={'next'}>默认下一步</Radio>
              <Radio value={'self'}>自选步骤</Radio>
            </Radio.Group>
          </Form.Item> : null}
          {step === 'self' ? <Form.Item label='步骤顺序' {...formItemLayout}>
            {getFieldDecorator('step', {
              initialValue: flag === 'create' ? '' : record.step,
              rules: [
                { required: true, message: '酬金金额不能为空!' },
              ],
            })(
              <InputNumber min={1} max={steps + 1} />
            )}
          </Form.Item> : null}
          <Form.Item label='步骤重要性' {...formItemLayout}>
            <Radio.Group 
              value={flag === 'create' ? color : record.color}
              onChange={(e) => { this.setState({ color: e.target.value }) }} 
            >
              <Radio value={'red'}>重要</Radio>
              <Radio value={'#FF8C00'}>普通</Radio>
              <Radio value={'grey'}>不重要</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label='步骤主题' {...formItemLayout}>
            {getFieldDecorator('title', {
              initialValue: flag === 'create' ? '' : record.title,
              rules: [
                { required: true, message: '步骤主题不能为空!' },
              ],
            })(
              <Input placeholder="请输入步骤主题" />,
            )}
          </Form.Item>
          <Form.Item label='具体描述' {...formItemLayout}>
            {getFieldDecorator('detail', {
              initialValue: flag === 'create' ? '' : record.detail,
              rules: [
                { required: true, message: '具体描述不能为空!' },
              ],
            })(
              <TextArea
                allowClear 
                placeholder="请输入业务步骤的具体描述（不得超过255个字符）"
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
            <Button type="primary" htmlType="submit" >{flag === 'create' ? '确认添加' : '确认修改'}</Button>
          </Form.Item>
        </Form>
      </Card>
      
    )
  }
}

const GuideForm  = Form.create({ name: 'guide' })(GuideCreateEdit);

export default GuideForm ;
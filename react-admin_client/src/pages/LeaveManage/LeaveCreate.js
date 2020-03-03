import React, { Component } from 'react';
import { Card, Form, Input, Radio, Button, message, DatePicker, Icon } from 'antd';
import { connect } from 'dva';

import moment from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

@connect(({ leaveManage, loading }) => ({
  leaveManage,
  loading: loading.effects['leaveManage/create'],
}))
class LeaveCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  handleSubmit = e => {
    const { dispatch } = this.props
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('create-values: ', values)
      if (!err) {
        dispatch({
          type: 'leaveManage/create',
          payload: values
        })
          .then(() => {
            message.success('添加请假单成功！')
            this.props.history.replace('/home/leaveManage/list');
            this.props.form.resetFields();
          })
      }
    });
  };

  render () {
    const { getFieldDecorator, resetFields } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
    }
    return (
      <Card title='添加请假单'>
        <Form onSubmit={this.handleSubmit} layout='horizontal' labelAlign='left'>
          <Form.Item label='工号' {...formItemLayout}>
            {getFieldDecorator('uid', {
              rules: [
                { required: true, message: '工号不能为空!' },
              ],
            })(
              <Input placeholder="请输入员工工号" />,
            )}
          </Form.Item>
          <Form.Item label='类型' {...formItemLayout}>
            {getFieldDecorator('type', {
              rules: [
                { required: true, message: '类型不能为空!' },
              ],
            })(
              <Radio.Group>
                <Radio value='thing'>事假</Radio>
                <Radio value='illness'>病假</Radio>
                <Radio value='others'>其他</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          <Form.Item label='请假理由' {...formItemLayout}>
            {getFieldDecorator('detail', {
              rules: [
                { required: true, message: '请假理由不能为空!' },
              ],
            })(
              <TextArea
                allowClear 
                placeholder="请输入员工请假理由（不得超过255个字符）"
                maxLength={255}
                autoSize={{ minRows: 4, maxRows: 10 }}
              />
            )}
          </Form.Item>
          <Form.Item label='开始日期' {...formItemLayout}>
            {getFieldDecorator('date', {
              rules: [
                { required: true, message: '开始日期不能为空!' },
              ],
            })(
              <RangePicker 
                showTime={{
                  hideDisabledOptions: true,
                  defaultValue: [moment('08:00:00', 'HH:mm:ss'), moment('16:30:00', 'HH:mm:ss')],
                }}
                locale={locale}
                format="YYYY-MM-DD HH:mm:ss" 
              />
            )}
          </Form.Item>
          <Form.Item>
            <Icon type="info-circle" />
            <span>注：管理员主动添加请假单后，审批过程由系统默认为通过</span>
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
            <Button  type="primary"  htmlType="submit">确认添加</Button>
          </Form.Item>
        </Form>
      </Card>
      
    )
  }
}

const LeaveCreateForm  = Form.create({ name: 'leaveCreate' })(LeaveCreate);

export default LeaveCreateForm ;
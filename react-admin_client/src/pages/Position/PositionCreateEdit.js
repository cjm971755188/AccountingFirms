import React, { Component } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { connect } from 'dva';

@connect(({ position, loading }) => ({
  position,
  loading: loading.effects['position/create'] || loading.effects['position/edit'],
}))
class PositionCreateEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  handleSubmit = e => {
    const { dispatch } = this.props
    const { flag } = this.props.history.location.state
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('create-values: ', values)
      if (!err) {
        dispatch({
          type: flag === 'create' ? 'position/create': 'position/edit',
          payload: values
        })
          .then(() => {
            message.success(flag === 'create' ? '添加职位成功！': '修改职位成功！')
            this.props.history.replace('/home/position/list');
            this.props.form.resetFields();
          })
      }
    });
  };

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

const PositionForm  = Form.create({ name: 'position' })(PositionCreateEdit);

export default PositionForm ;
import React, { Component } from 'react';
import { Card, Form, Input, Radio, Button, message, DatePicker, Icon, Select } from 'antd';
import { connect } from 'dva';

import moment from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN';

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select

@connect(({ leaveManage, user, loading }) => ({
  leaveManage,
  user,
  loading: loading.effects['leaveManage/createLeave'],
}))
class LeaveCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      person: [],
      username: '',
      name: ''
    }
  }

  handleSubmit = e => {
    const { dispatch } = this.props
    const { person, username, name } = this.state
    const { user: { user } } = this.props
    const { flag } = this.props.history.location.query
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('create-values: ', values)
      let uid = 0
      for (let i = 0; i < person.length; i++) {
        if (username === person[i].username) {
          uid = person[i].uid
        }
      }
      if (!err) {
        dispatch({
          type: 'leaveManage/create',
          payload: {
            flag,
            uid: flag === 1 ? uid : user.uid,
            username: flag === 1 ? username : user.username,
            name: flag === 1 ? name : user.name,
            type: values.type,
            detail: values.detail,
            startTime: moment(values.times[0]).valueOf(),
            endTime: moment(values.times[1]).valueOf(),
            checkUid: flag === 1 ? user.uid : '',
            checkName: flag === 1 ? user.name : '',
          }
        })
          .then(() => {
            message.success('添加请假单成功！')
            this.props.history.replace('/home/leaveManage/list');
            this.props.form.resetFields();
          })
      }
    });
  };

  handleChange = (value, key) => {
    this.setState({
      username: key.key,
      name: value
    })
  };

  handleFocus = (value) => {
    const { dispatch } = this.props
    dispatch({
      type: 'leaveManage/searchPerson',
      payload: {
        username: '',
        name: '',
        pageNum: 1,
        pageSize: 10000
      }
    })
      .then((res) => {
        this.setState({ person: res.data.data })
      })
  };
  
  handleSearch = (value) => {
    const { dispatch } = this.props
    dispatch({
      type: 'leaveManage/searchPerson',
      payload: {
        username: value,
        name: value,
        pageNum: 1,
        pageSize: 10000
      }
    })
      .then((res) => {
        this.setState({ person: res.data.data })
      })
  }

  render () {
    const { getFieldDecorator, resetFields } = this.props.form;
    const { flag } = this.props.history.location.query
    const { person } = this.state
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
    }
    function disabledDate(current) {
      // Can not select days before today and today
      return current && current < moment().endOf('day');
    }
    return (
      <Card title='添加请假单'>
        <Form onSubmit={this.handleSubmit} layout='horizontal' labelAlign='left'>
          {flag === 1 ? <Form.Item label='员工' {...formItemLayout}>
            {getFieldDecorator('name', {
              rules: [
                { required: true, message: '工号不能为空!' },
              ],
            })(
              <Select
                showSearch
                placeholder="请输入需要请假的员工工号或姓名"
                filterOption={false}
                onFocus={this.handleFocus}
                onChange={this.handleChange}
                onSearch={this.handleSearch}
                notFoundContent={null}
                optionFilterProp="children"
              >
                {person && person.map((value, key) => {
                  return <Option value={value.name} key={value.username}>{value.name}({value.username})</Option>
                })}
              </Select>
            )}
          </Form.Item> : null}
          <Form.Item label='类型' {...formItemLayout}>
            {getFieldDecorator('type', {
              rules: [
                { required: true, message: '类型不能为空!' },
              ],
            })(
              <Radio.Group>
                <Radio value='事假'>事假</Radio>
                <Radio value='病假'>病假</Radio>
                <Radio value='其他'>其他</Radio>
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
                placeholder="请输入员工请假理由（不得超过25个字符）"
                maxLength={25}
                autoSize={{ minRows: 4, maxRows: 4 }}
              />
            )}
          </Form.Item>
          <Form.Item label='请假日期' {...formItemLayout}>
            {getFieldDecorator('times', {
              rules: [
                { required: true, message: '请假日期不能为空!' },
              ],
            })(
              <RangePicker 
                showTime={{
                  hideDisabledOptions: true,
                  defaultValue: [moment('08:00:00', 'HH:mm:ss'), moment('16:30:00', 'HH:mm:ss')],
                }}
                locale={locale}
                format="YYYY-MM-DD HH:mm:ss" 
                disabledDate={disabledDate}
              />
            )}
          </Form.Item>
          <Form.Item>
            <Icon type="info-circle" />
            <span>注：请假必须至少提前一天，管理员主动添加请假单后，审批过程由系统默认为通过</span>
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
import React, { Component } from 'react';
import { Card, Form, Input, Button, message, Radio, Select, Row, Col } from 'antd';
import { connect } from 'dva';

import SearchPerson from '../../components/searchPerson'

const { Option } = Select;

@connect(({ customer, user, loading }) => ({
  customer,
  user,
  loading: loading.effects['customer/create'] || loading.effects['customer/edit'],
}))
class CustomerCreateEdit extends Component {
  constructor(props) {
    super(props);
    const { flag, record } = this.props.history.location.state
    this.state = {
      visible: record && record.isAccount === '是' ? true : false,
      uid: flag === 'create' ? null : (record.uid === 0 ? '' : record.uid),
      ctName: flag === 'create' ? null : record.ctName,
    }
  }

  UNSAFE_componentWillMount () {
    const { dispatch } = this.props
    dispatch({
      type: 'customer/getCustomerTypes',
      payload: {}
    })
    dispatch({
      type: 'customer/getSalarys',
      payload: {}
    })
    dispatch({
      type: 'customer/getUsers',
      payload: {}
    })
  }

  handleSubmit = e => {
    const { user: { user }, dispatch } = this.props
    const { uid } = this.state
    const { flag, record } = this.props.history.location.state
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: flag === 'create' ? 'customer/create' : 'customer/edit',
          payload: {
            cid: flag === 'create' ? null : record.cid,
            uid: user.did === 1 ? uid : user.uid,
            sid: user.did === 1 ? values.sid : record.sid,
            ctid: user.did === 1 ? values.ctid : record.ctid,
            isAccount: user.did === 1 ? values.isAccount : '是',
            ...values
          }
        })
          .then((res) => {
            if (res.msg === '') {
              message.success(flag === 'create' ? '添加客户成功！': '修改客户信息成功！')
              this.props.history.replace('/home/customer/list');
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

  getPersonValues = (values) => {
    this.setState({
      uid: values.uid
    })
  }

  render () {
    const { getFieldDecorator, resetFields } = this.props.form;
    const { flag, record } = this.props.history.location.state
    const {
      user: { user },
      customer: { 
        customerTypes: { customerTypes = [] },
        salarys: { salarys = [] },
        users: { users = [] }
      },
      dispatch
    } = this.props
    const { visible, ctid, uid } = this.state
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
    }
    return (
      <Card title={flag === 'create' ? '添加客户' : '修改客户信息'}>
        <Form onSubmit={this.handleSubmit} layout='horizontal' labelAlign='left'>
          <Form.Item label='税号' {...formItemLayout}>
            {getFieldDecorator('ID', {
              initialValue: flag === 'create' ? '' : record.ID,
              rules: [
                { required: true, message: '税号不能为空!' },
              ],
            })(
              <Input placeholder="请输入客户公司税号" />,
            )}
          </Form.Item>
          <Form.Item label='公司名称' {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: flag === 'create' ? '' : record.name,
              rules: [
                { required: true, message: '公司名称不能为空!' },
              ],
            })(
              <Input placeholder="请输入客户公司名称" />,
            )}
          </Form.Item>
          {user.did === 1 ? <><Form.Item label='结算类型' {...formItemLayout}>
            {getFieldDecorator('ctid', {
              initialValue: flag === 'create' ? '' : record.ctid,
              rules: [
                { required: true, message: '结算类型不能为空!' },
              ],
            })(
              <Select 
                placeholder="请选择客户的结算类型"
                onFocus={() => {
                  dispatch({
                    type: 'customer/getCustomerTypes',
                    payload: {}
                  })
                }}
                onChange={(value, key) => {
                  this.setState({ ctid: key.key })
                  resetFields('salary', '');
                }}
              >
                {customerTypes && customerTypes.map((value, key) => {
                  return <Option value={value.ctid} key={value.ctid}>{value.name}</Option>
                })}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label='结算酬金' {...formItemLayout}>
            {getFieldDecorator('sid', {
              initialValue: flag === 'create' ? '' : record.sid,
              rules: [
                { required: true, message: '结算酬金不能为空!' },
              ],
            })(
              <Select 
                placeholder="请选择客户的结算类型"
                onFocus={() => {
                  dispatch({
                    type: 'customer/getSalarys',
                    payload: { ctid }
                  })
                }}
              >
                {salarys && salarys.map((value, key) => {
                  return <Option value={value.sid} key={value.sid}>{value.salary}</Option>
                })}
              </Select>,
            )}
          </Form.Item></> : null}
          <Form.Item label='联系人' {...formItemLayout}>
            {getFieldDecorator('linkName', {
              initialValue: flag === 'create' ? '' : record.linkName,
              rules: [
                { required: true, message: '联系人名不能为空!' },
              ],
            })(
              <Input placeholder="请输入联系人名" />,
            )}
          </Form.Item>
          <Form.Item label='联系电话' {...formItemLayout}>
            {getFieldDecorator('linkPhone', {
              initialValue: flag === 'create' ? '' : record.linkPhone,
              rules: [
                { required: true, message: '联系电话不能为空!' },
              ],
            })(
              <Input placeholder="请输入客户联系电话" />,
            )}
          </Form.Item>
          {user.did === 1 ? <Form.Item label='是否做账' {...formItemLayout}>
            {getFieldDecorator('isAccount', {
              initialValue: flag === 'create' ? '' : record.isAccount,
              rules: [
                { required: true, message: '做账判定不能为空!' },
              ],
            })(
              <Radio.Group>
                <Radio value='是' onClick={() => { this.setState({ visible: true}) }}>是</Radio>
                <Radio value='否' onClick={() => { this.setState({ visible: false}) }}>否</Radio>
              </Radio.Group>,
            )}
          </Form.Item> : null}
          {visible && user.did === 1 ? 
          <Form.Item>
            <Row>
              <Col span={2}>
                <span style={{ color: 'red', fontWeight: 600 }}>* </span>
                <span style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 500 }}>负责会计:</span>
              </Col>
              <Col span={6}>
                <SearchPerson sendValues={this.getPersonValues} width='100%' uid={uid} users={users} did='2' />
              </Col>
            </Row>
          </Form.Item> : null}
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

const CustomerForm  = Form.create({ name: 'customer' })(CustomerCreateEdit);

export default CustomerForm ;
import React, { Component } from 'react';
import { Card, Form, Input, Upload, Button, message, Icon, Row, Col } from 'antd';
import { connect } from 'dva';


const { TextArea } = Input;
const { Dragger } = Upload;
let id = 0;

@connect(({ businessTypeManage, loading }) => ({
  businessTypeManage,
  loading: loading.effects['businessTypeManage/create'],
}))
class BusinessTypeCreate extends Component {
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
          type: 'businessTypeManage/create',
          payload: values
        })
          .then(() => {
            message.success('添加业务类型成功！')
            this.props.history.replace('/home/businessTypeManage/list');
            this.props.form.resetFields();
          })
      }
    });
  };

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  render () {
    const { getFieldDecorator, resetFields, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 16 },
    }

    const props = {
      name: 'file',
      multiple: true,
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Form.Item
        {...(formItemLayout)}
        label={`第${k+1}步`}
        required={false}
        key={k}
      >
        {getFieldDecorator(`steps[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "请输入业务需要完成的流程步骤名称",
            },
          ],
        })(
          <Row>
            <Col span={8}>
              <Input placeholder="步骤名称" />
              <TextArea
                allowClear 
                placeholder="请输入业务流程需要注意的事项"
                maxLength={255}
                autoSize={{ minRows: 6, maxRows: 6 }}
              />
            </Col>
            <Col span={8} style={{ marginLeft: '8px', marginTop: '5px' }}>
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">点击或拖拽文件进行上传</p>
                <p className="ant-upload-hint">
                  您可以上传该业务流程此步骤需要准备的文档模板，供会计们和实习生门处理业务时参考
                </p>
              </Dragger>
            </Col>
            <Col span={2} style={{ marginLeft: '8px' }}>
            {keys.length > 1 ? (
              <Button>
                <Icon
                  className="dynamic-delete-button"
                  type="minus"
                  onClick={() => this.remove(k)}
                /> 删除该步骤
              </Button>
            ) : null}
            </Col>
          </Row>
        )}
      </Form.Item>
    ));
    return (
      <Card title='添加业务类型'>
        <Form onSubmit={this.handleSubmit} layout='horizontal' labelAlign='left'>
          <Form.Item label='类型名称' {...formItemLayout}>
            {getFieldDecorator('uid', {
              rules: [
                { required: true, message: '工号不能为空!' },
              ],
            })(
              <Input placeholder="请输入员工工号" style={{ width: '50%' }} />,
            )}
          </Form.Item>
          <Form.Item label='类型描述' {...formItemLayout}>
            {getFieldDecorator('type', {
              rules: [
                { required: true, message: '类型不能为空!' },
              ],
            })(
              <TextArea
                allowClear 
                style={{ width: '50%' }}
                placeholder="请输入员工请假理由（不得超过255个字符）"
                maxLength={255}
                autoSize={{ minRows: 4, maxRows: 10 }}
              />
            )}
          </Form.Item>
          <Form.Item label='创建业务流程' {...formItemLayout}>
            <Button type="dashed" onClick={this.add} style={{ width: '50%' }}>
              <Icon type="plus" /> 添加新步骤
            </Button>
          </Form.Item>
          {formItems}
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

const BusinessTypeCreateForm  = Form.create({ name: 'businessTypeCreate' })(BusinessTypeCreate);

export default BusinessTypeCreateForm ;
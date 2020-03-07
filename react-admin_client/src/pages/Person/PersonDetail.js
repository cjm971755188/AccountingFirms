import React, { Component } from 'react';
import { Card, Descriptions } from 'antd';
import { connect } from 'dva';

@connect(({ person, loading }) => ({
  person,
  loading: loading.effects['person/getDetail'],
}))
class PersonDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render () {
    const { 
      person: { 
        detail: { 
          basis,
        } 
      },
    } = this.props
    return (
      <Card title='员工详情'>
        <Descriptions title="基本信息" column={5} bordered>
          {basis && Object.keys(basis).map((value, key) => {
            return <Descriptions.Item label={value}>{basis[value]}</Descriptions.Item>
          })}
        </Descriptions>
      </Card>
    )
  }
}

export default PersonDetail;
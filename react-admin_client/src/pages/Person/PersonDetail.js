import React, { Component } from 'react';
import { Card, Row, Col, Descriptions, Statistic } from 'antd';
import { connect } from 'dva';
import ReactEcharts from 'echarts-for-react';

@connect(({ person, loading }) => ({
  person,
  loading: loading.effects['person/getDetail'],
}))
class PersonDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  UNSAFE_componentWillMount () {
    const { history: { action }, dispatch } = this.props
    const { uid, did } = this.props.history.location.state
    if (action !== 'POP') {
      dispatch({
        type: 'person/reset',
      });
      dispatch({
        type: 'person/getDetail',
        payload: { uid, did },
      });
    } else {
      dispatch({
        type: 'person/getDetail',
        payload: { uid, did },
      });
    }
  }

  render () {
    const { person: { detail = {} } } = this.props
    const { did } = this.props.history.location.state
    return (
      <Card title='员工详情'>
        <Row style={{ height: 240 }}>
          <Row style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>基本信息</Row>
          <Descriptions column={3} bordered>
            {Object.keys(detail.basis || {}).map((value, key) => {
              return <Descriptions.Item label={value} key={key}>{detail.basis[value]}</Descriptions.Item>
            })}
          </Descriptions>
        </Row>
        <Row>
          <Row style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>数据分析</Row>
          {did === 3 ? <><Col span={10}>
            <Row>
              <Col span={11}>
                <Card style={{ height: 150 }}>
                  <Statistic
                    title={<span style={{ fontSize: 20 }}>本月出勤率</span>}
                    value={detail.analysis.attendance.count*100}
                    precision={2}
                    valueStyle={{ color: detail.analysis.attendance.color, fontSize: 30, marginTop: 16 }}
                    suffix='%'
                  />
                </Card>
              </Col>
              <Col span={12} offset={1}>
                <Card style={{ height: 150 }}>
                <Statistic
                  title={<span style={{ fontSize: 20 }}>共完成业务量</span>}
                  value={detail.analysis.sum}
                  valueStyle={{ color: '#FF8C00', fontSize: 30, marginTop: 16 }}
                  suffix='笔'
                />
              </Card>
              </Col>
            </Row>
            <Row style={{ marginTop: 50 }}>
              <Card>
                <ReactEcharts option={detail && detail.analysis.bOption} style={{ height:'300px', width:'100%' }}/>
              </Card>
            </Row>
          </Col>
          <Col span={13} offset={1}>
            <Card>
              <ReactEcharts option={detail && detail.analysis.btOption} style={{ height:'500px', width:'100%' }}/>
            </Card>
          </Col></> : 
          <Row>
            <Col span={5}>
              <Card style={{ height: 150 }}>
                <Statistic
                  title={<span style={{ fontSize: 20 }}>本月出勤率</span>}
                  value={detail.analysis.attendance.count*100}
                  precision={2}
                  valueStyle={{ color: detail.analysis.attendance.color, fontSize: 30, marginTop: 16 }}
                  suffix='%'
                />
              </Card>
              <Card style={{ height: 150, marginTop: 50 }}>
                <Statistic
                  title={<span style={{ fontSize: 20 }}>负责做账的客户量</span>}
                  value={detail.analysis.sum}
                  valueStyle={{ color: '#FF8C00', fontSize: 30, marginTop: 16 }}
                  suffix='位'
                />
              </Card>
            </Col>
            <Col span={18} offset={1}>
              <ReactEcharts option={detail.analysis.option} style={{ height:'400px', width:'100%' }}/>
            </Col>
          </Row>}
        </Row>
      </Card>
    )
  }
}

export default PersonDetail;
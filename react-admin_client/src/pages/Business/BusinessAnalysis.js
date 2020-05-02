import React, { Component } from 'react';
import { Card, Row, Col, List, Statistic, Icon } from 'antd';
import { connect } from 'dva';
import ReactEcharts from 'echarts-for-react';

@connect(({ business, loading }) => ({
  business,
  loading: loading.effects['business/getAnalysis'],
}))
class BusinessAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  UNSAFE_componentWillMount () {
    const { dispatch } = this.props
    dispatch({
      type: 'business/getAnalysis',
      payload: {},
    });
  }

  render () {
    const { 
      business: { 
        analysis: {
          pCount = {},
          cCount = {},
          bCount = {},
          sCount = {},
          aOption = {},
          AList = [],
          BList = [],
          OList = []
        } 
      } 
    } = this.props
    const crownStyle = [
      { fontSize: '40px', color: '#FFA500' },
      { fontSize: '34px', color: '#3CB371', marginLeft: 3 },
      { fontSize: '30px', color: '#00BFFF', marginLeft: 5 },
      { fontSize: '20px', color: '#696969', marginLeft: 10 },
      { fontSize: '20px', color: '#A9A9A9', marginLeft: 10 }
    ]
    const coffeeStyle = [
      { fontSize: '20px', color: '#FF0000' },
      { fontSize: '20px', color: '#FF6347' },
      { fontSize: '20px', color: '#FA8072' },
      { fontSize: '20px', color: '#F08080' },
      { fontSize: '20px', color: '#A9A9A9' }
    ]
    function getValue (count) {
      if (count.now > count.before) {
        return (
          <>
            <Icon type="arrow-up" style={{ fontSize: 14, marginLeft: 10, color: '#FF8C00' }} />
            <span style={{ fontSize: 14, color: '#FF8C00' }}>增长了{count.now - count.before}</span>
          </>
        )
      } else if (count.now < count.before) {
        return (
          <>
            <Icon type="arrow-down" style={{ fontSize: 14, marginLeft: 10, color: '#A9A9A9' }} />
            <span style={{ fontSize: 14, color: '#A9A9A9' }}>减少了{count.before - count.now}</span>
          </>
        )
      }
    }
    return (
      <Card title='数据分析'>
        <Row>
          <Col span={5}>
            <Card style={{ height: 120 }}>
              <Statistic
                title={<span style={{ fontSize: 18, fontWeight: 600 }}>员工总人数</span>}
                value={`${pCount.now}人`}
                valueStyle={{ fontSize: 20, marginTop: 10 }}
                suffix={getValue(pCount)}
              />
            </Card>
          </Col>
          <Col span={5} offset={1}>
            <Card style={{ height: 120 }}>
              <Statistic
                title={<span style={{ fontSize: 18, fontWeight: 600 }}>客户总数</span>}
                value={`${cCount.now}家`}
                valueStyle={{ fontSize: 20, marginTop: 10 }}
                suffix={getValue(cCount)}
              />
            </Card>
          </Col>
          <Col span={5} offset={2}>
            <Card style={{ height: 120 }}>
              <Statistic
                title={<span style={{ fontSize: 18, fontWeight: 600 }}>今年完成其他业务总数</span>}
                value={bCount.now}
                valueStyle={{ fontSize: 20, marginTop: 10 }}
                suffix='笔'
              />
            </Card>
          </Col>
          <Col span={5} offset={1}>
            <Card style={{ height: 120 }}>
              <Statistic
                title={<span style={{ fontSize: 18, fontWeight: 600 }}>今年收益总值</span>}
                value={sCount.now}
                valueStyle={{ fontSize: 20, marginTop: 10 }}
                suffix='元'
              />
            </Card>
          </Col>
          {/* <Col span={12} offset={1}>
            <Card style={{ height: 250 }}>
              <ReactEcharts option={aOption} style={{ height:'120px', width:'100%' }}/>
            </Card>
          </Col>
          <Col span={5} offset={1}>
            <Card style={{ height: 250 }}>
              <Row style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>今年会计部做账超时批评榜</Row>
              <List
                itemLayout="horizontal"
                dataSource={OList}
                renderItem={(item, key) => (
                  <Row style={{ height: 30, fontSize: 16, lineHeight: '20px', color: coffeeStyle[key].color }}>
                    <Col span={1}><Icon type="notification" style={coffeeStyle[key]} /></Col>
                    <Col span={5} offset={1}><span>{item.name}</span></Col>
                    <Col span={16} offset={1} style={{ textAlign: 'right' }}><span>共超时{item.count}次</span></Col>
                  </Row>
                )}
              />
            </Card>
          </Col> */}
        </Row>
        <Row style={{ marginTop: 30 }}>
          <Col span={11}>
            <Card>
              <Row style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>会计部员工贡献榜</Row>
              <List
                itemLayout="horizontal"
                dataSource={AList}
                renderItem={(item, key) => (
                  <Row style={{ height: 50, fontSize: 18, lineHeight: '40px', color: crownStyle[key].color }}>
                    <Col span={1}><Icon type="crown" style={crownStyle[key]} /></Col>
                    <Col span={2} offset={1}><span>{item.name}</span></Col>
                    <Col span={15} offset={1}><span style={{ fontSize: 16, marginLeft: 20 }}>共负责{item.count}家公司</span></Col>
                    <Col span={4} style={{ textAlign: 'right' }}><span>{item.cPay}元</span></Col>
                  </Row>
                )}
              />
            </Card>
          </Col>
          <Col span={11} offset={2}>
            <Card>
              <Row style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>注册部员工贡献榜</Row>
              <List
                itemLayout="horizontal"
                dataSource={BList}
                renderItem={(item, key) => (
                  <Row style={{ height: 50, fontSize: 18, lineHeight: '40px', color: crownStyle[key].color }}>
                    <Col span={1}><Icon type="crown" style={crownStyle[key]} /></Col>
                    <Col span={2} offset={1}><span>{item.name}</span></Col>
                    <Col span={15} offset={1}><span style={{ fontSize: 16, marginLeft: 20 }}>共完成{item.count}笔业务</span></Col>
                    <Col span={4} style={{ textAlign: 'right' }}><span>{item.pay}元</span></Col>
                  </Row>
                )}
              />
            </Card>
          </Col>
        </Row>
      </Card>
    )
  }
}

export default BusinessAnalysis;
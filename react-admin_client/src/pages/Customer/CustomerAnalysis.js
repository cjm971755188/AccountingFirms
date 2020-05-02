import React, { Component } from 'react';
import { Card, Row, Col, List, Statistic, Icon } from 'antd';
import { connect } from 'dva';
import ReactEcharts from 'echarts-for-react';

@connect(({ customer, loading }) => ({
  customer,
  loading: loading.effects['customer/getAnalysis'],
}))
class CustomerAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  UNSAFE_componentWillMount () {
    const { dispatch } = this.props
    dispatch({
      type: 'customer/getAnalysis',
      payload: {},
    });
  }

  render () {
    const { 
      customer: { 
        analysis: {
          count = {},
          salary = {},
          CList = [],
          UList = [],
          OList = [],
          option = {},
        } 
      } 
    } = this.props
    const crownStyle = [
      { fontSize: '35px', color: '#FFA500' },
      { fontSize: '31px', color: '#3CB371', marginLeft: 2 },
      { fontSize: '25px', color: '#00BFFF', marginLeft: 5 },
      { fontSize: '21px', color: '#696969', marginLeft: 7 },
      { fontSize: '21px', color: '#A9A9A9', marginLeft: 7 }
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
            <span style={{ fontSize: 14, color: '#FF8C00' }}>相比去年增加了{count.now - count.before}</span>
          </>
        )
      } else if (count.now < count.before) {
        return (
          <>
            <Icon type="arrow-down" style={{ fontSize: 14, marginLeft: 10, color: '#A9A9A9' }} />
            <span style={{ fontSize: 14, color: '#A9A9A9' }}>相比去年减少了{count.before - count.now}</span>
          </>
        )
      }
    }
    const allready = () => {
      let sum = 0
      for (let i = 0; i < CList.length; i++) {
        sum = sum + CList[i].pay
      }
      return sum
    }
    const year = (new Date()).getFullYear()
    return (
      <Card title={`${year}年客户做账数据分析`}>
        <Row>
          <Col span={5}>
            <Card style={{ height: 130 }}>
              <Statistic
                title={<span style={{ fontSize: 18, fontWeight: 600 }}>客户公司总数</span>}
                value={`${count.now}家`}
                valueStyle={{ fontSize: 20, marginTop: 20 }}
                suffix={getValue(count)}
              />
            </Card>
            <Card style={{ height: 130, marginTop: 40 }}>
              <Statistic
                title={<span style={{ fontSize: 18, fontWeight: 600 }}>客户做账总应获收益</span>}
                value={`${salary.now}元`}
                valueStyle={{ fontSize: 20, marginTop: 20 }}
                suffix={getValue(salary)}
              />
            </Card>
          </Col>
          <Col span={12} offset={1}>
            <Card style={{ height: 300 }}>
              <Row style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>客户公司已获收益榜（共{allready()}元）</Row>
              <List
                itemLayout="horizontal"
                dataSource={CList}
                renderItem={(item, key) => (
                  <Row style={{ height: '45px', fontSize: 18, lineHeight: '40px', color: crownStyle[key].color }}>
                    <Col span={1}><Icon type="crown" style={crownStyle[key]} /></Col>
                    <Col span={18} offset={1}><span>{item.name}</span></Col>
                    <Col span={4} style={{ textAlign: 'right' }}><span>{item.pay}元</span></Col>
                  </Row>
                )}
              />
            </Card>
          </Col>
          <Col span={5} offset={1}>
            <Card style={{ height: 300 }}>
              <Row style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>会计部员工已贡献榜</Row>
              <List
                itemLayout="horizontal"
                dataSource={UList}
                renderItem={(item, key) => (
                  <Row style={{ height: '45px', fontSize: 18, lineHeight: '40px', color: crownStyle[key].color }}>
                    <Col span={4}><Icon type="crown" style={crownStyle[key]} /></Col>
                    <Col span={12} offset={1}><span>{item.name}</span></Col>
                    <Col span={7} style={{ textAlign: 'right' }}><span>{item.pay}元</span></Col>
                  </Row>
                )}
              />
            </Card>
          </Col>
        </Row>
        <Row style={{ marginTop: 30 }}>
          <Col span={18}>
            <Card>
              <ReactEcharts option={option} style={{ height:'300px', width:'100%' }}/>
            </Card>
          </Col>
          <Col span={5} offset={1}>
            <Card style={{ height: 300 }}>
              <Row style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>会计部员工做账超时批评榜</Row>
              <List
                itemLayout="horizontal"
                dataSource={OList}
                renderItem={(item, key) => (
                  <Row style={{ height: 30, fontSize: 16, lineHeight: '20px', color: coffeeStyle[key].color }}>
                    <Col span={4}><Icon type="notification" style={coffeeStyle[key]} /></Col>
                    <Col span={12} offset={1}><span>{item.name}</span></Col>
                    <Col span={7} style={{ textAlign: 'right' }}><span>共超时{item.count}次</span></Col>
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

export default CustomerAnalysis;
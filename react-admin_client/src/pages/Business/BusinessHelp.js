import React, { Component } from 'react';
import { Card, Collapse, Timeline } from 'antd';
import { connect } from 'dva';

const { Panel } = Collapse;

@connect(({ business, loading }) => ({
  business,
  loading: loading.effects['business/getHelp'],
}))
class BusinessHelp extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  UNSAFE_componentWillMount () {
    const { dispatch } = this.props
    dispatch({
      type: 'business/getHelps',
      payload: {}
    });
  }

  render () {
    const { business: { helps: { helps = [] } } } = this.props
    return (
      <>
        <Card title="业务指南">
          <Collapse accordion>
            {helps && helps.map((value, key) => {
              return (
                <Panel header={value.name} key={value.hid}>
                  <Timeline style={{ margin: '16px 16px 0 16px' }}>
                    {value.steps.map((step, key) => {
                      return (
                        <Timeline.Item color={step.color} key={step.id}>
                          <p style={{ fontSize: 16 }}>{step.title}</p>
                          <p>{step.text}</p>
                        </Timeline.Item>
                      )
                    })}
                  </Timeline>
                </Panel>
              )
            })}
          </Collapse>
        </Card>
      </>
    )
  }
}

export default BusinessHelp;
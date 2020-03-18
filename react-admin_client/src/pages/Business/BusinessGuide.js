import React, { Component } from 'react';
import { Card, Collapse, Timeline, Empty } from 'antd';
import { connect } from 'dva';

const { Panel } = Collapse;

@connect(({ business, loading }) => ({
  business,
  loading: loading.effects['business/getGuides'],
}))
class BusinessGuide extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  UNSAFE_componentWillMount () {
    const { dispatch } = this.props
    dispatch({
      type: 'business/getGuides',
      payload: {}
    });
  }

  render () {
    const { business: { guides: { guides = [] } } } = this.props
    return (
      <>
        <Card title="业务指南">
          <Collapse accordion>
            {guides && guides.map((value, key) => {
              return (
                <Panel header={value.name} key={value.btid}>
                  {value.steps.length !== 0 ? <Timeline style={{ margin: '16px 16px 0 16px' }}>
                    {value.steps.map((step, key) => {
                      return (
                        <Timeline.Item color={step.color} key={step.gid}>
                          <p style={{ fontSize: 16 }}>{step.title}</p>
                          <p>{step.detail}</p>
                        </Timeline.Item>
                      )
                    })}
                  </Timeline> : <Empty description='暂无业务步骤' />}
                </Panel>
              )
            })}
          </Collapse>
        </Card>
      </>
    )
  }
}

export default BusinessGuide;
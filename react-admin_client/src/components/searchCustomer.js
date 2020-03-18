import React, { Component } from 'react';
import { Select } from 'antd';
import { connect } from 'dva';

const { Option } = Select

@connect(({ loading }) => ({ loading: loading.effects['user/searchCustomer'] }))
class SearchCustomer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customer: [],
      width: this.props.width || null,
      cid: ''
    }
  }

  handleChange = (value, key) => {
    this.setState({ cid: value })
    this.props.sendValues({ cid: value })
  };

  handleFocus = (value) => {
    const { dispatch } = this.props
    dispatch({
      type: 'user/searchCustomer',
      payload: {
        ID: '',
        name: '',
        pageNum: 1,
        pageSize: 10000,
      }
    })
      .then((res) => {
        this.setState({ customer: res.data.data })
      })
  };
  
  handleSearch = (value) => {
    const { dispatch } = this.props
    dispatch({
      type: 'user/searchCustomer',
      payload: {
        ID: value,
        name: value,
        pageNum: 1,
        pageSize: 10000,
      }
    })
      .then((res) => {
        this.setState({ customer: res.data.data })
      })
  }

  render () {
    const { cid } = this.props
    const { customer, width } = this.state
    return (
      <Select
        showSearch
        value={cid}
        style={{ width }}
        placeholder="请输入客户公司税号或名称"
        filterOption={false}
        onFocus={this.handleFocus}
        onChange={this.handleChange}
        onSearch={this.handleSearch}
        notFoundContent={null}
        optionFilterProp="children"
      >
        {customer && customer.map((value, key) => {
          return <Option value={value.cid} key={value.cid}>{value.name}({value.ID})</Option>
        })}
      </Select>
    )
  }
}

export default SearchCustomer ;
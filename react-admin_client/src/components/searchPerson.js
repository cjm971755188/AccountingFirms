import React, { Component } from 'react';
import { Select } from 'antd';
import { connect } from 'dva';

const { Option } = Select

@connect(({ leave, user, loading }) => ({
  leave,
  user,
  loading: loading.effects['leave/createLeave'],
}))
class SearchPerson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      person: [],
      username: this.props.username || null,
      name: this.props.name || null,
      width: this.props.width || null
    }
  }

  handleChange = (value, key) => {
    const { person } = this.state
    let username = ''
    let name = ''
    for (let i = 0; i < person.length; i++) {
      if (value === person[i].uid) {
        username = person[i].username
        name = person[i].name
      }
    }
    this.setState({ username, name })
    this.props.sendValues({ uid: value, username, name })
  };

  handleFocus = (value) => {
    const { dispatch, pid } = this.props
    dispatch({
      type: 'leave/searchPerson',
      payload: {
        username: '',
        name: '',
        pageNum: 1,
        pageSize: 10000,
        pid: pid || null
      }
    })
      .then((res) => {
        this.setState({ person: res.data.data })
      })
  };
  
  handleSearch = (value) => {
    const { dispatch, pid } = this.props
    dispatch({
      type: 'leave/searchPerson',
      payload: {
        username: value,
        name: value,
        pageNum: 1,
        pageSize: 10000,
        pid: pid || null
      }
    })
      .then((res) => {
        this.setState({ person: res.data.data })
      })
  }

  render () {
    const { person, username, name, width } = this.state
    return (
      <Select
        showSearch
        value={username ? `${name}(${username})`: null}
        style={{ width }}
        placeholder="请输入需要请假的员工工号或姓名"
        filterOption={false}
        onFocus={this.handleFocus}
        onChange={this.handleChange}
        onSearch={this.handleSearch}
        notFoundContent={null}
        optionFilterProp="children"
      >
        {person && person.map((value, key) => {
          return <Option value={value.uid} key={value.uid}>{value.name}({value.username})</Option>
        })}
      </Select>
    )
  }
}

export default SearchPerson ;
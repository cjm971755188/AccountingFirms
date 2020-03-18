import React, { Component } from 'react';
import { Tree } from 'antd';
import { connect } from 'dva';

@connect(({ loading }) => ({ loading: loading.effects['user/getPermissions'] }))
class PermissionTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      expandedKeys: [],
      checkedKeys: [],
      autoExpandParent: true
    }
  }

  UNSAFE_componentWillMount () {
    const { dispatch, permission } = this.props
    dispatch({
      type: 'user/getPermissions',
      payload: {}
    })
      .then((res) => {
        const checkedKeys = permission.split("/")
        this.setState({ treeData: res.data.permissions, checkedKeys })
      })
  }

  onExpand = (expandedKeys) => {
    this.setState({ expandedKeys, autoExpandParent: false })
  };

  onCheck = (checkedKeys) => {
    this.setState({ checkedKeys })
    let permission = ''
    for (let i = 0; i < checkedKeys.length; i++) {
      if (checkedKeys[i+1]) {
        permission = permission + checkedKeys[i] + '/'
      } else {
        permission = permission + checkedKeys[i]
      }
    }
    this.props.sendValues({ permission })
  };

  render () {
    const { treeData } = this.state
    const { expandedKeys, checkedKeys, autoExpandParent } = this.state
    return (
      <Tree
        checkable
        onExpand={this.onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={this.onCheck}
        checkedKeys={checkedKeys}
        treeData={treeData}
      />
    )
  }
}

export default PermissionTree
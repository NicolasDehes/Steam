import React, { Component } from 'react'

export default class Case extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      isShow: false,
      value: this.props.value,
      isBomb: this.props.isBomb
    }
  }

  render() {
    return (
      <div>Case</div>
    )
  }
}

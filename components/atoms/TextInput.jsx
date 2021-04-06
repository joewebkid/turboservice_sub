import React, { Component } from "react";

export default class TextView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props);
    const { placeholder } = this.props;
    return <input {...this.props} placeholder={placeholder} />;
  }
}

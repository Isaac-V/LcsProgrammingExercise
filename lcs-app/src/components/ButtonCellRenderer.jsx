import React from 'react';

export default class ButtonCellRenderer extends React.Component {

  clickedHandler = () => {
    this.props.clicked(this.props.value);
  }

  render() {
    return (
      <button onClick={this.clickedHandler}>&#x1F6C8;</button>
    )
  }
}
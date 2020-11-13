import React from 'react';

import './InfoButtonCellRenderer.css';

/*
  Basic button cell to be used in AG-Grid, simply displays an info icon and calls a provided click handler.
*/
export default class InfoButtonCellRenderer extends React.Component {

  clickedHandler = () => {
    this.props.clicked(this.props.value);
  }

  render() {
    return (
      <button className="info-button" onClick={this.clickedHandler}>&#x1F6C8;</button>
    )
  }
}
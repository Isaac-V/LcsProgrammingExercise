import React from 'react';
import MemberGrid from "./MemberGrid.jsx";

import './App.css';
import './MemberGrid.css';

export default class App extends React.Component {
  render () {
    return (
      <div className="App">
        <h1>Active Members of the U.S. House of Representatives</h1>
        <MemberGrid />
      </div>
    );
  }
}

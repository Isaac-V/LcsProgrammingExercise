import React from 'react';
import MemberGrid from "./MemberGrid.jsx";

import './App.css';
import './MemberGrid.css';

/*
  The App Component controls the main header of the page and the navigation bar.
  It also switches the content of the page based on the user's navigation selection.
*/
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: 'members'
    };
  }

  componentDidMount = () => {
    document.title = "116th U.S. Congress"
  }

  setView = (event) => {
    this.setState({ currentView: event.currentTarget.value });
  }

  render() {
    let view;
    if (this.state.currentView === 'members') {
      view =
        <div>
          <h1>Members of the U.S. House of Representatives<br></br>116<sup>th</sup> Congress</h1>
          <MemberGrid />
        </div>
    } else {
      view =
        <div>
          <h1>Votes of the U.S. House of Representatives<br></br>116<sup>th</sup> Congress</h1>
        </div>
    }

    return (
      <div className="App">
        <div className="nav-controls">
          <input id="members" type="radio" name="s-nav" value="members"
            checked={this.state.currentView === 'members'}
            onChange={this.setView} />
          <input id="votes" type="radio" name="s-nav" value="votes"
            checked={this.state.currentView === 'votes'}
            onChange={this.setView} />

          <label className="nav-select" for="members">Members</label>
          <label className="nav-select" for="votes">Votes</label>
        </div>
        {view}
      </div>
    );
  }
}

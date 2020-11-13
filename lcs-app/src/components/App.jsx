import React from 'react';
import MemberGrid from "./MemberGrid";
import VoteGrid from "./VoteGrid";

import './App.css';

/*
  The App Component displays the heading of the page and the navigation buttons.
  It also switches the content of the page based on the user's navigation selection.
*/
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: 'members'
    };
  }

  // Set page title
  componentDidMount = () => {
    document.title = "116th U.S. Congress"
  }

  // Set page contents based on navigation selection.
  setView = (event) => {
    this.setState({ currentView: event.currentTarget.value });
  }

  render() {
    // Conditionally determine heading and content based on navigation selection.
    let view;
    if (this.state.currentView === 'members') {
      view =
        <div>
          <h1>Members of the House of Representatives<br></br>116<sup>th</sup> U.S. Congress</h1>
          <MemberGrid />
        </div>
    } else {
      view =
        <div>
          <h1>Votes of the House of Representatives<br></br>116<sup>th</sup> U.S. Congress</h1>
          <VoteGrid />
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

          <label className="nav-select" htmlFor="members">Members</label>
          <label className="nav-select" htmlFor="votes">Votes</label>
        </div>
        {view}
      </div>
    );
  }
}

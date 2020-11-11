import React from 'react';
import MemberGrid from "./MemberGrid";

import './App.css';
import './MemberGrid.css';

function App() {
  return (
    <div className="App">
      <h3>Active Members of the U.S. House of Representatives</h3>
      <MemberGrid />
    </div>
  );
}

export default App;

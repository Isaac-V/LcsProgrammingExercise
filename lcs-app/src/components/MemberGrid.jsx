import React from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './MemberGrid.css';

/*
  The MemberGrid Component uses AG-Grid to display useful information about the members of the House of 
  Representatives of the 116th US Congress. It also includes custom sorting logic and buttons
  for paging and filtering.
*/
export default class MemberGrid extends React.Component {
  constructor(props) {
    super(props);
    this.getMembers.bind(this); // Bind async method directly in constructor.
    this.state = {
      page: 0, // Current page
      pageCount: 0, // Total pages as reported by the server
      memberStatus: '', // Current member filter selection
      rowData: [], // Current row data used by the grid
      rowClasses: {
        // apply blue to Democrats
        'blue-shade': function (params) { return params.data.politicalParty === 'Democrat'; },
        // apply red to Republicans
        'red-shade': function (params) { return params.data.politicalParty === 'Republican'; }
      }
    };

    // Instance variables to customize sorting logic for use with an async server call.
    // State variables were not usable for this due to race conditions in AG-Grid behavior.
    this.sortColumn = '';
    this.sortDirection = '';
    this.executeSort = false;
    this.postSortCalled = false;
  }

  // Load grid data from the server on mount
  componentDidMount = () => {
    this.updateGridData(this.state.page);
  }

  // Helper function for setting the current page and reloading the grid row data
  setPage = (pageNum) => {
    this.setState({ page: pageNum }, () => this.updateGridData(pageNum));
  }

  // Functions for paging buttons and inputs
  firstPage = () => {
    this.setPage(0)
  }

  prevPage = () => {
    if (this.state.page > 0) {
      this.setPage(this.state.page - 1)
    }
  }

  nextPage = () => {
    if (this.state.page < this.state.pageCount - 1) {
      this.setPage(this.state.page + 1)
    }
  }

  lastPage = () => {
    this.setPage(this.state.pageCount - 1);
  }

  pageFromInput = (event) => {
    let pageNum = event.target.value
    if (pageNum > 0 && pageNum <= this.state.pageCount) {
      this.setPage(pageNum - 1);
    }
  }

  // Function for setting the filter based on the radio button selection
  setFilter = (event) => {
    this.setState({ memberStatus: event.currentTarget.value }, () => this.setPage(0));
  }

  // Function for loading grid data and setting state based on the server response
  updateGridData = (pageNum) => {
    this.getMembers(pageNum)
      .then(responseData => {
        this.setState({ rowData: this.getGridData(responseData.results), pageCount: responseData.pagination.number_pages });
      });
  }

  // Async function for fetching data from the server, applying filtering and sorting using state and instance variables
  async getMembers(page) {
    let sort = this.sortColumn && this.sortDirection
      ? '&$orderby=' + this.sortColumn + ' ' + this.sortDirection
      : '';
    let filter = '&$filter=status eq \'' + this.state.memberStatus + '\'';
    const response = await fetch(
      'https://clerkapi.azure-api.net/Members/v1/?key=61888da502844defa16dd86096aea78f&$skip=' + page * 10 + filter + sort);
    return response.json();
  }

  // Function that transforms the server response data into useable row data for the grid
  getGridData = (membersData) => {
    return membersData.map(member => {
      let dcOffice = member.addresses.find(address => address.name === "DCOffice");
      let congress = member.congresses?.length ? member.congresses[0] : null

      return {
        name: member.honorificPrefix + ' ' + member.officialName,
        politicalParty: congress.partyAffiliations?.length
          ? member.congresses[0].partyAffiliations[0].name
          : null,
        state: congress?.stateCode,
        district: congress?.stateDistrict,
        officePhone: dcOffice?.telephone,
        officeAddress: dcOffice
          ? dcOffice.streetAddress + ', ' + dcOffice.addressLocality + ' ' + dcOffice.addressRegion + ', ' + dcOffice.postalCode
          : null
      };
    });
  }

  // Sorting functions that disable default sorting behavior and use instance variables to coordinate sort resets
  nameComparator = (valueA, valueB, nodeA, nodeB, isInverted) => {
    if (this.sortColumn !== 'familyName' || this.sortDirection !== (isInverted ? 'asc' : 'desc')) {
      this.sortColumn = 'familyName';
      this.sortDirection = isInverted ? 'asc' : 'desc';
      this.executeSort = true;
    }

    this.postSortCalled = false;
    return 0;
  }

  // PostSort is called at the end of each sort operation by the grid, and it is the only function called on
  // a sort reset, so it must keep track if it has been called twice in a row or if nameComparator has been
  // called in-between.
  postSort = () => {
    if (this.executeSort) {
      this.executeSort = false;
      this.setState({ page: 0 });
      this.updateGridData(0);
    }

    if (this.postSortCalled && this.sortColumn) {
      this.setState({ page: 0 });
      this.sortColumn = '';
      this.sortDirection = '';
      this.postSortCalled = false;
      this.updateGridData(0);
    }
    else {
      this.postSortCalled = true;
    }
  }

  render() {
    return (
      <div>
        <div className="ag-theme-alpine" style={{ width: 1202, height: 480, margin: "auto" }}>
          <AgGridReact
            rowData={this.state.rowData}
            rowClassRules={this.state.rowClasses}
            domLayout="autoHeight"
            tooltipShowDelay={1000}
            postSort={this.postSort}>
            <AgGridColumn field="name" tooltipField='name' sortable='true' comparator={this.nameComparator}></AgGridColumn>
            <AgGridColumn field="politicalParty"></AgGridColumn>
            <AgGridColumn field="state" width={100}></AgGridColumn>
            <AgGridColumn field="district" width={100}></AgGridColumn>
            <AgGridColumn field="officePhone"></AgGridColumn>
            <AgGridColumn field="officeAddress" width={400} tooltipField='officeAddress'></AgGridColumn>
          </AgGridReact>
        </div>
        { this.state.pageCount > 1 && // Only display paging buttons if there is more than one page
          <div className="grid-controls">
            <button className="grid-control-button" onClick={this.firstPage} disabled={this.state.page === 0}>
              &lt;&lt; First Page
            </button>
            <button className="grid-control-button" onClick={this.prevPage} disabled={this.state.page === 0}>
              &lt; Previous Page
            </button>
            <span className="page-title">Page: </span>
            <input className="page-input" type="number" value={this.state.page + 1} onChange={this.pageFromInput} max={this.state.pageCount}></input>
            <button className="grid-control-button" onClick={this.nextPage} disabled={this.state.page === this.state.pageCount - 1}>
              Next Page &gt;
            </button>
            <button className="grid-control-button" onClick={this.lastPage} disabled={this.state.page === this.state.pageCount - 1}>
              Last Page &gt;&gt;
            </button>
          </div>
        }
        <br></br>
        <h3>Member Status</h3>
        <div className="selection-controls">
          <input id="active" type="radio" name="s-status" value=""
            checked={this.state.memberStatus === ''} 
            onChange={this.setFilter} />
          <input id="succeeded" type="radio" name="s-status" value="Succeded"
            checked={this.state.memberStatus === 'Succeded'} 
            onChange={this.setFilter} />
          <input id="resigned" type="radio" name="s-status" value="Resigned"
            checked={this.state.memberStatus === 'Resigned'} 
            onChange={this.setFilter} />
          <input id="passed-away" type="radio" name="s-status" value="Passed Away"
            checked={this.state.memberStatus === 'Passed Away'} 
            onChange={this.setFilter} />

          <label className="status-select" htmlFor="active">Active</label>
          <label className="status-select" htmlFor="succeeded">Succeeded</label>
          <label className="status-select" htmlFor="resigned">Resigned</label>
          <label className="status-select" htmlFor="passed-away">Passed Away</label>
        </div>
      </div>
    );
  }
}
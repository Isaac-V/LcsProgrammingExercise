import React from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import InfoButtonCellRenderer from "./InfoButtonCellRenderer";

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './VoteGrid.css';

/*
  The VoteGrid Component uses AG-Grid to display useful information about the votes conducted within
  the House of Representatives of the 116th US Congress. It includes paging functionality as well
  as the ability to show additional vote count information for each listed event.
*/
export default class VoteGrid extends React.Component {
  constructor(props) {
    super(props);
    this.getVotes.bind(this);
    this.state = {
      page: 0, // Current page
      pageCount: 0, // Total number of pages
      rowData: [], // Vote grid row data
      voteCounts: {}, // Vote count information for all votes
      moreInfoRowData: [], // Displayed vote count information
      rowClasses: {
        // apply blue to Democrats
        'blue-shade': function (params) { return params.data.party === 'Democratic'; },
        // apply red to Republicans
        'red-shade': function (params) { return params.data.party === 'Republican'; }
      }
    };
  }

  // Load grid data on mount
  componentDidMount = () => {
    this.updateGridData(this.state.page);
  }

  // Functions for paging buttons and inputs
  setPage = (pageNum) => {
    this.setState({ page: pageNum, moreInfoRowData: [] }, () => this.updateGridData(pageNum));
  }

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

  // Function for loading grid data and setting state based on the server response
  updateGridData = (pageNum) => {
    this.getVotes(pageNum)
      .then(responseData => {
        this.setState({
          rowData: this.getGridData(responseData.results),
          pageCount: responseData.pagination.number_pages,
          voteCounts: responseData.results.reduce((a, x) => ({ ...a, [x._id]: x.partyTotals ?? x.candidateTotals }), {}),
        });
      });
  }

  // Async function for fetching data from the server
  async getVotes(page) {
    const response = await fetch(
      'https://clerkapi.azure-api.net/Votes/v1/?$filter=superEvent/superEvent/congressNum%20eq%20%27116%27&key=61888da502844defa16dd86096aea78f&$skip=' + page * 10);
    return response.json();
  }

  // Function that transforms the server response data into useable row data for the grid
  getGridData = (votesData) => {
    return votesData.map(vote => {
      return {
        _id: vote._id,
        endDate: (new Date(vote.endDate)).toISOString().split('T')[0],
        voteQuestion: vote.voteQuestion,
        voteType: vote.voteType,
        result: vote.result,
        description: vote.description
      };
    });
  }

  // Function used by the InfoButtonCell to show vote count information for the associated event
  showMoreInfo = (id) => {
    if (this.state.moreInfoRowData !== this.state.voteCounts[id]) {
      this.setState({ moreInfoRowData: this.state.voteCounts[id] });
    } else {
      this.setState({ moreInfoRowData: [] });
    }
  }

  render() {
    // Conditionally display vote count information based on the type of vote count (party or candidate)
    // TODO: Make a better closing UI for the vote count grid
    let moreInfo;
    if (this.state.moreInfoRowData.length > 0) {
      if (this.state.moreInfoRowData[0].party) {
        moreInfo =
          <div className="ag-theme-alpine" style={{ width: 402, margin: "auto" }}>
            <AgGridReact
              rowData={this.state.moreInfoRowData}
              rowClassRules={this.state.rowClasses}
              domLayout="autoHeight">
              <AgGridColumn field="party" width={150}></AgGridColumn>
              <AgGridColumn field="option" headerName="Vote Option" width={150}></AgGridColumn>
              <AgGridColumn field="total" tooltipField='Total Votes' width={100}></AgGridColumn>
            </AgGridReact>
          </div>
      }
      else {
        moreInfo =
          <div className="ag-theme-alpine" style={{ width: 302, margin: "auto" }}>
            <AgGridReact
              rowData={this.state.moreInfoRowData}
              domLayout="autoHeight">
              <AgGridColumn field="option" tooltipField='option' headerName="Vote Option" width={200}></AgGridColumn>
              <AgGridColumn field="total" tooltipField='Total Votes' width={100}></AgGridColumn>
            </AgGridReact>
          </div>
      }
    } else {
      moreInfo = <div></div>
    }

    return (
      <div>
        <div className="vote-grid-component-container">
          <div className="vote-grid-container">
            <div className="ag-theme-alpine" style={{ width: 1202, height: 480, margin: "auto" }}>
              <AgGridReact
                rowData={this.state.rowData}
                domLayout="autoHeight"
                rowClass='gold-shade'
                tooltipShowDelay={1000}
                frameworkComponents={{ buttonCellRenderer: InfoButtonCellRenderer }}>
                <AgGridColumn field="endDate" width={150} headerName="Date"></AgGridColumn>
                <AgGridColumn field="voteQuestion" tooltipField='voteQuestion' width={300}></AgGridColumn>
                <AgGridColumn field="voteType" tooltipField='voteType' width={150}></AgGridColumn>
                <AgGridColumn field="result" width={100}></AgGridColumn>
                <AgGridColumn field="description" tooltipField='description' width={400}></AgGridColumn>
                <AgGridColumn field="_id" width={100} headerName="More Info"
                  cellRenderer='buttonCellRenderer'
                  cellRendererParams={{
                    clicked: this.showMoreInfo,
                  }}></AgGridColumn>
              </AgGridReact>
            </div>
            {this.state.pageCount > 1 && // Only display paging buttons if there is more than one page
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
          </div>
          {moreInfo}
        </div>
      </div>
    );
  }
}
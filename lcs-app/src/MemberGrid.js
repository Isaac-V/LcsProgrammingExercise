import React, { useEffect, useState } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import './MemberGrid.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

async function getMembers(page) {
  let filter = 'status ne \'Succeded\' and status ne \'Resigned\' and status ne \'Passed Away\'';
  const response = await fetch(
    'https://clerkapi.azure-api.net/Members/v1/?key=61888da502844defa16dd86096aea78f&$skip=' + page*10 + '&$filter=' + filter);
  return response.json();
}

function getGridData(membersData) {
  return membersData.map(member => {
    let dcOffice = member.addresses.find(address => address.name === "DCOffice");
    let hometown = member.addresses.find(address => address.name === "Hometown");

    return {
      officialName: member.officialName,
      politicalParty: member.congresses?.length && member.congresses[0].partyAffiliations?.length 
        ? member.congresses[0].partyAffiliations[0].name
        : null,
      state: hometown?.addressRegion,
      officePhone: dcOffice?.telephone,
      officeAddress: dcOffice
        ? dcOffice.streetAddress + ', ' + dcOffice.addressLocality + ' ' + dcOffice.addressRegion + ', ' + dcOffice.postalCode
        : null
    };
  });
}

export default function MemberGrid() {
  const [rowData, setRowData] = useState([]);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  function firstPage() {
    setPage(0);
  }

  function prevPage() {
    if (page > 0){
      setPage(page - 1);
    }
  }

  function nextPage() {
    if (page < pageCount - 1) {
      setPage(page + 1);
    }
  }

  function lastPage() {
    setPage(pageCount - 1);
  }

  useEffect(() => {
    getMembers(page)
    .then(responseData => {
      setRowData(getGridData(responseData.results));
      setPageCount(responseData.pagination.page);
      setPageCount(responseData.pagination.number_pages)
    });
  }, [page]);

  const rowClasses = {
    // apply blue to Democrats
    'blue-shade': function(params) { return params.data.politicalParty === 'Democrat'; },
    // apply red to Republicans
    'red-shade': function(params) { return params.data.politicalParty === 'Republican'; }
  }

  return (
    <div>
      <div className="ag-theme-alpine" style={ { width: 1102, margin: "auto" } }>
        <AgGridReact
            rowData={rowData}
            rowClassRules={rowClasses}
            domLayout="autoHeight">
            <AgGridColumn field="officialName"></AgGridColumn>
            <AgGridColumn field="state" width={100}></AgGridColumn>
            <AgGridColumn field="politicalParty"></AgGridColumn>
            <AgGridColumn field="officePhone"></AgGridColumn>
            <AgGridColumn field="officeAddress" width={400}></AgGridColumn>
        </AgGridReact>
      </div>
      <div className="grid-controls">
        <button className="grid-control-button" onClick={firstPage}>
          &lt;&lt; First Page
        </button>
        <button className="grid-control-button" onClick={prevPage}>
          &lt; Previous Page
        </button>
        <button className="grid-control-button" onClick={nextPage}>
          Next Page &gt;
        </button>
        <button className="grid-control-button" onClick={lastPage}>
          Last Page &gt;&gt;
        </button>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import './MemberGrid.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

async function getMembers() {
  const response = await fetch(
    "https://clerkapi.azure-api.net/Members/v1/?key=61888da502844defa16dd86096aea78f");
  return response.json();
}

export default function MemberGrid() {
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    getMembers()
    .then(rowData => setRowData(getGridData(rowData.results)));
  }, []);

  return (
    <div className="ag-theme-alpine" style={ { height: 400, width: 1000 } } margin={'auto'}>
      <AgGridReact
          rowData={rowData}>
          <AgGridColumn field="officialName" sortable={true} filter={true}></AgGridColumn>
          <AgGridColumn field="oathOfOfficeDate" sortable={true} filter={true}></AgGridColumn>
          <AgGridColumn field="officePhone" sortable={true} filter={true}></AgGridColumn>
          <AgGridColumn field="officeAddress" sortable={true} filter={true} width={400}></AgGridColumn>
      </AgGridReact>
    </div>
  );

  function getGridData(membersData) {
    return membersData.map(member => {
      let dcOffice = member.addresses.find(address => address.name === "DCOffice");

      return {
        officialName: member.officialName,
        oathOfOfficeDate: member.oathOfOfficeDate ? member.oathOfOfficeDate.substring(0, 10) : null,
        officePhone: dcOffice ? dcOffice.telephone : null,
        officeAddress: dcOffice
          ? dcOffice.streetAddress + ', ' + dcOffice.addressLocality + ' ' + dcOffice.addressRegion + ', ' + dcOffice.postalCode
          : null
      };
    });
  }
}
import React, { useEffect, useState } from 'react';
import Member from "./Member";

async function getMembers() {
  const response = await fetch(
    "https://clerkapi.azure-api.net/Members/v1/?key=61888da502844defa16dd86096aea78f");
  return response.json();
}

export default function MemberList() {
  const [data, setData] = useState([]);
  useEffect(() => {
    getMembers().then(memberData => setData(memberData.results));
  }, []);
  return (
    <div>
      {data.map(m => <Member key={m._id} name={m.officialName} />)}
    </div>
  );
}
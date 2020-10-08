import React, { useState } from "react";

import DataTable from "components/DataTable";
import { fetchUsers } from "utils/api";

const Workspace = () => {
  const [users, setUsers] = useState([]);
  const [headers, setHeaders] = useState([]);

  fetchUsers().then(({ data: { results, columns } }) => {
    setUsers(results);
    setHeaders(columns);
  });

  return (
    <div>
      <DataTable headers={headers} rows={users} />
    </div>
  );
};

export default Workspace;

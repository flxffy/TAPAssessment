import React, { useState, useReducer, useEffect } from "react";

import RangeInput from "components/RangeInput";
import DataTable from "components/DataTable";
import { fetchUsers } from "utils/api";

import reducer, { initialState } from "./reducer";
import useStyles from "./useStyles";

const Workspace = () => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [filters, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchUsers(filters).then(({ data: { results, columns } }) => {
      setUsers(results);
      setHeaders(columns);
    });
  }, [filters]);

  const onSetSalaryFilter = (minSalary, maxSalary) =>
    dispatch({ type: "setSalaryRange", payload: { minSalary, maxSalary } });

  console.log(filters);

  return (
    <div className={classes.container}>
      <RangeInput
        handleSubmit={onSetSalaryFilter}
        inputLabel="Filter by Salary"
        lowerBoundLabel="Minimum"
        upperBoundLabel="Maximum"
        lowerBoundDefaultValue={filters.minSalary}
        upperBoundDefaultValue={filters.maxSalary}
        inputAdornment="$"
        buttonLabel="Filter"
      />
      <DataTable headers={headers} rows={users} />
    </div>
  );
};

export default Workspace;

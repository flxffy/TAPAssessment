import React, { useState, useReducer, useEffect } from "react";

import RangeInput from "components/RangeInput";
import DataTable from "components/DataTable";
import { fetchUsers } from "utils/api";

import reducer, { initialState } from "./reducer";
import { COLUMN_HEADERS } from "./constants";
import useStyles from "./useStyles";

const Workspace = () => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchUsers(state).then(({ data: { results } }) => {
      setUsers(results);
    });
  }, [state]);

  const onSetSalaryFilter = (minSalary, maxSalary) =>
    dispatch({ type: "setSalaryRange", payload: { minSalary, maxSalary } });

  const onSetOrderingParams = (orderBy, order) => {
    dispatch({ type: "setOrderingParams", payload: { params: { order, orderBy } } });
  };

  console.log(state);

  return (
    <div className={classes.container}>
      <RangeInput
        handleSubmit={onSetSalaryFilter}
        inputLabel="Filter by Salary"
        lowerBoundLabel="Minimum"
        upperBoundLabel="Maximum"
        lowerBoundDefaultValue={state.minSalary}
        upperBoundDefaultValue={state.maxSalary}
        inputAdornment="$"
        buttonLabel="Filter"
      />
      <DataTable
        headers={COLUMN_HEADERS}
        rows={users}
        order={state.sort[0] === "+" ? "asc" : "desc"}
        orderBy={state.sort.slice(1)}
        setOrderingParams={onSetOrderingParams}
      />
    </div>
  );
};

export default Workspace;

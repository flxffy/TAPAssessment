import React, { useState, useReducer, useEffect } from "react";

import Button from "@material-ui/core/Button";

import RangeInput from "components/RangeInput";
import DataTable from "components/DataTable";
import FileUpload from "components/FileUpload";
import UserDialog from "components/UserDialog";
import { fetchUsers, uploadUsers, createUser, updateUser } from "utils/api";

import reducer, { initialState } from "./reducer";
import { COLUMN_HEADERS } from "./constants";
import useStyles from "./useStyles";

const Workspace = () => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(-1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogProps, setDialogProps] = useState({});
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.submitting || state.uploading) return;
    fetchUsers(state).then(({ data: { results, count } }) => {
      setUsers(results);
      setCount(count);
    });
  }, [state]);

  const onSetSalaryFilter = (minSalary, maxSalary) => {
    dispatch({ type: "setSalaryRange", payload: { minSalary, maxSalary } });
  };

  const onClearSalaryFilter = () =>
    dispatch({
      type: "setSalaryRange",
      payload: { minSalary: initialState.minSalary, maxSalary: initialState.maxSalary },
    });

  const onSetOrderingParams = (orderBy, order) => {
    dispatch({ type: "setOrderingParams", payload: { params: { order, orderBy } } });
  };

  const onPageChange = (_, page) => {
    dispatch({ type: "setOffset", payload: { offset: page * state.limit } });
  };

  const onUploadUsers = (file) => {
    dispatch({ type: "setUploading", payload: { uploading: true } });
    uploadUsers(file).then(() => {
      dispatch({ type: "setUploading", payload: { uploading: false } });
    });
  };

  const onSubmitUserForm = (action, values, userId) => {
    dispatch({ type: "setSubmitting", payload: { submitting: true } });
    if (action === "create") {
      createUser(values)
        .then(() => {
          window.alert("User has been created successfully");
          setIsDialogOpen(false);
        })
        .catch((err) => window.alert(err))
        .finally(() => dispatch({ type: "setSubmitting", payload: { submitting: false } }));
    }
    if (action === "edit") {
      updateUser(userId, values)
        .then(() => {
          window.alert("User has been updated successfully");
          setIsDialogOpen(false);
        })
        .catch((err) => window.alert(err))
        .finally(() => dispatch({ type: "setSubmitting", payload: { submitting: false } }));
    }
  };

  const onOpenUserDialog = (action, initialState) => {
    setDialogProps({ initialState, action });
    setIsDialogOpen(true);
  };

  const onEditUser = (row) => {
    onOpenUserDialog("edit", row);
  };

  const onDeleteUser = (row) => {
    console.log("delete", row);
  };

  return (
    <div className={classes.container}>
      <RangeInput
        handleSubmit={onSetSalaryFilter}
        handleClear={onClearSalaryFilter}
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
        rowsPerPage={state.limit}
        page={state.offset / state.limit}
        count={count}
        handleChangePage={onPageChange}
        handleEditRow={(row) => onEditUser(row)}
        handleDeleteRow={(row) => onDeleteUser(row)}
      />
      <FileUpload buttonLabel="Upload Users" handleUpload={onUploadUsers} uploading={state.uploading} />
      <Button onClick={() => onOpenUserDialog("create", {})}>Create User</Button>
      <UserDialog
        open={isDialogOpen}
        fields={COLUMN_HEADERS}
        submitting={state.submitting}
        handleSubmit={(action, form, uid) => onSubmitUserForm(action, form, uid)}
        handleClose={() => setIsDialogOpen(false)}
        {...dialogProps}
      />
    </div>
  );
};

export default Workspace;

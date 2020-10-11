import React, { useState, useReducer, useEffect } from "react";

import Button from "@material-ui/core/Button";

import RangeInput from "components/RangeInput";
import DataTable from "components/DataTable";
import FileUpload from "components/FileUpload";
import UserDialog from "components/UserDialog";
import { fetchUsers, uploadUsers, createUser, updateUser, deleteUser } from "utils/api";

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

  const onSetOrderingParams = (sortBy, sortDirection) => {
    dispatch({ type: "setOrderingParams", payload: { params: { sortDirection, sortBy } } });
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

  const onDeleteUser = ({ id }) => {
    dispatch({ type: "setSubmitting", payload: { submitting: true } });
    if (window.confirm("Are you sure? Deletion cannot be reversed.")) {
      deleteUser(id)
        .then(() => window.alert("User has been deleted successfully"))
        .catch((err) => window.alert(err))
        .finally(() => dispatch({ type: "setSubmitting", payload: { submitting: false } }));
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.options}>
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
        <div className={classes.buttons}>
          <FileUpload
            buttonLabel="Upload Users"
            handleUpload={onUploadUsers}
            uploading={state.uploading}
            size="small"
          />
          <Button onClick={() => onOpenUserDialog("create", {})} size="small">
            Create User
          </Button>
        </div>
      </div>
      <DataTable
        headers={COLUMN_HEADERS}
        rows={users}
        sortDirection={state.sort[0] === "+" ? "asc" : "desc"}
        sortBy={state.sort.slice(1)}
        setOrderingParams={onSetOrderingParams}
        rowsPerPage={state.limit}
        page={state.offset / state.limit}
        count={count}
        handleChangePage={onPageChange}
        handleEditRow={(row) => onEditUser(row)}
        handleDeleteRow={(row) => onDeleteUser(row)}
      />

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

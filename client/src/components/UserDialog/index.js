import React, { useState, useEffect } from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

import { getInputType, isPristine } from "utils/forms";

import useStyles from "./useStyles";

const UserDialog = ({ initialState = {}, action, fields, open, handleSubmit, handleClose, submitting }) => {
  const classes = useStyles();
  const { id: userId } = initialState;
  const [formState, setFormState] = useState(initialState);
  const [formErrorMessages, setFormErrorMessages] = useState({});

  useEffect(() => {
    if (!open) return;
    setFormState(initialState);
  }, [open]);

  const handleChange = (field, value) => {
    setFormState({ ...formState, [field]: value });
  };

  const handleCancel = () => {
    if (
      isPristine(initialState, formState) ||
      window.confirm("Are you sure? Any unsaved changes will be discard.")
    ) {
      handleClose();
    }
  };

  const validateForm = (field) => {
    let error;
    if (field === "id" || field === "login" || field === "name") {
      if (!formState[field]) {
        error = "This is a required field.";
      }
    }

    if (field === "salary") {
      if (Number.isNaN(parseFloat(formState[field]))) {
        error = "This is a required field.";
      } else if (formState[field] < 0) {
        error = "Salary must be greater than or equal to 0";
      }
    }

    setFormErrorMessages({ ...formErrorMessages, [field]: error });
  };

  return (
    <Dialog open={open} classes={{ paper: classes.root }} disableBackdropClick disableEscapeKeyDown>
      <DialogTitle className={classes.title}>{`${action} User`}</DialogTitle>
      <DialogContent className={classes.content}>
        {fields.map(({ label: field, type }) => (
          <TextField
            id={field}
            key={field}
            label={field}
            defaultValue={formState[field]}
            required
            inputProps={getInputType(type)}
            onChange={(event) => handleChange(field, event.target.value)}
            onBlur={() => validateForm(field)}
            error={!!formErrorMessages[field]}
            helperText={formErrorMessages[field]}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        {submitting ? (
          <CircularProgress size={24} />
        ) : (
          <Button
            onClick={() => handleSubmit(action, formState, userId)}
            color="primary"
            disabled={
              submitting ||
              isPristine(initialState, formState) ||
              Object.keys(formState).length < fields.length ||
              Object.values(formErrorMessages).some((error) => error)
            }
          >
            {action}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

UserDialog.propTypes = {};

export default UserDialog;

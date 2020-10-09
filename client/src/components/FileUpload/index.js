import React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

import useStyles from "./useStyles";

const FileUpload = ({ buttonLabel, handleUpload, uploading, ...props }) => {
  const classes = useStyles();
  return (
    <div>
      <input
        type="file"
        accept="text/csv"
        id="upload-csv-file"
        className={classes.input}
        onChange={(event) => handleUpload(event.target.files[0])}
      />
      <label htmlFor="upload-csv-file">
        {uploading ? (
          <CircularProgress size={24} />
        ) : (
          <Button variant="contained" color="primary" component="span" disabled={uploading} {...props}>
            {buttonLabel}
          </Button>
        )}
      </label>
    </div>
  );
};

FileUpload.propTypes = {
  buttonLabel: PropTypes.string,
  handleUpload: PropTypes.func,
  uploading: PropTypes.bool,
  props: PropTypes.object,
};

export default FileUpload;

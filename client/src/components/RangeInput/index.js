import React from "react";
import PropTypes from "prop-types";

import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import useStyles from "./useStyles";

const RangeInput = ({
  lowerBoundDefaultValue,
  lowerBoundLabel,
  upperBoundDefaultValue,
  upperBoundLabel,
  inputAdornment,
  buttonLabel,
  handleSubmit,
}) => {
  const classes = useStyles();

  return (
    <form
      className={classes.form}
      onSubmit={(e) => {
        e.preventDefault();
        const lower = parseFloat(document.getElementById("range-lower-bound").value);
        const upper = parseFloat(document.getElementById("range-upper-bound").value);
        handleSubmit(
          Number.isInteger(lower) ? lower : undefined,
          Number.isInteger(upper) ? upper : undefined
        );
      }}
    >
      <TextField
        id="range-lower-bound"
        label={lowerBoundLabel}
        variant="outlined"
        size="small"
        defaultValue={lowerBoundDefaultValue}
        type="number"
        InputProps={{
          inputProps: { min: 0 },
          startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
        }}
      />
      <Typography>-</Typography>
      <TextField
        id="range-upper-bound"
        label={upperBoundLabel}
        variant="outlined"
        size="small"
        type="number"
        defaultValue={upperBoundDefaultValue}
        InputProps={{
          inputProps: { min: 0 },
          startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
        }}
      />
      <Button type="submit" variant="outlined" size="small">
        {buttonLabel}
      </Button>
    </form>
  );
};

RangeInput.propTypes = {
  handleSubmit: PropTypes.func,
  lowerBoundLabel: PropTypes.string,
  upperBoundLabel: PropTypes.string,
  lowerBoundDefaultValue: PropTypes.number,
  upperBoundDefaultValue: PropTypes.number,
  inputAdornment: PropTypes.string,
  buttonLabel: PropTypes.string,
};

export default RangeInput;

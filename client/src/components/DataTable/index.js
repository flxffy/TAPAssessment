import React from "react";
import PropTypes from "prop-types";

import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";

import useStyles from "./useStyles";

const DataTable = ({ rows = [], headers = [], order, orderBy, setOrderingParams }) => {
  const classes = useStyles();

  const handleSelectHeader = (header) => {
    if (orderBy === header) {
      setOrderingParams(header, order === "asc" ? "desc" : "asc");
    } else {
      setOrderingParams(header, "asc");
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header} direction={orderBy === header ? order : "asc"}>
                <TableSortLabel
                  active={orderBy === header}
                  direction={orderBy === header ? order : "asc"}
                  onClick={() => handleSelectHeader(header)}
                >
                  {header}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              {headers.map((header) => (
                <TableCell key={`${row.id}-${row[header]}`}>{row[header]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

DataTable.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string),
  rows: PropTypes.arrayOf(PropTypes.object),
};

export default DataTable;

import React from "react";
import PropTypes from "prop-types";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import useStyles from "./useStyles";

const DataTable = ({ rows, headers }) => {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header}>{header}</TableCell>
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

DataTable.defaultProps = {
  headers: ["id", "login", "name", "salary"],
  rows: [
    { id: "e0008", login: "adumbledore", name: "Albus Dumbledore", salary: "0.0" },
    { id: "e0009", login: "dmalfoy", name: "Draco Malfoy", salary: "0.0" },
    { id: "e0006", login: "gwesley", name: "Ginny Weasley", salary: "0.0" },
    { id: "e0001", login: "hpotter", name: "Harry Potter", salary: "0.0" },
    { id: "e0007", login: "hgranger", name: "Hermione Granger", salary: "0.0" },
    { id: "e0005", login: "voldemort", name: "Lord Voldemort", salary: "0.0" },
    { id: "e0002", login: "rwesley", name: "Ron Weasley", salary: "0.0" },
    { id: "e0004", login: "rhagrid", name: "Rubeus Hagrid", salary: "0.0" },
    { id: "e0003", login: "ssnape", name: "Severus Snape", salary: "0.0" },
  ],
};

export default DataTable;

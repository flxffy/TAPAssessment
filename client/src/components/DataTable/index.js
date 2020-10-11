import React from "react";
import PropTypes from "prop-types";

import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import { formatDataEntry } from "./utils";
import useStyles from "./useStyles";

const DataTable = ({
  rows = [],
  headers = [],
  sortDirection,
  sortBy,
  setOrderingParams,
  rowsPerPage,
  page,
  count,
  handleChangePage,
  handleEditRow,
  handleDeleteRow,
}) => {
  const classes = useStyles();

  const handleSelectHeader = (header) => {
    if (sortBy === header) {
      setOrderingParams(header, sortDirection === "asc" ? "desc" : "asc");
    } else {
      setOrderingParams(header, "asc");
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="users table">
        <TableHead className={classes.head}>
          <TableRow>
            {headers.map(({ label }) => (
              <TableCell key={label} direction={sortBy === label ? sortDirection : "asc"}>
                <TableSortLabel
                  active={sortBy === label}
                  direction={sortBy === label ? sortDirection : "asc"}
                  onClick={() => handleSelectHeader(label)}
                >
                  {label}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell>actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              {headers.map(({ label, type }) => (
                <TableCell key={`${row.id}-${label}`}>{formatDataEntry(row[label], type)}</TableCell>
              ))}
              <TableCell key={`${row.id}-actions`}>
                <IconButton aria-label="edit" onClick={() => handleEditRow(row)}>
                  <EditIcon color="action" />
                </IconButton>
                <IconButton aria-label="delete" onClick={() => handleDeleteRow(row)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[]}
              count={count}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

DataTable.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.object),
  rows: PropTypes.arrayOf(PropTypes.object),
  sortDirection: PropTypes.string,
  sortBy: PropTypes.string,
  setOrderingParams: PropTypes.func,
  rowsPerPage: PropTypes.number,
  page: PropTypes.number,
  count: PropTypes.number,
  handleChangePage: PropTypes.func,
  handleEditRow: PropTypes.func,
  handleDeleteRow: PropTypes.func,
};

export default DataTable;

import React from "react";

import Workspace from "containers/Workspace";
import Sidebar from "components/Sidebar";

import useStyles from "./useStyles";

const Dashboard = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Sidebar />
      <Workspace />
    </div>
  );
};

export default Dashboard;

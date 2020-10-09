import React from "react";
import PropTypes from "prop-types";

import Drawer from "@material-ui/core/Drawer";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import useStyles from "./useStyles";

const Sidebar = ({ avatarUrl, username }) => {
  const styleProps = { drawerWidth: 240 };
  const classes = useStyles(styleProps);

  const buttons = Array(5).fill("Button");

  return (
    <Drawer
      className={classes.drawer}
      anchor="left"
      variant="permanent"
      classes={{ paper: classes.drawerPaper }}
    >
      <div className={classes.drawerHeader}>
        <Avatar src={avatarUrl} alt="User Avatar" className={classes.avatar} />
        <Typography variant="body1">{username}</Typography>
      </div>
      <Divider />
      <List>
        {buttons.map((label, index) => (
          <ListItem button key={`${label}-${index}`}>
            <ListItemText primary={label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

Sidebar.propTypes = {
  avatarUrl: PropTypes.string,
  username: PropTypes.string,
};

Sidebar.defaultProps = {
  avatarUrl:
    "https://d33wubrfki0l68.cloudfront.net/f61a669729f94718b8cbe980426210986589a92c/e6a9c/images/programmes/products-and-services/askjamie_thumbnail.jpg",
  username: "Jamie",
};

export default Sidebar;

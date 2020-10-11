import React, { useState } from "react";
import PropTypes from "prop-types";

import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import useStyles from "./useStyles";
import avatars from "./avatars";

const Sidebar = ({ avatarUrl, username, buttons }) => {
  const styleProps = { drawerWidth: 240 };
  const classes = useStyles(styleProps);

  const [open, setOpen] = useState(false);

  const toggleSidebar = () => setOpen(!open);

  const drawer = (
    <>
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
    </>
  );

  return (
    <nav className={classes.drawer}>
      <Hidden mdUp implementation="css">
        {open ? (
          <Drawer
            variant="temporary"
            anchor="left"
            open={open}
            onClose={toggleSidebar}
            classes={{ paper: classes.drawerPaper }}
          >
            {drawer}
          </Drawer>
        ) : (
          <IconButton onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
        )}
      </Hidden>

      <Hidden smDown implementation="css">
        <Drawer open className={classes.drawer} variant="permanent" classes={{ paper: classes.drawerPaper }}>
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  );
};

Sidebar.propTypes = {
  avatarUrl: PropTypes.string,
  username: PropTypes.string,
  buttons: PropTypes.arrayOf(PropTypes.string),
};

Sidebar.defaultProps = {
  avatarUrl: avatars[Math.floor(Math.random() * Math.floor(avatars.length))],
  username: "Jamie",
  buttons: Array(5).fill("Button"),
};

export default Sidebar;

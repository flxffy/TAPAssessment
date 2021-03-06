import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: (props) => props.drawerWidth,
    height: (props) => props.drawerWidth,
  },
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: (props) => props.drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: (props) => props.drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(1, 0),
  },
}));

export default useStyles;

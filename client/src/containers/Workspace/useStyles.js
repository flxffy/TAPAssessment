import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    "& > :not(:first-child)": {
      marginTop: theme.spacing(1),
    },
  },
  options: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    flexWrap: "wrap",
    marginTop: theme.spacing(-0.5),
    "& > *": {
      marginTop: theme.spacing(0.5),
    },
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    "& > :not(:first-child)": {
      marginLeft: theme.spacing(0.5),
    },
  },
}));

export default useStyles;

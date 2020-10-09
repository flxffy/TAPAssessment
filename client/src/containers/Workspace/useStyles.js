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
}));

export default useStyles;

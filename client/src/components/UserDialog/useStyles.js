import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "560px",
    padding: theme.spacing(2, 3),
  },
  title: {
    textTransform: "capitalize",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(3),
    justifyContent: "center",
    alignItems: "space-between",
    "& > :not(:first-child)": {
      marginTop: theme.spacing(2),
    },
  },
}));

export default useStyles;

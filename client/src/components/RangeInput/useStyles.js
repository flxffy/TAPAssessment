import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "row",
    padding: theme.spacing(2),
    alignItems: "center",
    justifyContent: "space-between",
    "& > :not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },
}));

export default useStyles;

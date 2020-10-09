import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "row",
    padding: theme.spacing(2),
    alignItems: "center",
    justifyContent: "space-between",
    width: "75%",
  },
}));

export default useStyles;

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    "& > :not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },
}));

export default useStyles;

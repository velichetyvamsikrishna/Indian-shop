import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            paddingLeft: 120,
            paddingRight: 120,
            paddingTop: 50
        },
        mainTitle: {
            textAlign: "center",
            marginBottom: theme.spacing(4),
        },
        cardContainer: {
            position: "relative",
        },
        card: {
            minWidth: 275,
            textAlign: "center",
            height: "100%",
            transition: "transform 0.3s ease-in-out",
        },
        arrowsContainer: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: theme.spacing(2),
        },
        arrowButton: {
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            borderRadius: "50%",
            padding: theme.spacing(1),
            "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.8)",
            },
        },
    })
);

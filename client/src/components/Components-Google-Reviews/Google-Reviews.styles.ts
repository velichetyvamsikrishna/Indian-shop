import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            background: '#F3F3F3',
            paddingBottom: 50,
            paddingTop: 20
        },
        mainTitle: {
            textAlign: "center",
            marginBottom: theme.spacing(4),
            paddingTop: 20,
        },
        root: {
            flexGrow: 1,
        },
        card: {
            minWidth: 275,
            textAlign: "center",
            height: "auto",
            minHeight: 200,
        },
        cardContent: {
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
        },
        arrowsContainer: {
            display: "flex",
            justifyContent: "center",
            marginTop: theme.spacing(2),
        },
        arrowButton: {
            margin: theme.spacing(0, 1),
        },
    })
);

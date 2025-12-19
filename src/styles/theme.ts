import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
        primary: {
            light: 'lightgrey',
            main: '#3e3e3e',
            dark: 'black',
            contrastText: 'white'
        },
        background: {
            paper: 'lightyellow'
        }
    },
    components: {
        MuiFab: {
            variants: [{
                props: {
                    variant: 'extended'
                },
                style: {
                    borderRadius: '3px'
                }
            }]
        }
    },
    mixins: {
        toolbar: {
            height: 50
        }
    }
});
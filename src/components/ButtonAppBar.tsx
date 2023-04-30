import { Typography, Toolbar, AppBar, Avatar, Box, IconButton } from "@mui/material";
import CachedIcon from '@mui/icons-material/Cached';
import logo from "../img/logo.png";

export default function ButtonAppBar(props: { reloadConfig: () => void }) {
    return (
        <Box sx={{ flexGrow: 1, margin_bottom: 200 }}>
            <AppBar position="static">
                <Toolbar>
                    <Avatar variant="square" alt="Email-Postponement Extension for Gmail" src={logo} sx={{
                        width: 30,
                        height: "auto",
                        marginRight: '10px'
                    }} />
                    <Typography variant="h6" sx={{
                        flexGrow: 1,
                        textAlign: "center"
                    }}>
                        Email-Postponement Extension for Gmail
                    </Typography>
                    <IconButton aria-label="refresh" onClick={() => props.reloadConfig()}>
                        <CachedIcon />
                    </IconButton>

                </Toolbar>
            </AppBar>
        </Box>
    );
}

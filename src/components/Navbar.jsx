import { useContext, useState } from 'react';
import { AppBar, Box, Toolbar, IconButton, Autocomplete, TextField, FormControl, Input, Container, Avatar, Tooltip } from '@mui/material';
import { BASE_URL } from '../assets/BASE_URL';
import axios from 'axios';
import useSignature from '../utils/useSignature'
import SearchIcon from '@mui/icons-material/Search';

import logo from '../assets/img/logo.png';
import { BookContext } from '../context/BookContext';

function ResponsiveAppBar() {
    const user = JSON.parse(sessionStorage.getItem('user'))
    const { setSearchBooks, setSearching } = useContext(BookContext);

    const searchByTitle = (title) => {
        setTimeout(() => {
            setSearching(true)
            const sign = useSignature({ url: `/books/${title}`, })
            
            axios.get(`${BASE_URL}/books/${title}`,
                {
                    headers: {
                        Key: user?.key,
                        sign,
                    }
                }
            ).then(res => {console.log(res.data.data); setSearchBooks(res.data.data) })
            .catch(err => console.error(err))
            .finally(() => setSearching(false))
        }, 500);
    }

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <img src={logo} alt="Logo" className='logo' />

                    <Box sx={{ flexGrow: 1 }}>

                        <FormControl style={{ color: '#fff' }}>
                            <Input placeholder='Search books by title'
                                id="input-with-icon-adornment"
                                startAdornment={
                                    <SearchIcon style={{ color: '#fff' }} />
                                }
                                onChange={e => searchByTitle(e.target.value)}
                            />
                        </FormControl>
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton sx={{ p: 0 }}>
                                <Avatar alt={user?.key ? user.key : "username"} src="" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default ResponsiveAppBar;

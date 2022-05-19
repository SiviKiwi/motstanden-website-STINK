import React, { useState } from 'react';

// Material UI
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { SxProps } from '@mui/system';

import { VariantType } from '../tsTypes/MaterialUiTypes';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contextProviders/Authentication';

import { NavBar, NavLink } from "./appBar/NavBar"
import SideDrawer from './appBar/SideDrawer';
import ThemeSwitcher from './appBar/ThemeSwitcher';
import UserAvatar from "./appBar/UserAvatar"

export default function ResponsiveAppBar(){
    return (
        <AppBar position="static" >
            <Toolbar>
                <DesktopToolbar display={{ xs: "none", md:"flex" }}  />
                <MobileToolBar display={{ xs: "flex", md:"none" }} />
            </Toolbar>
        </AppBar>
    );
};

function DesktopToolbar({ display }: {display: any }){
    return ( 
        <Stack 
            display={display}
            direction="row" 
            alignItems="center" 
            justifyContent="space-between" 
            sx={{width: "100%"}}
            >
            <Stack 
                direction="row"
                alignItems="center"
                spacing={6}>
                <HeaderTitle variant='h5'/>
                <NavBar/>
            </Stack>
            <Stack 
                direction="row" 
                alignItems="center" 
                sx={{justifySelf: "flex-end"}} >
                <ThemeSwitcher/>
                <Divider 
                    light={false} 
                    orientation="vertical" 
                    flexItem
                    variant="middle"
                    sx={{
                        mr: 1,
                        ml: 2,
                        my: 1
                    }}
                    />
                <UserInfo/>  
            </Stack>
        </Stack>
    )
}

function MobileToolBar({ display }: {display: any } ) {
    return ( 
        <Stack 
            display={display}
            direction="row" 
            alignItems="center"
            justifyContent="space-between"
            sx={{width: "100%"}}          
            >
            <SideDrawer />
            <HeaderTitle variant='h6' sx={{pl: 2}}/>
            <UserInfo/>  
        </Stack>
    )
}

function HeaderTitle( {variant, sx }: {variant?: VariantType, sx?: SxProps }) {
    let auth = useAuth()
	return (
        <Typography
            component={RouterLink}
            to={auth.user ? "/hjem" : "/"}
            noWrap
            variant={variant}
            sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
                py: 1,
                ...sx
            }}
            >
            MOTSTANDEN
        </Typography>
	)
}

function UserInfo(){
    let auth = useAuth()
    return  auth.user 
        ? <UserAvatar/> 
        : <NavLink text="Logg Inn" to="/logg-inn" sx={{fontWeight: 600}}/>
}
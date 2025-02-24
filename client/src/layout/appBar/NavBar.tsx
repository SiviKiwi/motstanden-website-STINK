import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/Authentication';

// Material UI 
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {
    Button,
    Divider,
    Link,
    List,
    Menu,
    Stack,
    SxProps,
    Typography
} from "@mui/material";
import { Link as RouterLink, useLocation } from 'react-router-dom';
import ListItemLink from './ListItemLink';

import { UserGroup } from 'common/enums';
import { hasGroupAccess } from 'common/utils';
import * as MenuIcons from './MenuIcons';


export function NavBar() {
    const auth = useAuth()
    return auth.user
        ? <PrivateNavBar />
        : <PublicNavBar />
}

function PrivateNavBar() {
    return (
        <Stack
            component="nav"
            direction="row"
            alignItems="center"
            justifyContent={{ lg: "flex-start", xl: "center" }}
            sx={{ width: "100%", maxWidth: "1200px" }}
            spacing={{ sm: 1, md: 1, lg: 4, xl: 7 }}
        >
            <NavLink text="Hjem" to="/hjem" />
            <NavLink text="Arrangementer" to="/arrangement" />
            <NavLink text="Sitater" to="/sitater" />
            <NavLink text="Rykter" to="/rykter" />
            <NavLink text="Avstemninger" to="/avstemninger" />
            <NavLink text="Traller" to="/studenttraller" />
            <NavLink text="Noter" to="/notearkiv" />
            <AdminDropDown />
            <NavDropDown text="Om oss">
                <List component="nav" disablePadding sx={{ minWidth: 200 }}>
                    <ListItemLink text="Dokumenter" to="/dokumenter" icon={<MenuIcons.Documents />} />
                    <Divider />
                    {/* <ListItemLink text="FAQ" to="/faq" disabled /> */}
                    <Divider/>
                    <ListItemLink text="Styrets Nettsider" to="/styrets-nettsider" icon={<MenuIcons.BoardWebsiteList/>} />
                    <Divider/>
                    <ListItemLink externalRoute text="Wiki" to="https://wiki.motstanden.no/" icon={<MenuIcons.Wiki />} />
                    <Divider/>
                    <ListItemLink text="Lisens" to="/lisens" icon={<MenuIcons.License />} />
                    <ListItemLink text="Framside" to="/framside" icon={<MenuIcons.FrontPage />} />
                    <ListItemLink text="Bli Medlem" to="/bli-medlem" icon={<MenuIcons.BecomeMember />} />
                </List>
            </NavDropDown>
        </Stack>
    )
}

function PublicNavBar() {
    return (
        <Stack
            component="nav"
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={{ md: 6, lg: 12, xl: 16 }}
        >
            <NavDropDown text="Om oss" sx={{ mr: -2 }}>
                <List component="nav" disablePadding sx={{ minWidth: 200 }}>
                    <ListItemLink text="Framside" to="/" icon={<MenuIcons.FrontPage />} />
                    <Divider />
                    <ListItemLink text="Bli Medlem" to="/bli-medlem" icon={<MenuIcons.BecomeMember />} />
                    {/* <ListItemLink text="FAQ" to="/faq" disabled /> */}
                    <Divider />
                    <ListItemLink text="Styrets Nettsider" to="/styrets-nettsider" icon={<MenuIcons.BoardWebsiteList/>} />
                    <Divider />
                    <ListItemLink externalRoute text="Wiki" to="https://wiki.motstanden.no/" icon={<MenuIcons.Wiki />} />
                    <Divider />
                    <ListItemLink text="Lisens" to="/lisens" icon={<MenuIcons.License />} />
                </List>
            </NavDropDown>
            <NavLink text="Studenttraller" to="/studenttraller" />
            <NavLink text="Dokumenter" to="/dokumenter" />
        </Stack>
    )
}

function AdminDropDown() {
    const user = useAuth().user!
    if (hasGroupAccess(user, UserGroup.SuperAdministrator)) {
        return (
            <NavDropDown text="Medlem" sx={{ pr: 0 }}>
                <List component="nav" disablePadding sx={{ minWidth: 200 }}>
                    <ListItemLink text="Ny" to="/medlem/ny" icon={<MenuIcons.MemberAdd />} />
                    <Divider />
                    <ListItemLink text="Liste" to="/medlem/liste" icon={<MenuIcons.MemberList />} />
                </List>
            </NavDropDown>
        )
    }

    return (
        <NavLink text="Medlemmer" to="/medlem/liste" />
    )

}

export function NavLink({ to, text, sx }: { to: string, text: string, sx?: SxProps }) {
    return (
        <Link
            component={RouterLink}
            to={to}
            underline="hover"
            sx={{
                color: "inherit",
                pl: 1,
                ...sx
            }}
        >
            {text}
        </Link>
    )
}

function NavDropDown({ text, sx, children }: { text: string, sx?: SxProps, children?: JSX.Element }) {
    const [isOpen, setIsOpen] = useState(false)
    const anchorEl = useRef(null)

    // Close menu when url changes
    const location = useLocation();
    useEffect(() => setIsOpen(false), [location]);

    return (
        <>
            <Button
                ref={anchorEl}
                onClick={() => setIsOpen(!isOpen)}
                sx={{
                    textTransform: "none",
                    color: "inherit",
                    ...sx
                }}
            >
                <Typography variant="subtitle1" noWrap>
                    {text}
                </Typography>
                {isOpen ? <ExpandLess /> : <ExpandMore />}
            </Button>
            <Menu
                anchorEl={anchorEl.current}
                open={isOpen}
                anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
                transformOrigin={{ horizontal: 'center', vertical: 'top' }}
                onClose={() => setIsOpen(false)}
            >
                {children}
            </Menu>
        </>
    )
}
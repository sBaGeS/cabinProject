import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useHistory } from 'react-router-dom';
import {getToken, removeUserSession, getAdmin} from '../../Utils/Common';
import logo2 from '../../public/photos/logo2.png';

const useStyles = makeStyles(theme => ({


    linksBar: {
        flexGrow: 1,
    },
    linkButton: {
        marginLeft: theme.spacing(2),
        color: "white",
        '&:hover': {
            background: "white",
            color: 'navy',
        }
    },
    appBar: {
        background: "navy",
        color: "White"
    }
}));

export default function Navbar() {

    const classes = useStyles();
    const token = getToken();
    const username = sessionStorage.getItem('user_username')
    let history = useHistory();

    const [anchorEl1, setAnchorEl1] = useState(null);
    const [anchorEl2, setAnchorEl2] = useState(null);
    const [anchorEl3, setAnchorEl3] = useState(null);
    const [anchorEl4, setAnchorEl4] = useState(null);


    const handleClose = () => {
        setAnchorEl1(null);
        setAnchorEl2(null);
        setAnchorEl3(null);
        setAnchorEl4(null);
    };

    if (!token) {
        return (
            <AppBar className={classes.appBar} position="static">
                <Toolbar>
                <Typography variant="h6" className={classes.linksBar}>
                        <img src = {logo2} height="42" width="42"/>
                        <Button className={classes.linkButton} href="/">Home</Button>
                        <Button className={classes.linkButton} aria-controls="simple-menu" aria-haspopup="true" onClick={(e) => setAnchorEl1(e.currentTarget)}>
                        Cabins</Button>
                    <Menu
                        id="cabin-menu"
                        anchorEl={anchorEl1}
                        keepMounted
                        open={Boolean(anchorEl1)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => {handleClose(); history.push('/search_cabins')}}>Search cabins</MenuItem>
                        <MenuItem onClick={() => {handleClose(); history.push('/add_cabin')}}>List a cabin</MenuItem>
                    </Menu>

                    <Button className={classes.linkButton} aria-controls="simple-menu" aria-haspopup="true" onClick={(e) => setAnchorEl4(e.currentTarget)}>
                        Services</Button>
                    <Menu
                        id="service-menu"
                        anchorEl={anchorEl4}
                        keepMounted
                        open={Boolean(anchorEl4)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => {handleClose(); history.push('/show_services')}}>Show services</MenuItem>
                    </Menu>
                    </Typography>
                    <Button href="/login" className={classes.linkButton}>Login</Button>
                    <Button href="/register"className={classes.linkButton}>Register</Button>
                </Toolbar>
            </AppBar>
        )
    }
    else if (token) {
        return (
            <AppBar className={classes.appBar} position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.linksBar}>
                        <img src = {logo2} height="42" width="42"/>
                        <Button className={classes.linkButton} href="/">Home</Button>
                        <Button className={classes.linkButton} aria-controls="simple-menu" aria-haspopup="true" onClick={(e) => setAnchorEl1(e.currentTarget)}>
                        Cabins</Button>
                    <Menu
                        id="cabin-menu"
                        anchorEl={anchorEl1}
                        keepMounted
                        open={Boolean(anchorEl1)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => {handleClose(); history.push('/search_cabins')}}>Search cabins</MenuItem>
                        <MenuItem onClick={() => {handleClose(); history.push('/add_cabin')}}>List a cabin</MenuItem>
                    </Menu>

                    <Button className={classes.linkButton} aria-controls="simple-menu" aria-haspopup="true" onClick={(e) => setAnchorEl4(e.currentTarget)}>
                        Services</Button>
                    <Menu
                        id="service-menu"
                        anchorEl={anchorEl4}
                        keepMounted
                        open={Boolean(anchorEl4)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => {handleClose(); history.push('/show_services')}}>Show services</MenuItem>
                    </Menu>
                    </Typography>

                    {getAdmin() ? <Button style={{textDecoration: "underline", color: "red"}} aria-controls="simple-menu" aria-haspopup="true" onClick={(e) => setAnchorEl3(e.currentTarget)}>Admin tools</Button> : null}

                    <Menu
                        id="admin-menu"
                        anchorEl={anchorEl3}
                        keepMounted
                        open={Boolean(anchorEl3)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => {handleClose(); history.push('/get_customers')}}>Manage customers</MenuItem>
                        <MenuItem onClick={() => {handleClose(); history.push('/add_agency')}}>Add an agency</MenuItem>
                        <MenuItem onClick={() => {handleClose(); history.push('/agencies')}}>Show agencies</MenuItem>
                        <MenuItem onClick={() => {handleClose(); history.push('/add_service')}}>Add a service</MenuItem>
                        <MenuItem onClick={() => {handleClose(); history.push('/get_services')}}>Show services</MenuItem>
                        <MenuItem onClick={() => {handleClose(); history.push('/service_report')}}>Service Report</MenuItem>
                        <MenuItem onClick={() => {handleClose(); history.push('/cabin_report')}}>Cabin Report</MenuItem>
                        <MenuItem onClick={() => {handleClose(); history.push('/cabin_bills')}}>Cabin Bills</MenuItem>
                        <MenuItem onClick={() => {handleClose(); history.push('/service_bills')}}>Service Bills</MenuItem>
                    </Menu>
                   

                    <Button style={{textDecoration: "underline"}} color="inherit" aria-controls="simple-menu" aria-haspopup="true" onClick={(e) => setAnchorEl2(e.currentTarget)}>
                        {username}</Button>
                    <Menu
                        id="user-menu"
                        anchorEl={anchorEl2}
                        keepMounted
                        open={Boolean(anchorEl2)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => {handleClose(); history.push('/account_info')}}>My Account</MenuItem>
                        <MenuItem onClick={() => {handleClose(); history.push('/my_cabins')}}>My Cabins</MenuItem>
                        <MenuItem onClick={() => {handleClose(); history.push('/cabin_report')}}>Cabin Report</MenuItem>
                        <MenuItem onClick={() => {handleClose(); history.push('/my_reservations')}}>My Reservations</MenuItem>
                        <MenuItem onClick={() => { removeUserSession(); window.location.reload() }} >Logout</MenuItem>
                    </Menu>
                   
                </Toolbar>
            </AppBar>
        )
    }
}

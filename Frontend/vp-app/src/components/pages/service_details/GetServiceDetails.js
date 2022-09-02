import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';

import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import { getToken, getUserId, getAdmin } from '../../../Utils/Common';
import dateFormat from 'dateformat';
import PostServiceReservationDialog from '../../postServiceReservation/PostServiceReservationDialog';



const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),

        color: theme.palette.text.secondary,
    },
    tableHeader: {
        backgroundColor: 'navy',

    },
    tableHeaderCell: {
        color: 'white'
    },
    agencyInfo: {
        margin: 4,
        height: 250

    },
    bookButton: {
        margin: 4,
        backgroundColor: 'navy',
        color: 'white',
        '&:hover': {
            background: "white",
            color: 'navy',
        },
    },
}));

export default function GetServiceDetails(props) {

    const classes = useStyles();
    const history = useHistory();

    const serviceId = props.match.params.id;

    const token = getToken();
    const userId = getUserId();

    const [service, setService] = useState([]);
    const [agency, setAgency] = useState([]);
    const [agencyId, setAgencyId] = useState("");
    const [servicesLoaded, setServicesLoaded] = useState(false);

    const [book, setBook] = useState(false);
    const [bookedMsg, setBookedMsg] = useState("");

    let dialog;

    const today = dateFormat(Date(), "dd/mm/yyyy");

    useEffect(() => {
        const getServices = () => {
            axios.get("http://localhost:3001/service?service_id=" + serviceId, {
                headers: {
                    token: token
                }
            })
                .then(function (response) {
                    console.log(response);
                    setService(response.data.services);
                    setServicesLoaded(true); 
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
        
        getServices();
        
    }, []);
    const getAgencies = (a) => {
        axios.get("http://localhost:3001/agency?id=" + service[0].agency_id, {
            headers: {
                token: token
            }
        })
            .then(function (response) {
                console.log(response);
                setAgency(response.data.Agencies);

            })
            .catch(function (error) {
                console.log(error);
            })
            setServicesLoaded(false);
    }
    if(servicesLoaded){
        getAgencies();
    }
    if(book){
        dialog = <PostServiceReservationDialog price = {service[0].price} service = {service[0].name} service_id = {service[0].service_id} agency_id = {agency[0].agency_id}
        book = {setBook} bookedMsg = {setBookedMsg} />;
    }
    else {
        dialog = "";
    }
    return (
        <div>
            <h3>Service Details</h3>
            <Paper className={classes.paper}>
                <Grid container spacing={3}>

                    <Grid item xs={6}>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="customized table">
                                <TableHead className={classes.tableHeader}>
                                    <TableRow>
                                        <TableCell className={classes.tableHeaderCell} align="left">Service</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="left">Price</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {service.map((service, i) => <TableRow key={i}>
                                        <TableCell align="left">{service.name}</TableCell>
                                        <TableCell align="left">{service.price}€</TableCell>
                                    </TableRow>)}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={6}>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="customized table">
                                <TableHead className={classes.tableHeader}>
                                    <TableRow>
                                        <TableCell className={classes.tableHeaderCell} align="center">Information</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {service.map((service, i) => <TableRow key={i}>
                                        <TableCell align="center">{service.info}</TableCell>
                                    </TableRow>)}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="customized table">
                                <TableHead className={classes.tableHeader}>
                                    <TableRow>
                                        <TableCell className={classes.tableHeaderCell} align="left">Agency</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="left">Address</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="left">Postarea</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="left">Phonenumber</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="left">Email</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {agency.map((agency, i) => <TableRow key={i}>
                                        <TableCell align="left">{agency.name}</TableCell>
                                        <TableCell align="left">{agency.address}</TableCell>
                                        <TableCell align="left">{agency.postarea}</TableCell>
                                        <TableCell align="left">{agency.phonenumber}</TableCell>
                                        <TableCell align="left">{agency.email}</TableCell>
                                    </TableRow>)}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Button variant = "contained" className = {classes.bookButton} onClick = {() => setBook(true)}>Book</Button>
                </Grid>
            </Paper>
            {dialog}
        </div>
    )
}
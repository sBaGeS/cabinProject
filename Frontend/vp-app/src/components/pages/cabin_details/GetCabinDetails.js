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
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import queryString from 'query-string';
import DeleteCabinDialog from '../../deleteCabin/DeleteCabinDialog';
import {useHistory} from 'react-router-dom';
import EditCabinDialog from '../../editCabin/EditCabinDialog';
import ContactInfoDialog from '../../contactInfo/ContactInfoDialog';
import BookCabinDialog from '../../bookCabin/BookCabinDialog';
import RemoveReservationDialog from '../../removeReservation/RemoveReservationDialog';
import { getToken, getUserId, getAdmin} from '../../../Utils/Common';
import dateFormat from 'dateformat';



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
    editButton: {
        margin: 8,
        backgroundColor: 'navy',
        color: 'white',
        minWidth: 50,
        float: 'right'
    }
}));

export default function GetCabinDetails(props) {
   
    const classes = useStyles();
    const history = useHistory();

    const cabinId = props.match.params.id;

    const query = queryString.parse(props.location.search);

    const token = getToken();
    const userId = getUserId();

    const [cabin, setCabin] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [removeMsg, setRemoveMsg] = useState("");
    const [editMsg, setEditMsg] = useState("");
    const [remove, setRemove] = useState(false);
    const [removeReservation, setRemoveReservation] = useState(false);
    const [edit, setEdit] = useState(false);
    const [contactInfo, setContactInfo] = useState(false);
    const [book, setBook] = useState(false);
    let dialog;

    const [cabinOwnerId, setCabinOwnerId] = useState("");
    const [reservationId, setReservationId] = useState("");

    const today = dateFormat(Date(), "dd/mm/yyyy");

    useEffect(() => {
        const getCabins = () => {
            axios.get("http://localhost:3001/cabin?cabin_id="+cabinId, {
                headers: {
                    token: token
                }
            })
                .then(function (response) {
                    console.log(response);
                    setCabin(response.data.Cabins);
                    setCabinOwnerId(response.data.Cabins[0].cabinowner_id);
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
        getCabins();
    }, []);

    useEffect(() => {
        const getReservations = () => {
            axios.get("http://localhost:3001/reservation?cabin_id="+ cabinId, {
                headers: {
                    token: token
                }
            })
                .then(function (response) {
                    console.log(response);
                    setReservations(response.data.Reservations)
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
        if (userId == cabinOwnerId || getAdmin())
        {
        getReservations();
        }
    }, [cabinOwnerId]);

    const date_diff_indays = function(date1, date2) {

        const dt1DateParts = date1.split("/");
        const dt2DateParts = date2.split("/");
    
        const dt1 = new Date(dt1DateParts[1] + "/" + dt1DateParts[0] + "/" + dt1DateParts[2]);
        const dt2 = new Date(dt2DateParts[1] + "/" + dt2DateParts[0] + "/" + dt2DateParts[2]);

        return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
        }

    if(remove){
        dialog = <DeleteCabinDialog cabinName = {cabin[0].name} cabinId = {cabin[0].cabin_id} 
        token = {token} remove = {setRemove} removeMsg = {setRemoveMsg} />;
    }
    else if(edit){
        dialog = <EditCabinDialog cabinData = {cabin} edit = {setEdit} editMsg = {setEditMsg} />;
    }
    else if(contactInfo){
        dialog = <ContactInfoDialog cabinData = {cabin} contactInfo = {setContactInfo}/>;
    }
    else if(book){
        dialog = <BookCabinDialog book={setBook} startDate={query.startDate} endDate={query.endDate} cabinId={cabinId} price={cabin[0].price}/>;
    }
    else if(removeReservation){
        dialog = <RemoveReservationDialog remove = {setRemoveReservation} id={reservationId}/>;
    }
    else{
        dialog = "";
    }
    
    if(removeMsg === "" && (userId == cabinOwnerId || getAdmin())){
    return (
        <div>
            <h3>Cabin Details</h3>
            <Paper className={classes.paper}>
                <Grid container spacing={3}>

                    <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="customized table">
                                <TableHead className={classes.tableHeader}>
                                    <TableRow>
                                        <TableCell className={classes.tableHeaderCell} align="right">Name</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="right">Postarea</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="right">Address</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="right">Postcode</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="right">Size</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="right">Capacity</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="right">Price</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cabin.map((cabin, i) => <TableRow key={i}>
                                        <TableCell align="right">{cabin.name}</TableCell>
                                        <TableCell align="right">{cabin.postarea}</TableCell>
                                        <TableCell align="right">{cabin.address}</TableCell>
                                        <TableCell align="right">{cabin.postcode}</TableCell>
                                        <TableCell align="right">{cabin.size}m2</TableCell>
                                        <TableCell align="right">{cabin.capacity}</TableCell>
                                        <TableCell align="right">{cabin.price}€</TableCell>
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
                                        <TableCell className={classes.tableHeaderCell}>Agency</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="right">Address</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="right">Postarea</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="right">Phonenumber</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="center">Email</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cabin.map((cabin, i) => <TableRow key={i}>
                                        <TableCell align="right">{cabin.agencyName}</TableCell>
                                        <TableCell align="right">{cabin.agencyAddress}</TableCell>
                                        <TableCell align="right">{cabin.agencyPostarea}</TableCell>
                                        <TableCell align="right">{cabin.agencyPhonenumber}</TableCell>
                                        <TableCell align="right">{cabin.agencyEmail}</TableCell>
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
                                        <TableCell className={classes.tableHeaderCell} align="center">Additional Information</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cabin.map((cabin, i) => <TableRow key={i}>
                                        <TableCell align="center">{cabin.info}</TableCell>
                                    </TableRow>)}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Paper>
            <Button className={classes.editButton}  onClick={() => remove ? setRemove(false) : setRemove(true)}>Remove</Button>
            <Button className={classes.editButton}  onClick={() => edit ? setEdit(false) : setEdit(true)}>Edit</Button>
            <h3>Reservations</h3>
            <h4>Can be cancelled if atleast 1 week time remaining till Check in</h4>
            <Paper className={classes.paper}>
            <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="customized table">
                                <TableHead className={classes.tableHeader}>
                                    <TableRow>
                                        <TableCell className={classes.tableHeaderCell} align="right">Firstname</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="right">Lastname</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="right">Phonenumber</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="right">Email</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="right">Check in</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="right">Check out</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="right">Pets</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="right">Cancel reservation</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {reservations.map((reservation, i) =>
                                        <TableRow key={i}>
                                        <TableCell align="right">{reservation.firstname}</TableCell>
                                        <TableCell align="right">{reservation.lastname}</TableCell>
                                        <TableCell align="right">{reservation.phonenumber}</TableCell>
                                        <TableCell align="right">{reservation.email}</TableCell>
                                        <TableCell align="right">{reservation.arrivaldate}</TableCell>
                                        <TableCell align="right">{reservation.leavedate}</TableCell>
                                        <TableCell align="right">{reservation.pets === 1 ? "Yes" : "No"}</TableCell>
                                        <TableCell align="center">{date_diff_indays(today, reservation.arrivaldate) >= 7 || date_diff_indays(today, reservation.leavedate) < 0 || getAdmin() ? <Button className={classes.editButton} onClick={() => removeReservation ? setRemoveReservation(false) : setRemoveReservation(true) + setReservationId(reservation.reservation_id)}>Cancel</Button> : "-" }</TableCell>
                                    </TableRow>)}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
        </Paper>
        {dialog}
        </div>
    )
    }

    else if(removeMsg === "" && userId != cabinOwnerId){
        return (
            <div>
                <h3>Cabin Details</h3>
                <Paper className={classes.paper}>
                    <Grid container spacing={3}>
    
                        <Grid item xs={12}>
                            <TableContainer component={Paper}>
                                <Table className={classes.table} aria-label="customized table">
                                    <TableHead className={classes.tableHeader}>
                                        <TableRow>
                                            <TableCell className={classes.tableHeaderCell} align="right">Name</TableCell>
                                            <TableCell className={classes.tableHeaderCell} align="right">Postarea</TableCell>
                                            <TableCell className={classes.tableHeaderCell} align="right">Address</TableCell>
                                            <TableCell className={classes.tableHeaderCell} align="right">Postcode</TableCell>
                                            <TableCell className={classes.tableHeaderCell} align="right">Size</TableCell>
                                            <TableCell className={classes.tableHeaderCell} align="right">Capacity</TableCell>
                                            <TableCell className={classes.tableHeaderCell} align="right">Price</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {cabin.map((cabin, i) => <TableRow key={i}>
                                            <TableCell align="right">{cabin.name}</TableCell>
                                            <TableCell align="right">{cabin.postarea}</TableCell>
                                            <TableCell align="right">{cabin.address}</TableCell>
                                            <TableCell align="right">{cabin.postcode}</TableCell>
                                            <TableCell align="right">{cabin.size}m2</TableCell>
                                            <TableCell align="right">{cabin.capacity}</TableCell>
                                            <TableCell align="right">{cabin.price}€</TableCell>
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
                                            <TableCell className={classes.tableHeaderCell}>Agency</TableCell>
                                            <TableCell className={classes.tableHeaderCell} align="right">Address</TableCell>
                                            <TableCell className={classes.tableHeaderCell} align="right">Postarea</TableCell>
                                            <TableCell className={classes.tableHeaderCell} align="right">Phonenumber</TableCell>
                                            <TableCell className={classes.tableHeaderCell} align="center">Email</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {cabin.map((cabin, i) => <TableRow key={i}>
                                            <TableCell align="right">{cabin.agencyName}</TableCell>
                                            <TableCell align="right">{cabin.agencyAddress}</TableCell>
                                            <TableCell align="right">{cabin.agencyPostarea}</TableCell>
                                            <TableCell align="right">{cabin.agencyPhonenumber}</TableCell>
                                            <TableCell align="right">{cabin.agencyEmail}</TableCell>
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
                                            <TableCell className={classes.tableHeaderCell} align="center">Additional Information</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {cabin.map((cabin, i) => <TableRow key={i}>
                                            <TableCell align="center">{cabin.info}</TableCell>
                                        </TableRow>)}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </Paper>
            <Button className={classes.editButton}  onClick={() => contactInfo ? setContactInfo(false) : setContactInfo(true)}>Contact info</Button>
            {query.endDate ? <Button className={classes.editButton}  onClick={() =>userId ? book ? setBook(false) : setBook(true) : history.push("/login")}>Book</Button>: null}
            {dialog}
            </div>
        )
        }
    else {
        return(
            <div>
                <h3>{removeMsg}</h3>
                <Button className={classes.editButton} onClick = {() => history.push("/my_cabins")}>Return</Button>
            </div>
        )
    }
    }
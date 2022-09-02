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
import {getAdmin} from "../../../Utils/Common"
import { set } from 'date-fns';
import EditReservationDialog from "../../editReservation/EditReservationDialog";
import RemoveReservationDialog from "../../removeReservation/RemoveReservationDialog";
import dateFormat from 'dateformat';


const useStyles = makeStyles({
    cabinDiv: {
        display: 'grid',
        background: 'navy',
        padding: 8,
        maxWidth: 600,
        maxHeight: 400
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
        margin: 4,
        backgroundColor: 'navy',
        color: 'white',
        minWidth: 50,
    },

});

export default function GetMyCabins(props) {

    const classes = useStyles();

    const [reservations, setReservations] = useState([]);

    const [cabinId, setCabinId] = useState([]);

    const [remove, setRemove] = useState(false);
    const [edit, setEdit] = useState(false);

    const [arrivaldate, setArrivaldate] = useState(new Date());
    const [leavedate, setLeavedate] = useState(new Date());
    const [people, setPeople] = useState("");
    const [pets, setPets] = useState("");
    const [id, setId] = useState("");
    const [price, setPrice] = useState("");

    const token = sessionStorage.getItem('token');

    const today = dateFormat(Date(), "dd/mm/yyyy");

    let dialog;
    
    useEffect(() => {
        const getReservations = () => {
            axios.get("http://localhost:3001/reservation?person_id=" + props.id, {
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
        getReservations();
    }, []);

    const date_diff_indays = function(date1, date2) {

        const dt1DateParts = date1.split("/");
        const dt2DateParts = date2.split("/");
    
        const dt1 = new Date(dt1DateParts[1] + "/" + dt1DateParts[0] + "/" + dt1DateParts[2]);
        const dt2 = new Date(dt2DateParts[1] + "/" + dt2DateParts[0] + "/" + dt2DateParts[2]);

        return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
        }

    
    if(remove){
        dialog = <RemoveReservationDialog remove = {setRemove} id={id}/>;
    }
    else if(edit){
        dialog = <EditReservationDialog edit = {setEdit} arrivaldate={arrivaldate} leavedate={leavedate} people={people} pets={pets} id={id} cabinId={cabinId} price={price}/>;
    }
    else{
        dialog = "";
    }


    if(reservations.length > 0){
    return (
        <div>
           <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="customized table">
                                <TableHead className={classes.tableHeader}>
                                    <TableRow>
                                        <TableCell className={classes.tableHeaderCell} align="left">Cabin</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="center">Check in</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="center">Check out</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="center">People</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="center">Pets</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="center">Price</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="center">Paid</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="center">Edit reservation</TableCell>
                                        <TableCell className={classes.tableHeaderCell} align="center">Cancel reservation</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {reservations.map((reservation, i) =>
                                        <TableRow key={i}>
                                        <TableCell align="left"><Button href= {`/cabin_detail/${reservation.cabin_id}`} className= {classes.editButton}>{reservation.CabinName}</Button></TableCell>
                                        <TableCell align="center">{reservation.arrivaldate}</TableCell>
                                        <TableCell align="center">{reservation.leavedate}</TableCell>
                                        <TableCell align="center">{reservation.people}</TableCell>
                                        <TableCell align="center">{reservation.pets === 1 ? "Yes" : "No"}</TableCell>
                                        <TableCell align="center">{reservation.amount}€</TableCell>
                                        <TableCell align="center">{reservation.paid === 1 ? "Yes" : "No"}</TableCell>
                                    <TableCell align="center">{date_diff_indays(today, reservation.arrivaldate) >= 7 || getAdmin() ? <Button className={classes.editButton} onClick={() => edit ? setEdit(false) : setEdit(true) + setArrivaldate(reservation.arrivaldate) + setLeavedate(reservation.leavedate) + setPeople(reservation.people) +setPets(reservation.pets) + setId(reservation.reservation_id) + setCabinId(reservation.cabin_id) + setPrice(reservation.amount)}>Edit</Button> : "-"}</TableCell>
                                    <TableCell align="center">{date_diff_indays(today, reservation.arrivaldate) >= 7 || getAdmin() ? <Button className={classes.editButton} onClick={() => remove ? setRemove(false) : setRemove(true) + setId(reservation.reservation_id)}>Cancel</Button> : "-" }</TableCell>
                                    </TableRow>)}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {dialog}
        </div>
    )
    }
    else{
        return(
            <div>
                You dont have any reservations
            </div>
        )
    }
}


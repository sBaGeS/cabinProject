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
import { getUserId, getToken, getAdmin } from "../../../Utils/Common";
import DeleteServiceReservationDialog from "../../removeServiceReservation/RemoveServiceReservationDialog";
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

export default function GetMyServiceReservations(props) {

    const classes = useStyles();

    const token = getToken();

    const [remove, setRemove] = useState(false);
    const [reservations, setReservations] = useState([]);
    const [id, setId] = useState("");

    const today = dateFormat(Date(), "dd/mm/yyyy");

    let dialog;

  console.log(props.id);


    useEffect(() => {
        const getServiceReservation = () => {
            axios.get("http://localhost:3001/serviceReservation?person_id=" + props.id, {
                headers: {
                    token: token
                }
            })
                .then(function (response) {
                    console.log(response);
                    setReservations(response.data.serviceReservations);
                })
                .catch(function (error) {
                    console.log(error);
                })
        }

        getServiceReservation()
    }, []);

    const date_diff_indays = function (date1, date2) {

        const dt1DateParts = date1.split("/");
        const dt2DateParts = date2.split("/");

        const dt1 = new Date(dt1DateParts[1] + "/" + dt1DateParts[0] + "/" + dt1DateParts[2]);
        const dt2 = new Date(dt2DateParts[1] + "/" + dt2DateParts[0] + "/" + dt2DateParts[2]);

        return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
    }



    if (remove) {
        dialog = <DeleteServiceReservationDialog remove={setRemove} id={id} />;
    }
    else {
        dialog = "";
    }

    if (reservations.length != 0)
        return (
            <div>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="customized table">
                        <TableHead className={classes.tableHeader}>
                            <TableRow>
                                <TableCell className={classes.tableHeaderCell} align="left">Name</TableCell>
                                <TableCell className={classes.tableHeaderCell} align="left">Agency</TableCell>
                                <TableCell className={classes.tableHeaderCell} align="left">Date</TableCell>
                                <TableCell className={classes.tableHeaderCell} align="left">Price</TableCell>
                                <TableCell className={classes.tableHeaderCell} align="left">Paid</TableCell>
                                <TableCell className={classes.tableHeaderCell} align="center">Cancel reservation</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reservations.map((reservation, i) => <TableRow key={i}>
                                <TableCell align="left"><Button className={classes.editButton} href={`/service_detail/${reservation.service_id}`}>{reservation.name}</Button></TableCell>
                                <TableCell align="left">{reservation.agency}</TableCell>
                                <TableCell align="left">{reservation.reservationdate}</TableCell>
                                <TableCell align="left">{reservation.sum}€</TableCell>
                                <TableCell align="left">{reservation.paid === 1 ? "Yes" : "No"}</TableCell>
                                <TableCell align="center">{date_diff_indays(today, reservation.reservationdate) >= 7 || getAdmin() ? <Button className={classes.editButton} onClick={() => remove ? setRemove(false) : setRemove(true) + setId(reservation.servicereservation_id)}>Cancel</Button> : "-"}</TableCell>
                            </TableRow>)}
                        </TableBody>
                    </Table>
                </TableContainer>
                {dialog}
            </div>
        )
    else {
        return (
            <div>
                No service reservations found
            </div>
        )
    }
}


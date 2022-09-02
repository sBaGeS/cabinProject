import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import { Typography } from '@material-ui/core';



export default function DeleteReservationDialog(props) {

    const [dialogOpen, setDialogOpen] = useState(true);

    const [serverErrorMsg, setServerErrorMsg] = useState("");

    const axiosDeleteReservation = () => {
        axios.delete("http://localhost:3001/reservation/" + props.id, {
                headers: {
                    token: sessionStorage.getItem("token")
        }})
            .then(function (response) {
                console.log(response);
                setDialogOpen(false);
                props.remove(false);
                window.location.reload(false);
            })
            .catch(function (error) {
                console.log(error.response);
                setServerErrorMsg(error.response.data.msg);
            });

    }

    const handleClose = () => {
        setDialogOpen(false);
        props.remove(false);
    };
    const handleRemoveClicked = () => {
        axiosDeleteReservation();
    }
    return (
        <div>
            <Dialog open={dialogOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Cancel reservation</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to cancel this reservation?
                    </Typography>
                    <p style={{ color: "red", fontWeight: 900, fontSize: 17, marginLeft: 40}}>{serverErrorMsg}</p>
                </DialogContent>
                <DialogActions>
                <Button variant="contained" onClick={() => handleRemoveClicked()}>Cancel reservation</Button>
                <Button variant="contained" onClick={() => handleClose()}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
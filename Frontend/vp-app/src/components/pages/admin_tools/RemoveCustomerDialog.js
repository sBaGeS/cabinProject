import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import { Typography } from '@material-ui/core';



export default function RemoveCustomerDialog(props) {

    const id = props.id;

    const [dialogOpen, setDialogOpen] = useState(true);

    const [serverErrorMsg, setServerErrorMsg] = useState("");
   
    const axiosDeleteCabin = () => {
        axios.delete("http://localhost:3001/person/" + id, {
                headers: {
                    token: sessionStorage.getItem("token")
        }})
            .then(function (response) {
                console.log(response);
                setDialogOpen(false);
                props.remove(false);
                props.removeMsg(<a style={{ color: "orange", fontWeight: 900, fontSize: 22}}>Customer {props.firstname} <a style={{ color: "darkred", fontWeight: 900, fontSize: 22}}>"{props.username}"</a> {props.lastname} succesfully deleted</a>);
                setTimeout(() => {
                    window.location.reload(false);
                }, 3000);
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
        axiosDeleteCabin();
    }
    return (
        <div>
            <Dialog open={dialogOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Delete user</DialogTitle>
                <DialogContent>
                    <Typography>
                  Are you sure you want to delete customer {props.firstname} "{props.username}" {props.lastname}?
                    </Typography>
                    <p style={{ color: "red", fontWeight: 900, fontSize: 18, marginLeft: 130, marginTop: 20}}>{serverErrorMsg}</p>
                </DialogContent>
                <DialogActions>
                <Button variant="contained" onClick={() => handleRemoveClicked()}>Delete</Button>
                <Button variant="contained" onClick={() => handleClose()}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
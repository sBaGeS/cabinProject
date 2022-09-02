import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import { Typography } from '@material-ui/core';



export default function RemoveAgencyDialog(props) {

    const id = props.id;

    const [dialogOpen, setDialogOpen] = useState(true);

    const [serverErrorMsg, setServerErrorMsg] = useState("");
   
    const axiosDeleteAgency = () => {
        axios.delete("http://localhost:3001/agency/" + id, {
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
        axiosDeleteAgency();
    }
    return (
        <div>
            <Dialog open={dialogOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Delete agency</DialogTitle>
                <DialogContent>
                    <Typography>
                      Are you sure you want to delete agency {props.name}?
                    </Typography>
                    <p style={{ color: "red", fontWeight: 900, fontSize: 17, marginLeft: 40}}>{serverErrorMsg}</p>
                </DialogContent>
                <DialogActions>
                <Button variant="contained" onClick={() => handleRemoveClicked()}>Delete</Button>
                <Button variant="contained" onClick={() => handleClose()}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import { Typography } from '@material-ui/core';



export default function DeleteServiceDialog(props) {
    
    const [dialogOpen, setDialogOpen] = useState(true);

    const [serverErrorMsg, setServerErrorMsg] = useState("");

    const axiosDeleteService = () => {
        axios.delete("http://localhost:3001/service/" + props.id, {
                headers: {
                    token: sessionStorage.getItem("token")
        }})
            .then(function (response) {
                console.log(response);
                setDialogOpen(false);
                props.remove(false);
                window.location.reload();
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
        axiosDeleteService();
    }
    return (
        <div>
            <Dialog open={dialogOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Remove service</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to remove service <span style={{fontWeight: 900}}>{props.name}</span>?
                    </Typography>
                    <p style={{ color: "red", fontWeight: 900, fontSize: 17, marginLeft: 40}}>{serverErrorMsg}</p>
                </DialogContent>
                <DialogActions>
                <Button variant="contained" onClick={() => handleRemoveClicked()}>Remove</Button>
                <Button variant="contained" onClick={() => handleClose()}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import { Typography } from '@material-ui/core';



export default function DeleteCabinDialog(props) {

    const token = props.token;
    const cabinId = props.cabinId;
    const cabinName = props.cabinName;
    const [dialogOpen, setDialogOpen] = useState(true);

    const [serverErrorMsg, setServerErrorMsg] = useState("");

    const axiosDeleteCabin = () => {
        axios.delete("http://localhost:3001/cabin/" + cabinId, {
                headers: {
                    token: token
        }})
            .then(function (response) {
                console.log(response);
                setDialogOpen(false);
                props.remove(false);
                props.removeMsg("Cabin " + cabinName + "was removed")
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
                <DialogTitle id="form-dialog-title">Remove cabin</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to remove cabin {cabinName}?
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
import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import NativeSelect from '@material-ui/core/NativeSelect';
import {getToken, getUserId} from '../../Utils/Common';
import axios from 'axios';
import GetAgencies from '../getAgencies/GetAgencies';


const useStyles = makeStyles(theme => ({
    formRoot: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        }
    },
    Infotxt: {
        color: 'yellow',
    }
}));

export default function EditServiceDialog(props) {

    const token = getToken();
    
    const classes = useStyles();
    const [dialogOpen, setDialogOpen] = useState(true);

    const [name, setName] = useState(props.name);
    const [nameErrorMsg, setNameErrorMsg] = useState("");

    const [price, setPrice] = useState(props.price);
    const [priceErrorMsg, setPriceErrorMsg] = useState("");

    const [info, setInfo] = useState(props.info);

    const [agencyId, setAgencyId] = useState(props.agency);
    const [agencyErrorMsg, setAgencyErrorMsg] = useState("");

    const [serverErrorMsg, setServerErrorMsg] = useState("");

    function onlyDigits(s) {
        for (let i = s.length - 1; i >= 0; i--) {
          const d = s.charCodeAt(i);
          if (d < 48 || d > 57) return false
        }
        return true
      }

    const axiosPutService = () => {
        axios.put('http://localhost:3001/service/'+ props.id, {
            name: name,
            price: price,
            agency_id: agencyId,
            info: info
        },
            {
                headers: {
                    token: token
                }
            })
            .then(function (response) {
                console.log(response);
                setDialogOpen(false);
                props.edit(false);
                window.location.reload();
                
                
            })
            .catch(function (error) {
                console.log(error.response);
                setServerErrorMsg(error.response.data.msg);
            });

    }

    const handleClose = () => {
        setDialogOpen(false);
        props.edit(false);
    };

    const handleEditClicked = () => {
        let nameValidationError = false;
        let priceValidationError = false;
        let agencyValidationError = false;
        if (name.length === 0 || name === "") {
            setNameErrorMsg("Please insert a service name");
            nameValidationError = true;
        }
        else {
            nameValidationError = false;
            setNameErrorMsg("");
        }
        if (price.length === 0 || price === "") {
            setPriceErrorMsg("Please insert a price");
            priceValidationError = true;
        }
        else if (!onlyDigits(price)) {
            priceValidationError = true;
            setPriceErrorMsg("Only numbers allowed");
        }
        else {
            priceValidationError = false;
            setPriceErrorMsg("");
        }
        if (agencyId.length === 0 || agencyId === "") {
            setAgencyErrorMsg("Please select an agency");
            agencyValidationError = true;
        }
        else{
            setAgencyErrorMsg("");
            agencyValidationError = false;
        }
        

        if (nameValidationError === false && priceValidationError === false && agencyValidationError === false) {
            axiosPutService();
        }
    }

return (
    <div>
        <Dialog open={dialogOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Edit service info</DialogTitle>
            <DialogContent>
                <GetAgencies setAgencyId = {setAgencyId}/>
                <form className={classes.formRoot} noValidate autoComplete="off">
            
                <TextField error={nameErrorMsg != ""} helperText={nameErrorMsg} required id="name" label="Service name" value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        (e.target.value.length === 0) ? setNameErrorMsg("Please insert a service name") : setNameErrorMsg("")
                    }} />

                <TextField error={priceErrorMsg != ""} helperText={priceErrorMsg} required id="price" label="Price" value={price}
                    type="number"
                    onChange={(e) => {
                        setPrice(e.target.value);
                        (e.target.value.length === 0) ? setPriceErrorMsg("Please insert a service price") : setPriceErrorMsg("")
                    }} />
                <br />
                <TextField variant="outlined" multiline rows = "12" id="info" label="Information" value={info}
                    onChange={(e) => {
                        setInfo(e.target.value);
                    }} />
            </form>
            
            </DialogContent>

            <div>
                <p style={{ color: "red", fontWeight: 900, fontSize: 14, marginLeft: 155 }}>{serverErrorMsg}</p>

                <DialogActions>
                    <Button variant="contained" onClick={() => handleEditClicked()}>Edit</Button>
                    <Button variant="contained" onClick={() => handleClose()}>Cancel</Button>
                </DialogActions>
            </div>
        </Dialog>
    </div>
    )
}
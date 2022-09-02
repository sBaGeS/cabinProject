import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';


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

export default function EditAgencyDialog(props) {
    
    const classes = useStyles();

    const [dialogOpen, setDialogOpen] = useState(true);

    const [name, setName] = useState("");
    const [nameErrorMsg, setNameErrorMsg] = useState("");

    const [address, setAddress] = useState("");

    const [postcode, setPostcode] = useState("");

    const [postarea, setPostarea] = useState("");

    const [phonenumber, setPhonenumber] = useState("");

    const [email, setEmail] = useState("");

    const [serverErrorMsg, setServerErrorMsg] = useState("");

    useEffect(() => {
        const getAgencyInfo = () => {
            axios.get("http://localhost:3001/agency?id=" +  props.id, {
                headers: {
                    token: sessionStorage.getItem("token")
                }
            })
                .then(function (response) {
                    console.log(response);
                    setName(response.data.Agencies[0].name);
                    setAddress(response.data.Agencies[0].address);
                    setPostcode(response.data.Agencies[0].postcode);
                    setPostarea(response.data.Agencies[0].postarea);
                    setPhonenumber(response.data.Agencies[0].phonenumber);
                    setEmail(response.data.Agencies[0].email);
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
        if (props.edit)
        {
        getAgencyInfo();
        }
    }, []);
   
    const axiosUpdate = () => {

        axios.put('http://localhost:3001/agency/'+ props.id,{ 
            name: name,
            address: address,
            postcode: postcode,
            postarea: postarea,
            phonenumber: phonenumber,
            email: email,
        },{
        headers: {
            token: sessionStorage.getItem("token")
          }})
            .then(function (response) {
                console.log(response);
                setDialogOpen(false);
                window.location.reload(false);
                props.edit(false);
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

        if (name.length === 0 || name === "") {
            setNameErrorMsg("Please insert an agency name");
            nameValidationError = true;
        }
        else {
            nameValidationError = false;
            setNameErrorMsg("");
        }

        if (nameValidationError === false) {
            axiosUpdate();
        }
    }

    return (
        <div>
            <Dialog open={dialogOpen} onClose={handleClose}  aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edit info</DialogTitle>
                <DialogContent>
                <form className={classes.formRoot} noValidate autoComplete="off">
                        <TextField error={nameErrorMsg != ""} helperText={nameErrorMsg} required id="name" label=" Agency name" value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                (e.target.value.length === 0) ? setNameErrorMsg("Please insert a firstname") : setNameErrorMsg("")
                            }} />

                        <TextField id="address" label="Address" value={address}
                            onChange={(e) => {
                                setAddress(e.target.value);
                            }} />

                            <br />

                        <TextField id="postcode" label="Postcode" value={postcode}
                            onChange={(e) => {
                                setPostcode(e.target.value);
                            }} />

                        <TextField id="postarea" label="Postarea" value={postarea}
                            onChange={(e) => {
                                setPostarea(e.target.value);
                            }} />

                          <br />

                        <TextField id="phonenumber" label="Phonenumber" value={phonenumber}
                            onChange={(e) => {
                                setPhonenumber(e.target.value);
                            }} />

                        <TextField id="email" label="Email" value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }} />
                    </form>
              
                </DialogContent>

                <div>
                <p style={{ color: "red", fontWeight: 900, fontSize: 14, marginLeft: 155}}>{serverErrorMsg}</p>

                <DialogActions>
                <Button variant="contained" onClick={() => handleEditClicked()}>Edit</Button>
                <Button variant="contained" onClick={() => handleClose()}>Cancel</Button>
                </DialogActions>
                </div>
            </Dialog>
        </div>
    )
}
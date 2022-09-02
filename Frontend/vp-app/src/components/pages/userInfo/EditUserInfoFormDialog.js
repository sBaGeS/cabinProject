import React, { useState } from 'react';
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
}));
export default function EditUserInfoFormDialog(props) {

    let user = props.userData[0];

    const classes = useStyles();
    const [dialogOpen, setDialogOpen] = useState(true);

    const [firstname, setFirstname] = useState(user.firstname);
    const [firstnameErrorMsg, setFirstnameErrorMsg] = useState("");

    const [lastname, setLastname] = useState(user.lastname);
    const [lastnameErrorMsg, setLastnameErrorMsg] = useState("");

    const [address, setAddress] = useState(user.address);
    const [addressErrorMsg, setAddressErrorMsg] = useState("");

    const [postcode, setPostcode] = useState(user.postcode);
    const [postcodeErrorMsg, setPostcodeErrorMsg] = useState("");

    const [postarea, setPostarea] = useState(user.postarea);
    const [postareaErrorMsg, setPostareaErrorMsg] = useState("");

    const [phonenumber, setPhonenumber] = useState(user.phonenumber);
    const [phonenumberErrorMsg, setPhonenumberErrorMsg] = useState("");

    const [email, setEmail] = useState(user.email);
    const [emailErrorMsg, setEmailErrorMsg] = useState("");

    const [serverErrorMsg, setServerErrorMsg] = useState("");

    function onlyDigits(s) {
        for (let i = s.length - 1; i >= 0; i--) {
          const d = s.charCodeAt(i);
          if (d < 48 || d > 57) return false
        }
        return true
      }
    
    const axiosUpdate = () => {
        
        let token = sessionStorage.getItem('token');
        let id = sessionStorage.getItem('user_id');

        axios.put('http://localhost:3001/person/'+id,{ 
            firstname: firstname,
            lastname: lastname,
            address: address,
            postcode: postcode,
            postarea: postarea,
            phonenumber: phonenumber,
            email: email,
        },{
        headers: {
            token: token
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

        let firstnameValiadtionError = false;
        let lastnameValidationError = false;
        let addressValidationError = false;
        let postcodeValidationError = false;
        let postareaValidationError = false;
        let phonenumberValidationError = false;
        let emailValidationError = false;

        if (firstname.length === 0 || firstname === "") {
            setFirstnameErrorMsg("Please insert a firstname");
            firstnameValiadtionError = true;
        }
        else {
            firstnameValiadtionError = false;
            setFirstnameErrorMsg("");
        }
        if (lastname.length === 0 || lastname === "") {
            lastnameValidationError = true;
            setLastnameErrorMsg("Please insert a lastname");
        }
        else {
            lastnameValidationError = false;
            setLastnameErrorMsg("");
        }
        if (address.length === 0 || address === "") {
            addressValidationError = true;
            setAddressErrorMsg("Please insert an address");
        }
        else {
            addressValidationError = false;
            setAddressErrorMsg("")
        }
        if (postcode.length === 0 || postcode === "") {
            postcodeValidationError = true;
            setPostcodeErrorMsg("Please insert a postcode");
        }
        else if (!onlyDigits(postcode)) {
            postcodeValidationError = true;
            setPostcodeErrorMsg("Only numbers allowed");
        }
        else {
            postcodeValidationError = false;
            setPostcodeErrorMsg("");
        }
        if (postarea.length === 0 || postarea === "") {
            postareaValidationError = true;
            setPostareaErrorMsg("Please insert a postarea");
        }
        else {
            postareaValidationError = false;
            setPostareaErrorMsg("");
        }
        if (phonenumber.length === 0 || phonenumber === "") {
            phonenumberValidationError = true;
            setPhonenumberErrorMsg("Please insert a phonenumber");
        }
        else {
            phonenumberValidationError = false;
            setPhonenumberErrorMsg("");
        }
        if (email.length === 0 || email === "") {
            emailValidationError = true;
            setEmailErrorMsg("Please insert an email address");
        }
        else {
            emailValidationError = false;
            setEmailErrorMsg("");
        }

        if (firstnameValiadtionError === false && 
            lastnameValidationError === false &&
            addressValidationError === false &&
            postcodeValidationError === false &&
            postareaValidationError === false &&
            phonenumberValidationError === false &&
            emailValidationError === false) {
            axiosUpdate();
        }
    }

    return (
        <div>
            <Dialog open={dialogOpen} onClose={handleClose}  aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edit info</DialogTitle>
                <DialogContent>
                <form className={classes.formRoot} noValidate autoComplete="off">
                        <TextField error={firstnameErrorMsg != ""} helperText={firstnameErrorMsg} required id="firstname" label="Firstname" value={firstname}
                            onChange={(e) => {
                                setFirstname(e.target.value);
                                (e.target.value.length === 0) ? setFirstnameErrorMsg("Please insert a firstname") : setFirstnameErrorMsg("")
                            }} />

                        <TextField error={lastnameErrorMsg != ""} helperText={lastnameErrorMsg} required id="lastname" label="Lastname" value={lastname}
                            onChange={(e) => {
                                setLastname(e.target.value);
                                (e.target.value.length === 0) ? setLastnameErrorMsg("Please insert a lastname") : setLastnameErrorMsg("")
                            }} />
                        <br />

                        <TextField error={addressErrorMsg != ""} helperText={addressErrorMsg} required id="address" label="Address" value={address}
                            onChange={(e) => {
                                setAddress(e.target.value);
                                (e.target.value.length === 0) ? setAddressErrorMsg("Please insert an address") : setAddressErrorMsg("")
                            }} />

                        <TextField error={postcodeErrorMsg != ""} helperText={postcodeErrorMsg} required id="postcode" label="Postcode" value={postcode}
                            type="number"
                            onChange={(e) => {
                                setPostcode(e.target.value);
                                (e.target.value.length === 0) ? setPostcodeErrorMsg("Please insert a postcode") : setPostcodeErrorMsg("")
                            }} />
                        <br />
                        <TextField error={postareaErrorMsg != ""} helperText={postareaErrorMsg} required id="postarea" label="Postarea" value={postarea}
                            onChange={(e) => {
                                setPostarea(e.target.value);
                                (e.target.value.length === 0) ? setPostareaErrorMsg("Please insert a postarea") : setPostareaErrorMsg("")
                            }} />
                        <br />

                        <TextField error={phonenumberErrorMsg != ""} helperText={phonenumberErrorMsg} required id="phonenumber" label="Phonenumber" value={phonenumber}
                            type="number"
                            onChange={(e) => {
                                setPhonenumber(e.target.value);
                                (e.target.value.length === 0) ? setPhonenumberErrorMsg("Please insert a phonenumber") : setPhonenumberErrorMsg("")
                            }} />

                        <TextField error={emailErrorMsg != ""} helperText={emailErrorMsg} required id="email" label="Email" value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                (e.target.value.length === 0) ? setEmailErrorMsg("Please insert an email address") : setEmailErrorMsg("")
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
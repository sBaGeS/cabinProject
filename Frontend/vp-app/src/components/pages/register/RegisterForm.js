import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles(theme => ({
    searchButton: {
        margin: 4,
        backgroundColor: 'navy',
        color: 'white',
      },
    formRoot: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        }
    },
}));

const defaultProps = {
    bgcolor: 'background.paper',
    m: 1,
    border: 2,
    padding: 2,
    borderRadius: 16,
};

export default function RegisterForm() {

    const classes = useStyles();

    const [firstname, setFirstname] = useState("");
    const [firstnameErrorMsg, setFirstnameErrorMsg] = useState("");

    const [lastname, setLastname] = useState("");
    const [lastnameErrorMsg, setLastnameErrorMsg] = useState("");

    const [address, setAddress] = useState("");
    const [addressErrorMsg, setAddressErrorMsg] = useState("");

    const [postcode, setPostcode] = useState("");
    const [postcodeErrorMsg, setPostcodeErrorMsg] = useState("");

    const [postarea, setPostarea] = useState("");
    const [postareaErrorMsg, setPostareaErrorMsg] = useState("");

    const [phonenumber, setPhonenumber] = useState("");
    const [phonenumberErrorMsg, setPhonenumberErrorMsg] = useState("");

    const [email, setEmail] = useState("");
    const [emailErrorMsg, setEmailErrorMsg] = useState("");

    const [username, setUsername] = useState("");
    const [usernameErrorMsg, setUsernameErrorMsg] = useState("");

    const [password, setPassword] = useState("");
    const [passwordErrorMsg, setPasswordErrorMsg] = useState("");

    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [passwordConfirmationErrorMsg, setPasswordConfirmationErrorMsg] = useState("");

    const [serverErrorMsg, setServerErrorMsg] = useState("");
    const [registrationComplete, setRegistrationComplete] = useState(false)


    const axiosRegister = () => {
        axios.post('http://localhost:3001/person', {
            firstname: firstname,
            lastname: lastname,
            address: address,
            postcode: postcode,
            postarea: postarea,
            phonenumber: phonenumber,
            email: email,
            username: username,
            password: password
        })
            .then(function (response) {
                console.log(response);
                setRegistrationComplete(true);
            })
            .catch(function (error) {
                console.log(error.response);
                setServerErrorMsg(error.response.data.msg);
            });
    }

    function hasNumber (str) {
        return str.split('').some(function (ch) { return parseInt(ch) });
    }

    function hasBigSmall(str) {
        return str.match(/[a-z]/) && str.match(/[A-Z]/);
    }

    function onlyDigits(s) {
        for (let i = s.length - 1; i >= 0; i--) {
          const d = s.charCodeAt(i);
          if (d < 48 || d > 57) return false
        }
        return true
      }

    const handleRegister = () => {

        let usernameValidationError = false;
        let passwordValidationError = false
        let firstnameValidationError = false;
        let lastnameValidationError = false;
        let addressValidationError = false;
        let postcodeValidationError = false;
        let postareaValidationError = false;
        let phonenumberValidationError = false;
        let emailValidationError = false;
        let passwordConfirmationError = false;

        if (username.length === 0 || username === "") {
            setUsernameErrorMsg("Please insert an username");
            usernameValidationError = true;
        }
        else {
            usernameValidationError = false;
            setUsernameErrorMsg("");
        }
        if (password.length === 0 || password === "") {
            setPasswordErrorMsg("Please insert a password");
            passwordValidationError = true;
        }
        else if (!hasNumber(password)) {
            setPasswordErrorMsg("Password needs to have atleast 1 number");
            passwordValidationError = true;
        }
        else if (password.length < 8) {
            setPasswordErrorMsg("Password needs to be atleast 8 characters long");
            passwordValidationError = true;
        }
        else if (!hasBigSmall(password)) {
            setPasswordErrorMsg("Password needs to have atleast 1 uppercase and lowercase letter");
            passwordValidationError = true;
        }
        else {
            passwordValidationError = false;
            setPasswordErrorMsg("");
        }
        if (passwordConfirmation.length === 0 || passwordConfirmation === "" || password !== passwordConfirmation) {

            if (passwordConfirmation.length === 0 || passwordConfirmation === "") 
            {
                setPasswordConfirmationErrorMsg("Please insert a password");
                passwordConfirmationError = true;
            }

            else
            {
                setPasswordConfirmationErrorMsg("Passwords dont match");
                passwordConfirmationError = true;
            }
        }
        else {
            passwordConfirmationError = false;
            setPasswordConfirmationErrorMsg("");
        }
        if (firstname.length === 0 || firstname === "") {
            setFirstnameErrorMsg("Please insert a firstname");
            firstnameValidationError = true;
        }
        else if (hasNumber(firstname)) {
            setFirstnameErrorMsg("Name cant contain numbers");
            firstnameValidationError = true;
        }
        else {
            firstnameValidationError = false;
            setFirstnameErrorMsg("");
        }
        if (lastname.length === 0 || lastname === "") {
            lastnameValidationError = true;
            setLastnameErrorMsg("Please insert a lastname");
        }
        else if (hasNumber(lastname)) {
            setLastnameErrorMsg("Name cant contain numbers");
            lastnameValidationError = true;
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

        if (firstnameValidationError === false && 
            lastnameValidationError === false &&
            addressValidationError === false &&
            postcodeValidationError === false &&
            postareaValidationError === false &&
            phonenumberValidationError === false &&
            emailValidationError === false && 
            usernameValidationError  === false  &&
            passwordValidationError === false &&
            passwordConfirmationError === false) {
            axiosRegister();
        }
    }
    if(!registrationComplete){
    return (
        <div>
            <Box borderColor="navy" {...defaultProps}>
            <h2>Register</h2>
            <form className={classes.formRoot} noValidate autoComplete="off">
                <h3>Please fill the form below</h3>
                <TextField error={usernameErrorMsg != ""} helperText={usernameErrorMsg} required id="username" label="Username" value={username}
                onChange={(e) => {
                        setUsername(e.target.value);
                    (e.target.value.length === 0) ? setUsernameErrorMsg("Please insert a username"):setUsernameErrorMsg("")
                    }}/>
                    
                <TextField  error={passwordErrorMsg != ""} helperText={passwordErrorMsg} required id="password" label="Password" type="password" value = {password} 
                onChange={(e) => {
                        setPassword(e.target.value);
                    (e.target.value.length === 0) ? setPasswordErrorMsg("Please insert a password"):setPasswordErrorMsg("")
                    }}/>
                <br />
                <TextField error={passwordConfirmationErrorMsg != ""} helperText={passwordConfirmationErrorMsg} required id="passwordConfirmation" label="Confirm password" type="password" value={passwordConfirmation}
                onChange={(e) => {
                        setPasswordConfirmation(e.target.value);
                    (e.target.value.length === 0) ? setPasswordConfirmationErrorMsg("Please insert a password"):setPasswordConfirmationErrorMsg("")
                    }}/>
                    <br/>
               
                <TextField error={firstnameErrorMsg != ""} helperText={firstnameErrorMsg} required id="firstname" label="Firstname" value={firstname}
                    onChange={(e) => {
                        setFirstname(e.target.value);
                    (e.target.value.length === 0) ? setFirstnameErrorMsg("Please insert a firstname"):setFirstnameErrorMsg("")
                    }}/>

                <TextField error={lastnameErrorMsg != ""} helperText={lastnameErrorMsg} required id="lastname" label="Lastname" value={lastname}
                    onChange={(e) => {
                        setLastname(e.target.value);
                    (e.target.value.length === 0) ? setLastnameErrorMsg("Please insert a lastname"):setLastnameErrorMsg("")
                    }}/>
                <br />

                <TextField error={addressErrorMsg != ""} helperText={addressErrorMsg} required id="address" label="Address" value={address} 
                onChange={(e) => {
                    setAddress(e.target.value);
                (e.target.value.length === 0) ? setAddressErrorMsg("Please insert an address"):setAddressErrorMsg("")
                }}/>

                <TextField error={postcodeErrorMsg != ""} helperText={postcodeErrorMsg} required id="postcode" label="Postcode" value={postcode}
                type="number" 
                onChange={(e) => {
                    setPostcode(e.target.value);
                (e.target.value.length === 0) ? setPostcodeErrorMsg("Please insert a postcode"):setPostcodeErrorMsg("")
                }}/>
                <br />


                <TextField error={postareaErrorMsg != ""} helperText={postareaErrorMsg} required id="postarea" label="Postarea" value={postarea}
                    onChange={(e) => {
                        setPostarea(e.target.value);
                    (e.target.value.length === 0) ? setPostareaErrorMsg("Please insert a postarea"):setPostareaErrorMsg("")
                    }}/>
               

                <TextField error={phonenumberErrorMsg != ""} helperText={phonenumberErrorMsg} required id="phonenumber" label="Phonenumber" value={phonenumber} 
                type="number"
                onChange={(e) => {
                    setPhonenumber(e.target.value);
                (e.target.value.length === 0) ? setPhonenumberErrorMsg("Please insert a phonenumber"):setPhonenumberErrorMsg("")
                }}/>
                 <br/>
                <TextField error={emailErrorMsg != ""} helperText={emailErrorMsg} required id="email" label="Email" value={email} 
                onChange={(e) => {
                    setEmail(e.target.value);
                (e.target.value.length === 0) ? setEmailErrorMsg("Please insert an email address"):setEmailErrorMsg("")
                }}/>
            </form>
            <Button variant="contained" className = {classes.searchButton} onClick={() => handleRegister()}>Register</Button>
            <p style={{ color: "red", fontWeight: 900, fontSize: 16, marginLeft: 130}}>{serverErrorMsg}</p>
            </Box>
        </div>
    )
    }
    else if(registrationComplete){
        return(
        <h3>Registration complete. Please login</h3>
        )
    }
}
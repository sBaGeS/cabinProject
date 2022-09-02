import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormHelperText from '@material-ui/core/FormHelperText';
import Box from '@material-ui/core/Box';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    searchButton: {
        margin: 20,
        backgroundColor: 'navy',
        color: 'white',
    },
    formRoot: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),

            width: '25ch',
        }
    },
    formControl: {
        margin: theme.spacing(1),

        minWidth: 120,
    },

}));
const defaultProps = {
    bgcolor: 'background.paper',
    m: 1,
    border: 2,
    padding: 2,
    borderRadius: 16,
    borderColor: 'navy'

};

export default function PostAgencyForm() {

    const token = sessionStorage.getItem('token');
    const classes = useStyles();

    const [name, setName] = useState("");
    const [nameErrorMsg, setNameErrorMsg] = useState("");

    const [address, setAddress] = useState("");

    const [postcode, setPostcode] = useState("");

    const [postarea, setPostarea] = useState("");

    const [phonenumber, setPhonenumber] = useState("");

    const [email, setEmail] = useState("");

    const [serverErrorMsg, setServerErrorMsg] = useState("");
    const [postCompletedMessage, setPostCompletedMessage] = useState("")


    const axiosPostAgency = () => {
        axios.post('http://localhost:3001/agency', {
            name: name,
            address: address,
            postcode: postcode,
            postarea: postarea,
            phonenumber: phonenumber,
            email: email,
        },
            {
                headers: {
                    token: token
                }
            })
            .then(function (response) {
                console.log(response);
                setPostCompletedMessage("Agency " + name + " posted");
                resetTextFields();
            })
            .catch(function (error) {
                console.log(error.response);
                setServerErrorMsg(error.response.data.msg);
            });
    }

    const resetTextFields = () => {
        setName("");
        setAddress("");
        setPostcode("");
        setPostarea("");
        setPhonenumber("");
        setEmail("");
    }

    const handlePostClicked = () => {

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
            axiosPostAgency();
        }
    }

    return (
        <Box borderColor="navy" {...defaultProps}>
            <form className={classes.formRoot} noValidate autoComplete="off">
                <h2>Add an agency</h2>
                <div style={{display: "flex"}}>
                <div>
                <br />
                <TextField error={nameErrorMsg != ""} helperText={nameErrorMsg} required id="name" label="Agency name" value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        (e.target.value.length === 0) ? setNameErrorMsg("Please insert an agency name") : setNameErrorMsg("")
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
                    <br />
                    </div>
                    </div>
            </form>
            <div>
            <Button variant="contained" className={classes.searchButton} onClick={() => handlePostClicked()}>Submit</Button>
            <p style={{ color: "red", fontWeight: 900, fontSize: 16, marginLeft: 130}}>{serverErrorMsg}</p>
            </div>
            <h4>{postCompletedMessage}</h4>
        </Box>

    )
}
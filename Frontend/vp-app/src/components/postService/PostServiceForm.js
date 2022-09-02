import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import GetAgencies from '../getAgencies/GetAgencies';
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

export default function PostServiceForm() {

    const token = sessionStorage.getItem('token');
    const classes = useStyles();

    const [name, setName] = useState("");
    const [nameErrorMsg, setNameErrorMsg] = useState("");

    const [price, setPrice] = useState("");
    const [priceErrorMsg, setPriceErrorMsg] = useState("");

    const [agencyId, setAgencyId] = useState("");
    const [agencyIdErrorMsg, setAgencyIdErrorMsg] = useState("");

    const [info, setInfo] = useState("");

    const [serverErrorMsg, setServerErrorMsg] = useState("");
    const [postCompletedMessage, setPostCompletedMessage] = useState("")


    const axiosPostService = () => {
        axios.post('http://localhost:3001/service', {
            name: name,
            price: price,
            agency_id: agencyId,
            info: info,
        },
            {
                headers: {
                    token: token
                }
            })
            .then(function (response) {
                console.log(response);
                setPostCompletedMessage("Service " + name + " posted");
                resetTextFields();
            })
            .catch(function (error) {
                console.log(error.response);
                setServerErrorMsg(error.response.data.msg);
            });
    }

    const resetTextFields = () => {
        setName("");
        setPrice("");
    }

    const handlePostClicked = () => {

        let nameValidationError = false;
        let priceValidationError = false;
        let agencyValidationerror = false;

        if (name.length === 0 || name === "") {
            setNameErrorMsg("Please insert an service name");
            nameValidationError = true;
        }
        else {
            nameValidationError = false;
            setNameErrorMsg("");
        }

        if (price == "") {
            setPriceErrorMsg("Please insert a price");
            priceValidationError = true;
        }
        else {
            priceValidationError = false;
            setPriceErrorMsg("");
        }
        if (agencyId == "") {
            setAgencyIdErrorMsg("Please select an agency");
            agencyValidationerror = true;
        }
        else {
            setAgencyIdErrorMsg("");
            agencyValidationerror = false;
        }

        if (!nameValidationError && !priceValidationError && !agencyValidationerror) {
            axiosPostService();
        }
    }

    return (
        <Box borderColor="navy" {...defaultProps}>
            <form className={classes.formRoot} noValidate autoComplete="off">
                <h2>Add an service</h2>
                <div style={{ display: "flex" }}>
                    <div>
                        <br />
                        <GetAgencies agencyId={agencyId} setAgencyId={setAgencyId} />
                        <TextField error={nameErrorMsg != ""} helperText={nameErrorMsg} required id="name" label="Service name" value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                (e.target.value.length === 0) ? setNameErrorMsg("Please insert an agency name") : setNameErrorMsg("")
                            }} />

                        <TextField error={priceErrorMsg != ""} helperText={priceErrorMsg} id="price" label="Price" type="number" required value={price}
                            onChange={(e) => {
                                setPrice(e.target.value);
                            }} />
                        <br />
                    </div>
                    <div style={{marginTop: 30, marginLeft: 10}}>
                     <TextField variant="outlined" multiline rows = "12" id="info" label="Information" value={info}
                    onChange={(e) => {
                        setInfo(e.target.value);
                    }} />
                    </div>
                </div>
            </form>
            <div>
                <Button variant="contained" className={classes.searchButton} onClick={() => handlePostClicked()}>Submit</Button>
                <p style={{ color: "red", fontWeight: 900, fontSize: 16, marginLeft: 130 }}>{serverErrorMsg}</p>
            </div>
            <h4>{postCompletedMessage}</h4>
        </Box>

    )
}
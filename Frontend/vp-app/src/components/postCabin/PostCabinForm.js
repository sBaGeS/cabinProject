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

export default function PostCabinForm() {

    const id = sessionStorage.getItem('user_id');
    const token = sessionStorage.getItem('token');
    const classes = useStyles();

    const [agencies, setAgencies] = useState([]);

    const [name, setName] = useState("");
    const [nameErrorMsg, setNameErrorMsg] = useState("");

    const [address, setAddress] = useState("");
    const [addressErrorMsg, setAddressErrorMsg] = useState("");

    const [postcode, setPostcode] = useState("");
    const [postcodeErrorMsg, setPostcodeErrorMsg] = useState("");

    const [postarea, setPostarea] = useState("");
    const [postareaErrorMsg, setPostareaErrorMsg] = useState("");

    const [price, setPrice] = useState("");
    const [priceErrorMsg, setPriceErrorMsg] = useState("");

    const [size, setSize] = useState("");
    const [sizeErrorMsg, setSizeErrorMsg] = useState("");

    const [info, setInfo] = useState("");

    const [cabinOwnerId, setCabinOwnerId] = useState(id);
    const [cabinOwnerIdErrorMsg, setCabinOwnerIdErrorMsg] = useState("");

    const [agencyId, setAgencyId] = useState("");
    const [agencyIdErrorMsg, setAgencyIdErrorMsg] = useState("");

    const [capacity, setCapacity] = useState("");
    const [capacityErrorMsg, setCapacityErrorMsg] = useState("");

    const [serverErrorMsg, setServerErrorMsg] = useState("");
    const [postCompletedMessage, setPostCompletedMessage] = useState("")


    useEffect(() => {
        const getAgencies = () => {
            axios.get("http://localhost:3001/agency", {

            }).then(function (response) {
                console.log(response);
                setAgencies(response.data.Agencies);
            })
                .catch(function (error) {
                    console.log(error);
                })
        }
        getAgencies();
    }, []);

    const axiosPostCabin = () => {
        axios.post('http://localhost:3001/cabin', {
            name: name,
            address: address,
            postcode: postcode,
            postarea: postarea,
            price: price,
            size: size,
            agency_id: agencyId,
            capacity: capacity,
            info: info
        },
            {
                headers: {
                    token: token
                }
            })
            .then(function (response) {
                console.log(response);
                setPostCompletedMessage("Cabin " + name + " posted");
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
        setPrice("");
        setSize("");
        setAgencyId("");
        setCapacity("");
    }

    function onlyDigits(s) {
        for (let i = s.length - 1; i >= 0; i--) {
          const d = s.charCodeAt(i);
          if (d < 48 || d > 57) return false
        }
        return true
      }

    const handlePostClicked = () => {

        let nameValidationError = false;
        let priceValidationError = false;
        let addressValidationError = false;
        let postcodeValidationError = false;
        let postareaValidationError = false;
        let sizeValidationError = false;
        let agencyIdValidationError = false;
        let cabinOwnerIdValidationError = false;
        let capacityValidationError = false;

        if (name.length === 0 || name === "") {
            setNameErrorMsg("Please insert a cabin name");
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
        if (size.length === 0 || size === "") {
            setSizeErrorMsg("Please insert a cabin size");
            sizeValidationError = true;
        }
        else if (!onlyDigits(size)) {
            sizeValidationError = true;
            setSizeErrorMsg("Only numbers allowed");
        }
        else {
            sizeValidationError = false;
            setSizeErrorMsg("");
        }
        if (agencyId.length === 0 || agencyId === "") {
            agencyIdValidationError = true;
            setAgencyIdErrorMsg("Please select an agency");
        }
        else {
            agencyIdValidationError = false;
            setAgencyIdErrorMsg("");
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
        if (cabinOwnerId.length === 0 || cabinOwnerId === "") {
            cabinOwnerIdValidationError = true;
            setCabinOwnerIdErrorMsg("Please insert a cabin owner");
        }
        else {
            cabinOwnerIdValidationError = false;
            setCabinOwnerIdErrorMsg("");
        }
        if (capacity.length === 0 || capacity === "") {
            capacityValidationError = true;
            setCapacityErrorMsg("Please insert capacity for the cabin");
        }
        else if (!onlyDigits(capacity)) {
            capacityValidationError = true;
            setCapacityErrorMsg("Only numbers allowed");
        }
        else {
            capacityValidationError = false;
            setCapacityErrorMsg("");
        }

        if (nameValidationError === false &&
            cabinOwnerIdValidationError === false &&
            addressValidationError === false &&
            postcodeValidationError === false &&
            postareaValidationError === false &&
            sizeValidationError === false &&
            agencyIdValidationError === false &&
            priceValidationError === false &&
            capacityValidationError === false) {
            axiosPostCabin();
        }
    }

    return (
        <Box borderColor="navy" {...defaultProps}>
            <form className={classes.formRoot} noValidate autoComplete="off">
                <h2>Add a cabin for booking</h2>
                <div style={{display: "flex"}}>
                <div>
                <NativeSelect
                    error={agencyIdErrorMsg !== ""} required id="agencyId" value={agencyId}
                    onChange={(e) => {
                        setAgencyId(e.target.value)
                    }}>
                    <option disabled value="">Select an agency</option>
                    {agencies.map((agency, i) =>
                        <option key={i} value={agency.agency_id}>
                            {agency.name}</option>)}
                </NativeSelect>

                <br />
                <TextField error={nameErrorMsg != ""} helperText={nameErrorMsg} required id="name" label="Cabin name" value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        (e.target.value.length === 0) ? setNameErrorMsg("Please insert a cabin name") : setNameErrorMsg("")
                    }} />

                <TextField error={addressErrorMsg != ""} helperText={addressErrorMsg} required id="address" label="Address" value={address}
                    onChange={(e) => {
                        setAddress(e.target.value);
                        (e.target.value.length === 0) ? setAddressErrorMsg("Please insert an address") : setAddressErrorMsg("")
                    }} />
                <br />

                <TextField error={postcodeErrorMsg != ""} helperText={postcodeErrorMsg} required id="postcode" label="Postcode" value={postcode}
                    type="number"
                    onChange={(e) => {
                        setPostcode(e.target.value);
                        (e.target.value.length === 0) ? setPostcodeErrorMsg("Please insert a postcode") : setPostcodeErrorMsg("")
                    }} />
                <TextField error={postareaErrorMsg != ""} helperText={postareaErrorMsg} required id="postarea" label="Postarea" value={postarea}
                    onChange={(e) => {
                        setPostarea(e.target.value);
                        (e.target.value.length === 0) ? setPostareaErrorMsg("Please insert a postarea") : setPostareaErrorMsg("")
                    }} />
                <br />
                <TextField error={sizeErrorMsg != ""} helperText={sizeErrorMsg} required id="size" label="Cabin size (m2)" value={size}
                    type="number"
                    onChange={(e) => {
                        setSize(e.target.value);
                        (e.target.value.length === 0) ? setSizeErrorMsg("Please insert a size(m2) for the cabin") : setSizeErrorMsg("")
                    }} />
                <TextField error={priceErrorMsg != ""} helperText={priceErrorMsg} required id="price" label="Price for a night(Eur)" value={price}
                    type="number"
                    onChange={(e) => {
                        setPrice(e.target.value);
                        (e.target.value.length === 0) ? setPriceErrorMsg("Please insert a price for a one night") : setPriceErrorMsg("")
                    }} />
                <br />
                <TextField error={capacityErrorMsg != ""} helperText={capacityErrorMsg} required id="capacity" label="Capacity" value={capacity}
                    type="number"
                    InputProps={{ inputProps: { min: 1, max: 50 } }}
                    onChange={(e) => {
                        setCapacity(e.target.value);
                        (e.target.value.length === 0) ? setCapacityErrorMsg("Please insert capacity for the cabin") : setCapacityErrorMsg("")
                    }} />
                    </div>
                    <div style={{marginTop: 30, marginLeft: 10}}>
                     <TextField variant="outlined" multiline rows = "12" id="info" label="Additional information" value={info}
                    onChange={(e) => {
                        setInfo(e.target.value);
                    }} />
                    </div>
                    </div>
            </form>
            <Button variant="contained" className={classes.searchButton} onClick={() => handlePostClicked()}>Submit</Button>
            <h4>{postCompletedMessage}</h4>
        </Box>

    )
}
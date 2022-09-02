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

export default function EditCabinDialog(props) {

    const token = getToken();
    const cabinOwnerId = getUserId();

    const cabin = props.cabinData[0];
    
    const classes = useStyles();
    const [dialogOpen, setDialogOpen] = useState(true);

    const [name, setName] = useState(cabin.name);
    const [nameErrorMsg, setNameErrorMsg] = useState("");

    const [agencies, setAgencies] = useState([]);

    const [address, setAddress] = useState(cabin.address);
    const [addressErrorMsg, setAddressErrorMsg] = useState("");

    const [postcode, setPostcode] = useState(cabin.postcode);
    const [postcodeErrorMsg, setPostcodeErrorMsg] = useState("");

    const [postarea, setPostarea] = useState(cabin.postarea);
    const [postareaErrorMsg, setPostareaErrorMsg] = useState("");

    const [price, setPrice] = useState(cabin.price);
    const [priceErrorMsg, setPriceErrorMsg] = useState("");

    const [size, setSize] = useState(cabin.size);
    const [sizeErrorMsg, setSizeErrorMsg] = useState("");

    const [info, setInfo] = useState(cabin.info || "");
    
    const [cabinOwnerIdErrorMsg, setCabinOwnerIdErrorMsg] = useState("");

    const [agencyId, setAgencyId] = useState(cabin.agency_id);
 
    const [capacity, setCapacity] = useState(cabin.capacity);
    const [capacityErrorMsg, setCapacityErrorMsg] = useState("");


    const [serverErrorMsg, setServerErrorMsg] = useState("");

    function onlyDigits(s) {
        for (let i = s.length - 1; i >= 0; i--) {
          const d = s.charCodeAt(i);
          if (d < 48 || d > 57) return false
        }
        return true
      }

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

    const axiosPutCabin = () => {
        axios.put('http://localhost:3001/cabin/'+cabin.cabin_id, {
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
        let addressValidationError = false;
        let postcodeValidationError = false;
        let postareaValidationError = false;
        let sizeValidationError = false;
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
            priceValidationError === false &&
            capacityValidationError === false) {
            axiosPutCabin();
        }
    }

return (
    <div>
        <Dialog open={dialogOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Edit cabin info</DialogTitle>
            <DialogContent>
                <form className={classes.formRoot} noValidate autoComplete="off">
                <NativeSelect
                 required id="agencyId" value={agencyId}
                  onChange={(e) => {
                      setAgencyId(e.target.value)
                  }}>
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
                <br/>
                <TextField variant="outlined" multiline rows = "8" id="info" label="Additional information" value={info}
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
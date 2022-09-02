import React, {useState} from 'react';
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
import dateFormat from 'dateformat';
import Box from '@material-ui/core/Box';
import {MuiPickersUtilsProvider,KeyboardDatePicker} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';


const useStyles = makeStyles(theme => ({
    formRoot: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        }
    },
    Infotxt: {
        color: 'yellow',
    },
    nativeSelect: {
        margin: 8
    }
}));

export default function BookCabinDialog(props) {

    const defaultProps = {
        bgcolor: 'background.paper',
        m: 1,
        border: 2,
        padding: 2,
        borderRadius: 16
    };

    const token = getToken();
    const user = getUserId();

    const classes = useStyles();

    const [arrivaldate, setArrivaldate] = useState(props.startDate);
    const [leavedate, setLeavedate] = useState(props.endDate);

    const startDate = dateFormat(arrivaldate, "yyyy-mm-dd");

    const endDate = dateFormat(leavedate, "yyyy-mm-dd");

    const [people, setPeople] = useState("");
    const [peopleErrorMsg, setPeopleErrorMsg] = useState("");

    const [invoice, setInvoice] = useState(2);
    const [invoiceErrorMsg, setInvoiceErrorMsg]= useState("");
    
    const [pets, setPets] = useState(2);
    const [petsErrorMsg, setPetsErrorMsg] = useState("");

    const [serverErrorMsg, setServerErrorMsg] = useState("");

    const [dialogOpen, setDialogOpen] = useState(true);

    const [reserveMsg, setReserveMsg] = useState("");

    const date_diff_indays = function(date1, date2) {
        let dt1 = new Date(date1);
        let dt2 = new Date(date2);
        return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
        }

    let price = date_diff_indays(arrivaldate, leavedate) * props.price;

    const axiosPostReservation = () => {
        axios.post('http://localhost:3001/reservation/', {
            arrivaldate: startDate,
            leavedate: endDate,
            people: people,
            pets: pets,
            person_id: user,
            cabin_id: props.cabinId,
            price: price,
            invoice: invoice
        },
            {
                headers: {
                    token: token
                }
            })
            .then(function (response) {
                console.log(response);
                setServerErrorMsg("");
                setReserveMsg("Cabin succesfully booked");
                setTimeout(() => {
                setDialogOpen(false);
                props.book(false);  
                }, 3500); 
            })
            .catch(function (error) {
                console.log(error.response);
                setServerErrorMsg(error.response.data.msg);
                setTimeout(() => {
                   setServerErrorMsg("");
                }, 3500);
            });
    }

    const handleClose = () => {
        setReserveMsg("");
        setDialogOpen(false);
        props.book(false);
    };

    const handleBookClicked = () => {
        let petsValidationError = false;
        let invoiceValidationError = false;
        let peopleValidationError = false;

        if (pets == 2) {
            setPetsErrorMsg("Please select pets");
            petsValidationError = true;
        }
        else {
            petsValidationError = false;
            setPetsErrorMsg("");
        }

        if (invoice == 2) {
            setInvoiceErrorMsg("Please select an invoice type");
            invoiceValidationError = true;
        }
        else {
            invoiceValidationError = false;
            setInvoiceErrorMsg("");
        }
        if (people <= 0 || people == "") {
            setPeopleErrorMsg("Please insert the number of people");
            peopleValidationError = true;
        }
        else {
            peopleValidationError = false;
            setPeopleErrorMsg("");
        }

        if (petsValidationError === false && peopleValidationError === false && invoiceValidationError === false) {
            axiosPostReservation();
        }
    }

return (
    <div>
        <Dialog open={dialogOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Book cabin</DialogTitle>
            <DialogContent>
               

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="dd/MM/yyyy"
          margin="normal"
          id="start_date"
          label="Check in"
          disablePast = "true"
          value={arrivaldate}
          onChange={(date) => setArrivaldate(date)}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        
         <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="dd/MM/yyyy"
          margin="normal"
          id="end_date"
          label="Check out"
          disablePast = "true"
          value={leavedate}
          onChange={(date) => setLeavedate(date)}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
         </MuiPickersUtilsProvider>
          <br/>
          <form className={classes.formRoot} noValidate autoComplete="off">
                <TextField error={peopleErrorMsg != ""} helperText={peopleErrorMsg} required id="people" label="People" value={people}
                    type="number"
                    onChange={(e) => {
                        setPeople(e.target.value);
                        (e.target.value.length === 0) ? setPeopleErrorMsg("Please insert the number of people") : setPeopleErrorMsg("")
                    }} />
                    <br/>
                <NativeSelect className = {classes.nativeSelect}
                 required id="pets" label="Pets" error={petsErrorMsg != ""} helperText={petsErrorMsg} defaultValue="2"
                  onChange={(e) => {
                      setPets(parseInt(e.target.value, 10));
                      (e.target.value == 2) ? setPetsErrorMsg("Please select pets") : setPetsErrorMsg("")
                  }}>
                 <option disabled value="2">Pets?</option>
                 <option value="1">Yes</option>
                 <option value="0">No</option>
                </NativeSelect>
                
          <NativeSelect
                 required id="invoice" label="Invoice" error={invoiceErrorMsg != ""} helperText={invoiceErrorMsg} defaultValue="2"
                  onChange={(e) => {
                      setInvoice(parseInt(e.target.value, 10));
                      (e.target.value == 2) ? setInvoiceErrorMsg("Please select invoice type") : setInvoiceErrorMsg("")
                  }}>
                 <option disabled value="2">Invoice type</option>
                 <option value="1">Email</option>
                 <option value="0">Letter</option>
                </NativeSelect>
                <br />
            </form>

            <Box borderColor="darkgreen" {...defaultProps}> 
            
                <p style={{ color: "navy", fontWeight: 900, fontSize: 16, marginLeft: 115 }}>Total price: {price}€</p>

            </Box>
            </DialogContent>

            <div>
                <p style={{ color: "red", fontWeight: 900, fontSize: 14, marginLeft: 120 }}>{serverErrorMsg}</p>
                <p style={{ color: "darkgreen", fontWeight: 900, fontSize: 16, marginLeft: 125 }}>{reserveMsg}</p>

                <DialogActions>
                    <Button variant="contained" onClick={() => handleBookClicked()}>Book</Button>
                    <Button variant="contained" onClick={() => handleClose()}>Close</Button>
                </DialogActions>
            </div>
        </Dialog>
    </div>
    )
}
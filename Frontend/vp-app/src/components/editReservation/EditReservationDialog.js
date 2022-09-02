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
import {MuiPickersUtilsProvider,KeyboardDatePicker} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import dateFormat from 'dateformat';


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

export default function EditReservationDialog(props) {

    const token = getToken();
    
    const classes = useStyles();
    const [dialogOpen, setDialogOpen] = useState(true);

    const startDateParts = props.arrivaldate.split("/");
    const endDateParts = props.leavedate.split("/");

    const startDate = new Date(startDateParts[1] + "/" + startDateParts[0] + "/" + startDateParts[2]);
    const endDate = new Date(endDateParts[1] + "/" + endDateParts[0] + "/" + endDateParts[2]);

    const [arrivaldate, setArrivaldate] = useState(startDate);
    const [leavedate, setLeavedate] = useState(endDate);
    const [people, setPeople] = useState(props.people);
    const [peopleErrorMsg, setPeopleErrorMsg] = useState("");
    const [pets, setPets] = useState(props.pets);
 
    const [serverErrorMsg, setServerErrorMsg] = useState("");

    const date_diff_indays = function(date1, date2) {
        let dt1 = new Date(date1);
        let dt2 = new Date(date2);
        return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
        }

        const [price, setPrice] = useState(props.price / date_diff_indays(arrivaldate, leavedate));

    const axiosPutReservation = () => {

        let new_price = date_diff_indays(arrivaldate, leavedate) * price;

        axios.put('http://localhost:3001/reservation/'+ props.id, {

            arrivaldate: dateFormat(arrivaldate, "yyyy-mm-dd"),
            leavedate: dateFormat(leavedate, "yyyy-mm-dd"),
            people: people,
            pets: pets,
            cabin_id: props.cabinId,
            price: new_price
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
                setTimeout(() => {
                  setServerErrorMsg("");
                }, 3500);
            });
    }

    const handleClose = () => {
        setDialogOpen(false);
        props.edit(false);
    };

    const handleEditClicked = () => {
        let peopleValidationError = false;

        if (people <= 0 || people == "") {
            setPeopleErrorMsg("Please insert the number of people");
            peopleValidationError = true;
        }
        else {
            peopleValidationError = false;
            setPeopleErrorMsg("");
        }

        if (peopleValidationError === false) {
            axiosPutReservation();
        }
    }

return (
    <div>
        <Dialog open={dialogOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Edit reservation info</DialogTitle>
            <DialogContent>
            <form className={classes.formRoot} noValidate autoComplete="off">
            <TextField error={peopleErrorMsg != ""} helperText={peopleErrorMsg} required id="people" label="People" value={people}
                    type="number"
                    onChange={(e) => {
                        setPeople(parseInt(e.target.value, 10));
                        (e.target.value.length === 0) ? setPeopleErrorMsg("Please insert the number of people") : setPeopleErrorMsg("")
                    }} />
            <div style={{display: "flex"}}> 
            <div style={{marginTop: 6, marginLeft: 10}}>
            <p>Pets</p>
            <NativeSelect
                 required id="pets" label="Pets" defaultValue={props.pets}
                  onChange={(e) => {
                      setPets(parseInt(e.target.value, 10));
                  }}>
                 <option value="1">Yes</option>
                 <option value="0">No</option>
                </NativeSelect>
                </div>

                <div style={{marginTop: 30, marginLeft: 10}}>
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
            </div>


            </div>
            </form>
            </DialogContent>

            <div>
                <p style={{ color: "red", fontWeight: 900, fontSize: 14, marginLeft: 110 }}>{serverErrorMsg}</p>

                <DialogActions>
                    <Button variant="contained" onClick={() => handleEditClicked()}>Edit</Button>
                    <Button variant="contained" onClick={() => handleClose()}>Cancel</Button>
                </DialogActions>
            </div>
        </Dialog>
    </div>
    )
}
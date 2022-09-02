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

export default function EditBillDialog(props) {

    const token = getToken();

    const classes = useStyles();

    const [amount, setAmount] = useState(props.price);
    const [paid, setPaid] = useState(props.paid);

    const [dialogOpen, setDialogOpen] = useState(true);

    const[priceErrorMsg, setPriceErrorMsg] = useState("");

    const [serverErrorMsg, setServerErrorMsg] = useState("");

    const startDateParts = props.duedate.split("/");

    const startDate = new Date(startDateParts[1] + "/" + startDateParts[0] + "/" + startDateParts[2]);

    const [duedate, setDuedate] = useState(startDate);

    const axiosPutBill = () => {
        axios.put('http://localhost:3001/bill/'+ props.id, {
            amount: amount,
            duedate: dateFormat(duedate, "yyyy-mm-dd"),
            paid: paid
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

    const handleEditClicked = () => {
        let priceValidationError = false;

        if (amount < 0 || amount == "") {
            setPriceErrorMsg("Please insert price for the bill");
            priceValidationError = true;
        }
        else {
            priceValidationError = false;
            setPriceErrorMsg("");
        }

        if (priceValidationError === false) {
            axiosPutBill();
        }
    }

    const handleClose = () => {
        setDialogOpen(false);
        props.edit(false);
    };

return (
    <div>
        <Dialog open={dialogOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Edit bill info</DialogTitle>
            <DialogContent>
                <form className={classes.formRoot} noValidate autoComplete="off">
                <p>Paid</p>
            <NativeSelect
                 required id="paid" label="Paid" defaultValue={props.paid}
                  onChange={(e) => {
                      setPaid(parseInt(e.target.value, 10));
                      console.log(paid);
                  }}>
                 <option value="1">Yes</option>
                 <option value="0">No</option>
                </NativeSelect>

                <TextField error={priceErrorMsg != ""} helperText={priceErrorMsg} required id="price" label="Amount" value={amount} type="number"
                    onChange={(e) => {
                        setAmount(e.target.value);
                        (e.target.value.length === 0 || e.target.value < 0) ? setPriceErrorMsg("Please insert price for the bill") : setPriceErrorMsg("")
                    }} />
            </form>

            <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="dd/MM/yyyy"
          margin="normal"
          id="start_date"
          label="Check in"
          disablePast = "true"
          value={duedate}
          onChange={(date) => setDuedate(date)}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
         </MuiPickersUtilsProvider>

            </DialogContent>

            <div>
                <p style={{ color: "red", fontWeight: 900, fontSize: 14, marginLeft: 20 }}>{serverErrorMsg}</p>

                <DialogActions>
                    <Button variant="contained" onClick={() => handleEditClicked()}>Edit</Button>
                    <Button variant="contained" onClick={() => handleClose()}>Cancel</Button>
                </DialogActions>
            </div>
        </Dialog>
    </div>
    )
}
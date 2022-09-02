import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Box from '@material-ui/core/Box';
import axios from 'axios';
import FormControl from '@material-ui/core/FormControl';
import { Typography } from '@material-ui/core';
import { getUserId, getToken } from '../../Utils/Common';
import dateFormat from 'dateformat';
import NativeSelect from '@material-ui/core/NativeSelect';

export default function PostServiceReservation(props) {

    const defaultProps = {
        bgcolor: 'background.paper',
        m: 1,
        border: 2,
        padding: 2,
        borderRadius: 16
    };

    const [dialogOpen, setDialogOpen] = useState(true);
    const user = getUserId();
    const token = getToken();
    const [serverErrorMsg, setServerErrorMsg] = useState("");
    const [reservationDate, setReservationDate] = useState(new Date());
    const [bookedMsg, setBookedMsg] = useState("");
    const [invoice, setInvoice] = useState(2);
    const [invoiceErrorMsg, setInvoiceErrorMsg]= useState("");



    const axiosPostServiceReservation = () => {
        axios.post("http://localhost:3001/serviceReservation/", {
            service_id: props.service_id,
            person_id: user,
            reservationdate: reservationDate,
            price: props.price,
            invoice: invoice,
        },
            {
                headers: {
                    token: token
                }
            })
            .then(function (response) {
                console.log(response);
                setServerErrorMsg("");
                setBookedMsg("Service booked")
                setTimeout(() => {
                    setDialogOpen(false);
                }, 3000);
            })
            .catch(function (error) {
                console.log(error.response);
                setServerErrorMsg(error.response.data.msg);
                setTimeout(() => {
                    setServerErrorMsg("");
                }, 3000);
            });
    }


    const handleClose = () => {
        setDialogOpen(false);
        props.book(false);
    };
    const handleBookClicked = () => {
        let invoiceValidationError;

        if (invoice == 2) {
            setInvoiceErrorMsg("Please select an invoice type");
            invoiceValidationError = true;
        }
        else {
            invoiceValidationError = false;
            setInvoiceErrorMsg("");
        }
        if (!invoiceValidationError) {
            axiosPostServiceReservation();
        }
    }

    return (
        <div>
            <Dialog open={dialogOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Reserve service</DialogTitle>
                <DialogContent>
                    <Typography>
                        You are reserving <span style={{ fontWeight: 900 }}>{props.service}</span>.<br />
                    </Typography>

                    <Typography>
                        Please select date below
                    </Typography>
                    <FormControl>
                        <br />
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="dd/MM/yyyy"
                                margin="normal"
                                id="reservation_date"
                                label="Date"
                                disablePast="true"
                                value={reservationDate}
                                onChange={(date) => setReservationDate(dateFormat(date, "yyyy-mm-dd"))}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </MuiPickersUtilsProvider>
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

                    </FormControl>
                    <p style={{ color: "red", fontWeight: 900, fontSize: 17, marginLeft: 40 }}>{serverErrorMsg}</p>
                    <p style={{ color: "green", fontWeight: 900, fontSize: 17, marginLeft: 40 }}>{bookedMsg}</p>
                    <Box borderColor="darkgreen" {...defaultProps}>
                        <p style={{ color: "navy", fontWeight: 900, fontSize: 16 }}>Total price: {props.price}€</p>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={() => handleBookClicked()}>Book</Button>
                    <Button variant="contained" onClick={() => handleClose()}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
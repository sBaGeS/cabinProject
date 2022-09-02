import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import axios from 'axios';
import { getToken, getAdmin } from '../../Utils/Common';
import { set } from 'date-fns';
import EditCabinBillDialog from "../EditCabinBill/EditCabinBillDialog";

const useStyles = makeStyles(() => ({
    searchButton: {
        marginTop: 5,
        backgroundColor: 'navy',
        color: 'white',
        '&:hover': {
            background: "white",
            color: 'navy',
        },
    },
    TextField: {
        marginTop: 15,
        marginLeft: 15,
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 4
    },
    editButton: {
        margin: 4,
        backgroundColor: 'navy',
        color: 'white',
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
const statusBox = {
    bgcolor: 'background.paper',
    border: 2,
    padding: 2,
    borderRadius: 10,
    borderColor: 'navy',
    width : 200,
    align : 'left'

};

export default function GetCabinBills(props) {

    const classes = useStyles();

    const [bills, setBills] = useState([]);
    const [personId, setPersonId] = useState("");
    const [billId, setBillId] = useState("");
    const [cabinId, setCabinId] = useState("");
    const [reservationId, setReservationId] = useState("");
    const [paidChecked, setPaidChecked] = useState(false);
    const [openChecked, setOpenChecked] = useState(false);
    const [edit, setEdit] = useState(false);

    const [price, setPrice] = useState("");
    const [duedate, setDuedate] = useState("");
    const [paid, setPaid] = useState("");
    const [id, setId] = useState("");

    const [serverErrorMsg, setServerErrorMsg] = useState("");

    let token = getToken();

    let dialog;

    const axiosGetBills = (query) => {
        axios.get("http://localhost:3001/bill?" + query, {
            headers: {
                token: token
            }
        }).then(function (response) {
            console.log(response);
            setBills(response.data.Bills);
        })
            .catch(function (error) {
                console.log(error);
                setServerErrorMsg(error);
            })
    }


    const handlePostClicked = () => {
        let query = "";

        if(paidChecked){
            query += "paid=" + "1";
        }
        if(openChecked){
            query += "paid=" + "0";
        }
        if(billId != ""){
            query += "&bill_id=" + billId;
        }
        if(personId != ""){
            query += "&person_id=" + personId;
        }
        if(cabinId != ""){
            query += "&cabin_id=" + cabinId;
        }
        if(reservationId != ""){
            query += "&reservation_id=" + reservationId;
        }
        console.log(query);
        axiosGetBills(query);
    }

    if(edit){
        dialog = <EditCabinBillDialog price={price} paid={paid} duedate={duedate} id={id} edit={setEdit}/>;
    }
    else{
        dialog = "";
    }

    return (

        <Box borderColor="navy" {...defaultProps}>
            <h2>Cabin bills</h2>
            <div>
                <form>
                    <Box borderColor="navy" {...statusBox}> 
                    <h3>Bill status</h3>

                    Paid <Checkbox  color="primary" disabled = {openChecked}  checked={paidChecked} onChange={(e) => setPaidChecked(paidChecked ? false : true)}
                    />
                    Open <Checkbox  color="primary" disabled = {paidChecked} checked={openChecked} onChange={(e) => setOpenChecked(openChecked ? false : true)}
                    />
                    <br/>
                    </Box>
                    <TextField className={classes.TextField} type="number" id="billId" label="Bill Id" value={billId}
                        onChange={(e) =>
                            setBillId(e.target.value)} />
                    <TextField className={classes.TextField} type="number" id="personId" label="Person Id" value={personId}
                        onChange={(e) =>
                            setPersonId(e.target.value)} />
                    <br />
                    <TextField className={classes.TextField} type="number" id="cabinId" label="Cabin Id" value={cabinId}
                        onChange={(e) =>
                            setCabinId(e.target.value)} />
                    <TextField className={classes.TextField} type="number" id="Reservation Id" label="Reservation Id" value={reservationId}
                        onChange={(e) =>
                            setReservationId(e.target.value)} />
                </form>
                
                <Button variant="contained" className={classes.searchButton} onClick={() => handlePostClicked()}>Search</Button>
                <p style={{ color: "red", fontWeight: 900, fontSize: 16, marginLeft: 130 }}>{serverErrorMsg}</p>
            </div>
            <div>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="customized table">
                        <TableHead className={classes.tableHeader}>
                            <TableRow>
                                <TableCell className={classes.tableHeaderCell} align="left">Bill ID</TableCell>
                                <TableCell className={classes.tableHeaderCell} align="left">Reservation ID</TableCell>
                                <TableCell className={classes.tableHeaderCell} align="left">Cabin ID</TableCell>
                                <TableCell className={classes.tableHeaderCell} align="left">Cabin Name</TableCell>
                                <TableCell className={classes.tableHeaderCell} align="left">Person ID</TableCell>
                                <TableCell className={classes.tableHeaderCell} align="left">Customer</TableCell>
                                <TableCell className={classes.tableHeaderCell} align="left">Email</TableCell>
                                <TableCell className={classes.tableHeaderCell} align="left">Amount</TableCell>
                                <TableCell className={classes.tableHeaderCell} align="left">Due date</TableCell>
                                <TableCell className={classes.tableHeaderCell} align="left">Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bills.map((bill, i) => <TableRow key={i}>
                                <TableCell align="left">{bill.bill_id}</TableCell>
                                <TableCell align="left">{bill.reservation_id}</TableCell>
                                <TableCell align="left">{bill.cabin_id}</TableCell>
                                <TableCell align="left">{bill.name}</TableCell>
                                <TableCell align="left">{bill.person_id}</TableCell>
                                <TableCell align="left">{bill.firstname} {bill.lastname}</TableCell>
                                <TableCell align="left">{bill.email}</TableCell>
                                <TableCell align="left">{bill.amount}€</TableCell>
                                <TableCell align="left">{bill.duedate}</TableCell>
                                <TableCell align="left">{bill.paid == 0 ? "Open" : "Paid"}</TableCell>
                                <TableCell align="left">{bill.arrivaldate}</TableCell>
                                <TableCell align="left">{bill.leavedate}</TableCell>
                                <TableCell align="left"><Button className={classes.editButton}  onClick={() => edit ? setEdit(false) : setEdit(true) + setPrice(bill.amount) + setPaid(bill.paid) + setDuedate(bill.duedate) + setId(bill.bill_id)}>Edit</Button></TableCell>
                            </TableRow>)}
                        </TableBody>
                    </Table>
                </TableContainer>
              {dialog}
            </div>
        </Box>
    )
}
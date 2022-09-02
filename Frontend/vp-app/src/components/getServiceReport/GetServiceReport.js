import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import GetAgencies from '../getAgencies/GetAgencies';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import { getToken } from '../../Utils/Common';
import dateFormat from 'dateformat';

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
    datePicker: {
        marginTop: 5,
        marginBottom: 5
    }
}));
const defaultProps = {
    bgcolor: 'background.paper',
    m: 1,
    border: 2,
    padding: 2,
    borderRadius: 16,
    borderColor: 'navy'

};

export default function GetServiceReport(props) { 

    const classes = useStyles();
    const [serviceReport, setServiceReport] = useState([]);
    const [agencyId, setAgencyId] = useState("");
    const [agencyErrorMsg, setAgencyErrorMsg] = useState("");
    const [serverErrorMsg, setServerErrorMsg] = useState("");
    const [startDate, setStartDate] = useState(dateFormat(new Date(), "yyyy-mm-dd"));
    const [endDate, setEndDate] = useState(dateFormat(new Date(), "yyyy-mm-dd"));
    const [reservationSum, setReservationSum] = useState(0);
    const [loaded, setLoaded] = useState(false);

    let reportElement = "";
    let token = getToken();

    const axiosGetServiceReport = (query) => {
        axios.get("http://localhost:3001/servicereport?" + query, {
            headers: {
                token: token
            }
        }).then(function (response) { 
            console.log(response);
            setServiceReport(response.data.serviceReport);
            setLoaded(true);
        })
            .catch(function (error) {
                console.log(error);
                setServerErrorMsg(error);
            })
    }
    if (loaded) {
        let sum = 0;
        for (let i = 0; i < serviceReport.length; i++) {
            sum += serviceReport[i].price;
        }
        setReservationSum(sum);
        console.log(sum);
        setLoaded(false);
    }

    const handlePostClicked = () => {
        let query = "";
        let agencyError;
        if (agencyId == "") {
            agencyError = true;
            setAgencyErrorMsg("Please select an agency");
        }
        else {
            query += "agency_id=" + agencyId + "&";
            agencyError = false;
            setAgencyErrorMsg("");
        }
        if (startDate != "" && endDate != "") {

            query += "startDate=" + startDate + "&endDate=" + endDate;
        }
        if (!agencyError) {
            axiosGetServiceReport(query);
        }
    }

    if (serviceReport.length !== 0) {
        reportElement = <div>
            <p style={{ color: "green", fontWeight: 900, fontSize: 16 }}>Reservations: {serviceReport.length}</p>
            <p style={{ color: "green", fontWeight: 900, fontSize: 16 }}>Total Sum: {reservationSum}€</p>
        </div>
    }

    return (

        <Box borderColor="navy" {...defaultProps}>
            <h2>Service Reports</h2>
            <div style={{ display: "flex" }}>
                <div>
                    <GetAgencies agencyId={agencyId} setAgencyId={setAgencyId} />
                    <br />
                    <Paper className={classes.datePicker}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="dd/MM/yyyy"
                                margin="normal"
                                id="start_date"
                                label="Start date"
                                value={startDate}
                                onChange={(date) => setStartDate(dateFormat(date, "yyyy-mm-dd"))}
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
                                label="End date"
                                value={endDate}
                                onChange={(date) => setEndDate(dateFormat(date, "yyyy-mm-dd"))}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </MuiPickersUtilsProvider><br />
                    </Paper>
                </div>
            </div>
            <div>
                <Button variant="contained" className={classes.searchButton} onClick={() => handlePostClicked()}>Search</Button>
                <p style={{ color: "red", fontWeight: 900, fontSize: 16, marginLeft: 130 }}>{serverErrorMsg}{agencyErrorMsg}</p>
            </div>
            <div>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="customized table">
                        <TableHead className={classes.tableHeader}>
                            <TableRow>
                                <TableCell className={classes.tableHeaderCell} align="left">Service Name</TableCell>
                                <TableCell className={classes.tableHeaderCell} align="left">Customer</TableCell>
                                <TableCell className={classes.tableHeaderCell} align="left">Price</TableCell>
                                <TableCell className={classes.tableHeaderCell} align="left">Paid</TableCell>
                                <TableCell className={classes.tableHeaderCell} align="left">Agency</TableCell>
                                <TableCell className={classes.tableHeaderCell} align="left">Reservation Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {serviceReport.map((report, i) => <TableRow key={i}>
                                <TableCell align="left">{report.service}</TableCell>
                                <TableCell align="left">{report.firstname} {report.lastname}</TableCell>
                                <TableCell align="left">{report.price}€</TableCell>
                                <TableCell align="left">{report.paid === 1 ? "Yes" : "No"}</TableCell>
                                <TableCell align="left">{report.agency}</TableCell>
                                <TableCell align="left">{report.reservationdate}</TableCell>
                            </TableRow>)}
                        </TableBody>
                    </Table>
                </TableContainer>
                {reportElement}
            </div>
        </Box>
    )
}
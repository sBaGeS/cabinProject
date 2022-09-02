import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import {useHistory} from 'react-router-dom';
import EditCustomerDialog from "./EditCustomerDialog";
import RemoveCustomerDialog from "./RemoveCustomerDialog";

const useStyles = makeStyles({
    CustomerDiv: {
        maxWidth: 1400,
        paddingTop: 15,
    },
    tableHeader: {
        backgroundColor: 'orange',
    },
    tableHeaderCell: {
        color: 'white'
    },
    editButton: {
        margin: 4,
        backgroundColor: 'navy',
        color: 'white',
    },
    deleteButton: {
        margin: 4,
        backgroundColor: 'navy',
        color: 'white',
    },
    cabinButton: {
        margin: 4,
        backgroundColor: 'navy',
        color: 'white',
    },

});

export default function CustomerTable(props) {

    const style = useStyles();

    let history = useHistory();

    const query = props.query;
    const searchClicked = props.searchClicked;
    const [customers, setCustomers] = useState([]);

    const [firstname, setFirstname] = useState([]);
    const [lastname, setLastname] = useState([]);
    const [username, setUsername] = useState([]);


    const [editedCustomer, setEditedCustomer] = useState({firstname: null, lastname: null, username: null});

    const [id, setId] = useState(0);

    const [edit, setEdit] = useState(false);

    const [remove, setRemove] = useState(false);
    const [removeMsg, setRemoveMsg] = useState("");

    let dialog;

    useEffect(() => {
        const getCustomers = () => {
            axios.get("http://localhost:3001/person?" + query, {
                headers: {
                    token: sessionStorage.getItem("token")
                }
            })
                .then(function (response) {
                    console.log(response);
                    setCustomers(response.data.Persons);
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
        if (searchClicked > 0)
        {
        getCustomers();
        }
    }, [searchClicked]);

    if(edit)
    {
        dialog = <EditCustomerDialog id = {id} edit = {setEdit} setEditedCustomer={setEditedCustomer}/>;
    }

    else if(remove)
    {
        dialog = <RemoveCustomerDialog id = {id} remove = {setRemove} removeMsg={setRemoveMsg} firstname={firstname} lastname={lastname} username={username}/>;
    }

    else
    {
        dialog = null;
    }

    if (searchClicked == 0) {
        return (
            <div>
                
            </div>
        )
    }

    else if (editedCustomer.firstname != null)
    {
      return (
       <div style={{marginTop: 25, marginLeft: 12}}>
      <a style={{ color: "orange", fontWeight: 900, fontSize: 22}}>Customer {editedCustomer.firstname} <a style={{ color: "darkred", fontWeight: 900, fontSize: 22}}>"{editedCustomer.username}"</a> {editedCustomer.lastname} succesfully edited</a>
       </div>
      )
    }

    else if (removeMsg != "")
    {
      return (
       <div style={{marginTop: 25, marginLeft: 12}}>
         {removeMsg}
       </div>
      )
    }

    else {
        return (
<div className={style.CustomerDiv}>
                <TableContainer component={Paper}>
                    <Table className={style.table} aria-label="customized table">
                        <TableHead className={style.tableHeader}>
                            <TableRow>
                                <TableCell className={style.tableHeaderCell}>Id</TableCell>
                                <TableCell className={style.tableHeaderCell} align="right">Firstname</TableCell>
                                <TableCell className={style.tableHeaderCell} align="right">Lastname</TableCell>
                                <TableCell className={style.tableHeaderCell} align="right">Address</TableCell>
                                <TableCell className={style.tableHeaderCell} align="right">Postcode</TableCell>
                                <TableCell className={style.tableHeaderCell} align="right">Postarea</TableCell>
                                <TableCell className={style.tableHeaderCell} align="right">Phonenumber</TableCell>
                                <TableCell className={style.tableHeaderCell} align="right">Email</TableCell>
                                <TableCell className={style.tableHeaderCell} align="right">Username</TableCell>
                                <TableCell className={style.tableHeaderCell} align="right">Role</TableCell>
                                <TableCell className={style.tableHeaderCell} align="center">Edit</TableCell>
                                <TableCell className={style.tableHeaderCell} align="center">Delete</TableCell>
                                <TableCell className={style.tableHeaderCell} align="center">Cabins</TableCell>
                                <TableCell className={style.tableHeaderCell} align="center">Reservations</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {customers.map((customer, i) => <TableRow key={i}>
                                <TableCell>{customer.person_id}</TableCell>
                                <TableCell align="right">{customer.firstname}</TableCell>
                                <TableCell align="right">{customer.lastname}</TableCell>
                                <TableCell align="right">{customer.address}</TableCell>
                                <TableCell align="right">{customer.postcode}</TableCell>
                                <TableCell align="right">{customer.postarea}</TableCell>
                                <TableCell align="right">{customer.phonenumber}</TableCell>
                                <TableCell align="right">{customer.email}</TableCell>
                                <TableCell align="right">{customer.username}</TableCell>
                                <TableCell align="right">{customer.role_id == 1 ? <a style={{ color: "red", fontWeight: 900}}>Admin</a> : "Customer"}</TableCell>
                                <TableCell align="right"><Button className={style.editButton} onClick={() => edit ? setEdit(false) : setEdit(true) + setId(customer.person_id) + setFirstname(customer.firstname) + setLastname(customer.lastname) + setUsername(customer.username)}>Edit</Button></TableCell>
                                <TableCell align="right"><Button className={style.deleteButton} onClick={() => remove ? setRemove(false) : setRemove(true) + setId(customer.person_id) + setFirstname(customer.firstname) + setLastname(customer.lastname) + setUsername(customer.username)}>Delete</Button></TableCell>
                                <TableCell align="right"><Button className={style.cabinButton} href= {`/user_cabins/${customer.person_id}?username=${customer.username}`}>Cabins</Button></TableCell>
                                <TableCell align="right"><Button className={style.cabinButton} href= {`/user_reservations?user_id=${customer.person_id}&username=${customer.username}`}>Reservations</Button></TableCell>
                            </TableRow>)}   
                        </TableBody>
                    </Table>
                </TableContainer>
                {dialog}
        </div>
        )
    }
}
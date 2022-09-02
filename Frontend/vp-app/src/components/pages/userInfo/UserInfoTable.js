import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import EditUserInfoFormDialog from './EditUserInfoFormDialog';

const useStyles = makeStyles({
    table: {
        maxWidth: 800,
    },
    paper: {
        maxWidth: 800,
    },
    searchButton: {
        margin: 4,
        backgroundColor: 'navy',
        color: 'white',
      }
});

export default function UserInfoTable() {

    const classes = useStyles();
    const [user, setUser] = useState([]);
    const [edit, setEdit] = useState(false);
    let dialog;
    let token = sessionStorage.getItem('token');
    let id = sessionStorage.getItem('user_id');
    console.log(user);
   
    useEffect(() => {
        const getUser = (id) => {
            axios.get("http://localhost:3001/person?id=" + id, {
                headers: {
                  token: token
                }
            })
                .then(function (response) {
                    console.log(response);
                    setUser(response.data.Persons);
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
        getUser(id);
    }, []);

    if(edit){
        dialog = <EditUserInfoFormDialog userData = {user} edit = {setEdit} />;
    }
    else{
        dialog = "";
    }
    return (
        <div>
            <TableContainer className = {classes.paper} component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    {user.map((user, i) =>
                        <TableHead key={i}>
                            <TableRow>
                                <TableCell>Firstname</TableCell>
                                <TableCell>{user.firstname}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Lastname</TableCell>
                                <TableCell>{user.lastname}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Address</TableCell>
                                <TableCell>{user.address}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Postcode</TableCell>
                                <TableCell>{user.postcode}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Postarea</TableCell>
                                <TableCell>{user.postarea}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Phonenumber</TableCell>
                                <TableCell>{user.phonenumber}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Email</TableCell>
                                <TableCell>{user.email}</TableCell>
                            </TableRow>
                        </TableHead>
                    )}
                </Table>
            </TableContainer>
            <Button variant="contained" className = {classes.searchButton} onClick={() => edit ? setEdit(false) : setEdit(true)}>Edit</Button>
            {dialog}
        </div>
    )
}
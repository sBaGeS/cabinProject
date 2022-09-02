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
import {getAdmin} from "../../../Utils/Common"
import EditAgencyDialog from '../../editAgency/EditAgencyDialog';
import RemoveAgencyDialog from '../../removeAgency/RemoveAgencyDialog';


const useStyles = makeStyles({
    cabinDiv: {
        display: 'grid',
        background: 'navy',
        padding: 8,
        maxWidth: 600,
        maxHeight: 400
    },
    tableHeader: {
        backgroundColor: 'navy',
        
    },
    tableHeaderCell: {
        color: 'white'
    },
    agencyInfo: {
        margin: 4,
        height: 250
       
    },
    editButton: {
        margin: 4,
        backgroundColor: 'navy',
        color: 'white',
        minWidth: 50,
    },

});

export default function GetAgencyInfo(props) {

    const classes = useStyles();

    const token = sessionStorage.getItem('token');

    const [id, setId] = useState(0);

    const [agencies, setAgencies] = useState([]);

    const [edit, setEdit] = useState(false);
    const [remove, setRemove] = useState(false);
    let dialog;

    const [name, setName] = useState("");


    useEffect(() => {
        const getAgencies = () => {
            axios.get("http://localhost:3001/agency", {
                headers: {
                    token: token
                }
            })
                .then(function (response) {
                    console.log(response);
                    setAgencies(response.data.Agencies);
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
        getAgencies();
    }, []);

    
    if(edit){
        dialog = <EditAgencyDialog id = {id} edit = {setEdit}/>;
    }
    else if(remove){
        dialog = <RemoveAgencyDialog id = {id} remove = {setRemove} name = {name}/>;
    }
    else{
        dialog = "";
    }

    if(agencies.length > 0){
    return (
        <div>
             <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead className = {classes.tableHeader}>
          <TableRow>
            <TableCell className={classes.tableHeaderCell} align="center">Name</TableCell>
            <TableCell className={classes.tableHeaderCell} align="center">Address</TableCell>
            <TableCell className={classes.tableHeaderCell} align="center">Postcode</TableCell>
            <TableCell className={classes.tableHeaderCell} align="center">Postarea</TableCell>
            <TableCell className={classes.tableHeaderCell} align="center">Phonenumber</TableCell>
            <TableCell className={classes.tableHeaderCell} align="center">Email</TableCell>
            <TableCell className={classes.tableHeaderCell} align="center">Edit</TableCell>
            <TableCell className={classes.tableHeaderCell} align="center">Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {agencies.map((agency, i) => <TableRow key = {i}>
            <TableCell align="center">{agency.name}</TableCell>
            <TableCell align="center">{agency.address}</TableCell>
            <TableCell align="center">{agency.postcode}</TableCell>
            <TableCell align="center">{agency.postarea}</TableCell>
            <TableCell align="center">{agency.phonenumber}</TableCell>
            <TableCell align="center">{agency.email}</TableCell>
            <TableCell align="center"><Button className={classes.editButton} onClick={() => edit ? setEdit(false) : setId(agency.agency_id) + setEdit(true)}>Edit</Button></TableCell>
            <TableCell align="center"><Button className={classes.editButton} onClick={() => remove ? setRemove(false) : setId(agency.agency_id) + setRemove(true) + setName(agency.name)}>Delete</Button></TableCell>
            </TableRow>)}
        </TableBody>
        </Table>
            </TableContainer>
            {dialog}
        </div>
    )
    }
    else{
        return(
            <div>
                No agencies found
            </div>
        )
    }
}


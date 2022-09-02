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

export default function GetMyCabins(props) {

    const classes = useStyles();

    const token = sessionStorage.getItem('token');
    const id = props.id;
    

    const [cabins, setCabins] = useState([]);


    useEffect(() => {
        const getCabins = (id) => {
            axios.get("http://localhost:3001/cabin?cabinowner_id=" + id, {
                headers: {
                    token: token
                }
            })
                .then(function (response) {
                    console.log(response);
                    setCabins(response.data.Cabins);
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
        getCabins(id);
    }, []);
    if(cabins.length > 0){
    return (
        <div>
             <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead className = {classes.tableHeader}>
          <TableRow>
            <TableCell className={classes.tableHeaderCell}>Name</TableCell>
            <TableCell className={classes.tableHeaderCell} align="right">Agency</TableCell>
            <TableCell className={classes.tableHeaderCell} align="right">Postarea</TableCell>
            <TableCell className={classes.tableHeaderCell} align="right">Address</TableCell>
            <TableCell className={classes.tableHeaderCell} align="right">Postcode</TableCell>
            <TableCell className={classes.tableHeaderCell} align="right">Size</TableCell>
            <TableCell className={classes.tableHeaderCell} align="right">Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {cabins.map((cabin, i) => <TableRow key = {i}>
            <TableCell><Button href= {`/cabin_detail/${cabin.cabin_id}`} className= {classes.editButton}>{cabin.name}</Button></TableCell>
            <TableCell align="right">{cabin.agencyName}</TableCell>
            <TableCell align="right">{cabin.postarea}</TableCell>
            <TableCell align="right">{cabin.address}</TableCell>
            <TableCell align="right">{cabin.postcode}</TableCell>
            <TableCell align="right">{cabin.size}m2</TableCell>
            <TableCell align="right">{cabin.price}€</TableCell>
            </TableRow>)}
        </TableBody>
        </Table>
            </TableContainer>
        </div>
    )
    }
    else{
        return(
            <div>
                You haven't listed any cabins yet. Start by adding one for a booking
            </div>
        )
    }
}


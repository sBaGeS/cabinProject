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
import {getAdmin, getToken} from "../../Utils/Common"
import EditServiceDialog from "../editService/EditServiceDialog";
import RemoveServiceDialog from "../removeService/RemoveServiceDialog";
import PostServiceReservation from '../postServiceReservation/PostServiceReservationDialog';

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
    linkButton: {
        margin: 4,
        backgroundColor: 'navy',
        color: 'white',
        '&:hover': {
            background: "white",
            color: 'navy',
        },
    },

});

export default function GetServices(props) {

    const classes = useStyles();

    const [services, setServices] = useState([]);

    const query = props.query;

    let dialog;

    const [edit, setEdit] = useState(false);

    const [remove, setRemove] = useState(false);

    const [reserve, setReserve] = useState(false);

    const [name, setName] = useState("");

    const [price, setPrice] = useState("");

    const [id, setId] = useState("");

    const [agencyId, setAgencyId] = useState("");

    const [info, setInfo] = useState("");


    useEffect(() => {
        const getServices = () => {
            axios.get("http://localhost:3001/service?" + query, {
            })
                .then(function (response) {
                    console.log(response);
                    setServices(response.data.services);
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
        if (props.searchClicked > 0) {
            getServices();
        }
    }, [props.searchClicked]);

     if(edit){
        dialog = <EditServiceDialog name = {name} price = {price} agency = {agencyId} info = {info} edit = {setEdit} id = {id}/>;
    }

    else if(remove){
        dialog = <RemoveServiceDialog name = {name} remove = {setRemove} id={id}/>;
    }
    else if(reserve){
        dialog = <PostServiceReservation name = {name} price = {price} agencyId = {agencyId} reserve = {setReserve} />;
    }

    if(services.length > 0 && !getAdmin()){
    return (
        <div>
             <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead className = {classes.tableHeader}>
          <TableRow>
            <TableCell className={classes.tableHeaderCell} align="left">Name</TableCell>
            <TableCell className={classes.tableHeaderCell} align="left">Price</TableCell>
            <TableCell className={classes.tableHeaderCell} align="left">Agency</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {services.map((service, i) => <TableRow key = {i}>
            <TableCell align="left"><Button variant = "contained" className = {classes.linkButton} href= {`/service_detail/${service.service_id}`}>{service.name}</Button></TableCell>
            <TableCell align="left">{service.price}€</TableCell>
            <TableCell align="left">{service.agency}</TableCell>
            </TableRow>)}
        </TableBody>
        </Table>
            </TableContainer>
            {dialog}
        </div>
    )
    }
    else if(services.length > 0 && getAdmin()){
        return (
            <div>
                 <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead className = {classes.tableHeader}>
              <TableRow>
                <TableCell className={classes.tableHeaderCell} align="left">Name</TableCell>
                <TableCell className={classes.tableHeaderCell} align="left">Price</TableCell>
                <TableCell className={classes.tableHeaderCell} align="left">Agency</TableCell>
                <TableCell className={classes.tableHeaderCell} align="left">Edit</TableCell>
                <TableCell className={classes.tableHeaderCell} align="left">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {services.map((service, i) => <TableRow key = {i}>
            <TableCell align="left"><Button variant = "contained" className = {classes.linkButton} href= {`/service_detail/${service.service_id}`}>{service.name}</Button></TableCell>
                <TableCell align="left">{service.price}€</TableCell>
                <TableCell align="left">{service.agency}</TableCell>
                <TableCell align="left"><Button className={classes.editButton}  onClick={() => edit ? setEdit(false) : setEdit(true) + setName(service.name) + setPrice(service.price) + setId(service.service_id) + setAgencyId(service.agency_id) + setInfo(service.info)}>Edit</Button></TableCell>
                <TableCell align="left"><Button className={classes.editButton}  onClick={() => remove ? setRemove(false) : setRemove(true) + setName(service.name) + setId(service.service_id)}>Delete</Button></TableCell>
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
                No services found
            </div>
        )
    }
}


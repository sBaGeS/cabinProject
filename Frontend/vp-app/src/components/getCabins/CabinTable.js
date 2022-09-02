import React, { useState, useEffect} from 'react';
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
import dateFormat from 'dateformat';

const useStyles = makeStyles({
    cabinDiv: {
        padding: 8,
        maxWidth: 800,
        margin: 4,
    },
    tableHeader: {
        backgroundColor: 'navy',
    },
    tableHeaderCell: {
        color: 'white'
    },
    bookButton: {
        margin: 4,
        backgroundColor: 'navy',
        color: 'white',
    },
    infoButton: {
        margin: 4,
        backgroundColor: 'navy',
        color: 'white',
        minWidth: 50,
    },
});

export default function CabinTable(props) {

    const classes = useStyles();


    const query = props.query;
    const [cabins, setCabins] = useState([]);

    useEffect(() => {
        const getCabins = () => {
            axios.get("http://localhost:3001/cabin?" + query, {
            })
                .then(function (response) {
                    console.log(response);
                    setCabins(response.data.Cabins);
                })
                .catch(function (error) {
                    console.log(error);
                })
        }

        if (props.searchClicked > 0) {
            getCabins();
        }
    }, [props.searchClicked]);

    useEffect(() => {
            for (let cabin of cabins)
            {
               let reserved = false;
              axios.get("http://localhost:3001/checkReservations/" + cabin.cabin_id, {
                  })
                      .then(function (response) {
                          console.log(response);

                          let reservations = response.data.Reservations;

                          for (let reservation of reservations)
                          {

                          if (dateFormat(props.startDate, "mm/dd/yyyy") >= dateFormat(reservation.arrivaldate, "mm/dd/yyyy") && dateFormat(props.endDate, "mm/dd/yyyy") <= dateFormat(reservation.leavedate, "mm/dd/yyyy"))
                          {
                            reserved = true;
                          }

                          else if (dateFormat(props.startDate, "mm/dd/yyyy") <= dateFormat(reservation.leavedate, "mm/dd/yyyy") && dateFormat(props.endDate, "mm/dd/yyyy") >= dateFormat(reservation.leavedate, "mm/dd/yyyy"))
                          {
                            reserved = true;
                          }

                          else if (dateFormat(props.startDate, "mm/dd/yyyy") <= dateFormat(reservation.arrivaldate, "mm/dd/yyyy") && dateFormat(props.endDate, "mm/dd/yyyy") >= dateFormat(reservation.arrivaldate, "mm/dd/yyyy"))
                          {
                            reserved = true;
                          }

                          if (reserved == true)
                          {
                                let array = [...cabins]; 
                                let index = cabins.indexOf(cabin);
                                if (index !== -1) {
                                  array.splice(index, 1);
                                  setCabins(array);
                                }
                          }
                          }
                      })
                      .catch(function (error) {
                          console.log(error);
                      })    
                  } 
    },[cabins]);
      
    if (props.searchClicked > 0) {
        return (
            <div className={classes.cabinDiv}>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="customized table">
                        <TableHead className={classes.tableHeader}>
                            <TableRow>
                                <TableCell className={classes.tableHeaderCell}>Name</TableCell>
                                <TableCell className={classes.tableHeaderCell} align="right">Agency</TableCell>
                                <TableCell className={classes.tableHeaderCell} align="right">Postarea</TableCell>
                                <TableCell className={classes.tableHeaderCell} align="right">Capacity</TableCell>
                                <TableCell className={classes.tableHeaderCell} align="right">Size</TableCell>
                                <TableCell className={classes.tableHeaderCell} align="right">Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cabins.map((cabin, i) => <TableRow key={i}>
                                <TableCell><Button href= {`/cabin_detail/${cabin.cabin_id}?startDate=${props.startDate}&endDate=${props.endDate}`} className= {classes.infoButton}>{cabin.name}</Button></TableCell>
                                <TableCell align="right">{cabin.agencyName}</TableCell>
                                <TableCell align="right">{cabin.postarea}</TableCell>
                                <TableCell align="right">{cabin.capacity}</TableCell>
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
    return (
        <div></div>
    )
}
}

import 'date-fns';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import {MuiPickersUtilsProvider,KeyboardDatePicker} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import TextField from '@material-ui/core/TextField';
import GetAgencies from '../../getAgencies/GetAgencies';
import CabinTable from '../../getCabins/CabinTable';


const useStyles = makeStyles(theme => ({
  searchRoot:{
    padding: '8px',
    maxWidth: 600,
    backgroundColor: 'navy',
    color: 'white'
  } , 
    input: {
      marginTop: 4,
      marginLeft:4, 
      backgroundColor: 'white',
      flex: 1,
      borderRadius: 4
    },
    datePicker: {
      margin: '10px',
      maxWidth: 500
    },
    divider: {
      height: 40,
      margin: 4,
    },
    searchButton: {
      margin: 4,
      backgroundColor: 'white',
      color: 'navy',
    },
    TextField: {
        marginTop: 15,
        marginLeft:15,
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 4
      },
  }));
export default function CabinSearchForm (props) {
    const classes = useStyles();

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [agencyId, setAgencyId] = useState("");
    const [postarea, setPostarea] = useState("");
    const [minCapacity, setMinCapacity] = useState("");
    const [maxCapacity, setMaxCapacity] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [minSize, setMinSize] = useState("");
    const [maxSize, setMaxSize] = useState("");

    const [query, setQuery] = useState("");

    const [searchClicked, setSearchClicked] = useState(0);
    
    let location = window.location.pathname;
   
    const handleSearch = () => {
     let query = "";

     if(agencyId != ""){
       query += "agency_id=" + agencyId+"&";
     }
     if(postarea != ""){
        query += "postarea=" + postarea+"&";
      }
     if(minCapacity != ""){
       query += "min_capacity=" + minCapacity+"&";
     }
     if(maxCapacity != ""){
        query += "max_capacity=" + maxCapacity+"&";
      }
     if(minPrice != ""){
        query += "min_price=" + minPrice+"&";
      }
     if(maxPrice != ""){
         query += "max_price=" + maxPrice+"&";
     }
     if(minSize != ""){
        query += "min_size=" + minSize+"&";
      }
     if(maxSize != ""){
         query += "max_size=" + maxSize+"&";
     }
     setQuery(query);
     setStartDate(startDate);
     setEndDate(endDate);
     setSearchClicked(searchClicked + 1);
   }
    return(
        <div>
          <Paper className = {classes.searchRoot}>
            <h3>Book your dream holiday today</h3>
              <GetAgencies agencyId = {agencyId} setAgencyId = {setAgencyId}/>
              <TextField className = {classes.TextField} type="text" id="postarea" label="Postarea" value={postarea}
                    onChange={(e) => 
                        setPostarea(e.target.value)} />
                        <br />
              <TextField className = {classes.TextField} type="number" id="min_capacity" label="Min Capacity" value={minCapacity}
                    onChange={(e) => 
                        setMinCapacity(e.target.value)} />
                        <TextField className = {classes.TextField} type="number" id="max_capacity" label="Max Capacity" value={maxCapacity}
                    onChange={(e) => 
                        setMaxCapacity(e.target.value)} />
                        <br />
                        <TextField className = {classes.TextField} type="number" id="min_price" label="Min Price" value={minPrice}
                    onChange={(e) => 
                        setMinPrice(e.target.value)} />
                        <TextField className = {classes.TextField} type="number" id="max_price" label="Max Price" value={maxPrice}
                    onChange={(e) => 
                        setMaxPrice(e.target.value)} />
                        <br />
                        <TextField className = {classes.TextField} type="number" id="min_size" label="Min Size" value={minSize}
                    onChange={(e) => 
                        setMinSize(e.target.value)} />
                        <TextField className = {classes.TextField} type="number" id="max_size" label="Max Size" value={maxSize}
                    onChange={(e) => 
                        setMaxSize(e.target.value)} />
                        <br />
            <Paper className = {classes.datePicker}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="dd/MM/yyyy"
          margin="normal"
          id="start_date"
          label="Check in"
          disablePast = "true"
          value={startDate}
          onChange={(date) => setStartDate(date)}
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
          label="Check out"
          disablePast = "true"
          value={endDate}
          onChange={(date) => setEndDate(date)}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
         </MuiPickersUtilsProvider><br/>
         </Paper>
         <Button  variant="contained" className = {classes.searchButton} 
         onClick={() => handleSearch()}>Search</Button>
         </Paper>
         <CabinTable query={query} startDate={startDate} endDate={endDate} searchClicked={searchClicked}/>
        </div>
    )
}
            
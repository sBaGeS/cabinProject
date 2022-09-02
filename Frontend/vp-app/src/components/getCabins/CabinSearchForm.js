import 'date-fns';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import {MuiPickersUtilsProvider,KeyboardDatePicker} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import TextField from '@material-ui/core/TextField';
import GetAgencies from '../getAgencies/GetAgencies';


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
      margin: '4px',
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
    advancedSearchLink: {
      marginLeft: 10,
      maxHeight: 30,
      color: 'white',
    }
  }));
export default function CabinSearchForm (props) {
    const classes = useStyles();

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [agencyId, setAgencyId] = useState("");
    const [capacity, setCapacity] = useState("");
    
    let advancedSearchLink = "";
    let location = window.location.pathname;
   
    if(location === "/search_cabins"){
     advancedSearchLink =  "";
    }
    else{
      advancedSearchLink = <Link href ="/search_cabins" className = {classes.advancedSearchLink}>Advanced search</Link>;
    }
    const handleSearch = () => {
     let query = "";

     if(agencyId != ""){
       query += "agency_id=" + agencyId+"&";
     }
     if(capacity != ""){
       query += "min_capacity=" + capacity;
     }
     props.setQuery(query);
     props.setStartDate(startDate);
     props.setEndDate(endDate);
     props.setSearchClicked(props.searchClicked + 1);
   }
    return(
        <div>
          <Paper className = {classes.searchRoot}>
            <h3>Book your dream holiday today</h3>
              <GetAgencies agencyId = {agencyId} setAgencyId = {setAgencyId}/>
              <TextField className = {classes.input} type="number" id="guests" label="Guests" value={capacity}
                    onChange={(e) => 
                        setCapacity(e.target.value)} />
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
    
        {advancedSearchLink}
       
         </Paper>
        </div>
    )
}
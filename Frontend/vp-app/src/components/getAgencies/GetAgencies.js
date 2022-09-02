import React,{useState, useEffect} from 'react';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import axios from 'axios';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    destinationSelect:{
    minWidth: 200, 
    backgroundColor: 'white', 
    borderRadius: 4,
    margin: 4,
    }
  }));

export default function GetAgencies(props){

    const classes = useStyles();
    const [agencies, setAgiencies] = useState([]);
 

    useEffect(() => {
        const getAgencies = () => {
            axios.get("http://localhost:3001/agency",{
            
        }).then(function (response) {
                    console.log(response);
                    setAgiencies(response.data.Agencies);
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
        getAgencies();
    }, []);
 
   
    return(
      
        <FormControl className = {classes.destinationSelect}>
         <InputLabel>Agency</InputLabel>
        <Select native
                   required id="agencyId" value={props.agencyId}
                    onChange={(e) => {
                        props.setAgencyId(e.target.value)
                    }}>
                    <option aria-label="None" value="" />
                    {agencies !== undefined ? agencies.map((agency, i) =>
                        <option key={i} value={agency.agency_id}>
                            {agency.name}</option>): ""}
                </Select>
            </FormControl>
    
    )
}
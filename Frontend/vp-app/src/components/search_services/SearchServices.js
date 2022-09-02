import 'date-fns';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import GetAgencies from '../getAgencies/GetAgencies';
import Box from '@material-ui/core/Box';


const useStyles = makeStyles(theme => ({
    searchRoot: {
        padding: '8px',
        maxWidth: 600,
        backgroundColor: 'white',
        color: 'black',
        marginBottom: '10px',
        border: '2px solid navy',
        borderRadius: 16
    },
    input: {
        marginTop: 4,
        marginLeft: 4,
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
        backgroundColor: 'navy',
        color: 'white',
        '&:hover': {
            background: "white",
            color: 'navy',
        },
    },
   
    TextField: {
        marginTop: 15,
        marginLeft: 15,
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 4
    },
}));
export default function ServiceSearchForm(props) {
    const classes = useStyles();

    const [agencyId, setAgencyId] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [name, setName] = useState("");

  

    const handleSearch = () => {
        let query = "";

        if (agencyId != "") {
            query += "agency_id=" + agencyId + "&";
        }
        if(name != ""){
            query += "name=" + name  + "&";
        }
        if (minPrice != "") {
            query += "min_price=" + minPrice + "&";
        }
        if (maxPrice != "") {
            query += "max_price=" + maxPrice + "&";
        }
        props.setQuery(query);
        props.setSearchClicked(props.searchClicked + 1);
    }
    return (
        <div>
            <Box className={classes.searchRoot}>
                <h3>Search available services</h3>
                <GetAgencies agencyId={agencyId} setAgencyId={setAgencyId} />
                <br />
                <TextField className={classes.TextField} type="text" id="name" label="Search" value={name}
                    onChange={(e) =>
                        setName(e.target.value)} />
                        <br/>
                <TextField className={classes.TextField} type="number" id="min_price" label="Min Price" value={minPrice}
                    onChange={(e) =>
                        setMinPrice(e.target.value)} />
                <TextField className={classes.TextField} type="number" id="max_price" label="Max Price" value={maxPrice}
                    onChange={(e) =>
                        setMaxPrice(e.target.value)} />
                <br />
                <Button variant="contained" className={classes.searchButton}
                    onClick={() => handleSearch()}>Search</Button>
            </Box>
        </div>
    )
}

import React, { useState } from 'react';
import { getUser } from '../../../Utils/Common';
import { makeStyles } from '@material-ui/core/styles';
import CabinSearchForm from '../../getCabins/CabinSearchForm';
import CabinTable from '../../getCabins/CabinTable';
import image from '../../../public/photos/homebackground.jpg';
import Typography from '@material-ui/core/Typography';
import { datePickerDefaultProps } from '@material-ui/pickers/constants/prop-types';
const useStyles = makeStyles(({
    home: {
        backgroundImage: `url(${image})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        padding: 8,
        color: 'white'
    }
}));
export default function Home() {

    const classes = useStyles();

    let username;
    const [query, setQuery] = useState("");

    const [searchClicked, setSearchClicked] = useState(0);

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    if (getUser()) {
        username = (<Typography style = {{fontSize: 20}}>Welcome {sessionStorage.getItem('user_username')}</Typography>);
    }
    return (
        <div className = {classes.home}>
            <Typography  style = {{fontSize: 36, textShadow: '1px 1px navy', fontFamily: 'Lucida Grande'}}>
            Village People Oy
            </Typography>
            
            {username}
            <CabinSearchForm setQuery={setQuery} setStartDate={setStartDate} setEndDate={setEndDate} searchClicked={searchClicked} setSearchClicked={setSearchClicked}/>
            <CabinTable query={query} startDate={startDate} endDate={endDate} searchClicked={searchClicked}/>
        </div>
    )
}
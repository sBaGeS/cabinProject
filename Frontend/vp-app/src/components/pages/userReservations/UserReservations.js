import React, {useState} from 'react';
import GetMyReservations from '../my_reservations/GetMyReservations';
import queryString from 'query-string';
import GetMyServiceReservations from "../my_reservations/GetMyServiceReservations";



export default function MyReservations(props){

const query = queryString.parse(props.location.search);

    return(
        <div>
            <h3>User {query.username} cabin reservations</h3>
            <GetMyReservations id={query.user_id}/>
            <h3>User {query.username} service reservations</h3>
            <GetMyServiceReservations id={query.user_id}/>
        </div>
    )
    }

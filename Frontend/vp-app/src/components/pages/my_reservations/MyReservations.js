import React, {useState} from 'react';
import GetMyReservations from './GetMyReservations';
import GetMyServiceReservations from './GetMyServiceReservations'



export default function MyReservations(props){

    return(
        <div>
            <h3>My cabin Reservations</h3>
            <h4>Can be cancelled or edited if atleast 1 week time remaining till Check in</h4>
            <GetMyReservations id={sessionStorage.getItem("user_id")}/>
            <h3>My service Reservations</h3>
            <h4>Can be cancelled or edited if atleast 1 week time remaining till Check in</h4>
            <GetMyServiceReservations id={sessionStorage.getItem("user_id")}/>

        </div>
    )
    }

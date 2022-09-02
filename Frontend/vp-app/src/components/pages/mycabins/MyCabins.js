import React, {useState} from 'react';
import GetMyCabins from './GetMyCabins';



export default function MyCabins(props){

   
    return(
        <div>
            <h3>My Cabins</h3>
            <GetMyCabins id={sessionStorage.getItem("user_id")}/>
        </div>
    )
    }

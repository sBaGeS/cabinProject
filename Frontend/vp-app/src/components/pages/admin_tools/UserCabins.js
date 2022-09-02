import React, {useState} from 'react';
import GetMyCabins from '../../pages/mycabins/GetMyCabins';
import queryString from 'query-string';


export default function UserCabins(props){

const query = queryString.parse(props.location.search);

    return(
        <div>
            <h3>User {query.username} cabins</h3>
            <GetMyCabins id={props.match.params.id}/>
        </div>
    )
}
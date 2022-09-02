import React, {useState} from 'react';
import GetServices from '../../getServices/GetServices';
import ServiceSearchForm from '../../search_services/SearchServices';

export default function ShowServices(props){

    const [query, setQuery] = useState("");
    const [searchClicked, setSearchClicked] = useState(0);

    return(
        <div>
            <h3>Services</h3>
            <ServiceSearchForm setQuery = {setQuery} searchClicked = {searchClicked} setSearchClicked = {setSearchClicked}/>
            <GetServices query={query} searchClicked = {searchClicked} />
        </div>
    )
    }
import React, {useState} from 'react';
import CustomerSearchForm from "./CustomerSearchForm";
import CustomerTable from "./CustomerTable";
import {getAdmin} from '../../../Utils/Common';

export default function CustomerInfo() {

    const [query, setQuery] = useState("");
    const [searchClicked, setSearchClicked] = useState(0);


    if (getAdmin())
    {
        return (
            <div>
                <h3>Search customers</h3>
                <CustomerSearchForm setQuery={setQuery} setSearchClicked={setSearchClicked} searchClicked={searchClicked}/>
                <CustomerTable query={query} searchClicked={searchClicked}/>
            </div>
        )
    }

    else
    {
        return (
            <div>
                <h1 style={{color: "red", fontWeight: 900, fontSize: 28, marginLeft: 160}}>Unauthorized</h1>
            </div>
        )
    }
    
}
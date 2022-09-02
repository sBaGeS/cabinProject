import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {getToken, getAdmin} from '../Utils/Common'


export default function AdminRoute ({component: Component, logged, ...rest}) {
    return (
        <Route
        {...rest}
        render = {(props) => getToken() && getAdmin()
        ? <Component {...props}/>
        :<Redirect to = {{pathname: '/', state: {from: props.location}}}/>}
        />
    )
}


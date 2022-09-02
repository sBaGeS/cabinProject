import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {getToken} from '../Utils/Common'


export default function PrivateRoute ({component: Component, logged, ...rest}) {
    return (
        <Route
        {...rest}
        render = {(props) => getToken()
        ? <Component {...props}/>
        :<Redirect to = {{pathname: '/login', state: {from: props.location}}}/>}
        />
    )
}


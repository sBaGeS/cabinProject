import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { setUserSession } from '../../../Utils/Common';
import {useHistory} from 'react-router-dom';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles(theme => ({
    searchButton: {
        margin: 4,
        backgroundColor: 'navy',
        color: 'white',
      },
    formRoot: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

const defaultProps = {
    bgcolor: 'background.paper',
    m: 1,
    border: 2,
    padding: 2,
    borderRadius: 16,
};


export default function LoginForm(props) {
    const classes = useStyles();
    let history = useHistory();
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [usernameErrorMsg, setUsernameErrorMsg] = useState("");

    const [password, setPassword] = useState("");
    const [passwordErrorMsg, setPasswordErrorMsg] = useState("");

    const [serverErrorMsg, setServerErrorMsg] = useState("");

    const axiosLogin = () => {
        setLoading(true);
        axios.post('http://localhost:3001/login', { 
            username: username, 
            password: password
            })
            .then(response => {
            setLoading(false);
            setUserSession(response.data.token);
            console.log(response.data);
            history.push('/');
        }).catch(error => {
            console.log(error);
            setServerErrorMsg(error.response.data.msg);
        });
    }

    const handleLogin = () => {

        let usernameValidationError = false;
        let passwordValidationError = false

        if (username.length === 0 || username === "") {
            setUsernameErrorMsg("Please insert an username");
            usernameValidationError = true;
        }
        else {
            usernameValidationError = false;
            setUsernameErrorMsg("");
        }
        if (password.length === 0 || password === "") {
            setPasswordErrorMsg("Please insert a password");
            passwordValidationError = true;
        }
        else {
            passwordValidationError = false;
            setPasswordErrorMsg("");
        }
        if (usernameValidationError === false && passwordValidationError === false) {
            axiosLogin();
        }
    }

    return (
        <div>
            <Box borderColor="navy" {...defaultProps}>
            <h3>Login</h3>
            <form className={classes.formRoot} noValidate autoComplete="off">
                <TextField error={usernameErrorMsg != ""} helperText={usernameErrorMsg} required id="username" label="Username" value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        (e.target.value.length === 0) ? setUsernameErrorMsg("Please insert an username") : setUsernameErrorMsg("")
                    }} />
                <TextField error={passwordErrorMsg != ""} helperText={passwordErrorMsg} required id="password" label="Password" type="password" value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        (e.target.value.length === 0) ? setPasswordErrorMsg("Please insert a password") : setPasswordErrorMsg("")
                    }} />
            </form>
            <Button variant="contained" className = {classes.searchButton} onClick={() => handleLogin()}>Login</Button>
            {serverErrorMsg ? <Box width="11%" marginLeft="13%" borderColor="red"{...defaultProps}><a style={{ color: "red", fontWeight: 900, fontSize: 16}}>{serverErrorMsg}</a></Box> : null}
            </Box>
        </div>
    )
}
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
    PaperRoot:{
      padding: '8px',
      maxWidth: 480,
      height: 300,
      backgroundColor: 'gold',
      color: 'white'
    },
    TextField: {
        marginTop: 15,
        marginLeft:15,
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 80,
        textAlign: "center"
      },
      searchButton: {
        marginTop: 15,
        marginLeft:70,
        backgroundColor: 'darkorange',
      },
    }));

export default function CustomerSearchForm(props) {
    const style = useStyles();

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");

    const [address, setAddress] = useState("");
    const [postcode, setPostcode] = useState("");

    const [postarea, setPostarea] = useState("");
    const [phonenumber, setPhonenumber] = useState("");

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");

    const [id, setId] = useState("");


    const handleSearch = () => {

        let query = "";

        if(firstname != "")
        {
            query += "firstname=" + firstname + "&";
        }

        if(lastname != "")
        {
            query += "lastname=" + lastname + "&";
        }

        if(address != "")
        {
            query += "address=" + address + "&";
        }

        if(postcode != "")
        {
            query += "postcode=" + postcode + "&";
        }

        if(postarea != "")
        {
            query += "postarea=" + postarea + "&";
        }

        if(phonenumber != "")
        {
            query += "phonenumber=" + phonenumber + "&";
        }

        if(email != "")
        {
            query += "email=" + email + "&";
        }

        if(username != "")
        {
            query += "username=" + username + "&";
        }

        if(id != "")
        {
            query += "id=" + id;
        }

          props.setQuery(query);
          props.setSearchClicked(props.searchClicked + 1);
    }

        return (
            <div>
                <Paper className={style.PaperRoot}>

                <TextField className={style.TextField} type="text" id="firstname" label="Firstname" variant="outlined" size="small" color="secondary" value={firstname}
                    onChange={(e) => 
                        setFirstname(e.target.value)} />

                <TextField className={style.TextField} type="text" id="lastname" label="Lastname" variant="outlined" size="small" color="secondary" value={lastname}
                    onChange={(e) => 
                        setLastname(e.target.value)} />

                    <br />

                    <TextField className={style.TextField} type="text" id="address" label="Address" variant="outlined" size="small" color="secondary" value={address}
                    onChange={(e) => 
                        setAddress(e.target.value)} />

                   <TextField className={style.TextField} type="text" id="postcode" label="Postcode" variant="outlined" size="small" color="secondary" value={postcode}
                    type="number"
                    onChange={(e) => 
                        setPostcode(e.target.value)} />

                    <br />

                    <TextField className={style.TextField} type="text" id="postarea" label="Postarea" variant="outlined" size="small" color="secondary" value={postarea}
                    onChange={(e) => 
                        setPostarea(e.target.value)} />

                   <TextField className={style.TextField} type="text" id="phonenumber" label="Phonenumber" variant="outlined" size="small" color="secondary" value={phonenumber}
                    type="number"
                    onChange={(e) => 
                        setPhonenumber(e.target.value)} />

                    <br />

                    <TextField className={style.TextField} type="text" id="email" label="Email" variant="outlined" size="small" color="secondary" value={email}
                    onChange={(e) => 
                        setEmail(e.target.value)} />

                   <TextField className={style.TextField} type="text" id="username" label="Username" variant="outlined" size="small" color="secondary" value={username}
                    onChange={(e) => 
                        setUsername(e.target.value)} />

                    <br />

                    <TextField className={style.TextField} type="number" id="person_id" label="Person_id" variant="outlined" size="small" color="secondary" value={id}
                    onChange={(e) => 
                        setId(e.target.value)} />

                    <Button variant="contained" className = {style.searchButton} 
                      onClick={() => handleSearch()}>Search</Button>


                </Paper>
            </div>
        )
    
    
}
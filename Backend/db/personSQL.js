var connection = require('../connectionString/connectionString');

const getPersons_admin = (id, firstname, lastname, address, postcode, postarea, phonenumber, email, username) => {

    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM person WHERE 1=1";

        let params = [];


        if (id != "" && id != null)
        {

             query = query + " AND person_id = ?"
             params.push(id);

        }

        
        if (firstname != "" && firstname != null)
        {

           if (firstname.indexOf("*") == firstname.length - 1)
           {
             firstname = firstname.slice(0, -1);
             query = query + " AND firstname like ?"
             params.push(firstname + "%");
           }

           else 
           {
             query = query + " AND firstname = ?"
             params.push(firstname);
           }
        }


        if (lastname != "" && lastname != null)
        {

           if (lastname.indexOf("*") == lastname.length - 1)
           {
             lastname = lastname.slice(0, -1);
             query = query + " AND lastname like ?"
             params.push(lastname + "%");
           }

           else 
           {
             query = query + " AND lastname = ?"
             params.push(lastname);
           }
        }


        if (address != "" && address != null)
        {

           if (address.indexOf("*") == address.length - 1)
           {
             address = address.slice(0, -1);
             query = query + " AND address like ?"
             params.push(address + "%");
           }

           else 
           {
             query = query + " AND address = ?"
             params.push(address);
           }
        }

        
        if (postcode != "" && postcode != null)
        {

           if (postcode.indexOf("*") == postcode.length - 1)
           {
             postcode = postcode.slice(0, -1);
             query = query + " AND postcode like ?"
             params.push(postcode + "%");
           }

           else 
           {
             query = query + " AND postcode = ?"
             params.push(postcode);
           }
        }


        if (postarea != "" && postarea != null)
        {

             query = query + " AND postarea = ?"
             params.push(postarea);

        }

        if (phonenumber != "" && phonenumber != null)
        {

             query = query + " AND phonenumber = ?"
             params.push(phonenumber);

        }

        if (email != "" && email != null)
        {

           if (email.indexOf("*") == email.length - 1)
           {
             email = email.slice(0, -1);
             query = query + " AND email like ?"
             params.push(email + "%");
           }

           else 
           {
             query = query + " AND email = ?"
             params.push(email);
           }
        }

        if (username != "" && username != null)
        {

           if (username.indexOf("*") == username.length - 1)
           {
             username = username.slice(0, -1);
             query = query + " AND username like ?"
             params.push(username + "%");
           }

           else 
           {
             query = query + " AND username = ?"
             params.push(username);
           }
        }

        connection.query(query, params, function (error, result, fields) {

            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    })
}

module.exports = {

    fetchPersons_admin: (id, firstname, lastname, address, postcode, postarea, phonenumber, email, username) => {
        return getPersons_admin(id, firstname, lastname, address, postcode, postarea, phonenumber, email, username);
    },


    getPerson: (id) => {
      return new Promise((resolve, reject) => {

        let query = "SELECT firstname, lastname, address, postcode, postarea, phonenumber, email, username FROM person WHERE 1=1";

        let params = [];

        if (id != "" && id != null)
        {

             query = query + " AND person_id = ?"
             params.push(id);

        }

        connection.query(query, params, function (error, result, fields) {

          if (error) {
              reject(error);
          }
          else {
              resolve(result);
          }
      });
    
      })
  },


    postPerson: (firstname, lastname, address, postcode, postarea, phonenumber, email, username, password) => {
        return new Promise((resolve, reject) => {

          let query = "INSERT INTO person (firstname, lastname, address, postcode, postarea, phonenumber, email, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

          let params = [];

          params.push(firstname);
          params.push(lastname);
          params.push(address);
          params.push(postcode);
          params.push(postarea);
          params.push(phonenumber);
          params.push(email);
          params.push(username);
          params.push(password);

          connection.query(query, params, function (error, result, fields) {

            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
      
        })
    },


    putPerson: (firstname, lastname, address, postcode, postarea, phonenumber, email, id) => {
      return new Promise((resolve, reject) => {

        let query = "UPDATE person set firstname = ?, lastname = ?, address = ?, postcode = ?, postarea = ?, phonenumber = ?, email = ? WHERE person_id = ?";

        let params = [];

        params.push(firstname);
        params.push(lastname);
        params.push(address);
        params.push(postcode);
        params.push(postarea);
        params.push(phonenumber);
        params.push(email);
        params.push(id);

        connection.query(query, params, function (error, result, fields) {

          if (error) {
              reject(error);
          }
          else {
              resolve(result);
          }
      });
    
      })
  },


  deletePerson: (id) => {
    return new Promise((resolve, reject) => {

      let query = "DELETE FROM person WHERE person_id = ?";

      let params = [];

      params.push(id);

      connection.query(query, params, function (error, result, fields) {

        if (error) {
            reject(error);
        }
        else {
            resolve(result);
        }
    });
  
    })
},

}
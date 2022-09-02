var connection = require('../connectionString/connectionString');


module.exports = {

    getAgencies: (id, name, address, postcode, postarea) => {
        return new Promise((resolve, reject) => {
  
          let query = "SELECT * FROM agency WHERE 1=1";
  
          let params = [];
  
          if (id != "" && id != null)
          {
  
               query = query + " AND agency_id = ?"
               params.push(id);
  
          }


          if (name != "" && name != null)
          {

           if (name.indexOf("*") == name.length - 1)
           {
             name = name.slice(0, -1);
             query = query + " AND name like ?"
             params.push(name + "%");
           }

           else 
           {
             query = query + " AND name = ?"
             params.push(name);
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

           if (postarea.indexOf("*") == postarea.length - 1)
           {
             firstname = firstname.slice(0, -1);
             query = query + " AND postarea like ?"
             params.push(postarea + "%");
           }

           else 
           {
             query = query + " AND postarea = ?"
             params.push(postarea);
           }
          }

          query = query + " ORDER BY name"
  
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


    postAgency: (name, address, postcode, postarea, phonenumber, email) => {
      return new Promise((resolve, reject) => {

        let query = "INSERT INTO agency (name, address, postcode, postarea, phonenumber, email) VALUES (?, ?, ?, ?, ?, ?)";

        let params = [];

        params.push(name);
        params.push(address);
        params.push(postcode);
        params.push(postarea);
        params.push(phonenumber);
        params.push(email);
        

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


  deleteAgency: (id) => {
    return new Promise((resolve, reject) => {

      let query = "DELETE FROM agency WHERE agency_id = ?";

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


putAgency: (name, address, postcode, postarea, phonenumber, email, id) => {
  return new Promise((resolve, reject) => {

    let query = "UPDATE agency set name = ?, address = ?, postcode = ?, postarea = ?, phonenumber = ?, email = ? WHERE agency_id = ?";

    let params = [];

    params.push(name);
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


}
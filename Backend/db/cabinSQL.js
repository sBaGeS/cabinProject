var connection = require('../connectionString/connectionString');


module.exports = {

    postCabin: (name, address, postcode, postarea, price, size, capacity, info, cabinOwner, agency) => {
        return new Promise((resolve, reject) => {
  
          let query = "INSERT INTO cabin (name, address, postcode, postarea, price, size, capacity, info, cabinowner_id, agency_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  
          let params = [];
  
          params.push(name);
          params.push(address);
          params.push(postcode);
          params.push(postarea);
          params.push(price);
          params.push(size);
          params.push(capacity);
          params.push(info);
          params.push(cabinOwner);
          params.push(agency);
          

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


    getCabins: (name, address, postcode, postarea, min_price, max_price, min_size, max_size, min_capacity, max_capacity, cabinowner_id, agency_id, cabin_id) => {
        return new Promise((resolve, reject) => {
  
          let query = "SELECT cabin.cabin_id, cabin.agency_id, cabin.name, cabin.address, cabin.postcode, cabin.postarea, cabin.price, cabin.size, cabin.capacity, cabin.info, cabin.cabinowner_id, CONCAT(person.firstname, ' ', person.lastname) AS cabinOwner, person.phonenumber AS cabinOwnerPhonenumber, person.email AS cabinOwnerEmail, agency.name AS agencyName, agency.address AS agencyAddress, agency.postarea AS agencyPostarea, agency.phonenumber AS agencyPhonenumber, agency.email AS agencyEmail FROM cabin JOIN person ON cabin.cabinowner_id = person.person_id JOIN agency ON cabin.agency_id = agency.agency_id WHERE 1=1";
  
          let params = [];


          if (name != "" && name != null)
          {

           if (name.indexOf("*") == name.length - 1)
           {
             name = name.slice(0, -1);
             query = query + " AND cabin.name like ?"
             params.push(name + "%");
           }

           else 
           {
             query = query + " AND cabin.name = ?"
             params.push(name);
           }
          }


          if (address != "" && address != null)
          {

           if (address.indexOf("*") == address.length - 1)
           {
             address = address.slice(0, -1);
             query = query + " AND cabin.address like ?"
             params.push(address + "%");
           }

           else 
           {
             query = query + " AND cabin.address = ?"
             params.push(address);
           }
          }


          if (postcode != "" && postcode != null)
          {
             query = query + " AND cabin.postcode = ?"
             params.push(postcode);
           }

          if (postarea != "" && postarea != null)
          {

           if (postarea.indexOf("*") == postarea.length - 1)
           {
             firstname = firstname.slice(0, -1);
             query = query + " AND cabin.postarea like ?"
             params.push(postarea + "%");
           }

           else 
           {
             query = query + " AND cabin.postarea = ?"
             params.push(postarea);
           }
          }

          if (min_price != "" && min_price != null)
          {
               query = query + " AND price >= ?"
               params.push(min_price);
          }

          if (max_price != "" && max_price != null)
          {
               query = query + " AND price <= ?"
               params.push(max_price);
          }

          if (min_size != "" && min_size != null)
          {
               query = query + " AND size >= ?"
               params.push(min_size);
          }

          if (max_size != "" && max_size != null)
          {
               query = query + " AND size <= ?"
               params.push(max_size);
          }

          if (min_capacity != "" && min_capacity != null)
          {
               query = query + " AND capacity >= ?"
               params.push(min_capacity);
          }

          if (max_capacity != "" && max_capacity != null)
          {
               query = query + " AND capacity <= ?"
               params.push(max_capacity);
          }

          if (cabinowner_id != "" && cabinowner_id != null)
          {
               query = query + " AND cabin.cabinowner_id = ?"
               params.push(cabinowner_id);
          }

          if (agency_id != "" && agency_id != null)
          {
               query = query + " AND cabin.agency_id = ?"
               params.push(agency_id);
          }

          if (cabin_id != "" && cabin_id != null)
          {
               query = query + " AND cabin.cabin_id = ?"
               params.push(cabin_id);
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


    deleteCabin: (id) => {
      return new Promise((resolve, reject) => {
  
        let query = "DELETE FROM cabin WHERE cabin_id = ?";
  
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


  putCabin: (name, address, postcode, postarea, price, size, capacity, info, agency_id, cabin_id) => {
    return new Promise((resolve, reject) => {
  
      let query = "UPDATE cabin set name = ?, address = ?, postcode = ?, postarea = ?, price = ?, size = ?, capacity = ?, info = ?, agency_id = ? WHERE cabin_id = ?";
  
      let params = [];
  
      params.push(name);
      params.push(address);
      params.push(postcode);
      params.push(postarea);
      params.push(price);
      params.push(size);
      params.push(capacity);
      params.push(info);
      params.push(agency_id);
      params.push(cabin_id);
  
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
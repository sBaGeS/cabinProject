var connection = require('../connectionString/connectionString');


module.exports = {

    postBill: (amount, duedate, reservation_id, person_id, cabin_id) => {
        return new Promise((resolve, reject) => {
  
          let query = "INSERT INTO bill (amount, duedate, reservation_id, person_id, cabin_id, paid) VALUES (?, ?, ?, ?, ?, 0)";
  
          let params = [];
  
          params.push(amount);
          params.push(duedate);
          params.push(reservation_id);
          params.push(person_id);
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

    getBills: (bill_id, reservation_id, person_id, cabin_id, paid) => {
        return new Promise((resolve, reject) => {
  
          let query = "SELECT bill_id, amount, DATE_FORMAT(duedate, '%d/%m/%Y') as duedate, bill.reservation_id, bill.person_id, bill.cabin_id, paid, firstname, lastname, person.address, person.postcode, person.postarea, email, name FROM bill JOIN person ON bill.person_id = person.person_id JOIN cabin ON bill.cabin_id = cabin.cabin_id WHERE 1=1";
  
          let params = [];

          if (bill_id != "" && bill_id != null)
          {
               query = query + " AND bill.bill_id = ?"
               params.push(bill_id);
          }

          if (reservation_id != "" && reservation_id != null)
          {
               query = query + " AND bill.reservation_id = ?"
               params.push(reservation_id);
          }

          if (person_id != "" && person_id != null)
          {
               query = query + " AND bill.person_id = ?"
               params.push(person_id);
          }

          if (cabin_id != "" && cabin_id != null)
          {
               query = query + " AND bill.cabin_id = ?"
               params.push(cabin_id);
          }
          if (paid != "" && paid != null)
          {
               query = query + " AND paid = ?"
               params.push(paid);
          }
          console.log(query);

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


    putBill: (amount, duedate, paid, id) => {
        return new Promise((resolve, reject) => {
      
          let query = "UPDATE bill set amount = ?, duedate = ?, paid = ? WHERE bill_id = ?";
      
          let params = [];
      
          params.push(amount);
          params.push(duedate);
          params.push(paid);
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


      deleteBill: (id) => {
        return new Promise((resolve, reject) => {
    
          let query = "DELETE FROM bill WHERE bill_id = ?";
    
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
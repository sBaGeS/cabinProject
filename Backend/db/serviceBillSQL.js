var connection = require('../connectionString/connectionString');


module.exports = {

    postBill: (amount, duedate, service_reservation_id, service_id, person_id) => {
        return new Promise((resolve, reject) => {
  
          let query = "INSERT INTO service_bill (sum, duedate, service_reservation_id, service_id, person_id, paid) VALUES (?, ?, ?, ?, ?, 0)";
  
          let params = [];
  
          params.push(amount);
          params.push(duedate);
          params.push(service_reservation_id);
          params.push(service_id);
          params.push(person_id);
          

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

    getBills: (bill_id, service_reservation_id, service_id, person_id, paid) => {
        return new Promise((resolve, reject) => {
  
          let query = "SELECT service_bill_id, sum, DATE_FORMAT(duedate, '%d/%m/%Y') as duedate, service_bill.service_reservation_id, service_bill.service_id, service_bill.person_id, paid, reservationdate, firstname, lastname, person.address, person.postcode, person.postarea, email, name FROM service_bill JOIN person ON service_bill.person_id = person.person_id JOIN service ON service_bill.service_id = service.service_id JOIN service_reservation ON service_bill.service_reservation_id = service_reservation.servicereservation_id WHERE 1=1";
  
          let params = [];

          if (bill_id != "" && bill_id != null)
          {
               query = query + " AND service_bill.service_bill_id = ?"
               params.push(bill_id);
          }

          if (service_reservation_id != "" && service_reservation_id != null)
          {
               query = query + " AND service_bill.service_reservation_id = ?"
               params.push(service_reservation_id);
          }

          if (person_id != "" && person_id != null)
          {
               query = query + " AND service_bill.person_id = ?"
               params.push(person_id);
          }

          if (service_id != "" && service_id != null)
          {
               query = query + " AND service_bill.service_id = ?"
               params.push(cabin_id);
          }
          if (paid != "" && paid != null)
          {
               query = query + " AND paid = ?"
               params.push(paid);
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


    putBill: (amount, duedate, paid, id) => {
        return new Promise((resolve, reject) => {
      
          let query = "UPDATE service_bill set sum = ?, duedate = ?, paid = ? WHERE service_bill_id = ?";
      
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
    
          let query = "DELETE FROM service_bill WHERE service_bill_id = ?";
    
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
var connection = require('../connectionString/connectionString');


module.exports = {

    postReservation: (arrivaldate, leavedate, people, pets, person_id, cabin_id) => {
        return new Promise((resolve, reject) => {
  
          let query = "INSERT INTO reservation (arrivaldate, leavedate, people, pets, person_id, cabin_id) VALUES (?, ?, ?, ?, ?, ?)";
  
          let params = [];
  
          params.push(arrivaldate);
          params.push(leavedate);
          params.push(people);
          params.push(pets);
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


    getReservations: (arrivaldate_from, arrivaldate_to, leavedate_from, leavedate_to, person_id, cabin_id, reservation_id) => {
        return new Promise((resolve, reject) => {
  
          let query = "SELECT reservation.reservation_id, DATE_FORMAT(arrivaldate, '%d/%m/%Y') as arrivaldate, DATE_FORMAT(leavedate, '%d/%m/%Y') as leavedate, people, pets, firstname, lastname, phonenumber, email, cabin.name as CabinName, reservation.person_id, reservation.cabin_id, cabin.agency_id, paid, amount FROM reservation JOIN person ON reservation.person_id = person.person_id JOIN cabin ON reservation.cabin_id = cabin.cabin_id JOIN bill ON reservation.reservation_id = bill.reservation_id WHERE 1=1";
  
          let params = [];


          if (arrivaldate_from != "" && arrivaldate_from != null)
          {
               query = query + " AND arrivaldate >= ?"
               params.push(arrivaldate_from);
          }

          if (arrivaldate_to != "" && arrivaldate_to != null)
          {
               query = query + " AND arrivaldate <= ?"
               params.push(arrivaldate_to);
          }

          if (leavedate_from != "" && leavedate_from != null)
          {
               query = query + " AND leavedate >= ?"
               params.push(leavedate_from);
          }

          if (leavedate_to != "" && leavedate_to != null)
          {
               query = query + " AND leavedate <= ?"
               params.push(leavedate_to);
          }

          if (person_id != "" && person_id != null)
          {
               query = query + " AND reservation.person_id = ?"
               params.push(person_id);
          }

          if (cabin_id != "" && cabin_id != null)
          {
               query = query + " AND reservation.cabin_id = ?"
               params.push(cabin_id);
          }

          if (reservation_id != "" && reservation_id != null)
          {
               query = query + " AND reservation_id = ?"
               params.push(reservation_id);
          }

          query = query + " ORDER BY reservation.arrivaldate"

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


    checkReservations: (id) => {
        return new Promise((resolve, reject) => {
  
          let query = "SELECT arrivaldate, leavedate FROM reservation WHERE cabin_id = ?";
  
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


    deleteReservation: (id) => {
        return new Promise((resolve, reject) => {
    
          let query = "DELETE FROM reservation WHERE reservation_id = ?";
    
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


    putReservation: (arrivaldate, leavedate, people, pets, reservation_id) => {
        return new Promise((resolve, reject) => {
      
          let query = "UPDATE reservation set arrivaldate = ?, leavedate = ?, people = ?, pets = ? WHERE reservation_id = ?";
      
          let params = [];
      
          params.push(arrivaldate);
          params.push(leavedate);
          params.push(people);
          params.push(pets);
          params.push(reservation_id);
          
      
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

      getReservationReport: (cabinOwnerId, startDate, endDate, cabin_id, agency_id) => {
          return new Promise((resolve, reject) => {
              
            let query = `SELECT reservation.reservation_id, DATE_FORMAT(reservation.arrivaldate, '%d/%m/%Y') as arrivaldate, DATE_FORMAT(reservation.leavedate, '%d/%m/%Y') as leavedate , reservation.people,
            person.firstname, person.lastname,
            cabin.name AS 'cabin', cabin.price AS 'cabin_price', cabin.cabin_id, cabin.cabinowner_id,
            agency.agency_id, agency.name AS 'agency', paid, amount
            FROM reservation JOIN person ON reservation.person_id = person.person_id JOIN cabin ON reservation.cabin_id = cabin.cabin_id JOIN agency ON cabin.agency_id = agency.agency_id JOIN bill ON reservation.reservation_id = bill.reservation_id
            WHERE 1 = 1`;

            let params = [];
            if(cabinOwnerId != "" && cabinOwnerId != null){
                query += " AND cabin.cabinowner_id = ? ";
                params.push(cabinOwnerId);
            }
            if(cabin_id != "" && cabin_id != null){
                query += " AND reservation.cabin_id = ? ";
                params.push(cabin_id);
            }
            if(agency_id != "" && agency_id != null){
                query += " AND cabin.agency_id = ? ";
                params.push(agency_id);
            }
            if (startDate != "" && startDate != null && endDate != "" && endDate != null) {
                query += " AND (reservation.arrivaldate BETWEEN ? ";
                params.push(startDate);
                query += "AND ? )"
                params.push(endDate);
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
          });
      }
}
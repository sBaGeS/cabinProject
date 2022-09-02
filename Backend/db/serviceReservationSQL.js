var connection = require('../connectionString/connectionString');


const getServiceReservations = (serviceReservation_id, service_id, date, person_id) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT servicereservation_id, service.name, service.agency_id, agency.name AS agency, DATE_FORMAT(service_reservation.reservationdate, '%d/%m/%Y') as reservationdate , service_reservation.service_id, service_reservation.person_id, sum, paid FROM service_reservation 
        JOIN person ON service_reservation.person_id = person.person_id JOIN service ON service_reservation.service_id = service.service_id JOIN agency ON service.agency_id = agency.agency_id JOIN service_bill ON service_reservation.servicereservation_id = service_bill.service_reservation_id WHERE 1=1`
        let params = [];

        if (serviceReservation_id != "" && serviceReservation_id != null) {
            query += " AND serviceReservation_id = ? "
            params.push(serviceReservation_id);
        }
        if (service_id != "" && service_id != null) {
            query += " AND service_reservation.service_id = ? "
            params.push(service_id);
        }
        if (date != "" && date != null) {
            query += " AND service_reservation.reservationdate = ? "
            params.push(date);
        }
        if (person_id != "" && person_id != null) {
            query += " AND service_reservation.person_id = ? "
            params.push(person_id);
        }
        connection.query(query, params, function (error, result, fields) {

            if (error) {
                console.log(error);
                reject(error);
            }
            else {
                console.log(result);
                resolve(result);
            }
        });
    });
}

const getServiceReport = (agency_id, startDate, endDate) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT agency.name AS agency, person.firstname, person.lastname, service.price, service.name AS service, service.service_id, DATE_FORMAT(service_reservation.reservationdate, '%d/%m/%Y') as reservationdate, sum, paid FROM service_reservation JOIN service ON service_reservation.service_id = service.service_id
         JOIN person ON service_reservation.person_id = person.person_id JOIN agency ON service.agency_id = agency.agency_id JOIN service_bill ON service_reservation.servicereservation_id = service_bill.service_reservation_id WHERE 1=1 `;
        let params = [];

        if (agency_id != "" && agency_id != null) {
            query += " AND service.agency_id = ?";
            params.push(agency_id);
        }
        if (startDate != "" && startDate != null && endDate != "" && endDate != null) {
            query += " AND (service_reservation.reservationdate BETWEEN ? ";
            params.push(startDate);
            query += "AND ? )"
            params.push(endDate);
        }
        connection.query(query, params, function (error, result, fields) {

            if (error) {
                console.log(error);
                reject(error);
            }
            else {
                console.log(result);
                resolve(result);
            }
        });
    });
}

const postServiceReservation = (service_id, reservationdate, person_id) => {
    return new Promise((resolve, reject) => {

        let query = "INSERT INTO service_reservation (service_id, reservationdate, person_id) VALUES(?, ?, ?)";
        let params = [];

        if (service_id != "" && service_id != null) {
            params.push(service_id);
        }
        if (reservationdate != "" && reservationdate != null) {
            params.push(reservationdate);
        }
        if (person_id != "" && person_id != null) {
            params.push(person_id);
        }
        connection.query(query, params, function (error, result, fields) {

            if (error) {
                console.log(error);
                reject(error);
            }
            else {
                console.log(result);
                resolve(result);
            }
        });
    });
}

const deleteServiceReservation = (id) => {
    return new Promise((resolve, reject) => {

        let query = "DELETE FROM service_reservation WHERE servicereservation_id = ?";
        let params = [];
        console.log("asd");
        if (id != "" && id != null) {
            params.push(id);
        }
        connection.query(query, params, function (error, result, fields) {

            if (error) {
                console.log(error);
                reject(error);
            }
            else {
                console.log(result);
                resolve(result);
            }
        });
    });
}

const putServiceReservation = (servicereservation_id, service_id, reservationdate, person_id) => {
    return new Promise((resolve, reject) => {

        let query = "UPDATE service_reservation SET service_id = ?, reservationdate = ?, person_id = ? WHERE servicereservation_id = ? ";
        let params = [];

        if (service_id != "" && service_id != null) {
            params.push(service_id);
        }
        if (reservationdate != "" && reservationdate != null) {
            params.push(reservationdate);
        }
        if (person_id != "" && person_id != null) {
            params.push(person_id);
        }
        if (servicereservation_id != "" && servicereservation_id != null) {
            params.push(servicereservation_id);
        }
        connection.query(query, params, function (error, result, fields) {

            if (error) {
                console.log(error);
                reject(error);
            }
            else {
                console.log(result);
                resolve(result);
            }
        });
    });
}



module.exports = {

    getServiceReservations: (serviceReservation_id, service_id, date, person_id) => {
        return getServiceReservations(serviceReservation_id, service_id, date, person_id)
    },
    postServiceReservation: (service_id, reservationdate, person_id) => {
        return postServiceReservation(service_id, reservationdate, person_id);
    },
    deleteServiceReservation: (id) => {
        return deleteServiceReservation(id);
    },
    putServiceReservation: (servicereservation_id, service_id, reservationdate, person_id) => {
        return putServiceReservation(servicereservation_id, service_id, reservationdate, person_id);
    },
    getServiceReport: (agency_id, startDate, endDate) => {
        return getServiceReport(agency_id, startDate, endDate);
    }
}
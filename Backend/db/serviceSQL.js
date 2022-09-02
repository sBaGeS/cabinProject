var connection = require('../connectionString/connectionString');

const getService = (id, name, min_price, max_price, agency_id) => {
    return new Promise((resolve, reject) => {
        let query = "SELECT service_id, service.name, price, info, agency.name AS agency, agency.agency_id FROM service JOIN agency ON service.agency_id = agency.agency_id WHERE 1=1";
        let params = [];

        if (id != "" && id != null) {
            query += " AND service_id = ? "
            params.push(id);
        }
        if (name != "" && name != null) {
            query += " AND service.name like ?";
            params.push(name + "%");
        }
        if (min_price != "" && min_price != null) {
            query += " AND price >= ? "
            params.push(min_price);
        }

        if (max_price != "" && max_price != null) {
            query += " AND price <= ? "
            params.push(max_price);
        }
        if (agency_id != "" && agency_id != null) {
            query += " AND service.agency_id = ? "
            params.push(agency_id);
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
const postService = (name, price, agency, info) => {
    return new Promise((resolve, reject) => {
        let query = "INSERT INTO service(name, price, agency_id, info)VALUES(?,?,?,?)";
        let params = [];

        if (name != "" && name != null) {
            params.push(name);
        }
        if (price != "" && price != null) {
            params.push(price);
        }
        if (agency != "" && agency != null) {
            params.push(agency);
        }
        if (info != "" && info != null) {
            params.push(info);
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

const deleteService = (id) => {
    return new Promise((resolve, reject) => {

        let query = "DELETE FROM service WHERE service_id = ?";

        let params = [];

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

const putService = (name, price, id, agency, info) => {
    return new Promise((resolve, reject) => {

        let query = "UPDATE service SET name = ?, price = ?, agency_id = ?, info = ? WHERE service_id =  " + id;
  
        let params = [];

        if(name != "" && name != null) {
            params.push(name);
        }
        if(price != "" && price != null) {
            params.push(price);
        }
        if(agency != "" && agency != null) {
            params.push(agency);
        }
        if(info != "" && info != null) {
            params.push(info);
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
    getService: (id, name, min_price, max_price, agency_id) => {
        return getService(id, name, min_price, max_price, agency_id);
    },
    postService: (name, price, agency, info) => {
        return postService(name, price, agency, info);
    },
    deleteService: (id) => {
        return deleteService(id);
    },
    putService: (name, price, id, agency, info) => {
        return putService(name, price, id, agency, info);
    }
}
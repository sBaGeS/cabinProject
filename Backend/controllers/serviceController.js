const authenticationController = require('../controllers/authenticationController');
const serviceSQL = require('../db/serviceSQL');


module.exports = {
    getServices: async (req, res) => {

        let id = req.query.service_id;
        let name = req.query.name;
        let min_price = req.query.min_price;
        let max_price = req.query.max_price;
        let agency_id = req.query.agency_id;

        try {
            let services = await serviceSQL.getService(id, name, min_price, max_price, agency_id);
            res.statusCode = 200;
            res.json({ services });
        }
        catch (error) {
            res.status = 400;
            res.json({ status: "NOT OK", msg: "Technical problem" });
            console.log(error);
        }
    },
    postService: async (req, res) => {

        let verification = await authenticationController.verify(req.headers.token);

        if (verification.verified == false || verification.admin == false) {
            res.statusCode = 401;
            res.json({ status: "NOT OK", msg: "Not authorized" });
        }
        else {

            if (req.body.name == "" || req.body.name == null) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "name cant be empty" });
            }

            else if (req.body.price == "" || req.body.price == null) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "price cant be empty" });
            }
            else if (req.body.agency_id == "" || req.body.agency_id == null) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "agency cant be empty" });
            }
            else {

                let name = req.body.name;
                let price = req.body.price;
                let agency = req.body.agency_id;
                let info = req.body.info
                try {
                    let newService = await serviceSQL.postService(name, price, agency, info);

                    if (newService != null) {
                        res.statusCode = 201;
                        res.json({ name: name, price: price, agency: agency });
                    }
                }
                catch (error) {
                    console.log(error);
                    res.statusCode = 400;
                    res.json({ status: "NOT OK", msg: "Technical problem" });
                }
            }
        }
    },
    deleteService: async (req, res) => {

        let verification = await authenticationController.verify(req.headers.token);

        if (verification.verified == false || verification.admin == false) {
            res.statusCode = 401;
            res.json({ status: "NOT OK", msg: "Not authorized" });
        }
        else {

            let id = req.params.id;
            try {
                let deleteService = await serviceSQL.deleteService(id);

                if (deleteService.affectedRows == 0) {
                    res.statusCode = 404;
                    res.json({ status: "NOT OK", msg: "Service not found" });
                }
                else {
                    res.statusCode = 204;
                    res.json();
                }
            }
            catch (error) {
                console.log(error);
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "Technical problem" });
            }
        }
    },
    putService: async (req, res) => {
       
        let verification = await authenticationController.verify(req.headers.token);

        if (verification.verified == false || verification.admin == false) {
            res.statusCode = 401;
            res.json({ status: "NOT OK", msg: "Not authorized" });
        }
        else {

            if (req.body.name == "" || req.body.name == null) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "name cant be empty" });
            }

            else if (req.body.price == "" || req.body.price == null) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "price cant be empty" });
            }
            else if (req.body.agency_id == "" || req.body.agency_id == null) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "agency cant be empty" });
            }
            else {
                
                let name = req.body.name;
                let price = req.body.price;
                let id = req.params.id;
                let agency = req.body.agency_id;
                let info = req.body.info


                try {
                    let service = await serviceSQL.putService(name, price, id, agency, info);

                    if (service.affectedRows == 0) {
                        res.statusCode = 404;
                        res.json({ status: "NOT OK", msg: "Service not found" });
                    }
                    else {
                        res.statusCode = 204;
                        res.json();
                    }
                }
                catch (error) {
                    res.statusCode = 400;
                    console.log(error);
                    res.json({ status: "NOT OK", msg: "Technical problem" });
                }

            }
        }
    }
}
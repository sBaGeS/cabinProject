const authenticationController = require('../controllers/authenticationController');
const serviceReservationSQL = require('../db/serviceReservationSQL');
const dateChecker = require('../dateChecker/dateChecker');
const serviceBillSQL = require("../db/serviceBillSQL");
const nodemailer = require("nodemailer");
const createInvoice = require('../pdfkit_bill/createInvoice');


module.exports = {

    getServiceReservations: async (req, res) => {

        let verification = await authenticationController.verify(req.headers.token);

        if (verification.admin == true && verification.verified == true) {
            let person_id = req.query.person_id;
            let serviceReservation_id = req.query.serviceReservation_id;
            let service_id = req.query.service_id;
            let reservationdate = req.query.reservationdate;

            try {
                let serviceReservations = await serviceReservationSQL.getServiceReservations(serviceReservation_id, service_id, reservationdate, person_id);
                res.statusCode = 200;
                res.json({ serviceReservations });
            }
            catch (error) {
                res.status = 400;
                res.json({ status: "NOT OK", msg: "Technical problem" });
                console.log(error);
            }
        }
        if (verification.verified == false) {
            res.statusCode = 401;
            res.json({ status: "NOT OK", msg: "Not authorized" });
        }

        else {
            let person_id = verification.id;
            let serviceReservation_id = req.query.serviceReservation_id;
            let service_id = req.query.service_id;
            let reservationdate = req.query.reservationdate;
            try {
                let serviceReservations = await serviceReservationSQL.getServiceReservations(serviceReservation_id, service_id, reservationdate, person_id);
                res.statusCode = 200;
                res.json({ serviceReservations });
            }
            catch (error) {
                res.status = 400;
                res.json({ status: "NOT OK", msg: "Technical problem" });
                console.log(error);
            }
        }
    },
    postServiceReservation: async (req, res) => {

        let verification = await authenticationController.verify(req.headers.token);
        let validDate = await dateChecker.validateDate(req.body.reservationdate);

        if (verification.verified == false) {
            res.statusCode = 401;
            res.json({ status: "NOT OK", msg: "Not authorized" });
        }
        else {

            if (req.body.service_id == "" || req.body.service_id == null) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "service cant be empty" });
            }

            else if (req.body.person_id == "" || req.body.person_id == null) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "person_id cant be empty" });
            }
            else if (req.body.reservationdate == "" || req.body.reservationdate == null) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "date cant be empty" });
            }
            else if (validDate == false) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "invalid reservation date" });
            }
            else if (await dateChecker.validDate(req.body.reservationdate) == false) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "reservation date cant be from the past" });
            }
            else {

                let service_id = req.body.service_id;
                let reservationdate = req.body.reservationdate;
                let person_id = req.body.person_id;

                try {
                    let serviceReservation = await serviceReservationSQL.postServiceReservation(service_id, reservationdate, person_id);

                    if (serviceReservation != null) {
                        res.statusCode = 201;
                        res.json({ status: "OK", msg: "Service reservation complete" });

                        let newBill = await serviceBillSQL.postBill(req.body.price, req.body.reservationdate, serviceReservation.insertId, req.body.service_id, req.body.person_id);

                        let Bill = await serviceBillSQL.getBills(newBill.insertId, null, null, null);

                        if (req.body.invoice == 1) {
                            const transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: "villagepeople12345678@gmail.com",
                                    pass: "Salasana54321",
                                }
                            });

                            let email = await transporter.sendMail({
                                from: '"VillagePeopleOy" <admin@villagepeople.com>', // sender address
                                to: Bill[0].email, // list of receivers
                                subject: "Your service reservation", // Subject line
                                text: "Hey " + Bill[0].firstname + ",\n\nThank you for your service reservation\n\nService: " + Bill[0].name + "\n\nDate: " + Bill[0].reservationdate + "\n\nBilling info:\n\nAmount: " + req.body.price + "€\n\nDuedate: " + Bill[0].duedate + "\n\nBank account: XXXXXXXXXXX\n\nBest regards: VillagePeopleOY admin team", // plain text body
                            });
                        }
                        else{
                            let invoice = {
                                firstname: Bill[0].firstname,
                                lastname: Bill[0].lastname,
                                address: Bill[0].address,
                                postcode: Bill[0].postcode,
                                postarea: Bill[0].postarea,
                                service: Bill[0].name,
                                price: Bill[0].sum,
                                bill_id: Bill[0].service_bill_id,
                                reservationdate: Bill[0].reservationdate,
                                duedate: Bill[0].duedate
                            }
                          createInvoice.createInvoice(invoice);
                        }
                    }
                }
                catch (error) {
                    res.status = 400;
                    res.json({ status: "NOT OK", msg: "Technical problem" });
                    console.log(error);
                }
            }

        }
    },
    deleteServiceReservation: async (req, res) => {

        let verification = await authenticationController.verify(req.headers.token);
        let id = req.params.id;

        if (verification.verified == false) {
            res.statusCode = 401;
            res.json({ status: "NOT OK", msg: "Not authorized" });
        }

        else {

            try {
                let reservationOwner = false;
                let person_id = verification.id
                let serviceReservations = await serviceReservationSQL.getServiceReservations(null, null, null, null, person_id);

                for (let i = 0; i < serviceReservations.length; i++) {
                    if (id == serviceReservations[i].servicereservation_id) {
                        reservationOwner = true;
                    }
                }
                if (!reservationOwner) {
                    res.statusCode = 401;
                    res.json({ status: "NOT OK", msg: "Not authorized" });
                }
                else if (reservationOwner || verification.admin) {

                    let serviceBill = await serviceBillSQL.getBills(null, id, null, null);
                    await serviceBillSQL.deleteBill(serviceBill[0].service_bill_id);
                    let serviceReservation = await serviceReservationSQL.deleteServiceReservation(id);

                    if (serviceReservation.affectedRows == 0) {
                        res.statusCode = 404;
                        res.json({ status: "NOT OK", msg: "Reservation not found" });
                    }

                    else {
                        res.statusCode = 204;
                        res.json();
                    }
                }
            }
            catch (error) {
                console.log(error);
                res.json({ status: "NOT OK", msg: "Technical problem" });
            }


        }

    },
    putServiceReservation: async (req, res) => {

        let verification = await authenticationController.verify(req.headers.token);
        let validDate = await dateChecker.validateDate(req.body.reservationdate);

        if (verification.verified == false) {
            res.statusCode = 401;
            res.json({ status: "NOT OK", msg: "Not authorized" });
        }
        else {

            if (req.body.service_id == "" || req.body.service_id == null) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "service cant be empty" });
            }

            else if (req.body.person_id == "" || req.body.person_id == null) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "person_id cant be empty" });
            }
            else if (req.body.reservationdate == "" || req.body.reservationdate == null) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "date cant be empty" });
            }
            else if (validDate == false) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "invalid reservation date" });
            }
            else if (await dateChecker.validDate(req.body.reservationdate) == false) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "reservation date cant be from the past" });
            }
            else {

                let service_id = req.body.service_id;
                let person_id = req.body.person_id;
                let reservationdate = req.body.reservationdate;
                let servicereservation_id = req.params.id;

                try {
                    let reservationOwner = false;
                    let verified_person_id = verification.id
                    let serviceReservations = await serviceReservationSQL.getServiceReservations(null, null, null, null, verified_person_id);

                    for (let i = 0; i < serviceReservations.length; i++) {
                        if (servicereservation_id == serviceReservations[i].servicereservation_id) {
                            reservationOwner = true;
                        }
                    }
                    if (!reservationOwner) {
                        res.statusCode = 401;
                        res.json({ status: "NOT OK", msg: "Not authorized" });
                    }
                    else if (reservationOwner || verification.admin) {

                        let serviceReservation = await serviceReservationSQL.putServiceReservation(servicereservation_id, service_id, reservationdate, person_id);


                        if (serviceReservation.affectedRows == 0) {
                            res.statusCode = 404;
                            res.json({ status: "NOT OK", msg: "Service reservation not found" });
                        }

                        else {
                            res.statusCode = 204;
                            res.json();
                        }
                    }
                }

                catch (error) {
                    console.log(error);
                    res.json({ status: "NOT OK", msg: "Technical problem" });
                }
            }
        }
    },
    getServiceReport: async (req, res) => {
        let verification = await authenticationController.verify(req.headers.token);

        if (verification.admin == false) {
            res.statusCode = 401;
            res.json({ status: "NOT OK", msg: "Not authorized" });
        }
        else {

            let agency_id = req.query.agency_id;
            let startDate = req.query.startDate;
            let endDate = req.query.endDate;

            try {
                let serviceReport = await serviceReservationSQL.getServiceReport(agency_id, startDate, endDate);
                res.statusCode = 200;
                res.json({ serviceReport });
            }
            catch (error) {
                res.status = 400;
                res.json({ status: "NOT OK", msg: "Technical problem" });
                console.log(error);
            }

        }
    }
}

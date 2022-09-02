const authenticationController = require('../controllers/authenticationController');
const reservationSQL = require('../db/reservationSQL');
const cabinSQL = require('../db/cabinSQL');
const dateChecker = require('../dateChecker/dateChecker');
const billSQL = require("../db/billSQL");
const nodemailer = require("nodemailer");
const createInvoice = require('../pdfkit_bill/createInvoice');


module.exports = {


    postReservation: async (req, res) => {

        let verification = await authenticationController.verify(req.headers.token);

        if (verification.verified == false) {
            res.statusCode = 401;
            res.json({ status: "NOT OK", msg: "Not authorized" });
        }

        else {

            let cabinOwner = false;
            let person_id;

            let validArrivaldate = await dateChecker.validateDate(req.body.arrivaldate);
            let validLeavedate = await dateChecker.validateDate(req.body.leavedate);

            let Cabins = await cabinSQL.getCabins(null, null, null, null, null, null, null, null, null, null, verification.id, null, null);

            for (let i = 0; i < Cabins.length; i++) {
                if (req.body.cabin_id == Cabins[i].cabin_id) {
                    cabinOwner = true;
                }
            }

            let cabin_ = await cabinSQL.getCabins(null, null, null, null, null, null, null, null, null, null, null, null, req.body.cabin_id);

            if (verification.admin == false && cabinOwner == true) {
                res.statusCode = 409;
                res.json({ status: "NOT OK", msg: "You cant reserve your own cabin" });
            }

            else if (req.body.people > cabin_[0].capacity) {
                res.statusCode = 409;
                res.json({ status: "NOT OK", msg: "Cant exceed cabins max capacity" });
            }


            else if (req.body.arrivaldate == "" || req.body.arrivaldate == null) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "arrivaldate cant be empty" });
            }

            else if (req.body.leavedate == "" || req.body.leavedate == null) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "leavedate cant be empty" });
            }

            else if (req.body.people == "" || req.body.people == null || req.body.people <= 0) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "people cant be empty or below 1" });
            }

            else if (req.body.pets == null || req.body.pets !== 0 && req.body.pets !== 1) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "pets cant be empty and has to be 1 = yes or 0 = no" });
            }

            else if (verification.admin == true && (req.body.person_id == "" || req.body.person_id == null)) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "person_id cant be empty" });
            }

            else if (req.body.cabin_id == "" || req.body.cabin_id == null) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "cabin_id cant be empty" });
            }

            else if (validArrivaldate == false) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "invalid arrivaldate" });
            }

            else if (validLeavedate == false) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "invalid leavedate" });
            }

            else if (await dateChecker.validDate(req.body.arrivaldate) == false) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "arrivaldate cant be from the past" });
            }

            else if (await dateChecker.validDate(req.body.leavedate) == false) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "leavedate cant be from the past" });
            }

            else if (req.body.arrivaldate >= req.body.leavedate) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "leavedate cant be same or before arrivaldate" });
            }

            else {

                if (verification.admin == true) {
                    person_id = req.body.person_id;
                }

                else {
                    person_id = verification.id;
                }

                let reserved = await reservationSQL.getReservations(req.body.arrivaldate, req.body.leavedate, null, null, null, req.body.cabin_id, null);
                let reserved2 = await reservationSQL.getReservations(null, null, req.body.arrivaldate, req.body.leavedate, null, req.body.cabin_id, null);
                let reserved3 = await reservationSQL.getReservations(null, req.body.arrivaldate, req.body.leavedate, null, null, req.body.cabin_id, null);

                if (reserved.length != 0 || reserved2.length != 0 || reserved3.length != 0) {
                    res.statusCode = 409;
                    res.json({ status: "NOT OK", msg: "cabin already reserved" });
                }

                else {

                    try {

                        let newReservation = await reservationSQL.postReservation(req.body.arrivaldate, req.body.leavedate, req.body.people, req.body.pets, person_id, req.body.cabin_id);

                        if (newReservation != null) {
                            res.statusCode = 201;
                            res.json({ reservation_id: newReservation.insertId, arrivaldate: req.body.arrivaldate, leavedate: req.body.leavedate, people: req.body.people, pets: req.body.pets, person_id: person_id, cabin_id: req.body.cabin_id });

                            let newBill = await billSQL.postBill(req.body.price, req.body.arrivaldate, newReservation.insertId, person_id, req.body.cabin_id);

                            let Bill = await billSQL.getBills(newBill.insertId, null, null, null);

                            if(req.body.invoice == 1){
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
                                subject: "Your cabin reservation", // Subject line
                                text: "Hey " + Bill[0].firstname + ",\n\nThank you for your cabin reservation on cabin " + Bill[0].name + "\n\nBilling info:\n\nAmount: " + req.body.price + "€\n\nDuedate: " + Bill[0].duedate + "\n\nBank account: XXXXXXXXXXX\n\nBest regards: VillagePeopleOY admin team", // plain text body
                            });
                            }
                            else{
                                let invoice = {
                                    firstname: Bill[0].firstname,
                                    lastname: Bill[0].lastname,
                                    address: Bill[0].address,
                                    postcode: Bill[0].postcode,
                                    postarea: Bill[0].postarea,
                                    cabin: Bill[0].name,
                                    price: req.body.price,
                                    bill_id: Bill[0].bill_id,
                                    arrivaldate: req.body.arrivaldate,
                                    leavedate: req.body.leavedate,
                                    duedate: Bill[0].duedate
                                }
                              createInvoice.createInvoice(invoice);
                            }
                        }
                    }

                    catch (error) {
                        console.log(error);
                        res.json({ status: "NOT OK", msg: "Technical problem" });
                    }
                }
            }
        }
    },


    getReservations: async (req, res) => {

        let arrivaldate_from = req.query.arrivaldate_from;
        let arrivaldate_to = req.query.arrivaldate_to;
        let leavedate_from = req.query.leavedate_from;
        let leavedate_to = req.query.leavedate_to;
        let person_id = req.query.person_id;
        let cabin_id = req.query.cabin_id;
        let reservation_id = req.query.reservation_id;


        let verification = await authenticationController.verify(req.headers.token);

        if (verification.verified == false) {
            res.statusCode = 401;
            res.json({ status: "NOT OK", msg: "Not authorized" });
        }

        else {
            let cabinOwner = false;

            let Cabins = await cabinSQL.getCabins(null, null, null, null, null, null, null, null, null, null, verification.id, null, null);

            for (let i = 0; i < Cabins.length; i++) {
                if (cabin_id == Cabins[i].cabin_id) {
                    cabinOwner = true;
                }
            }

            if (verification.admin == false && (cabinOwner == false && person_id != verification.id)) {
                res.statusCode = 401;
                res.json({ status: "NOT OK", msg: "Not authorized" });
            }

            else {

                try {

                    let Reservations = await reservationSQL.getReservations(arrivaldate_from, arrivaldate_to, leavedate_from, leavedate_to, person_id, cabin_id, reservation_id);

                    res.statusCode = 200;
                    res.json({ Reservations });

                }

                catch (error) {
                    console.log(error);
                    res.json({ status: "NOT OK", msg: "Technical problem" });
                }
            }
        }
    },


    checkReservations: async (req, res) => {

        try {

            let Reservations = await reservationSQL.checkReservations(req.params.id);

            res.statusCode = 200;
            res.json({ Reservations });

        }

        catch (error) {
            console.log(error);
            res.json({ status: "NOT OK", msg: "Technical problem" });
        }

    },


    deleteReservation: async (req, res) => {

        let verification = await authenticationController.verify(req.headers.token);

        if (verification.verified == false) {
            res.statusCode = 401;
            res.json({ status: "NOT OK", msg: "Not authorized" });
        }

        else {

            try {

                let reservationOwner = false;

                let Reservations = await reservationSQL.getReservations(null, null, null, null, verification.id, null, null);

                for (let i = 0; i < Reservations.length; i++) {
                    if (req.params.id == Reservations[i].reservation_id) {
                        reservationOwner = true;
                    }
                }

                let cabinOwner = false;

                let Cabins = await cabinSQL.getCabins(null, null, null, null, null, null, null, null, null, null, verification.id, null, null);

                for (let i = 0; i < Cabins.length; i++) {
                    let Reservations = await reservationSQL.getReservations(null, null, null, null, null, Cabins[i].cabin_id, null);

                    for (let i = 0; i < Reservations.length; i++) {
                        if (req.params.id == Reservations[i].reservation_id) {
                            cabinOwner = true;
                        }
                    }
                }

                if (verification.admin == false && reservationOwner == false && cabinOwner == false) {
                    res.statusCode = 401;
                    res.json({ status: "NOT OK", msg: "Not authorized" });
                }

                else {

                    let Bill = await billSQL.getBills(null, req.params.id, null, null);

                    await billSQL.deleteBill(Bill[0].bill_id);

                    let sql = await reservationSQL.deleteReservation(req.params.id);


                    if (sql.affectedRows == 0) {
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


    putReservation: async (req, res) => {

        let verification = await authenticationController.verify(req.headers.token);

        if (verification.verified == false) {
            res.statusCode = 401;
            res.json({ status: "NOT OK", msg: "Not authorized" });
        }

        else {

            let reservationOwner = false;
            let person_id;

            let validArrivaldate = await dateChecker.validateDate(req.body.arrivaldate);
            let validLeavedate = await dateChecker.validateDate(req.body.leavedate);

            let Reservations = await reservationSQL.getReservations(null, null, null, null, verification.id, null, null);

            let cabin = await cabinSQL.getCabins(null, null, null, null, null, null, null, null, null, null, null, null, req.body.cabin_id);

            for (let i = 0; i < Reservations.length; i++) {
                if (req.params.id == Reservations[i].reservation_id) {
                    reservationOwner = true;
                }
            }

            if (verification.admin == false && reservationOwner == false) {
                res.statusCode = 401;
                res.json({ status: "NOT OK", msg: "Not authorized" });
            }

            else if (req.body.people > cabin[0].capacity) {
                res.statusCode = 409;
                res.json({ status: "NOT OK", msg: "Cant exceed cabins max capacity" });
            }

            else if (req.body.arrivaldate == "" || req.body.arrivaldate == null) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "arrivaldate cant be empty" });
            }

            else if (req.body.leavedate == "" || req.body.leavedate == null) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "leavedate cant be empty" });
            }

            else if (req.body.people == "" || req.body.people == null || req.body.people <= 0) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "people cant be empty or below 1" });
            }

            else if (req.body.pets == null || req.body.pets !== 0 && req.body.pets !== 1) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "pets cant be empty and has to be 1 = yes or 0 = no" });
            }

            else if (validArrivaldate == false) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "invalid arrivaldate" });
            }

            else if (validLeavedate == false) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "invalid leavedate" });
            }

            else if (await dateChecker.validDate(req.body.arrivaldate) == false) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "arrivaldate cant be from the past" });
            }

            else if (await dateChecker.validDate(req.body.leavedate) == false) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "leavedate cant be from the past" });
            }

            else if (req.body.arrivaldate >= req.body.leavedate) {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "leavedate cant be same or before arrivaldate" });
            }

            else {

                let alreadyReserved = false;

                let reserved = await reservationSQL.getReservations(req.body.arrivaldate, req.body.leavedate, null, null, null, req.body.cabin_id, null);
                let reserved2 = await reservationSQL.getReservations(null, null, req.body.arrivaldate, req.body.leavedate, null, req.body.cabin_id, null);
                let reserved3 = await reservationSQL.getReservations(null, req.body.arrivaldate, req.body.leavedate, null, null, req.body.cabin_id, null);

                if (reserved.length > 1 || reserved2.length > 1 || reserved3.length > 1) {
                    alreadyReserved = true;
                    res.statusCode = 409;
                    res.json({ status: "NOT OK", msg: "cabin already reserved" });
                }

                else if (reserved.length == 1 || reserved2.length == 1 || reserved3.length == 1) {
                    if (reserved.length == 1) {
                        if (reserved[0].reservation_id != req.params.id) {
                            alreadyReserved = true;
                            res.statusCode = 409;
                            res.json({ status: "NOT OK", msg: "cabin already reserved" });
                        }

                    }

                    else if (reserved2.length == 1) {
                        if (reserved2[0].reservation_id != req.params.id) {
                            alreadyReserved = true;
                            res.statusCode = 409;
                            res.json({ status: "NOT OK", msg: "cabin already reserved" });
                        }

                    }

                    else if (reserved3.length == 1) {
                        if (reserved3[0].reservation_id != req.params.id) {
                            alreadyReserved = true;
                            res.statusCode = 409;
                            res.json({ status: "NOT OK", msg: "cabin already reserved" });
                        }

                    }

                }

                if (alreadyReserved == false) {

                    if (verification.admin == true) {
                        person_id = req.body.person_id;
                    }

                    else {
                        person_id = verification.id;
                    }

                    try {

                        let sql = await reservationSQL.putReservation(req.body.arrivaldate, req.body.leavedate, req.body.people, req.body.pets, req.params.id);
                        let bill = await billSQL.getBills(null, req.params.id, null, null, null);

                        console.log(bill[0].duedate);
                        console.log(req.body.price);

                        let duedate = bill[0].duedate[6] + bill[0].duedate[7] + bill[0].duedate[8] + bill[0].duedate[9] + "-" + bill[0].duedate[3]+ bill[0].duedate[4] + "-" + bill[0].duedate[0] + bill[0].duedate[1];

                        await billSQL.putBill(req.body.price, duedate, bill[0].paid, bill[0].bill_id);

                        if (sql.affectedRows == 0) {
                            res.statusCode = 404;
                            res.json({ status: "NOT OK", msg: "Reservation not found" });
                        }

                        else {
                            res.statusCode = 204;
                            res.json();
                        }
                    }

                    catch (error) {
                        console.log(error);
                        res.json({ status: "NOT OK", msg: "Technical problem" });
                    }
                }
            }
        }
    },
    getCabinReservationReport: async (req, res) => {

        let verification = await authenticationController.verify(req.headers.token);
        let person_id = req.query.person_id;

        if (verification.verified == false) {
            res.statusCode = 401;
            res.json({ status: "NOT OK", msg: "Not authorized" });
        }

        if (verification.admin == true) {
            try {
                let startDate = req.query.startDate;
                let endDate = req.query.endDate;
                let cabin_id = req.query.cabin_id;
                let agency_id = req.query.agency_id;

                let reservationReport = await reservationSQL.getReservationReport(null, startDate, endDate, cabin_id, agency_id)

                res.statusCode = 200;
                res.json({ reservationReport });

            }
            catch (error) {
                console.log(error);
                res.json({ status: "NOT OK", msg: "Technical problem" });
            }
        }
        else if (person_id == verification.id) {

            try {
                let startDate = req.query.startDate;
                let endDate = req.query.endDate;
                let cabin_id = req.query.cabin_id;
                let agency_id = req.query.agency_id;

                let reservationReport = await reservationSQL.getReservationReport(person_id, startDate, endDate, cabin_id, agency_id)

                res.statusCode = 200;
                res.json({ reservationReport });

            }
            catch (error) {
                console.log(error);
                res.json({ status: "NOT OK", msg: "Technical problem" });
            }
        }
        else {
            res.json({ status: "NOT OK", msg: "Technical problem" });
        }


    }

}


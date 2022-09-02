var express = require('express');
var app = express();
var router = express.Router();

let personController = require('../controllers/personController');
let loginController = require('../controllers/loginController');
let agencyController = require('../controllers/agencyController');
let cabinController = require('../controllers/cabinController');
let reservationController = require('../controllers/reservationController');
let serviceController = require('../controllers/serviceController');
let serviceReservationController = require('../controllers/serviceReservationController');
let billController = require("../controllers/billController");
let serviceBillController = require("../controllers/serviceBillController");

router.route('/person')
.post(personController.postPerson)
.get(personController.getPersons);


router.route('/person/:id')
.delete(personController.deletePerson)
.put(personController.putPerson);


router.route('/login')
.post(loginController.login);


router.route('/agency')
.get(agencyController.getAgencies)
.post(agencyController.postAgency);


router.route('/agency/:id')
.delete(agencyController.deleteAgency)
.put(agencyController.putAgency);


router.route('/cabin')
.get(cabinController.getCabins)
.post(cabinController.postCabin);


router.route('/cabin/:id')
.delete(cabinController.deleteCabin)
.put(cabinController.putCabin);


router.route('/reservation')
.get(reservationController.getReservations)
.post(reservationController.postReservation);

router.route('/reservationreport')
.get(reservationController.getCabinReservationReport);


router.route('/checkReservations/:id')
.get(reservationController.checkReservations);


router.route('/reservation/:id')
.delete(reservationController.deleteReservation)
.put(reservationController.putReservation);

router.route('/service')
.get(serviceController.getServices)
.post(serviceController.postService);

router.route('/service/:id')
.delete(serviceController.deleteService)
.put(serviceController.putService);

router.route('/serviceReservation')
.get(serviceReservationController.getServiceReservations)
.post(serviceReservationController.postServiceReservation);

router.route('/serviceReport')
.get(serviceReservationController.getServiceReport);

router.route('/serviceReservation/:id')
.put(serviceReservationController.putServiceReservation)
.delete(serviceReservationController.deleteServiceReservation);

router.route('/bill')
.get(billController.getBills)
.post(billController.postBill);

router.route('/bill/:id')
.put(billController.putBill)
.delete(billController.deleteBill);

router.route('/service_bill')
.get(serviceBillController.getBills)
.post(serviceBillController.postBill);

router.route('/service_bill/:id')
.put(serviceBillController.putBill)
.delete(serviceBillController.deleteBill);

module.exports = router;
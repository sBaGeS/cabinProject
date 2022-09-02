import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from './components/navbar/Navbar';
import Home from './components/pages/home/Home';
import Footer from './components/footer/Footer';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

//*** pages ***/
import RegisterForm from './components/pages/register/RegisterForm';
import LoginForm from './components/pages/login/LoginForm';
import UserInfo from './components/pages/userInfo/UserInfo';
import MyCabins from './components/pages/mycabins/MyCabins';
import MyReservations from './components/pages/my_reservations/MyReservations';
import AddCabin from './components/pages/add_cabin/AddCabin';
import AddService from './components/pages/add_service/AddService';
import ShowServices from './components/pages/show_services/ShowServices';
import AddAgency from './components/pages/add_agency/AddAgency';
import GetCustomersAdmin from './components/pages/admin_tools/GetCustomersAdmin';
import News from './components/pages/news/News';
import GetCabinDetails from './components/pages/cabin_details/GetCabinDetails';
import GetAgencyInfo from './components/pages/agencyInfo/GetAgencyInfo';
import GetServiceDetails from './components/pages/service_details/GetServiceDetails';

import SearchCabins from './components/pages/searchCabins/SearchCabins';
import UserCabins from './components/pages/admin_tools/UserCabins'
import UserReservations from './components/pages/userReservations/UserReservations';
import ServiceReport from './components/pages/service_report/ServiceReport';
import CabinReport from './components/pages/cabin_report/CabinReport';
import CabinBills from './components/pages/billing/CabinBills';
import ServiceBills from './components/pages/billing/ServiceBills';

import PrivateRoute from './Utils/PrivateRoute';
import AdminRoute from './Utils/AdminRoute';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    paddingLeft: '8px',
    paddingRight: '8px',
    minHeight: '100vh',
    backgroundColor: 'white'
  }
}));

function App() {
  const classes = useStyles();
 
  return (
   <Container >
    <div className={classes.root}>
      <Router>
        <Navbar/>
        <div className={classes.main}>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/news">
            <News />
          </Route>
          <Route exact path="/search_cabins">
            <SearchCabins  />
          </Route>
          <Route exact path="/register">
            <RegisterForm />
          </Route>
          <Route exact path="/login">
            <LoginForm  />
          </Route>
          <Route exact path="/show_services">
            <ShowServices/>
          </Route>
          <Route exact path = "/service_detail/:id" component={GetServiceDetails}/>
         <PrivateRoute exact path = "/account_info" component={UserInfo}/>
         <PrivateRoute exact path = "/my_cabins" component={MyCabins}/>
         <PrivateRoute exact path = "/my_reservations" component={MyReservations}/>
         <PrivateRoute exact path = "/add_cabin" component={AddCabin}/>
         <PrivateRoute exact path = "/cabin_report" component={CabinReport}/>
         <Route exact path = "/cabin_detail/:id" component={GetCabinDetails}/>
         <AdminRoute exact path = "/get_customers" component={GetCustomersAdmin}/>
         <AdminRoute exact path = "/user_cabins/:id" component={UserCabins}/>
         <AdminRoute exact path = "/user_reservations" component={UserReservations}/>
         <AdminRoute exact path = "/add_agency" component={AddAgency}/>
         <AdminRoute exact path = "/add_service" component={AddService}/>
         <AdminRoute exact path = "/agencies" component={GetAgencyInfo}/>
         <AdminRoute exact path = "/get_services" component={ShowServices}/>
         <AdminRoute exact path = "/service_report" component={ServiceReport}/>
         <AdminRoute exact path = "/cabin_bills" component={CabinBills}/>
         <AdminRoute exact path = "/service_bills" component={ServiceBills}/>
        </Switch>
        </div>
        <Footer />
      </Router>
    </div>
    </Container>

  );
}

export default App;

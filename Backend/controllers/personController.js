const personSQL = require('../db/personSQL');
const cabinSQL = require('../db/cabinSQL');
const reservationSQL = require('../db/reservationSQL');
const emailValidator = require("email-validator");
const passwordValidator = require('../passwordValidator/passwordValidator');
const bcrypt = require('bcrypt');
const authenticationController = require('../controllers/authenticationController');

module.exports = {

    getPersons: async (req, res) => {


        let verification = await authenticationController.verify(req.headers.token);

        if (verification.verified == false)
        {
            res.statusCode = 401;
            res.json({ status: "NOT OK", msg: "Not authorized"});
        }

        else if (verification.admin == false)
        {

            if (req.query.id != verification.id || req.query.id == undefined)
            {
                 res.statusCode = 401;
                 res.json({ status: "NOT OK", msg: "Not authorized"});
            }

            else
            {
                try
                {
        
                   let id = req.query.id;
        
                   let Persons = await personSQL.getPerson(id);
          
                   res.statusCode = 200;
                   res.json({Persons});
                }
          
                catch (error) {
                   console.log(error);
                   res.json({status : "NOT OK", msg : "Technical problem"});
               }
            }
        }

        else
        {

        try
        {

            let id = req.query.id;
            let firstname = req.query.firstname;
            let lastname = req.query.lastname;
            let address = req.query.address;
            let postcode = req.query.postcode;
            let postarea = req.query.postarea;
            let phonenumber = req.query.phonenumber;
            let email = req.query.email;
            let username = req.query.username;

  
           let Persons = await personSQL.fetchPersons_admin(id, firstname, lastname, address, postcode, postarea, phonenumber, email, username);
  
           res.statusCode = 200;
           res.json({Persons});
        }
  
        catch (error) {
           console.log(error);
           res.json({status : "NOT OK", msg : "Technical problem"});
       }
    }
  
      },


      postPerson: async (req, res) => {

        let alreadyExists = false;

        let Persons = await personSQL.fetchPersons_admin();

        for (let i = 0; i < Persons.length; i++)
            {
               if (req.body.username == Persons[i].username)
               {
                  alreadyExists = true;

                  res.statusCode = 409
                  res.json({ status: "NOT OK", msg: "username already exists" });
               }

               else if (req.body.email == Persons[i].email)
               {
                  alreadyExists = true;

                  res.statusCode = 409
                  res.json({ status: "NOT OK", msg: "email already exists" });
               }
            }

        if (alreadyExists == false)
        {

        if (req.body.firstname == "" || req.body.firstname == null)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "firstname cant be empty" });
        }

        else if (req.body.lastname == "" || req.body.lastname == null)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "lastname cant be empty" });
        }

        else if (req.body.address == "" || req.body.address == null)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "address cant be empty" });
        }

        else if (req.body.postcode == "" || req.body.postcode == null)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "postcode cant be empty" });
        }

        else if (req.body.postarea == "" || req.body.postarea == null)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "postarea cant be empty" });
        }

        else if (req.body.phonenumber == "" || req.body.phonenumber == null)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "phonenumber cant be empty" });
        }

        else if (req.body.email == "" || req.body.email == null)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "email cant be empty" });
        }

        else if (emailValidator.validate(req.body.email) == false)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "invalid email address" });
        }

        else if (req.body.username == "" || req.body.username == null)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "username cant be empty" });
        }

        else if (req.body.username.length < 4)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "username too short" });
        }

        else if (req.body.username.length > 10)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "username too long" });
        }

        else if (req.body.password == "" || req.body.password == null)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "password cant be empty" });
        }

        else if (passwordValidator.validate(req.body.password) == false)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "invalid password" });
        }

        else
        {

        try
        {

          bcrypt.hash(req.body.password, 10, async function(err, hash) {


            let newPerson = await personSQL.postPerson(req.body.firstname, req.body.lastname, req.body.address, req.body.postcode, req.body.postarea, req.body.phonenumber, req.body.email, req.body.username, hash);

            if (newPerson != null)
            {
              res.statusCode = 201;
              res.json({person_id: newPerson.insertId, firstname: req.body.firstname, lastname: req.body.lastname, address: req.body.address, postcode: req.body.postcode, postarea: req.body.postarea, phonenumber: req.body.phonenumber, email: req.body.email, username: req.body.username});
            }

        });
    }
  
        catch (error) {
           console.log(error);
           res.json({status : "NOT OK", msg : "Technical problem"});
       }
    }
}
  
      },


      putPerson: async (req, res) => {


        let verification = await authenticationController.verify(req.headers.token);

        if (verification.verified == false)
        {
            res.statusCode = 401;
            res.json({ status: "NOT OK", msg: "Not authorized"});
        }

        else if (verification.admin == false && verification.id != req.params.id)
        {
            res.statusCode = 401;
            res.json({ status: "NOT OK", msg: "Not authorized"});
        }

        else
        {

        let alreadyExists = false;

        let Persons = await personSQL.fetchPersons_admin();

        if (verification.admin == false)
        {

        for (let i = 0; i < Persons.length; i++)
            {
                if (Persons[i].person_id != verification.id)
                {

               if (req.body.email == Persons[i].email)
               {
                  alreadyExists = true;

                  res.statusCode = 409
                  res.json({ status: "NOT OK", msg: "email already exists" });
               }
            }
            }
        }

        if (alreadyExists == false)
        {

        
        if (req.body.firstname == "" || req.body.firstname == null)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "firstname cant be empty" });
        }

        else if (req.body.lastname == "" || req.body.lastname == null)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "lastname cant be empty" });
        }

        else if (req.body.address == "" || req.body.address == null)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "address cant be empty" });
        }

        else if (req.body.postcode == "" || req.body.postcode == null)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "postcode cant be empty" });
        }

        else if (req.body.postarea == "" || req.body.postarea == null)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "postarea cant be empty" });
        }

        else if (req.body.phonenumber == "" || req.body.phonenumber == null)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "phonenumber cant be empty" });
        }

        else if (req.body.email == "" || req.body.email == null)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "email cant be empty" });
        }

        else if (emailValidator.validate(req.body.email) == false)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "invalid email address" });
        }

        else
        {

        try{

        let sql = await personSQL.putPerson(req.body.firstname, req.body.lastname, req.body.address, req.body.postcode, req.body.postarea, req.body.phonenumber, req.body.email, req.params.id);


        if (sql.affectedRows == 0)
        {
            res.statusCode = 404;
            res.json({ status: "NOT OK", msg: "Person not found"});
        }

        else
        {
           res.statusCode = 204;
           res.json();
        }

          }
  
        catch (error) {
           console.log(error);
           res.json({status : "NOT OK", msg : "Technical problem"});
       }
    }
    }
}
    },


    deletePerson: async (req, res) => {

        let verification = await authenticationController.verify(req.headers.token);

        let Cabins = await cabinSQL.getCabins(null, null, null, null, null, null, null, null, null, null, req.params.id, null, null);

        let Reservations = await reservationSQL.getReservations(null, null, null, null, req.params.id, null, null);

        if (verification.verified == false)
        {
            res.statusCode = 401;
            res.json({ status: "NOT OK", msg: "Not authorized"});
        }

        else if (verification.admin == false)
        {
            res.statusCode = 401;
            res.json({ status: "NOT OK", msg: "Not authorized"});
        }

        else if (Cabins.length > 0)
        {
            res.statusCode = 409;
            res.json({ status: "NOT OK", msg: "Cannot delete: user has cabins"});
        }

        else if (Reservations.length > 0)
        {
            res.statusCode = 409;
            res.json({ status: "NOT OK", msg: "Cannot delete: user has reservations"});
        }

        else
        {

        try
        {

          let sql = await personSQL.deletePerson(req.params.id);

          
        if (sql.affectedRows == 0)
        {
            res.statusCode = 404;
            res.json({ status: "NOT OK", msg: "Person not found"});
        }

         else
         {
           res.statusCode = 204;
           res.json();
         }
        }
  
        catch (error) {
           console.log(error);
           res.json({status : "NOT OK", msg : "Technical problem"});
       }
    }
  
      },

}
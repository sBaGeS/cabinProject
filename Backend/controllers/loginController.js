const personSQL = require('../db/personSQL');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwt_key = "RFpkr9oiyGOREzwn4PKd";

module.exports = {

    login: async (req, res) => {

        try
        {

            let userExists = false;
            let password;
            let id;
            let user_role;

            if (req.body.username == "" || req.body.username == null)
            {
                res.statusCode = 400;   
                res.json({ status: "NOT OK", msg: "username cant be empty" });
            }
    
            else if (req.body.password == "" || req.body.password == null)
            {
                res.statusCode = 400;   
                res.json({ status: "NOT OK", msg: "password cant be empty" });
            }

            else
            {
        
             let Persons = await personSQL.fetchPersons_admin();

             for (let i = 0; i < Persons.length; i++)
            {
               if (req.body.username.toLowerCase() == Persons[i].username.toLowerCase())
               {
                  userExists = true;
                  password = Persons[i].password;
                  id = Persons[i].person_id;
                  user_role = Persons[i].role_id;
               }
            }

            if (userExists == false)
            {
                res.statusCode = 401;   
                res.json({ status: "NOT OK", msg: "login failed" });
            }

            else
            {
                bcrypt.compare(req.body.password, password, function(err, result) {
                    
                  if (result == true)
                  {

                     const token = jwt.sign(
                         {
                           id: id,
                           username: req.body.username,
                           role: user_role,
                         },

                         jwt_key,

                         {
                             expiresIn: "1h"
                         }

                     );

                    res.statusCode = 200;   
                    res.json({ status: "OK", msg: "login succesful", token: token });
                  }

                  else
                  {
                    res.statusCode = 401;   
                    res.json({ status: "NOT OK", msg: "login failed" });
                  }

                });
            }

            }
  
        }
  
        catch (error) {
           console.log(error);
           res.json({status : "NOT OK", msg : "Technical problem"});
       }

    }
}
const authenticationController = require('../controllers/authenticationController');
const agencySQL = require('../db/agencySQL');
const cabinSQL = require('../db/cabinSQL');
const emailValidator = require("email-validator");


module.exports = {


    getAgencies: async (req, res) => {

        let id = req.query.id;
        let name = req.query.name;
        let address = req.query.address;
        let postcode = req.query.postcode;
        let postarea = req.query.postarea;

        try
        {

          let Agencies = await agencySQL.getAgencies(id, name, address, postcode, postarea);
        
           res.statusCode = 200;
           res.json({Agencies});
         
        }
  
        catch (error) {
           console.log(error);
           res.json({status : "NOT OK", msg : "Technical problem"});
         }   
      },


      postAgency: async (req, res) => {

        let verification = await authenticationController.verify(req.headers.token);

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

        else
        {

          if (req.body.name == "" || req.body.name == null)
          {
              res.statusCode = 400;   
              res.json({ status: "NOT OK", msg: "name cant be empty" });
          }

         else if(req.body.email != "" && req.body.email != null && emailValidator.validate(req.body.email) == false)
         {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "invalid email address" });
         }

        else
        {

        try
        {

            let newAgency = await agencySQL.postAgency(req.body.name, req.body.address, req.body.postcode, req.body.postarea, req.body.phonenumber, req.body.email);

            if (newAgency != null)
            {
              res.statusCode = 201;
              res.json({agency_id: newAgency.insertId, name: req.body.name, address: req.body.address, postcode: req.body.postcode, postarea: req.body.postarea, phonenumber: req.body.phonenumber, email: req.body.email});
            }
    }
  
        catch (error) {
           console.log(error);
           res.json({status : "NOT OK", msg : "Technical problem"});
       }
    }
}
      },


      deleteAgency: async (req, res) => {

        let verification = await authenticationController.verify(req.headers.token);

        let Cabins = await cabinSQL.getCabins(null, null, null, null, null, null, null, null, null, null, null, req.params.id, null);

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
            res.json({ status: "NOT OK", msg: "Cannot delete: agency has cabins"});
        }

        else
        {

        try
        {

          let sql = await agencySQL.deleteAgency(req.params.id);

          
        if (sql.affectedRows == 0)
        {
            res.statusCode = 404;
            res.json({ status: "NOT OK", msg: "Agency not found"});
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


      putAgency: async (req, res) => {

        let verification = await authenticationController.verify(req.headers.token);

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

        else
        {

          if (req.body.name == "" || req.body.name == null)
          {
              res.statusCode = 400;   
              res.json({ status: "NOT OK", msg: "name cant be empty" });
          }
            
         else if(req.body.email != "" && req.body.email != null && emailValidator.validate(req.body.email) == false)
         {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "invalid email address" });
         }

        else
        {

        try{

        let sql = await agencySQL.putAgency(req.body.name, req.body.address, req.body.postcode, req.body.postarea, req.body.phonenumber, req.body.email, req.params.id);


        if (sql.affectedRows == 0)
        {
            res.statusCode = 404;
            res.json({ status: "NOT OK", msg: "Agency not found"});
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
    },

}
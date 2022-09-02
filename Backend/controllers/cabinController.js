const authenticationController = require('../controllers/authenticationController');
const cabinSQL = require('../db/cabinSQL');
const reservationSQL = require('../db/reservationSQL');

module.exports = {

    postCabin: async (req, res) => {

        let verification = await authenticationController.verify(req.headers.token);

        if (verification.verified == false)
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

        else if (req.body.price == "" || req.body.price == null)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "price cant be empty" });
        }

        else if (req.body.size == "" || req.body.size == null)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "size cant be empty" });
        }

        else if (req.body.capacity == "" || req.body.capacity == null || req.body.capacity < 1) 
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "capacity cant be empty or less than 1" });
        }

        else if (req.body.agency_id == "" || req.body.agency_id == null)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "agency_id cant be empty" });
        }

        else
        {

        try
        {

            let newCabin = await cabinSQL.postCabin(req.body.name, req.body.address, req.body.postcode, req.body.postarea, req.body.price, req.body.size, req.body.capacity, req.body.info, verification.id, req.body.agency_id);

            if (newCabin != null)
            {
              res.statusCode = 201;
              res.json({cabin_id: newCabin.insertId, name: req.body.name, address: req.body.address, postcode: req.body.postcode, postarea: req.body.postarea, price: req.body.price, size: req.body.size, capacity: req.body.capacity, info: req.body.info, cabinowner_id: verification.id, agency_id: req.body.agency_id});
            }
    }
  
        catch (error) {
           console.log(error);
           res.json({status : "NOT OK", msg : "Technical problem"});
       }
    }
}
      },


      getCabins: async (req, res) => {

        let name = req.query.name;
        let address = req.query.address;
        let postcode = req.query.postcode;
        let postarea = req.query.postarea;
        let min_price = req.query.min_price;
        let max_price = req.query.max_price;
        let min_size = req.query.min_size;
        let max_size = req.query.max_size;
        let min_capacity = req.query.min_capacity;
        let max_capacity = req.query.max_capacity;
        let cabinowner_id = req.query.cabinowner_id;
        let agency_id = req.query.agency_id;
        let cabin_id = req.query.cabin_id;
        

        try
        {

          let Cabins = await cabinSQL.getCabins(name, address, postcode, postarea, min_price, max_price, min_size, max_size, min_capacity, max_capacity, cabinowner_id, agency_id, cabin_id);
        
           res.statusCode = 200;
           res.json({Cabins});
         
        }
  
        catch (error) {
           console.log(error);
           res.json({status : "NOT OK", msg : "Technical problem"});
          }
      },


      deleteCabin: async (req, res) => {

        let verification = await authenticationController.verify(req.headers.token);

        if (verification.verified == false)
        {
            res.statusCode = 401;
            res.json({ status: "NOT OK", msg: "Not authorized"});
        }

        else
        {

        try
        {

        let cabinOwner = false;

        let Cabins = await cabinSQL.getCabins(null, null, null, null, null, null, null, null, null, null, verification.id, null, null);

        let Reservations = await reservationSQL.getReservations(null, null, null, null, null, req.params.id, null);

           for (let i = 0; i < Cabins.length; i++)
           {
              if (req.params.id == Cabins[i].cabin_id)
              {
                 cabinOwner = true;
              }
           }

           if (verification.admin == false && cabinOwner == false)
           {
               res.statusCode = 401;
               res.json({ status: "NOT OK", msg: "Not authorized"});
           }

           else if (Reservations.length > 0)
           {
               res.statusCode = 409;
               res.json({ status: "NOT OK", msg: "Cannot delete: cabin has reservations"});
           }

           else
           {

          let sql = await cabinSQL.deleteCabin(req.params.id);


        if (sql.affectedRows == 0)
        {
            res.statusCode = 404;
            res.json({ status: "NOT OK", msg: "Cabin not found"});
        }

         else
         {
           res.statusCode = 204;
           res.json();
         }
        }
    }
  
        catch (error) {
           console.log(error);
           res.json({status : "NOT OK", msg : "Technical problem"});
       }
    }

  
      },


      putCabin: async (req, res) => {

        let verification = await authenticationController.verify(req.headers.token);

        if (verification.verified == false)
        {
            res.statusCode = 401;
            res.json({ status: "NOT OK", msg: "Not authorized"});
        }

        else
        {

            let cabinOwner = false;

            let Cabins = await cabinSQL.getCabins(null, null, null, null, null, null, null, null, null, null, verification.id, null, null);
    
               for (let i = 0; i < Cabins.length; i++)
               {
                  if (req.params.id == Cabins[i].cabin_id)
                  {
                     cabinOwner = true;
                  }
               }
    
               if (verification.admin == false && cabinOwner == false)
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

        else if (req.body.price == "" || req.body.price == null)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "price cant be empty" });
        }

        else if (req.body.size == "" || req.body.size == null)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "size cant be empty" });
        }

        else if (req.body.capacity == "" || req.body.capacity == null || req.body.capacity < 1)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "capacity cant be empty or less than 1" });
        }

        else if (req.body.agency_id == "" || req.body.agency_id == null)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "agency_id cant be empty" });
        }

        else
        {

        try{

        let sql = await cabinSQL.putCabin(req.body.name, req.body.address, req.body.postcode, req.body.postarea, req.body.price, req.body.size, req.body.capacity, req.body.info, req.body.agency_id, req.params.id);


        if (sql.affectedRows == 0)
        {
            res.statusCode = 404;
            res.json({ status: "NOT OK", msg: "Cabin not found"});
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


}
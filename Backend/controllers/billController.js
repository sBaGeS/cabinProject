const authenticationController = require('../controllers/authenticationController');
const dateChecker = require('../dateChecker/dateChecker');
const billSQL = require('../db/billSQL');


module.exports = {

    postBill: async (req, res) => {

        let verification = await authenticationController.verify(req.headers.token);

        let validDuedate = await dateChecker.validateDate(req.body.duedate);


        if (verification.verified == false)
        {
            res.statusCode = 401;
            res.json({ status: "NOT OK", msg: "Not authorized"});
        }

        else if (verification.id != req.body.person_id)
        {
           if (req.body.person_id == "" || req.body.person_id == null){
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "person_id cant be empty" });
        }

        else{
            res.statusCode = 401;
            res.json({ status: "NOT OK", msg: "Not authorized"});
        }

        }

        else
        {

        if (req.body.amount == "" || req.body.amount == null || req.body.amount <= 0)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "amount cant be empty or smaller than 0" });
        }

        else if (req.body.duedate == "" || req.body.duedate == null)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "duedate cant be empty" });
        }

        else if (validDuedate == false)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "invalid duedate" });
        }

        else if (await dateChecker.validDate(req.body.duedate) == false)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "duedate cant be from the past" });
        }

        else if (req.body.reservation_id == "" || req.body.reservation_id == null)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "reservation_id cant be empty" });
        }

        else if (req.body.cabin_id == "" || req.body.cabin_id == null)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "cabin_id cant be empty" });
        }

        else
        {

        try
        {

            let newBill = await billSQL.postBill(req.body.amount, req.body.duedate, req.body.reservation_id, req.body.person_id, req.body.cabin_id);

            if (newBill != null)
            {
              res.statusCode = 201;
              res.json({bill_id: newBill.insertId, amount: req.body.amount, duedate: req.body.duedate, reservation_id: req.body.reservation_id, person_id: req.body.person_id, cabin_id: req.body.cabin_id, paid: newBill.paid});

              let Bill = await billSQL.getBills(newBill.insertId, null, null, null);
            }
    }
  
        catch (error) {
           console.log(error);
           res.json({status : "NOT OK", msg : "Technical problem"});
       }
    }
}
      },

      getBills: async (req, res) => {

        let verification = await authenticationController.verify(req.headers.token);

        if (verification.verified == false)
        {
            res.statusCode = 401;
            res.json({ status: "NOT OK", msg: "Not authorized"});
        }

        else if (verification.id != req.query.person_id && verification.admin == false)
        {
            res.statusCode = 401;
            res.json({ status: "NOT OK", msg: "Not authorized"});
        } 

        else{

        try
        {
          let Bills = await billSQL.getBills(req.query.bill_id, req.query.reservation_id, req.query.person_id, req.query.cabin_id, req.query.paid);
        
           res.statusCode = 200;
           res.json({Bills});
         
        }
  
        catch (error) {
           console.log(error);
           res.json({status : "NOT OK", msg : "Technical problem"});
          }
        }
      },


      putBill: async (req, res) => {

        let verification = await authenticationController.verify(req.headers.token);

        let validDuedate = await dateChecker.validateDate(req.body.duedate);

        if (verification.verified == false || verification.admin == false)
        {
            res.statusCode = 401;
            res.json({ status: "NOT OK", msg: "Not authorized"});
        }

       else if (req.body.amount == "" || req.body.amount == null || req.body.amount <= 0)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "amount cant be empty or smaller than 0" });
        }

        else if (req.body.duedate == "" || req.body.duedate == null)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "duedate cant be empty" });
        }

        else if (validDuedate == false)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "invalid duedate" });
        }

        else if (await dateChecker.validDate(req.body.duedate) == false)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "duedate cant be from the past" });
        }

        else if (req.body.paid === "" || req.body.paid === null)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "paid cant be empty" });
        }

        else if (req.body.paid != 0 && req.body.paid != 1)
        {
            res.statusCode = 400;   
            res.json({ status: "NOT OK", msg: "paid must be 1 or 0"});
        }
 
        else{

        try
        {

            let sql = await billSQL.putBill(req.body.amount, req.body.duedate, req.body.paid, req.params.id);


            if (sql.affectedRows == 0)
            {
                res.statusCode = 404;
                res.json({ status: "NOT OK", msg: "Bill not found"});
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


      deleteBill: async (req, res) => {

        let verification = await authenticationController.verify(req.headers.token);
        
        if (verification.verified == false || verification.admin == false)
        {
            res.statusCode = 401;
            res.json({ status: "NOT OK", msg: "Not authorized"});
        }

           else
           {
            try{
                
          let sql = await billSQL.deleteBill(req.params.id);


        if (sql.affectedRows == 0)
        {
            res.statusCode = 404;
            res.json({ status: "NOT OK", msg: "Bill not found"});
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
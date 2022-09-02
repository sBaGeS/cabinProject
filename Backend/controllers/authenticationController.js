const jwt = require('jsonwebtoken');

const jwt_key = "RFpkr9oiyGOREzwn4PKd";

module.exports = {

verify: async (token) => {

let verification = ({
   verified: false,
   admin: false,
   id: null,
});

try 
{
    const decoded = jwt.verify(token, jwt_key);

    if (decoded.role == 1)
    {
       verification.admin = true;
    }

    verification.verified = true;
    verification.id = decoded.id;

    return verification;

} 

catch (error) 
{
  return verification;
}
}

}
module.exports = {

validDate: async (date) =>{

let currentDate = new Date();
let givenDate = new Date(date);

if (givenDate >= currentDate)
{
   return true;
}

else
{
   return false;
}

},

validateDate: async (date) =>{

   let givenDate = new Date(date);

   if (isNaN(givenDate.getTime())) 
   {  
      return false;
   } 
  else 
  { 
      return true;
  } 
}

}
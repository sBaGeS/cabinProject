// return the token from the session storage
export const getUser = () => {
  return sessionStorage.getItem('user_username') || null;
}
export const getUserId = () => {
  return sessionStorage.getItem('user_id') || null;
}
export const getToken = () => {
  checkTokenExp()
  return sessionStorage.getItem('token') || null;
}
export const getAdmin = () => {
  checkTokenExp()
  let admin = sessionStorage.getItem('user_role');
  
  if(admin == 1){
    return true;
  }
  else{
    return false;
  }
}
// remove the token and user from the session storage
export const removeUserSession = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user_id');
  sessionStorage.removeItem('user_username');
  sessionStorage.removeItem('user_role');
  sessionStorage.removeItem('token_exp');
}

// set the token and user from the session storage
export const setUserSession = (token) => {
  let user = parseJwt(token);
  console.log(user);
  sessionStorage.setItem('user_id', user.id);
  sessionStorage.setItem('user_username', user.username);
  sessionStorage.setItem('user_role', user.role);
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('token_exp', (new Date(user.exp * 1000)));
}
export const checkTokenExp = () => {
  let tokenExpTime = new Date(sessionStorage.getItem('token_exp'));
  let timeNow = new Date();
  
  if (timeNow > tokenExpTime) {
    removeUserSession();
  }
}

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

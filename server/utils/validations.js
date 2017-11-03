function testTitle(title){

  const re = /[\s]?[\w+\W+]{4,20}/;
  if(!title || !re.test(title))
    return false;

  return true;
}



function testEmail(email){
  email = email ? email.trim() : email;
  const re = /^[A-Za-z0-9._%-]{2,40}@[A-Za-z0-9.-]{2,20}.[A-Za-z]{2,10}$/
  if (!email || !re.test(email) ) {
    return false;
  }
  return true;
}

function testUsername(username){
  username = username ? username.trim() : username;
  const re = /^[\w+\d+]{2,20}$/
  if(!username || !re.test(username)){
    return false;
  }
  return true;
}

function testPhone(phone){
  phone = phone ? phone.trim() : phone;
  const re = /^[\d]{4,20}$/
  if(!phone || !re.test(phone)){
      return false;
  }
  return true;
}

function testPassword(password, cpassword, both = false){

  if(both){
    if(!password || password.length < 4 || password.length > 20 || 
      !cpassword || cpassword.length < 4 || cpassword.length > 20){
      return false;
    }

    if (password != cpassword){
      return false;
    }
  } else {
    if(!password || password.length < 4 || password.length > 20){
      return false;
    }
  }
  return true;
}

function isValidLoginData(data){

  if(!data){
    return "All fields are required!";
  }

  let {username, password} = data;

  if(!testUsername(username)){
    return "Username is invalid";
  }

  if(!testPassword(password)){
    return "Password must be between 4 and 20 characters in length";
  }

  return "";
}

function isValidRegData(data){

  if(!data){
    return "All fields are required!";
  }

  let { username, email, password, cpassword, phone } = data;

  if(!testUsername(username)){
    return "Username may be number or alphabet or both, between 2 and 20 in length";
  }

  if(!testEmail(email)){
    return "Email you entered is invalid\n e.g email@email.com";
  }

  if(!testPhone(phone)){
    return "Phone number must be digits only, between 4 and 20 in length";
  }

  if(!testPassword(password)){
    return "Password must be between 4 and 20 characters in length";
  }

  if (!testPassword(password, cpassword, true)) {
    return "Password must be between 4 and 20 characters in length and must match";
  }

  return "";
}

function isValidEmail(email){

  if(!testEmail(email)){
    return "Email you entered is invalid\n e.g email@email.com";
  }

  return "";
}

function isValidResetPwData(email, password, cpassword){

  if(!testEmail(email)){
    return "Email you entered is invalid\n e.g email@email.com";
  }

  if(!testPassword(password)){
    return "Password must be between 4 and 20 characters in length";
  }

  if (!testPassword(password, cpassword, true)) {
    return "Password must be between 4 and 20 characters in length and must match";
  }

  return "";
}

function isValidProfileData(data){

  if(!data){
    return "Make sure you provide valid data";
  }

  let { username, email, opassword, password, cpassword, phone, _username, _email, _phone } = data;

  if(username == _username && email == _email && phone == _phone && !password && !cpassword ) {
    return "You made no changes"
  }

  if(!testPassword(opassword)){
    return "Your password is required"
  }

  if(!testUsername(username)){
    return "Username may contain number or alphabet or both, between 2 and 20 in length";
  }

  if(!testEmail(email)){
    return "Email you entered is invalid\n e.g email@email.com";
  }

  if(!testPhone(phone)){
    return "Phone number must be digits only, between 4 and 20 in length";
  }

  if(password){
    if(!testPassword(password)){
      return "Password must be between 4 and 20 characters in length";
    }

    if (!testPassword(password, cpassword, true)) {
    return "Password must be between 4 and 20 characters in length and must match";
    }
  }

  return "";
}

module.exports = {isValidLoginData, isValidResetPwData, 
  isValidRegData, isValidEmail, isValidProfileData, testTitle};

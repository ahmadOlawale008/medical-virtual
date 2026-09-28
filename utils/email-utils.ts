export const validateEmail = (email:string) => {
  var validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (email.length > 0 && email.match(validRegex)) {
    return true;
  } else {
    return false;
  }
};

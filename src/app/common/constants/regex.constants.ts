export const passwordRegex =
/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
// /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W)[^\s]{8,}$/;

export const nameRegex = /^[a-z ,.'-]+$/i;

export const phoneRegex =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

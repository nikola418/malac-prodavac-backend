export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\W]{8,}$/;
// /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W)[^\s]{8,}$/;

export const nameRegex = /^[\p{L} ,.'-]+$/iu;

export const phoneRegex =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

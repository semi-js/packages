import { twoDigit } from "./strings";

//create a function that retuns date string
export function date() {
  //create current date
  const d = new Date();

  //create partial strings
  const year = twoDigit(d.getFullYear().toString());
  const month = twoDigit(d.getMonth().toString());
  const day = twoDigit(d.getDay().toString());

  //return message
  return `${year}-${month}-${day}`;
}

//create a function that retuns time string
export function time() {
  //create current date
  const d = new Date();

  //create partial strings
  const hour = twoDigit(d.getHours().toString());
  const minute = twoDigit(d.getMinutes().toString());
  const second = twoDigit(d.getSeconds().toString());

  //return message
  return `${hour}:${minute}:${second}`;
}

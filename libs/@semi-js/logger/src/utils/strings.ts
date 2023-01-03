//wrapper function for upper case
export function up(message: string): string {
  return message.toUpperCase();
}

//wrapper function for lower case
export function low(message: string): string {
  return message.toLowerCase();
}

//wrapper function for creating 2 digtit numbers
export function twoDigit(message: string) {
  return message.length === 1 ? `0${message}` : message;
}

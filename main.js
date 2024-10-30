const statement =
  'create table author (id number, name string, age number, city string, state string, country string)';

// console.log(statement);

let regexp = /\w+ (\w+) (\w+) \((.+)\)/;

let result = regexp.exec(statement);

let tableName = result[2];
let columns = result[3].split(', ');

console.log(tableName);
console.log(columns);

const statement =
  'create table author (id number, name string, age number, city string, state string, country string)';

let regexp = /\w+ \w+ (\w+) \((.+)\)/;

let parsedStatement = regexp.exec(statement);

let tableName = parsedStatement[1];
let columns = parsedStatement[2].split(', ');

const database = {
  tables: {
    [tableName]: {
      columns: {},
      data: []
    }
  }
};

/* Variação usando for loop normal */
// for (let i = 0; i < columns.length; i++) {
//   let values = columns[i].split(' ');
//   database.tables[tableName].columns[values[0]] = values[1];
// }

/* Variação usando for of */

for (let column of columns) {
  let key = column.split(' ')[0];
  let value = column.split(' ')[1];

  database.tables[tableName].columns[key] = value;
}

console.log(JSON.stringify(database, null, ' '));

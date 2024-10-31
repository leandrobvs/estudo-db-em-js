const database = {
  tables: {},

  createTable(statement) {
    let regexp = /\w+ \w+ (\w+) \((.+)\)/;
    let parsedStatement = regexp.exec(statement);

    let tableName = parsedStatement[1];
    let columns = parsedStatement[2].split(', ');

    this.tables[tableName] = {
      columns: {},
      data: []
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
      this.tables[tableName].columns[key] = value;
    }
  },

  execute(statement) {
    if (statement.startsWith('create')) {
      return this.createTable(statement);
    }
    if (statement.startsWith('delete')) {
      console.log('command not implemented yet');
    }
  }
};

database.execute(
  'create table author (id number, name string, age number, city string, state string, country string)'
);
database.execute('delete table author');
console.log(JSON.stringify(database, null, ' '));

const DatabaseError = function (statement, message) {
  this.command = statement.split(' ')[0];
  this.error = message;
};

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
  insert(statement) {
    let regexp = /\w+ \w+ (\w+) \((.+)\) \w+ \((.+)\)/;
    let parsedStatement = regexp.exec(statement);

    let tableName = parsedStatement[1];
    let columns = parsedStatement[2].split(', ');
    let values = parsedStatement[3].split(', ');

    let row = {};

    for (let i = 0; i < columns.length; i++) {
      row[columns[i]] = values[i];
    }

    this.tables[tableName].data.push(row);
  },

  execute(statement) {
    if (statement.startsWith('create')) {
      return this.createTable(statement);
    }
    if (statement.startsWith('insert')) {
      return this.insert(statement);
    } else {
      throw new DatabaseError(statement, 'Unknown Command');
    }
  }
};

try {
  database.execute(
    'create table author (id number, name string, age number, city string, state string, country string)'
  );
  database.execute('insert into author (id, name, age) values (1, Douglas Crockford, 62)');
  database.execute('insert into author (id, name, age) values (2, Linus Torvalds, 47)');
  database.execute('insert into author (id, name, age) values (3, Martin Fowler, 54)');
  console.log(JSON.stringify(database, null, ' '));
} catch (error) {
  console.log(error);
}

// 6. Insira o objeto em "data".

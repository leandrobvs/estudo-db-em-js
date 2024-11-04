const DatabaseError = function (statement, message) {
  this.command = statement.split(' ')[0];
  this.error = message;
};

const database = {
  tables: {},

  createTable(statement) {
    let regexp = /\w+ \w+ (\w+) \((.+)\)/;
    let parsedStatement = regexp.exec(statement);

    let [, tableName, columns] = parsedStatement;
    columns = columns.split(', ');

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
      column = column.split(' ');
      let [key, value] = column;
      this.tables[tableName].columns[key] = value;
    }
  },
  insert(statement) {
    let regexp = /\w+ \w+ (\w+) \((.+)\) \w+ \((.+)\)/;
    let parsedStatement = regexp.exec(statement);

    let [, tableName, columns, values] = parsedStatement;
    columns = columns.split(', ');
    values = values.split(', ');

    let row = {};
    for (let i = 0; i < columns.length; i++) {
      row[columns[i]] = values[i];
    }
    this.tables[tableName].data.push(row);
  },

  select(statement) {
    let regexp = /select (.+) from (\w+)(?: where (.+))?/;
    let parsedStatement = regexp.exec(statement);
    let [, columns, tableName, where] = parsedStatement;
    columns = columns.split(', ');

    let filterRow = this.tables[tableName].data;
    let finalResult = [];

    if (where) {
      let rowResult = {};
      [columnWhere, valueWhere] = where.split(' = ');
      const row = filterRow.filter(function (row) {
        return row[columnWhere] === valueWhere;
      });

      for (let i = 0; i < columns.length; i++) {
        rowResult[columns[i]] = row[0][columns[i]];
      }
      finalResult.push(rowResult);
    } else {
      filterRow.forEach(function (row) {
        let rowResult = {};
        for (let i = 0; i < columns.length; i++) {
          rowResult[columns[i]] = row[columns[i]];
        }
        finalResult.push(rowResult);
      });
    }

    return finalResult;
  },

  execute(statement) {
    if (statement.startsWith('create')) {
      return this.createTable(statement);
    }
    if (statement.startsWith('insert')) {
      return this.insert(statement);
    }
    if (statement.startsWith('select')) {
      return this.select(statement);
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
  console.log(database.execute('select name from author'));
  console.log(database.execute('select name, age from author where id = 2'));

  // console.log(JSON.stringify(database, null, ' '));
} catch (error) {
  console.log(error);
}

// 6. Insira o objeto em "data".

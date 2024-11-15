class DatabaseError {
  constructor(statement, message) {
    this.command = statement.split(' ')[0];
    this.error = message;
  }
}

class Parser {
  constructor() {
    this.commands = new Map();
    this.commands.set('createTable', /create \w+ (\w+) \((.+)\)/);
    this.commands.set('insert', /insert \w+ (\w+) \((.+)\) \w+ \((.+)\)/);
    this.commands.set('select', /select (.+) from (\w+)(?: where (.+))?/);
    this.commands.set('delete', /delete from (\w+)(?: where (.+))?/);
  }

  parse(statement) {
    for (let command of this.commands) {
      let parsedStatement = command[1].exec(statement);
      if (parsedStatement) {
        let endCommand = command[0];

        return {
          endCommand,
          parsedStatement,
        };
      }
    }
  }
}

class Database {
  constructor() {
    this.tables = {};
    this.parser = new Parser();
  }

  createTable(parsedStatement) {
    let [, tableName, columns] = parsedStatement;

    columns = columns.split(', ');

    this.tables[tableName] = {
      columns: {},
      data: [],
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
  }

  insert(parsedStatement) {
    let [, tableName, columns, values] = parsedStatement;
    columns = columns.split(', ');
    values = values.split(', ');

    let row = {};
    for (let i = 0; i < columns.length; i++) {
      row[columns[i]] = values[i];
    }
    this.tables[tableName].data.push(row);
  }

  select(parsedStatement) {
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
  }
  delete(parsedStatement) {
    let [, tableName, whereClause] = parsedStatement;

    let filterRow = this.tables[tableName].data;
    let finalResult = [];

    if (whereClause) {
      let [where, value] = whereClause.split(' = ');
      finalResult = filterRow.filter(function (rows) {
        return rows[where] !== value;
      });
      this.tables[tableName].data = finalResult;
    } else {
      this.tables[tableName].data = [];
    }
  }

  execute(statement) {
    const result = this.parser.parse(statement);

    if (result) {
      return this[result.endCommand](result.parsedStatement);
    } else {
      throw new DatabaseError(statement, 'Unknown Command');
    }
  }
}

let database = new Database();

try {
  database.execute(
    'create table author (id number, name string, age number, city string, state string, country string)'
  );
  database.execute('insert into author (id, name, age) values (1, Douglas Crockford, 62)');
  database.execute('insert into author (id, name, age) values (2, Linus Torvalds, 47)');
  database.execute('insert into author (id, name, age) values (3, Martin Fowler, 54)');
  // database.execute('delete from author where id = 1');
  console.log(database.execute('select name, age from author'));
  // console.log(database.execute('select name, age from author where id = 2'));

  // console.log(JSON.stringify(database, null, ' '));
} catch (error) {
  console.log(error);
}

// 6. Insira o objeto em "data".

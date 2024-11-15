import DatabaseError from './databaseError.mjs';
import Parser from './parser.mjs';

export default class Database {
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

export default class Parser {
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

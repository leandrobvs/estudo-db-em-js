export default class DatabaseError {
  constructor(statement, message) {
    this.command = statement.split(' ')[0];
    this.error = message;
  }
}

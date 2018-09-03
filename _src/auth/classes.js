export class User {
  constructor(email='', first_name='', last_name='', repr='') {
    this.email = email;
    this.first_name = first_name;
    this.last_name = last_name;
    this.repr = repr;
  }
}

export default {
  User
}

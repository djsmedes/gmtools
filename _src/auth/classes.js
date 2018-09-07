export class User {
  constructor({email='', first_name='', last_name='', requested=false}={}) {
    this.email = email;
    this.first_name = first_name;
    this.last_name = last_name;
    this.requested = requested;
  }

  get repr() {
    return this.first_name + ' ' + this.last_name + ' <' + this.email + '>'
  }

  get isAuthenticated() {
    return this.email.length > 0;
  }
}

export default {
  User
}

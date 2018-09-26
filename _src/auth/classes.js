export class User {
  constructor({
                uuid='',
                email='', first_name='', last_name='',
                requested=false,
                current_campaign='', all_campaigns=[]
  }={}) {
    this.uuid = uuid;
    this.email = email;
    this.first_name = first_name;
    this.last_name = last_name;
    this.requested = requested;
    this.current_campaign = current_campaign;
    this.all_campaigns = all_campaigns;
  }

  get repr() {
    return this.first_name + ' ' + this.last_name + ' <' + this.email + '>'
  }

  get isAuthenticated() {
    return this.email.length > 0;
  }

  static get modelName() { return 'user' }

  toJSON () {
    return {
      uuid: this.uuid,
      email: this.email,
      current_campaign: this.current_campaign
    }
  }
}

export default {
  User
}

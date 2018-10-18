import { ModelVuexModule } from "@/models/_baseModule";

export class User {
  static get modelName() {
    return "user";
  }

  constructor({
    uuid = null,
    email = "",
    first_name = "",
    last_name = "",
    current_campaign = ""
  } = {}) {
    this.uuid = uuid;
    this.email = email;
    this.first_name = first_name;
    this.last_name = last_name;
    this.current_campaign = current_campaign;
  }

  get name() {
    return this.first_name + " " + this.last_name;
  }

  toJSON() {
    return {
      uuid: this.uuid,
      email: this.email,
      current_campaign: this.current_campaign
    };
  }
}

class UserVuexModule extends ModelVuexModule {
  constructor() {
    super(User);
  }
}

export default {
  User,
  ...new UserVuexModule()
};

import { ModelVuexModule } from "@/models/_base_model";

export class User {
  static get modelName() {
    return "user";
  }

  constructor({
    uuid = "",
    email = "",
    first_name = "",
    last_name = "",
    current_campaign = "",
    campaigns = []
  } = {}) {
    this.uuid = uuid;
    this.email = email;
    this.first_name = first_name;
    this.last_name = last_name;
    this.current_campaign = current_campaign;
    this.campaigns = campaigns;
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

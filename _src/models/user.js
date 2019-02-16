import { Model } from "./_baseModel";
import { ModelVuexModule } from "@/models/_baseModule";

export class User extends Model {
  static get modelName() {
    return "user";
  }

  constructor({
    uuid = null,
    email = "",
    first_name = "",
    last_name = "",
    current_campaign = "",
  } = {}) {
    super();
    this.uuid = uuid;
    this.email = email;
    this.first_name = first_name;
    this.last_name = last_name;
    this.current_campaign = current_campaign;
  }

  get name() {
    return this.first_name + " " + this.last_name;
  }
}

class UserVuexModule extends ModelVuexModule {
  constructor() {
    super();
    this.modelClass = User;
  }
}

export default new UserVuexModule();

import { Model, Collection } from "./_baseVueMcClasses";

const modelName = "user";

export class User extends Model {
  static get modelName() {
    return modelName;
  }

  defaults() {
    return {
      uuid: null,
      email: "",
      first_name: "",
      last_name: "",
      current_campaign: "",
    };
  }

  get name() {
    return this.first_name + " " + this.last_name;
  }
}

export class UserList extends Collection {
  static get modelName() {
    return modelName;
  }

  options() {
    return {
      ...super.options(),
      model: User,
    };
  }
}

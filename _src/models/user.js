import { Model, Collection } from "./_baseVueMcClasses";
import store from "@/store";
import { authGetters } from "@/auth";

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

  get $name() {
    return this.$.first_name + " " + this.$.last_name;
  }

  get isAuthenticated() {
    return Boolean(this.email);
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

/**
 * SYNCHRONOUS call to get the currently logged in user
 *
 * @return {User}
 */
export function getAuthUser() {
  let uuid = store.getters[authGetters.AUTH_USER_UUID];
  let user = new User({ uuid });
  user.reset();
  return user;
}

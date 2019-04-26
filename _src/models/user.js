import { Model, Collection } from "./_baseVueMcClasses";
import store from "@/store";
import { stateKeys } from "@/auth/vuexKeys";

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
 * async call to get the currently logged in user and store it
 *   must be called before most of the application will work
 *
 * @return {Promise<User>}
 */
export async function getAuthUser() {
  let uuid = store.state[stateKeys.AUTH_USER];
  let user = new User({ uuid });
  if (uuid) await user.fetch();
  return user;
}

/**
 * SYNCHRONOUS call to get the currently logged in user
 *   will not work until getAuthUser has been called once, but that should happen
 *   when the app boots - prefer THIS function most of the time
 *
 * @return {User}
 */
export function authUser() {
  let uuid = store.state[stateKeys.AUTH_USER];
  let user = new User({ uuid });
  user.reset();
  return user;
}

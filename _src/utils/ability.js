import { Ability } from "@casl/ability";

export const ability = new Ability();

export const abilityPlugin = store => {
  ability.update(store.state.rules);

  return store.subscribeAction(action => {
    switch (action.type) {
      case "createSession":
        ability.update(action.payload.permissions);
        break;
      case "destroySession":
        ability.update([]);
        break;
    }
  });
};

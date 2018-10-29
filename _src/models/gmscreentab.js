import { ModelVuexModule } from "@/models/_baseModule";

export class GMScreenTab {
  static get modelName() {
    return "gmscreentab";
  }

  constructor({
    uuid = null,
    user = null,
    title = "",
    content = "",
    order = null
  } = {}) {
    this.uuid = uuid;
    this.user = user;
    this.title = title;
    this.content = content;
    this.order = order;
  }
}

class GMScreenTabVuexModule extends ModelVuexModule {
  constructor() {
    super(GMScreenTab);
    this.store.getters = {
      ...this.store.getters,
      [this.getterTypes.LIST]: (state, getters) => {
        return Object.values(getters[this.getterTypes.OBJECTS]).sort((a, b) => {
          if (a.order === b.order) return 0;
          if (a.order === null) return 1;
          if (b.order === null) return -1;
          return a.order - b.order;
        });
      }
    };
  }
}

export default {
  GMScreenTab,
  ...new GMScreenTabVuexModule()
};

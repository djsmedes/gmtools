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
  }
}

export default {
  GMScreenTab,
  ...new GMScreenTabVuexModule()
};

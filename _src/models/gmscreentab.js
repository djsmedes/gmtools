import { ModelVuexModule } from "@/models/_baseModule";

export class GMScreenTab {
  static get modelName() {
    return "gmscreentab";
  }

  constructor({ uuid = null, user = null, title = "", content = "" } = {}) {
    this.uuid = uuid;
    this.user = user;
    this.title = title;
    this.content = content;
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

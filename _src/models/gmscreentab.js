import { Model, Collection } from "./_baseVueMcClasses";

const modelName = "gmscreentab";

export class GMScreenTab extends Model {
  static get modelName() {
    return modelName;
  }

  defaults() {
    return {
      uuid: null,
      user: null,
      title: "",
      content: "",
      order: null,
    };
  }
}

export class GMScreenTabList extends Collection {
  static get modelName() {
    return modelName;
  }

  options() {
    return {
      ...super.options(),
      model: GMScreenTab,
    };
  }
}

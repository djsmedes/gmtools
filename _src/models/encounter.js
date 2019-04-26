import { Model, Collection } from "./_baseVueMcClasses";

const modelName = "encounter";

export class Encounter extends Model {
  static get modelName() {
    return modelName;
  }

  defaults() {
    return {
      uuid: null,
      name: "",
      campaign: "",
      completion_date: null,
    };
  }
}

export class EncounterList extends Collection {
  static get modelName() {
    return modelName;
  }

  options() {
    return {
      ...super.options(),
      model: Encounter,
    };
  }
}

import {
  Model as MCModel,
  Collection as MCCollection,
} from "@encamp/vue-mc/vue-mc.es";
import store from "@/store";
import { generateUrl2 as generateUrl } from "@/utils/urls";
import toPairs from "lodash/toPairs";
import fromPairs from "lodash/fromPairs";

export const mutateEmptyStringToNull = v => (v !== "" ? v : null);

export class DependentModel {
  constructor(module, listModel, fkField) {
    this.module = module;
    this.listModel = listModel;
    this.fkField = fkField;
  }
}

export class Model extends MCModel {
  static get modelName() {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line
      console.error("modelName not implemented");
    }
    return "";
  }

  get modelName() {
    return this.constructor.modelName;
  }

  options() {
    return {
      identifier: "uuid",
      patch: true,
      store,
    };
  }

  mutations() {
    return Object.keys(this.defaults()).reduce((memo, key) => {
      return { ...memo, [key]: [mutateEmptyStringToNull] };
    }, {});
  }

  routes() {
    return {
      fetch: generateUrl(this.modelName, this.uuid),
      delete: generateUrl(this.modelName, this.uuid),
    };
  }

  getSaveURL() {
    return this.uuid
      ? generateUrl(this.modelName, this.uuid)
      : generateUrl(this.modelName);
  }

  boot() {
    if (this.dependentModels().length) {
      this.on("storeRemove", context => {
        // cache here before we `await` because context.target will
        //   get wiped when this func relinquishes control
        let uuid = context.target.uuid;
        this.dependentModels().forEach(
          async ({ module, fkField, listModel }) => {
            let ListClass = (await module)[listModel];
            let list = new ListClass([], { storeFilter: { [fkField]: uuid } });
            list.replace(list.getCachedModels());
            list.models.forEach(model => model.storeRemove());
          }
        );
      });
    }
  }

  dependentModels() {
    return [];
  }
}

export class Collection extends MCCollection {
  static get modelName() {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line
      console.error("modelName not implemented");
    }
    return "";
  }

  get modelName() {
    return this.constructor.modelName;
  }

  options() {
    return {
      store,
    };
  }

  getFetchQuery() {
    let pairs = toPairs(this.getOption("storeFilter"));
    return fromPairs(
      pairs.map(pair => [pair[0], pair[1] === null ? "" : pair[1]])
    );
  }

  routes() {
    return {
      fetch: generateUrl(this.modelName),
    };
  }
}

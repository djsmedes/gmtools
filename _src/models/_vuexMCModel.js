import { Model } from "vue-mc/vue-mc.es";
import { getterTypes, mutationTypes } from "@/models/_constants";

export class VuexModel extends Model {
  static get modelName() {
    return "";
  }

  async vuex_fetch(store) {
    if (!this.uuid) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line
        console.warn(this.constructor.modelName + " tried to call fetch with no uuid.");
      }
    }

    let cached = store.getters[
      this.constructor.modelName + "/" + getterTypes.BY_ID
    ](this.uuid);

    if (cached === undefined) {
      let { response } = await this.fetch();
      store.commit(this.constructor.modelName + "/" + mutationTypes.SET, {
        object: response.data,
      });
      return response.data;
    } else {
      Object.keys(cached).map(key => {
        this.set(key, cached[key]);
      });
      // must also apply this new active state to the saved state
      this.sync();
      return cached;
    }
  }

  async vuex_save(store) {
    let { response } = await this.save();
    store.commit(this.constructor.modelName + "/" + mutationTypes.SET, {
      object: response.data,
    });
    return response.data;
  }

  async vuex_delete(store) {
    let uuid = this.uuid;
    await this.delete();
    store.commit(this.constructor.modelName + "/" + mutationTypes.REMOVE, {
      uuid,
    });
  }
}

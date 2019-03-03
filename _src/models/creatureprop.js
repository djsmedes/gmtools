import { Model } from "vue-mc/vue-mc.es";
import { generateUrl } from "@/utils/urls";
import { getterTypes, mutationTypes } from "@/models/_constants";
import { MCModule } from "@/models/_baseMCModule";
import { mutateEmptyStringToNull } from "@/models/_baseMCModule";

const modelName = "creatureprop";

const propTypes = {
  PROPERTY: 1,
  ACTION: 2,
  LEGENDARY_ACTION: 3,
  REACTION: 4,
};

const propTypeDisplay = Object.keys(propTypes).reduce((memo, curPropType) => {
  return {
    ...memo,
    [propTypes[curPropType]]: String(curPropType)
      .replace("_", " ")
      .toLowerCase(),
  };
}, {});

export const propTypeChoices = Object.keys(propTypeDisplay).map(key => ({
  value: Number(key),
  text:
    propTypeDisplay[key].charAt(0).toUpperCase() +
    propTypeDisplay[key].slice(1),
}));

const attackTypes = {
  MELEE_WEAPON_ATTACK: 1,
  RANGED_WEAPON_ATTACK: 2,
  MELEE_SPELL_ATTACK: 3,
  RANGED_SPELL_ATTACK: 4,
};

const attackTypeDisplay = Object.keys(attackTypes).reduce(
  (memo, curAttackType) => {
    return {
      ...memo,
      [attackTypes[curAttackType]]: String(curAttackType)
        .replace("_", " ")
        .toLowerCase(),
    };
  },
  {}
);

export const attackTypeChoices = Object.keys(attackTypeDisplay).map(key => ({
  value: Number(key),
  text:
    attackTypeDisplay[key].charAt(0).toUpperCase() +
    attackTypeDisplay[key].slice(1),
}));

export class CreatureProp extends Model {
  static get modelName() {
    return modelName;
  }

  options() {
    return {
      identifier: "uuid",
    };
  }

  defaults() {
    return {
      uuid: null,
      campaign: null,

      title: null,
      description: null,
      save_dc_override: null,
      save_source_ability: null,
      save_ability: null,
      prop_type: null,

      attack_type: null,
      uses_ability_mod: null,
      tohit_bonus_override: null,
      reach_range: null,
      range_second: null,
      num_targets: null,
      hit_num_damage_dice: null,
      hit_die_size: null,
      hit_damage_type: null,
      hit_extra_damage_dice: null,
      hit_extra_damage_die_size: null,
      hit_extra_damage_type: null,
    };
  }

  mutations() {
    return Object.keys(this.defaults()).reduce((memo, key) => {
      return { ...memo, [key]: mutateEmptyStringToNull };
    }, {});
  }

  get prop_type_display() {
    return propTypeDisplay[this.prop_type] || "";
  }

  get attack_type_display() {
    return attackTypeDisplay[this.attack_type] || "";
  }

  routes() {
    return {
      fetch: generateUrl([modelName, this.uuid]),
      delete: generateUrl([modelName, this.uuid]),
    };
  }

  getSaveURL() {
    return generateUrl([modelName, ...(this.uuid ? [this.uuid] : [])]);
  }

  getSaveMethod() {
    return this.uuid ? "PUT" : "POST";
  }

  async vuex_fetch(store) {
    if (!this.uuid) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line
        console.warn(modelName + " tried to call fetch with no uuid.");
      }
    }

    let cached = store.getters[modelName + "/" + getterTypes.BY_ID](this.uuid);

    if (cached === undefined) {
      let { response } = await this.fetch();
      store.commit(modelName + "/" + mutationTypes.SET, {
        object: response.data,
      });
    } else {
      Object.keys(cached).reduce((_, key) => {
        this.set(key, cached[key]);
      });
      // must also apply this new active state to the saved state
      this.sync();
    }
  }

  async vuex_save(store) {
    let { response } = await this.save();
    store.commit(modelName + "/" + mutationTypes.SET, {
      object: response.data,
    });
  }

  async vuex_delete(store) {
    let { response } = await this.delete();
    store.commit(modelName + "/" + mutationTypes.REMOVE, response.data);
  }
}

class CreaturePropModule extends MCModule {
  constructor() {
    super(modelName);
  }
}

export default new CreaturePropModule();

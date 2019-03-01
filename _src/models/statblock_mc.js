import { Model } from "vue-mc";
import { generateUrl } from "@/utils/urls";
import { mutationTypes } from "@/models/_constants";
import { MCModule } from "@/models/_baseMCModule";

// todo - put this somewhere more central and import it
const mutateEmptyStringToNull = v => (v !== "" ? v : null);

const modelName = "statblock";

export const size = {
  TINY: 1,
  SMALL: 2,
  MEDIUM: 3,
  LARGE: 4,
  HUGE: 5,
  GARGANTUAN: 6,
  COLOSSAL: 7,
};

const sizeDisplay = Object.keys(size).reduce((memo, curSize) => {
  return {
    ...memo,
    [size[curSize]]: String(curSize).toLowerCase(),
  };
}, {});

export const alignment = {
  UNALIGNED: 0,
  LAWFUL_GOOD: 1,
  NEUTRAL_GOOD: 2,
  CHAOTIC_GOOD: 3,
  LAWFUL_NEUTRAL: 4,
  NEUTRAL: 5,
  CHAOTIC_NEUTRAL: 6,
  LAWFUL_EVIL: 7,
  NEUTRAL_EVIL: 8,
  CHAOTIC_EVIL: 9,
};

const alignmentDisplay = Object.keys(alignment).reduce((memo, curAlignment) => {
  return {
    ...memo,
    [alignment[curAlignment]]: String(curAlignment)
      .replace("_", " ")
      .toLowerCase(),
  };
}, {});

export class Statblock extends Model {
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
      name: null,
      generic_name: null,
      proficiency: null,
      challenge: null,
      size: null,
      type: null,
      alignment: null,
      armor_class: null,
      armor_kind: null,
      hit_points: null,
      num_hit_die: 1,
      avg_hp: null,
      hit_die_size: 4,
      speed: null,
      str: 10,
      dex: 10,
      con: 10,
      int: 10,
      wis: 10,
      cha: 10,
      str_mod: 0,
      dex_mod: 0,
      con_mod: 0,
      int_mod: 0,
      wis_mod: 0,
      cha_mod: 0,
      saving_throws: null,
      skills: null,
      senses: null,
      damage_vulnerabilities: {},
      damage_resistances: {},
      damage_immunities: {},
      condition_immunities: {},
      languages: {},
    };
  }

  mutations() {
    return Object.keys(this.defaults()).reduce((memo, key) => {
      return { ...memo, [key]: mutateEmptyStringToNull };
    }, {});
  }

  get size_display() {
    return sizeDisplay[this.size] || "";
  }

  get alignment_display() {
    return alignmentDisplay[this.alignment] || "";
  }

  routes() {
    return {
      fetch: generateUrl([Statblock.modelName, this.uuid]),
      delete: generateUrl([Statblock.modelName, this.uuid]),
    };
  }

  getSaveURL() {
    return generateUrl([
      Statblock.modelName,
      ...(this.uuid ? [this.uuid] : []),
    ]);
  }

  getSaveMethod() {
    return this.uuid ? "PUT" : "POST";
  }

  async vuex_fetch(store) {
    let { response } = await this.fetch();
    store.commit(Statblock.modelName + "/" + mutationTypes.SET, {
      object: response.data,
    });
  }

  async vuex_save(store) {
    let { response } = await this.save();
    store.commit(Statblock.modelName + "/" + mutationTypes.SET, {
      object: response.data,
    });
  }

  async vuex_delete(store) {
    let { response } = await this.delete();
    store.commit(
      Statblock.modelName + "/" + mutationTypes.REMOVE,
      response.data
    );
  }
}

class StatblockModule extends MCModule {
  constructor() {
    super(modelName);
  }
}

export default new StatblockModule();

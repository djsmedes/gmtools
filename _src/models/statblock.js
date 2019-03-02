import { Model } from "vue-mc";
import { generateUrl } from "@/utils/urls";
import { getterTypes, mutationTypes } from "@/models/_constants";
import { MCModule } from "@/models/_baseMCModule";

// todo - put this somewhere more central and import it
const mutateEmptyStringToNull = v => (v !== "" ? v : null);

const modelName = "statblock";

const size = {
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

export const sizeChoices = Object.keys(sizeDisplay).map(key => ({
  value: Number(key),
  text: sizeDisplay[key].charAt(0).toUpperCase() + sizeDisplay[key].slice(1),
}));

const alignment = {
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

export const alignmentChoices = Object.keys(alignmentDisplay).map(key => ({
  value: Number(key),
  text:
    alignmentDisplay[key].charAt(0).toUpperCase() +
    alignmentDisplay[key].slice(1),
}));

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
      damage_vulnerabilities: [],
      damage_resistances: [],
      damage_immunities: [],
      condition_immunities: [],
      languages: [],
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
    if (!this.uuid) {
      if (process.env.NODE_ENV !== "production") {
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

export const damageTypes = [
  "bludgeoning",
  "piercing",
  "slashing",
  "bludgeoning, piercing, and slashing",
  "bludgeoning, piercing, and slashing from nonmagical attacks",
  "bludgeoning, piercing, and slashing from nonmagical attacks not made with silvered weapons",
  "fire",
  "cold",
  "acid",
  "lightning",
  "thunder",
  "poison",
  "psychic",
  "force",
  "radiant",
  "necrotic",
];

export const conditions = [
  "blinded",
  "charmed",
  "deafened",
  "frightened",
  "grappled",
  "incapacitated",
  "invisible",
  "paralyzed",
  "petrified",
  "poisoned",
  "prone",
  "restrained",
  "stunned",
  "unconscious",
];

export const languages = [
  "Common",
  "Dwarvish",
  "Elvish",
  "Giant",
  "Goblin",
  "Orc",
  "Gnomish",
  "Halfling",
  "Abyssal",
  "Celestial",
  "Infernal",
  "Draconic",
  "Sylvan",
  "Primordial",
  "Auran",
  "Aquan",
  "Ignan",
  "Terran",
  "Undercommon",
  "Deep Speech",
  "Druidic",
  "Thieve's Cant",
  "Telepathy",
  "Telepathy 30 ft.",
  "Telepathy 60 ft.",
  "Telepathy 120 ft.",
];

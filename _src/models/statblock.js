import { Model, Collection } from "@/models/_baseVueMcClasses";
import { average_roll } from "@/utils/dice";

const modelName = "statblock";

const abilityScore2Fullname = {
  str: "Strength",
  dex: "Dexterity",
  con: "Constitution",
  int: "Intelligence",
  wis: "Wisdom",
  cha: "Charisma",
};

export const abilityScores = Object.keys(abilityScore2Fullname);

export const abilityScoreChoices = Object.keys(abilityScore2Fullname).map(
  key => ({ value: key, text: abilityScore2Fullname[key] })
);

export const abilityScoreDisplay = abbr => abilityScore2Fullname[abbr] || "";

const size = {
  TINY: 1,
  SMALL: 2,
  MEDIUM: 3,
  LARGE: 4,
  HUGE: 5,
  GARGANTUAN: 6,
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

export const calculateModifier = score => Math.floor(((score || 0) - 10) / 2);

export class Statblock extends Model {
  static get modelName() {
    return modelName;
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
      speed: null,
      str: 10,
      dex: 10,
      con: 10,
      int: 10,
      wis: 10,
      cha: 10,
      saving_throws: null,
      skills: null,
      senses: null,
      damage_vulnerabilities: [],
      damage_resistances: [],
      damage_immunities: [],
      condition_immunities: [],
      languages: [],
      properties: [],
      actions: [],
      reactions: [],
      legendary_actions: [],
    };
  }

  get size_display() {
    return sizeDisplay[this.size] || "";
  }

  get alignment_display() {
    return alignmentDisplay[this.alignment] || "";
  }

  get hit_die_size() {
    return {
      1: 4,
      2: 6,
      3: 8,
      4: 10,
      5: 12,
      6: 20,
    }[this.size];
  }
  get avg_hp() {
    return Math.max(
      average_roll(
        this.hit_die_size,
        this.num_hit_die,
        this.num_hit_die * this.con_mod
      ),
      1
    );
  }

  get str_mod() {
    return calculateModifier(this.str);
  }
  get dex_mod() {
    return calculateModifier(this.dex);
  }
  get con_mod() {
    return calculateModifier(this.con);
  }
  get int_mod() {
    return calculateModifier(this.int);
  }
  get wis_mod() {
    return calculateModifier(this.wis);
  }
  get cha_mod() {
    return calculateModifier(this.cha);
  }
}

export class StatblockList extends Collection {
  static get modelName() {
    return modelName;
  }

  options() {
    return {
      ...super.options(),
      model: Statblock,
    };
  }
}

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

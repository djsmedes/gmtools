import { Model } from "./_baseModel";
import { CampaignDependentVuexModule } from "./_needsCampaignModule";

export class Statblock extends Model {
  static get modelName() {
    return "statblock";
  }

  constructor({
    uuid = null,
    campaign = "",
    name = "",
    generic_name = "",
    proficiency = null,
    challenge = null,
    size = null,
    type = null,
    alignment = null,
    armor_class = null,
    armor_kind = null,
    hit_points = null,
    num_hit_die = null,
    hit_die_size = null,
    speed = null,
    str = null,
    dex = null,
    con = null,
    int = null,
    wis = null,
    cha = null,
    str_mod = null,
    dex_mod = null,
    con_mod = null,
    int_mod = null,
    wis_mod = null,
    cha_mod = null,
    saving_throws = null,
    skills = null,
    senses = null,
    damage_vulnerabilities = null,
    damage_resistances = null,
    damage_immunities = null,
    condition_immunities = null,
    languages = null,
  } = {}) {
    super();
    this.uuid = uuid;
    this.campaign = campaign;
    this.name = name;
    this.generic_name = generic_name;
    this.proficiency = proficiency;
    this.challenge = challenge;
    this.size = size;
    this.type = type;
    this.alignment = alignment;
    this.armor_class = armor_class;
    this.armor_kind = armor_kind;
    this.hit_points = hit_points;
    this.num_hit_die = num_hit_die;
    this.hit_die_size = hit_die_size;
    this.speed = speed;
    this.str = str;
    this.dex = dex;
    this.con = con;
    this.int = int;
    this.wis = wis;
    this.cha = cha;
    this.str_mod = str_mod;
    this.dex_mod = dex_mod;
    this.con_mod = con_mod;
    this.int_mod = int_mod;
    this.wis_mod = wis_mod;
    this.cha_mod = cha_mod;
    this.saving_throws = saving_throws;
    this.skills = skills;
    this.senses = senses;

    this.damage_vulnerabilities = damage_vulnerabilities;
    this.damage_resistances = damage_resistances;
    this.damage_immunities = damage_immunities;
    this.condition_immunities = condition_immunities;
    this.languages = languages;
  }
}

class StatblockVuexModule extends CampaignDependentVuexModule {
  constructor() {
    super();
    this.modelClass = Statblock;
  }
}

export default new StatblockVuexModule();

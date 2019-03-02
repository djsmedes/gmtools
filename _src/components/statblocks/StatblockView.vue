<template>
  <v-layout column>
    <h3 class="headline">{{ value.name }}</h3>
    <h6 class="subheading">
      {{ value.size_display | capitalize }} {{ value.type }},
      {{ value.alignment_display }}
    </h6>
    <v-divider class="my-3"></v-divider>
    <v-flex>
      <strong>Armor Class</strong> {{ value.armor_class
      }}{{ value.armor_kind ? " (" + value.armor_kind + ")" : "" }}
      <br />
      <strong>Hit Points</strong> {{ hit_point_string }}
      <br />
      <strong>Speed</strong> {{ value.speed }}
    </v-flex>
    <v-divider class="my-3"></v-divider>
    <v-flex>
      <v-layout>
        <v-flex
          v-for="abl in ['str', 'dex', 'con', 'int', 'wis', 'cha']"
          :key="abl"
          xs2
          class="text-xs-center"
        >
          <strong class="text-capitalize">{{ abl }}</strong>
          <br />
          {{ value[abl] }} ({{
            value[abl + "_mod"] >= 0
              ? "+" + value[abl + "_mod"]
              : value[abl + "_mod"]
          }})
        </v-flex>
      </v-layout>
    </v-flex>
    <v-divider class="my-3"></v-divider>
    <v-flex>
      <template v-if="value.saving_throws">
        <strong>Saving Throws</strong> {{ value.saving_throws }}
        <br />
      </template>
      <template v-if="value.skills">
        <strong>Skills</strong> {{ value.skills }}
        <br />
      </template>
      <template
        v-if="
          value.damage_vulnerabilities && value.damage_vulnerabilities.length
        "
      >
        <strong>Damage Vulnerabilities</strong>
        {{ value.damage_vulnerabilities.join(", ") }}
        <br />
      </template>
      <template
        v-if="value.damage_resistances && value.damage_resistances.length"
      >
        <strong>Damage Resistances</strong>
        {{ value.damage_resistances.join(", ") }}
        <br />
      </template>
      <template
        v-if="value.damage_immunities && value.damage_immunities.length"
      >
        <strong>Damage Immunities</strong>
        {{ value.damage_immunities.join(", ") }}
        <br />
      </template>
      <template
        v-if="value.condition_immunities && value.condition_immunities.length"
      >
        <strong>Condition Immunities</strong>
        {{ value.condition_immunities.join(", ") }}
        <br />
      </template>
      <strong>Senses</strong> {{ value.senses }}
      <br />
      <strong>Languages</strong>
      {{
        value.languages && value.languages.length
          ? value.languages.join(", ")
          : "&mdash;"
      }}
      <br />
      <strong>Challenge</strong> {{ value.challenge }}
    </v-flex>
    <v-divider class="my-3"></v-divider>
  </v-layout>
</template>

<script>
import { Statblock } from "@/models/statblock";

export default {
  name: "StatblockView",
  props: {
    value: {
      type: Statblock,
      required: true,
    },
  },
  computed: {
    hit_point_string() {
      let con_contribution = this.value.con_mod * this.value.num_hit_die;
      let con_piece = "";
      if (con_contribution > 0) {
        con_piece = " + " + String(con_contribution);
      } else if (con_contribution < 0) {
        con_piece = " - " + String(Math.abs(con_contribution));
      }

      return (
        this.value.hit_points ||
        this.value.avg_hp +
          " (" +
          this.value.num_hit_die +
          "d" +
          this.value.hit_die_size +
          con_piece +
          ")"
      );
    },
  },
  filters: {
    capitalize(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
};
</script>

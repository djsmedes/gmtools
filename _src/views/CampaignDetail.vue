<template>
  <v-card>
    <v-card-title
      :class="{
        title: true,
        'grey--text': editMode,
        'pb-0': !isCurrentCampaign,
      }"
    >
      {{ campaign.name }}
    </v-card-title>
    <v-btn
      v-if="!isCurrentCampaign"
      flat
      small
      color="save"
      @click="$emit('set-active', uuid)"
    >
      Play this campaign
      <v-icon small right>call_made</v-icon>
    </v-btn>
    <v-card-text v-if="editMode">
      <v-text-field label="Name" v-model="campaign.name"></v-text-field>
    </v-card-text>
    <v-list v-else>
      <v-subheader>
        GMs
      </v-subheader>
      <v-list-tile v-for="user in gmList" :key="user._uid">
        <v-list-tile-content>
          <v-list-tile-title>
            {{ user.name }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider></v-divider>
      <v-subheader>
        Players
      </v-subheader>
      <v-list-tile v-for="user in playerList" :key="user._uid">
        <v-list-tile-content>
          <v-list-tile-title>
            {{ user.name }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider></v-divider>
    </v-list>
    <v-card-actions v-show="editMode">
      <v-tooltip top>
        <v-btn slot="activator" flat icon color="delete" @click="tryDelete">
          <v-icon>delete</v-icon>
        </v-btn>
        <span>Delete</span>
      </v-tooltip>
      <v-spacer></v-spacer>
      <v-tooltip top>
        <v-btn
          slot="activator"
          flat
          icon
          color="cancel"
          @click="editMode = false"
        >
          <v-icon>cancel</v-icon>
        </v-btn>
        <span>Cancel</span>
      </v-tooltip>
      <v-spacer></v-spacer>
      <v-tooltip top>
        <v-btn slot="activator" flat icon color="save" @click="save">
          <v-icon>save</v-icon>
        </v-btn>
        <span>Save</span>
      </v-tooltip>
    </v-card-actions>
    <v-card-actions v-show="!editMode">
      <v-tooltip top>
        <v-btn
          slot="activator"
          flat
          icon
          color="delete"
          @click="tryLeave"
          :disabled="disabled"
        >
          <v-icon>person_outline</v-icon>
        </v-btn>
        <span>Leave this campaign</span>
      </v-tooltip>
      <v-spacer></v-spacer>
      <v-tooltip top>
        <v-btn
          slot="activator"
          flat
          icon
          color="edit"
          @click="editMode = true"
          :disabled="disabled"
        >
          <v-icon>edit</v-icon>
        </v-btn>
        <span>Edit</span>
      </v-tooltip>
      <v-spacer></v-spacer>
      <v-tooltip top>
        <v-btn
          slot="activator"
          flat
          icon
          @click="invitePlayers"
          :disabled="disabled"
        >
          <v-icon>group_add</v-icon>
        </v-btn>
        <span>Invite players</span>
      </v-tooltip>
    </v-card-actions>
  </v-card>
</template>

<script>
import { Campaign, UserList } from "@/models";
import { ButtonOption } from "@/plugins/userChoiceDialog";
import InvitePlayers from "@/components/accountManage/InvitePlayers";
import axios from "axios/index";
import { generateUrl2 } from "@/utils/urls";
import { authUserMixin } from "@/mixins";

export default {
  name: "CampaignDetail",
  mixins: [authUserMixin],
  props: {
    campaign: {
      type: Campaign,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      users: new UserList(),
      editMode: false,
    };
  },
  computed: {
    gmList() {
      return this.users.models.filter(u =>
        this.campaign.gm_set.includes(u.uuid)
      );
    },
    playerList() {
      return this.users.models.filter(u =>
        this.campaign.player_set.includes(u.uuid)
      );
    },
    isCurrentCampaign() {
      return this.campaign.uuid === this.currentCampaign.uuid;
    },
  },
  watch: {
    editMode: {
      handler(isEditMode) {
        if (isEditMode) {
          this.$emit("focus");
        } else {
          this.$emit("blur");
        }
      },
    },
  },
  methods: {
    async tryDelete() {
      let choice = await this.$userChoice(
        "Confirm delete",
        `<p>Are you sure?</p>`,
        [
          new ButtonOption({
            returnVal: true,
            text: `Yes, delete ${this.campaign.name}`,
            attrs: { color: "delete" },
          }),
          new ButtonOption(),
        ]
      );
      if (choice) {
        await this.campaign.delete();
      }
    },
    async tryLeave() {
      let choice = await this.$userChoice(
        "Confirm leaving campaign",
        `<p>Are you sure you want to leave ${
          this.campaign.name
        }? You will need to be re-invited by a GM to rejoin it.</p>`,
        [
          new ButtonOption({
            returnVal: true,
            text: `Yes, leave ${this.campaign.name}`,
            attrs: { color: "delete" },
          }),
          new ButtonOption(),
        ]
      );
      if (choice) {
        await axios.post(
          generateUrl2(Campaign.modelName, this.campaign.uuid, "leave")
        );
      }
    },
    async save() {
      await this.campaign.save();
      this.editMode = false;
    },
    async invitePlayers() {
      if (
        await this.$dialog(InvitePlayers, { campaignUuid: this.campaign.uuid })
      ) {
        this.$showSnack("Invitations sent");
      }
    },
  },
  created() {
    this.users.fetch();
  },
};
</script>

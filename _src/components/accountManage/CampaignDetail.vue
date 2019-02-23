<template>
  <v-card>
    <v-card-title :class="{ title: true, 'grey--text': editMode }">
      {{ campaign.name }}
    </v-card-title>
    <v-card-text v-if="editMode">
      <v-text-field label="Name" v-model="localCampaign.name"></v-text-field>
      <v-select
        readonly
        label="GMs"
        multiple
        chips
        :items="localCampaign.gm_set.map(userUuid => getUser(userUuid))"
        item-text="name"
        item-value="uuid"
        v-model="localCampaign.gm_set"
      ></v-select>
      <v-select
        readonly
        label="Players"
        multiple
        chips
        :items="localCampaign.player_set.map(userUuid => getUser(userUuid))"
        item-text="name"
        item-value="uuid"
        v-model="localCampaign.player_set"
      ></v-select>
    </v-card-text>
    <v-list v-else>
      <v-subheader>
        GMs
      </v-subheader>
      <v-list-tile v-for="userUuid in campaign.gm_set" :key="userUuid">
        <v-list-tile-content>
          <v-list-tile-title>
            {{ getUser(userUuid).name }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider></v-divider>
      <v-subheader>
        Players
      </v-subheader>
      <v-list-tile v-for="userUuid in campaign.player_set" :key="userUuid">
        <v-list-tile-content>
          <v-list-tile-title>
            {{ getUser(userUuid).name }}
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
        <v-btn slot="activator" flat icon color="save" @click="() => {}">
          <v-icon>save</v-icon>
        </v-btn>
        <span>Save</span>
      </v-tooltip>
    </v-card-actions>
    <v-card-actions v-show="!editMode">
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
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import campaign, { Campaign } from "@/models/campaign";
import userModule from "@/models/user";
import { routeNames } from "@/router";

export default {
  name: "CampaignDetail",
  props: {
    uuid: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      localCampaign: new Campaign(),
      editMode: false,
    };
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
  computed: {
    campaign() {
      return this.getCampaign(this.uuid);
    },
    ...mapGetters(campaign.namespace, {
      getCampaign: campaign.getterTypes.BY_ID,
    }),
    ...mapGetters(userModule.namespace, {
      getUser: userModule.getterTypes.BY_ID,
    }),
  },
  methods: {
    ...mapActions(campaign.namespace, {
      loadCampaigns: campaign.actionTypes.LIST,
      deleteCampaign: campaign.actionTypes.DESTROY,
      updateCampaign: campaign.actionTypes.UPDATE,
      createCampaign: campaign.actionTypes.CREATE,
    }),
    ...mapActions(userModule.namespace, {
      loadUsers: userModule.actionTypes.LIST,
    }),
    async tryDelete() {
      alert("tryDelete");
      // await this.deleteCampaign(this.campaign.uuid);
    },
    async save() {
      await this.updateCampaign(this.localCampaign);
      this.reset();
    },
    async create() {
      let rObj = await this.createCampaign(this.localCampaign);
      this.$router.replace({
        name: routeNames.CAMPAIGN,
        params: { uuid: rObj.uuid },
      });
    },
    reset() {
      this.localCampaign = new Campaign(this.campaign);
    },
  },
  created() {
    this.loadCampaigns().then(() => {
      this.reset();
      if (this.$route.params.uuid && !this.campaign.uuid) {
        this.$router.replace({ name: routeNames.NOT_FOUND });
      }
    });
    this.loadUsers();
  },
};
</script>

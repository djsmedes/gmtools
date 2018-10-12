<template>
  <form @submit.prevent="doCreateCampaign" novalidate>
    <div class="form-group">
      <label for="name">Name</label>
      <input id="name" v-model="campaign.name" placeholder="Name" class="form-control"/>
    </div>
    <button type="submit" class="btn btn-primary">Create</button>
  </form>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import campaign from "@/models/campaign";
import auth from "@/auth";
import { routeNames } from "@/router";

export default {
  name: "CampaignCreate",
  data() {
    return {
      campaign: new campaign.Campaign()
    };
  },
  computed: {
    ...mapGetters(auth.namespace, {
      authUser: auth.getterTypes.AUTH_USER
    })
  },
  methods: {
    ...mapActions(campaign.namespace, {
      createCampaign: campaign.actionTypes.CREATE
    }),
    async doCreateCampaign() {
      await this.createCampaign(this.campaign);
      this.$router.push({ name: routeNames.CAMPAIGNS });
    }
  }
};
</script>

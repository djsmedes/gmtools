<template>
  <object-detail :title="campaign.name">
    <div class="card-body">
      <h5>GMs:</h5>
      <p v-for="userUuid in campaign.gm_set" :key="userUuid">
        {{ getUser(userUuid).name }}
      </p>
      <h5>Players:</h5>
      <p v-for="userUuid in campaign.player_set" :key="userUuid">
        {{ getUser(userUuid).name }}
      </p>
    </div>
  </object-detail>
</template>

<script>
import ObjectDetail from "@/components/generic/ObjectDetail";
import { mapGetters, mapActions } from "vuex";
import campaign from "@/models/campaign";
import userModule from "@/models/user";

export default {
  name: "CampaignDetail",
  components: { ObjectDetail },
  computed: {
    campaign() {
      return this.getCampaign(this.$route.params.uuid);
    },
    ...mapGetters(campaign.namespace, {
      getCampaign: campaign.getterTypes.BY_ID
    }),
    ...mapGetters(userModule.namespace, {
      getUser: userModule.getterTypes.BY_ID
    })
  },
  methods: {
    ...mapActions(campaign.namespace, {
      loadCampaigns: campaign.actionTypes.LIST
    }),
    ...mapActions(userModule.namespace, {
      loadUsers: userModule.actionTypes.LIST
    })
  },
  created() {
    this.loadCampaigns();
    this.loadUsers();
  }
};
</script>

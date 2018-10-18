<template>
  <object-list
      :detail-view-name="routeNames.CAMPAIGN"
      :create-view-name="routeNames.CAMPAIGN_CREATE"
      :object-list="campaigns">
  </object-list>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ObjectList from "@/components/generic/ObjectList";
import { routeNames } from "@/router";
import campaign from "@/models/campaign";

export default {
  name: "CampaignList",
  components: { ObjectList },
  data() {
    return {
      routeNames
    };
  },
  computed: {
    ...mapGetters(campaign.namespace, {
      campaigns: campaign.getterTypes.LIST
    })
  },
  methods: {
    ...mapActions(campaign.namespace, {
      loadCampaigns: campaign.actionTypes.LIST
    })
  },
  created() {
    this.loadCampaigns();
  }
};
</script>

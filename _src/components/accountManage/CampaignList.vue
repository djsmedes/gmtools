<template>
  <v-expand-transition mode="out-in">
    <v-container v-if="campaigns.length" grid-list-xl>
      <v-data-iterator
        :items="campaigns"
        content-tag="v-layout"
        row
        wrap
        hide-actions
      >
        <v-flex slot="item" slot-scope="props" xs12 md6 lg4>
          <campaign-detail
            :uuid="props.item.uuid"
            @focus="campaignUnderEdit = props.item.uuid"
            @blur="
              campaignUnderEdit =
                campaignUnderEdit === props.item.uuid ? null : campaignUnderEdit
            "
            :disabled="
              campaignUnderEdit && campaignUnderEdit !== props.item.uuid
            "
          ></campaign-detail>
        </v-flex>
      </v-data-iterator>
    </v-container>
  </v-expand-transition>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { routeNames } from "@/router";
import campaign from "@/models/campaign";
import CampaignDetail from "@/components/accountManage/CampaignDetail";

export default {
  name: "CampaignList",
  components: { CampaignDetail },
  data() {
    return {
      routeNames,
      campaignUnderEdit: null,
    };
  },
  computed: {
    ...mapGetters(campaign.namespace, {
      campaigns: campaign.getterTypes.LIST,
    }),
  },
  methods: {
    ...mapActions(campaign.namespace, {
      loadCampaigns: campaign.actionTypes.LIST,
    }),
  },
  created() {
    this.loadCampaigns();
  },
};
</script>

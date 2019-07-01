import { mapGetters } from "vuex";
import { getterTypes } from "@/auth/vuexKeys";
import { authModuleName } from "@/auth";

export const authUserMixin = {
  computed: {
    ...mapGetters(authModuleName, {
      authUser: getterTypes.AUTH_USER,
      currentCampaign: getterTypes.CURRENT_CAMPAIGN,
    }),
  },
};

import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

// dnd red: #E40712

const baseColors = {
  primary: "#5A84CC",
  secondary: "#424242",
  accent: "#82B1FF",

  success: "#4CAF50",
  error: "#FF5252",
  info: "#2196F3",
  warning: "#FFC107",

  edit: "#1976D2",
  save: "#1976D2",
  go: "#1976D2",
  cancel: "#424242",
  delete: "#FF5252",
};

export const vuetify = new Vuetify({
  theme: {
    dark: false,
    themes: {
      light: {
        ...baseColors,
      },
      dark: {
        ...baseColors,
      },
    },
  },
});

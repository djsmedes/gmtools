<template>
  <v-card>
    <v-toolbar dark color="secondary" dense flat>
      <v-toolbar-title>
        {{ windows[activeWindow].title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        v-for="(window, index) in windows"
        :key="index"
        :input-value="activeWindow === index"
        icon
        text
        @click="activeWindow = index"
      >
        <v-icon v-text="window.icon"></v-icon>
      </v-btn>
    </v-toolbar>
    <v-window :value="activeWindow">
      <v-window-item>
        <gm-screen></gm-screen>
      </v-window-item>
      <v-window-item>
        <slot name="music">
          <spotify-controller></spotify-controller>
        </slot>
      </v-window-item>
      <v-window-item>
        <slot name="settings"></slot>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script>
import GMScreen from "@/components/controlCenter/GMScreen";
import SpotifyController from "@/components/controlCenter/SpotifyController";

export default {
  name: "CombatControlCenter",
  components: { SpotifyController, "gm-screen": GMScreen },
  data() {
    return {
      activeWindow: 0,
      windows: [
        { title: "Screen", icon: "info" },
        { title: "Music", icon: "music_note" },
        { title: "Settings", icon: "settings" },
      ],
    };
  },
};
</script>

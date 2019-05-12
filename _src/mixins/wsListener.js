export const wsMessageMixin = {
  data() {
    return {
      listenersToTearDown: [],
    };
  },
  created() {
    this.listenersToTearDown.push(
      this.$ws.addMessageListener(this.onWsMessage)
    );
  },
  beforeDestroy() {
    this.listenersToTearDown.forEach(teardownFunc => teardownFunc());
  },
  methods: {
    onWsMessage(message) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line
        console.trace("onWsMessage not implemented")
      }
    },
  },
};

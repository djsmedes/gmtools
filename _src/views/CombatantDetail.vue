<template>
  <p>
    {{ uuid }}
  </p>
</template>

<script>
  export default {
    name: "CombatantDetail",
    computed: {
      uuid() {
        return this.$route.params.uuid
      }
    }
  }
</script>

<style scoped>

</style>

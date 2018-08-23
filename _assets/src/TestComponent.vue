<template>
  some text in template
  <slot>slot default text</slot>
</template>

<script>
  export default {
    data() {
      return {
        message: 'Hello world'
      }
    }
  }
</script>
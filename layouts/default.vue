<template>
  <div>
    <navbar/>
    <Nuxt/>
  </div>
</template>
<script>
import navbar from "../components/navbar";

export default {
  components: {navbar},
  created() {
  },
}
</script>

<style lang="scss" scoped>
.bottom-padding {
  padding-top: 120px;
}
</style>

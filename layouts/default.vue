<template>
  <div>
    <navbar/>
    <Nuxt class="margin-top bottom-padding"/>
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
  padding-bottom: 120px;
}
.margin-top {
  margin-top: 60px;
}
</style>

<template>
  <div>
    <navbar/>

    <b-container>
      <b-row class="pt-3">
        <Nuxt/>
      </b-row>

      <div class="bottom-padding">
      </div>
    </b-container>

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

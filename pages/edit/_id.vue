<template>
  <b-container>
    <b-row>
      <b-col offset-md="1" md="10" cols="12" class=" my-3">
        <h1>Uredi predmet</h1>
        <CreateEditItem :id="id"/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>

export default {
  name: "edit.vue",
  computed: {
    id() {
      return this.$route.params.id;
    }
  },
}
</script>

<style scoped>
</style>

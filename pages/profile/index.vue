<template>
  <b-container>
    <b-row>
      <b-col offset-md="3" md="6" cols="12" class="my-3">
        <template v-if="user">
          <h1>Tvoj profil</h1>

          <div class="mt-3"><b>Uporabniško ime:</b> {{ user.username }}</div>
          <div class="mt-1"><b>Email:</b> {{ user.email }}</div>
          <div class="mt-1"><b>Vloga</b>: {{ user.role }}</div>

          <ChangePass type="int" class="mt-3"/>
        </template>

      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "profile",
  computed: {
    ...mapGetters({
      user: 'user/getUser',
    }),
  },
}
</script>

<style scoped>

</style>

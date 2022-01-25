<template>
  <b-navbar toggleable type="dark" variant="dark">
    <nuxt-link class="navbar-brand" href="/" :to="`/`">Špajza</nuxt-link>
    <nuxt-link v-if="isAdmin"  class="nav-item nav-link link" :to="`/add`">Dodaj</nuxt-link>
    <div class="mr-auto"></div>

    <b-navbar-toggle v-if="user" target="navbar-toggle-collapse">
      <template #default="{ expanded }">
        <div v-if="user" class="link-color float-left mr-2">
          {{ user.username }}
        </div>
        <div class="float-right">
          <b-icon v-if="expanded" icon="chevron-bar-up"></b-icon>
          <b-icon v-else icon="chevron-bar-down"></b-icon>
        </div>
      </template>
    </b-navbar-toggle>

    <b-collapse v-if="user" id="navbar-toggle-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <nuxt-link v-if="isAdmin" class="nav-item nav-link link" :to="`/tags`">Značke</nuxt-link>
        <nuxt-link v-if="isAdmin" class="nav-item nav-link link" :to="`/categories`">Kategorije</nuxt-link>
        <nuxt-link v-if="isAdmin" class="nav-item nav-link link" :to="`/import`">Uvozi</nuxt-link>
        <a class="nav-item nav-link link" @click="logout">Odjava</a>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { BIcon, BIconChevronBarDown, BIconChevronBarUp } from 'bootstrap-vue'
import {mapActions, mapGetters} from "vuex";

export default {
  name: "navbar",
  components: {
    BIcon,
    BIconChevronBarDown,
    BIconChevronBarUp
  },
  async mounted() {
    await this.$store.dispatch('user/fetchUser', localStorage.getItem('userId'));
  },
  computed: {
    ...mapGetters({
      user: 'user/getUser',
      isAdmin: 'user/isAdmin',
      isApproved: 'user/isApproved',
      isNormalUser: 'user/isNormalUser',
    }),
    ...mapActions(['user/unsetUser', 'user/fetchUser'])
  },
  methods: {
    async logout() {
      localStorage.removeItem('jwt');
      localStorage.removeItem('userId');
      await this.$store.dispatch('user/unsetUser');
      await this.$router.replace('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
.coin-amount-icon {
  vertical-align: bottom;
  font-size: 28px !important;
  color: goldenrod;
}
.coin-amount {
  font-weight: 600;
  font-size: 18px !important;
}
.link {
  color: #c7c7c7;
  //margin-right: auto;
  margin-left: 12px;
}
.link:hover {
  color: #808080;
}
.link-color {
  line-height: 20px;
  font-size: 16px;
  color: #c7c7c7;
}
</style>

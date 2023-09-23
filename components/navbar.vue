<template>
  <b-navbar toggleable type="dark" variant="dark" class="fixed-top">
    <nuxt-link class="navbar-brand py-0" href="/" :to="`/`">
      <div class="d-flex justify-content-center align-content-center">
        <b-img src="/icon.png" style="height: 40px; width: auto;"></b-img>
        <div class="ml-3" style="line-height: 2.25rem">Špajza</div>
      </div>
    </nuxt-link>
    <div class="mr-auto"></div>

    <b-dropdown v-if="user" id="dropdown-1" right class="">
      <template #button-content>
        <span class="mr-2">Meni</span>
      </template>
      <b-dropdown-item v-if="isApproved" class="text-body" :to="`/wishlist`">
        Seznam želja
      </b-dropdown-item>
      <b-dropdown-divider></b-dropdown-divider>
      <b-dropdown-item v-if="isAdmin || isKeeper"  class="text-body" :to="`/admin/add`">
        Dodaj
      </b-dropdown-item>
      <b-dropdown-item v-if="isAdmin || isKeeper" class="text-body" :to="`/admin/import`">
        Uvozi
      </b-dropdown-item>
      <b-dropdown-divider></b-dropdown-divider>
      <b-dropdown-item v-if="isAdmin" class="text-body" :to="`/admin/tags`">
        Značke
      </b-dropdown-item>
      <b-dropdown-item v-if="isAdmin" class="text-body" :to="`/admin/categories`">
        Kategorije
      </b-dropdown-item>
      <b-dropdown-item v-if="isAdmin" class="text-body" :to="`/admin/templates`">
        Predloge slik kategorij
      </b-dropdown-item>
      <b-dropdown-item v-if="isAdmin" class="text-body" :to="`/admin/users`">
        Uporabniki
      </b-dropdown-item>
      <b-dropdown-divider></b-dropdown-divider>
      <b-dropdown-item class="text-body" :to="`/profile`">
        Profil
      </b-dropdown-item>
      <b-dropdown-item @click="logout">
        Odjava
      </b-dropdown-item>
    </b-dropdown>


    <div v-if="user" class="ml-4">
      <b-avatar variant="light">{{ user.username[0].toUpperCase() }}</b-avatar>
    </div>


    <b-collapse v-if="user" id="navbar-toggle-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
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
    if (localStorage.getItem('userId')) {
      await this.fetchUser(localStorage.getItem('userId'))
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/getUser',
      isAdmin: 'user/isAdmin',
      isKeeper: 'user/isKeeper',
      isApproved: 'user/isApproved',
      isNormalUser: 'user/isNormalUser',
    }),
  },
  methods: {
    ...mapActions({
      unsetUser: 'user/unsetUser',
      fetchUser: 'user/fetchUser'
    }),
    async logout() {
      localStorage.removeItem('jwt');
      localStorage.removeItem('userId');
      await this.unsetUser();
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

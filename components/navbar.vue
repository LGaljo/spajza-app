<template>
  <b-navbar toggleable type="dark" variant="dark">
    <nuxt-link class="navbar-brand" href="/" :to="`/`">Špajza</nuxt-link>
    <nuxt-link class="nav-item nav-link link" :to="`/add`">Dodaj</nuxt-link>
    <div class="mr-auto"></div>

    <b-navbar-toggle target="navbar-toggle-collapse">
      <template #default="{ expanded }">
        <b-icon v-if="expanded" icon="chevron-bar-up"></b-icon>
        <b-icon v-else icon="chevron-bar-down"></b-icon>
      </template>
    </b-navbar-toggle>

    <b-collapse id="navbar-toggle-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <nuxt-link class="nav-item nav-link link" :to="`/tags`">Značke</nuxt-link>
        <nuxt-link class="nav-item nav-link link" :to="`/categories`">Kategorije</nuxt-link>
        <nuxt-link class="nav-item nav-link link" :to="`/import`">Uvozi</nuxt-link>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { BIcon, BIconChevronBarDown, BIconChevronBarUp } from 'bootstrap-vue'

export default {
  name: "navbar",
  components: {
    BIcon,
    BIconChevronBarDown,
    BIconChevronBarUp
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
</style>

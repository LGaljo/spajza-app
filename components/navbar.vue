<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <nuxt-link class="navbar-brand" href="/" :to="`/`">Špajza</nuxt-link>
        <nuxt-link class="nav-item nav-link link" :to="`/add`">Dodaj</nuxt-link>
        <nuxt-link class="nav-item nav-link link" :to="`/import`">Uvozi</nuxt-link>
        <div class="mr-auto"></div>
      </div>
    </nav>

  </div>
</template>

<script>
export default {
  name: "navbar"
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

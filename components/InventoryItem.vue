<template>
  <tr>
    <th scope="row">{{ item._id }}</th>
    <td>{{ item.name }}</td>
    <td>{{ item.count }}</td>
    <td>{{ item.status }}</td>
    <td><span v-for="tag of item.tags" class="badge badge-secondary m-1">{{ tag.name }}</span></td>
  </tr>
</template>

<script>

export default {
  name: "InventoryItem",
  components: {
  },
  props: {
    item: Object,
  },
  data() {
    return {
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style scoped>

</style>

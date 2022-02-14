<template>
  <b-container>
    <b-row>
      <b-col offset-md="3" md="6" cols="12" class="my-3">
        <h5 class="text-center mb-4">Seznam želja</h5>
        <b-card class="my-2">
          <div class="d-inline-flex w-100">
            <b-input
              v-model="newItem"
              @keydown.enter.prevent="addItem"
            />
            <b-button
              class="ml-2"
              :disabled="!newItem"
              @click.prevent.stop="addItem"
            >
              Dodaj
            </b-button>
          </div>
        </b-card>
        <draggable v-model="items" v-bind="dragOptions" group="people" @start="drag=true" @end="drag=false" @change="onChange">
          <transition-group>
            <b-card v-for="item of items" :key="item._id" class="my-2 cursor-pointer">
              <b-card-text>{{ item.order }}. {{ item.name }}</b-card-text>
            </b-card>
          </transition-group>
        </draggable>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable,
  },
  data() {
    return {
      newItem: null,
      drag: null,
    }
  },
  computed: {
    items: {
      get() {
        return this.$store.state.wishlist.items
      },
      set(value) {
        this.$store.commit('wishlist/set', value)
      }
    },
    dragOptions() {
      return {
        animation: 0,
        group: "description",
        ghostClass: "ghost"
      };
    },
  },
  async created() {
    await this.$store.dispatch('wishlist/fetch')
  },
  methods: {
    async addItem() {
      await this.$store.dispatch('wishlist/addItem', this.newItem)
      this.newItem = null;
    },
    onChange(event) {
      console.log(event)
      console.log(this.items)
      // TODO update list
    }
  }
}
</script>

<style scoped>
.ghost {
  opacity: 0.5;
  background: #efefef;
}
</style>

<template>
  <b-card
    no-body
    class="overflow-hidden cursor-pointer fake-button-card"
    @click="openDetails(item)"
  >
    <b-row no-gutters>
      <b-col cols="3">
        <b-card-img-lazy src="~/assets/images/nopicture.png" alt="Image" class="rounded-0"/>
        <div class="position-absolute ml-2 mt-2 inv-number" style="top: 0; left: 0">
          #{{item.code}}
        </div>
      </b-col>
      <b-col cols="9">
        <b-card-body class="p-2 p-md-3">
          <b-card-text>
            <div class="d-flex flex-column">
              <div class="d-flex justify-content-between">
                <div>
                  <h4>{{ item.name }}</h4>
                </div>
                <div>
                  <b-badge v-if="item.status" :variant="getVariantForStatus(item.status)" class="p-2">{{ getNameForStatus(item.status) }}</b-badge>
                </div>
              </div>
              <div v-if="item.tags" class="">
                <b-badge v-for="tag of item.tags" variant="secondary" :key="tag._id" class="mr-1 p-1">{{ tag.name }}</b-badge>
              </div>
              <div v-if="item.description">
                <span>{{ item.description }}</span>
              </div>
              <div v-if="item.location">
                <b>Lokacija:</b>
                <span>{{ item.location }}</span>
              </div>
            </div>
          </b-card-text>
        </b-card-body>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import status from "@/mixins/status";
import datetime from "@/mixins/datetime";

export default {
  name: "ItemCard",
  props: {
    item: {
      type: Object,
      required: true,
    }
  },
  mixins: [status, datetime],
  methods: {
    async openDetails(item) {
      await this.$router.push(`/item/${item._id}`)
    },
  }
}
</script>

<style scoped>
.inv-number {
  font-size: 20px;
  color: white;
  text-shadow: 0 0 8px black;
}
</style>

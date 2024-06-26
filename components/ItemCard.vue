<template>
  <b-card
    no-body
    class="overflow-hidden"
  >
    <b-row no-gutters class="h-100">
      <b-col cols="3">
        <div class="h-100 w-100">
          <div class="d-flex justify-content-start align-items-center h-100">
            <b-card-img-lazy :src="itemCover" alt="Image" class="rounded-0"/>
          </div>
          <div class="position-absolute ml-2 mt-2 inv-number" style="top: 0; left: 0">
            #{{item.code}}
          </div>
        </div>
      </b-col>
      <b-col cols="9">
        <b-card-body class="p-2 p-md-3">
          <b-card-text>
            <div class="d-flex flex-column">
              <div class="d-flex justify-content-between">
                <div>
                  <span class="item-name">{{ item.name }}</span>
                </div>
                <div>
                  <b-badge v-if="item.status" :variant="getVariantForStatus(item.status)" class="item-status">{{ getNameForStatus(item.status) }}</b-badge>
                </div>
              </div>
              <div v-if="item.tags">
                <b-badge v-for="tag of item.tags" variant="secondary" :key="tag._id" class="mr-1 p-1">{{ tag.name }}</b-badge>
              </div>
              <div
                class="d-flex flex-row justify-content-between mt-1"
              >
                <div class="w-100">
                  <div>
                    <b-badge v-if="item.status && item.category" variant="primary" class="item-status">{{ item.category.name }}</b-badge>
                  </div>
                  <div class="details">
                    <div v-if="item.count > 1">
                      <b>Število:</b>
                      <span>{{ item.count }}</span>
                    </div>
                    <div v-if="item.location">
                      <b>Lokacija:</b>
                      <span>{{ item.location }}</span>
                    </div>
                    <div v-if="item.description">
                      <span>{{ item.description }}</span>
                    </div>

                  </div>
                </div>
                <div v-if="item.status !== 'BORROWED'">
                  <b-button @click.stop.prevent="openDialog" class="item-button">Izposodi</b-button>
                </div>
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
    },
  },
  mixins: [status, datetime],
  computed: {
    itemCover() {
      return this.item?.cover?.length ? this.item?.cover[0]?.Location : process.env.NO_IMAGE
    },
  },
  methods: {
    openDialog() {
      this.$emit('rent')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../node_modules/bootstrap/scss/functions';
@import '../node_modules/bootstrap/scss/variables';
@import '../node_modules/bootstrap/scss/mixins';

@include media-breakpoint-up(md) {
  .details {
    display: block;
  }
}

@include media-breakpoint-down(sm) {
  .details {
    display: none;
  }
}

@include media-breakpoint-up(xs) {
  .card-img {
    height: auto !important;
    max-height: 90.25px !important;
    width: 100% !important;
    max-width: 90.25px !important;
  }

  .size {
    height: 90.25px;
  }

  .item-name {
    font-size: 16px;
    font-weight: 500;
  }

  .item-status {
    padding: 4px 8px;
  }

  .item-button {
    line-height: 10px;
    padding: 8px;
  }
}

@include media-breakpoint-up(lg) {
  .card-img {
    height: auto !important;
    max-height: 192px !important;
    width: 100% !important;
    max-width: 192px !important;
  }

  .size {
    height: 192px;
  }

  .item-name {
    font-size: 22px;
    font-weight: 500;
  }

  .item-status {
    padding: 8px;
  }
}

.inv-number {
  font-size: 20px;
  color: white;
  text-shadow: 0 0 8px black;
}

</style>

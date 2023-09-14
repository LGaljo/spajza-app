<template>
  <div class="modal-fullscr">
    <b-card>
      <template #header>
        <div class="d-flex w-100 flex-wrap justify-content-start">
          <b-button
            variant="primary"
            v-if="!value.rents"
            @click.prevent.stop="rentItem"
          >
            Izposodi
          </b-button>

          <div class="mx-2">
            <b-button
              variant="warning"
              v-if="isTent"
              :disabled="!(isAdmin || isKeeper)"
              @click.prevent.stop="$refs.faultsDialog.open();"
            >
              Pomanjkljivosti
            </b-button>
          </div>

          <b-dropdown v-if="isAdmin || isKeeper" text="Dejanja" class="ml-auto" right>
            <b-dropdown-item :to="`/edit/${$route.params.id}`">Uredi</b-dropdown-item>
            <b-dropdown-item href="#" @click.prevent.stop="deleteItem">Izbriši</b-dropdown-item>
          </b-dropdown>
        </div>
      </template>
      <b-card-body class="p-0">
        <b-badge v-if="value.category" variant="primary" class="p-2 mb-2">{{ value.category.name }}</b-badge>
        <b-card-title>
          {{ value.name }}
        </b-card-title>

        <b-badge v-if="value.status" :variant="getVariantForStatus(value.status)" class="my-1">{{ getNameForStatus(value.status) }}</b-badge>
        <b-badge v-if="value.extras && value.extras.faults" :variant="'danger'" class="my-1">Šotor z defekti</b-badge>

        <b-card-img-lazy :src="itemCover" alt="Image" class="rounded-0 mt-1"/>

        <div v-if="value.description" class="mb-4">
          <span>{{ value.description }}</span>
        </div>
        <div v-if="value.tags.length" class="my-2">
          <b>Značke:</b>
          <b-badge v-for="tag of value.tags" variant="secondary" :key="tag._id" class="m-1">{{ tag.name }}</b-badge>
        </div>
        <div v-if="value.boughtTime" class="my-2">
          <b>Čas pridobitve:</b>
          <span>{{ formatDateTime(value.boughtTime) }}</span>
        </div>
        <div v-if="value.count" class="my-2">
          <b>Količina:</b>
          <span>{{ value.count }}</span>
        </div>
        <div v-if="value.location" class="my-2">
          <b>Lokacija:</b>
          <span>{{ value.location }}</span>
        </div>
        <div v-if="value.owner" class="my-2">
          <b>Lastnik:</b>
          <span>{{ value.owner }}</span>
        </div>
      </b-card-body>
    </b-card>

    <ModalDialog
      v-if="isTent"
      ref="faultsDialog"
      :title="`Uredi pomankljivosti`"
      :action="'Shrani'"
      @first="updateItem"
      :size="'xl'"
    >
      <div slot="body">
        <b-row>
          <b-col cols="12" md="12" lg="7" class="ml-0 pl-0">
            <div class="m-0 p-0">
              <div v-if="value.extras && value.extras.faults" :key="counter">
                <div
                  v-for="marker in value.extras.faults" class="marker"
                  :key="marker.key"
                  :style="{ 'top': relativeMarker(marker).top + 'px', 'left': relativeMarker(marker).left + 'px' }"
                  v-b-popover.hover.top="marker.text"
                />
                <div
                  v-if="nMarker.top && nMarker.left"
                  class="marker-tmp"
                  :style="{ 'top': relativeMarker(nMarker).top + 'px', 'left': relativeMarker(nMarker).left + 'px' }"
                />
                </div>
              <b-img
                ref="image"
                src="~/assets/images/TabornikServis.png"
                class="h-auto w-100"
                @click="setFault"
                @input="setFault"
                @load="counter++"
              ></b-img>
            </div>
          </b-col>
          <b-col cols="12" md="12" lg="5"
           v-if="value.extras && value.extras.faults"
           class=""
          >
            <div
              v-for="marker in value.extras.faults"
              :key="marker.key"
              class="bg-info m-2 p-2 rounded text-white"
            >
              <div class="d-flex align-content-center justify-content-between">
                <div class="d-flex flex-column">
                  <div>{{ formatDate(marker.date) }}</div>
                  <div>{{ marker.text }}</div>
                </div>
                <div>
                <span
                  class="material-icons icon-button cursor-pointer"
                  @click="removeMarker(marker)"
                >
                  close
                </span>
                </div>
              </div>
            </div>
          </b-col>
        </b-row>
      </div>
    </ModalDialog>
    <ModalDialog
      v-if="isTent"
      ref="markerDialog"
      title="Opiši defekt"
      :action="'Shrani'"
      @first="saveMarker">
        <div slot="body">
          <b-input ref="descInput" v-model="nMarker.text" placeholder="Besedilo" autofocus></b-input>
        </div>
    </ModalDialog>
  </div>
</template>

<script>
import status from "~/mixins/status";
import {mapGetters} from "vuex";
import datetime from "~/mixins/datetime";
import ModalDialog from "./modals/ModalDialog";
import {DateTime} from "luxon";

export default {
  name: "ItemCard",
  mixins: [status, datetime],
  components: { ModalDialog },
  props: {
    value: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  data() {
    return {
      counter: 0,
      nMarker: {
        top: 0,
        left: 0,
        text: '',
        date: DateTime.now(),
        key: 0,
      },
    }
  },
  mounted() {
    window.addEventListener('resize', () => this.counter++);
  },
  computed: {
    ...mapGetters({
      isAdmin: 'user/isAdmin',
      isKeeper: 'user/isKeeper',
      isNormalUser: 'user/isNormalUser',
    }),
    itemCover() {
      return this.value.cover ? this.value.cover.Location : 'https://spajza-bucket.s3.eu-central-1.amazonaws.com/item/nopicture.png'
    },
    isTent() {
      return this.value?.categoryId === process.env.TENT_ID
    }
  },
  methods: {
    deleteItem() {
      this.$emit('delete')
    },
    rentItem() {
      this.$emit('onRentItem')
    },
    setFault(event) {
      const similar = this.value?.extras?.faults?.find((m) => m.top === event.offsetY + 11 && m.left === event.offsetX + 11)
      if (!similar) {
        this.nMarker.top = (event.offsetY - 8) / this.$refs.image.offsetHeight
        this.nMarker.left = (event.offsetX - 8) / this.$refs.image.offsetWidth
        this.nMarker.date = DateTime.now();
        this.nMarker.key = crypto.randomUUID();
        this.$refs.markerDialog.open();
        this.counter++;
      }
    },
    saveMarker() {
      const item = { ...this.value }
      if (!item.hasOwnProperty('extras')) {
        item.extras = { faults: [] };
      }
      item.extras.faults.push(this.nMarker);
      this.$emit('input', item)
      this.nMarker = {
        top: 0,
        left: 0,
        text: '',
        date: DateTime.now(),
        key: 0,
      };
    },
    removeMarker(event) {
      const item = { ...this.value }
      const idx = item?.extras?.faults.findIndex((m) => m.key === event.key);
      item?.extras?.faults.splice(idx, 1);
      this.$emit('input', item)
    },
    updateItem() {
      this.$emit('updateItem')
    },
    relativeMarker(marker) {
      return {
        top: marker.top * this.$refs.image?.offsetHeight,
        left: marker.left * this.$refs.image?.offsetWidth,
      }
    }
  }
}
</script>

<style scoped>
.marker {
  position: absolute;
  width: 16px;
  height: 16px;
  background-color: red;
  border-radius: 50%;
}

.marker-tmp {
  position: absolute;
  width: 16px;
  height: 16px;
  background-color: greenyellow;
  border-radius: 50%;
}
</style>

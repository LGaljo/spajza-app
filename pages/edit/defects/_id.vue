<template>
  <b-container>
    <b-row>
      <b-col cols="12" md="12" lg="10" class="ml-0 pl-0">
        <div class="m-0 p-0">
          <div v-if="item?.extras?.defects && category?.templateImage?.Location" :key="counter">
            <div
              v-for="marker in item.extras.defects" class="marker"
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
            :src="category?.templateImage?.Location"
            class="h-auto w-100"
            @click="setFault"
            @input="setFault"
            @load="counter++"
          ></b-img>
        </div>
      </b-col>

      <b-col cols="12" md="12" lg="2" v-if="item?.extras?.defects">
        <div
          v-for="marker in item.extras.defects"
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

    <ModalDialog
      ref="markerDialog"
      title="Opiši defekt"
      :action="'Shrani'"
      @first="saveMarker"
      @close="hideNMarker"
    >
      <div slot="body">
        <b-input ref="descInput" v-model="nMarker.text" placeholder="Besedilo" autofocus></b-input>
      </div>
    </ModalDialog>

  </b-container>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import status from "../../../mixins/status";
import datetime from "../../../mixins/datetime";
import ModalDialog from "~/components/modals/ModalDialog.vue";
import {v4 as uuidv4} from 'uuid';
import {DateTime} from "luxon";

export default {
  name: "item",
  mixins: [status, datetime],
  components: {
    ModalDialog
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
  async mounted() {
    await this.fetchItem(this.$route.params.id)
    await this.fetchCategory(this.item?.category?._id)
    window.addEventListener('resize', () => this.counter++);
  },
  computed: {
    ...mapGetters({
      item: 'item/get',
      user: 'user/getUser',
      category: 'categories/getOne',
    }),
  },
  methods: {
    ...mapActions({
      fetchItem: 'item/fetch',
      fetchCategory: 'categories/fetchOne',
      updateItem: 'item/update',
      addDefect: 'item/addDefect',
      removeDefect: "item/removeDefect"
    }),
    setFault(event) {
      const similar = this.item?.extras?.defects?.find((m) => m.top === event.offsetY + 11 && m.left === event.offsetX + 11)
      if (!similar) {
        this.nMarker.top = (event.offsetY - 8) / this.$refs.image.offsetHeight
        this.nMarker.left = (event.offsetX - 8) / this.$refs.image.offsetWidth
        this.nMarker.date = DateTime.now();
        this.nMarker.key = uuidv4();

        this.$refs.markerDialog.open();
        this.counter++;
      }
    },
    async saveMarker() {
      await this.addDefect(this.nMarker)
      this.hideNMarker()
    },
    hideNMarker() {
      this.nMarker = {
        top: 0,
        left: 0,
        text: '',
        date: DateTime.now(),
        key: 0,
      };
    },
    async removeMarker(marker) {
      await this.removeDefect(marker.key)
    },
    relativeMarker(marker) {
      return {
        top: marker.top * this.$refs.image?.offsetHeight,
        left: marker.left * this.$refs.image?.offsetWidth,
      }
    },
  }
}
</script>

<style lang="scss" scoped>
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

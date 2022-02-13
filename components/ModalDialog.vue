<template>
  <b-modal ref="dialog" :title="title">
    <div :slot="'default'">
      <slot name="body"></slot>
    </div>
    <div :slot="'modal-footer'">
      <b-button
        variant="success"
        @click="onFirst"
      >
        {{ action }}
      </b-button>
      <b-button
        v-if="secAction"
        @click="onSecond"
      >
        {{ secAction }}
      </b-button>
      <b-button
        @click="close"
      >
        Zapri
      </b-button>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: "ModalDialog",
  props: {
    title: {
      type: String,
      required: true
    },
    action: {
      type: String,
      required: true
    },
    secAction: {
      type: String,
    },
  },
  methods: {
    open() {
      this.$refs.dialog.show()
    },
    close() {
      this.$refs.dialog.hide()
    },
    onFirst() {
      this.$emit('first')
      this.close()
    },
    onSecond() {
      this.$emit('second')
      this.close()
    }
  }
}
</script>

<style scoped>

</style>

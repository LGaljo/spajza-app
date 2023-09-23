<template>
  <b-modal ref="dialog" :title="title" :size="size" @hidden="$emit('close')">
    <div :slot="'default'">
      <slot name="body"></slot>
    </div>
    <div :slot="'modal-footer'">
      <b-button
        v-if="action"
        variant="success"
        @click="onFirst"
        :disabled="disableAction"
      >
        {{ action }}
      </b-button>
      <b-button
        v-if="secAction"
        @click="onSecond"
        :disabled="disableSecAction"
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
    },
    disableAction: {
      type: Boolean,
      default: false,
    },
    secAction: {
      type: String,
    },
    disableSecAction: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
    }
  },
  methods: {
    open() {
      this.$refs.dialog.show()
    },
    close() {
      this.$refs.dialog.hide()
      this.$emit('close')
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

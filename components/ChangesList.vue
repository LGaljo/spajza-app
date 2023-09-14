<template>
  <b-card no-body class="mt-3 mb-1">
    <b-card-header header-tag="header" class="p-0" role="tab">
      <b-button block v-b-toggle.accordion-2 variant="outline" class="py-3">Spremembe</b-button>
    </b-card-header>
    <!-- Changes -->
    <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
      <b-card-body>
        <b-card-text>
          <div
            v-if="changes.length !== 0"
            v-for="(change, key) of changes"
            :key="change.id"
            :class="['d-flex', 'flex-column', 'py-3', { 'border-bottom': key !== changes.length - 1}]"
          >
            <div class="d-flex justify-content-between mb-2">
              <b-badge variant="dark" class="p-2">{{ formatDateTime(change._createdAt) }}</b-badge>
              <span v-if="change.user">Avtor: <b>{{ change.user.username }}</b></span>
            </div>
            <div
              v-if="change.changes"
              v-for="(field, key) of change.changes"
              class="my-1"
            >
              <div v-if="field.type === 'changed'">Spremenjeno polje: <b>{{ getFieldName(field.key) }}</b></div>
              <div v-else-if="field.type === 'added'">Dodano polje: <b>{{ getFieldName(field.key) }}</b></div>
              <div v-else-if="field.type === 'removed'">Odstranjeno polje: <b>{{ getFieldName(field.key) }}</b></div>
              <div v-if="field.valueBefore">Pretekla vrednost: <b>{{ field.valueBefore }}</b></div>
              <div v-if="field.valueNow">Nova vrednost: <b>{{ field.valueNow }}</b></div>
            </div>
          </div>
          <div v-if="changes.length === 0" class="text-center">
            <b>Ni sprememb</b>
          </div>
        </b-card-text>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
import datetime from "../mixins/datetime";
import items from "../mixins/items";

export default {
  name: "ChangesList",
  mixins: [datetime, items],
  props: {
    changes: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>

</style>

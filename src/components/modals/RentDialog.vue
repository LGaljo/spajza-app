<script setup lang="ts">
import { computed, ref } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useItemStore } from '~/stores/item.store'

type RentForm = {
  returnTime: string
  renter: 'me' | 'other'
  subject: string
}

const itemStore = useItemStore()
const item = ref<any>(null)
const dialogRef = ref<HTMLDialogElement | null>(null)

const minDate = computed(() => new Date().toISOString().split('T')[0])

const defaultReturnDate = () => {
  const date = new Date()
  date.setDate(date.getDate() + 14)
  return date.toISOString().split('T')[0]
}

const { errors, handleSubmit, defineField, resetForm } = useForm({
  validationSchema: yup.object({
    returnTime: yup.string().required(),
    renter: yup.string().required(),
    subject: yup.string().when('renter', {
      is: 'other',
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.optional(),
    }),
  }),
  initialValues: {
    returnTime: defaultReturnDate(),
    renter: 'me',
    subject: '',
  },
})

const [returnTime, returnTimeAttrs] = defineField('returnTime')
const [renter, renterAttrs] = defineField('renter')
const [subject, subjectAttrs] = defineField('subject')

const onSubmit = handleSubmit(async (values) => {
  if (!item.value?._id) return
  await itemStore.rent(item.value._id, {
    returnTime: values.returnTime,
    renter: values.renter,
    subject: values.renter === 'other' ? values.subject : null,
  })
  close()
})

const open = (selectedItem: any) => {
  item.value = selectedItem
  dialogRef.value?.showModal()
}

const close = () => {
  resetForm()
  dialogRef.value?.close()
}

defineExpose({ open, close })
</script>

<template>
  <dialog ref="dialogRef" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">Izposodi</h3>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Kdaj boš vrnil {{ item?.name }}?</span>
          </label>
          <input
            v-model="returnTime"
            v-bind="returnTimeAttrs"
            type="date"
            class="input input-bordered"
            :min="minDate"
          />
          <div v-if="errors.returnTime" class="badge badge-error mt-2">{{ errors.returnTime }}</div>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Izposojam:</span>
          </label>
          <div class="flex gap-4">
            <label class="label cursor-pointer gap-2">
              <input type="radio" value="me" v-model="renter" v-bind="renterAttrs" class="radio" />
              <span class="label-text">Zase</span>
            </label>
            <label class="label cursor-pointer gap-2">
              <input type="radio" value="other" v-model="renter" v-bind="renterAttrs" class="radio" />
              <span class="label-text">Za drugega</span>
            </label>
          </div>
          <div v-if="errors.renter" class="badge badge-error mt-2">{{ errors.renter }}</div>
        </div>

        <div v-if="renter === 'other'" class="form-control">
          <label class="label">
            <span class="label-text">Komu?</span>
          </label>
          <input v-model="subject" v-bind="subjectAttrs" type="text" class="input input-bordered" />
          <div v-if="errors.subject" class="badge badge-error mt-2">{{ errors.subject }}</div>
        </div>

        <div class="flex justify-end gap-2">
          <button class="btn btn-primary" type="submit">Izposodi si</button>
          <button class="btn btn-ghost" type="button" @click="close">Zapri</button>
        </div>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="close">close</button>
    </form>
  </dialog>
</template>

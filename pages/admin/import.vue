<template>
  <b-container>
    <b-row>
      <b-col offset-md="1" md="10" cols="12" class=" my-3">
        <h2>Uvozi predmete iz datoteke</h2>
        <b-form-file
          v-model="file"
          accept=".xlsx"
          :state="Boolean(file)"
          placeholder="Izberi ali odloži datoteko..."
          drop-placeholder="Odloži tukaj..."
          browse-text="Prebrskaj"
          class="mt-2"
        ></b-form-file>

        <b-button
          variant="secondary"
          @click="parseItems"
          :disabled="!file || loading"
          class="mt-2"
        >
          <b-spinner v-if="loading" small></b-spinner>
          Preberi
        </b-button>
        <b-button
          variant="secondary"
          @click="importItems"
          :disabled="items > 0 || validationFail !== 0"
          class="mt-2"
        >
          <b-spinner v-if="loading" small></b-spinner>
          {{ loading ? 'Uvažam...' : 'Uvozi' }}
        </b-button>

        <div class="mt-4">
          <b>Napak pri branju: {{ validationFail }}. Pred uvozom popravi napake.</b>
        </div>
        <b-table striped hover :items="items" class="mt-4"></b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import readXlsxFile from "read-excel-file";

export default {
  name: "import",
  data() {
    return {
      file: null,
      loading: false,
      validationFail: 0,
      items: []
    }
  },
  methods: {
    async parseItems() {
      this.validationFail = 0
      this.items = []

      try {
        const rows = await readXlsxFile(this.file)
        this.loading = true;

        rows.shift()

        for (const row of rows) {
          if (row[0] &&
            row[1]
          ) {
            const item = {
              name: row[0],
              categoryName: row[1],
              count: Number(row[2] || null),
            }
            item["description"] = row[3] || null
            item["location"] = row[4] || null
            item["owner"] = row[5] || null
            item["tagNames"] = row[6] ? row[6].split(',') : null

            this.items.push(item)
          } else {
            this.validationFail += 1
          }
        }

        if (this.validationFail === 0) {
          this.$toast.success("Predmeti uspešno dodani", {duration: 3000})
        } else {
          this.$toast.success("Predmeti uspešno dodani, neustreznih: " + this.validationFail, {duration: 6000})
        }
      } catch (e) {
        console.error(e)
        this.$toast.error("Prišlo je do napake pri uvažanju", {duration: 3000})
      }

      this.file = null
      this.loading = false
    },
    async importItems() {
      await this.$axios.$post('/inventory/multi', this.items)
    }
  },
}
</script>

<style scoped>

</style>

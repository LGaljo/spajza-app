<template>
  <div class="w-100 mt-4">
      <b-row>
        <b-col class="col-12 offset-md-3 col-md-6">
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
            @click="importItems"
            :disabled="!file || loading"
            class="mt-2"
          >
            <b-spinner v-if="loading" small></b-spinner>
            {{ loading ? 'Uvažam...' : 'Uvozi' }}
          </b-button>
        </b-col>
      </b-row>
  </div>
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
    }
  },
  methods: {
    async importItems() {

      try {
        const rows = await readXlsxFile(this.file)
        this.loading = true;

        rows.shift()

        for (const row of rows) {
          if (row[0] &&
            row[1] && Number(row[2])
          ) {
            const item = {
              name: row[0],
              categoryName: row[1],
              count: row[2],
            }
            item["description"] = row[3] || null
            item["location"] = row[4] || null
            item["owner"] = row[5] || null
            item["tagNames"] = row[6] ? row[6].split(',') : null

            await this.createItem(item)
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
    async createItem(item) {
      await this.$axios.$post('/inventory', item)
    }
  },
}
</script>

<style scoped>

</style>

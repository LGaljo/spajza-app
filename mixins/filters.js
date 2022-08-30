export default {
  data() {
    return {
      selected: {
        categories: null,
        tags: [],
        statuses: [],
      },
      filters: {
        categories: {
          key: 'categories',
          name: 'Kategorije',
          values: [],
          nameKey: 'name',
          valueKey: '_id',
          visible: false,
          type: 'single',
        },
        tags: {
          key: 'tags',
          name: 'Značke',
          values: [],
          nameKey: 'name',
          valueKey: '_id',
          visible: false,
          type: 'multiple'
        },
        statuses: {
          key: 'statuses',
          name: 'Status',
          values: [
            {
              text: "Novo",
              value: "NEW"
            },
            {
              text: "Izposojeno",
              value: "BORROWED"
            },
            {
              text: "Na voljo",
              value: "STORED"
            },
            {
              text: "Odpisano",
              value: "WRITTEN_OFF"
            },
          ],
          nameKey: 'text',
          valueKey: 'value',
          visible: false,
          type: 'multiple'
        },
      },
      params: {
        search: null,
        skip: 0,
        limit: 15,
      }
    }
  },
  async created() {
    await this.init()
  },
  computed: {
    isClear() {
      return !!((this.selected?.categories || this.selected?.tags?.length || this.selected?.statuses?.length));
    }
  },
  methods: {
    async init() {
      this.$axios.$get(`/categories`)
        .then(res => {
          this.filters.categories.values = res
        })
        .catch(res => {
          console.error(res)
        })
      this.$axios.$get(`/tags`)
        .then(res => {
          this.filters.tags.values = res
        })
        .catch(res => {
          console.error(res)
        })
    },
    async fetch() {
      try {
        const params = {
          category: this.selected.categories,
          tags: this.selected.tags,
          statuses: this.selected.statuses,
          search: this.params.search,
          skip: this.params.skip,
          limit: this.params.limit,
        };
        const response = await this.$axios.$get(`/inventory`, {
          params
        })
        console.log(response)

        if (response.length > 0) {
          this.params.skip += this.params.limit
          await this.$store.commit('items/append', response)
          return response.length
        } else {
          return 0;
        }
      } catch (e) {
        console.error(e)
      }

      return 0;
    },
    unset() {
      this.selected.categories = null;
      this.selected.tags = [];
      this.selected.statuses = [];
    },
    async clear_items() {
      await this.$store.commit('items/set', [])
      this.params.limit = 15;
      this.params.skip = 0;
      console.log('clear items')
    }
  }
}

export default {
  data() {
    return {
      fields: [
        {
          field: 'name',
          name: 'Ime'
        },
        {
          field: '_createdAt',
          name: 'Ime'
        },
        {
          field: 'code',
          name: 'Inv. št.'
        },
        {
          field: 'owner',
          name: 'Lastnik'
        },
        {
          field: 'location',
          name: 'Mesto'
        },
        {
          field: 'count',
          name: 'Število'
        },
        {
          field: 'tags',
          name: 'Značke'
        },
        {
          field: 'description',
          name: 'Opis'
        },
        {
          field: 'borrower',
          name: 'Opis'
        },
        {
          field: 'retired',
          name: 'Odpisan'
        },
        {
          field: 'status',
          name: 'Status'
        },
        {
          field: 'category',
          name: 'Kategorija'
        },
        {
          field: 'boughtTime',
          name: 'Čas pridobitve'
        },
        {
          field: 'file',
          name: 'Slika'
        },
        {
          field: 'cover',
          name: 'Slika'
        },
        {
          field: 'rents',
          name: 'Izposoja'
        },
        {
          field: 'renter',
          name: 'Izposojevalec'
        },
      ]
    }
  },
  methods: {
    getFieldName(field) {
      return this.fields.find(f => f.field === field).name
    },
  }
}

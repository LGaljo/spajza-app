export default {
  methods: {
    getVariantForStatus(status) {
      switch(status) {
        case 'NEW':
          return 'info'
        case 'BORROWED':
          return 'warning'
        case 'WRITTEN_OFF':
          return 'secondary'
        case 'STORED':
          return 'success'
      }
    },
    getNameForStatus(status) {
      switch(status) {
        case 'NEW':
          return 'Novo'
        case 'BORROWED':
          return 'Izposojeno'
        case 'WRITTEN_OFF':
          return 'Odpisano'
        case 'STORED':
          return 'Na voljo'
      }
    },
  }
}

export default {
  data() {
    return {
      statuses: [
        {
          text: "Novo",
          value: "new"
        },
        {
          text: "Izposojeno",
          value: "borrowed"
        },
        {
          text: "Na voljo",
          value: "stored"
        },
        {
          text: "Odpisano",
          value: "writtenoff"
        },
      ],
    }
  },
  methods: {
    getVariantForStatus(status) {
      switch(status) {
        case 'new':
          return 'info'
        case 'borrowed':
          return 'warning'
        case 'writtenoff':
          return 'secondary'
        case 'stored':
          return 'success'
      }
    },
    getNameForStatus(status) {
      switch(status) {
        case 'new':
          return 'Novo'
        case 'borrowed':
          return 'Izposojeno'
        case 'writtenoff':
          return 'Odpisano'
        case 'stored':
          return 'Na voljo'
      }
    },
  }
}

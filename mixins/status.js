export default {
  data() {
    return {
      statuses: [
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
    }
  },
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

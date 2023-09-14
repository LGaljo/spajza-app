export default {
  data() {
    return {
      roles: [
        {
          text: "Administrator",
          value: "ADMIN"
        },
        {
          text: "Uporabnik",
          value: "USER"
        },
        {
          text: "Gospodar",
          value: "KEEPER"
        },
        {
          text: "Nepotrjen",
          value: "UNAPPROVED"
        },
      ],
    }
  },
  methods: {
    getVariantForRole(role) {
      switch(role) {
        case 'ADMIN':
          return 'warning'
        case 'USER':
          return 'info'
        case 'KEEPER':
          return 'success'
        case 'UNAPPROVED':
          return 'secondary'
        default:
          return 'light'
      }
    },
    getNameForRole(role) {
      return this.roles.find(r => r.value === role)?.text
    },
  }
}

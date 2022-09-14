<template>
  <b-container>
    <b-row>
      <b-col offset-md="2" md="8" cols="12" class="my-3">
        <div class="text-center">
          <h1>Uporabniki</h1>
        </div>
        <table class="table table-hover mt-3 w-100">
          <thead>
          <tr>
            <th scope="col">Up. ime</th>
            <th scope="col" v-if="hideOnMinWidth">Email</th>
            <th scope="col">Vloga</th>
            <th scope="col" class="d-none">Akcije</th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="user of users"
            :key="user._id"
          >
            <td>{{ user.username }}</td>
            <td v-if="hideOnMinWidth">{{ user.email }}</td>
            <td>
              <b-dropdown
                id="dropdown-right"
                size="sm"
                right
                :text="getNameForRole(user.role)"
                :variant="getVariantForRole(user.role)"
              >
                <b-dropdown-item
                  v-for="role of roles"
                  :value="role.value"
                  :key="role.value"
                  @click="updateRole(user, role)"
                >
                  {{ role.text }}
                </b-dropdown-item>
              </b-dropdown>
            </td>
            <td class="d-none">Akcije</td>
          </tr>
          </tbody>
        </table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import roles from "@/mixins/roles";

export default {
  name: "users",
  mixins: [roles],
  data() {
    return {
      users: [],
      innerWidth: 799,
    }
  },
  async created() {
    await this.getUsers();
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.innerWidth = window.innerWidth
    })
  },
  computed: {
    hideOnMinWidth() {
      return this.innerWidth > 800;
    },
  },
  methods: {
    async getUsers() {
      this.$axios.$get('/users')
      .then(res => {
        this.users = res;
      })
      .catch(reason => {
        console.error(reason)
        this.$toast.error('Napaka pri pridobivanju uporabnikov', { duration: 3000 });
      })
    },
    updateRole(user, role) {
      this.$axios.$put(`/users/${user._id}/role`, { role: role.value })
        .then(res => {
          for (const user of this.users) {
            if (user._id === res._id) {
              user.role = res.role
              return;
            }
          }
        })
        .catch(reason => {
          console.error(reason)
          this.$toast.error('Napaka pri pridobivanju uporabnikov', { duration: 3000 });
        })

    }
  }
}
</script>

<style scoped>

</style>

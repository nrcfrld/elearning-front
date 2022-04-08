<template>
  <component :is="user === undefined ? 'div' : 'b-card'">
    <!-- Alert: No item found -->
    <b-alert variant="danger" :show="user === undefined">
      <h4 class="alert-heading">
        Error fetching user data
      </h4>
      <div class="alert-body">
        No user found with this user id. Check
        <b-link class="alert-link" :to="{ name: 'apps-users-list' }">
          User List
        </b-link>
        for other users.
      </div>
    </b-alert>

    <b-tabs v-if="user" pills>
      <!-- Tab: Account -->
      <b-tab active>
        <template #title>
          <feather-icon icon="UserIcon" size="16" class="mr-0 mr-sm-50" />
          <span class="d-none d-sm-inline">Account</span>
        </template>
        <user-edit-tab-account :user-data="user" class="mt-2 pt-75" />
      </b-tab>
    </b-tabs>
  </component>
</template>

<script>
import { BTab, BTabs, BCard, BAlert, BLink } from 'bootstrap-vue'
import useJwt from '@/auth/jwt/useJwt'
import UserEditTabAccount from './UserEditTabAccount.vue'
// import UserEditTabInformation from './UserEditTabInformation.vue'
// import UserEditTabSocial from './UserEditTabSocial.vue'

export default {
  components: {
    BTab,
    BTabs,
    BCard,
    BAlert,
    BLink,
    UserEditTabAccount,
  },
  data() {
    return {
      user: null,
    }
  },
  created() {
    this.loadUser()
  },
  methods: {
    async loadUser() {
      try {
        const response = await useJwt.axiosIns.get(
          `${process.env.VUE_APP_API_BASE_URL}/users/${this.$route.params.id}`
        )

        this.user = response.data.data
      } catch (error) {
        console.error(error)
      }
    },
  },
}
</script>

<style></style>

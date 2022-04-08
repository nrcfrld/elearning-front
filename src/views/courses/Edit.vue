<template>
  <component :is="item === undefined ? 'div' : 'b-card'">
    <!-- Alert: No item found -->
    <b-alert variant="danger" :show="item === undefined">
      <h4 class="alert-heading">
        Error fetching item data
      </h4>
      <div class="alert-body">
        No item found with this id. Check
        <b-link class="alert-link" :to="{ name: 'courses-list' }">
          List
        </b-link>
        for other courses.
      </div>
    </b-alert>

    <b-tabs v-if="item" pills>
      <!-- Tab: Account -->
      <b-tab active>
        <template #title>
          <feather-icon icon="UserIcon" size="16" class="mr-0 mr-sm-50" />
          <span class="d-none d-sm-inline">General Information</span>
        </template>
        <edit-general :data="item" class="mt-2 pt-75" />
      </b-tab>
      <b-tab>
        <template #title>
          <feather-icon icon="UserIcon" size="16" class="mr-0 mr-sm-50" />
          <span class="d-none d-sm-inline">Materi</span>
        </template>
        <edit-chapters :data="item" class="mt-2 pt-75" />
      </b-tab>
      <b-tab>
        <template #title>
          <feather-icon icon="UserIcon" size="16" class="mr-0 mr-sm-50" />
          <span class="d-none d-sm-inline">Peserta Kelas</span>
        </template>
        <edit-general :data="item" class="mt-2 pt-75" />
      </b-tab>
      <b-tab>
        <template #title>
          <feather-icon icon="UserIcon" size="16" class="mr-0 mr-sm-50" />
          <span class="d-none d-sm-inline">Report</span>
        </template>
        <edit-general :data="item" class="mt-2 pt-75" />
      </b-tab>
    </b-tabs>
  </component>
</template>

<script>
import { BTab, BTabs, BCard, BAlert, BLink } from 'bootstrap-vue'
import useJwt from '@/auth/jwt/useJwt'
import EditGeneral from './EditGeneral.vue'
import EditChapters from './EditChapters.vue'

export default {
  components: {
    BTab,
    BTabs,
    BCard,
    BAlert,
    BLink,
    EditGeneral,
    EditChapters,
  },
  data() {
    return {
      item: null,
    }
  },
  created() {
    this.loadItem()
  },
  methods: {
    async loadItem() {
      try {
        const response = await useJwt.axiosIns.get(
          `${process.env.VUE_APP_API_BASE_URL}/courses/${this.$route.params.id}`
        )

        this.item = response.data.data
      } catch (error) {
        console.error(error)
      }
    },
  },
}
</script>

<style></style>

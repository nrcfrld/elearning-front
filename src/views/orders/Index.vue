<template>
  <div>
    <!-- Table Container Card -->
    <b-card no-body class="mb-0">
      <div class="m-2">
        <!-- Table Top -->
        <b-row>
          <!-- Per Page -->
          <b-col
            cols="12"
            md="6"
            class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
          >
            <label>Show</label>
            <v-select
              v-model="perPage"
              :options="perPageOptions"
              :clearable="false"
              :searchable="false"
              class="per-page-selector d-inline-block mx-50"
              @input="loadData"
            />
            <label>entries</label>
          </b-col>

          <!-- Search -->
          <b-col cols="12" md="6">
            <div class="d-flex align-items-center justify-content-end">
              <b-form-input
                v-model="searchQuery"
                class="d-inline-block mr-1"
                placeholder="Search..."
              />
              <!-- <create @created="loadData">
                <b-button variant="primary">
                  <span class="text-nowrap">Add Item</span>
                </b-button>
              </create> -->
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        ref="refUserListTable"
        class="position-relative"
        :items="items"
        responsive
        :fields="tableColumns"
        primary-key="id"
        show-empty
        empty-text="No matching records found"
        :busy="isBusy"
      >
        <template #table-busy>
          <div
            class="text-center text-danger my-2 d-flex flex-column align-items-center justify-content-center"
          >
            <b-spinner class="align-middle"></b-spinner>
            <strong>Loading...</strong>
          </div>
        </template>

        <template #cell(user)="data">
          <b-media vertical-align="center">
            <template #aside>
              <b-avatar size="32" :src="data.item.user.avatar" />
            </template>
            <b-link class="font-weight-bold d-block text-nowrap">
              {{ data.item.user.name }}
            </b-link>
            <small class="text-muted">{{
              data.item.institute != null && data.user.item.profession
                ? `${data.item.user.profession} di ${data.item.user.institute}`
                : '-'
            }}</small>
          </b-media>
        </template>

        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <b-dropdown variant="link" no-caret>
            <template #button-content>
              <feather-icon
                icon="MoreVerticalIcon"
                size="16"
                class="align-middle text-body"
              />
            </template>

            <b-dropdown-item
              :to="{ name: 'users-edit', params: { id: data.item.id } }"
            >
              <feather-icon icon="EditIcon" />
              <span class="align-middle ml-50">Detail</span>
            </b-dropdown-item>

            <!-- <b-dropdown-item @click="deleteItem(data.item.id)">
              <feather-icon icon="TrashIcon" />
              <span class="align-middle ml-50">Delete</span>
            </b-dropdown-item> -->
          </b-dropdown>
        </template>
      </b-table>
      <div class="mx-2 mb-2">
        <b-row>
          <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-start"
          >
            <span class="text-muted"
              >Showing {{ currentPage }} of {{ totalPages }} pages</span
            >
          </b-col>
          <!-- Pagination -->
          <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-end"
          >
            <b-pagination
              v-model="currentPage"
              :total-rows="totalItems"
              :per-page="perPage"
              first-number
              last-number
              class="mb-0 mt-1 mt-sm-0"
              prev-class="prev-item"
              next-class="next-item"
            >
              <template #prev-text>
                <feather-icon icon="ChevronLeftIcon" size="18" />
              </template>
              <template #next-text>
                <feather-icon icon="ChevronRightIcon" size="18" />
              </template>
            </b-pagination>
          </b-col>
        </b-row>
      </div>
    </b-card>
  </div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BFormInput,
  BTable,
  BDropdown,
  BDropdownItem,
  BSpinner,
  BPagination,
  // BButton,
  BMedia,
  BAvatar,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import useJwt from '@/auth/jwt/useJwt'
import { mapState } from 'vuex'
// import Create from './Create.vue'

export default {
  components: {
    // Create,
    BRow,
    BCol,
    BCard,
    vSelect,
    BFormInput,
    BTable,
    BDropdown,
    BDropdownItem,
    BSpinner,
    BPagination,
    // BButton,
    BMedia,
    BAvatar,
  },
  data() {
    return {
      isBusy: false,
      roleFilter: null,
      statusFilter: null,
      verifiedOptions: [
        { label: 'Verified', value: true },
        { label: 'Unverified', value: false },
      ],
      perPageOptions: [10, 25, 50, 100],
      perPage: 10,
      totalItems: 0,
      currentPage: 1,
      totalPages: 0,
      searchQuery: null,
      items: [],
      tableColumns: [
        { key: 'user', sortable: true },
        { key: 'course.name', sortable: true, label: 'Nama Kursus' },
        { key: 'amount', label: 'Nominal Transaksi', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'actions' },
      ],
      orderBy: 'created_at',
      orderType: 'desc',
    }
  },
  computed: {
    ...mapState({
      roles: state => state.masterdata.roles,
    }),
  },
  watch: {
    currentPage() {
      this.loadData()
    },
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        this.isBusy = true
        const response = await useJwt.axiosIns(
          `${process.env.VUE_APP_API_BASE_URL}/orders`,
          {
            params: {
              page: this.currentPage,
              per_page: this.perPage,
              order_by: [this.orderBy, this.orderType],
            },
          }
        )

        this.items = response.data.data
        this.totalItems = response.data.meta.pagination.total
        this.totalPages = response.data.meta.pagination.totalPages
      } catch (error) {
        console.error(error)
      } finally {
        this.isBusy = false
      }
    },
    deleteItem(id) {
      try {
        this.$swal({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-danger ml-1',
          },
          buttonsStyling: false,
        }).then(async result => {
          if (result.value) {
            const response = await useJwt.axiosIns.delete(
              `${process.env.VUE_APP_API_BASE_URL}/orders/${id}`
            )

            if (response.status === 204) {
              this.$swal({
                title: 'Berhasil!',
                text: 'Berhasil menghapus data',
                icon: 'success',
                customClass: {
                  confirmButton: 'btn btn-primary',
                },
                buttonsStyling: false,
              })

              this.loadData()
            }
          }
        })
      } catch (error) {
        if (error.response) {
          this.$swal({
            title: 'Error!',
            text: error.response.data.message,
            icon: 'error',
            customClass: {
              confirmButton: 'btn btn-primary',
            },
            buttonsStyling: false,
          })
        }
      }
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>

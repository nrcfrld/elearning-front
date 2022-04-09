<template>
  <div>
    <b-card no-body>
      <b-card-header class="pb-50">
        <h5>
          Filters
        </h5>
      </b-card-header>
      <b-card-body>
        <b-row>
          <b-col cols="12" md="6" class="mb-md-0 mb-2">
            <label>Type</label>
            <v-select
              v-model="roleFilter"
              :options="typeOptions"
              label="name"
              class="w-100"
            />
          </b-col>
          <b-col cols="12" md="6" class="mb-md-0 mb-2">
            <label>Level</label>
            <v-select
              v-model="statusFilter"
              :options="levelOptions"
              class="w-100"
            />
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>

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
              @input="loadItems"
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
              <b-button variant="primary" :to="{ name: 'courses-create' }">
                <span class="text-nowrap">Add Courses</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        ref="refUserListTable"
        class="position-relative"
        :items="courses"
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

        <!-- Column Thumbnail -->
        <template v-slot:cell(thumbnail)="data">
          <img
            :src="data.item.thumbnail"
            :alt="data.item.name"
            class="img-thumbnail"
            style="height: 50px"
          />
        </template>

        <!-- Column Price -->
        <template v-slot:cell(price)="data">
          <span v-if="data.item.price != 0"
            >Rp.
            {{ new Intl.NumberFormat('id-ID').format(data.item.price) }}</span
          >
          <span v-else>Gratis</span>
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
            <!-- <b-dropdown-item
              :to="{ name: 'apps-courses-view', params: { id: data.item.id } }"
            >
              <feather-icon icon="FileTextIcon" />
              <span class="align-middle ml-50">Details</span>
            </b-dropdown-item> -->

            <b-dropdown-item
              :to="{ name: 'courses-edit', params: { id: data.item.id } }"
            >
              <feather-icon icon="EditIcon" />
              <span class="align-middle ml-50">Edit</span>
            </b-dropdown-item>

            <b-dropdown-item @click="deleteItem(data.item.id)">
              <feather-icon icon="TrashIcon" />
              <span class="align-middle ml-50">Delete</span>
            </b-dropdown-item>
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
              :total-rows="totalCourses"
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
  BCardHeader,
  BCardBody,
  BRow,
  BCol,
  BFormInput,
  BTable,
  BDropdown,
  BDropdownItem,
  BSpinner,
  BPagination,
  BButton,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import useJwt from '@/auth/jwt/useJwt'

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardBody,
    vSelect,
    BFormInput,
    BTable,
    BDropdown,
    BDropdownItem,
    BSpinner,
    BPagination,
    BButton,
  },
  data() {
    return {
      isBusy: false,
      roleFilter: null,
      statusFilter: null,
      levelOptions: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
      typeOptions: ['VIDEO-COURSE', 'ONSITE-COURSE'],
      perPageOptions: [10, 25, 50, 100],
      perPage: 10,
      totalCourses: 0,
      currentPage: 1,
      totalPages: 0,
      searchQuery: null,
      courses: [],
      tableColumns: [
        { key: 'thumbnail' },
        { key: 'name', sortable: true },
        { key: 'category.name', sortable: true, label: 'Category' },
        { key: 'level', sortable: true },
        { key: 'price', sortable: true },
        { key: 'actions', sortable: false },
      ],
      orderBy: 'created_at',
      orderType: 'desc',
    }
  },
  watch: {
    currentPage() {
      this.loadItems()
    },
  },
  created() {
    this.loadItems()
  },
  methods: {
    async loadItems() {
      try {
        this.isBusy = true
        const response = await useJwt.axiosIns(
          `${process.env.VUE_APP_API_BASE_URL}/courses`,
          {
            params: {
              page: this.currentPage,
              per_page: this.perPage,
              order_by: [this.orderBy, this.orderType],
            },
          }
        )

        this.courses = response.data.data
        this.totalCourses = response.data.meta.pagination.total
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
              `${process.env.VUE_APP_API_BASE_URL}/courses/${id}`
            )

            if (response.status === 204) {
              this.$swal({
                title: 'Berhasil!',
                text: 'Berhasil menghapus course',
                icon: 'success',
                customClass: {
                  confirmButton: 'btn btn-primary',
                },
                buttonsStyling: false,
              })

              this.loadItems()
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

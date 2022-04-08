<template>
  <div>
    <b-button
      v-b-modal.modal-form
      v-ripple.400="'rgba(255, 255, 255, 0.15)'"
      variant="primary"
    >
      <feather-icon icon="PlusIcon" class="mr-25" />
      <span>Add New</span>
    </b-button>

    <b-modal
      id="modal-form"
      title="New Chapter"
      :ok-disabled="loading"
      @ok="saveNewChapter"
    >
      <template #modal-ok>
        <b-spinner
          v-if="loading"
          variant="light"
          label="Spinning"
          small
        ></b-spinner>
        Submit
      </template>

      <b-form @submit.prevent>
        <b-row>
          <!-- first name -->
          <b-col cols="12">
            <b-form-group label="Name" label-for="name">
              <b-form-input
                id="name"
                v-model="formChapter.name"
                placeholder="Judul Chapter"
              />
            </b-form-group>
          </b-col>

          <!-- email -->
          <b-col cols="12">
            <b-form-group label="descriptions" label-for="v-descriptions">
              <b-form-textarea
                id="v-descriptions"
                v-model="formChapter.descriptions"
                placeholder="Descriptions"
              />
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
    </b-modal>

    <b-row class="mt-3">
      <b-col v-for="(chapter, index) in chapters" :key="chapter.id" md="12">
        <div class="card border">
          <div
            class="py-1 card-header border-bottom d-flex justify-content-between"
          >
            <h5 class="mb-0">#{{ index + 1 }} - {{ chapter.name }}</h5>
            <b-dropdown variant="link" no-caret>
              <template #button-content>
                <feather-icon
                  icon="MoreVerticalIcon"
                  size="16"
                  class="align-middle text-body"
                />
              </template>

              <b-dropdown-item>
                <feather-icon icon="EditIcon" />
                <span class="align-middle ml-50">Edit</span>
              </b-dropdown-item>

              <b-dropdown-item>
                <feather-icon icon="TrashIcon" />
                <span class="align-middle ml-50">Delete</span>
              </b-dropdown-item>
            </b-dropdown>
          </div>
          <div class="card-body py-2">
            <p>
              {{ chapter.descriptions }}
            </p>
          </div>
          <div class="card-footer">
            <edit-lessons :data="chapter" />
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {
  BForm,
  BFormGroup,
  BFormInput,
  BFormTextarea,
  BRow,
  BCol,
  BButton,
  BDropdown,
  BDropdownItem,
  BSpinner,
} from 'bootstrap-vue'
import { heightTransition } from '@core/mixins/ui/transition'
import Ripple from 'vue-ripple-directive'
import useJwt from '@/auth/jwt/useJwt'
import ResponseAlert from '@/mixins/response-alert'
import EditLessons from './EditLessons.vue'

export default {
  name: 'UserEditTabAccount',
  components: {
    BForm,
    BRow,
    BCol,
    BButton,
    BFormGroup,
    BFormInput,
    BFormTextarea,
    BDropdown,
    BDropdownItem,
    BSpinner,
    EditLessons,
  },
  directives: {
    Ripple,
  },
  extends: ResponseAlert,
  mixins: [heightTransition],
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      formChapter: {},
      loading: false,
      chapters: [],
    }
  },
  computed: {
    baseUrl() {
      return process.env.VUE_APP_API_BASE_URL
    },
  },
  mounted() {
    this.loadChapters()
  },
  methods: {
    async submit() {
      this.loading = true
      try {
        const data = { ...this.form }
        data.tags = this.form.tags.join()
        data.mentors = JSON.stringify(data.mentors)
        const response = await useJwt.axiosIns.post(
          `${process.env.VUE_APP_API_BASE_URL}/courses`,
          data
        )

        if (response.status === 201) {
          this.responseSuccessAlert('Berhasil membuat courses baru')
          this.$emit('created')

          this.$router.push({
            name: 'courses-list',
          })
        }
      } catch (error) {
        this.responseErrorAlert(error)
      } finally {
        this.loading = false
      }
    },
    async saveNewChapter(event) {
      event.preventDefault()
      this.loading = true
      try {
        let response = null

        response = await useJwt.axiosIns.post(
          `${process.env.VUE_APP_API_BASE_URL}/chapters`,
          {
            ...this.formChapter,
            course_id: this.data.id,
          }
        )

        if (response.status === 201) {
          this.loadChapters()
          this.responseSuccessAlert('Berhasil membuat chapter baru')

          this.formChapter = {}
          this.$bvModal.hide('modal-form')
        }
      } catch (error) {
        this.responseErrorAlert(error)
      } finally {
        this.loading = false
      }
    },
    async loadChapters() {
      try {
        const response = await useJwt.axiosIns.get(
          `${process.env.VUE_APP_API_BASE_URL}/chapters`,
          {
            params: {
              course_id: this.data.id,
              order_by: ['created_at', 'asc'],
            },
          }
        )

        this.chapters = response.data.data
      } catch (error) {
        this.responseErrorAlert(error)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.repeater-form {
  overflow: hidden;
  transition: 0.35s height;
}
</style>

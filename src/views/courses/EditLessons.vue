<template>
  <div>
    <b-list-group class="mb-2">
      <b-list-group-item
        v-for="(lesson, index) in lessons"
        :key="lesson.id"
        class="d-flex justify-content-between align-items-center"
      >
        <div>
          #{{ index + 1 }} - {{ lesson.name }} ( {{ lesson.minutes }} Min )
        </div>
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

          <b-dropdown-item @click="deleteItem(lesson.id)">
            <feather-icon icon="TrashIcon" />
            <span class="align-middle ml-50">Delete</span>
          </b-dropdown-item>
        </b-dropdown>
      </b-list-group-item>
    </b-list-group>
    <form @submit.prevent="addNewLessons">
      <div class="row align-items-center mb-2">
        <div class="col-md-3">
          <b-form-input id="name" v-model="form.name" placeholder="Judul" />
        </div>
        <div class="col-md-3">
          <b-form-input
            id="video_url"
            v-model="form.video_url"
            placeholder="Link Embed Youtube"
          />
        </div>
        <div class="col-md-3">
          <b-form-input
            id="minutes"
            v-model="form.minutes"
            placeholder="Jumlah Menit"
          />
        </div>
        <div class="col-md-3">
          <b-form-checkbox
            v-model="form.free_access"
            :checked="false"
            switch
            size="md"
          >
            Can Preview
          </b-form-checkbox>
        </div>
      </div>
      <button class="btn btn-outline-primary btn-sm" type="submit">
        Tambah Pembelajaran
      </button>
    </form>
  </div>
</template>

<script>
import responseAlert from '@/mixins/response-alert'
import useJwt from '@/auth/jwt/useJwt'
import {
  BFormInput,
  BFormCheckbox,
  BListGroup,
  BListGroupItem,
  BDropdown,
  BDropdownItem,
} from 'bootstrap-vue'

export default {
  components: {
    BFormInput,
    BFormCheckbox,
    BListGroup,
    BListGroupItem,
    BDropdown,
    BDropdownItem,
  },
  extends: responseAlert,
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      form: {},
      loading: false,
      lessons: [],
    }
  },
  mounted() {
    this.loadLessons()
  },
  methods: {
    async addNewLessons() {
      try {
        this.loading = true
        const response = await useJwt.axiosIns.post(
          `${process.env.VUE_APP_API_BASE_URL}/lessons`,
          {
            ...this.form,
            chapter_id: this.data.id,
          }
        )

        if (response.status === 201) {
          // this.responseSuccessAlert(
          //   `Berhasil menambahkan pembelajaran baru untuk Chapter ${this.data.name}`
          // )
          this.form = {}
          this.loadLessons()
        }
      } catch (error) {
        this.responseErrorAlert(error)
      } finally {
        this.loading = false
      }
    },
    async loadLessons() {
      try {
        const response = await useJwt.axiosIns.get(
          `${process.env.VUE_APP_API_BASE_URL}/lessons`,
          {
            params: {
              chapter_id: this.data.id,
            },
          }
        )

        this.lessons = response.data.data
      } catch (error) {
        console.error(error)
      }
    },
    async deleteItem(id) {
      try {
        const response = await useJwt.axiosIns.delete(
          `${process.env.VUE_APP_API_BASE_URL}/lessons/${id}`
        )

        if (response.status === 204) {
          this.loadLessons()
        }
      } catch (error) {
        this.responseErrorAlert(error)
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>

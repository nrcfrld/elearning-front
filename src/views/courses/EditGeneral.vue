<template>
  <b-form @submit.prevent>
    <b-row class="mt-2">
      <b-col md="8">
        <section>
          <h4 class="mb-2">Informasi Dasar</h4>
          <hr />
          <b-form-group label="Course Name" label-for="course-name">
            <b-form-input
              id="course-name"
              v-model="form.name"
              placeholder="Nama Kursus"
            />
          </b-form-group>

          <b-form-group label="Descriptions" label-for="descriptions">
            <quill-editor
              v-model="form.descriptions"
              :options="editorOptions"
            />
            <!-- <b-form-textarea
              id="descriptions"
              v-model="form.descriptions"
              placeholder="Deskripsikan kelas kursus"
            /> -->
          </b-form-group>

          <b-form-group label="Price" label-for="Price">
            <cleave
              id="Price"
              v-model="form.price"
              class="form-control"
              :raw="true"
              :options="{
                prefix: 'Rp ',
                numeral: true,
                numeralThousandGroupStyle: 'thousand',
                rawValueTrimPrefix: true,
              }"
              placeholder="10,000"
            />
          </b-form-group>

          <b-form-group label="Category" label-for="category">
            <v-select
              id="category"
              v-model="form.categoryId"
              placeholder="Ketik nama kategori"
              :options="categoriesOptions"
              label="name"
              class="w-100"
              :reduce="val => val.id"
              @search="searchCategories"
            />
          </b-form-group>

          <b-form-group label="Type" label-for="type">
            <v-select
              id="type"
              v-model="form.type"
              placeholder="Pilih Jenis Kursus"
              :options="['VIDEO', 'ONSITE']"
              class="w-100"
            />
          </b-form-group>

          <transition name="fade">
            <b-form-group
              v-if="form.type === 'ONSITE'"
              label="Batas Peserta"
              label-for="max-participant"
            >
              <b-form-input
                id="max-participant"
                v-model="form.max_participant"
                placeholder="Masukan jumlah batasan peserta"
                class="w-100"
              />
            </b-form-group>
          </transition>

          <b-form-group label="Level" label-for="level">
            <v-select
              id="level"
              v-model="form.level"
              placeholder="Pilih Level Tingkatan Kursus"
              :options="['BEGINNER', 'INTERMEDIATE', 'ADVANCED']"
              class="w-100"
            />
          </b-form-group>

          <b-form-group label="Tags" label-for="tags">
            <b-form-tags v-model="form.tags" input-id="tags" class="mb-2" />
          </b-form-group>
        </section>

        <section>
          <h4 class="mb-2">Mentor</h4>
          <hr />
          <button v-b-modal.modal-form-mentor class="btn btn-primary btn-sm">
            Tambah
          </button>
          <b-modal
            id="modal-form-mentor"
            :no-close-on-backdrop="true"
            title="Tambah Mentor Untuk Kursus Ini"
            @ok="addMentor"
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
                <!-- mobile -->
                <b-col cols="12">
                  <b-form-group label="Mentor" label-for="mentor">
                    <v-select
                      id="mentor"
                      v-model="mentorSelected"
                      label="name"
                      :options="mentorsOptions"
                      @search="searchMentors"
                    />
                  </b-form-group>
                </b-col>
              </b-row>
            </b-form>
          </b-modal>
          <table class="table mt-2">
            <tr>
              <td>
                Nama Mentor
              </td>
              <td>
                Aksi
              </td>
            </tr>
            <tr v-for="(mentor, index) in form.mentors" :key="index">
              <td>
                <b-media vertical-align="center">
                  <template #aside>
                    <b-avatar size="32" :src="mentor.avatar" />
                  </template>
                  <b-link class="font-weight-bold d-block text-nowrap">
                    {{ mentor.name }}
                  </b-link>
                  <small class="text-muted">{{
                    mentor.institute != null && mentor.profession
                      ? `${mentor.profession} di ${mentor.institute}`
                      : '-'
                  }}</small>
                </b-media>
              </td>
              <td>
                <button
                  class="btn btn-sm btn-danger"
                  @click="deleteMentor(mentor.id)"
                >
                  <FeatherIcon icon="TrashIcon" />
                </button>
              </td>
            </tr>
            <tr v-if="form.mentors.length < 1">
              <td colspan="2" class="text-center">
                Belum ada data mentor untuk kursus ini
              </td>
            </tr>
          </table>
        </section>
      </b-col>
      <b-col md="4">
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          type="submit"
          variant="primary"
          class="mr-1 mb-3"
          block
          size="lg"
          @click="submit"
        >
          Simpan
        </b-button>
        <div class="card border">
          <div class="card-body">
            <b-form-checkbox
              checked="true"
              name="check-button"
              switch
              size="md"
            >
              Aktif
            </b-form-checkbox>
            <small>
              <feather-icon icon="AlertCircleIcon" />
              Jika diaktifkan maka kursus akan tampil dihalaman depan dan user
              bisa mendaftar</small
            >
          </div>
        </div>

        <b-card
          :img-src="
            form.thumbnail ? form.thumbnail : `${baseUrl}/img/example-image.jpg`
          "
          img-alt="Image"
          img-top
          tag="article"
          class="mb-2 border"
        >
          <b-button
            href="#"
            variant="primary"
            @click="$refs.refImageInput.click()"
            >Ubah Thumbnail</b-button
          >
          <input
            ref="refImageInput"
            type="file"
            class="d-none"
            @input="inputImageRenderer"
          />
        </b-card>

        <div class="card border">
          <b-embed type="iframe" class="w-100" :src="form.trailerUrl" />
          <div class="card-body">
            <b-form-group label="URL Video Trailer" label-for="course-name">
              <b-form-input
                id="course-name"
                v-model="form.trailerUrl"
                placeholder="URL Video"
              />
              <b-form-text>
                Masukan URL video youtube yang valid
              </b-form-text>
            </b-form-group>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
import {
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BForm,
  // BFormTextarea,
  BButton,
  BFormTags,
  BCard,
  BEmbed,
  BFormCheckbox,
  BFormText,
  BModal,
  BAvatar,
  BMedia,
  BLink,
  // BSpinner,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import useJwt from '@/auth/jwt/useJwt'
import Cleave from 'vue-cleave-component'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cleave.js/dist/addons/cleave-phone.us'
import Ripple from 'vue-ripple-directive'
import ResponseAlert from '@/mixins/response-alert'
import FeatherIcon from '@/@core/components/feather-icon/FeatherIcon.vue'
import { quillEditor } from 'vue-quill-editor'

// import theme style
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import '@/@core/scss/base/plugins/forms/form-quill-editor.scss'

export default {
  name: 'UserEditTabAccount',
  components: {
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    // BFormTextarea,
    BForm,
    BButton,
    Cleave,
    vSelect,
    BFormTags,
    BCard,
    BEmbed,
    BFormCheckbox,
    BFormText,
    BModal,
    BMedia,
    BAvatar,
    BLink,
    quillEditor,
    // BSpinner,
  },
  directives: {
    FeatherIcon,
    Ripple,
  },
  extends: ResponseAlert,
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: this.$props.data,
      loading: false,
      mentorSelected: null,
      mentorsOptions: [],
      categoriesOptions: [],
      editorOptions: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ align: [] }],
            ['clean'],
            ['link', 'video'],
          ],
        },
      },
    }
  },
  computed: {
    baseUrl() {
      return process.env.VUE_APP_API_BASE_URL
    },
  },
  created() {
    this.categoriesOptions.push(this.$props.data.category)
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
    async searchCategories(search, loading) {
      try {
        loading(true)
        const response = await useJwt.axiosIns.get(
          `${process.env.VUE_APP_API_BASE_URL}/categories`,
          {
            params: {
              children: true,
            },
          }
        )

        this.categoriesOptions = response.data.data
      } catch (error) {
        console.error(error)
      } finally {
        loading(false)
      }
    },
    async searchMentors(search, loading) {
      try {
        loading(true)
        const response = await useJwt.axiosIns.get(
          `${process.env.VUE_APP_API_BASE_URL}/users`,
          {
            params: {
              like: search,
              role: 'mentor',
            },
          }
        )

        this.mentorsOptions = response.data.data
      } catch (error) {
        console.error(error)
      } finally {
        loading(false)
      }
    },
    addMentor() {
      this.form.mentors.push(this.mentorSelected)
      this.mentorSelected = null
    },
    deleteMentor(id) {
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
      }).then(result => {
        if (result.value) {
          this.form.mentors = this.form.mentors.filter(item => item.id !== id)
        }
      })
    },
    inputImageRenderer(e) {
      const ofReader = new FileReader()

      ofReader.readAsDataURL(this.$refs.refImageInput.files[0])

      ofReader.onload = ofReaderEvent => {
        this.form.thumbnail = ofReaderEvent.target.result
      }
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>

<template>
  <div>
    <div v-b-modal.modal-form-category>
      <slot> </slot>
    </div>
    <b-modal
      id="modal-form-category"
      title="Buat Kategori Baru"
      :ok-disabled="loading"
      @ok="submit"
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
                v-model="form.name"
                placeholder="Software Development"
              />
            </b-form-group>
          </b-col>

          <!-- parent category -->
          <b-col cols="12">
            <b-form-group label="Parent Category" label-for="parent_id">
              <v-select
                id="parent_id"
                v-model="form.parent_id"
                label="name"
                :options="parents"
                :reduce="val => val.id"
                @search="searchCategories"
              />
            </b-form-group>
          </b-col>

          <!-- descriptions -->
          <b-col cols="12">
            <b-form-group label="Descriptions" label-for="v-descriptions">
              <b-form-textarea
                id="v-descriptions"
                v-model="form.descriptions"
                type="descriptions"
                placeholder="Dekripsikan kategori"
              />
            </b-form-group>
          </b-col>

          <!-- descriptions -->
          <b-col cols="12">
            <img
              class="img-thumbnail"
              :src="
                form.image ? form.image : `${baseUrl}/img/example-image.jpg`
              "
              alt="gambar"
              width="100"
            />
            <b-button
              class="ml-2"
              href="#"
              variant="outline-primary  "
              @click="$refs.refImageInput.click()"
              >Ubah Gambar</b-button
            >
            <input
              ref="refImageInput"
              type="file"
              class="d-none"
              @input="inputImageRenderer"
            />
          </b-col>
        </b-row>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import {
  BModal,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BForm,
  BSpinner,
  BFormTextarea,
  BButton,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import useJwt from '@/auth/jwt/useJwt'
import { mapState } from 'vuex'
import responseAlert from '@/mixins/response-alert'

export default {
  components: {
    BModal,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BForm,
    vSelect,
    BSpinner,
    BFormTextarea,
    BButton,
  },
  extends: responseAlert,
  data() {
    return {
      form: {
        image: null,
      },
      loading: false,
      observer: null,
      parents: [],
    }
  },
  computed: {
    ...mapState({
      roles: state => state.masterdata.roles,
    }),
    baseUrl() {
      return process.env.VUE_APP_API_BASE_URL
    },
  },
  mounted() {
    // this.observer = new IntersectionObserver(this.infiniteScroll)
  },
  methods: {
    async submit(event) {
      event.preventDefault()
      this.loading = true

      try {
        const response = await useJwt.axiosIns.post(
          `${process.env.VUE_APP_API_BASE_URL}/categories`,
          this.form
        )

        if (response.status === 201) {
          this.responseSuccessAlert('Berhasil membuat kategori baru')
          this.$emit('created')

          this.form = {}
          this.$bvModal.hide('modal-form-category')
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
              parents: true,
            },
          }
        )

        this.parents = response.data.data
      } catch (error) {
        console.error(error)
      } finally {
        loading(false)
      }
    },
    inputImageRenderer(e) {
      const ofReader = new FileReader()

      ofReader.readAsDataURL(this.$refs.refImageInput.files[0])

      ofReader.onload = ofReaderEvent => {
        this.form.image = ofReaderEvent.target.result
      }
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-sweetalert.scss';
</style>

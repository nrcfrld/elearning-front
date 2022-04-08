<template>
  <div>
    <div v-b-modal.modal-form-user>
      <slot> </slot>
    </div>
    <b-modal
      id="modal-form-user"
      title="Buat User Baru"
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
                placeholder="John Doe"
              />
            </b-form-group>
          </b-col>

          <!-- email -->
          <b-col cols="12">
            <b-form-group label="Email" label-for="v-email">
              <b-form-input
                id="v-email"
                v-model="form.email"
                type="email"
                placeholder="Email"
              />
            </b-form-group>
          </b-col>

          <!-- mobile -->
          <b-col cols="12">
            <b-form-group label="Role" label-for="role">
              <v-select
                id="role"
                v-model="form.role_id"
                label="name"
                :reduce="val => val.id"
                :options="roles"
              />
            </b-form-group>
          </b-col>

          <!-- password -->
          <b-col cols="12">
            <b-form-group label="Password" label-for="v-password">
              <b-form-input
                id="v-password"
                v-model="form.password"
                type="password"
                placeholder="Password"
              />
            </b-form-group>
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
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import useJwt from '@/auth/jwt/useJwt'
import { mapState } from 'vuex'
import responseAlert from '@/mixins/response-alert'

export default {
  name: 'CreateUsers',
  components: {
    BModal,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BForm,
    vSelect,
    BSpinner,
  },
  extends: responseAlert,
  data() {
    return {
      form: {},
      loading: false,
    }
  },
  computed: {
    ...mapState({
      roles: state => state.masterdata.roles,
    }),
  },
  methods: {
    async submit(event) {
      event.preventDefault()
      this.loading = true
      try {
        let response = null

        response = await useJwt.axiosIns.post(
          `${process.env.VUE_APP_API_BASE_URL}/users`,
          this.form
        )

        if (response.status === 201) {
          this.responseSuccessAlert('Berhasil membuat user baru')
          this.$emit('created')

          this.form = {}
          this.$bvModal.hide('modal-form-user')
        }
      } catch (error) {
        this.responseErrorAlert(error)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

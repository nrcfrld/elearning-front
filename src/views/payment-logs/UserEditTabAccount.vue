<template>
  <div>
    <!-- Media -->
    <b-media class="mb-2">
      <template #aside>
        <b-avatar
          ref="previewEl"
          :src="userData.avatar"
          :text="userData.name"
          size="90px"
          rounded
        />
      </template>
      <h4 class="mb-1">
        {{ userData.name }}
      </h4>
      <div class="d-flex flex-wrap">
        <b-button variant="primary" @click="$refs.refInputEl.click()">
          <input
            ref="refInputEl"
            type="file"
            class="d-none"
            @input="inputImageRenderer"
          />
          <span class="d-none d-sm-inline">Update</span>
          <feather-icon icon="EditIcon" class="d-inline d-sm-none" />
        </b-button>
        <b-button variant="outline-secondary" class="ml-1">
          <span class="d-none d-sm-inline">Remove</span>
          <feather-icon icon="TrashIcon" class="d-inline d-sm-none" />
        </b-button>
      </div>
    </b-media>

    <!-- User Info: Input Fields -->
    <b-form>
      <b-row>
        <!-- Field: Full Name -->
        <b-col cols="12" md="4">
          <b-form-group label="Name" label-for="full-name">
            <b-form-input id="full-name" v-model="userData.name" />
          </b-form-group>
        </b-col>

        <!-- Field: Email -->
        <b-col cols="12" md="4">
          <b-form-group label="Email" label-for="email">
            <b-form-input id="email" v-model="userData.email" type="email" />
          </b-form-group>
        </b-col>

        <!-- Field: Role -->
        <b-col cols="12" md="4">
          <b-form-group label="User Role" label-for="user-role">
            <v-select
              v-model="userData.roleId"
              :options="roles"
              label="name"
              :reduce="val => val.id"
              :clearable="false"
              input-id="user-role"
            />
          </b-form-group>
        </b-col>

        <!-- Field: Email -->
        <b-col cols="12" md="4">
          <b-form-group label="Company" label-for="company">
            <b-form-input id="company" v-model="userData.institute" />
          </b-form-group>
        </b-col>

        <b-col cols="12" md="4">
          <b-form-group label="Profession" label-for="profession">
            <b-form-input id="profession" v-model="userData.profession" />
          </b-form-group>
        </b-col>
      </b-row>
    </b-form>

    <!-- Action Buttons -->
    <b-button
      variant="primary"
      class="mb-1 mb-sm-0 mr-0 mr-sm-1"
      :block="$store.getters['app/currentBreakPoint'] === 'xs'"
      @click="submit"
    >
      Save Changes
    </b-button>
    <b-button
      variant="outline-secondary"
      type="reset"
      :block="$store.getters['app/currentBreakPoint'] === 'xs'"
    >
      Reset
    </b-button>
  </div>
</template>

<script>
import {
  BButton,
  BMedia,
  BAvatar,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BForm,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import { mapState } from 'vuex'
import useJwt from '@/auth/jwt/useJwt'

export default {
  name: 'UserEditTabAccount',
  components: {
    BButton,
    BMedia,
    BAvatar,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BForm,
    vSelect,
  },
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState({
      roles: state => state.masterdata.roles,
    }),
  },
  methods: {
    async inputImageRenderer(e) {
      const data = new FormData()
      data.append('image', e.target.files[0])
      data.append('_method', 'PUT')

      const response = await useJwt.axiosIns.post(
        `${process.env.VUE_APP_API_BASE_URL}/users/update-avatar/${this.userData.id}`,
        data
      )

      this.userData.avatar = response.data

      this.$swal({
        title: 'Berhasil',
        text: `Berhasil mengubah profile avatar`,
        icon: 'success',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
        buttonsStyling: false,
      })
    },
    async submit() {
      try {
        const response = await useJwt.axiosIns.put(
          `${process.env.VUE_APP_API_BASE_URL}/users/${this.userData.id}`,
          this.userData
        )

        if (response.status === 200) {
          this.$swal({
            title: 'Berhasil',
            text: `Berhasil mengubah data ${this.userData.name}`,
            icon: 'success',
            customClass: {
              confirmButton: 'btn btn-primary',
            },
            buttonsStyling: false,
          })
        }
      } catch (error) {
        console.error(error)
      }
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>

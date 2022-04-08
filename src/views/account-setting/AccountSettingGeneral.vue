<template>
  <b-card>
    <!-- media -->
    <b-media no-body>
      <b-media-aside>
        <b-link>
          <b-img
            ref="previewEl"
            rounded
            :src="user.avatar"
            height="80"
            :alt="user.name"
          />
        </b-link>
        <!--/ avatar -->
      </b-media-aside>

      <b-media-body class="mt-75 ml-75">
        <!-- upload button -->
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          size="sm"
          class="mb-75 mr-75"
          @click="$refs.refInputEl.$el.click()"
        >
          Upload
        </b-button>
        <b-form-file
          ref="refInputEl"
          v-model="profileFile"
          accept=".jpg, .png, .gif"
          :hidden="true"
          plain
          @input="inputImageRenderer"
        />
        <!--/ upload button -->

        <!-- reset -->
        <b-button
          v-ripple.400="'rgba(186, 191, 199, 0.15)'"
          variant="outline-secondary"
          size="sm"
          class="mb-75 mr-75"
        >
          Reset
        </b-button>
        <!--/ reset -->
        <b-card-text>Allowed JPG, GIF or PNG. Max size of 800kB</b-card-text>
      </b-media-body>
    </b-media>
    <!--/ media -->

    <!-- form -->
    <b-form class="mt-2">
      <b-row>
        <b-col sm="6">
          <b-form-group label="Name" label-for="account-name">
            <b-form-input v-model="user.name" name="name" placeholder="Name" />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group label="E-mail" label-for="account-e-mail">
            <b-form-input
              v-model="user.email"
              name="email"
              placeholder="Email"
            />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group label="Profession" label-for="account-company">
            <b-form-input
              v-model="user.profession"
              name="profession"
              placeholder="Profession"
            />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group label="Institute" label-for="account-company">
            <b-form-input
              v-model="user.institute"
              name="institute"
              placeholder="Institute name"
            />
          </b-form-group>
        </b-col>
        <b-col sm="12">
          <b-form-group label="About" label-for="account-company">
            <b-form-textarea
              v-model="user.descriptions"
              name="Deskripsi"
              placeholder="Dekripsikan tentang kamu"
            />
          </b-form-group>
        </b-col>

        <b-col cols="12">
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            class="mt-2 mr-1"
          >
            Save changes
          </b-button>
          <b-button
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            variant="outline-secondary"
            type="reset"
            class="mt-2"
            @click.prevent="resetForm"
          >
            Reset
          </b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-card>
</template>

<script>
import {
  BFormFile,
  BButton,
  BForm,
  BFormGroup,
  BFormInput,
  BFormTextarea,
  BRow,
  BCol,
  BCard,
  BCardText,
  BMedia,
  BMediaAside,
  BMediaBody,
  BLink,
  BImg,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import { mapState } from 'vuex'

export default {
  components: {
    BButton,
    BForm,
    BImg,
    BFormFile,
    BFormGroup,
    BFormInput,
    BFormTextarea,
    BRow,
    BCol,
    BCard,
    BCardText,
    BMedia,
    BMediaAside,
    BMediaBody,
    BLink,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      profileFile: null,
    }
  },
  computed: {
    ...mapState({
      user: state => state.auth.user,
    }),
  },
  methods: {
    inputImageRenderer() {
      //
    },
  },
}
</script>

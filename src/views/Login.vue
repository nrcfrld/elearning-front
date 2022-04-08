<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">
      <!-- Login v1 -->
      <b-card class="mb-0">
        <b-link class="brand-logo">
          <vuexy-logo />

          <h2 class="brand-text text-primary ml-1">
            {{ appTitle }}
          </h2>
        </b-link>

        <b-card-title class="mb-1">
          Welcome to {{ appTitle }}! 👋
        </b-card-title>
        <b-card-text class="mb-2">
          Please sign-in to your account
        </b-card-text>

        <!-- form -->
        <validation-observer ref="loginForm" #default="{invalid}">
          <b-form class="auth-login-form mt-2" @submit.prevent>
            <!-- email -->
            <b-form-group label-for="email" label="Email">
              <validation-provider
                #default="{ errors }"
                name="Email"
                rules="required|email"
              >
                <b-form-input
                  id="email"
                  v-model="userEmail"
                  name="login-email"
                  :state="errors.length > 0 ? false : null"
                  placeholder="john@example.com"
                  autofocus
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- password -->
            <b-form-group>
              <div class="d-flex justify-content-between">
                <label for="password">Password</label>
                <b-link :to="{ name: 'auth-forgot-password-v1' }">
                  <small>Forgot Password?</small>
                </b-link>
              </div>
              <validation-provider
                #default="{ errors }"
                name="Password"
                rules="required"
              >
                <b-input-group
                  class="input-group-merge"
                  :class="errors.length > 0 ? 'is-invalid' : null"
                >
                  <b-form-input
                    id="password"
                    v-model="password"
                    :type="passwordFieldType"
                    class="form-control-merge"
                    :state="errors.length > 0 ? false : null"
                    name="login-password"
                    placeholder="Password"
                  />

                  <b-input-group-append is-text>
                    <feather-icon
                      class="cursor-pointer"
                      :icon="passwordToggleIcon"
                      @click="togglePasswordVisibility"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- checkbox -->
            <b-form-group>
              <b-form-checkbox
                id="remember-me"
                v-model="status"
                name="checkbox-1"
              >
                Remember Me
              </b-form-checkbox>
            </b-form-group>

            <!-- submit button -->
            <b-button
              variant="primary"
              type="submit"
              block
              :disabled="invalid || loading"
              @click="validationForm"
            >
              <b-spinner v-if="loading" class="mr-1" variant="light" small />
              <span v-else>Sign in</span>
            </b-button>
          </b-form>
        </validation-observer>
      </b-card>
      <!-- /Login v1 -->
    </div>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import {
  BLink,
  BFormGroup,
  BFormInput,
  BInputGroupAppend,
  BInputGroup,
  BFormCheckbox,
  BCardText,
  BCardTitle,
  BForm,
  BButton,
  BCard,
  BSpinner,
} from 'bootstrap-vue'
import { required, email } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import store from '@/store/index'
import useJwt from '@/auth/jwt/useJwt'
import { getHomeRouteForLoggedInUser } from '@/auth/utils'

export default {
  name: 'Login',
  components: {
    BButton,
    BForm,
    BFormInput,
    BFormGroup,
    BCard,
    BCardTitle,
    BLink,
    VuexyLogo,
    BCardText,
    BInputGroup,
    BInputGroupAppend,
    BFormCheckbox,
    BSpinner,
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      status: '',
      password: 'password',
      userEmail: 'admin@admin.com',
      sideImg: require('@/assets/images/pages/login-v2.svg'),
      loading: false,
      // validation rulesimport store from '@/store/index'
      required,
      email,
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require('@/assets/images/pages/login-v2-dark.svg')
        return this.sideImg
      }
      return this.sideImg
    },
    appTitle() {
      return process.env.VUE_APP_TITLE
    },
  },
  methods: {
    validationForm() {
      this.$refs.loginForm.validate().then(success => {
        if (success) {
          this.login()
        }
      })
    },
    async login() {
      try {
        this.loading = true
        const response = await useJwt.login({
          username: this.userEmail,
          password: this.password,
        })

        if (response.status === 200) {
          const { jwt } = response.data.data
          useJwt.setToken(jwt)

          const resDataUser = await useJwt.fetchUser()

          if (resDataUser.status === 200) {
            const userData = resDataUser.data.data
            if (userData.role.name === 'end-user') {
              return false
            }
            localStorage.setItem('userData', JSON.stringify(userData))
            this.$store.dispatch('auth/setUser', userData)

            this.$router
              .replace(getHomeRouteForLoggedInUser(userData.role.name))
              .then(() => {
                this.$toast({
                  component: ToastificationContent,
                  position: 'top-right',
                  props: {
                    title: `Welcome ${userData.name || userData.email}`,
                    icon: 'CoffeeIcon',
                    variant: 'success',
                    text: `You have successfully logged in as ${userData.role.name}. Now you can start to explore!`,
                  },
                })
              })
          }
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }

      return true
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>

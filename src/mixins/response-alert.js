const responseAlert = {
  methods: {
    responseErrorAlert(error) {
      if (error.response) {
        if (error.response.status === 422) {
          const { errors } = error.response.data

          const firstMesssage =
            errors[Object.keys(error.response.data.errors)[0]]

          return this.$swal({
            title: 'Error!',
            text: firstMesssage,
            icon: 'error',
            customClass: {
              confirmButton: 'btn btn-primary',
            },
            buttonsStyling: false,
          })
        }
        return this.$swal({
          title: 'Error!',
          text: error.response.data.message,
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-primary',
          },
          buttonsStyling: false,
        })
      }

      return this.$swal({
        title: 'Error!',
        text: 'Terjadi Kesalahan',
        icon: 'error',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
        buttonsStyling: false,
      })
    },
    responseSuccessAlert(message) {
      this.$swal({
        title: 'Berhasil',
        text: message,
        icon: 'success',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
        buttonsStyling: false,
      })
    },
  },
}

export default responseAlert

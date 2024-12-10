<template>
  <div>
    <div class="flat-card">
      <div class="card-content">
        <p class="is-size-3 dynamic-title">
          {{ id ? 'Edit ' : 'Create New' }} Akun
          <b-button class="is-pulled-right" type="is-secondary" rounded :loading="isLoading"
            @click="submitForm()">Save</b-button>
        </p>
        <br />
        <div class="row">
          <div class="columns">
            <div class="column is-6">
              <b-field label="Username">
                <b-input required v-model="email" placeholder="Cth. widyamedan" />
              </b-field>
              <b-field label="Name">
                <b-input required v-model="name" placeholder="Cth. Widya" />
              </b-field>
              <b-field label="Jenis akun">
                <b-select v-model="role" placeholder="Pilih jenis akun" expanded>
                  <option value="ROLE_ADMIN">Admin</option>
                  <option value="ROLE_USER">Pengguna Biasa</option>
                </b-select>
              </b-field>
              <b-field label="Password" v-if="!id">
                <b-input required type="password" v-model="password" placeholder="Password" password-reveal />
              </b-field>
            </div>
            <div class="column is-6 is-align-item-center is-justify-content-center has-text-centered">
              <img src="../../assets/imgs/GraphicInput.svg" alt />
              <p class="is-size-7 has-text-grey">Jenis pengguna biasa tidak dapat
                login sebagai admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isLoading: false,
      id: "",
      email: "",
      password: "",
      name: "",
      role: "ROLE_USER"
    }
  },
  methods: {
    submitForm() {
      let submit
      let data = {
        email: this.email,
        name: this.name,
        role: this.role
      }
      if (data.email && data.name && data.role) {
        this.isLoading = true
        if (this.id) {
          submit = this.axios.put(`/api/user/${this.id}`, data)
        } else {
          data.password = this.password
          submit = this.axios.post("/api/user", data)
        }
        submit
          .then(res => {
            this.isLoading = false
            this.$router.back()
            this.$buefy.toast.open({
              duration: 1000,
              message: "Success",
              type: "is-success",
              position: "is-top"
            })
          })
          .catch(err => {
            this.isLoading = false
            this.$buefy.toast.open({
              duration: 1000,
              message: err.response.data.message,
              type: "is-danger",
              position: "is-top"
            })
          })

      } else {
        this.$buefy.toast.open("Data can't be null")
      }
    },
    getItemDetail() {
      this.isLoading = true
      this.axios
        .get(`api/user/detail/${this.id}`)
        .then(res => {
          let data = res.data
          this.email = data.email,
            this.name = data.name,
            this.role = data.role
          this.isLoading = false
        })
        .catch(err => {
          this.isLoading = false
        })
    }
  },
  created() {
    let id = this.$route.params.id
    if (id) {
      this.id = id
      this.getItemDetail()
    }
  }
}
</script>
<template>
  <div class="section">
    <div class="formToken">
      <div class="flat-card">
        <div class="card-content">
          <img style="margin: auto; display: block" width="100" src="../assets/logo.png" alt />
          <p class="has-text-centered has-text-weight-bold">Jaddi Internasional</p>
          <br />
          <div class="content">
            <div class="label">Username</div>
            <b-field>
              <b-input autofocus v-model="username" type="text" @keyup.enter.native="login" />
            </b-field>
            <div class="label">Password</div>
            <b-field>
              <b-input
                password-reveal
                type="password"
                v-model="password"
                @keyup.enter.native="login"
              />
            </b-field>
            <br/>
            <b-field>
              <b-button
                class="is-fullwidth"
                type="is-secondary"
                @click="login"
                :loading="isLoading"
              >Login</b-button>
            </b-field>
          </div>
        </div>
      </div>
      <!-- <small>*) Harap masukan username aplikasi anda</small> -->
    </div>
  </div>
</template>
<script>
import { urlEncoded } from "../function-helper";
import { Buffer } from 'buffer'

export default {
  data() {
    return {
      username: "",
      password: "",
      isLoading: false
    };
  },
  methods: {
    login() {
      if ( this.password) {
        this.isLoading = true;
        let userLogin = {
          email: this.username,
          password: this.password,
          grant_type: "password"
        };

        const username = "jaddi-client";
        const password = "jaddi-secret";

        const token = Buffer.from(`${username}:${password}`, "utf8").toString(
          "base64"
        );

        this.axios
          .post("/api/oauth/token", urlEncoded(userLogin), {
            headers: {
              Authorization: `Basic ${token}`
            }
          })
          .then(res => {
            let token = res.data.access_token;
            this.axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            this.axios
              .get("/api/user/details")
              .then(res => {
                let data = res.data;
                if (data.role == "ROLE_USER" || data.role == "ROLE_ADMIN") {
                  let data_login = {
                    token: token,
                    dataUser: data
                  };
                  this.$store.dispatch("login/login", data_login);
                  this.$buefy.toast.open({
                    duration: 1000,
                    message: "Login Sukses",
                    type: "is-light",
                    position: "is-top"
                  });
                  this.$router.push("/");
                } else {
                  this.$buefy.toast.open({
                    duration: 1000,
                    message: "Akses ditolak",
                    type: "is-danger",
                    position: "is-top"
                  });
                }
                this.isLoading = false;
              })
              .catch(e => {
                console.log(e);
              });
          })
          .catch(e => {
            this.$buefy.toast.open({
              duration: 1000,
              message: "username/password salah",
              type: "is-danger",
              position: "is-top"
            });
            this.isLoading = false;
          });
      } else {
        this.$buefy.toast.open({
          duration: 1000,
          message: "Data can't be null",
          type: "is-danger",
          position: "is-top"
        });
      }
    }
  }
};
</script>
<style scoped>
.formToken {
  width: 400px;
  margin: auto;
}
</style>

<template>
  <div>
    <div class="flat-card">
      <div class="card-content">
        <p class="is-size-3 dynamic-title">
          {{ id ? 'Edit ' : 'Create New' }} Brand
          <b-button class="is-pulled-right" type="is-secondary" rounded :loading="isLoading"
            @click="submitForm()">Save</b-button>
        </p>
        <br />
        <div class="row">
          <div class="columns">
            <div class="column is-6">

              <b-field label="Nama Brand">
                <b-input required v-model="name" placeholder="Brand Name" />
              </b-field>
              <b-field label="Category">
                <b-select v-model="category.value" placeholder="Select Category" expanded>
                  <option v-for="item in category.options" :value="item.idCategory" :key="item.idCategory">
                    {{ item.description }}
                  </option>
                </b-select>
              </b-field>
              <b-field label="Country" v-if="category.value === '660394557511e8844e43236c' || category.value === '660394657511e8844e43236e'">
                <b-select v-model="country.value" placeholder="Select Country" expanded>
                  <option v-for="item in country.options" :value="item.idCountry" :key="item.idCountry">
                    {{ item.name }}
                  </option>
                </b-select>
              </b-field>
              <b-field label="Description">
                <b-input v-model="description" type="textarea" placeholder="Description" />
              </b-field>

            </div>
            <div class="column is-6 is-align-item-center is-justify-content-center has-text-centered">
              <img src="../../assets/imgs/GraphicInput.svg" alt />
              <p class="is-size-7 has-text-grey">Brand used when create product</p>
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
      location: [],
      id: "",
      name: "",
      description: "",
      category: {
        value: null,
        options: []
      },
      country: {
        value: null,
        options: []
      },
    }
  },
  methods: {
    async getCategory() {
      this.isLoading = true
      return this.axios
        .get(`api/category`)
        .then(res => {
          let data = res.data
          this.category.options = data
          this.isLoading = false
          return data
        })
        .catch(err => {
          this.isLoading = false
        })
    },
    getCountry() {
      this.isLoading = true
      this.axios
        .get(`api/country`)
        .then(res => {
          let data = res.data
          this.country.options = data
          this.isLoading = false
        })
        .catch(err => {
          this.isLoading = false
        })
    },
    submitForm() {
      let submit
      let data = {
        name: this.name,
        description: this.description,
        categoryId: this.category.value
      }
      if (this.category.value === '660394557511e8844e43236c' || this.category.value === '660394657511e8844e43236e') {
        data['countryId'] = this.country.value
      }
      if (data.name) {
        this.isLoading = true
        if (this.id) {
          submit = this.axios.put(`/api/brand/${this.id}`, data)
        } else {
          submit = this.axios.post("/api/brand", data)
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
        .get(`api/brand/${this.id}`)
        .then(res => {
          let data = res.data
          this.name = data.name
          this.description = data.description
          this.category.value = data.categoryId
          this.country.value = data.countryId

          this.isLoading = false
        })
        .catch(err => {
          this.isLoading = false
        })
    }
  },
  async created() {
    await this.getCategory()
    await this.getCountry()
    let id = this.$route.params.id
    if (id) {
      this.id = id
      this.getItemDetail()
    }
  }
}
</script>

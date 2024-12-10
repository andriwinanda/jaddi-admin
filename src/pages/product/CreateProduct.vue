<template>

  <div class="flat-card">
    <div class="card-content">
      <p class="is-size-3 dynamic-title">
        {{ id ? 'Edit ' : 'Create New' }} Product
        <b-button class="is-pulled-right" type="is-secondary" rounded :loading="isLoading"
          @click.stop="submitForm()">Save</b-button>
      </p>
      <br />
      <div class="row">
        <div class="columns">
          <div class="column">
            <b-field label="Upload Gambar">
            </b-field>
            <div v-if="imageUrl" class="upload-wrapper">
              <img :src="imageUrl" class="image-preview">
              <p class="delete-file is-overlay">
                <a @click="removeFile()" type="is-primary" class="delete"></a>
              </p>
            </div>
            <b-upload v-else class="image-preview" v-model="dropFiles" accept="image/png, image/jpeg" drag-drop
              @input="imageUpload($event)">
              <section class="section margin-top-6">
                <div class="content has-text-centered">
                  <p>
                    <b-icon icon="upload" size="is-large">
                    </b-icon>
                  </p>
                  <p>Drop your files here or click to upload</p>
                </div>
              </section>
            </b-upload>
          </div>
          <div class="column is-7">


            <b-field label="Name">
              <b-input v-model="name" placeholder="Name" />
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
            <b-field label="Brand / Type">
              <b-select v-model="brand.value" placeholder="Select Brand" expanded>
                <option v-for="item in brand.options" :value="item.idBrand" :key="item.idBrand">
                  {{ item.name }}
                </option>
              </b-select>
            </b-field>

            <b-field label="Description">
              <b-input v-model="description" type="textarea" placeholder="Description" />
            </b-field>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import imageCompression from 'browser-image-compression'

export default {
  data() {
    return {
      isLoading: false,
      isCardModalActive: false,
      activeIdx: null,
      id: "",
      dropFiles: null,
      name: "",
      imageUrl: "",
      description: '',
      category: {
        value: null,
        options: []
      },
      country: {
        value: null,
        options: []
      },
      brand: {
        value: null,
        options: []
      }

    }
  },
  methods: {
    imageUpload(event) {
      this.imageUrl = URL.createObjectURL(event)
    },
    async compressImage(file) {
      const imageFile = file
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 400,
        useWebWorker: true
      }
      try {
        const compressedFile = await imageCompression(imageFile, options)
        return compressedFile // write your own logic
      } catch (error) {
      }
    },
    async uploader(formData) {
      this.isLoading = true
      return this.axios.post(`/api/upload`, formData, {
        params: {
          folder: 'product'
        }
      })
        .then(response => {
          this.isLoading = false
          return response.data
        })
        .catch((err) => {
          this.isLoading = false
          throw err
        })
    },
    async submitForm() {
      let submit
      let data = {
        name: this.name,
        description: this.description,
        categoryId: this.category.value,
        brandId: this.brand.value,
        imageUrl: this.imageUrl
      }

      if (this.category.value === '660394557511e8844e43236c' || this.category.value === '660394657511e8844e43236e') {
        data['countryId'] = this.country.value
      }

      let errorMsg = ""
      if (!data.name) errorMsg = "Name can't be null"
      if (!data.description) errorMsg = "Description can't be null"
      if (!data.imageUrl) errorMsg = "Image can't be null"
      // if (!data.countryId) errorMsg = "Select Country"
      if (!data.categoryId) errorMsg = "Select Category"
      if (!data.brandId) errorMsg = "Select Brand"


      if (errorMsg) {
        this.$buefy.toast.open(errorMsg)
      }
      else {
        this.isLoading = true
        if (this.dropFiles) {
          const compressedImgTmp = await this.compressImage(this.dropFiles)

          if (compressedImgTmp) {
            const compressedImg = new File([compressedImgTmp], this.dropFiles.name, { type: "image/jpeg" })
            const formData = new FormData()
            formData.append("file", compressedImg)
            const imageUrl = await this.uploader(formData)
            if (imageUrl) data.imageUrl = imageUrl.data
          }
        }
        if (this.id) {
          submit = this.axios.put(`/api/product/${this.id}`, data)
        }
        else {
          submit = this.axios.post("/api/product", data)
        }
        submit
          .then(res => {
            this.isLoading = false
            if(this.id) this.$router.back()
            else this.resetForm()
            this.$buefy.toast.open({
              duration: 1000,
              message: "Success",
              type: "is-success",
              position: "is-top"
            })
          }).catch(err => {
            this.isLoading = false
            this.$buefy.toast.open({
              duration: 1000,
              message: err.response.data ? err.response.data.message : 'Error',
              type: "is-danger",
              position: "is-top"
            })

          })

      }
    },
    getItemDetail() {
      this.isLoading = true
      this.axios
        .get(`api/product/${this.id}`)
        .then(res => {
          let data = res.data
          this.id = data.idProduct
          this.name = data.name
          this.description = data.description
          this.imageUrl = data.imageUrl
          this.category.value = data.categoryId
          this.country.value = data.countryId
          this.brand.value = data.brandId
          this.isLoading = false
        })
        .catch(err => {
          this.isLoading = false
        })
    },
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
    getBrand() {
      this.isLoading = true
      this.axios
        .get(`api/brand`)
        .then(res => {
          let data = res.data
          this.brand.options = data
          this.isLoading = false
        })
        .catch(err => {
          this.isLoading = false
        })
    },


    removeFile() {
      this.imageUrl = null
      this.dropFiles = null
    },
    resetForm() {
      this.name = ""
      this.description = ""
      this.imageUrl = ""
      this.category.value = ""
      this.country.value = ""
      this.brand.value = ""
    }

  },
  async created() {
    await this.getCategory()
    await this.getCountry()
    await this.getBrand()
    let id = this.$route.params.id
    if (id) {
      this.id = id
      this.getItemDetail()
    }
  }
}
</script>
<style scoped>
.upload-wrapper {
  display: block;
  position: relative !important;
  width: 320px;
  max-height: 320px !important;
  height: 320px;
}

.image-preview {
  width: 320px;
  max-height: 320px !important;
  height: 320px;
  border-radius: 10px;
}

.delete-file {
  display: block;
  position: absolute;
  text-align: right;
  padding-right: 7px;
  top: 7px;
}

.margin-top-6 {
  margin-top: 3rem;
}
</style>
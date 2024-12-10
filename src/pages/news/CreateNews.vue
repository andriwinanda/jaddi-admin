<template>

  <div class="flat-card">
    <div class="card-content">
      <p class="is-size-3 dynamic-title">
        {{ id ? 'Edit ' : 'Create New' }} News
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
            <b-field label="Description">
              <ckeditor :editor="editor" v-model="description" :config="editorConfig"></ckeditor>
            </b-field>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CKEditor from '@ckeditor/ckeditor5-vue2';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import imageCompression from 'browser-image-compression'
import UploadAdapter from "../../UploadAdapter.js";

export default {
  components: { ckeditor: CKEditor.component },
  data() {
    return {
      isLoading: false,
      id: "",
      dropFiles: null,
      name: "",
      imageUrl: "",
      description: '',

      editor: ClassicEditor,
      editorConfig: {
        toolbar: [
          "heading",
          "|",
          "bold",
          "italic",
          "link",
          "bulletedList",
          "numberedList",
          "|",
          "insertTable",
          "|",
          "imageUpload",
          "|",
          "undo",
          "redo"
        ],
        table: {
          toolbar: ["tableColumn", "tableRow", "mergeTableCells"]
        },
        extraPlugins: [
          function (editor) {
            editor.plugins.get("FileRepository").createUploadAdapter = function (loader) {
              return new UploadAdapter(loader);
            };
          }
        ]
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
          folder: 'news'
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
        imageUrl: this.imageUrl
      }

      let errorMsg = ""
      if (!data.name) errorMsg = "Name can't be null"
      if (!data.description) errorMsg = "Description can't be null"
      if (!data.imageUrl) errorMsg = "Image can't be null"

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
          submit = this.axios.put(`/api/news/${this.id}`, data)
        }
        else {
          submit = this.axios.post("/api/news", data)
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
            this.router.back()
          }).catch(err => {
            this.isLoading = false
            this.$buefy.toast.open({
              duration: 1000,
              message: err.response ? err.response.data.message : 'Error',
              type: "is-danger",
              position: "is-top"
            })
          })

      }
    },
    getItemDetail() {
      this.isLoading = true
      this.axios
        .get(`api/news/${this.id}`)
        .then(res => {
          let data = res.data
          this.id = data.idNews
          this.name = data.name
          this.description = data.description
          this.imageUrl = data.imageUrl
          this.isLoading = false
        })
        .catch(err => {
          this.isLoading = false
        })
    },

    removeFile() {
      this.imageUrl = null
      this.dropFiles = null
    }

  },
  async created() {
    let id = this.$route.params.id
    if (id) {
      this.id = id
      this.getItemDetail()
    }
    // this.editorConfig.extraPlugins = [this.uploaderImgNewsEditor(this.$event)]
  }
}
</script>
<style>
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

.ck-editor__editable_inline {
  min-height: 300px;
}
</style>
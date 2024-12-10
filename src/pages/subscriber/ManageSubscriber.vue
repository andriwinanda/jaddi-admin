<template>
  <div>
    <div class="flat-card">
      <div class="card-content">
        <b-table :data="listData" :loading="isLoading" :hoverable="true" :sticky-header="true">
          <template slot="empty" v-if="!isLoading">
            <p class="dynamic-subtitle has-text-centered" style="padding: 10px">No data available in table</p>
          </template>

          <template slot-scope="props">
            <b-table-column label="Email">{{ props.row.email || '-' }}</b-table-column>
            <b-table-column field="notes" label="Notes" sortable>
              <div class="columns">
                <div class="column is-four-fifths">
                  <b-input size="is-small" v-model="props.row.notes" placeholder="Notes" />
                </div>
                <div class="column">
                  <b-button type="is-primary" size="is-small"
                    @click="saveNotes(props.row.idSubscriber, props.row.notes)">Save
                  </b-button>
                </div>
              </div>
            </b-table-column>
            <b-table-column label="Subscribe">{{ moment(props.row.createdAt).utcOffset(420).format("DD MMM YYYY HH:mm")
              }} WIB </b-table-column>
            <!-- ACTION -->
            <b-table-column label="Action" centered style="min-width: 80px">
              <div class="buttons has-addons is-centered">
                <b-button type="is-danger" size="is-small" icon-left="delete"
                  @click="deleteItem(props.row.idSubscriber)"></b-button>
              </div>
            </b-table-column>
          </template>
        </b-table>
      </div>
    </div>
    <b-button class="floating-btn" type="is-primary" size="is-medium" icon-right="download"
      @click="downloadSubscriber()" rounded />
  </div>
</template>
<script>
import moment from 'moment'
import writeXlsxFile from 'write-excel-file'

export default {
  setup() {
    return {
      moment
    }
  },
  data() {
    return {
      isLoading: false,
      listData: []
    };
  },
  methods: {
    getList() {
      this.isLoading = true;
      this.axios
        .get(`api/subscriber`)
        .then(res => {
          let data = res.data;
          this.listData = data;
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
        });
    },

    saveNotes(id, notes) {
      let data = {
        notes: notes,
      }
      this.isLoading = true
      this.axios.put(`/api/subscriber/${id}`, data)
        .then(res => {
          this.isLoading = false
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
    },

    deleteItem(id) {
      this.$buefy.dialog.confirm({
        title: "Deleting",
        message:
          "Are you sure you want to <b>delete</b> this item? This action cannot be undone.",
        confirmText: "Delete",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => {
          this.isLoading = true;
          this.axios
            .delete(`/api/subscriber/${id}`)
            .then(res => {
              this.$buefy.toast.open("Item deleted!");
              this.isLoading = false;
              this.listData = [];
              this.getList();
            })
            .catch(err => {
              this.isLoading = false;
              this.$buefy.toast.open({
                message: err.response.data.message || 'Error',
                type: 'is-danger'
              });
            });
        }
      });
    },
    async downloadSubscriber() {
      let data = null
      let schema = null
      let errorMsg = null

      data = this.listData.map((el) => {
        const item = {
          'Email': el.email,
          'Notes': el.notes,
          'Subscribe': moment(el.createdAt).format('DD MMM YYYY, HH:mm:ss')
        }
        return item
      })

      if (!data.length) errorMsg = "No Data"

      if (errorMsg) {
        this.$buefy.toast.open({
          message: errorMsg,
          type: 'is-danger'
        })
      } else {
        const tableArray = Object.entries(data[0])
        schema = tableArray.map((el) => {
          const item = {
            column: el[0],
            width: 30,
            type: String,
            value: item => item[el[0]]
          }
          return item
        })
        // }

        await writeXlsxFile(data, {
          schema,
          fileName: `Subscriber-Jaddiinternasional.xlsx`
        })
      }
      //  else {
      //   const options = {
      //     fieldSeparator: ';',
      //     quoteStrings: '"',
      //     decimalSeparator: '.',
      //     showLabels: true,
      //     showTitle: false,
      //     filename: `${this.reportData.type}-${moment().format('DD.MM.YY-HH.mm')}`,
      //     useTextFile: false,
      //     useBom: true,
      //     useKeysAsHeaders: true
      //   }
      //   const csvExporter = new ExportToCsv(options)
      //   csvExporter.generateCsv(data)
      // }

    },
  },
  created() {
    this.getList();
  }
};
</script>
<template>
  <div>
    <div class="flat-card">
      <div class="card-content">
        <b-table :data="listData" :loading="isLoading" :hoverable="true" :sticky-header="true">
          <template slot="empty" v-if="!isLoading">
            <p
              class="dynamic-subtitle has-text-centered"
              style="padding: 10px"
            >No data available in table</p>
          </template>

          <template slot-scope="props">
            <b-table-column label="Category">{{ props.row.description || '-' }}</b-table-column>
            <b-table-column field="name" label="Key Catgory" sortable> {{ props.row.name || '-' }}</b-table-column>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
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
        .get(`api/category`)
        .then(res => {
          let data = res.data;
          this.listData = data;
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
        });
    },
  },
  created() {
    this.getList();
  }
};
</script>
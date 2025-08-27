<template>
  <div class="p-4">
    <h2 class="text-xl mb-4">My Pitch Data</h2>
    <ag-grid-vue
      class="h-96 lg:w-2/3 w-full mx-auto text-left"
      :rowData="rowData"
      :columnDefs="colDefs"
      :columnTypes="columnTypes"
      :pagination="true"
      :paginationPageSize="20"
    ></ag-grid-vue>
  </div>
</template>

<script setup lang="ts">
import { AgGridVue } from "ag-grid-vue3";
import axios from "axios";
import { onBeforeMount, ref } from "vue";

const rowData = ref([]);
const columnTypes = ref({
  date: {
    valueFormatter: (params: any) =>
      new Date(params.value).toLocaleDateString(),
  },
});
const colDefs = ref([
  {
    headerName: "Date",
    field: "createdAt",
    sortable: true,
    filter: true,
    type: "date",
    flex: 1,
  },
  { headerName: "Scale", field: "scale", sortable: true, filter: true, flex: 1 },
  {
    headerName: "Percentage In Tune",
    field: "percentageInTune",
    sortable: true,
    filter: true,
    flex: 1,
  },
//   {
//     headerName: "Average Deviation",
//     field: "averageDeviation",
//     sortable: true,
//     filter: true,
//     flex: 1,
//   },
  {
    headerName: "Tolerance",
    field: "toleranceLevel",
    sortable: true,
    filter: true,
    flex: 1,
  },
]);



onBeforeMount(() => {
  axios
    .get("/api/pitch-data")
    .then((response) => {
      rowData.value = response.data.pitchData;
      console.log("Fetched user pitch data:", rowData.value);
    })
    .catch((error) => {
      console.error("Error fetching user pitch data:", error);
    });
});
</script>

<style>
span.ag-paging-page-size {
    display: none !important;
}
</style>

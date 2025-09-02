<template>
  <div class="p-4 lg:w-2/3 mx-auto">
    <h2 class="text-xl mb-4">My Pitch Data</h2>
    <div>
      <Checkbox
        v-model="allColumnsVisible"
        label="Show All Columns"
        class="mb-2"
      />
    </div>
    <ag-grid-vue
      class="h-96 w-full mx-auto text-left"
      :rowData="rowData"
      :columnDefs="colDefs"
      :columnTypes="columnTypes"
      :pagination="true"
      :paginationPageSize="20"
    ></ag-grid-vue>
    <div class="chart-wrapper mt-8">
      <ag-charts :options="options" class="h-96 w-full"></ag-charts>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AgGridVue } from "ag-grid-vue3";
import { AgCharts } from 'ag-charts-vue3';
import type { AgChartOptions } from "ag-charts-community";
import axios from "axios";
import { computed, onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from "vue";
import Checkbox from "../components/reuseable/Checkbox.vue";

const shouldHideColumn = ref(false); // Set to true to hide certain columns
const allColumnsVisible = computed({
  get: () => !shouldHideColumn.value,
  set: (value) => {
    shouldHideColumn.value = !value;
  },
});
const updateColumnVisibility = () => {
    shouldHideColumn.value = window.innerWidth < 640;
  };

onMounted(() => {
  // hide certain columns on small screens
  window.addEventListener("resize", updateColumnVisibility);
});

// remove event listener on unmount
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateColumnVisibility);
});

const rowData = ref([]);
const columnTypes = ref({
  date: {
    valueFormatter: (params: any) =>
      new Date(params.value).toLocaleDateString(),
  },
  percentage: { valueFormatter: (params: any) => `${params.value}%` },
  cents: { valueFormatter: (params: any) => `${params.value} cents` },
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
    headerName: "In Tune",
    field: "percentageInTune",
    type: "percentage",
    sortable: true,
    filter: true,
    flex: 1,
  },
  {
    headerName: "Avg. Deviation",
    field: "averageDeviation",
    type: "cents",
    sortable: true,
    hide: shouldHideColumn,
    filter: true,
    flex: 1,
  },
  {
    headerName: "Tolerance",
    field: "toleranceLevel",
    sortable: true,
    hide: shouldHideColumn,
    filter: true,
    flex: 1,
  },
]);

const averageScorePerScale = computed(() => {
    const scaleMap: Record<string, { total: number; count: number }> = {};
    rowData.value.forEach((entry: any) => {
        if (!scaleMap[entry.scale]) {
            scaleMap[entry.scale] = { total: 0, count: 0 };
        }
        scaleMap[entry.scale].total += entry.percentageInTune;
        scaleMap[entry.scale].count += 1;
    });
    return Object.entries(scaleMap).map(([scale, data]) => ({
        Scale: scale,
        'In tune %': data.total / data.count,
    }))
  });


 const options = computed<AgChartOptions>(() => ({
            // Data: Data to be displayed in the chart
            data: averageScorePerScale.value,
            title: {
                text: 'Average In Tune Percentage by Scale',
                fontSize: 18,
                fontFamily: 'Arial, sans-serif',
            },
            // Series: Defines which chart type and data to use
            series: [{ type: 'bar', direction: 'horizontal', xKey: 'Scale', yKey: 'In tune %', fill: '#4F46E5', cornerRadius: 10 }],
            axes: [
                {
                    type: 'category',
                    position: 'left',
                    paddingOuter: 0.7,
                    label: {
                        rotation: 0,
                        fontSize: 14,
                        fontFamily: 'Arial, sans-serif',
                    },
                },
                {
                    type: 'number',
                    position: 'bottom',
                    label: {
                        fontSize: 14,
                        fontFamily: 'Arial, sans-serif',
                        formatter: (params) => `${Math.round(params.value)}%`,
                    },
                    min: 0,
                    max: 100,
                    tickInterval: 10,
                },
            ],

 }));



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
.chart-wrapper {
  border-radius: 8px;
  overflow: hidden;
}
</style>

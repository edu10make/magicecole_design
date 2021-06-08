// import Utils from "util";
// var Utils = require('util');
// import Utils from "./utils.js";
// console.log(Utils.months({
//     count: 7
// }))

var ctx = document.getElementById("stick_chart_1");
var ctx2 = document.getElementById("stick_chart_2");

const DATA_COUNT = 7;
const NUMBER_CFG = {
  count: DATA_COUNT,
  min: -100,
  max: 100,
};

const labels = ["Biz", "Data", "Interface"];
const data1 = {
  labels: labels,
  datasets: [
    {
      axis: "y",
      label: "1차 시험",
      data: [15, 10, 30],
      fill: false,
      backgroundColor: "rgba(204, 0, 0, 0.2)",

      borderColor: "rgb(204, 0, 0)",
      borderWidth: 1,
    },
    {
      axis: "y",
      label: "2차 시험",
      data: [70, 25, 60],
      fill: false,
      backgroundColor: "rgba(0, 51, 204, 0.2)",
      borderColor: "rgb(0, 51, 204)",

      borderWidth: 1,
    },
  ],
};

const data2 = {
  labels: ["       총점"],
  datasets: [
    {
      axis: "y",
      label: "1차 시험",
      data: [13],
      fill: false,
      backgroundColor: "rgba(204, 0, 0, 0.5)",

      borderColor: "rgb(204, 0, 0)",
      borderWidth: 1,
    },
    {
      axis: "y",
      label: "2차 시험",
      data: [50],
      fill: false,
      backgroundColor: "rgba(0, 51, 204, 0.5)",
      borderColor: "rgb(0, 51, 204)",

      borderWidth: 1,
    },
  ],
};

const config1 = {
  type: "horizontalBar",
  data: data1,
  options: {
    indexAxis: "y",
    // Elements options apply to all of the options unless overridden in a dataset
    // In this case, we are setting the border of each horizontal bar to be 2px wide
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Chart.js Horizontal Bar Chart",
      },
    },
    scales: {
      xAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: "백분율(%)",
          },
          ticks: {
            beginAtZero: true,
            steps: 10,
            stepValue: 5,
            max: 100,
          },
        },
      ],
    },
  },
};
const config2 = {
  type: "horizontalBar",
  data: data2,
  options: {
    indexAxis: "y",
    // Elements options apply to all of the options unless overridden in a dataset
    // In this case, we are setting the border of each horizontal bar to be 2px wide
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "right",
        onClick: newLegendClickHandler,
      },
      title: {
        display: true,
        text: "Chart.js Horizontal Bar Chart",
      },
    },
    scales: {
      xAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: "백분율(%)",
          },
          ticks: {
            beginAtZero: true,
            steps: 10,
            stepValue: 5,
            max: 100,
          },
        },
      ],
    },
  },
};

function newLegendClickHandler() {
  alert("newLegendClickHandler function has been called!");
}

var myChart = new Chart(ctx, config1);
var myChart2 = new Chart(ctx2, config2);

// import Utils from "util";
// var Utils = require('util');
// import Utils from "./utils.js";
// console.log(Utils.months({
//     count: 7
// }))

var ctx = document.getElementById("stick_chart");
const DATA_COUNT = 7;
const NUMBER_CFG = {
    count: DATA_COUNT,
    min: -100,
    max: 100
};

const labels = ["Biz","Data","Interface"];
const data = {
    labels: labels,
    datasets: [{
        axis: 'y',
        label: '1차 시험',
        data: [-20,-42,-12],
        fill: false,
        backgroundColor: 
            'rgba(204, 0, 0, 0.2)',
        
        borderColor: 
            'rgb(204, 0, 0)'
        ,
        borderWidth: 1
    },
{
    axis: 'y',
    label: '2차 시험',
    data: [35,-15,12],
    fill: false,
    backgroundColor: 
   
        'rgba(0, 51, 204, 0.2)'
    ,
    borderColor: 

        'rgb(0, 51, 204)'
    ,
    borderWidth: 1
}]
};

// const config = {
//     type: 'horizontalBar',
//     responsive: true,
//     data,
//     options: {
//         indexAxis: 'y',
//         plugins: {
//             legend: {
//                 position: 'right',
//             },
//             title: {
//                 display: true,
//                 text: 'Chart.js Horizontal Bar Chart'
//             }
//         }
//     }
// };

const config = {
    type: 'horizontalBar',
    data: data,
    options: {
        indexAxis: 'y',
        // Elements options apply to all of the options unless overridden in a dataset
        // In this case, we are setting the border of each horizontal bar to be 2px wide
        elements: {
            bar: {
                borderWidth: 2,
            }
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
            },
            title: {
                display: true,
                text: 'Chart.js Horizontal Bar Chart'
            }
        },
        scales:{

        xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: '평균(%)'
                },
                ticks: {
                    beginAtZero: true,
                    steps: 10,
                    stepValue: 5,
                    min: -50,
                    max: 50
                }
            }],
           
        }
    },
};

var myChart = new Chart(ctx, config);
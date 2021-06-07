window.chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(231,233,237)',
  t1_s:'rgb(255,102,102)',
  t1_m: 'rgb(204,0,0)',
  t2_s: 'rgb(102,153,255)',
  t2_m: 'rgb(0,51,204)',

};

window.randomScalingFactor = function () {
  return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
}

var randomScalingFactor = function () {
  return Math.round(Math.random() * 100);
};

var now = moment();

var label1 = "1차 Test 평균";
var label2 = "나의 1차 Test";
var label3 = "2차 Test 평균";
var label4 = "나의 2차 Test";


var color = Chart.helpers.color;
var config1 = {
  type: 'radar',
  data: {
    labels: [
      "Business", "Data", "Interface"
    ],
    datasets: [ {
      label: label2,
      backgroundColor: color(window.chartColors.t1_m).alpha(0).rgbString(),
      borderColor: window.chartColors.t1_m,
      pointBackgroundColor: window.chartColors.t1_m,
      data: [4.25, 3.25, 4],
      notes: ["TWICE MoMo"]
    }, {
      label: label4,
      backgroundColor: color(window.chartColors.t2_m).alpha(0).rgbString(),
      borderColor: window.chartColors.t2_m,
      pointBackgroundColor: window.chartColors.t2_m,
      data: [6, 1.25, 3],
      notes: ["TWICE JiHyo"]
    }, {
      label: label1,
      backgroundColor: color(window.chartColors.t1_s).alpha(0).rgbString(),
      borderColor: window.chartColors.t1_s,
      pointBackgroundColor: window.chartColors.t1_s,
      data: [4.15, 3.72, 3.88],
      notes: ["BTS rap-monster"],
      borderWidth: 3,
      pointRadius: 3
    }, {
      label: label3,
      backgroundColor: color(window.chartColors.t2_s).alpha(0).rgbString(),
      borderColor: window.chartColors.t2_s,
      pointBackgroundColor: window.chartColors.t2_s,
      data: [4.62, 3.78, 4.45],
      notes: ["TWICE JiHyo"]
    }]
  },
  options: {
    responsive: true,
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'DT 기술 역량'
    },
    scale: {
      ticks: {
        beginAtZero: true,
          // steps: 2,
          // stepValue: 2,
          max: 10
      },
      
    },
    tooltips: {
      enabled: false,
      callbacks: {
        label: function (tooltipItem, data) {
          var datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
          //This will be the tooltip.body
          return datasetLabel + ': ' + tooltipItem.yLabel + ': ' + data.datasets[tooltipItem.datasetIndex].notes[tooltipItem.index];
        }
      },
      custom: function (tooltip) {
        // Tooltip Element
        var tooltipEl = document.getElementById('chartjs-tooltip');
        if (!tooltipEl) {
          tooltipEl = document.createElement('div');
          tooltipEl.id = 'chartjs-tooltip';
          tooltipEl.innerHTML = "<table></table>"
          document.body.appendChild(tooltipEl);
        }
        // Hide if no tooltip
        if (tooltip.opacity === 0) {
          tooltipEl.style.opacity = 0;
          return;
        }
        // Set caret Position
        tooltipEl.classList.remove('above', 'below', 'no-transform');
        if (tooltip.yAlign) {
          tooltipEl.classList.add(tooltip.yAlign);
        } else {
          tooltipEl.classList.add('no-transform');
        }

        function getBody(bodyItem) {
          return bodyItem.lines;
        }
        // Set Text
        if (tooltip.body) {
          var titleLines = tooltip.title || [];
          var bodyLines = tooltip.body.map(getBody);
          var innerHtml = '<thead>';
          titleLines.forEach(function (title) {
            innerHtml += '<tr><th>' + title + '</th></tr>';
          });
          innerHtml += '</thead><tbody>';
          bodyLines.forEach(function (body, i) {
            var colors = tooltip.labelColors[i];
            var style = 'background:' + colors.backgroundColor;
            style += '; border-color:' + colors.borderColor;
            style += '; border-width: 2px';
            var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
            innerHtml += '<tr><td>' + span + body + '</td></tr>';
          });
          innerHtml += '</tbody>';
          var tableRoot = tooltipEl.querySelector('table');
          tableRoot.innerHTML = innerHtml;
        }
        var position = this._chart.canvas.getBoundingClientRect();
        // Display, position, and set styles for font
        tooltipEl.style.opacity = 1;
        tooltipEl.style.left = position.left + tooltip.caretX + 'px';
        tooltipEl.style.top = position.top + tooltip.caretY + 'px';
        tooltipEl.style.fontFamily = tooltip._fontFamily;
        tooltipEl.style.fontSize = tooltip.fontSize;
        tooltipEl.style.fontStyle = tooltip._fontStyle;
        tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
      }
    }
  }
};


window.onload = function () {
  window.myRadar1 = new Chart(document.getElementById("radar_chart1"), config1);
};
 


var colorNames = Object.keys(window.chartColors);

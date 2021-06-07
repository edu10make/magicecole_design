var chart = null;

var chartData = {
    labels: ['Question 1', 'Question 2'],
    datasets: [{
            label: 'yes',
            backgroundColor: '#004831',
            data: [714, 233]
        },
        {
            label: 'no',
            backgroundColor: '#76B900',
            data: [800, 451]
        }
    ]
};

var chartOptions = {
    tooltips: {
        mode: 'index',
        intersect: true
    },
    legend: {
        display: false
    },
    responsive: true,
    scales: {
        xAxes: [{
            ticks: {
                beginAtZero: true
            },
            stacked: true
        }],
        yAxes: [{
            ticks: {
                beginAtZero: true
            },
            stacked: false
        }]
    }
};

$(function () {

    chart = new Chart($('#chart'), {
        type: 'bar',
        data: chartData,
        options: chartOptions
    });

    $("input#toggle[type='checkbox']").click(function (event) {
        var isStacked = false;
        if ($(this).is(':checked')) {
            isStacked = true;
        } else {
            isStacked = false;
        }

        chart.options.scales = {
            xAxes: [{
                stacked: isStacked
            }],
            yAxes: [{
                stacked: isStacked
            }]
        };
        chart.update();
    });

});
$(function () {
    Highcharts.chart('colorBarContainer', {

        chart: {
            type: 'bar'
        },

        title: {
            text: 'Styling axes'
        },

        yAxis: [{
            className: 'highcharts-color-0',
            title: {
                text: 'Primary axis'
            }
        }, {
            className: 'highcharts-color-1',
            opposite: true,
            title: {
                text: 'Secondary axis'
            }
        }],

        series: [{
            data: [1, 3, 2, 4]
        }, {
            data: [324, 124, 547, 221],
            yAxis: 1
        }]

    });
});

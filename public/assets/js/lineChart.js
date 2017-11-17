$(function () {
    Highcharts.stockChart('lineContainer', {

        chart: {
            //alignTicks: true // by default
            type: 'line'
        },

        yAxis: [{
            title: {
                text: 'GOOGL'
            }
        }, {
            title: {
                text: 'MSFT'
            },
            gridLineWidth: 0,
            opposite: true
        }],

        rangeSelector: {
            selected: 1
        },

        series: [{
            name: 'GOOGL',
            data: GOOGL
        }, {
            name: 'MSFT',
            data: MSFT,
            yAxis: 1
        }]
    });
});

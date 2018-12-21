var timeFormat = 'mm:ss';
var config = {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Temperature',
      data: [],
      fill: false,
      borderColor: 'red'
    }]
  },
  options: {
    responsive: true,
    title: {
      display: false,
    },
    tooltips: {
      display: false,
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    scales: {
      xAxes: [{
        type: "time",
        time: {
          format: timeFormat,
          tooltipFormat: 'll',
          displayFormats: {
            'millisecond': 'mm:ss',
            'second': 'mm:ss',
            'minute': 'mm:ss',
            'hour': 'mm:ss',
            'day': 'mm:ss',
            'week': 'mm:ss',
            'month': 'mm:ss',
            'quarter': 'mm:ss',
            'year': 'mm:ss'
          }
        },
        ticks: {
          fontColor: "white",
        },
        scaleLabel: {
          display: false,
        }
      }],
      yAxes: [{
        display: true,
        ticks: {
          fontColor: "white",
          beginAtZero: true
        },
        scaleLabel: {
          display: true,
          labelString: '°C'
        }
      }]
    }
  }
};

class TempChart {
  constructor(element) {
    this.ctx = document.getElementById(element).getContext('2d');
  }
  create() {
    this.chart = new Chart(this.ctx, config);
  }
  update(data){
    config.data.datasets[0].data.push({x: moment().format("mm:ss"), y: data});
    this.chart.update();
  }
}



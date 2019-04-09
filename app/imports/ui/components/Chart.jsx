import React from 'react';
import Chart from 'chart.js';

class Charts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chart: '',
      changed: true,
      currentCoin: ''
    };
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
  }
  componentDidUpdate() {
    if (this.props.data.length <= 0) return; 
    let index = 0;

    switch (this.props.coin) {
        case 'BitCoin':
            index = 0;
            break;
        case 'Ethereum':
            index = 1;
            break;
        case 'Litecoin':
            index = 4;
            break;
        case  'Bitcoin Cash':
            index = 5;
            break;
        default:
            index = 0;
    }
    console.log(this.props.coin);
    let that = this;
    setTimeout(() => {
      if (this.props.coin != this.state.currentCoin) {
        that.state.changed = true;
      }
      if (!that.state.changed) return;
      if (that.state.chart) {
        that.state.chart.destroy();
      }
      var ctx = document.getElementById("myChart");
      var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["1h", "24h", "7d"],
            datasets: [{
                label: this.props.coin + " (% Change)",
                data: [this.props.data[index].quote.USD.percent_change_1h, this.props.data[index].quote.USD.percent_change_24h, this.props.data[index].quote.USD.percent_change_7d],
                borderColor: [
                    'rgba(255,99,132,1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
      });
      that.setState({changed: false});
      that.setState({currentCoin: this.props.coin});
      that.setState({chart: myChart});
    }, 0);
  }
  render() {
    return (
        <div>
          <canvas id="myChart"></canvas>
        </div>
    );
  }
}

export default Charts;

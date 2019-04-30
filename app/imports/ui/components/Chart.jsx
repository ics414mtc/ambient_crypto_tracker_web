import React from 'react';
import Chart from 'chart.js';

class Charts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chart: '',
      changed: true,
      currentCoin: '',
        customPortfolioActive: Boolean(false),
        customPortfolio: {},
        submit_count:0,
    };
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
    this.build_portfolio_data = this.build_portfolio_data.bind(this);
  }

  build_portfolio_data() {
      // console.log('build_portfolio_data');
      // console.log(this.props.customPortfolio);
      const indices = {0: 0, 1:1, 2:4, 3:5};
      const keys = ['Bitcoin', 'Ethereum', 'Litecoin', 'BitcoinCash'];
      const bitcoin_weights = keys.map((key) => this.props.customPortfolio[key]);
      const total = bitcoin_weights.reduce((total, curr) => total + curr);
      const pct_chgs_1h = Object.keys(indices).map((index, key) => bitcoin_weights[index] * this.props.data[key].quote.USD.percent_change_1h / total);
      const pct_chgs_24h = Object.keys(indices).map((index, key) => bitcoin_weights[index] * this.props.data[key].quote.USD.percent_change_24h / total);
      const pct_chgs_7d = Object.keys(indices).map((index, key) => bitcoin_weights[index] * this.props.data[key].quote.USD.percent_change_7d / total);
      console.log('build_portfolio_data');
      console.log(bitcoin_weights);
      console.log(total);
      return [pct_chgs_1h.reduce((total, curr) => total + curr), pct_chgs_24h.reduce((total, curr) => total + curr),
          pct_chgs_7d.reduce((total, curr) => total + curr)];
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
    //console.log(this.props.coin);
    let that = this;
    setTimeout(() => {
        if ((this.props.coin != this.state.currentCoin) ||
            (this.props.customPortfolioActive != this.state.customPortfolioActive) ||
            (this.props.submitCount != this.state.submit_count)) {
            that.state.changed = true;
        }
        if (!that.state.changed) return;
        if (that.state.chart) {
            that.state.chart.destroy();
        }
        var ctx = document.getElementById("myChart");
        if (!this.props.customPortfolioActive) {
            var chart_data = [this.props.data[index].quote.USD.percent_change_1h, this.props.data[index].quote.USD.percent_change_24h, this.props.data[index].quote.USD.percent_change_7d]
        } else{
            var chart_data = this.build_portfolio_data();
        }
        console.log('chatdata');
        console.log(chart_data);
      var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["1h", "24h", "7d"],
            datasets: [{
                label: this.props.coin + " (% Change)",
                data: chart_data,
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
      that.setState({customPortfolioActive: this.props.customPortfolioActive});
      that.setState({customPortfolio: this.props.customPortfolio});
      that.setState({submit_count: this.props.submitCount});
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

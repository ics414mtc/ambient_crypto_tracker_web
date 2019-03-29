import { Meteor } from 'meteor/meteor';
import React from 'react';
import {Grid, Button, Container, Form, Header, Table, Range, Radio, Icon, Statistic, Segment } from 'semantic-ui-react';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  /** Initialize component state with properties for login and redirection. */
  constructor() {
    super();
    this.state = {brightness_setting_neg_ten: 5,
                  brightness_setting_neg_five: 5,
                  brightness_setting_neg_two: 5,
                  brightness_setting_neg_one: 5,
                  brightness_setting_zero: 5,
                  brightness_setting_pos_one: 5,
                  brightness_setting_pos_two: 5,
                  brightness_setting_pos_five: 5,
                  brightness_setting_pos_ten: 5,

                  flicker_setting_neg_ten: 5,
                  flicker_setting_neg_five: 5,
                  flicker_setting_neg_two: 5,
                  flicker_setting_neg_one: 5,
                  flicker_setting_zero: 5,
                  flicker_setting_pos_one: 5,
                  flicker_setting_pos_two: 5,
                  flicker_setting_pos_five: 5,
                  flicker_setting_pos_ten: 5,

                  current_flicker: 5,
                  current_brightness: 5,

                  coin_value: 0,

                  coin: 'BitCoin'
    };

    this.light_on =  false;
    Meteor.call('discover', {}, (err) => {
      if (err) {
        alert(err);
      }
    });
    this.handleClick = this.handleClick.bind(this);
    this.handleChangeBrightness = this.handleChangeBrightness.bind(this);
    this.handleChangeCoin = this.handleChangeCoin.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.updateCoin = this.updateCoin.bind(this);
  }

  updateCoin() {
    Meteor.call('request_daily_price', function(err, res) {
      res = JSON.parse(res);
      console.log(res.data);

      let index = 0;

      // get coin index
      switch(this.state.coin) {
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

      this.setState({coin_value: res.data[index].quote.USD.price});

      let current_brightness = 0;
      let current_flicker = 0;

      if (res.data[index].quote.USD.percent_change_7d < -10) {
        current_brightness = this.state.brightness_setting_neg_ten;
        current_flicker = this.state.flicker_setting_neg_ten;
      } else if (res.data[index].quote.USD.percent_change_7d < -5) {
        current_brightness = this.state.brightness_setting_neg_five;
        current_flicker = this.state.flicker_setting_neg_five;
      } else if (res.data[index].quote.USD.percent_change_7d < -2) {
        current_brightness = this.state.brightness_setting_neg_two;
        current_flicker = this.state.flicker_setting_neg_two;
      } else if (res.data[index].quote.USD.percent_change_7d < -1) {
        current_brightness = this.state.brightness_setting_neg_one;
        current_flicker = this.state.flicker_setting_neg_one;
      } else if (res.data[index].quote.USD.percent_change_7d < 0) {
        current_brightness = this.state.brightness_setting_zero;
        current_flicker = this.state.flicker_setting_zero;
      } else if (res.data[index].quote.USD.percent_change_7d < 1) {
        current_brightness = this.state.brightness_setting_pos_one;
        current_flicker = this.state.flicker_setting_pos_one;
      } else if (res.data[index].quote.USD.percent_change_7d < 2) {
        current_brightness = this.state.brightness_setting_pos_two;
        current_flicker = this.state.flicker_setting_pos_two;
      } else if (res.data[index].quote.USD.percent_change_7d < 5) {
        current_brightness = this.state.brightness_setting_pos_five;
        current_flicker = this.state.flicker_setting_pos_five;
      } else {
        current_brightness = this.state.brightness_setting_pos_ten;
        current_flicker = this.state.flicker_setting_pos_ten;
      }

      this.setState({current_brightness: current_brightness});
      this.setState({current_flicker: current_flicker});

      

    }.bind(this));
  }


  componentDidMount() {
    this.updateCoin();
    this.intervalID = Meteor.setInterval(this.updateCoin, 3600000);
  }

  componentWillMount() {
    Meteor.clearInterval(this.intervalID);
  }

  handleChangeBrightness(pct_chg) {
    return function (brightness) {
      const brightness_object = {};
      brightness_object['brightness_setting_'
                          + pct_chg] = brightness.target.value;
      return this.setState(brightness_object);
    }.bind(this);
  }

  handleChangeFlickerRate(pct_chg) {
    return function (flicker_rate) {
      const flicker_object = {};
      flicker_object['flicker_setting_'
                          + pct_chg] = flicker_rate.target.value;
      return this.setState(flicker_object);
    }.bind(this);
  }

  /** Update the form controls each time the user interacts with them. */
  handleChangeCoin(e, {value}) {
    return this.setState({coin: value});
  }

  /** Update the form controls each time the user interacts with them. */
  handleClick() {
    this.light_on = !this.light_on;
    console.log(this.light_on);
    Meteor.call('toggle_light', {light_on: this.light_on}, (err) => {
      if (err) {
        alert(err);
      }
    });
  }

  render() {
    return (
          <Grid celled verticalAlign='middle' textAlign='center' container>

            <Grid.Row color='grey' stretched columns={1}>
              <Header as='h1' textAlign='center'
              inverted style={{ marginTop: '1em',  marginBottom: '1em'}}>
              Ambient Crypto Tracker
              </Header>
            </Grid.Row>

            <Grid.Row columns={2}>
              <Grid.Column>
                <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell colSpan='3' textAlign='center'>
                      Light Settings
                    </Table.HeaderCell>
                  </Table.Row>
                  <Table.Row>
                    <Table.HeaderCell width={3}>
                      Percent Change <Icon name='line graph'/>
                    </Table.HeaderCell>
                    <Table.HeaderCell width={2}>
                      Brightness <Icon name='lightbulb outline'/>
                    </Table.HeaderCell>
                    <Table.HeaderCell width={2}>
                      Flicker Rate <Icon name='lightning'/>
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                  <Table.Body>
                    <Table.Row>
                      <Table.Cell textAlign='center'>-10%</Table.Cell>
                      <Table.Cell>
                        <input type='range' min={0} max={10}
                          value={this.state.brightness_setting_neg_ten}
                          onChange={this.handleChangeBrightness('neg_ten')} />
                      </Table.Cell>
                      <Table.Cell>
                        <input type='range' min={0} max={10}
                          value={this.state.flicker_setting_neg_ten}
                          onChange={this.handleChangeFlickerRate('neg_ten')} />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell textAlign='center'>-5%</Table.Cell>
                      <Table.Cell>
                        <input type='range' min={0} max={10}
                          value={this.state.brightness_setting_neg_five}
                          onChange={this.handleChangeBrightness('neg_five')} />
                      </Table.Cell>
                      <Table.Cell>
                        <input type='range' min={0} max={10}
                          value={this.state.flicker_setting_neg_five}
                          onChange={this.handleChangeFlickerRate('neg_five')} />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell textAlign='center'>-2%</Table.Cell>
                      <Table.Cell>
                        <input type='range' min={0} max={10}
                          value={this.state.brightness_setting_neg_two}
                          onChange={this.handleChangeBrightness('neg_two')} />
                      </Table.Cell>
                      <Table.Cell>
                        <input type='range' min={0} max={10}
                          value={this.state.flicker_setting_neg_two}
                          onChange={this.handleChangeFlickerRate('neg_two')} />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell textAlign='center'>-1%</Table.Cell>
                      <Table.Cell>
                        <input type='range' min={0} max={10}
                          value={this.state.brightness_setting_neg_one}
                          onChange={this.handleChangeBrightness('neg_one')} />
                      </Table.Cell>
                      <Table.Cell>
                        <input type='range' min={0} max={10}
                          value={this.state.flicker_setting_neg_one}
                          onChange={this.handleChangeFlickerRate('neg_one')} />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell textAlign='center'>0%</Table.Cell>
                      <Table.Cell>
                        <input type='range' min={0} max={10}
                          value={this.state.brightness_setting_zero}
                          onChange={this.handleChangeBrightness('zero')} />
                      </Table.Cell>
                      <Table.Cell>
                        <input type='range' min={0} max={10}
                          value={this.state.flicker_setting_zero}
                          onChange={this.handleChangeFlickerRate('zero')} />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell textAlign='center'>+1%</Table.Cell>
                      <Table.Cell>
                        <input type='range' min={0} max={10}
                          value={this.state.brightness_setting_pos_one}
                          onChange={this.handleChangeBrightness('pos_one')} />
                      </Table.Cell>
                      <Table.Cell>
                        <input type='range' min={0} max={10}
                          value={this.state.flicker_setting_pos_one}
                          onChange={this.handleChangeFlickerRate('pos_one')} />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell textAlign='center'>+2%</Table.Cell>
                      <Table.Cell>
                        <input type='range' min={0} max={10}
                          value={this.state.brightness_setting_pos_two}
                          onChange={this.handleChangeBrightness('pos_two')} />
                      </Table.Cell>
                      <Table.Cell>
                        <input type='range' min={0} max={10}
                          value={this.state.flicker_setting_pos_two}
                          onChange={this.handleChangeFlickerRate('pos_two')} />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell textAlign='center'>+5%</Table.Cell>
                      <Table.Cell>
                        <input type='range' min={0} max={10}
                          value={this.state.brightness_setting_pos_five}
                          onChange={this.handleChangeBrightness('pos_five')} />
                      </Table.Cell>
                      <Table.Cell>
                        <input type='range' min={0} max={10}
                          value={this.state.flicker_setting_pos_five}
                          onChange={this.handleChangeFlickerRate('pos_five')} />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell textAlign='center'>+10%</Table.Cell>
                      <Table.Cell>
                        <input type='range' min={0} max={10}
                          value={this.state.brightness_setting_pos_ten}
                          onChange={this.handleChangeBrightness('pos_ten')} />
                      </Table.Cell>
                      <Table.Cell>
                        <input type='range' min={0} max={10}
                          value={this.state.flicker_setting_pos_ten}
                          onChange={this.handleChangeFlickerRate('pos_ten')} />
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Grid.Column>

              <Grid.Column>
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell colSpan='1' textAlign='center'>
                        Coin Settings
                      </Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                      <Table.HeaderCell>
                        Coin to Track <Icon name='dollar'/>
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>
                        <Form>
                          <Form.Field>
                            Selected value: <b>{this.state.value}</b>
                          </Form.Field>
                          <Form.Field>
                            <Radio
                                label='BitCoin'
                                name='radioGroup'
                                value='BitCoin'
                                checked={this.state.coin === 'BitCoin'}
                                onChange={this.handleChangeCoin}
                            />
                          </Form.Field>
                          <Form.Field>
                            <Radio
                                label='Ethereum'
                                name='radioGroup'
                                value='Ethereum'
                                checked={this.state.coin === 'Ethereum'}
                                onChange={this.handleChangeCoin}
                            />
                          </Form.Field>
                          <Form.Field>
                            <Radio
                                label='Litecoin'
                                name='radioGroup'
                                value='Litecoin'
                                checked={this.state.coin === 'Litecoin'}
                                onChange={this.handleChangeCoin}
                            />
                          </Form.Field>
                          <Form.Field>
                            <Radio
                                label='Bitcoin Cash'
                                name='radioGroup'
                                value='Bitcoin Cash'
                                checked={this.state.coin === 'Bitcoin Cash'}
                                onChange={this.handleChangeCoin}
                            />
                          </Form.Field>
                        </Form>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Segment inverted>
                <Statistic inverted>
                  <Statistic.Value>{this.state.coin_value}</Statistic.Value>
                  <Statistic.Label>{this.state.coin} Value</Statistic.Label>
                </Statistic>
              </Segment>
            </Grid.Row>

            <Grid.Row columns={1}>
              <Container fluid >
                <Button onClick={this.handleClick}>
                  Switch Light Bulb On/Off
                </Button>
              </Container>
            </Grid.Row>

          </Grid>
    );
  }


}

export default Landing;

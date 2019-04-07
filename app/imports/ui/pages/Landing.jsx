import { Meteor } from 'meteor/meteor';
import React from 'react';
import _ from 'underscore';
import {Grid, Button, Container, Form, Header, Table, Range, Radio, Icon, Statistic, Segment, Menu, Reveal} from 'semantic-ui-react';
import LightSetting from '/imports/ui/components/LightSetting';
import StuffItem from "./ListStuff";

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  /** Initialize component state with properties for login and redirection. */
  constructor() {
    super();
    this.state = {
      light_settings: {
        neg_ten: {
          pct_chg: Number(-10),
          brightness_setting: Number(5),
          flicker_setting: Number(5)
        },
        neg_five: {
          pct_chg: Number(-5),
          brightness_setting: Number(5),
          flicker_setting: Number(5)
        },
        neg_two: {
          pct_chg: Number(-2),
          brightness_setting: Number(5),
          flicker_setting: Number(5)
        },
        neg_one: {
          pct_chg: Number(-1),
          brightness_setting: Number(5),
          flicker_setting: Number(5)
        },
        zero: {
          pct_chg: Number(0),
          brightness_setting: Number(5),
          flicker_setting: Number(5)
        },
        pos_one: {
          pct_chg: Number(1),
          brightness_setting: Number(5),
          flicker_setting: Number(5)
        },
        pos_two: {
          pct_chg: Number(2),
          brightness_setting: Number(5),
          flicker_setting: Number(5)
        },
        pos_five: {
          pct_chg: Number(5),
          brightness_setting: Number(5),
          flicker_setting: Number(5)
        },
        pos_ten: {
          pct_chg: Number(10),
          brightness_setting: Number(5),
          flicker_setting: Number(5)
        },
      },

      current_flicker: 5,
      current_brightness: 5,
      current_pct_chg: 0,

      coin_value: 0,

      coin: 'BitCoin',

      display: 'Light Settings'
    };

    this.light_on =  false;
    Meteor.call('discover', {}, (err) => {
      if (err) {
        alert(err);
      }
    });
    this.handleClick = this.handleClick.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleChangeBrightness = this.handleChangeBrightness.bind(this);
    this.handleChangeCoin = this.handleChangeCoin.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.updateCoin = this.updateCoin.bind(this);
    this.updateSettings = this.updateSettings.bind(this);
  }

  updateCoin() {
    Meteor.call('request_daily_price', function(err, res) {
      res = JSON.parse(res);
      console.log(res.data);

      let current_brightness = 0;
      let current_flicker = 0;
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

      const current_pct_chg = res.data[index].quote.USD.percent_change_7d;

      this.setState({coin_value: res.data[index].quote.USD.price});
      this.setState({current_pct_chg: current_pct_chg});

      const pct_chgs = _.pluck(this.state.light_settings, 'pct_chg');
      const closest_pct_chg = _.reduce(pct_chgs, (prev, curr) =>
          Math.abs(curr - current_pct_chg) < Math.abs(prev - current_pct_chg) ? curr : prev)
      const current_setting = _.find(this.state.light_settings, (setting) => setting.pct_chg == closest_pct_chg)

      console.log(pct_chgs);
      console.log(this.state.current_pct_chg);
      console.log(closest_pct_chg);
      console.log(current_setting);

      this.setState({current_brightness: current_setting.brightness_setting});
      this.setState({current_flicker: current_setting.flicker_setting});

      console.log("updateCoin brightness " + this.state.current_brightness);
      console.log("updateCoin flicker " + this.state.current_flicker);

      Meteor.call('flicker', {flicker: this.state.current_flicker, brightness: (this.state.current_brightness * 10)}, (err) => {
        if (err) {
          alert(err);
        }
      });

    }.bind(this));
  }

  updateSettings() {
    const pct_chgs = _.pluck(this.state.light_settings, 'pct_chg');
    const closest_pct_chg = _.reduce(pct_chgs, (prev, curr) =>
        Math.abs(curr - this.state.current_pct_chg) < Math.abs(prev - this.state.current_pct_chg) ? curr : prev)
    const current_setting = _.find(this.state.light_settings, (setting) => setting.pct_chg == closest_pct_chg)

    console.log(pct_chgs);
    console.log(this.state.current_pct_chg);
    console.log(closest_pct_chg);
    console.log(current_setting);

    this.setState({current_brightness: current_setting.brightness_setting});
    this.setState({current_flicker: current_setting.flicker_setting});

    console.log("updateSettings brightness " + this.state.current_brightness);
    console.log("updateSettings flicker " + this.state.current_flicker);

    Meteor.call('flicker', {flicker: this.state.current_flicker, brightness: (this.state.current_brightness * 10)},
        (err) => {
          if (err) {
            alert(err);
          }
        });
  }

  componentDidMount() {
    this.updateCoin();
    this.intervalID = Meteor.setInterval(this.updateCoin, 3600000);
  }

  componentWillMount() {
    Meteor.clearInterval(this.intervalID);
  }

  handleChangeBrightness(key) {
    return function (brightness) {
      const brightness_object = Object.assign({}, this.state.light_settings);
      brightness_object[key].brightness_setting = brightness.target.value;
      const ret_val = this.setState(brightness_object, this.updateSettings);
      console.log("handleChangeBrightness: " + "brightness_setting_" + key + " " +
          this.state.light_settings[key].brightness_setting);
      return ret_val
    }.bind(this);
  }

  handleChangeFlickerRate(key) {
    return function (flicker) {
      const flicker_object = Object.assign({}, this.state.light_settings);;
      flicker_object[key].flicker_setting = flicker.target.value;
      const ret_val = this.setState(flicker_object, this.updateSettings);
      return ret_val;
    }.bind(this);
  }

  /** Update the form controls each time the user interacts with them. */
  handleChangeCoin(e, {value}) {
    this.updateCoin();
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

  handleMenuClick(e, { name }) {
    this.setState({display: name})
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

            <Grid.Row columns={1}>
              <Grid.Column>
                <Menu attached='top' tabular>
                  <Menu.Item name='Light Settings' active={this.state.display === 'Light Settings'}
                             onClick={this.handleMenuClick}/>
                  <Menu.Item name='Coin Settings' active={this.state.display === 'Coin Settings'}
                             onClick={this.handleMenuClick}/>
                </Menu>

                <Segment attached='bottom' style={this.state.display === 'Light Settings'? Object({display: 'block'}): Object({display: 'none'})}>
                      <Table celled>
                      <Table.Header>
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
                        {Object.keys(this.state.light_settings).map((key, index) =>
                            <LightSetting key={key}
                                          pct_chg={this.state.light_settings[key].pct_chg}
                                          brightness_setting={this.state.light_settings[key].brightness}
                                          flicker_setting={this.state.light_settings[key].flicker}
                                          handleChangeBrightness={this.handleChangeBrightness(key)}
                                          handleChangeFlicker={this.handleChangeFlickerRate(key)}
                            />)}
                      </Table.Body>
                    </Table>
                </Segment>

                <Segment attached='bottom' style={this.state.display === 'Coin Settings'? Object({display: 'block'}): Object({display: 'none'})}>
                <Table>
                      <Table.Header>
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
                </Segment>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Segment inverted raised padded>
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

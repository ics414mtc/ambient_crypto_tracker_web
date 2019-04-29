import {Meteor} from 'meteor/meteor';
import React from 'react';
import _ from 'underscore';
import {
    Grid,
    Button,
    Container,
    Form,
    Header,
    Table,
    Range,
    Radio,
    Input,
    Image,
    Icon,
    Statistic,
    Segment,
    Menu,
    Reveal,
    Label
} from 'semantic-ui-react';
// load math.js (using node.js)
import LightSetting from '/imports/ui/components/LightSetting';
import AutoForm from 'uniforms-semantic/AutoForm';
import NumField from 'uniforms-semantic/NumField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import SimpleSchema from 'simpl-schema';
import Chart from '/imports/ui/components/Chart';

const settingSchema = new SimpleSchema({
    pct_chg: Number
});


const customPortfolioSchema = new SimpleSchema({
    Bitcoin: {
        type: Number,
        optional: true,
        defaultValue: Number(0)},
    Ethereum: {
        type: Number,
        optional: true,
        defaultValue: Number(0)},
    Litecoin: {
        type: Number,
        optional: true,
        defaultValue: Number(0)},
    BitcoinCash: {
        type: Number,
        optional: true,
        defaultValue: Number(0)},
});

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
                    flicker_setting: Number(5),
                    active: Boolean(false),
                },
                neg_five: {
                    pct_chg: Number(-5),
                    brightness_setting: Number(5),
                    flicker_setting: Number(5),
                    active: Boolean(false),
                },
                neg_two: {
                    pct_chg: Number(-2),
                    brightness_setting: Number(5),
                    flicker_setting: Number(5),
                    active: Boolean(false),
                },
                neg_one: {
                    pct_chg: Number(-1),
                    brightness_setting: Number(5),
                    flicker_setting: Number(5),
                    active: Boolean(false),
                },
                zero: {
                    pct_chg: Number(0),
                    brightness_setting: Number(5),
                    flicker_setting: Number(5),
                    active: Boolean(false),
                },
                pos_one: {
                    pct_chg: Number(1),
                    brightness_setting: Number(5),
                    flicker_setting: Number(5),
                    active: Boolean(false),
                },
                pos_two: {
                    pct_chg: Number(2),
                    brightness_setting: Number(5),
                    flicker_setting: Number(5),
                    active: Boolean(false),
                },
                pos_five: {
                    pct_chg: Number(5),
                    brightness_setting: Number(5),
                    flicker_setting: Number(5),
                    active: Boolean(false),
                },
                pos_ten: {
                    pct_chg: Number(10),
                    brightness_setting: Number(5),
                    flicker_setting: Number(5),
                    active: Boolean(false),
                },
            },

            current_flicker: 5,
            current_brightness: 5,
            current_pct_chg: 0,

            coin_value: 0,

            coin: 'Bitcoin',
            coin_image_sources: {
                Bitcoin: 'https://en.bitcoin.it/w/images/en/2/29/BC_Logo_.png',
                Ethereum: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/628px-Ethereum_logo_2014.svg.png',
                Litecoin: 'http://static1.squarespace.com/static/5a78883ba803bb706feafd92/t/5a7abe384192028e23fd111b/1517996289500/CUu4Xvk.jpg?format=1500w',
                BitcoinCash: 'https://i.redd.it/nus982esrz901.png'
            },

            customPortfolio: {
                active: false,
                Bitcoin: Number(0),
                Ethereum: Number(0),
                Litecoin: Number(0),
                BitcoinCash: Number(0),
            },

            display: 'Light Settings',

            data: []
        };

        this.formRef = null;
        this.coinFormRef = null;

        this.light_on = false;
        Meteor.call('discover', {}, (err) => {
            if (err) {
                alert(err);
            }
        });
        this.handleClick = this.handleClick.bind(this);
        this.submit = this.submit.bind(this);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.handleActiveSettingClick = this.handleActiveSettingClick.bind(this);
        this.handleActiveCustomPortfolio = this.handleActiveCustomPortfolio.bind(this);
        this.handleDeleteSettingClick = this.handleDeleteSettingClick.bind(this);
        this.handleChangeBrightness = this.handleChangeBrightness.bind(this);
        this.submitChangePortfolio = this.submitChangePortfolio.bind(this);
        this.handleChangeCoin = this.handleChangeCoin.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.updateCoin = this.updateCoin.bind(this);
        this.updateSettings = this.updateSettings.bind(this);
    }

    updateCoin() {
        Meteor.call('request_daily_price', function (err, res) {
            res = JSON.parse(res);
            this.setState({data: res.data});
            console.log(res.data);

            let current_brightness = 0;
            let current_flicker = 0;
            let index = 0;

            // get coin index
            switch (this.state.coin) {
                case 'BitCoin':
                    index = 0;
                    break;
                case 'Ethereum':
                    index = 1;
                    break;
                case 'Litecoin':
                    index = 4;
                    break;
                case  'BitcoinCash':
                    index = 5;
                    break;
                default:
                    index = 0;
            }

            let current_pct_chg = 0;

            let timeFrame = this.state.time;
            if (this.state.time === null) {
                timeFrame = 0;
            }
            console.log("update coin time frame: " + timeFrame);
            console.log("update coint this.state.time: " + this.state.time);

            switch (timeFrame) {
                case '0':
                    console.log("1h");
                    current_pct_chg = res.data[index].quote.USD.percent_change_1h;
                    break;
                case '1':
                    current_pct_chg = res.data[index].quote.USD.percent_change_24h;
                    console.log("24h");
                    break;
                case '2':
                    current_pct_chg = res.data[index].quote.USD.percent_change_7d;
                    console.log("7d");
                    break;
            }

            this.setState({coin_value: res.data[index].quote.USD.price});
            this.setState({coin_value: res.data[index].quote.USD.price});
            this.setState({current_pct_chg: current_pct_chg}, this.updateSettings());
        }.bind(this));
    }

    updateSettings() {
        const active_light_settings = _.where(this.state.light_settings, {active: true})
        const pct_chgs = _.pluck(active_light_settings, 'pct_chg');
        const closest_pct_chg = _.reduce(pct_chgs, (prev, curr) =>
            Math.abs(curr - this.state.current_pct_chg) < Math.abs(prev - this.state.current_pct_chg) ? curr : prev)
        const current_setting = _.find(this.state.light_settings, (setting) => setting.pct_chg == closest_pct_chg)

        console.log(pct_chgs);
        console.log(this.state.current_pct_chg);
        console.log(closest_pct_chg);
        console.log(current_setting);

        current_setting !== undefined ? this.setState({current_brightness: current_setting.brightness_setting}) :
            this.setState({current_brightness: 1});
        current_setting !== undefined ? this.setState({current_flicker: current_setting.flicker_setting}) :
            this.setState({current_flicker: 0});

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

    handleActiveCustomPortfolio() {
        const active_object = Object.assign({}, this.state.customPortfolio);
        active_object.active = !this.state.customPortfolio.active;
        console.log("handleActiveCustomPortfolio: object: ");
        console.log(active_object);
        this.setState({customPortfolio: active_object});
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

    submitChangePortfolio(data){
        const portfolio = data;
        const portfolio_object = Object.assign({}, this.state.customPortfolio);
        // TODO
        // for each key in data update portfolio_object.key to new value
        console.log("submitChangePortfolio: data: ");
        console.log(data);
    }

    handleChangeFlickerRate(key) {
        return function (flicker) {
            const flicker_object = Object.assign({}, this.state.light_settings);
            flicker_object[key].flicker_setting = flicker.target.value;
            const ret_val = this.setState(flicker_object, this.updateSettings);
            return ret_val;
        }.bind(this);
    }

    /** Update the form controls each time the user interacts with them. */
    handleChangeCoin(e, {value}) {
        return this.setState({coin: value}, this.updateCoin);
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

    submit(data) {
        const {pct_chg} = data;
        const setting_object = Object.assign({}, this.state.light_settings);
        setting_object[pct_chg] = Object({
            pct_chg: Number(pct_chg),
            brightness_setting: Number(5),
            flicker_setting: Number(5),
            active: Boolean(false),
        });
        this.setState({light_settings: setting_object}, this.updateSettings);
        this.formRef.reset();
        console.log(this.state);
    }

    handleTimeChange(e, {value}) {
        console.log('handleTimeChange: ' + value);
        return this.setState({time: value}, this.updateCoin);
    }

    handleMenuClick(e, {name}) {
        this.setState({display: name});
    }

    handleDeleteSettingClick(key) {
        return function () {
            const setting_object = Object.assign({}, this.state.light_settings);
            delete setting_object[key];
            this.setState({light_settings: setting_object}, this.updateSettings);
        }.bind(this);
    }

    handleActiveSettingClick(key) {
        return function () {
            const setting_object = Object.assign({}, this.state.light_settings);
            setting_object[key].active = !setting_object[key].active;
            this.setState(setting_object, this.updateSettings);
        }.bind(this);
    }

    render() {
        return (
            <Grid stackable celled verticalAlign='middle' textAlign='center' container>

                <Grid.Row color='grey' stretched columns={1}>
                    <Header as='h1' textAlign='center'
                            inverted style={{marginTop: '1em', marginBottom: '1em'}}>
                        Ambient Crypto Tracker
                    </Header>
                </Grid.Row>

                <Grid.Row columns={2}>
                    <Grid.Column width={9}>
                        <Menu attached='top' tabular>
                            <Menu.Item name='Light Settings' active={this.state.display === 'Light Settings'}
                                       onClick={this.handleMenuClick}/>
                            <Menu.Item name='Coin Settings' active={this.state.display === 'Coin Settings'}
                                       onClick={this.handleMenuClick}/>
                        </Menu>

                        <Segment attached='bottom'
                                 style={this.state.display === 'Light Settings' ? Object({display: 'block'}) : Object({display: 'none'})}>
                            <Table celled>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell width={1}>
                                            Setting State<Icon name='play circle outline'/>
                                        </Table.HeaderCell>
                                        <Table.HeaderCell width={1}>
                                            Percent Change <Icon name='line graph'/>
                                        </Table.HeaderCell>
                                        <Table.HeaderCell width={1}>
                                            Brightness <Icon name='lightbulb outline'/>
                                        </Table.HeaderCell>
                                        <Table.HeaderCell width={1}>
                                            Flicker Rate <Icon name='lightning'/>
                                        </Table.HeaderCell>
                                        <Table.HeaderCell width={1}>
                                            Delete Setting <Icon name='delete'/>
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {Object.keys(this.state.light_settings).map((key, index) =>
                                        <LightSetting key={key}
                                                      pct_chg={this.state.light_settings[key].pct_chg}
                                                      brightness_setting={this.state.light_settings[key].brightness}
                                                      flicker_setting={this.state.light_settings[key].flicker}
                                                      active={this.state.light_settings[key].active}
                                                      handleChangeBrightness={this.handleChangeBrightness(key)}
                                                      handleChangeFlicker={this.handleChangeFlickerRate(key)}
                                                      activateButtonOnClick={this.handleActiveSettingClick(key)}
                                                      deleteButtonOnClick={this.handleDeleteSettingClick(key)}
                                        />)}
                                </Table.Body>
                            </Table>

                            <Container>
                                <AutoForm ref={(ref) => {
                                    this.formRef = ref;
                                }} schema={settingSchema} onSubmit={this.submit}>
                                    <Header>Add a New Light Setting</Header>
                                    <Segment>
                                        <NumField name='pct_chg' label='Percent Change' decimal={false}/>
                                        <SubmitField value='Submit'/>
                                        <ErrorsField/>
                                    </Segment>
                                </AutoForm>
                            </Container>
                        </Segment>

                        <Segment attached='bottom'
                                 style={this.state.display === 'Coin Settings' ? Object({display: 'block'}) : Object({display: 'none'})}>
                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell colSpan='2'>
                                            Track Single Coin
                                        </Table.HeaderCell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.HeaderCell>
                                            Coin to Track <Icon name='dollar'/>
                                        </Table.HeaderCell>
                                        <Table.HeaderCell>
                                            Time Frame <Icon name='clock'/>
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell>
                                            <Form>
                                                <Form.Field disabled={this.state.customPortfolio.active}>
                                                    Selected value: <b>{this.state.value}</b>
                                                </Form.Field>
                                                <Form.Field disabled={this.state.customPortfolio.active}>
                                                    <Radio
                                                        name='radioGroup'
                                                        value='Bitcoin'
                                                        checked={this.state.coin === 'Bitcoin'}
                                                        onChange={this.handleChangeCoin}
                                                    />
                                                    <Label as='a' image>
                                                        <img src={this.state.coin_image_sources.Bitcoin}/>
                                                        Bitcoin
                                                    </Label>
                                                </Form.Field>
                                                <Form.Field disabled={this.state.customPortfolio.active}>
                                                    <Radio
                                                        name='radioGroup'
                                                        value='Ethereum'
                                                        checked={this.state.coin === 'Ethereum'}
                                                        onChange={this.handleChangeCoin}
                                                    />
                                                    <Label as='a' image>
                                                        <img src={this.state.coin_image_sources.Ethereum}/>
                                                        Ethereum
                                                    </Label>
                                                </Form.Field>
                                                <Form.Field disabled={this.state.customPortfolio.active}>
                                                    <Radio
                                                        name='radioGroup'
                                                        value='Litecoin'
                                                        checked={this.state.coin === 'Litecoin'}
                                                        onChange={this.handleChangeCoin}
                                                    />
                                                    <Label as='a' image>
                                                        <img src={this.state.coin_image_sources.Litecoin}/>
                                                        Litecoin
                                                    </Label>
                                                </Form.Field>
                                                <Form.Field disabled={this.state.customPortfolio.active}>
                                                    <Radio
                                                        name='radioGroup'
                                                        value='BitcoinCash'
                                                        checked={this.state.coin === 'BitcoinCash'}
                                                        onChange={this.handleChangeCoin}
                                                    />
                                                    <Label as='a' image>
                                                        <img src={this.state.coin_image_sources.BitcoinCash}/>
                                                        Bitcoin Cash
                                                    </Label>
                                                </Form.Field>
                                            </Form>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Form>
                                                <Form.Field disabled={this.state.customPortfolio.active}>
                                                    Selected value: <b>{this.state.value}</b>
                                                </Form.Field>
                                                <Form.Field disabled={this.state.customPortfolio.active}>
                                                    <Radio
                                                        name='radioGroup'
                                                        value='0'
                                                        checked={this.state.time === '0'}
                                                        onChange={this.handleTimeChange}
                                                    />
                                                    <Label>1h</Label>
                                                </Form.Field>
                                                <Form.Field disabled={this.state.customPortfolio.active}>
                                                    <Radio
                                                        name='radioGroup'
                                                        value='1'
                                                        checked={this.state.time === '1'}
                                                        onChange={this.handleTimeChange}
                                                    />
                                                    <Label>24h</Label>
                                                </Form.Field>
                                                <Form.Field disabled={this.state.customPortfolio.active}>
                                                    <Radio
                                                        name='radioGroup'
                                                        value='2'
                                                        checked={this.state.time === '2'}
                                                        onChange={this.handleTimeChange}
                                                    />
                                                    <Label>7d</Label>
                                                </Form.Field>
                                            </Form>
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>

                                <Table.Footer fullWidth>
                                    <Table.Row>
                                        <Table.HeaderCell colSpan='2'>
                                            <Button active={!this.state.customPortfolio.active}
                                                    color={!this.state.customPortfolio.active ? 'green' : 'grey'}
                                                    onClick={this.handleActiveCustomPortfolio}
                                                    compact>
                                                {!this.state.customPortfolio.active ? 'Active' : 'Disabled'}
                                            </Button>
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Footer>
                            </Table>

                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell colSpan='2'>
                                            Track Custom Portfolio
                                        </Table.HeaderCell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.HeaderCell>
                                            Portfolio Coin Amounts <Icon name='dollar'/>
                                        </Table.HeaderCell>
                                        <Table.HeaderCell>
                                            Time Frame <Icon name='clock'/>
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell>
                                            <AutoForm ref={(ref) => {
                                                this.coinFormRef = ref;
                                            }} schema={customPortfolioSchema}
                                                      onSubmit={this.submitChangePortfolio}>
                                                <Segment>
                                                    <NumField name='Bitcoin'
                                                              label={<Label as='a' image>
                                                                  <img src={this.state.coin_image_sources.Bitcoin}/>
                                                                  Bitcoin
                                                              </Label>}
                                                              decimal={true}
                                                              placeholder='0'
                                                              disabled={!this.state.customPortfolio.active}>
                                                    </NumField>
                                                    <NumField name='Ethereum'
                                                              label={<Label as='a' image>
                                                                  <img src={this.state.coin_image_sources.Ethereum}/>
                                                                  Ethereum
                                                              </Label>}
                                                              decimal={true}
                                                              placeholder='0'
                                                              disabled={!this.state.customPortfolio.active}>
                                                    </NumField>
                                                    <NumField name='Litecoin'
                                                              label={<Label as='a' image>
                                                                  <img src={this.state.coin_image_sources.Litecoin}/>
                                                                  Litecoin
                                                              </Label>}
                                                              decimal={true}
                                                              placeholder='0'
                                                              disabled={!this.state.customPortfolio.active}>
                                                    </NumField>
                                                    <NumField name='BitcoinCash'
                                                              label={<Label as='a' image>
                                                                  <img src={this.state.coin_image_sources.BitcoinCash}/>
                                                                  Bitcoin Cash
                                                              </Label>}
                                                              decimal={true}
                                                              placeholder='0'
                                                              disabled={!this.state.customPortfolio.active}>
                                                    </NumField>
                                                    <SubmitField value='Submit'
                                                                 disabled={!this.state.customPortfolio.active}/>
                                                    <ErrorsField/>
                                                </Segment>
                                            </AutoForm>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Form>
                                                <Form.Field disabled={!this.state.customPortfolio.active}>
                                                    Selected value: <b>{this.state.value}</b>
                                                </Form.Field>
                                                <Form.Field disabled={!this.state.customPortfolio.active}>
                                                    <Radio
                                                        name='radioGroup'
                                                        value='0'
                                                        checked={this.state.time === '0'}
                                                        onChange={this.handleTimeChange}
                                                    />
                                                    <Label>1h</Label>
                                                </Form.Field>
                                                <Form.Field disabled={!this.state.customPortfolio.active}>
                                                    <Radio
                                                        name='radioGroup'
                                                        value='1'
                                                        checked={this.state.time === '1'}
                                                        onChange={this.handleTimeChange}
                                                    />
                                                    <Label>24h</Label>
                                                </Form.Field>
                                                <Form.Field disabled={!this.state.customPortfolio.active}>
                                                    <Radio
                                                        name='radioGroup'
                                                        value='2'
                                                        checked={this.state.time === '2'}
                                                        onChange={this.handleTimeChange}
                                                    />
                                                    <Label>7d</Label>
                                                </Form.Field>
                                            </Form>
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>

                                <Table.Footer fullWidth>
                                    <Table.Row>
                                        <Table.HeaderCell colSpan='2'>
                                            <Button active={this.state.customPortfolio.active}
                                                    color={this.state.customPortfolio.active ? 'green' : 'grey'}
                                                    onClick={this.handleActiveCustomPortfolio}
                                                    compact>
                                                {this.state.customPortfolio.active ? 'Active' : 'Disabled'}
                                            </Button>
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Footer>
                            </Table>
                        </Segment>
                    </Grid.Column>

                    <Grid.Column width={6}>
                        <Grid.Row>
                            <Chart coin={this.state.coin} data={this.state.data}/>
                        </Grid.Row>

                        <Grid.Row>
                            <Segment inverted raised padded>
                                <Statistic inverted>
                                    <Statistic.Value>
                                        <Image src={this.state.coin_image_sources[this.state.coin]} inline/>
                                        {Math.round(this.state.coin_value * 100) / 100}
                                    </Statistic.Value>
                                    <Statistic.Label>{this.state.coin} Value</Statistic.Label>
                                </Statistic>
                            </Segment>
                        </Grid.Row>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row columns={1}>
                    <Container fluid>
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

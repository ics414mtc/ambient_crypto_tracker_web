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
import Settings from './Settings';

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
            time: 0,
            timeString: '1H',

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
        this.handleActiveCustomPortfolio = this.handleActiveCustomPortfolio.bind(this);
        this.submitChangePortfolio = this.submitChangePortfolio.bind(this);
        this.handleChangeCoin = this.handleChangeCoin.bind(this);
        this.handleChangeBrightness = this.handleChangeBrightness.bind(this);
        this.handleChangeFlickerRate = this.handleChangeFlickerRate.bind(this);
        this.handleActiveSettingClick = this.handleActiveSettingClick.bind(this);
        this.handleDeleteSettingClick = this.handleDeleteSettingClick.bind(this);
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
                this.state.time = 0;
            }
            console.log("update coin time frame: " + timeFrame);
            console.log("update coint this.state.time: " + this.state.time);

            switch (timeFrame) {
                case '0':
                    console.log("1h");
                    this.state.timeString = "1h";
                    current_pct_chg = res.data[index].quote.USD.percent_change_1h;
                    break;
                case '1':
                    current_pct_chg = res.data[index].quote.USD.percent_change_24h;
                    this.state.timeString = "24h";
                    console.log("24h");
                    break;
                case '2':
                    current_pct_chg = res.data[index].quote.USD.percent_change_7d;
                    this.state.timeString = "7d";
                    console.log("7d");
                    break;
            }

            this.setState({coin_value: res.data[index].quote.USD.price});
            this.setState({current_pct_chg: current_pct_chg}, this.updateSettings());
        }.bind(this));
    }

    updateSettings() {
        const active_light_settings = _.where(this.state.light_settings, {active: true})
        const pct_chgs = _.pluck(active_light_settings, 'pct_chg');
        const closest_pct_chg = _.reduce(pct_chgs, (prev, curr) =>
            Math.abs(curr - this.state.current_pct_chg) < Math.abs(prev - this.state.current_pct_chg) ? curr : prev);
        const current_setting = _.find(this.state.light_settings, (setting) => setting.pct_chg == closest_pct_chg);

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
    handleActiveSettingClick(key) {
        return function () {
            const setting_object = Object.assign({}, this.state.light_settings);
            setting_object[key].active = !setting_object[key].active;
            this.setState(setting_object, this.updateSettings);
        }.bind(this);
    }

    handleDeleteSettingClick(key) {
        return function () {
            const setting_object = Object.assign({}, this.state.light_settings);
            delete setting_object[key];
            this.setState({light_settings: setting_object}, this.updateSettings);
        }.bind(this);
    }

    handleTimeChange(e, {value}) {
        console.log('handleTimeChange: ' + value);
        return this.setState({time: value}, this.updateCoin);
    }

    handleMenuClick(e, {name}) {
        this.setState({display: name});
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

                <Settings 
                    handleDeleteSettingClick={this.handleDeleteSettingClick} 
                    handleActiveSettingClick={this.handleActiveSettingClick} 
                    handleChangeFlickerRate={this.handleChangeFlickerRate} 
                    handleChangeBrightness={this.handleChangeBrightness} 
                    handleMenuClick={this.handleMenuClick} 
                    handleChangeCoin={this.handleChangeCoin}
                    handleTimeChange={this.handleTimeChange}
                    handleActiveCustomPortfolio={this.handleActiveCustomPortfolio}
                    submitChangePortfolio={this.submitChangePortfolio}
                    submit={this.submit}
                    state={this.state} 
                />

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

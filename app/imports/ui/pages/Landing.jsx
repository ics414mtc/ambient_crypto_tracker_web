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
    Icon,
    Statistic,
    Segment,
    Menu,
    Reveal,
    Label
} from 'semantic-ui-react';
import LightSetting from '/imports/ui/components/LightSetting';
import AutoForm from 'uniforms-semantic/AutoForm';
import NumField from 'uniforms-semantic/NumField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import SimpleSchema from 'simpl-schema';

const settingSchema = new SimpleSchema({
    pct_chg: Number
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

            display: 'Light Settings'
        };

        this.formRef = null;

        this.light_on = false;
        Meteor.call('discover', {}, (err) => {
            if (err) {
                alert(err);
            }
        });
        this.handleClick = this.handleClick.bind(this);
        this.submit = this.submit.bind(this);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.handleActiveSettingClick = this.handleActiveSettingClick.bind(this);
        this.handleDeleteSettingClick = this.handleDeleteSettingClick.bind(this);
        this.handleChangeBrightness = this.handleChangeBrightness.bind(this);
        this.handleChangeCoin = this.handleChangeCoin.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.updateCoin = this.updateCoin.bind(this);
        this.updateSettings = this.updateSettings.bind(this);
    }

    updateCoin() {
        Meteor.call('request_daily_price', function (err, res) {
            res = JSON.parse(res);
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
                case  'Bitcoin Cash':
                    index = 5;
                    break;
                default:
                    index = 0;
            }

            const current_pct_chg = res.data[index].quote.USD.percent_change_7d;

            this.setState({coin_value: res.data[index].quote.USD.price});
            this.setState({current_pct_chg: current_pct_chg});

            this.updateSettings();

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
            const flicker_object = Object.assign({}, this.state.light_settings);
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

    submit(data) {
        const { pct_chg } = data;
        const setting_object = Object.assign({}, this.state.light_settings);
        setting_object[pct_chg] = Object({
            pct_chg: Number(pct_chg),
            brightness_setting: Number(5),
            flicker_setting: Number(5),
            active: Boolean(false),
        });
        this.setState({light_settings: setting_object});
        this.formRef.reset();
        console.log(this.state);
    }

    handleMenuClick(e, {name}) {
        this.setState({display: name})
    }

    handleDeleteSettingClick(key) {
        return function () {
            const setting_object = Object.assign({}, this.state.light_settings);
            delete setting_object[key];
            this.setState({light_settings: setting_object});
        }.bind(this);
    }

    handleActiveSettingClick(key) {
        return function () {
            const setting_object = Object.assign({}, this.state.light_settings);
            setting_object[key].active = !setting_object[key].active;
            this.setState(setting_object);
        }.bind(this);
    }

    render() {
        return (
            <Grid celled verticalAlign='middle' textAlign='center' container>

                <Grid.Row color='grey' stretched columns={1}>
                    <Header as='h1' textAlign='center'
                            inverted style={{marginTop: '1em', marginBottom: '1em'}}>
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

                        <Segment attached='bottom'
                                 style={this.state.display === 'Light Settings' ? Object({display: 'block'}) : Object({display: 'none'})}>
                            <Table celled>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell width={1}>
                                            Active Settings <Icon name='play circle outline'/>
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
                                            Delete Settings <Icon name='delete'/>
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
                                <AutoForm ref={(ref) => { this.formRef = ref; }} schema={settingSchema} onSubmit={this.submit}>
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
                                                        name='radioGroup'
                                                        value='Bitcoin'
                                                        checked={this.state.coin === 'Bitcoin'}
                                                        onChange={this.handleChangeCoin}
                                                    />
                                                    <Label as='a' image>
                                                        <img src='https://en.bitcoin.it/w/images/en/2/29/BC_Logo_.png'/>
                                                        Bitcoin
                                                    </Label>
                                                </Form.Field>
                                                <Form.Field>
                                                    <Radio
                                                        name='radioGroup'
                                                        value='Ethereum'
                                                        checked={this.state.coin === 'Ethereum'}
                                                        onChange={this.handleChangeCoin}
                                                    />
                                                    <Label as='a' image>
                                                        <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/628px-Ethereum_logo_2014.svg.png'/>
                                                        Ethereum
                                                    </Label>
                                                </Form.Field>
                                                <Form.Field>
                                                    <Radio
                                                        name='radioGroup'
                                                        value='Litecoin'
                                                        checked={this.state.coin === 'Litecoin'}
                                                        onChange={this.handleChangeCoin}
                                                    />
                                                    <Label as='a' image>
                                                        <img src='http://static1.squarespace.com/static/5a78883ba803bb706feafd92/t/5a7abe384192028e23fd111b/1517996289500/CUu4Xvk.jpg?format=1500w'/>
                                                        Litecoin
                                                    </Label>
                                                </Form.Field>
                                                <Form.Field>
                                                    <Radio
                                                        name='radioGroup'
                                                        value='Bitcoin Cash'
                                                        checked={this.state.coin === 'Bitcoin Cash'}
                                                        onChange={this.handleChangeCoin}
                                                    />
                                                    <Label as='a' image>
                                                        <img src='https://i.redd.it/nus982esrz901.png'/>
                                                        Bitcoin Cash
                                                    </Label>
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

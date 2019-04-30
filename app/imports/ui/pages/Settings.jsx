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


class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.props.state;
        this.handleChangeBrightness = this.props.handleChangeBrightness;
        this.handleChangeFlickerRate = this.props.handleChangeFlickerRate;
        this.handleActiveSettingClick = this.props.handleActiveSettingClick;
        this.handleDeleteSettingClick = this.props.handleDeleteSettingClick;
        this.handleChangeCoin = this.props.handleChangeCoin;
        this.handleTimeChange = this.props.handleTimeChange;
        this.handleActiveCustomPortfolio = this.props.handleActiveCustomPortfolio;
        this.submitChangePortfolio = this.props.submitChangePortfolio;
        this.submit = this.submit;
    }
    render() {
        return (
            <Grid.Row columns={2}>
                <Grid.Column width={9}>
                    <Menu attached='top' tabular>
                        <Menu.Item name='Light Settings' active={this.props.state.display === 'Light Settings'}
                                   onClick={this.props.handleMenuClick}/>
                        <Menu.Item name='Coin Settings' active={this.props.state.display === 'Coin Settings'}
                                   onClick={this.props.handleMenuClick}/>
                    </Menu>

                    <Segment attached='bottom'
                             style={this.props.state.display === 'Light Settings' ? Object({display: 'block'}) : Object({display: 'none'})}>
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
                                {Object.keys(this.props.state.light_settings).map((key, index) =>
                                    <LightSetting key={key}
                                                  pct_chg={this.props.state.light_settings[key].pct_chg}
                                                  brightness_setting={this.props.state.light_settings[key].brightness}
                                                  flicker_setting={this.props.state.light_settings[key].flicker}
                                                  active={this.props.state.light_settings[key].active}
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
                             style={this.props.state.display === 'Coin Settings' ? Object({display: 'block'}) : Object({display: 'none'})}>
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
                                            <Form.Field disabled={this.props.state.customPortfolio.active}>
                                                Selected value: <b>{this.props.state.value}</b>
                                            </Form.Field>
                                            <Form.Field disabled={this.props.state.customPortfolio.active}>
                                                <Radio
                                                    name='radioGroup'
                                                    value='Bitcoin'
                                                    checked={this.props.state.coin === 'Bitcoin'}
                                                    onChange={this.handleChangeCoin}
                                                />
                                                <Label as='a' image>
                                                    <img src={this.props.state.coin_image_sources.Bitcoin}/>
                                                    Bitcoin
                                                </Label>
                                            </Form.Field>
                                            <Form.Field disabled={this.props.state.customPortfolio.active}>
                                                <Radio
                                                    name='radioGroup'
                                                    value='Ethereum'
                                                    checked={this.props.state.coin === 'Ethereum'}
                                                    onChange={this.handleChangeCoin}
                                                />
                                                <Label as='a' image>
                                                    <img src={this.props.state.coin_image_sources.Ethereum}/>
                                                    Ethereum
                                                </Label>
                                            </Form.Field>
                                            <Form.Field disabled={this.props.state.customPortfolio.active}>
                                                <Radio
                                                    name='radioGroup'
                                                    value='Litecoin'
                                                    checked={this.props.state.coin === 'Litecoin'}
                                                    onChange={this.handleChangeCoin}
                                                />
                                                <Label as='a' image>
                                                    <img src={this.props.state.coin_image_sources.Litecoin}/>
                                                    Litecoin
                                                </Label>
                                            </Form.Field>
                                            <Form.Field disabled={this.props.state.customPortfolio.active}>
                                                <Radio
                                                    name='radioGroup'
                                                    value='BitcoinCash'
                                                    checked={this.props.state.coin === 'BitcoinCash'}
                                                    onChange={this.handleChangeCoin}
                                                />
                                                <Label as='a' image>
                                                    <img src={this.props.state.coin_image_sources.BitcoinCash}/>
                                                    Bitcoin Cash
                                                </Label>
                                            </Form.Field>
                                        </Form>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Form>
                                            <Form.Field disabled={this.props.state.customPortfolio.active}>
                                                Selected value: <b>{this.props.state.value}</b>
                                            </Form.Field>
                                            <Form.Field disabled={this.props.state.customPortfolio.active}>
                                                <Radio
                                                    name='radioGroup'
                                                    value='0'
                                                    checked={this.props.state.time === '0'}
                                                    onChange={this.handleTimeChange}
                                                />
                                                <Label>1h</Label>
                                            </Form.Field>
                                            <Form.Field disabled={this.props.state.customPortfolio.active}>
                                                <Radio
                                                    name='radioGroup'
                                                    value='1'
                                                    checked={this.props.state.time === '1'}
                                                    onChange={this.handleTimeChange}
                                                />
                                                <Label>24h</Label>
                                            </Form.Field>
                                            <Form.Field disabled={this.props.state.customPortfolio.active}>
                                                <Radio
                                                    name='radioGroup'
                                                    value='2'
                                                    checked={this.props.state.time === '2'}
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
                                        <Button active={!this.props.state.customPortfolio.active}
                                                color={!this.props.state.customPortfolio.active ? 'green' : 'grey'}
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
                                                              <img src={this.props.state.coin_image_sources.Bitcoin}/>
                                                              Bitcoin
                                                          </Label>}
                                                          decimal={true}
                                                          placeholder='0'
                                                          disabled={!this.props.state.customPortfolio.active}>
                                                </NumField>
                                                <NumField name='Ethereum'
                                                          label={<Label as='a' image>
                                                              <img src={this.props.state.coin_image_sources.Ethereum}/>
                                                              Ethereum
                                                          </Label>}
                                                          decimal={true}
                                                          placeholder='0'
                                                          disabled={!this.props.state.customPortfolio.active}>
                                                </NumField>
                                                <NumField name='Litecoin'
                                                          label={<Label as='a' image>
                                                              <img src={this.props.state.coin_image_sources.Litecoin}/>
                                                              Litecoin
                                                          </Label>}
                                                          decimal={true}
                                                          placeholder='0'
                                                          disabled={!this.props.state.customPortfolio.active}>
                                                </NumField>
                                                <NumField name='BitcoinCash'
                                                          label={<Label as='a' image>
                                                              <img src={this.props.state.coin_image_sources.BitcoinCash}/>
                                                              Bitcoin Cash
                                                          </Label>}
                                                          decimal={true}
                                                          placeholder='0'
                                                          disabled={!this.props.state.customPortfolio.active}>
                                                </NumField>
                                                <SubmitField value='Submit'
                                                             disabled={!this.props.state.customPortfolio.active}/>
                                                <ErrorsField/>
                                            </Segment>
                                        </AutoForm>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Form>
                                            <Form.Field disabled={!this.props.state.customPortfolio.active}>
                                                Selected value: <b>{this.props.state.value}</b>
                                            </Form.Field>
                                            <Form.Field disabled={!this.props.state.customPortfolio.active}>
                                                <Radio
                                                    name='radioGroup'
                                                    value='0'
                                                    checked={this.props.state.time === 0}
                                                    onChange={this.handleTimeChange}
                                                />
                                                <Label>1h</Label>
                                            </Form.Field>
                                            <Form.Field disabled={!this.props.state.customPortfolio.active}>
                                                <Radio
                                                    name='radioGroup'
                                                    value='1'
                                                    checked={this.props.state.time === 1}
                                                    onChange={this.handleTimeChange}
                                                />
                                                <Label>24h</Label>
                                            </Form.Field>
                                            <Form.Field disabled={!this.props.state.customPortfolio.active}>
                                                <Radio
                                                    name='radioGroup'
                                                    value='2'
                                                    checked={this.props.state.time === 2}
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
                                        <Button active={this.props.state.customPortfolio.active}
                                                color={this.props.state.customPortfolio.active ? 'green' : 'grey'}
                                                onClick={this.handleActiveCustomPortfolio}
                                                compact>
                                            {this.props.state.customPortfolio.active ? 'Active' : 'Disabled'}
                                        </Button>
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Footer>
                        </Table>
                    </Segment>
                </Grid.Column>

                <Grid.Column width={6}>

                    <Label size="huge">
                      Current Settings
                    </Label>

                    <Grid.Row>
                      <Statistic>
                        <Statistic.Label>
                          Coin: {this.props.state.coin}
                        </Statistic.Label>
                      </Statistic>
                    </Grid.Row>

                  <Grid.Row>
                    <Statistic>
                      <Statistic.Label>
                        Time Frame: {this.props.state.timeString}
                      </Statistic.Label>
                    </Statistic>
                  </Grid.Row>

                    <Grid.Row>
                      <Statistic>
                        <Statistic.Label>
                          Percent Change: {Math.round(this.props.state.current_pct_chg) + "%"}
                        </Statistic.Label>
                      </Statistic>
                    </Grid.Row>

                  <Grid.Row>
                    <Statistic>
                      <Statistic.Label>
                        Brightness: {this.props.state.current_brightness}
                      </Statistic.Label>
                    </Statistic>
                  </Grid.Row>

                  <Grid.Row>
                    <Statistic>
                      <Statistic.Label>
                        Flicker Rate: {this.props.state.current_flicker}
                      </Statistic.Label>
                    </Statistic>
                  </Grid.Row>

                    <Grid.Row>
                        <Chart coin={this.props.state.coin} data={this.props.state.data}/>
                    </Grid.Row>

                    <Grid.Row>
                        <Segment inverted raised padded>
                            <Statistic inverted>
                                <Statistic.Value>
                                    <Image src={this.state.coin_image_sources[this.state.coin]} inline/>
                                    {Math.round(this.props.state.coin_value * 100) / 100}
                                </Statistic.Value>
                                <Statistic.Label>{this.props.state.coin} Value</Statistic.Label>
                            </Statistic>
                        </Segment>
                    </Grid.Row>
                </Grid.Column>
            </Grid.Row>
        );
    }
}

export default Settings;

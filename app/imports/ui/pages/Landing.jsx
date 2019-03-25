import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Checkbox, Grid, Image, Button, Container, Header, Table, Range } from 'semantic-ui-react';

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
                  brightness_setting_pos_ten: 5};

    this.light_on =  false;
    Meteor.call('discover', {}, (err) => {
      if (err) {
        alert(err);
      }
    });
    this.handleClick = this.handleClick.bind(this);
    this.handleChangeBrightness = this.handleChangeBrightness.bind(this);
  }

  handleChangeBrightness(pct_chg) {
    return function (brightness) {
      const brightness_object = {};
      brightness_object['brightness_setting_'
                          + pct_chg] = brightness.target.value;
      return this.setState(brightness_object);
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

  render() {
    return (
          <Grid celled verticalAlign='middle' textAlign='center' container>

            <Grid.Row color='grey'>
              <Header as='h1' textAlign='center'
              inverted style={{ marginTop: '1em',  marginBottom: '1em'}}>
              Ambient Crypto Tracker
              </Header>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column>
                <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell colSpan='3' textAlign='center'>
                      Light Settings
                    </Table.HeaderCell>
                    <Table.HeaderCell colSpan='1' textAlign='center'>
                      Coin Settings
                    </Table.HeaderCell>
                  </Table.Row>
                  <Table.Row>
                    <Table.HeaderCell width={2}>
                      Percent Change
                    </Table.HeaderCell>
                    <Table.HeaderCell width={2}>
                      Brightness
                    </Table.HeaderCell>
                    <Table.HeaderCell width={2}>
                      Flicker Rate
                    </Table.HeaderCell>
                    <Table.HeaderCell>Coin to Track</Table.HeaderCell>
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
                      <Table.Cell>John Lilki</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell textAlign='center'>-5%</Table.Cell>
                      <Table.Cell>
                        <input type='range' min={0} max={10}
                          value={this.state.brightness_setting_neg_five}
                          onChange={this.handleChangeBrightness('neg_five')} />
                      </Table.Cell>
                      <Table.Cell>John Lilki</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell textAlign='center'>-2%</Table.Cell>
                      <Table.Cell>
                        <input type='range' min={0} max={10}
                          value={this.state.brightness_setting_neg_two}
                          onChange={this.handleChangeBrightness('neg_two')} />
                      </Table.Cell>
                      <Table.Cell>John Lilki</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell textAlign='center'>-1%</Table.Cell>
                      <Table.Cell>
                        <input type='range' min={0} max={10}
                          value={this.state.brightness_setting_neg_one}
                          onChange={this.handleChangeBrightness('neg_one')} />
                      </Table.Cell>
                      <Table.Cell>John Lilki</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell textAlign='center'>0%</Table.Cell>
                      <Table.Cell>
                        <input type='range' min={0} max={10}
                          value={this.state.brightness_setting_zero}
                          onChange={this.handleChangeBrightness('zero')} />
                      </Table.Cell>
                      <Table.Cell>John Lilki</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell textAlign='center'>+1%</Table.Cell>
                      <Table.Cell>
                        <input type='range' min={0} max={10}
                          value={this.state.brightness_setting_pos_one}
                          onChange={this.handleChangeBrightness('pos_one')} />
                      </Table.Cell>
                      <Table.Cell>John Lilki</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell textAlign='center'>+2%</Table.Cell>
                      <Table.Cell>
                        <input type='range' min={0} max={10}
                          value={this.state.brightness_setting_pos_two}
                          onChange={this.handleChangeBrightness('pos_two')} />
                      </Table.Cell>
                      <Table.Cell>John Lilki</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell textAlign='center'>+5%</Table.Cell>
                      <Table.Cell>
                        <input type='range' min={0} max={10}
                          value={this.state.brightness_setting_pos_five}
                          onChange={this.handleChangeBrightness('pos_five')} />
                      </Table.Cell>
                      <Table.Cell>John Lilki</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell textAlign='center'>+10%</Table.Cell>
                      <Table.Cell>
                        <input type='range' min={0} max={10}
                          value={this.state.brightness_setting_pos_ten}
                          onChange={this.handleChangeBrightness('pos_ten')} />
                      </Table.Cell>
                      <Table.Cell>John Lilki</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Container fluid >
                <Button onClick={this.handleClick}>
                  Click To Control Light Bulb
                </Button>
              </Container>
            </Grid.Row>

          </Grid>
    );
  }


}

export default Landing;

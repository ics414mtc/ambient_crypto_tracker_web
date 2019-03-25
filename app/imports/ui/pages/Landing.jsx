import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Grid, Image, Button, Container } from 'semantic-ui-react';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  /** Initialize component state with properties for login and redirection. */
  constructor() {
    super();
    this.light_on =  false;
    Meteor.call('discover', {}, (err) => {
      if (err) {
        alert(err);
      }
    });
    this.handleClick = this.handleClick.bind(this);
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
          <Grid.Row>
            <Grid.Column width={4}>
              <Image size='small' circular src="/images/meteor-logo.png"/>
            </Grid.Column>

            <Grid.Column width={8}>
              <h1>Welcome to this template</h1>
              <p>Now get to work and modify this app!</p>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Container fluid >
              <Button onClick={this.handleClick}>Click To Control Light Bulb</Button>
            </Container>
          </Grid.Row>

        </Grid>
    );
  }


}

export default Landing;

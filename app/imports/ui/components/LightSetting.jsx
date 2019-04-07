import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class LightSetting extends React.Component {
    render() {
        return (
            <Table.Row>
                <Table.Cell textAlign='center'>{this.props.pct_chg}%</Table.Cell>
                <Table.Cell>
                    <input type='range' min={1} max={10}
                           value={this.props.brightness_setting}
                           onChange={this.props.handleChangeBrightness} />
                </Table.Cell>
                <Table.Cell>
                    <input type='range' min={0} max={10}
                           value={this.props.flicker_setting}
                           onChange={this.props.handleChangeFlicker} />
                </Table.Cell>
            </Table.Row>
        );
    }
}

/** Declare the types of all properties. */
LightSetting.propTypes = {
    pct_chg: PropTypes.number,
    brightness_setting: PropTypes.number,
    flicker_setting: PropTypes.number,
    handleChangeBrightness: PropTypes.func,
    handleChangeFlicker: PropTypes.func
};

export default LightSetting;
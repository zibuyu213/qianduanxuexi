import React, {Component} from 'react';
import moment from 'moment';
import {Calendar, Alert} from 'antd';

const dateCellStyle={
    textAlign:"center",
    // width:"50px",
    height:"40px",
    lineHeight:"40px"
};
export default class PartnerOrganization extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: moment('2017-01-25'),
            selectedValue: moment('2017-01-25'),
        }
    }


    componentWillMount() {

    }

    componentDidMount() {
    }

    onSelect(value) {
        this.setState({
            value,
            selectedValue: value,
        });
    }

    onPanelChange(value) {
        this.setState({value});
    }

    dateCell(moment){
        return  <div style={dateCellStyle}>{new Date(moment).getDate()}</div>
    }

    render() {
        const {value, selectedValue} = this.state;
        return (
            <div>
                <Calendar dateFullCellRender={this.dateCell}
                          value={value} onSelect={this.onSelect.bind(this)} onPanelChange={this.onPanelChange.bind(this)}/>
            </div>
        )
    }


}
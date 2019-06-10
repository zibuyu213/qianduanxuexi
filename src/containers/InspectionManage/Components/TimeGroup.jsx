import React, {Component} from 'react';
import {Form, TimePicker} from "antd/lib/index";
import moment from "moment/moment";

const FormItem = Form.Item;
const format = 'HH:mm';

class TimeGroup extends Component {
    constructor(props) {
        super(props);
        const value = props.value || {};
        this.state = {
            startTime: value.startTime || null,
            endTime: value.endTime || null,
        };
    }

    componentWillMount() {

    }

    componentDidMount() {
    }

    handleStartChange(startTime) {
        if (!('value' in this.props)) {
            this.setState({startTime});
        }
        this.triggerChange({startTime});
    };

    handleEndChange(endTime) {
        if (!('value' in this.props)) {
            this.setState({endTime});
        }
        this.triggerChange({endTime});
    };

    triggerChange(changedValue) {
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(Object.assign({}, this.state, changedValue));
        }
    };

    checkTime(rule, value, callback) {
        if (value) {
            callback();
            return;
        }
        callback('请选择时间');
    }


    render() {
        const state = this.state;
        const {getFieldDecorator} = this.props.form;
        return (
            <div className="schedule-modal-time-group" style={{display: 'flex'}}>
                <div style={{width: 52}}>{this.props.name}</div>
                <FormItem label="上班">
                    {getFieldDecorator(`startTime`, {
                        initialValue: this.props.startTime,
                        rules: [{validator: this.checkTime}],
                    })(
                        <TimePicker format={format}/>
                    )}
                </FormItem>
                <FormItem label="下班">
                    {getFieldDecorator(`endTime`, {
                        initialValue: this.props.endTime,
                        rules: [{validator: this.checkTime}],
                    })(
                        <TimePicker format={format}/>
                    )}
                </FormItem>
                {/*<div style={{width: 42}}>上班：</div>*/}
                {/*<TimePicker value={state.startTime} onChange={this.handleStartChange.bind(this)} format={format}/>*/}
                {/*<div style={{width: 42, marginLeft: "32px"}}>下班：</div>*/}
                {/*<TimePicker value={state.endTime} onChange={this.handleEndChange.bind(this)} format={format}/>*/}
            </div>
        )
    }


}

export default Form.create()(TimeGroup);
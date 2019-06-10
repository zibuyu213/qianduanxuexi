import React, {Component} from 'react';
import {CSS} from './DateRange.css';
import {custom} from "../../common/SystemStyle";
import PropTypes from 'prop-types';
import {DatePicker} from 'antd';
import moment from 'moment';
import {react} from 'react.eval';
import $ from 'jquery';

const {MonthPicker} = DatePicker;

export default class DateRange extends Component {
    constructor(props) {
        super(props);

        react(this);
        this.state = {
            startValue: this.props.type === "date" ? moment().subtract(7, 'days') : moment().subtract(7, 'months'),
            endValue: this.props.type === "date" ? moment().subtract(1, 'days') : moment().subtract(1, 'months')
        };
    }

    componentWillMount() {

    }

    componentDidMount() {
        $(".ant-input").css("border", "none");
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.type !== nextProps.type) {
            this.state = {
                startValue: nextProps.type === "date" ? moment().subtract(7, 'days') : moment().subtract(7, 'months'),
                endValue: nextProps.type === "date" ? moment().subtract(1, 'days') : moment().subtract(1, 'months')
            };
        }
    }

    componentDidUpdate(prevProps, prevState) {
        $(".ant-input").css("border", "none");
    }


    disabledStartDate(startValue) {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return startValue.isAfter(moment().add(-1, 'M'), 'M')
            // return startValue.valueOf() > moment().valueOf();
        }
        // return startValue.isAfter(endValue.add(-1, 'M'), 'M') || startValue.isAfter(moment(), 'M')
        return startValue.valueOf() > endValue.valueOf() || startValue.valueOf() > moment().valueOf();
    }

    disabledEndDate(endValue) {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return endValue.isAfter(moment().add(-1, 'M'), 'M');
            // return endValue.valueOf() > moment().add(-1, 'month').valueOf();
        }
        return endValue.isBefore(startValue, 'M') || endValue.isAfter(moment().add(-1, 'M'), 'M');
        // return endValue.valueOf() < startValue.valueOf() || endValue.valueOf() > moment().add(-1, 'month').valueOf();
    }

    onChange(field, value) {
        this.setState({
            [field]: value,
        });
    }

    onStartChange(value) {
        this.onChange('startValue', value);
        if (this.props.onDateRangeChange) {
            if (value !== null && this.state.endValue !== null) {
                this.props.onDateRangeChange(value, this.state.endValue);
            }
        }
    }

    onEndChange(value) {
        this.onChange('endValue', value);
        if (this.props.onDateRangeChange) {
            if (value !== null && this.state.startValue !== null) {
                this.props.onDateRangeChange(this.state.startValue, value);
            }
        }
    }


    getDetail() {
        let detail = "";
        if (this.props.type === "month") {
            detail =
                <div className="range_box">
                    <MonthPicker
                        className="monthInput"
                        style={{float: "left", border: "none", width: "110px"}}
                        placeholder="开始时间"
                        disabledDate={this.disabledStartDate.bind(this)}
                        format="YYYY-MM"
                        value={this.state.startValue}
                        onChange={this.onStartChange.bind(this)}
                        showToday={false}
                        suffixIcon={<div/>}
                        allowClear={false}
                    />
                    <div className="split_line" style={{float: "left"}}>~</div>
                    <MonthPicker
                        className="monthInput"
                        style={{float: "right", border: "none", width: "130px"}}
                        placeholder="结束时间"
                        allowClear={false}
                        disabledDate={this.disabledEndDate.bind(this)}
                        format="YYYY-MM"
                        value={this.state.endValue}
                        onChange={this.onEndChange.bind(this)}
                        showToday={false}
                    />
                    <div style={custom.clear}/>
                </div>
        } else if (this.props.type === "date") {
            detail =
                <div className="range_box">
                    <DatePicker
                        className="range-input"
                        style={{float: "left", border: "none", width: "110px"}}
                        placeholder="开始时间"
                        disabledDate={this.disabledStartDate.bind(this)}
                        format="YYYY-MM-DD"
                        value={this.state.startValue}
                        onChange={this.onStartChange.bind(this)}
                        showToday={false}
                        suffixIcon={<div/>}
                    />
                    <div className="split_line" style={{float: "left"}}>~</div>
                    <DatePicker
                        style={{float: "right", border: "none", width: "130px"}}
                        placeholder="结束时间"
                        disabledDate={this.disabledEndDate.bind(this)}
                        format="YYYY-MM-DD"
                        value={this.state.endValue}
                        onChange={this.onEndChange.bind(this)}
                        showToday={false}
                    />
                    <div style={custom.clear}/>
                </div>
        }
        return detail;
    }


    render() {
        return (
            <div className={this.props.className ? this.props.className : ""}>
                {this.getDetail()}
            </div>
        )
    }


}

DateRange.propTypes = {
    type: PropTypes.string, //month, date
    onDateRangeChange: PropTypes.func,
    className: PropTypes.string
};

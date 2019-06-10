import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';

import EditForTime from './EditForTime.jsx';
import EditForHour from './EditForHour.jsx';
import EditForComplex from './EditForComplex.jsx';

import {Button, message} from "antd";
import {react} from "react.eval";
import {custom} from "../../../common/SystemStyle";
import {HttpClient} from "../../../common/HttpClient";


export default class RuleInsert extends Component {
    constructor (props) {
        super(props);

        react(this);

        message.config({
            duration: 1
        });
    }


    componentWillMount () {

    }

    componentDidMount () {
    }


    check () {
        let result = false;
        if (this.props.type === 0) {
            // console.log("按次");
            result = react(this.props.dayType + this.props.timeType + this.props.carType + 'editForTime.check')();
            // console.log("result->");
            // console.log(result);
        } else if (this.props.type === 1) {
            // console.log("按时");
            result = react(this.props.dayType + this.props.timeType + this.props.carType + 'editForHour.check')();
            // console.log("result->");
            // console.log(result);
        } else if (this.props.type === 2) {
            // console.log("按时");
            result = react(this.props.dayType + this.props.timeType + this.props.carType + 'editForComplex.check')();
            // console.log("result->");
            // console.log(result);
        }
        return result;
    }

    render () {
        let body = "";
        switch (this.props.type) {
            case 0:
                body =
                    <EditForTime
                        id={this.props.dayType + this.props.timeType + this.props.carType + "editForTime"}
                        carType={this.props.carType}
                        dayType={this.props.dayType}
                        timeType={this.props.timeType}
                        ruleDetailList={this.props.ruleDetailList}
                    />;
                break;
            case 1:
                body =
                    <EditForHour
                        id={this.props.dayType + this.props.timeType + this.props.carType + "editForHour"}
                        carType={this.props.carType}
                        dayType={this.props.dayType}
                        timeType={this.props.timeType}
                        ruleDetailList={this.props.ruleDetailList}
                    />;
                break;
            case 2:
                body =
                    <EditForComplex
                        id={this.props.dayType + this.props.timeType + this.props.carType + "editForComplex"}
                        carType={this.props.carType}
                        dayType={this.props.dayType}
                        timeType={this.props.timeType}
                        ruleDetailList={this.props.ruleDetailList}
                    />;
                break;
            default:
                break;
        }


        return (
            <div style={{ margin: "16px 0" }}>
                {
                    (this.props.type === 0 || this.props.type === 1 || this.props.type === 2) ? (
                        <Fragment>
                            <div className="detail_display_sub_title" style={{ float: "left" }}><span
                                className="require_status">*</span>设置单价
                            </div>
                            <div className="detail_display_content" style={{
                                float: "left",
                                marginLeft: "8px",
                                borderBottom: "1px dashed #E8E8E8",
                                height: "1px",
                                marginTop: "12px",
                                width: "635px"
                            }}/>
                            <div style={custom.clear}/>
                            <div style={{ height: "16px" }}/>
                        </Fragment>
                    ) : ''
                }
                {body}
            </div>
        );

    }
}


RuleInsert.propTypes = {
    type: PropTypes.number,
    carType: PropTypes.string, //bigCar & smallCar
    dayType: PropTypes.string, //workday & weekend
    timeType: PropTypes.string, // daytime & nighttime,
    ruleDetailList: PropTypes.array
};

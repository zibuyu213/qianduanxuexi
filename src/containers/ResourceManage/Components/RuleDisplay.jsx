import React, {Component} from 'react';
import {CSS} from "../Style/Rule.css";
import '../Style/SectionResource.css'
import {HttpClient} from "../../../common/HttpClient";
import {custom} from "../../../common/SystemStyle";

import {Card, message} from "antd";

export default class RuleDisplay extends Component {
    constructor (props) {
        super(props);

        message.config({
            duration: 1
        });

        this.state = {
            //列表参数
            rule: this.props.rule,
            chargeTimeType: {
                1: '白天收费',
                2: '夜间收费',
                3: '白天夜间区间收费'
            }
        }
    }


    componentWillMount () {

    }

    componentDidMount () {
    }


    //获取收费方式
    getMethod (type) {
        // 0：按次收费 1：按时长收费 2：组合收费
        let string = "";
        switch (type) {
            case 0:
                string = "按次收费";
                break;
            case 1:
                string = "按时收费";
                break;
            case 2:
                string = "组合收费";
                break;
            default:
                break
        }
        return string;
    }


    //一级card 工作日 非工作日
    getCard (object) {
        let DayContent = '', NightCotent = '';
        if (object.chargeTimeType === 1) { // 白天收费
            DayContent = this.getContent(object, 0)
        } else if (object.chargeTimeType === 2) { // 夜间收费
            NightCotent = this.getContent(object, 1)
        } else if (object.chargeTimeType === 3) { // 白天夜间组合收费
            DayContent = this.getContent(object, 0);
            NightCotent = this.getContent(object, 1)
        }
        let card =
            <div className="detail_display_card_box">
                <div className="detail_display_sub_title" style={{ float: "left" }}>单日封顶价:</div>
                <div className="detail_display_content"
                     style={{ float: "left", marginLeft: "4px", width: 239 }}>{object.upperLimitPrice}元
                </div>
                <div className="detail_display_sub_title" style={{ float: "left", marginLeft: 47 }}>单日计费区间:</div>
                <div className="detail_display_content"
                     style={{
                         float: "left",
                         marginLeft: "4px"
                     }}>{this.state.chargeTimeType[object.chargeTimeType] || '--'}
                </div>
                <div style={custom.clear}/>
                {DayContent}
                {NightCotent}
            </div>;
        return card;
    }


    //二级content 0：白天 1：晚上
    getContent (object, type) {
        let content =
            <div>
                <div style={{ marginTop: "24px", marginBottom: "16px", width: "100%" }}>
                    <div className="detail_display_title" style={{ float: "left" }}>{type == 0 ? "白天" : "夜间"}计费规则</div>
                    <div className="detail_display_content" style={{
                        float: "left",
                        marginLeft: "8px",
                        background: "#E8E8E8",
                        height: "1px",
                        marginTop: "12px",
                        width: "90%"
                    }}/>
                    <div style={custom.clear}/>
                </div>
                <div className="detail_display_card_box" style={{ height: "22px", marginBottom: "16px" }}>
                    <div className="detail_display_sub_title" style={{ float: "left" }}>免费停车:</div>
                    <div className="detail_display_content" style={{
                        float: "left",
                        marginLeft: "4px",
                        width: "256px"
                    }}>{object[type == 0 ? "daytimeFreeMin" : "nighttimeFreeMin"]}分钟
                    </div>
                    <div className="detail_display_sub_title" style={{ float: "left", marginLeft: "47px" }}>收费方式:</div>
                    <div className="detail_display_content" style={{
                        float: "left",
                        marginLeft: "4px"
                    }}>{this.getMethod(object[type == 0 ? "daytimeType" : "nighttimeType"])}</div>
                    <div style={custom.clear}/>
                </div>

                <div className="detail_display_sub_title" style={{ float: "left" }}>单价:</div>
                {this.getDetail(object[type == 0 ? "daytimePriceRuleDayWayList" : "nighttimePriceRuleDayWayList"], object[type == 0 ? "daytimeType" : "nighttimeType"])}
                <div style={custom.clear}/>
                <div style={{ height: "20px" }}/>

                {/*<div className="detail_display_sub_title" style={{ float: "left" }}>大型车:</div>
                {this.getDetail(object[type == 0 ? "bigCarDaytimePriceTempleteList" : "bigCarNighttimePriceTempleteList"], object[type == 0 ? "daytimeType" : "nighttimeType"])}
                <div style={custom.clear}/>*/}
            </div>;

        return content;
    }

    //具体细节
    getDetail (list, type) {
        let body = "";
        if (type == 0) {
            // 次
            body =
                <div style={{ float: "left", marginLeft: "4px" }}>
                    {list.map((item, index) => {
                        if (index == list.length - 1) {
                            return <div key={"a" + index}
                                        className="detail_display_content">{item.sort}、停车{item.hour1}小时以后，按次：{item.price}元/次；</div>
                        } else {
                            return <div key={"a" + index}
                                        className="detail_display_content">{item.sort}、停车{item.hour1}小时内，按次：{item.price}元/次；</div>;
                        }
                    })}
                </div>
        } else if (type == 1) {
            // 分钟
            body =
                <div style={{ float: "left", marginLeft: "4px" }}>
                    {list.map((item, index) => {
                        if (index == list.length - 1) {
                            return <div key={"b" + index}
                                        className="detail_display_content">{item.sort}、停车{item.hour1}小时以后，超出时间计费按时：{item.price}元/{window.UNIT_NAME}；</div>
                        } else if (index == 0) {
                            return <div key={"b" + index}
                                        className="detail_display_content">{item.sort}、停车{item.hour2}小时内，按时：{item.price}元/{window.UNIT_NAME}；</div>;
                        } else {
                            return <div key={"b" + index}
                                        className="detail_display_content">{item.sort}、停车{item.hour1}小时至{item.hour2}小时内，超出时间计费按时：{item.price}元/{window.UNIT_NAME}；</div>;
                        }
                    })}
                </div>
        } else if (type == 2) {
            // 组合
            body =
                <div style={{ float: "left", marginLeft: "4px" }}>
                    {list.map((item, index) => {
                        if (index == list.length - 1) {
                            if (item.type == 2) {
                                let detail =
                                    <div key={"c" + index}>
                                        <div className="detail_display_content">{item.sort}、停车{item.hour1}小时以后，配置按收费为：
                                        </div>
                                        {this.getSubDetail(item.child)}
                                    </div>;
                                return detail;
                            } else {
                                //等于0
                                return <div key={"c" + index}
                                            className="detail_display_content">{item.sort}、停车{item.hour1}小时以后，超出时间计费按时：{item.price}元/{window.UNIT_NAME}；</div>
                            }
                        } else if (index == 0) {
                            if (item.type == 2) {
                                let detail =
                                    <div key={"c" + index}>
                                        <div className="detail_display_content">{item.sort}、停车{item.hour2}小时内，配置按收费为：
                                        </div>
                                        {this.getSubDetail(item.child)}
                                    </div>;
                                return detail;
                            } else {
                                //等于0
                                return <div key={"c" + index}
                                            className="detail_display_content">{item.sort}、停车{item.hour2}小时内，{item.type == 0 ? "按次" : "按时"}：{item.price}元/{item.type == 0 ? "次" : window.UNIT_NAME}；</div>;
                            }
                        } else {
                            if (item.type == 2) {
                                let detail =
                                    <div key={"c" + index}>
                                        <div className="detail_display_content">{item.sort}、停车{item.hour2}小时内，配置按收费为：
                                        </div>
                                        {this.getSubDetail(item.child)}
                                    </div>;
                                return detail;
                            } else {
                                //等于0
                                return <div key={"c" + index}
                                            className="detail_display_content">{item.sort}、停车{item.hour1}小时至{item.hour2}小时内，超出时间计费按时：{item.price}元/{window.UNIT_NAME}；</div>;
                            }
                        }
                    })}
                </div>
        }
        return body;
    }

    getSubDetail (list) {
        return (
            <div style={{ marginLeft: "4px" }}>
                {list.map((item, index) => {
                    if (index == list.length - 1) {
                        return <div key={"d" + index} className="detail_display_content"
                                    style={{ marginLeft: "12px" }}>{item.sort})停车{item.hour1}小时以后，超出时间计费按时：{item.price}元/{window.UNIT_NAME}；</div>
                    } else if (index == 0) {
                        return <div key={"d" + index} className="detail_display_content"
                                    style={{ marginLeft: "12px" }}>{item.sort})停车{item.hour2}小时内，按时：{item.price}元/{window.UNIT_NAME}；</div>;
                    } else {
                        return <div key={"d" + index} className="detail_display_content"
                                    style={{ marginLeft: "12px" }}>{item.sort})停车{item.hour1}小时至{item.hour2}小时内，超出时间计费按时：{item.price}元/{window.UNIT_NAME}；</div>;
                    }
                })}
            </div>
        )
    }

    render () {
        if (this.props.rule == undefined) {
            return (
                <div className="page-content" style={{ backgroundColor: "rgba(0,0,0,0)", padding: 0 }}>
                    <Card title='规则详情'/>
                    <Card title='工作日计费规则'/>
                    <Card title='非工作日计费规则'/>
                </div>
            )
        }

        return (
            <div className="page-content" style={{ backgroundColor: "rgba(0,0,0,0)", padding: 0 }}>
                <Card title='规则详情'>
                    <div className="detail_display_card_box" style={{ height: "22px" }}>
                        <div className="detail_display_sub_title" style={{ float: "left" }}>规则名称:</div>
                        <div className="detail_display_content"
                             style={{ float: "left", marginLeft: "4px", width: "256px" }}>{this.props.rule.name}</div>
                        <div className="detail_display_sub_title" style={{ float: "left", marginLeft: "47px" }}>计费规则编号:
                        </div>
                        <div className="detail_display_content"
                             style={{ float: "left", marginLeft: "4px" }}>{this.props.rule.number}</div>
                        <div style={custom.clear}/>
                    </div>
                    <div className="detail_display_card_box" style={{ height: "22px", marginTop: 20 }}>
                        <div className="detail_display_sub_title" style={{ float: "left" }}>免费停车是否需要计费:</div>
                        <div className="detail_display_content"
                             style={{
                                 float: "left",
                                 marginLeft: "4px"
                             }}>{this.props.rule.freeTimeChargeType === 1 ? '需要' : '不需要'}</div>
                        <div style={custom.clear}/>
                    </div>
                </Card>
                <Card title='工作日计费规则'>
                    {this.getCard(this.props.rule.workDayPriceRuleVO)}
                </Card>
                <Card title='非工作日计费规则'>
                    {
                        this.props.rule.isWorkdayAlike && (
                            <div className="detail_display_sub_title" style={{marginBottom: 20}}><span className="require_status">*</span>与工作日收费方式一致</div>
                        )
                    }
                    {this.getCard(this.props.rule.weekendPriceRuleVO)}
                </Card>
            </div>
        )
    }
}


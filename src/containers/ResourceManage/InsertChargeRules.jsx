import React, {Component, Fragment} from 'react';
import $ from 'jquery';
import {CSS} from "./Style/Rule.css";
import './Style/SectionResource.css'

import RuleInsert from './Components/RuleInsert.jsx';

import {HttpClient} from "../../common/HttpClient";
import {custom} from "../../common/SystemStyle";
import {Global} from "../../common/SystemFunction";

import {Button, message, Radio, Card, Input, Form, Spin, Tooltip, Icon} from "antd";
import {react} from "react.eval";
import Exception from '../../components/Exception';

const FormItem = Form.Item;

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class InsertChargeRules extends Component {
    constructor (props) {
        super(props);
        message.config({
            duration: 1
        });

        this.state = {
            workdayDaytimeValue: 0,
            workdayNighttimeValue: 0,
            weekendDaytimeValue: 0,
            weekendNighttimeValue: 0,

            workdayTop: "",
            weekendTop: "",
            workdayDaytimeForFree: "",
            workdayNighttimeForFree: "",
            weekendDaytimeForFree: "",
            weekendNighttimeForFree: "",

            name: "",
            number: "",
            //连点限制
            inSubmit: false,
            loading: false,

            workDaySingleDayChargingInterval: null,
            restDaySingleDayChargingInterval: null,
            freeTimeChargeType: null,

            isCustomRule: false, // false表示与工作日一致
        }
    }

    componentWillMount () {
    }

    componentDidMount () {
         if (!window.checkPageEnable("chargeRuleAdd")) return;
        setTimeout(
            function () {
                let width = Global.getSider();
                $(".edit_bottom")[0].style.width = window.innerWidth - width + "px";
            }, 200);
    }

    componentDidUpdate () {
        setTimeout(
            function () {
                let width = Global.getSider();
                $(".edit_bottom")[0].style.width = window.innerWidth - width + "px";
            }, 200);
    }

    onChange (key, e) {
        console.log(key);
        console.log('radio checked', e.target.value);
        this.setState({
            [key]: e.target.value,
        });
    }

    cancel () {
        if (this.state.inSubmit === true) {
            return;
        }
        window.location.hash = `/ResourceManage/ChargeRules`;
    }

    // 筛选参数
    filterParams (otherParams) {
        let params = {};
        for (let item in otherParams) {
            if (otherParams[item] || otherParams[item] === 0) {
                params[item] = otherParams[item]
            }
        }
        return params
    }

    submit () {
        if (this.state.inSubmit === true) {
            return;
        }
        let workdayDaytimeSmallCar = null, workdayDaytimeBigCar = null, workdayNighttimeSmallCar = null,
            workdayNighttimeBigCar = null, weekendDaytimeSmallCar = null,
            weekendDaytimeBigCar = null, weekendNighttimeSmallCar = null, weekendNighttimeBigCar = null;

        let result = 0;
        this.props.form.validateFieldsAndScroll({ force: true }, ((err, values) => {
            // console.log('err', err);
            let validateErro = Object.assign({}, JSON.parse(JSON.stringify(err)));
            //校验
            // 工作日
            if (this.state.workDaySingleDayChargingInterval === 1) { // 白天
                delete validateErro.workdayNighttimeForFree;
                delete validateErro.workdayNightChargeWay;
                workdayDaytimeSmallCar = react('workdayDaytimeSmallCar.check')();
                // workdayDaytimeBigCar = react('workdayDaytimeBigCar.check')();
            } else if (this.state.workDaySingleDayChargingInterval === 2) { // 晚上
                delete validateErro.workdayDaytimeForFree;
                delete validateErro.workdayDayChargeWay;
                workdayNighttimeSmallCar = react('workdayNighttimeSmallCar.check')();
                // workdayNighttimeBigCar = react('workdayNighttimeBigCar.check')();
            } else if (this.state.workDaySingleDayChargingInterval === 3) { // 白天晚上
                workdayDaytimeSmallCar = react('workdayDaytimeSmallCar.check')();
                // workdayDaytimeBigCar = react('workdayDaytimeBigCar.check')();
                workdayNighttimeSmallCar = react('workdayNighttimeSmallCar.check')();
                // workdayNighttimeBigCar = react('workdayNighttimeBigCar.check')();
            }
            if (this.state.isCustomRule) {
                // 非工作日
                if (this.state.restDaySingleDayChargingInterval === 1) { // 白天
                    delete validateErro.weekendNighttimeForFree;
                    delete validateErro.weekendNightChargeWay;
                    weekendDaytimeSmallCar = react('weekendDaytimeSmallCar.check')();
                    // weekendDaytimeBigCar = react('weekendDaytimeBigCar.check')();
                } else if (this.state.restDaySingleDayChargingInterval === 2) { // 晚上
                    delete validateErro.weekendDaytimeForFree;
                    delete validateErro.weekendDayChargeWay;
                    weekendNighttimeSmallCar = react('weekendNighttimeSmallCar.check')();
                    // weekendNighttimeBigCar = react('weekendNighttimeBigCar.check')();
                } else if (this.state.restDaySingleDayChargingInterval === 3) { // 白天晚上
                    weekendDaytimeSmallCar = react('weekendDaytimeSmallCar.check')();
                    // weekendDaytimeBigCar = react('weekendDaytimeBigCar.check')();
                    weekendNighttimeSmallCar = react('weekendNighttimeSmallCar.check')();
                    // weekendNighttimeBigCar = react('weekendNighttimeBigCar.check')();
                }
            }else {
                delete validateErro.weekendNighttimeForFree;
                delete validateErro.weekendNightChargeWay;
                delete validateErro.weekendDaytimeForFree;
                delete validateErro.weekendDayChargeWay;
            }

            if (validateErro) {
                for (let item in validateErro) {
                    console.error(validateErro[item]);
                    result += 1
                }
            }
            console.log('result:', result)
        }).bind(this));

        /*console.log((workdayDaytimeSmallCar && workdayDaytimeBigCar));
        console.log((workdayNighttimeSmallCar && workdayNighttimeBigCar));
        console.log((weekendDaytimeSmallCar && weekendDaytimeBigCar));
        console.log((weekendNighttimeSmallCar && weekendNighttimeBigCar));*/

        const customRule = this.state.isCustomRule ? (((weekendDaytimeSmallCar) || (weekendNighttimeSmallCar))) : true;
        if (
            ((workdayDaytimeSmallCar) || (workdayNighttimeSmallCar)) &&
            customRule &&
            !result
        ) {
            const workDayPriceRuleVO = {
                upperLimitPrice: this.state.workdayTop,                // | string | 封顶价 |
                daytimeFreeMin: parseInt(this.state.workdayDaytimeForFree),                  // | integer | 白天免费时长 |
                daytimeType: parseInt(this.state.workdayDaytimeValue),                // | integer  | 白天计费方式 0：按次收费 1：按时长收费 2：组合收费 |
                // 小型车白天计费方式列表
                // smallCarDaytimePriceTempleteList: workdayDaytimeSmallCar,
                daytimePriceRuleDayWayList: workdayDaytimeSmallCar,
                // 大型车白天计费方式列表
                // bigCarDaytimePriceTempleteList: workdayDaytimeBigCar,
                nighttimeFreeMin: parseInt(this.state.workdayNighttimeForFree),             // | integer | 夜间免费时长 |
                nighttimeType: parseInt(this.state.workdayNighttimeValue),              // | integer | 夜间计费方式 0：按次收费 1：按时长收费 2：组合收费 |
                // 小型车夜间计费方式列表
                // smallCarNighttimePriceTempleteList: workdayNighttimeSmallCar,
                nighttimePriceRuleDayWayList: workdayNighttimeSmallCar,
                // 大型车夜间计费方式列表
                // bigCarNighttimePriceTempleteList: workdayNighttimeBigCar,
                // 单日计费区间
                chargeTimeType: this.state.workDaySingleDayChargingInterval
            };
            let weekendPriceRuleVO = {};
            if (this.state.isCustomRule) {
                weekendPriceRuleVO = {
                    upperLimitPrice: this.state.weekendTop,                // | string | 封顶价 |
                    daytimeFreeMin: parseInt(this.state.weekendDaytimeForFree),                  // | integer | 白天免费时长 |
                    daytimeType: parseInt(this.state.weekendDaytimeValue),                // | integer  | 白天计费方式 0：按次收费 1：按时长收费 2：组合收费 |
                    // 小型车白天计费方式列表
                    // smallCarDaytimePriceTempleteList: weekendDaytimeSmallCar,
                    daytimePriceRuleDayWayList: weekendDaytimeSmallCar,
                    // 大型车白天计费方式列表
                    // bigCarDaytimePriceTempleteList: weekendDaytimeBigCar,
                    nighttimeFreeMin: parseInt(this.state.weekendNighttimeForFree),             // | integer | 夜间免费时长 |
                    nighttimeType: parseInt(this.state.weekendNighttimeValue),              // | integer | 夜间计费方式 0：按次收费 1：按时长收费 2：组合收费 |
                    // 小型车夜间计费方式列表
                    // smallCarNighttimePriceTempleteList: weekendNighttimeSmallCar,
                    nighttimePriceRuleDayWayList: weekendNighttimeSmallCar,
                    // 大型车夜间计费方式列表
                    // bigCarNighttimePriceTempleteList: weekendNighttimeBigCar,
                    // 单日计费区间
                    chargeTimeType: this.state.restDaySingleDayChargingInterval
                };
            }
            const params = {
                number: this.state.number,                      //计费规则编号
                name: this.state.name,                      // 计费规则名
                isWorkdayAlike: !this.state.isCustomRule, // 是否与工作日一致
                freeTimeChargeType: this.state.freeTimeChargeType, // 免费停车是否需要计费
                workDayPriceRuleVO: this.filterParams(workDayPriceRuleVO),
            };
            if (this.state.isCustomRule) params.weekendPriceRuleVO = this.filterParams(weekendPriceRuleVO);
            console.log('新增计费规则提交参数：', params);
            // message.info('现暂时没有调用提交接口，请先在控制台中查看提交参数');
            // return;
            this.state.inSubmit = true;
            this.setState({
                loading: true
            });
            HttpClient.query('/parking-resource/parkingPriceRules', HttpClient.POST, JSON.stringify(params), this.fetchCreate.bind(this));
        }
    }

    fetchCreate (e, type) {
        this.state.inSubmit = false;
        this.setState({
            loading: false
        });
        if (type === HttpClient.requestSuccess) {
            message.success(e.data, 1, () => {
                window.location.hash = `/ResourceManage/ChargeRules`;
            });
        }
    }

    // 单日计费区间选择
    onSingleDayChargingIntervalChange (key, e) {
        const value = e.target.value;
        if (key === 'workDay') {
            this.setState({
                workDaySingleDayChargingInterval: value,
                workdayDaytimeValue: null,
                workdayNighttimeValue: null,
            }, () => {
                // 以下为了防止设置表单值出错
                setTimeout(() => {
                    this.props.form.setFieldsValue({
                        workdayDaytimeForFree: '',
                        workdayNighttimeForFree: '',
                        workdayDayChargeWay: null,
                        workdayNightChargeWay: null,
                    });
                    this.state.workdayDaytimeForFree = '';
                    this.state.workdayNighttimeForFree = '';
                }, 100)
            })
        } else if (key === 'restDay') {
            this.setState({
                restDaySingleDayChargingInterval: value,
                weekendDaytimeValue: null,
                weekendNighttimeValue: null,
            }, () => {
                setTimeout(() => {
                    this.props.form.setFieldsValue({
                        weekendDaytimeForFree: '',
                        weekendNighttimeForFree: '',
                        weekendDayChargeWay: null,
                        weekendNightChargeWay: null,
                    });
                    this.state.weekendDaytimeForFree = '';
                    this.state.weekendNighttimeForFree = '';
                }, 100)
            })
        }
    }

    // 非工作日计费规则是否自定义
    isCustomRuleChange (e) {
        this.setState({
            isCustomRule: e.target.value !== 1,
        });
        const value = { target: { value: null } };
        this.onSingleDayChargingIntervalChange('restDay', value)
    }

    render () {
        //判断页面权限
        if (!window.checkPageEnable("chargeRuleAdd")) {
            return <Exception type={403}/>
        }
        const { getFieldDecorator } = this.props.form;
        const { workDaySingleDayChargingInterval, restDaySingleDayChargingInterval, isCustomRule } = this.state;
        const popoverInfo = (
            <div style={{ padding: 5, lineHeight: '22px', fontFamily: 'PingFangSC-Regular' }}>
                <div>举例</div>
                <div>免费停车15分钟；</div>
                <div>若需要计费，则停车16分钟算16分钟；</div>
                <div>若不需要计费，则停车16分钟算1分钟；</div>
                <div>请您根据您的实际情况进行选择。</div>
            </div>
        );
        return (
            <div className="page">
                <div className="page-header">新建计费规则</div>
                <div className="page-content" style={{ backgroundColor: "rgba(0,0,0,0)", padding: 0 }}>
                    <Spin tip="加载中.." spinning={this.state.loading}>
                        <Form>
                            {/*规则详情*/}
                            <Card title='规则详情'>
                                <div style={{ float: "left" }}>
                                    <div className="detail_display_sub_title"><span className="require_status">*</span>计费规则名称
                                    </div>
                                    <FormItem>
                                        {getFieldDecorator("ruleName", {
                                            rules: [{
                                                required: true,
                                                message: '请输入规则名称'
                                            }, {
                                                max: 20,
                                                message: '输入不可超过20字'
                                            }]
                                        })(
                                            <Input className="detail_single_input"
                                                   style={{ width: 326, marginBottom: 0 }}
                                                   placeholder="请输入" suffix={this.state.name.length + "/20"}
                                                   onChange={(e) => {
                                                       this.setState({ name: e.target.value })
                                                   }}/>
                                        )}
                                    </FormItem>
                                </div>
                                <div style={{ marginLeft: "47px", float: "left" }}>
                                    <div className="detail_display_sub_title"><span className="require_status">*</span>计费规则编号
                                    </div>
                                    <FormItem>
                                        {getFieldDecorator("ruleNumber", {
                                            rules: [{
                                                required: true,
                                                message: '请输入规则编号'
                                            }, {
                                                pattern: new RegExp("^([0-9A-Za-z]*)$"),
                                                message: '仅能填写数字与英文'
                                            }, {
                                                max: 20,
                                                message: '输入不可超过20字'
                                            }],
                                            validateFirst: true
                                        })(
                                            <Input className="detail_single_input"
                                                   style={{ width: 326, marginBottom: 0 }}
                                                   placeholder="请输入" suffix={this.state.number.length + "/20"}
                                                   onChange={(e) => {
                                                       this.setState({ number: e.target.value })
                                                   }}/>
                                        )}
                                    </FormItem>
                                    <div style={custom.clear}/>
                                </div>
                                <div style={custom.clear}/>
                                <div className="detail_display_sub_title"><span className="require_status">*</span>免费停车是否需要计费
                                    <Tooltip title={popoverInfo} placement='right' overlayStyle={{ maxWidth: 400, }}>
                                        <Icon style={{ color: 'rgba(255,180,0)', marginLeft: 10, fontSize: 17 }}
                                              type="info-circle"
                                        />
                                    </Tooltip>
                                </div>
                                <FormItem style={{ marginBottom: 0 }}>
                                    {getFieldDecorator("freeTimeChargeType", {
                                        rules: [{
                                            required: true,
                                            message: '请选择免费停车是否需要计费'
                                        }]
                                    })(
                                        <RadioGroup className="detail_single_input" onChange={(e) => {
                                            this.state.freeTimeChargeType = e.target.value
                                        }}>
                                            <Radio value={1}>需要计费</Radio>
                                            <Radio value={2}>不需要计费</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                            </Card>
                        </Form>

                        {/*工作日计费规则*/}
                        <Card title="工作日计费规则">
                            <Form>
                                {/*封顶价*/}
                                <div style={{ float: "left" }}>
                                    <div className="detail_display_sub_title"><span className="require_status">*</span>封顶价
                                    </div>
                                    <FormItem>
                                        {getFieldDecorator("workdayTop", {
                                            rules: [{
                                                required: true,
                                                message: '请输入封顶价'
                                            }, {
                                                max: 5,
                                                message: '输入内容需在5位以内',
                                            }, {
                                                pattern: new RegExp("^\\d+$"),
                                                message: '仅能填写非负整数'
                                            }],
                                            validateFirst: true
                                        })(
                                            <Input className="detail_single_input" style={{ width: 326 }}
                                                   placeholder="请输入"
                                                   suffix="元" onChange={(e) => this.state.workdayTop = e.target.value}/>
                                        )}
                                    </FormItem>
                                </div>
                                {/*单日计费区间*/}
                                <div style={{ marginLeft: "47px", float: "left" }}>
                                    <div className="detail_display_sub_title"><span className="require_status">*</span>单日计费区间
                                    </div>
                                    <FormItem>
                                        {getFieldDecorator('workSingleDayChargeRadio', {
                                            rules: [{
                                                required: true,
                                                message: '请选择单日计费区间'
                                            }]
                                        })(
                                            <RadioGroup className="detail_single_input"
                                                        onChange={this.onSingleDayChargingIntervalChange.bind(this, 'workDay')}>
                                                <Radio value={1}>白天统一收费</Radio>
                                                <Radio value={2}>夜间统一收费</Radio>
                                                <Radio value={3}>白天夜间区间收费</Radio>
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                </div>
                                <div style={custom.clear}/>
                            </Form>
                            {
                                <div id='workdayDayAndNight'>
                                    <div
                                        style={workDaySingleDayChargingInterval === 1 || workDaySingleDayChargingInterval === 3 ? {} : { display: 'none' }}>
                                        <Form>
                                            {/*白天设置*/}
                                            <div style={{
                                                marginTop: "24px",
                                                marginBottom: "16px",
                                                width: "100%"
                                            }}>
                                                <div className="detail_display_title"
                                                     style={{ float: "left" }}>白天设置
                                                </div>
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
                                            {/*免费时长*/}
                                            <div style={{ float: "left" }}>
                                                <div className="detail_display_sub_title"><span
                                                    className="require_status">*</span>免费停车
                                                </div>
                                                <FormItem>
                                                    {getFieldDecorator("workdayDaytimeForFree", {
                                                        rules: [{
                                                            required: true,
                                                            message: '请输入免费时长'
                                                        }, {
                                                            max: 10,
                                                            message: '输入内容需在10位以内',
                                                        }, {
                                                            pattern: new RegExp("^\\d+$"),
                                                            message: '仅能填写非负整数'
                                                        }]
                                                    })(
                                                        <Input className="detail_single_input"
                                                               style={{ width: 326 }}
                                                               placeholder="请输入"
                                                               suffix="分钟"
                                                               onChange={(e) => this.state.workdayDaytimeForFree = e.target.value}/>
                                                    )}
                                                </FormItem>
                                            </div>
                                            <div style={{ marginLeft: "47px", float: "left" }}>
                                                <div className="detail_display_sub_title"><span
                                                    className="require_status">*</span>收费方式
                                                </div>
                                                <FormItem>
                                                    {getFieldDecorator('workdayDayChargeWay', {
                                                        rules: [{
                                                            required: true,
                                                            message: '请选择收费方式'
                                                        }],
                                                        // initialValue: this.state.workdayDaytimeValue
                                                    })(
                                                        <RadioGroup className="detail_single_input"
                                                                    onChange={this.onChange.bind(this, "workdayDaytimeValue")}>
                                                            <Radio value={0}>按次收费</Radio>
                                                            <Radio value={1}>按时长收费</Radio>
                                                            <Radio value={2}>组合收费</Radio>
                                                        </RadioGroup>
                                                    )}
                                                </FormItem>
                                            </div>
                                            <div style={custom.clear}/>
                                            <div style={{ height: "16px" }}/>
                                        </Form>
                                        <RuleInsert
                                            id="workdayDaytimeSmallCar"
                                            type={this.state.workdayDaytimeValue}
                                            // carType="smallCar"
                                            dayType="workday"
                                            timeType="daytime"
                                        />
                                        {/*<RuleInsert
                                            id="workdayDaytimeBigCar"
                                            type={this.state.workdayDaytimeValue}
                                            carType="bigCar"
                                            dayType="workday"
                                            timeType="daytime"
                                        />*/}
                                    </div>

                                    <div
                                        style={workDaySingleDayChargingInterval === 2 || workDaySingleDayChargingInterval === 3 ? {} : { display: 'none' }}>
                                        <div style={{ marginTop: "24px", marginBottom: "16px", width: "100%" }}>
                                            <div className="detail_display_title"
                                                 style={{ float: "left" }}>夜间设置
                                            </div>
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
                                        <Form>
                                            {/*免费时长*/}
                                            <div style={{ float: "left" }}>
                                                <div className="detail_display_sub_title"><span
                                                    className="require_status">*</span>免费停车
                                                </div>
                                                <FormItem>
                                                    {getFieldDecorator("workdayNighttimeForFree", {
                                                        rules: [{
                                                            required: true,
                                                            message: '请输入免费时长'
                                                        }, {
                                                            max: 10,
                                                            message: '输入内容需在10位以内',
                                                        }, {
                                                            pattern: new RegExp("^\\d+$"),
                                                            message: '仅能填写非负整数'
                                                        }]
                                                    })(
                                                        <Input className="detail_single_input"
                                                               style={{ width: 326 }}
                                                               placeholder="请输入"
                                                               suffix="分钟"
                                                               onChange={(e) => this.state.workdayNighttimeForFree = e.target.value}/>
                                                    )}
                                                </FormItem>
                                            </div>
                                            <div style={{ marginLeft: "47px", float: "left" }}>
                                                <div className="detail_display_sub_title"><span
                                                    className="require_status">*</span>收费方式
                                                </div>
                                                <FormItem>
                                                    {getFieldDecorator('workdayNightChargeWay', {
                                                        rules: [{
                                                            required: true,
                                                            message: '请选择收费方式'
                                                        }],
                                                        // initialValue: this.state.workdayNighttimeValue
                                                    })(
                                                        <RadioGroup className="detail_single_input"
                                                                    onChange={this.onChange.bind(this, "workdayNighttimeValue")}>
                                                            <Radio value={0}>按次收费</Radio>
                                                            <Radio value={1}>按时长收费</Radio>
                                                            <Radio value={2}>组合收费</Radio>
                                                        </RadioGroup>
                                                    )}
                                                </FormItem>
                                            </div>
                                            <div style={custom.clear}/>
                                            <div style={{ height: "16px" }}/>
                                        </Form>
                                        <RuleInsert
                                            id="workdayNighttimeSmallCar"
                                            type={this.state.workdayNighttimeValue}
                                            // carType="smallCar"
                                            dayType="workday"
                                            timeType="nighttime"
                                        />
                                        {/*<RuleInsert
                                            id="workdayNighttimeBigCar"
                                            type={this.state.workdayNighttimeValue}
                                            carType="bigCar"
                                            dayType="workday"
                                            timeType="nighttime"
                                        />*/}
                                    </div>
                                </div>
                            }
                        </Card>

                        {/*非工作日计费规则*/}
                        <Card title="非工作日计费规则">
                            <Form>
                                <FormItem>
                                    {getFieldDecorator('isCustomRule', {
                                        initialValue: 1
                                    })(
                                        <RadioGroup className="detail_single_input"
                                                    onChange={this.isCustomRuleChange.bind(this)}>
                                            <Radio value={1}>与工作日一致</Radio>
                                            <Radio value={2}>自定义</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                                {
                                    isCustomRule && (
                                        <Fragment>
                                            {/*封顶价*/}
                                            <div style={{ float: "left" }}>
                                                <div className="detail_display_sub_title"><span
                                                    className="require_status">*</span>封顶价
                                                </div>
                                                <FormItem>
                                                    {getFieldDecorator("weekendTop", {
                                                        rules: [{
                                                            required: true,
                                                            message: '请输入封顶价'
                                                        }, {
                                                            max: 5,
                                                            message: '输入内容需在5位以内',
                                                        }, {
                                                            pattern: new RegExp("^\\d+$"),
                                                            message: '仅能填写非负整数'
                                                        }],
                                                        validateFirst: true
                                                    })(
                                                        <Input className="detail_single_input" style={{ width: 326 }}
                                                               placeholder="请输入"
                                                               suffix="元"
                                                               onChange={(e) => this.state.weekendTop = e.target.value}/>
                                                    )}
                                                </FormItem>
                                            </div>
                                            {/*单日计费区间*/}
                                            <div style={{ marginLeft: "47px", float: "left" }}>
                                                <div className="detail_display_sub_title"><span
                                                    className="require_status">*</span>单日计费区间
                                                </div>
                                                <FormItem>
                                                    {getFieldDecorator('restSingleDayChargeRadio', {
                                                        rules: [{
                                                            required: true,
                                                            message: '请选择单日计费区间'
                                                        }]
                                                    })(
                                                        <RadioGroup className="detail_single_input"
                                                                    onChange={this.onSingleDayChargingIntervalChange.bind(this, 'restDay')}>
                                                            <Radio value={1}>白天统一收费</Radio>
                                                            <Radio value={2}>夜间统一收费</Radio>
                                                            <Radio value={3}>白天夜间区间收费</Radio>
                                                        </RadioGroup>
                                                    )}
                                                </FormItem>
                                            </div>
                                            <div style={custom.clear}/>
                                        </Fragment>
                                    )
                                }
                            </Form>
                            {
                                <div id='weekendDayAndNight'>
                                    <div
                                        style={restDaySingleDayChargingInterval === 1 || restDaySingleDayChargingInterval === 3 ? {} : { display: 'none' }}>
                                        {/*白天设置*/}
                                        <div style={{ marginTop: "24px", marginBottom: "16px", width: "100%" }}>
                                            <div className="detail_display_title"
                                                 style={{ float: "left" }}>白天设置
                                            </div>
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
                                        <Form>
                                            {/*免费时长*/}
                                            <div style={{ float: "left" }}>
                                                <div className="detail_display_sub_title"><span
                                                    className="require_status">*</span>免费停车
                                                </div>
                                                <FormItem>
                                                    {getFieldDecorator("weekendDaytimeForFree", {
                                                        rules: [{
                                                            required: true,
                                                            message: '请输入免费时长'
                                                        }, {
                                                            max: 10,
                                                            message: '输入内容需在10位以内',
                                                        }, {
                                                            pattern: new RegExp("^\\d+$"),
                                                            message: '仅能填写非负整数'
                                                        }]
                                                    })(
                                                        <Input className="detail_single_input"
                                                               style={{ width: 326 }}
                                                               placeholder="请输入"
                                                               suffix="分钟"
                                                               onChange={(e) => this.state.weekendDaytimeForFree = e.target.value}/>
                                                    )}
                                                </FormItem>
                                            </div>
                                            <div style={{ marginLeft: "47px", float: "left" }}>
                                                <div className="detail_display_sub_title"><span
                                                    className="require_status">*</span>收费方式
                                                </div>
                                                <FormItem>
                                                    {getFieldDecorator('weekendDayChargeWay', {
                                                        rules: [{
                                                            required: true,
                                                            message: '请选择收费方式'
                                                        }],
                                                        // initialValue: this.state.weekendDaytimeValue
                                                    })(
                                                        <RadioGroup className="detail_single_input"
                                                                    onChange={this.onChange.bind(this, "weekendDaytimeValue")}>
                                                            <Radio value={0}>按次收费</Radio>
                                                            <Radio value={1}>按时长收费</Radio>
                                                            <Radio value={2}>组合收费</Radio>
                                                        </RadioGroup>
                                                    )}
                                                </FormItem>
                                            </div>
                                            <div style={custom.clear}/>
                                            <div style={{ height: "16px" }}/>
                                        </Form>
                                        <RuleInsert
                                            id="weekendDaytimeSmallCar"
                                            type={this.state.weekendDaytimeValue}
                                            // carType="smallCar"
                                            dayType="weekend"
                                            timeType="daytime"
                                        />
                                        {/*<RuleInsert
                                            id="weekendDaytimeBigCar"
                                            type={this.state.weekendDaytimeValue}
                                            carType="bigCar"
                                            dayType="weekend"
                                            timeType="daytime"
                                        />*/}
                                    </div>

                                    <div
                                        style={restDaySingleDayChargingInterval === 2 || restDaySingleDayChargingInterval === 3 ? {} : { display: 'none' }}>
                                        {/*夜间设置*/}
                                        <div style={{ marginTop: "24px", marginBottom: "16px", width: "100%" }}>
                                            <div className="detail_display_title" style={{ float: "left" }}>夜间设置
                                            </div>
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
                                        <Form>
                                            {/*免费时长*/}
                                            <div style={{ float: "left" }}>
                                                <div className="detail_display_sub_title"><span
                                                    className="require_status">*</span>免费停车
                                                </div>
                                                <FormItem>
                                                    {getFieldDecorator("weekendNighttimeForFree", {
                                                        rules: [{
                                                            required: true,
                                                            message: '请输入免费时长'
                                                        }, {
                                                            max: 10,
                                                            message: '输入内容需在10位以内',
                                                        }, {
                                                            pattern: new RegExp("^\\d+$"),
                                                            message: '仅能填写非负整数'
                                                        }]
                                                    })(
                                                        <Input className="detail_single_input"
                                                               style={{ width: 326 }}
                                                               placeholder="请输入"
                                                               suffix="分钟"
                                                               onChange={(e) => this.state.weekendNighttimeForFree = e.target.value}/>
                                                    )}
                                                </FormItem>
                                            </div>
                                            <div style={{ marginLeft: "47px", float: "left" }}>
                                                <div className="detail_display_sub_title"><span
                                                    className="require_status">*</span>收费方式
                                                </div>
                                                <FormItem>
                                                    {getFieldDecorator('weekendNightChargeWay', {
                                                        rules: [{
                                                            required: true,
                                                            message: '请选择收费方式'
                                                        }],
                                                        // initialValue: this.state.weekendNighttimeValue
                                                    })(
                                                        <RadioGroup className="detail_single_input"
                                                                    onChange={this.onChange.bind(this, "weekendNighttimeValue")}>
                                                            <Radio value={0}>按次收费</Radio>
                                                            <Radio value={1}>按时长收费</Radio>
                                                            <Radio value={2}>组合收费</Radio>
                                                        </RadioGroup>
                                                    )}
                                                </FormItem>
                                            </div>
                                            <div style={custom.clear}/>
                                            <div style={{ height: "16px" }}/>
                                        </Form>
                                        <RuleInsert
                                            id="weekendNighttimeSmallCar"
                                            type={this.state.weekendNighttimeValue}
                                            // carType="smallCar"
                                            dayType="weekend"
                                            timeType="nighttime"
                                        />
                                        {/*<RuleInsert
                                            id="weekendNighttimeBigCar"
                                            type={this.state.weekendNighttimeValue}
                                            carType="bigCar"
                                            dayType="weekend"
                                            timeType="nighttime"
                                        />*/}
                                    </div>
                                </div>
                            }
                        </Card>
                    </Spin>
                </div>

                <div className="edit_bottom">
                    <Button type="primary" style={{ float: "right" }} onClick={this.submit.bind(this)}>提交</Button>
                    <Button style={{ float: "right", marginRight: "12px" }} onClick={this.cancel.bind(this)}>取消</Button>
                    <div style={custom.clear}/>
                </div>
            </div>
        )
    }
}


export default Form.create()(InsertChargeRules);

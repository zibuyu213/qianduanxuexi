import React, {Component} from 'react';
import {react} from 'react.eval';
import {Global} from "../../../common/SystemFunction";

import {CSS} from "../Style/Rule.css";
import '../Style/SectionResource.css'
import {custom} from "../../../common/SystemStyle";

import {Form, message, Input, Button, Select} from "antd";

const FormItem = Form.Item;
const Option = Select.Option;


const lineStyle = {
    height: "32px",
    marginBottom: "2.6rem"
};
const firstComplexTextStyle = {
    textAlign: "left"
};
const secondComplexTextStyle = {
    marginLeft: "16px",
    textAlign: "right"
};
const firstTextStyle = {
    // width:"42px",
    textAlign: "left"
};
const secondTextStyle = {
    marginLeft: "16px",
    // width:"112px",
    textAlign: "right"
};

//按時收费 编辑组件

class EditForComplex extends Component {
    constructor (props) {
        super(props);
        react(this);
        message.config({
            duration: 1
        });
        let firstChild = {
            "hour1": "",
            "hour2": "",
            "price": "",
            "unit": window.UNIT_NAME || '小时',
            "type": 0,
            'chargeWay': 2,
        };
        let lastChild = {
            "hour1": "",
            "hour2": "",
            "price": "",
            "unit": window.UNIT_NAME || '小时',
            "type": 1,
            'chargeWay': 2,
        };
        let centerList = [];
        let voidId = Math.floor((Math.random() * 100) + 1);
        if (this.props.ruleDetailList) {
            firstChild = {
                ...this.props.ruleDetailList[0],
                'chargeWay': 2,
            };
            lastChild = {
                ...this.props.ruleDetailList[this.props.ruleDetailList.length - 1],
                'chargeWay': 2,
            };

            let copyArray = Global.deepCopy(this.props.ruleDetailList);
            copyArray.pop();
            copyArray.splice(0, 1);
            // console.log('获取centerList：', copyArray);
            centerList = copyArray;

            for (let i = 0; i < centerList.length; i++) {
                centerList[i].id = voidId;
                centerList[i].chargeWay = 2;
                //除了第一条其它 type都是1
                centerList[i].type = 1;
                voidId++;
            }
        }

        this.state = {
            //列表参数
            voidId: voidId,
            centerList: centerList,
            firstChild: firstChild,
            lastChild: lastChild,
            reset: false,
            unitName: window.UNIT_NAME || '小时', // 计费单位
        };
        // console.log(this.props.dayType + this.props.timeType + this.props.carType);
    }

    componentWillMount () {

    }

    componentDidMount () {
        //设置初始值

    }

    insertLine () {
        let child = {
            id: this.state.voidId,// | integer | 序号 |
            "hour1": "",                     // | integer | 起始小时 |
            "hour2": "",                     // | integer | 结束小时 |
            "price": "",                   // | string | 单价 |
            "unit": this.state.unitName,      // | string | 收费单位 |
            "type": 0,
            'chargeWay': 2, // | integer | 计费方式 0：按次收费 1：按时长收费 2：组合收费 |
            //组合收费时 接下来的收费规则
        };

        this.state.voidId++;
        this.state.centerList.push(child);
        this.updateFirstLastAndCenterChild();
    }

    onEndHourChange (object, e) {
        let childIndex = this.state.centerList.findIndex(item => {
            return item.id === object.id
        });
        this.state.centerList[childIndex].hour2 = e.target.value;
        this.updateFirstLastAndCenterChild();
    }

    onPriceChange (object, e) {
        // console.log(object);
        let childIndex = this.state.centerList.findIndex(item => {
            return item.id === object.id
        });
        this.state.centerList[childIndex].price = e.target.value;
        // console.log(this.state.centerList);
    }

    deleteLine (index) {
        const list = this.state.centerList;
        list.splice(index, 1);
        if (list.length === 0) {
            this.state.lastChild.hour1 = this.state.firstChild.hour2;
        } else {
            this.state.lastChild.hour1 = list[list.length - 1].hour2;
        }
        //中间项
        list.map((item, index) => {
            if (index === 0) {
                item.hour1 = this.state.firstChild.hour2;

            } else {
                item.hour1 = list[index - 1].hour2
            }
            this.props.form.setFieldsValue({ [this.props.dayType + this.props.timeType + this.props.carType + "center_line_start_hour_" + index]: item.hour1 });
            this.props.form.setFieldsValue({ [this.props.dayType + this.props.timeType + this.props.carType + "center_line_end_hour_" + index]: item.hour2 });
        });
        this.setState({
            firstChild: this.state.firstChild,
            lastChild: this.state.lastChild,
            centerList: list,
        });
    }

    centerValidator (rule, value, callback) {
        let arr = rule.field.split("_");
        //时间
        let index = parseInt(arr[arr.length - 1]);
        let type = arr[2];
        if (type === "end") {
            //hour2 校验
            if (this.state.centerList[index].hour1.length > 0) {
                if (parseInt(value) <= parseInt(this.state.centerList[index].hour1)) {
                    callback("需大于前项");
                }
            }
        }
        callback(); // 校验通过
    }

    validatorPrice(rule, value, callback) {
        const reg = /^\d+(\.{0,1}\d+){0,1}$/;
        if (!reg.test(value)) callback('要求正数');
        if (parseFloat(value) <= 0) callback('要求正数');
        // 小数
        if (value.indexOf('.') !== -1) {
            const integerBit = value.split('.')[0];
            if (integerBit.length > 5) callback('整数位最多5位');
            const decimalPlace = value.split('.')[1];
            if (decimalPlace.length > 2) callback('小数位最多2位');
        }else { //整数
            if (value > 5) callback('整数位最多5位');
        }
        callback()
    }

    getTimeCenterList (item, index) {
        let body =
            (<div style={lineStyle} key={item.id}>
                <div className="detail_edit_text">停车</div>
                <FormItem style={{ width: 74 }} className="detail_edit_form">
                    {this.props.form.getFieldDecorator(this.props.dayType + this.props.timeType + this.props.carType + "center_line_start_hour_" + index, {
                        initialValue: item.hour1,
                    })(
                        <Input style={{ width: 74 }} disabled={true} className="detail_edit_input" placeholder="请输入"/>
                    )}
                </FormItem>
                <div style={{ padding: "0 7px" }} className="detail_edit_text">-</div>
                <FormItem style={{ width: 74 }} className="detail_edit_form">
                    {this.props.form.getFieldDecorator(this.props.dayType + this.props.timeType + this.props.carType + "center_line_end_hour_" + index, {
                        initialValue: item.hour2,
                        rules: [{
                            required: true,
                            message: '必填'
                        }, {
                            max: 5,
                            transform: (value) => {
                                return value + ""
                            },
                            message: '5位以内',
                        }, {
                            pattern: new RegExp("^[1-9]\\d*$"),
                            message: '仅允许非零正整数'
                        }, {
                            validator: this.centerValidator.bind(this)
                        }],
                        // validateTrigger:""
                    })(
                        <Input style={{ width: 74 }} className="detail_edit_input" placeholder="请输入"
                               onChange={this.onEndHourChange.bind(this, item)}/>
                    )}
                </FormItem>
                <div className="detail_edit_text" style={firstTextStyle}>小时</div>

                <div className="detail_edit_text" style={secondTextStyle}>超出时间收费单价</div>
                <FormItem className="detail_edit_form">
                    {this.props.form.getFieldDecorator(this.props.dayType + this.props.timeType + this.props.carType + "center_line_price_" + index, {
                        initialValue: item.price,
                        rules: [{
                            required: true,
                            message: '必填'
                        }, {
                            validator: this.validatorPrice.bind(this)
                        }]
                    })(
                        <Input className="detail_edit_input" placeholder="请输入"
                               onChange={this.onPriceChange.bind(this, item)}/>
                    )}
                </FormItem>
                <div className="detail_edit_text">元/{window.UNIT_NAME}</div>
                <img className="detail_edit_delete_button" src="resources/images/rule_line_delete.png"
                     onClick={this.deleteLine.bind(this, index)}/>
                <div style={custom.clear}/>
            </div>);
        return body;
    }

    //提交
    check () {
        let result;
        this.props.form.validateFieldsAndScroll({ force: true }, ((err, values) => {
            result = err;
        }).bind(this));
        if (!result) {
            let children = [];
            let sort = 1;

            let first = {
                sort: sort,
                "hour1": this.state.firstChild.hour1,
                "hour2": this.state.firstChild.hour2,
                "price": this.state.firstChild.price,
                "unit": this.state.firstChild.unit,
                "type": this.state.firstChild.type,
                'chargeWay': this.state.firstChild.chargeWay,
            };
            children.push(first);

            sort++;
            this.state.centerList.map(item => {
                let object = {
                    sort: sort,
                    "hour1": item.hour1,
                    "hour2": item.hour2,
                    "price": item.price,
                    "unit": item.unit,
                    //"type": item.type,
                    "type": 1,
                    'chargeWay': item.chargeWay,
                };
                children.push(object);
                sort++;
            });

            let last = {
                sort: sort,
                "hour1": this.state.lastChild.hour1,
                "hour2": this.state.lastChild.hour2,
                "price": this.state.lastChild.price,
                "unit": this.state.lastChild.unit,
                //"type": this.state.lastChild.type,
                "type": 1,
                'chargeWay': this.state.lastChild.chargeWay,
            };
            children.push(last);
            return children;
        } else {
            return false;
        }
    }

    handleChange (value) {
        this.state.firstChild.type = parseInt(value);
        this.state.firstChild.unit = (value == "0" ? "次" : window.UNIT_NAME);
        this.setState({
            firstChild: this.state.firstChild
        })
    }

    //组合项外部首条输入 组合项内首条输入、中间项输入、中间项删除、中间项新增时调用
    updateFirstLastAndCenterChild () {
        //尾项
        if (this.state.centerList.length === 0) {
            this.state.lastChild.hour1 = this.state.firstChild.hour2;
        } else {
            this.state.lastChild.hour1 = this.state.centerList[this.state.centerList.length - 1].hour2;
        }
        // this.props.form.setFieldsValue({[this.props.dayType+this.props.timeType+this.props.carType+"last_line_hour"]:this.state.lastChild.hour1});
        //中间项
        this.state.centerList.map((item, index) => {
            if (index === 0) {
                item.hour1 = this.state.firstChild.hour2;

            } else {
                item.hour1 = this.state.centerList[index - 1].hour2
            }
            // this.props.form.setFieldsValue({[this.props.dayType+this.props.timeType+this.props.carType+"center_line_start_hour_"+index]:item.hour1});
        });
        this.setState({
            firstChild: this.state.firstChild,
            lastChild: this.state.lastChild,
            centerList: this.state.centerList,
            reset: true
        });
    }

    render () {
        const { getFieldDecorator } = this.props.form;

        const selectAfter = (
            <Select value={this.state.firstChild.type + ""} className="detail_edit_complex_select"
                    style={{ minWidth: 90 }} onChange={this.handleChange.bind(this)}>
                <Option value="0">元/每次</Option>
                <Option value="1">元/{window.UNIT_NAME}</Option>
            </Select>
        );
        return (
            <div>
                <Form>
                    {/*第一行*/}
                    <div style={lineStyle}>
                        <div className="detail_edit_text">停车</div>
                        <FormItem className="detail_edit_form">
                            {getFieldDecorator(this.props.dayType + this.props.timeType + this.props.carType + "first_line_hour", {
                                initialValue: this.state.firstChild.hour2,
                                rules: [{
                                    required: true,
                                    message: '必填'
                                }, {
                                    max: 5,
                                    transform: (value) => {
                                        return value + ""
                                    },
                                    message: '输入内容需在5位以内',
                                }, {
                                    pattern: new RegExp("^[1-9]\\d*$"),
                                    message: '仅允许非零正整数'
                                }],
                                // validateTrigger:""
                            })(
                                <Input className="detail_edit_input"
                                       placeholder="请输入"
                                       onChange={((e) => {
                                           this.state.firstChild.hour2 = e.target.value;
                                           this.updateFirstLastAndCenterChild();
                                       }).bind(this)}/>
                            )}
                        </FormItem>
                        <div className="detail_edit_text" style={firstTextStyle}>小时内</div>
                        <div className="detail_edit_text" style={secondTextStyle}>单价</div>
                        <FormItem className="detail_edit_form">
                            {getFieldDecorator(this.props.dayType + this.props.timeType + this.props.carType + "first_line_price", {
                                initialValue: this.state.firstChild.price,
                                rules: [{
                                    required: true,
                                    message: '必填'
                                }, {
                                    validator: this.validatorPrice.bind(this)
                                }]
                            })(
                                <Input className="detail_edit_input" placeholder="请输入" addonAfter={selectAfter}
                                       onChange={(e) => this.state.firstChild.price = e.target.value}/>
                            )}
                        </FormItem>
                        {/*<div className="detail_edit_text">元/{window.UNIT_NAME}</div>*/}
                        <div style={custom.clear}/>
                    </div>

                    {/*中间*/}
                    {this.state.centerList.map((item, index) => {
                        return this.getTimeCenterList(item, index);
                    })}
                    {/*添加按钮*/}
                    <div className="detail_edit_insert_button cursor-pointer"
                         onClick={this.insertLine.bind(this)}>+&nbsp;&nbsp;添加
                    </div>

                    {/*最后一行*/}
                    <div style={lineStyle}>
                        <div className="detail_edit_text">停车</div>
                        <FormItem className="detail_edit_form">
                            {getFieldDecorator(this.props.dayType + this.props.timeType + this.props.carType + "last_line_hour", {
                                initialValue: this.state.lastChild.hour1,
                            })(
                                <Input disabled={true} className="detail_edit_input" placeholder="请输入"/>
                            )}
                        </FormItem>
                        <div className="detail_edit_text" style={firstTextStyle}>小时后</div>
                        <div className="detail_edit_text" style={secondTextStyle}>超出时间收费单价</div>
                        <FormItem className="detail_edit_form">
                            {getFieldDecorator(this.props.dayType + this.props.timeType + this.props.carType + "last_line_price", {
                                initialValue: this.state.lastChild.price,
                                rules: [{
                                    required: true,
                                    message: '必填'
                                }, {
                                    validator: this.validatorPrice.bind(this)
                                }]
                            })(
                                <Input className="detail_edit_input" placeholder="请输入"
                                       onChange={(e) => this.state.lastChild.price = e.target.value}/>
                            )}
                        </FormItem>
                        <div className="detail_edit_text">元/{window.UNIT_NAME}</div>
                        <div style={custom.clear}/>
                    </div>
                </Form>
            </div>
        )
    }
}
export default Form.create()(EditForComplex);

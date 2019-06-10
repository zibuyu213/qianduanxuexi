import React, {Component} from 'react';
import {react} from 'react.eval';
import {Global} from "../../../common/SystemFunction";

import {CSS} from "../Style/Rule.css";
import '../Style/SectionResource.css'
import {custom} from "../../../common/SystemStyle";

import {Form, message, Input, Button} from "antd";

const FormItem = Form.Item;


const lineStyle = {
    height: "32px",
    marginBottom: "2.6rem"
};

const firstTextStyle = {
    // width: "56px",
    textAlign: "left"
};

const secondTextStyle = {
    marginLeft: "16px",
    textAlign: "right"
};

//按次收费 编辑组件

class EditForTime extends Component {
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
            "unit": "次",
            "type": 0,
        };
        let lastChild = {
            "hour1": "",
            "hour2": "",
            "price": "",
            "unit": "次",
            "type": 0,
        };
        let centerList = [];

        let voidId = Math.floor((Math.random() * 100) + 1);
        if (this.props.ruleDetailList) {
            firstChild = this.props.ruleDetailList[0];
            lastChild = this.props.ruleDetailList[this.props.ruleDetailList.length - 1];

            let copyArray = Global.deepCopy(this.props.ruleDetailList);
            copyArray.pop();
            copyArray.splice(0, 1);
            // console.log(copyArray);
            centerList = copyArray;

            for (let i = 0; i < centerList.length; i++) {
                centerList[i].id = voidId;
                voidId++;
            }
        }
        this.state = {
            //列表参数
            voidId: voidId,
            centerList: centerList,
            firstChild: firstChild,
            lastChild: lastChild,
            reset: false
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
            "unit": "次",      // | string | 单位 |
            "type": 0,             // | integer | 计费方式 0：按次收费 1：按时长收费 2：组合收费 |
            //组合收费时 接下来的收费规则
        };
        this.state.voidId++;
        this.state.centerList.push(child);
        this.updateFirstLastAndCenterChild();
    }

    onHourChange (object, e) {
        let childIndex = this.state.centerList.findIndex(item => {
            return item.id === object.id
        });
        this.state.centerList[childIndex].hour1 = e.target.value;
        this.updateFirstLastAndCenterChild();
    }

    onPriceChange (object, e) {
        let childIndex = this.state.centerList.findIndex(item => {
            return item.id === object.id
        });
        this.state.centerList[childIndex].price = e.target.value;
    }

    deleteLine (index) {
        this.state.centerList.splice(index, 1);
        this.state.centerList.map((item, index) => {
            this.props.form.setFieldsValue({ [this.props.dayType + this.props.timeType + this.props.carType + "center_line_start_hour_" + index]: item.hour1 });
            this.props.form.setFieldsValue({ [this.props.dayType + this.props.timeType + this.props.carType + "center_line_price_" + index]: item.price });
        });
        this.updateFirstLastAndCenterChild();
    }

    centerValidator (rule, value, callback) {
        let arr = rule.field.split("_");
        //时间
        let index = parseInt(arr[arr.length - 1]);
        if (index === 0) {
            //第一项
            if (this.state.firstChild.hour1.toString().length > 0) {
                //第一项有值 比较
                if (parseInt(value) <= parseInt(this.state.firstChild.hour1)) {
                    callback("需大于前项");
                }
            }
        } else {
            //不是第一项 跟前一项比较
            if (this.state.centerList[index - 1].hour1.toString().length > 0) {
                //前一项有值 比较
                if (parseInt(value) <= parseInt(this.state.centerList[index - 1].hour1)) {
                    callback("需大于前项");
                }
            }
        }
        callback(); // 校验通过
    }

    getTimeCenterList (item, index) {
        let body =
            (<div style={lineStyle} key={item.id}>
                <div className="detail_edit_text">停车</div>
                <FormItem className="detail_edit_form">
                    {this.props.form.getFieldDecorator(this.props.dayType + this.props.timeType + this.props.carType + "center_line_start_hour_" + index, {
                        initialValue: item.hour1,
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
                        }, {
                            validator: this.centerValidator.bind(this)
                        }],
                        // validateTrigger:""
                    })(
                        <Input className="detail_edit_input" placeholder="请输入"
                               onChange={this.onHourChange.bind(this, item)}
                        />
                    )}
                </FormItem>
                <div className="detail_edit_text" style={firstTextStyle}>小时内</div>

                <div className="detail_edit_text" style={secondTextStyle}>单价</div>
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
                <div className="detail_edit_text">元/次</div>
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
                    "type": item.type,
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
                "type": this.state.lastChild.type,
            };
            children.push(last);

            return children;
        } else {
            return false;
        }

    }

    //首条输入、中间项输入、中间项删除、中间项新增时调用
    updateFirstLastAndCenterChild () {
        if (this.state.centerList.length === 0) {
            this.state.lastChild.hour1 = this.state.firstChild.hour1;
        } else {
            this.state.lastChild.hour1 = this.state.centerList[this.state.centerList.length - 1].hour1;
        }
        this.setState({
            firstChild: this.state.firstChild,
            lastChild: this.state.lastChild,
            centerList: this.state.centerList,
            reset: true
        });

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

    render () {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Form>
                    {/*第一行*/}
                    <div style={lineStyle}>
                        <div className="detail_edit_text">停车</div>
                        <FormItem className="detail_edit_form">
                            {getFieldDecorator(this.props.dayType + this.props.timeType + this.props.carType + "first_line_hour", {
                                initialValue: this.state.firstChild.hour1,
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
                            })(
                                <Input className="detail_edit_input"
                                       placeholder="请输入"
                                       onChange={((e) => {
                                           this.state.firstChild.hour1 = e.target.value;
                                           this.updateFirstLastAndCenterChild();
                                       }).bind(this)}/>
                            )}
                        </FormItem>
                        <div className="detail_edit_text" style={firstTextStyle}>小时内</div>
                        <div className="detail_edit_text" style={secondTextStyle}>单价</div>
                        <FormItem className="detail_edit_form">
                            {getFieldDecorator(this.props.dayType + this.props.timeType + this.props.carType + "first_line_price", {
                                initialValue: this.state.firstChild.price,
                                validateFirst: true,
                                rules: [{
                                    required: true,
                                    message: '必填'
                                }, {
                                    validator: this.validatorPrice.bind(this)
                                }]
                            })(
                                <Input className="detail_edit_input" placeholder="请输入"
                                       onChange={(e) => this.state.firstChild.price = e.target.value}/>
                            )}
                        </FormItem>
                        <div className="detail_edit_text">元/次</div>
                        <div style={custom.clear}/>
                    </div>

                    {/*中间*/}
                    {this.state.centerList.map((item, index) => {
                        return this.getTimeCenterList(item, index);
                    })}

                    {/*添加按钮*/}
                    <div style={{ width: 492 }} className="detail_edit_insert_button cursor-pointer"
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
                        <div className="detail_edit_text" style={firstTextStyle}>小时以上</div>
                        <div className="detail_edit_text" style={secondTextStyle}>单价</div>
                        <FormItem className="detail_edit_form">
                            {getFieldDecorator(this.props.dayType + this.props.timeType + this.props.carType + "last_line_price", {
                                initialValue: this.state.lastChild.price,
                                validateFirst: true,
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
                        <div className="detail_edit_text">元/次</div>
                        <div style={custom.clear}/>
                    </div>
                </Form>
            </div>
        )
    }
}

export default Form.create()(EditForTime);

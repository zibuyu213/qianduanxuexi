import React, {Component} from 'react';
import {Form, Modal, Input, message, Select, Radio, DatePicker, Spin, TreeSelect} from "antd/lib/index";
import {HttpClient} from "../../../common/HttpClient";
import moment from "moment/moment";
import _ from 'lodash';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const {RangePicker} = DatePicker;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const dateFormat = 'YYYY-MM-DD';

const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
};

class WhiteListModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            submitLoading: false,
            visible: this.props.visible,
            preferentialParkingList: [],
            parkingSelect: [],
            radioType: null,
            timeType: null,
            discount: '',//金额变化控制

        };
    }


    componentWillMount() {

    }

    componentDidMount() {
        this.loadPreferentialParking();
    }

    componentWillReceiveProps(nextProps) {
        const oldVisible = this.props.visible;
        const newVisible = nextProps.visible;
        if (oldVisible !== newVisible) {
            this.setState({
                visible: newVisible,
            });
        }
        const oldData = this.props.data;
        const newData = nextProps.data;
        if (newData !== oldData) {
            this.setState({
                discount: newData.couponAmount,
                radioType: newData.couponType,
                timeType: newData.timeType
            })
        }
    }

    /**
     * 加载优惠路段
     */
    loadPreferentialParking() {
        this.setState({
            loading: true,
        });
        HttpClient.query(window.MODULE_PARKING_RESOURCE + `/admin/resource/parking/gets`, "GET", {}, (d, type) => {
            this.state.submitLoading = false;
            if (type == HttpClient.requestSuccess) {
                let childrenData = [];
                _.toArray(d.data).map(item => {
                    const obj = {
                        title: item.parkingName,
                        value: item.id,
                        key: item.id,
                    };
                    childrenData.push(obj)
                });
                this.setState({
                    loading: false,
                    preferentialParkingList: [{
                        title: '全部',
                        value: 'all',
                        key: 'all',
                        children: childrenData
                    }]
                });
            } else {
                this.setState({
                    loading: false,
                })
            }
        });
    }

    /**
     * 优惠金额
     * @param e
     */
    onRadioChange(e) {
        this.setState({
            radioType: e.target.value,
        });
    }

    /**
     * 生效时间范围
     * @param e
     */
    onTimeTypeChange(e) {
        this.setState({
            timeType: e.target.value,
        });
    }

    inputChange(e) {
        this.setState({
            discount: e.target.value,
        })
    }

    check() {
        if (!this.state.submitLoading) {
            this.state.submitLoading = true;
            this.props.form.validateFields((err, fieldsValue) => {
                let parkingSelect = fieldsValue['preferentialSection'];
                if (!err) {
                    if (this.props.type == 0) {//新建
                        const rangeTime = fieldsValue['effectiveTime'];
                        let data = {
                            ...fieldsValue,
                            'preferentialSection': parkingSelect.join(','),
                            'couponAmount': fieldsValue['couponType'] > 0 ? fieldsValue['couponAmount'] : 0,
                            'effectiveTime': fieldsValue['timeType'] === 0 ? rangeTime[0].format(dateFormat) : "",
                            'invalidTime': fieldsValue['timeType'] === 0 ? rangeTime[1].format(dateFormat) : "",
                        };
                        HttpClient.query(window.MODULE_PARKING_INFO + `/centerConsole/info/coupons`, "POST", JSON.stringify(data), (d, type) => {
                            this.state.submitLoading = false;
                            if (type == HttpClient.requestSuccess) {
                                this.setState({
                                    visible: false,
                                });
                                message.success(d.data);
                                this.props.form.resetFields();
                                this.props.onOk();
                            }
                        });
                    } else {
                        const rangeTime = fieldsValue['effectiveTime'];
                        let data = {
                            ...fieldsValue,
                            'plateNumber': this.props.data.plateNumber,
                            'preferentialSection': parkingSelect.join(','),
                            'couponAmount': fieldsValue['couponType'] > 0 ? fieldsValue['couponAmount'] : 0,
                            'effectiveTime': fieldsValue['timeType'] === 0 ? rangeTime[0].format(dateFormat) : "",
                            'invalidTime': fieldsValue['timeType'] === 0 ? rangeTime[1].format(dateFormat) : "",
                        };
                        HttpClient.query(window.MODULE_PARKING_INFO + `/centerConsole/info/coupons/${this.props.data.nameId}`, "PUT", JSON.stringify(data), (d, type) => {
                            this.state.submitLoading = false;
                            if (type == HttpClient.requestSuccess) {
                                this.setState({
                                    visible: false,
                                });
                                message.success(d.data);
                                this.props.form.resetFields();
                                this.props.onOk();
                            }
                        });
                    }

                } else {
                    this.state.submitLoading = false;
                }
            });
        }
    }

    cancel() {
        this.props.form.resetFields();
        this.setState({
            visible: false,
            submitLoading: false,
            radioType:this.props.data.couponType,
            timeType:this.props.data.timeType
        });
        this.props.onCancel();
    }

    /**
     * 校验
     * @param rule
     * @param value
     * @param callback
     */
    checkPrice(rule, value, callback) {
        if (value && value.length > 0) {
            callback();
            return;
        }
        callback('请输入减免金额');
    }

    checkRangeTime(rule, value, callback) {
        if (value && value.length > 0) {
            callback();
            return;
        }
        callback('请选择生效时间');
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
            if (value.length > 5) callback('整数位最多5位');
        }
        callback()
    }

    render() {
        const formModalLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 18},
            },
        };
        const {getFieldDecorator} = this.props.form;
        let parkingIds = [];
        _.toArray(this.props.data.preferentialSection || []).map(item => {
            parkingIds.push(item.parkingId);

        });
        return (
            <Modal
                title={this.props.type === 0 ? "新建" : "编辑"}
                visible={this.state.visible}
                onOk={this.check.bind(this)}
                onCancel={this.cancel.bind(this)}
                maskClosable={false}
                okText="确 定"
                cancelText="取 消"
            >
                <Spin tip="加载中.." spinning={this.state.loading}>
                    <Form style={{padding: "24px"}}>
                        <FormItem label="姓名" {...formModalLayout} required={true}>
                            {getFieldDecorator(`userName`, {
                                initialValue: this.props.data.userName,
                                rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: '请输入姓名',
                                }, {
                                    max: 20,
                                    message: '输入内容需在20字以内',
                                }],
                            })(
                                <Input placeholder="请输入"/>
                            )}
                        </FormItem>
                        <FormItem label="手机号" {...formModalLayout} required={true}>
                            {getFieldDecorator(`mobile`, {
                                initialValue: this.props.data.mobile,
                                rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: '请输入手机号',
                                }, {
                                    pattern: new RegExp(/^1\d{10}$/),
                                    message: '请输入正确的手机号',
                                }],
                            })(
                                <Input placeholder="请输入"/>
                            )}
                        </FormItem>
                        {this.props.type === 0 ?
                            <FormItem label="车牌号" {...formModalLayout} required={true}>
                                {getFieldDecorator(`plateNumber`, {
                                    rules: [{
                                        required: true,
                                        whitespace: true,
                                        message: '请输入车牌号',
                                    }, {
                                        max: 8,
                                        message: '输入内容需在8字以内',
                                    }],
                                })(
                                    <Input placeholder="请输入"/>
                                )}
                            </FormItem> :
                            <FormItem label="车牌号" {...formModalLayout} required={true}>
                                <span>{this.props.data.plateNumber}</span>
                            </FormItem>
                        }
                        <FormItem label="优惠路段" {...formModalLayout} require={true}>
                            {getFieldDecorator(`preferentialSection`, {
                                initialValue: parkingIds,
                                rules: [{
                                    type: 'array',
                                    required: true,
                                    whitespace: true,
                                    message: '请选择优惠路段',
                                }],
                            })(
                                <TreeSelect
                                    treeDefaultExpandAll={true}
                                    getPopupContainer={triggerNode => triggerNode.parentNode}
                                    style={{width: '100%'}}
                                    dropdownStyle={{height: 300}}
                                    treeCheckable={true}
                                    showCheckedStrategy={SHOW_PARENT}
                                    placeholder="请选择"
                                    treeData={this.state.preferentialParkingList}
                                    treeNodeFilterProp='title'
                                />
                            )}
                        </FormItem>
                        <FormItem label="优惠金额" {...formModalLayout} require={true}>
                            {getFieldDecorator(`couponType`, {
                                initialValue: this.props.data.couponType,
                                rules: [{
                                    required: true,
                                    message: '请选择',
                                }],
                            })(
                                <RadioGroup onChange={this.onRadioChange.bind(this)}>
                                    <Radio style={radioStyle} value={0}>全免</Radio>
                                    <Radio style={radioStyle} value={1}>部分减免
                                        {this.state.radioType > 0 ?
                                            <FormItem style={{display: 'inline-flex', marginLeft: "8px"}}>
                                                {getFieldDecorator(`couponAmount`, {
                                                    initialValue: this.props.data.couponType && this.props.data.couponType === 1 ? this.props.data.couponAmount : null,
                                                    rules: [{
                                                        validator: this.checkPrice
                                                    }, {
                                                        validator: this.validatorPrice.bind(this)
                                                    }],
                                                })(
                                                    <Input placeholder="请输入" addonAfter="元" style={{width: "266px"}}/>
                                                )}
                                            </FormItem>
                                            : ""
                                        }
                                    </Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                        <FormItem label="生效时间范围" {...formModalLayout} require={true}>
                            {getFieldDecorator(`timeType`, {
                                initialValue: this.props.data.timeType ? parseInt(this.props.data.timeType) : null,
                                rules: [{
                                    required: true,
                                    message: '请选择',
                                }],
                            })(
                                <RadioGroup onChange={this.onTimeTypeChange.bind(this)}>
                                    <Radio style={radioStyle} value={1}>长期生效</Radio>
                                    <Radio style={radioStyle} value={0}>自定义时间
                                        {this.state.timeType < 1 ?//自定义
                                            <FormItem style={{display: 'inline-flex', marginLeft: "8px"}}>
                                                {getFieldDecorator(`effectiveTime`, {
                                                    initialValue: this.props.data.effectiveTime && this.props.data.invalidTime ?
                                                        [moment(this.props.data.effectiveTime, dateFormat), moment(this.props.data.invalidTime, dateFormat)] : null,
                                                    rules: [{
                                                        validator: this.checkRangeTime
                                                    }],
                                                })(
                                                    <RangePicker style={{maxWidth: "246px"}}/>
                                                )}
                                            </FormItem> : ""
                                        }
                                    </Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                    </Form>
                </Spin>
            </Modal>
        )
    }


}

export default Form.create()(WhiteListModal);

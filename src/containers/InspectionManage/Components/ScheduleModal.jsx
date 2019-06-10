import React, {Component} from 'react';
import {Form, Modal, Input, message, Select, Radio, TimePicker, Row, Col} from "antd/lib/index";
import {HttpClient} from "../../../common/HttpClient";
import TimeGroup from "./TimeGroup";
import moment from "moment/moment";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const TextArea = Input.TextArea;
const format = 'HH:mm';


class ScheduleModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            submitLoading: false,
            visible: this.props.visible,
            stopSectionList: [],
            parkingSelect: [],
            scheduleType: null,
        };
    }


    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        const oldVisible = this.props.visible;
        const newVisible = nextProps.visible;
        if (oldVisible !== newVisible) {
            this.setState({
                visible: newVisible,
            });
        }
        if (nextProps.data !== this.props.data) {
            this.setState({
                scheduleType: nextProps.data.scheduleType,
            });
        }
    }

    handleTypeChange(e) {
        this.state.scheduleType = e.target.value;
    }

    check() {
        if (!this.state.submitLoading) {
            this.state.submitLoading = true;
            this.props.form.validateFields((err, fieldsValue) => {
                if (!err) {
                    let scheduleTimes = [];
                    if (fieldsValue['scheduleType'] == 0) {//一班
                        scheduleTimes = [{
                            "workStartTime": fieldsValue['startTime'].format(format),
                            "workEndTime": fieldsValue['endTime'].format(format),
                            "workTimeType": 3//全天
                        }];
                    } else if (fieldsValue['scheduleType'] == 1) {//二班
                        scheduleTimes = [{
                            "workStartTime": fieldsValue['startTime0'].format(format),
                            "workEndTime": fieldsValue['endTime0'].format(format),
                            "workTimeType": 0//早班
                        }, {
                            "workStartTime": fieldsValue['startTime1'].format(format),
                            "workEndTime": fieldsValue['endTime1'].format(format),
                            "workTimeType": 2//晚班
                        }];
                    } else if (fieldsValue['scheduleType'] == 2) {//三班制
                        scheduleTimes = [{
                            "workStartTime": fieldsValue['startTime0'].format(format),
                            "workEndTime": fieldsValue['endTime0'].format(format),
                            "workTimeType": 0//早班
                        }, {
                            "workStartTime": fieldsValue['startTime1'].format(format),
                            "workEndTime": fieldsValue['endTime1'].format(format),
                            "workTimeType": 1//中班
                        }, {
                            "workStartTime": fieldsValue['startTime2'].format(format),
                            "workEndTime": fieldsValue['endTime2'].format(format),
                            "workTimeType": 2//晚班
                        }];
                    }
                    // let check=false;
                    // scheduleTimes.map(item=>{
                    //     if(Date.parse(item.workStartTime)>Date.parse(item.workEndTime)){
                    //         check=true;
                    //         return;
                    //     }
                    // });
                    // if(check){
                    //    message.error("下班时间需大于上班时间！");
                    //    return;
                    // }
                    let data = {
                        ...fieldsValue,
                        "scheduleTimes": scheduleTimes,
                    };
                    if (this.props.type == 0) {//新建
                        HttpClient.query(window.MODULE_PARKING_INSPECTION + `/inspection/schedule`, "POST", JSON.stringify(data), (d, type) => {
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
                        HttpClient.query(window.MODULE_PARKING_INSPECTION + `/inspection/schedule/${this.props.data.id}`, "PUT", JSON.stringify(data), (d, type) => {
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
        });
        this.props.onCancel();
    }

    checkTime(rule, value, callback) {
        if (value) {
            callback();
            return;
        }
        callback('请选择时间');
    }


    render() {
        const formModalLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 20},
            },
        };
        const {getFieldDecorator} = this.props.form;
        return (
            <Modal
                className="schedule-modal"
                title={this.props.type === 0 ? "新建" : "编辑"}
                visible={this.state.visible}
                onOk={this.check.bind(this)}
                onCancel={this.cancel.bind(this)}
                maskClosable={false}
                okText="确 定"
                cancelText="取 消"
            >
                <div style={{padding: "24px"}}>
                    <Form>
                        <FormItem label="班次名称" {...formModalLayout} required={true}>
                            {getFieldDecorator(`scheduleName`, {
                                initialValue: this.props.data.scheduleName,
                                rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: '请输入班次名称',
                                }, {
                                    max: 10,
                                    message: '输入内容需在10字以内',
                                }, {
                                    pattern: new RegExp(/^[A-Za-z0-9\u4e00-\u9fa5]+$/),
                                    message: '仅支持输入中英文和数字',
                                }],
                            })(
                                <Input placeholder="请输入"/>
                            )}
                        </FormItem>
                        <FormItem label="班次类型" {...formModalLayout} >
                            {getFieldDecorator(`scheduleType`, {
                                initialValue: this.props.data.scheduleType,
                                rules: [{
                                    required: true,
                                    message: '请选择班次类型',
                                }],
                            })(
                                <RadioGroup onChange={this.handleTypeChange.bind(this)}>
                                    <RadioButton value={0} className="selection_radio_button">一班制</RadioButton>
                                    <RadioButton value={1} className="selection_radio_button">二班制</RadioButton>
                                    <RadioButton value={2} className="selection_radio_button">三班制</RadioButton>
                                </RadioGroup>
                            )}
                        </FormItem>
                        <Row>
                            <Col span={4}/>
                            <Col span={20}>

                                {this.state.scheduleType == 0 ?
                                    <div className="schedule-modal-time-group"
                                         style={{display: 'flex', lineHeight: '32.5px'}}>
                                        <div style={{width: 52, marginBottom: "24px"}}>上下班</div>
                                        <div style={{width: 42}}>上班：</div>
                                        <FormItem>
                                            {getFieldDecorator(`startTime`, {
                                                initialValue: this.props.data.scheduleTimes && this.props.data.scheduleTimes[0] && this.props.data.scheduleTimes[0].workStartTime ?
                                                    moment(this.props.data.scheduleTimes[0].workStartTime, format) : null,
                                                rules: [{validator: this.checkTime}],
                                            })(
                                                <TimePicker format={format}/>
                                            )}
                                        </FormItem>
                                        <div style={{width: 42, marginLeft: "32px"}}>下班：</div>
                                        <FormItem>
                                            {getFieldDecorator(`endTime`, {
                                                initialValue: this.props.data.scheduleTimes && this.props.data.scheduleTimes[0] && this.props.data.scheduleTimes[0].workEndTime ?
                                                    moment(this.props.data.scheduleTimes[0].workEndTime, format) : null,
                                                rules: [{validator: this.checkTime}],
                                            })(
                                                <TimePicker format={format}/>
                                            )}
                                        </FormItem>
                                    </div> :
                                    this.state.scheduleType == 1 ?
                                        <div>
                                            <div className="schedule-modal-time-group"
                                                 style={{display: 'flex', lineHeight: '32.5px'}}>
                                                <div style={{width: 52, marginBottom: "24px"}}>早班</div>
                                                <div style={{width: 42}}>上班：</div>
                                                <FormItem>
                                                    {getFieldDecorator(`startTime0`, {
                                                        initialValue: this.props.data.scheduleTimes && this.props.data.scheduleTimes[0] && this.props.data.scheduleTimes[0].workStartTime ?
                                                            moment(this.props.data.scheduleTimes[0].workStartTime, format) : null,
                                                        rules: [{validator: this.checkTime}],
                                                    })(
                                                        <TimePicker format={format}/>
                                                    )}
                                                </FormItem>
                                                <div style={{width: 42, marginLeft: "32px"}}>下班：</div>
                                                <FormItem>
                                                    {getFieldDecorator(`endTime0`, {
                                                        initialValue: this.props.data.scheduleTimes && this.props.data.scheduleTimes[0] && this.props.data.scheduleTimes[0].workEndTime ?
                                                            moment(this.props.data.scheduleTimes[0].workEndTime, format) : null,
                                                        rules: [{validator: this.checkTime}],
                                                    })(
                                                        <TimePicker format={format}/>
                                                    )}
                                                </FormItem>
                                            </div>
                                            <div className="schedule-modal-time-group"
                                                 style={{display: 'flex', lineHeight: '32.5px'}}>
                                                <div style={{width: 52, marginBottom: "24px"}}>晚班</div>
                                                <div style={{width: 42}}>上班：</div>
                                                <FormItem>
                                                    {getFieldDecorator(`startTime1`, {
                                                        initialValue: this.props.data.scheduleTimes && this.props.data.scheduleTimes[1] && this.props.data.scheduleTimes[1].workStartTime ?
                                                            moment(this.props.data.scheduleTimes[1].workStartTime, format) : null,
                                                        rules: [{validator: this.checkTime}],
                                                    })(
                                                        <TimePicker format={format}/>
                                                    )}
                                                </FormItem>
                                                <div style={{width: 42, marginLeft: "32px"}}>下班：</div>
                                                <FormItem>
                                                    {getFieldDecorator(`endTime1`, {
                                                        initialValue: this.props.data.scheduleTimes && this.props.data.scheduleTimes[1] && this.props.data.scheduleTimes[1].workEndTime ?
                                                            moment(this.props.data.scheduleTimes[1].workEndTime, format) : null,
                                                        rules: [{validator: this.checkTime}],
                                                    })(
                                                        <TimePicker format={format}/>
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div>
                                        :
                                        this.state.scheduleType == 2 ?
                                            <div>
                                                <div className="schedule-modal-time-group"
                                                     style={{display: 'flex', lineHeight: '32.5px'}}>
                                                    <div style={{width: 52, marginBottom: "24px"}}>早班</div>
                                                    <div style={{width: 42}}>上班：</div>
                                                    <FormItem>
                                                        {getFieldDecorator(`startTime0`, {
                                                            initialValue: this.props.data.scheduleTimes && this.props.data.scheduleTimes[0] && this.props.data.scheduleTimes[0].workStartTime ?
                                                                moment(this.props.data.scheduleTimes[0].workStartTime, format) : null,
                                                            rules: [{validator: this.checkTime}],
                                                        })(
                                                            <TimePicker format={format}/>
                                                        )}
                                                    </FormItem>
                                                    <div style={{width: 42, marginLeft: "32px"}}>下班：</div>
                                                    <FormItem>
                                                        {getFieldDecorator(`endTime0`, {
                                                            initialValue: this.props.data.scheduleTimes && this.props.data.scheduleTimes[0] && this.props.data.scheduleTimes[0].workEndTime ?
                                                                moment(this.props.data.scheduleTimes[0].workEndTime, format) : null,
                                                            rules: [{validator: this.checkTime}],
                                                        })(
                                                            <TimePicker format={format}/>
                                                        )}
                                                    </FormItem>
                                                </div>
                                                <div className="schedule-modal-time-group"
                                                     style={{display: 'flex', lineHeight: '32.5px'}}>
                                                    <div style={{width: 52, marginBottom: "24px"}}>中班</div>
                                                    <div style={{width: 42}}>上班：</div>
                                                    <FormItem>
                                                        {getFieldDecorator(`startTime1`, {
                                                            initialValue: this.props.data.scheduleTimes && this.props.data.scheduleTimes[1] && this.props.data.scheduleTimes[1].workStartTime ?
                                                                moment(this.props.data.scheduleTimes[1].workStartTime, format) : null,
                                                            rules: [{validator: this.checkTime}],
                                                        })(
                                                            <TimePicker format={format}/>
                                                        )}
                                                    </FormItem>
                                                    <div style={{width: 42, marginLeft: "32px"}}>下班：</div>
                                                    <FormItem>
                                                        {getFieldDecorator(`endTime1`, {
                                                            initialValue: this.props.data.scheduleTimes && this.props.data.scheduleTimes[1] && this.props.data.scheduleTimes[1].workEndTime ?
                                                                moment(this.props.data.scheduleTimes[1].workEndTime, format) : null,
                                                            rules: [{validator: this.checkTime}],
                                                        })(
                                                            <TimePicker format={format}/>
                                                        )}
                                                    </FormItem>
                                                </div>
                                                <div className="schedule-modal-time-group"
                                                     style={{display: 'flex', lineHeight: '32.5px'}}>
                                                    <div style={{width: 52, marginBottom: "24px"}}>晚班</div>
                                                    <div style={{width: 42}}>上班：</div>
                                                    <FormItem>
                                                        {getFieldDecorator(`startTime2`, {
                                                            initialValue: this.props.data.scheduleTimes && this.props.data.scheduleTimes[2] && this.props.data.scheduleTimes[2].workStartTime ?
                                                                moment(this.props.data.scheduleTimes[2].workStartTime, format) : null,
                                                            rules: [{validator: this.checkTime}],
                                                        })(
                                                            <TimePicker format={format}/>
                                                        )}
                                                    </FormItem>
                                                    <div style={{width: 42, marginLeft: "32px"}}>下班：</div>
                                                    <FormItem>
                                                        {getFieldDecorator(`endTime2`, {
                                                            initialValue: this.props.data.scheduleTimes && this.props.data.scheduleTimes[2] && this.props.data.scheduleTimes[2].workEndTime ?
                                                                moment(this.props.data.scheduleTimes[2].workEndTime, format) : null,
                                                            rules: [{validator: this.checkTime}],
                                                        })(
                                                            <TimePicker format={format}/>
                                                        )}
                                                    </FormItem>
                                                </div>
                                            </div> : null}
                            </Col>
                        </Row>
                        <FormItem label="备注" {...formModalLayout}>
                            {getFieldDecorator(`comments`, {
                                initialValue: this.props.data.comments,
                                rules: [{
                                    max: 100,
                                    message: '输入内容需在100字以内',
                                }],
                            })(
                                <TextArea autosize={{minRows: 4, maxRows: 8}}
                                          placeholder="请输入"/>
                            )}
                        </FormItem>
                    </Form>
                </div>
            </Modal>
        )
    }


}

export default Form.create()(ScheduleModal);

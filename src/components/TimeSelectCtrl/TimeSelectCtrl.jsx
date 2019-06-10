import React, {Component} from 'react';
import {TimePicker, Button, Form} from 'antd';
import PropTypes from 'prop-types';
import {CSS} from './TimeSelectCtrl.css';
import {custom} from "../../common/SystemStyle";
import moment from 'moment';
import { react } from 'react.eval';

const FormItem = Form.Item;

class TimeSelectCtrl extends Component {
    constructor(props) {
        super(props);

        react(this);
    }


    componentWillMount() {

    }

    componentDidMount() {
        if (this.props.defaultValues.length > 0){
            this.props.form.setFieldsValue({
                [this.props.idName+'_startTime']:moment(this.props.defaultValues[0], 'HH:mm'),
                [this.props.idName+'_endTime']:moment(this.props.defaultValues[1], 'HH:mm')
            })
        }

    }

    //左
    onLeftChange(time,timeString)  {
        console.log(time);
        console.log(timeString);

        if (this.props.sendData){
            this.props.sendData(this.props.idName,"start",timeString);
        }
    }

    //右
    onRightChange(time,timeString)  {
        console.log(time);
        console.log(timeString);

        if (this.props.sendData){
            this.props.sendData(this.props.idName,"end",timeString);
        }
    }

    //重置
    reset(){
        this.props.form.resetFields();
    }

    //恢复
    recover(){
        this.props.form.setFieldsValue({
            [this.props.idName+'_startTime']:moment(this.props.defaultValues[0], 'HH:mm'),
            [this.props.idName+'_endTime']:moment(this.props.defaultValues[1], 'HH:mm')
        })
    }

    getError(name){
        this.props.form.validateFieldsAndScroll(((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        }).bind(this));
        let err = this.props.form.getFieldError(name);
        return err;
    }

    getValue(name){
        return this.props.form.getFieldValue(name).format('HH:mm');
    }

    render() {
        const {getFieldDecorator} = this.props.form;

        return (
            <div className="timeselect-box" style={this.props.style?this.props.style:{}}>
                <div className="title-box">{this.props.require?<span className="require-status">*</span>:""}{this.props.title}</div>
                <Form className="time-box">
                    <FormItem className="picker-form">
                        {getFieldDecorator(this.props.idName+'_startTime', {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择起始时间'
                                }]
                        })(
                            <TimePicker
                                className="picker"
                                onChange={this.onLeftChange.bind(this)}
                                format="HH:mm"
                                hideDisabledOptions={true}
                            >
                            </TimePicker>
                        )}
                    </FormItem>
                    <div className="picker-splice"/>
                    <FormItem className="picker-form">
                        {getFieldDecorator(this.props.idName+'_endTime', {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择结束时间'
                                }]
                        })(
                            <TimePicker className="picker"
                                        onChange={this.onRightChange.bind(this)}
                                        format="HH:mm"
                                        hideDisabledOptions={true}
                            >
                            </TimePicker>
                        )}
                    </FormItem>
                    <div style={custom.clear}/>
                </Form>
            </div>
        )
    }
}

TimeSelectCtrl.propTypes = {
    idName: PropTypes.string,
    //配置margin float
    require: PropTypes.bool,
    title: PropTypes.string,
    style:PropTypes.object,
    type:PropTypes.string,
    // 可选择数据
    defaultValues:PropTypes.array,
    sendData:PropTypes.func
};

export default Form.create()(TimeSelectCtrl);
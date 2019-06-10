import React, {Component} from 'react';

import {Button, Card, Input, Form, Spin} from 'antd';
import {custom} from "../../common/SystemStyle";
import SectionPriceSettingContent from "./Components/SectionDetailCard/SectionPriceSettingContent";
import {react} from 'react.eval';
import {HttpClient} from "../../common/HttpClient";

class InsertChargeTimes extends Component {
    constructor(props) {
        super(props);
        react(this);
        this.state = {
            loading: false,
            parkingPriceVO: {
                "name": "",
                "number": "",
                "workdayDaytimeEndTime": null,
                "workdayDaytimeStartTime": null,
                "workdayForbidEndTime": null,
                "workdayForbidStartTime": null,
                "workdayFreeEndTime": null,
                "workdayFreeStartTime": null,
                "workdayNighttimeEndTime": null,
                "workdayNighttimeStartTime": null,
                "weekendDaytimeEndTime": null,
                "weekendDaytimeStartTime": null,
                "weekendForbidEndTime": null,
                "weekendForbidStartTime": null,
                "weekendFreeEndTime": null,
                "weekendFreeStartTime": null,
                "weekendNighttimeEndTime": null,
                "weekendNighttimeStartTime": null,
            }
        };
    }

    // 组件挂载之前
    componentWillMount() {
    }

    // 组件挂载后
    componentDidMount() {
    }

    // 组件卸载之前
    componentWillUnmount() {
    }

    submit() {
        this.props.form.validateFields((err, values) => {
            if (err) return;
            if (react('AddSectionPriceSettingContent.freeDetailConfirm')()) {
                this.setState({
                    loading: true
                });
                const obj = {
                    ...this.state.parkingPriceVO,
                    ...values,
                    ...react('AddSectionPriceSettingContent.freeDetailConfirm')()
                };
                let params = {};
                for (let item in obj) {
                    if (obj[item]) {
                        params[item] = obj[item]
                    }
                }
                console.error(params);
                HttpClient.query(`${window.MODULE_PARKING_RESOURCE}/parkTimeFrame`, 'POST', JSON.stringify(params), (d, type) => {
                    this.setState({
                        loading: false
                    }, () => {
                        if (type === HttpClient.requestSuccess) {
                            location.hash = 'ResourceManage/ChargeTimes'
                        } else {

                        }
                    });
                })
            }
        });
    }

    render() {
        const {parkingPriceVO, loading} = this.state;
        const {getFieldDecorator} = this.props.form;
        const FormItem = Form.Item;
        return (
            <div className='page'>
                <div className='page-header'>
                    新建收费时段
                </div>
                <div className='page-content' style={{padding: 0, background: 'transparent'}}>
                    <Spin spinning={loading} tip='新增中...'>
                        <Card title="收费时段">
                            <Form>
                                <div style={{float: 'left', marginRight: 47}}>
                                    <FormItem label="收费时段名称">
                                        {getFieldDecorator("name", {
                                            rules: [{
                                                required: true,
                                                message: '请输入收费时段名称'
                                            }, {
                                                max: 20,
                                                message: '输入名称不能超过20个字符串'
                                            }]
                                        })(
                                            <Input placeholder='请输入' style={{width: 326}}/>
                                        )}
                                    </FormItem>
                                </div>
                                <div style={{float: 'left'}}>
                                    <FormItem label="收费时段编号">
                                        {getFieldDecorator("number", {
                                            rules: [{
                                                required: true,
                                                message: '请输入收费时段编号'
                                            }, {
                                                pattern: new RegExp("^([0-9A-Za-z]*)$"),
                                                message: '仅能填写数字与英文'
                                            }, {
                                                max: 20,
                                                message: '输入不可超过20字'
                                            }]
                                        })(
                                            <Input placeholder='请输入' style={{width: 326}}/>
                                        )}
                                    </FormItem>
                                </div>
                                <div style={custom.clear}/>
                            </Form>
                            {/*status=0表示无需停用路段操作，可以随意编辑*/}
                            <SectionPriceSettingContent id='AddSectionPriceSettingContent' parkingPrice={parkingPriceVO}
                                                        status={0} inEdit={true}/>
                        </Card>
                    </Spin>
                </div>

                <div className="edit_bottom">
                    <Button type="primary" loading={loading} style={{float: "right"}} onClick={this.submit.bind(this)}>提交</Button>
                    <Button style={{float: "right", marginRight: "12px"}} onClick={() => {
                        history.back(-1)
                    }}>取消</Button>
                    <div style={custom.clear}/>
                </div>
            </div>
        );
    }
}

export default Form.create()(InsertChargeTimes)

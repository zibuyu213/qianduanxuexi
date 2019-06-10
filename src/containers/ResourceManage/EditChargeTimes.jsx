import React, {Component, Fragment} from 'react';

import {Button, Form, Card, Input, Spin, message} from 'antd';
import {custom} from "../../common/SystemStyle";
import SectionPriceSettingContent from "./Components/SectionDetailCard/SectionPriceSettingContent";
import {HttpClient} from "../../common/HttpClient";
import {react} from 'react.eval';

class EditChargeTimes extends Component {
    constructor (props) {
        super(props);
        react(this);
        this.state = {
            id: this.props.location.query.id,
            isLoading: true,
            spinTip: '加载中...',
            parkingPriceVO: null
        };
    }

    // 组件挂载之前
    componentWillMount () {
    }

    // 组件挂载后
    componentDidMount () {
        this.queryChargeTimesDetail()
    }

    // 组件卸载之前
    componentWillUnmount () {
    }

    //获取计费时段详情
    queryChargeTimesDetail () {
        this.setState({
            isLoading: true
        });
        let id = 1001;
        if (HttpClient.REQUEST === "truth") {
            id = this.state.id;
        }
        HttpClient.query(window.MODULE_PARKING_RESOURCE + `/parkTimeFrame/` + id, "GET", null, this.handleQueryCallback.bind(this));
    }


    handleQueryCallback (e, type) {
        this.setState({
            isLoading: false
        });
        if (type === HttpClient.requestSuccess) {
            this.setState({
                parkingPriceVO: e.data,
            });
        }
    }

    submit () {
        this.props.form.validateFields((err, values) => {
            if (err) return;
            if (react('EditSectionPriceSettingContent.freeDetailConfirm')()) {
                this.setState({
                    isLoading: true,
                    spinTip: '修改中...',
                });
                const obj = {
                    ...this.state.parkingPriceVO,
                    ...values,
                    ...react('EditSectionPriceSettingContent.freeDetailConfirm')()
                };
                let params = {};
                for (let item in obj) {
                    if (obj[item] || item === 'status') {
                        params[item] = obj[item]
                    }
                }
                HttpClient.query('/parking-resource/parkTimeFrame', 'PUT', JSON.stringify(params), (d, type) => {
                    // d.data为更新后的新id
                    this.setState({
                        isLoading: false
                    }, () => {
                        if (type === HttpClient.requestSuccess) {
                            message.success('修改成功');
                            location.hash = '/ResourceManage/ChargeTimes/ChargeTimesDetails?id=' + d.data
                        }
                    });
                })
            }
        });
    }

    render () {
        const { isLoading, parkingPriceVO } = this.state;
        const { getFieldDecorator } = this.props.form;
        const FormItem = Form.Item;
        return (
            <div className='page'>
                <div className='page-header'>
                    编辑收费时段
                </div>
                <div className='page-content' style={{ padding: 0, background: 'transparent' }}>
                    <Spin spinning={isLoading} tip={this.state.spinTip}>
                        <Card title="收费时段">
                            {
                                parkingPriceVO && (
                                    <Fragment>
                                        <Form>
                                            <div style={{ float: 'left', marginRight: 47 }}>
                                                <FormItem label="收费时段名称">
                                                    {getFieldDecorator("name", {
                                                        rules: [{
                                                            required: true,
                                                            message: '请输入收费时段名称'
                                                        }, {
                                                            max: 20,
                                                            message: '输入名称不能超过20个字符串'
                                                        }],
                                                        initialValue: parkingPriceVO.name
                                                    })(
                                                        <Input placeholder='请输入' style={{ width: 326 }}/>
                                                    )}
                                                </FormItem>
                                            </div>
                                            <div style={{ float: 'left' }}>
                                                <FormItem label="收费时段编号">
                                                    {getFieldDecorator("number", {
                                                        rules: [{
                                                            required: true,
                                                            message: '请输入收费时段编号'
                                                        }, {
                                                            max: 20,
                                                            message: '输入编号不能超过20个字符串'
                                                        }],
                                                        initialValue: parkingPriceVO.number
                                                    })(
                                                        <Input placeholder='请输入' style={{ width: 326 }}/>
                                                    )}
                                                </FormItem>
                                            </div>
                                            <div style={{ clear: 'both' }}/>
                                        </Form>
                                        {/*status=0表示无需停用路段操作，可以随意编辑*/}
                                        <SectionPriceSettingContent id='EditSectionPriceSettingContent'
                                                                    parkingPrice={parkingPriceVO}
                                                                    status={0} inEdit={true}/>
                                    </Fragment>
                                )
                            }
                        </Card>
                    </Spin>
                </div>

                <div className="edit_bottom">
                    <Button type="primary" style={{ float: "right" }} onClick={this.submit.bind(this)}>提交</Button>
                    <Button style={{ float: "right", marginRight: "12px" }} onClick={() => {
                        history.back(-1)
                    }}>取消</Button>
                    <div style={custom.clear}/>
                </div>
            </div>
        );
    }
}

export default Form.create()(EditChargeTimes)

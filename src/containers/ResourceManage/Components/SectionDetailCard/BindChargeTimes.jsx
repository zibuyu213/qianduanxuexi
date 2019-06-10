import React, {Component, Fragment} from 'react';

import {Button, Modal, Form, Select, message, Row, Col} from 'antd';
import SectionPriceSettingContent from "./SectionPriceSettingContent";
import {HttpClient} from "../../../../common/HttpClient";
import {react} from 'react.eval';
import {custom} from "../../../../common/SystemStyle";

class BindChargeTimes extends Component {
    constructor(props) {
        super(props);
        react(this);
        this.state = {
            modalVisible: false,
            chargeTimesList: [{
                id: '',
                name: '',
                number: ''
            }],
            selectChargeTimeId: null,
            confirmLoading: false
        };
    }

    // 组件挂载之前
    componentWillMount() {
    }

    // 组件挂载后
    componentDidMount() {
        // 获取有效既费时间端列表
        HttpClient.query('/parking-resource/parkTimeFrame/effective/list', 'GET', null, (d, type)=>{
            const data = d.data;
            if (type === HttpClient.requestSuccess) {
                this.setState({
                    chargeTimesList: data
                })
            }
        })
    }

    // 组件卸载之前
    componentWillUnmount() {
    }

    handleChange(value) {
        this.setState({
            selectChargeTimeId: value
        })
    }

    onOk() {
        this.props.form.validateFields((err, values) => {
            if (err) return;
            this.setState({
                confirmLoading: true
            });
            let params = {
                parkingId: parseInt(this.props.parkingId),
                parkTimeFrameId: this.state.selectChargeTimeId
            };
            HttpClient.query(`${window.MODULE_PARKING_RESOURCE}/admin/resource/parking/binding/parkTimeFrame`, 'POST', params, (d, type) => {
                const data = d.data;
                if (type === HttpClient.requestSuccess) {
                    message.success(data);
                    // 提交成功后刷新数据
                    react('SectionDetailCard.queryRoadResource');
                }
                this.setState({
                    confirmLoading: false,
                    modalVisible: false
                });
            }, 'application/x-www-form-urlencoded')
        });
    }

    render() {
        const {modalVisible, chargeTimesList, confirmLoading} = this.state;
        const {getFieldDecorator} = this.props.form;
        const Option = Select.Option;
        const ButtonText = this.props.parkingPrice ? '重新绑定计费时段' : '绑定计费时段';
        const titleStyle = {
            fontSize: "14px",
            color: "rgba(0,0,0,0.85)",
            float: "left",
            lineHeight: "22px",
            height: "22px",
            margin: "8px 0"
        };
        const contentStyle = {
            width: "256px",
            fontSize: "14px",
            color: "rgba(0,0,0,0.65)",
            float: "left",
            lineHeight: "22px",
            margin: "8px 0 8px 4px",
            wordBreak: "break-all"
        };
        return (
            <Fragment>
                {
                    this.props.parkingPrice && (
                        <div>
                            <Row gutter={34} style={{marginBottom: 15}}>
                                <Col span={8}>
                                    <div style={titleStyle}>收费时段名称：</div>
                                    <div style={contentStyle}>{this.props.parkingPrice.name}</div>
                                    <div style={custom.clear}/>
                                </Col>
                                <Col span={8}>
                                    <div style={titleStyle}>收费时段编号：</div>
                                    <div style={contentStyle}>{this.props.parkingPrice.number}</div>
                                    <div style={custom.clear}/>
                                </Col>
                            </Row>
                            {
                                this.props.parkingPrice && (
                                    <SectionPriceSettingContent parkingPrice={this.props.parkingPrice}/>
                                )
                            }
                        </div>
                    )
                }

                {
                    window.checkPageEnable('sectionChargeRuleSet') && (
                        <Button type="primary" style={{marginTop: 32}} icon={"plus"} onClick={() => {
                            this.setState({
                                modalVisible: true
                            })
                        }}>{ButtonText}</Button>
                    )
                }
                <Modal title='绑定计费时段' visible={modalVisible}
                       confirmLoading={confirmLoading}
                       onOk={this.onOk.bind(this)}
                       maskClosable={false}
                       onCancel={() => {
                           this.setState({modalVisible: false})
                       }}>
                    <Form style={{padding: 24}}>
                        <Form.Item label='应用计费时段'>
                            {getFieldDecorator('chargeTime', {
                                rules: [{
                                    required: true,
                                    message: '请选择计费时段'
                                }]
                            })(
                                <Select
                                    placeholder='请选择计费时段'
                                    onChange={this.handleChange.bind(this)}
                                    showSearch
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    optionFilterProp="children"
                                >
                                    {
                                        chargeTimesList.map((item) => (
                                            <Option value={item.id} key={item.id}>{item.name}</Option>
                                        ))
                                    }
                                </Select>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </Fragment>
        );
    }
}

export default Form.create()(BindChargeTimes)

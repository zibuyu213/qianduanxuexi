import React, {Component} from 'react';

import {Button, Row, Col, Card, Badge, Spin} from 'antd';
import {HttpClient} from "../../common/HttpClient";
import {custom} from "../../common/SystemStyle";
import SectionPriceSettingContent from "./Components/SectionDetailCard/SectionPriceSettingContent";
import Exception from "../../components/Exception";

export default class ChargeTimesDetails extends Component {
    constructor (props) {
        super(props);
        this.state = {
            id: this.props.location.query.id,
            loading: false,
            payLoad: {
                "id": "",
                "name": "",
                "number": "",
                "status": false,
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
            },
        };
    }

    // 组件挂载之前
    componentWillMount () {
    }

    // 组件挂载后
    componentDidMount () {
        this.setState({
            loading: true
        });
        HttpClient.query(`${window.MODULE_PARKING_RESOURCE}/parkTimeFrame/${this.state.id}`, 'GET', null, (d, type) => {
            const data = d.data;
            if (type === HttpClient.requestSuccess) {
                this.setState({
                    payLoad: data
                })
            } else {

            }
            this.setState({
                loading: false
            })
        })
    }

    // 组件卸载之前
    componentWillUnmount () {
    }

    render () {
        if (!window.checkPageEnable('chargeTimesEdit')) return <Exception type='403'/>;
        const { payLoad, loading } = this.state;
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
            <div className='page'>
                <Spin spinning={loading} tip='加载中...'>
                    <div className='page-header'>
                        <div style={{ position: 'relative', height: 50 }}>
                            <div style={{ float: 'left' }}>{payLoad.name}</div>
                            <div
                                style={{
                                    position: 'absolute',
                                    right: window.checkPageEnable('chargeTimesEdit') ? 90 : 0,
                                    height: 54,
                                    bottom: 10
                                }}>
                                <div className="detail_header_status_title">生效状态</div>
                                <Badge className='header-dot'
                                       status={payLoad.status ? 'success' : 'default'}/>
                                <span className='statusText'>{payLoad.status ? '已启用' : '已停用'}</span>
                                <div style={{ clear: 'both' }}/>
                            </div>
                            {
                                window.checkPageEnable('chargeTimesEdit') && (
                                    <div style={{ position: 'absolute', right: 0, bottom: 10 }}>
                                        <Button type="primary" onClick={() => {
                                            location.hash = '/ResourceManage/ChargeTimes/EditChargeTimes?id=' + this.state.id
                                        }}>编辑</Button>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className='page-content' style={{ padding: 0, background: 'transparent' }}>
                        <Card title='收费时段'>
                            <Row gutter={34} style={{ marginBottom: 15 }}>
                                <Col span={8}>
                                    <div style={titleStyle}>收费时段名称：</div>
                                    <div
                                        style={contentStyle}>{this.state.payLoad.name}</div>
                                    <div style={custom.clear}/>
                                </Col>
                                <Col span={8}>
                                    <div style={titleStyle}>收费时段编号：</div>
                                    <div
                                        style={contentStyle}>{this.state.payLoad.number}</div>
                                    <div style={custom.clear}/>
                                </Col>
                            </Row>
                            <SectionPriceSettingContent id='EditSectionPriceSettingContent' parkingPrice={payLoad}/>
                        </Card>
                    </div>
                </Spin>
            </div>
        );
    }
}

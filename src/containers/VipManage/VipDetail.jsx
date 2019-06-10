import React, {Component} from 'react';
import {HttpClient} from "../../common/HttpClient";
import {Card, Row, Col, Spin} from "antd/lib/index";
import Exception from "../../components/Exception";
import _ from 'lodash';
import './Style/Vip.css';//css

export default class VipDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vipId: this.props.location.query.id,
            loading: false,
            data: {}
        }
    }


    componentWillMount() {

    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        this.setState({
            loading: true,
        });
        let vipId = this.state.vipId;
        HttpClient.query(window.MODULE_PARKING_PERSON_INFO + `/member/vip/${vipId}`, "GET", null, this.configData.bind(this));
    }

    /**
     * 接口请求回调
     * @param d
     * @param type
     */
    configData(d, type) {
        if (type === HttpClient.requestSuccess) {
            //成功-------在这里做你的数据处理，需要提示的自己加
            this.setState({
                loading: false,
                data: d.data,
            })

        } else {
            //失败----做除了报错之外的操作
            this.setState({
                loading: false,
            })
        }
    }


    render() {
        if (!window.checkPageEnable('vipDetail')) {
            return <Exception type='403'/>;
        }
        const {data, loading} = this.state;
        return (
            <div className="page">
                <Spin tip="加载中.." spinning={loading}>
                    <div className="page-header">
                        <div className="partner-detail-header" style={{position: "relative"}}>
                            姓名：{data.name}
                            <div className="vip-detail-state">
                                <div className="partnerDetail-state-title">当前积分</div>
                                <div>{data.memberScore}</div>
                            </div>
                            <div className="vip-detail-state">
                                <div className="partnerDetail-state-title">钱包余额(元)</div>
                                <div>{data.walletBalance}</div>
                            </div>
                        </div>
                    </div>
                    <div className="page-content page-content-transparent">
                        <Card title="基本资料" bordered={false}>
                            <Row gutter={32}>
                                <Col xs={24} sm={12} md={8}><span
                                    className="vipDetail-col-key">姓名：</span>{data.name}</Col>
                                <Col xs={24} sm={12} md={8}><span
                                    className="vipDetail-col-key">电话：{data.mobile}</span></Col>
                                <Col xs={24} sm={12} md={8} style={{display:"flex"}}>
                                    <div className="vipDetail-col-key">会员车牌：</div>
                                    <div className="vipDetail-col-value">{_.toArray(data.plateNumberList).join('；')}</div>
                                </Col>
                                <Col xs={24} sm={12} md={8}><span
                                    className="vipDetail-col-key">会员ID：</span>{data.memberId}</Col>
                                <Col xs={24} sm={12} md={8}><span
                                    className="vipDetail-col-key">会员等级：</span>{data.memberGradeName}</Col>
                                <Col xs={24} sm={12} md={8}><span
                                    className="vipDetail-col-key">生日：</span>{data.birthday}</Col>
                                <Col xs={24} sm={12} md={8}><span
                                    className="vipDetail-col-key">性别：</span>{data.sex}</Col>
                                <Col xs={24} sm={12} md={8}><span
                                    className="vipDetail-col-key">电子邮箱：</span>{data.email}</Col>
                                <Col xs={24} sm={12} md={8}><span
                                    className="vipDetail-col-key">加入时间：</span>{data.joinTime}</Col>
                                <Col xs={24} sm={12} md={8} style={{display:"flex"}}><div
                                    className="vipDetail-col-key">地址：</div>
                                    <div className="vipDetail-col-value">{data.address}</div>
                                </Col>
                            </Row>
                        </Card>
                    </div>
                </Spin>
            </div>
        )
    }


}
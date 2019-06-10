import React, {Component, Fragment} from 'react';

import {Card, Row, Col, Badge, Table, Spin, Icon, message,Button} from 'antd';
import {HttpClientImmidIot} from "../../common/HttpClientImmidIot";
import ImagePreview from '../../components/ImagePreview/';
import _ from 'lodash';
import './Style/ParkingRecord.css'

const payType = ['钱包余额支付', '微信支付', '人工收费-支付宝', '人工收费-微信'];
const carType = ['基础-小型车+蓝牌非新能源车', '大型车+蓝牌非新能源车', '小型车+绿牌新能源车', '大型车+绿牌新能源车'];
const parkOrderType = ['系统创建(UWB)', '用户购买时长', '稽查贴条'];
// 0：停车中 1：行程结束 2：退款中 3：欠费
const parkStatus = ['success', 'default', 'processing', 'error', 'error', 'default'];
const parkStatusText = ['停车中', '行程结束', '退款中', '欠费', '异常', '已关闭'];
const photoType = ['驶入泊位照片', '驶出泊位照片', '停车中的照片'];

export default class VipLogDetails extends Component {
    constructor (props) {
        super(props);
        this.state = {
            data: [],
            data1: [],
            detailData: {},
            loading: false,
            orderId: this.props.location.query.id,
            ImagePreviewVisible: false,
            imageUrl: '',
        }
    }

    // 组件挂载之前
    componentWillMount () {

    }

    // 组件挂载后
    componentDidMount () {
            let orderId = null;
            if (!this.state.orderId) {
                orderId = sessionStorage.getItem('orderId_AppealDetail');
                sessionStorage.removeItem('orderId_AppealDetail');
                this.setState({
                    orderId
                })
            } else {
                orderId = this.state.orderId
            }
            HttpClientImmidIot.query(`/Vip/VipLogDetails?id=${orderId}`, 'GET', null, this.parkingDetail.bind(this));

    }

    // 组件卸载之前
    componentWillUnmount () {
    }

    // 获取停车详情回调
    parkingDetail (d, type) {
        const data = d.data;
        if (type === HttpClientImmidIot.requestSuccess) {
            //成功-------在这里做你的数据处理
            this.setState({
                data1: data.data1,
                data: data.data,
                detailData: data,
            });
        } else {
            //失败----做除了报错之外的操作
        }
        this.setState({
            loading: false,
        })
    }

    checkAppealDetail () {
            window.location.history.back(-1);
    }


    render () {
        const { orderId, data,data1, detailData, loading, ImagePreviewVisible, imageUrl } = this.state;
        const columns = [
            {
                title: '车牌号',
                dataIndex: 'carId',
                render: (text) => (text ? text : '--'),
            }, {
                title: '车辆品牌',
                dataIndex: 'vehicleBrand',
                render: (text) => (text ? text : '--'),
            }, {
                title: '车辆型号',
                dataIndex: 'model',
                render: (text) => (text ? text : '0 元'),
            }, {
                title: '常用车',
                dataIndex: 'usedCar',
                render: (text) => (text ? text : '--'),
            }, {
                title: '绑定时间',
                dataIndex: 'bindingTime',
                render: (text) => (text ? text : '--'),
            }
        ];
        const columns1 = [
          {
              title: '停车场/路段',
              dataIndex: 'park',
              render: (text) => (text ? text : '--'),
          }, {
              title: '车牌号',
              dataIndex: 'carId',
              render: (text) => (text ? text : '--'),
          }, {
              title: '泊位编号',
              dataIndex: 'berthId',
              render: (text) => (text ? text : '0 元'),
          }, {
              title: '停入时间',
              dataIndex: 'inTime',
              render: (text) => (text ? text : '--'),
          }, {
              title: '停出时间',
              dataIndex: 'outTime',
              render: (text) => (text ? text : '--'),
          }
          , {
              title: '停车时长',
              dataIndex: 'duration',
              render: (text) => (text ? text : '--'),
          }
          , {
              title: '停车费用（元）',
              dataIndex: 'stopMoney',
              render: (text) => (text ? text : '--'),
          }
          , {
              title: '订单状态',
              dataIndex: 'orderState',
              render: (text) => (text ? text : '--'),
          }

        ];
        return (
            <Spin spinning={loading} tip='加载中...'>
                <div className='page'>
                    <div className='page-header '>
                        <div style={{ position: "relative", height: 44 }}>
                            <div style={{
                                fontSize: '20px',
                                float: 'left',
                                fontFamily: 'PingFangSC-Medium',
                                color: 'rgba(0,0,0,0.85)',
                                lineHeight: '28px'
                            }}>会员号: {orderId}</div>
                            <div style={{ float: 'right' }}>
                                <div style={{
                                    textAlign: 'right',
                                    color: 'rgba(0,0,0,0.45)',
                                    lineHeight: '22px',
                                    fontSize: '14px'
                                }}><Button type="primary" onClick={ ()=>{window.history.back()}}>返回</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='page-content page-content-transparent'>
                        <Card
                            title='会员详情'
                            className='baseInfo'
                        >
                            <Row>
                                <Col span={8}>
                                    <label>会员ID：</label>
                                    <span>{detailData.uId || '--'}</span>
                                </Col>
                                <Col span={8}>
                                    <label>注册来源：</label>
                                    <span>{carType[detailData.comfrom] || '--'}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <label>手机号码：</label>
                                    <span>{detailData.phoneNum || '--'}</span>
                                </Col>
                                <Col span={8}>
                                    <label>openid：</label>
                                    <span>{detailData.openid || '--'}</span>
                                </Col>
                            </Row>
                        </Card>
                        <Card
                            title='基础信息'
                            className='baseInfo'
                        >
                            <Row>
                                <Col span={8}>
                                    <label>头像：</label>
                                    <span>{detailData.img || '--'}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <label>昵称：</label>
                                    <span>{detailData.name || '--'}</span>
                                </Col>
                                <Col span={8}>
                                    <label>性别：</label>
                                    <span>{detailData.sex || '--'}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <label>出生年月：</label>
                                    <span>{detailData.date || '--'}</span>
                                </Col>
                                <Col span={8}>
                                    <label>电子邮箱：</label>
                                    <span>{detailData.email || '--'}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <label>地址：</label>
                                    <span>{detailData.address || '--'}</span>
                                </Col>
                                <Col span={8}>
                                    <label>注册时间：</label>
                                    <span>{detailData.enrollTime || '--'}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <label>账户余额（元）：</label>
                                    <span>{detailData.money || '--'}</span>
                                </Col>
                            </Row>
                        </Card>
                        <Card
                            title='车辆信息'
                        >
                            <Table dataSource={data} columns={columns} rowKey='id' pagination={false}/>
                        </Card>
                        <Card
                            title='停车信息'
                        >
                            <Table dataSource={data1} columns={columns1} rowKey='id' pagination={false}/>
                        </Card>
                    </div>
                </div>
            </Spin>
        );
    }
}

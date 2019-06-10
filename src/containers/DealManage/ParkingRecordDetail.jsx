import React, {Component, Fragment} from 'react';

import {Card, Row, Col, Badge, Table, Spin, Icon, message} from 'antd';
import {HttpClient} from "../../common/HttpClient";
import Exception from "../../components/Exception";
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

export default class ParkingRecordDetail extends Component {
    constructor (props) {
        super(props);
        this.state = {
            data: [],
            detailData: {},
            loading: true,
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
        if (window.checkPageEnable('parkingRecordDetail')) {
            let orderId = null;
            if (!this.state.orderId) {
                orderId = sessionStorage.getItem('orderId_AppealDetail');
                sessionStorage.removeItem('orderId_AppealDetail');
                window.location.hash = 'DealManage/ParkingRecord/ParkingRecordDetail?id=' + orderId;
                this.setState({
                    orderId
                })
            } else {
                orderId = this.state.orderId
            }
            HttpClient.query(window.MODULE_PARKING_ORDERS + `/admin/business/parking/order/${orderId}`, 'GET', null, this.parkingDetail.bind(this));
        }
    }

    // 组件卸载之前
    componentWillUnmount () {
    }

    // 获取停车详情回调
    parkingDetail (d, type) {
        const data = d.data;
        if (type === HttpClient.requestSuccess) {
            //成功-------在这里做你的数据处理
            let parkOrderPayInfos = _.cloneDeep(data.parkOrderPayInfos);
            parkOrderPayInfos.forEach(item => {
                item.payType = payType[item.payType] || payType[0];
                item.payAmount = item.payAmount && `${item.payAmount} 元`;
                item.buyParkTime = item.buyParkTime && `${item.buyParkTime} 分钟`;
            });
            this.setState({
                data: parkOrderPayInfos,
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
        if (this.isFromAppealDetail()) {
            window.location.history.back(-1)
        } else {
            location.hash = 'DealManage/ParkingRecord/ParkingRecordDetail/AppealDetail?orderId=' + this.props.location.query.id;
        }
    }

    // 判断是否是从订单详情跳转过来的
    isFromAppealDetail () {
        // console.log(this.props.location.pathname.indexOf('ParkingRecord/ParkingRecordDetail'));
        if (this.props.location.pathname.indexOf('AppealManage/AppealDetail/') !== -1) {
            sessionStorage.setItem('orderId_AppealDetail', this.props.location.query.id);
            return true
        } else {
            return false
        }
    }

    render () {
        if (!window.checkPageEnable('parkingRecordDetail')) {
            return <Exception type='403'/>
        }
        const { orderId, data, detailData, loading, ImagePreviewVisible, imageUrl } = this.state;
        const couponTypeText = ['全免', '固定金额'];
        const parkOrderTypeText = ['设备上报(UWB)', '用户购买', '稽查人员创建'];
        const overOrderTypeText = ['', '用户点击离场', '稽查人员手动离场', '设备上报离场'];
        const columns = [
            {
                title: '支付时间',
                dataIndex: 'payTime',
                render: (text) => (text ? text : '--'),
            }, {
                title: '支付方式',
                dataIndex: 'payType',
                render: (text) => (text ? text : '--'),
            }, {
                title: '支付费用',
                dataIndex: 'payAmount',
                render: (text) => (text ? text : '0 元'),
            }, {
                title: '支付流水号',
                dataIndex: 'id',
                render: (text) => (text ? text : '--'),
            }, {
                title: '支付购买时长',
                dataIndex: 'buyParkTime',
                render: (text) => (text ? text : '--'),
            }, {
                title: '操作人',
                dataIndex: 'creator',
                render: (text) => (text ? text : '--'),
            }
        ];
        // 是否有客户申诉减免
        const isParkOrderCostAppealLatestVO = detailData.parkOrderCostAppealLatestVO && Object.keys(detailData.parkOrderCostAppealLatestVO).length > 0;
        let appealElem = '无申诉';
        const checkDetail = window.checkPageEnable('appealDetail') ? (
            <a style={{ marginLeft: 10 }} onClick={() => {
                this.checkAppealDetail()
            }}>查看申诉详情>></a>
        ) : '';
        if (isParkOrderCostAppealLatestVO) {
            const latestCostAppeal = detailData.parkOrderCostAppealLatestVO.latestCostAppeal;
            if (latestCostAppeal.status === 0) {
                appealElem = <Fragment>
                    <span>待处理</span>
                    {checkDetail}
                </Fragment>
            } else if (latestCostAppeal.status === 2) {
                appealElem = <Fragment>
                    <span>已拒绝</span>
                    {checkDetail}
                </Fragment>
            } else if (latestCostAppeal.status === 1) {
                const waiverAmount = detailData.parkOrderCostAppealLatestVO.latestCostAppealDispose.waiverAmount;
                appealElem = <Fragment>
                    <span>{waiverAmount ? `-${waiverAmount}` : 0} 元</span>
                    {checkDetail}
                </Fragment>
            }
        }
        let parkOrderFree = 0;
        if (detailData.parkOrderFreeVO) {
            if (detailData.parkOrderFreeVO.isFree) {
                parkOrderFree = detailData.totalPrice ? `-${detailData.totalPrice}` : 0
            } else {
                parkOrderFree = detailData.parkOrderFreeVO.totalFreeMoney ? `-${detailData.parkOrderFreeVO.totalFreeMoney}` : 0
            }
        }
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
                            }}>订单号: {orderId}</div>
                            <div style={{ float: 'right' }}>
                                <div style={{
                                    textAlign: 'right',
                                    color: 'rgba(0,0,0,0.45)',
                                    lineHeight: '22px',
                                    fontSize: '14px'
                                }}>状态
                                </div>
                                <div>
                                    <Badge className='header-dot' status={parkStatus[detailData.parkOrderStatus || 0]}/>
                                    <span className='statusText'>
                                        {parkStatusText[detailData.parkOrderStatus || 0]}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Row>
                            <Col
                                style={{
                                    color: 'rgba(0,0,0,0.85)',
                                    lineHeight: '22px',
                                    fontSize: '14px'
                                }}>
                                <span style={{ color: 'rgba(0,0,0,0.85' }}>实际停车时长：</span>
                                <span style={{ color: 'rgba(0,0,0,0.65' }}>{detailData.realTime}分钟</span>
                            </Col>
                        </Row>
                    </div>
                    <div className='page-content page-content-transparent'>
                        <Card
                            title='基础信息'
                            className='baseInfo'
                        >
                            <Row>
                                <Col span={8}>
                                    <label>车牌号：</label>
                                    <span>{detailData.plateNumber || '--'}</span>
                                </Col>
                                <Col span={8}>
                                    <label>车辆类型：</label>
                                    <span>{carType[detailData.carType] || '--'}</span>
                                </Col>
                                <Col span={8}>
                                    <label>手机号：</label>
                                    <span>{detailData.mobile || '--'}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <label>路段名称：</label>
                                    <span>{detailData.parkingName || '--'}</span>
                                </Col>
                                <Col span={8}>
                                    <label>行政区域：</label>
                                    <span>{`${detailData.provinceName ? detailData.provinceName : ''}${detailData.cityName ? '/' + detailData.cityName : ''}${detailData.areaName ? '/' + detailData.areaName : ''}`}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <label>泊位坐标：</label>
                                    <span>{detailData.parkingSpaceLongitude ? `${detailData.parkingSpaceLatitude}, ${detailData.parkingSpaceLongitude}` : '--'}</span>
                                </Col>
                                <Col span={8}>
                                    <label>泊位编号：</label>
                                    <span>{(detailData.parkOrderType === 1 || detailData.parkingSpaceDetector) ? detailData.parkingSpaceNo : '--'}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <label>入场操作：</label>
                                    <span>{parkOrderTypeText[detailData.parkOrderType]}</span>
                                </Col>
                                <Col span={8}>
                                    <label>订单创建时间：</label>
                                    <span>{detailData.createTime || '--'}</span>
                                </Col>
                                <Col span={8}>
                                    <label>实际驶入时间：</label>
                                    <span>{detailData.inTime || '--'}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <label>出场操作：</label>
                                    <span>{detailData.overOrderType ? overOrderTypeText[detailData.overOrderType] : '--'}</span>
                                </Col>
                                <Col span={8}>
                                    <label>订单结束时间：</label>
                                    <span>{detailData.outTime || '--'}</span>
                                </Col>
                                <Col span={8}>
                                    <label>实际驶出时间：</label>
                                    <span>{detailData.outTime || '--'}</span>
                                </Col>
                                {/*<Col span={8}>
                                    <label>订单来源：</label>
                                    <span>
                                        {
                                            detailData.parkOrderType === 2 ? (
                                                `${parkOrderType[detailData.parkOrderType]}(处理人：${detailData.adminName || ''})`
                                            ) : parkOrderType[detailData.parkOrderType]
                                        }
                                    </span>
                                </Col>*/}
                            </Row>
                        </Card>
                        <Card
                            title='收费信息'
                            className='baseInfo'
                        >
                            <Row>
                                <Col span={8}>
                                    <label>停车费用：</label>
                                    <span>{detailData.totalPrice} 元</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <label>优惠减免：</label>
                                    <span>{parkOrderFree} 元</span>
                                </Col>
                            </Row>
                            {
                                detailData.parkOrderFreeVO && detailData.parkOrderFreeVO.hasFree && (
                                    <Row>
                                        <Col span={8} style={{ background: '#F8F8F8', padding: 20 }}>
                                            <div style={{ lineHeight: '20px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>{detailData.parkOrderFreeVO.freeName}({couponTypeText[detailData.parkOrderFreeVO.couponType]})</span>
                                                    {
                                                        !detailData.parkOrderFreeVO.isFree && (
                                                            <span>{detailData.parkOrderFreeVO.couponAmount ? `-${detailData.parkOrderFreeVO.couponAmount}` : 0} 元</span>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                            {/*<div style={{ marginTop: 10 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>优惠类型C</span>
                                                    <span>-XXX 元</span>
                                                </div>
                                            </div>*/}
                                        </Col>
                                    </Row>
                                )
                            }
                            <Row>
                                <Col span={8}>
                                    <label>客户申诉减免：</label>
                                    {appealElem}
                                </Col>
                            </Row>
                            <div className='dashedStyle'/>
                            <Row>
                                <Col span={8}>
                                    <label>实际应收：</label>
                                    <span>{detailData.realPrice} 元</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <label>实际收到：</label>
                                    <span>{detailData.receiveMoney || 0} 元</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <label>{detailData.hasRefund ? '已退款费用：' : (detailData.refundMoney > 0 ? '待退款费用：' : '剩余待缴：')}</label>
                                    <span>{detailData.hasRefund ? detailData.alreadyRefundMoney : (detailData.refundMoney ? detailData.refundMoney : detailData.reminderMoney) || 0} 元</span>
                                </Col>
                            </Row>
                        </Card>
                        <Card
                            title='支付信息'
                        >
                            <Table dataSource={data} columns={columns} rowKey='id' pagination={false}/>
                        </Card>
                        <Card
                            title='停车照片'
                            className='baseInfo'
                        >
                            {
                                detailData.parkOrderPhotos && detailData.parkOrderPhotos.length ? detailData.parkOrderPhotos.map((item, index) => (
                                    <Row key={index}>
                                        <Col span={10} className='detail-card-col'>
                                            <label>{item.userName ? '稽查补充拍照' : photoType[item.photoType]}：</label>
                                            <span>
                                                {item.photoUrls.map((photo, index) => (
                                                    <img key={index} src={photo}
                                                         onClick={(e) => {
                                                             this.setState({
                                                                 ImagePreviewVisible: true,
                                                                 imageUrl: e.target.src,
                                                             })
                                                         }}
                                                         style={{
                                                             verticalAlign: 'text-top',
                                                             marginRight: '10px',
                                                             width: 150,
                                                             height: 100,
                                                             cursor: 'pointer'
                                                         }}/>
                                                ))}
                                            </span>
                                        </Col>
                                        <Col span={7}>
                                            <label>{item.userName ? '拍摄人' : (item.deviceNo ? '拍摄设备' : '拍摄人')}：</label>
                                            <span>{item.userName ? item.userName : (item.deviceNo ? item.deviceNo : item.adminName)}</span>
                                        </Col>
                                        <Col span={7}>
                                            <label>拍摄上报时间：</label>
                                            <span>{item.createTime}</span>
                                        </Col>
                                    </Row>
                                )) : (
                                    <div style={{ textAlign: 'center' }}>
                                        <div><Icon type="frown"/></div>
                                        <div>暂无照片</div>
                                    </div>
                                )
                            }
                            <ImagePreview visible={ImagePreviewVisible} imageUrl={imageUrl} onCancel={() => {
                                this.setState({
                                    ImagePreviewVisible: false,
                                })
                            }}/>
                        </Card>
                    </div>
                </div>
            </Spin>
        );
    }
}

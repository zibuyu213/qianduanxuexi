import React, {Component} from 'react';

import {Card, Spin, Row, Col, Badge} from 'antd';
import {HttpClient} from "../../common/HttpClient";
import './Style/index.css';
import ImagePreview from "../../components/ImagePreview";
import Exception from "../../components/Exception";

// 报警类型枚举，报警类型返回值是从1开始
const warningTypeEnum = ['', '逆向停车', '跨泊位停车', '禁停时段停车', '未付费停车', '黑名单禁停区域停车'];
// 报警设备类型枚举
const deviceTypeEnum = ['摄像头', 'UWB定位', 'UWB+摄像头双机', '地磁检测器', '车控机'];
// 处理状态枚举
const warningDisposeStatusEnum = ['待处理', '已处理', '已失效'];
// 处理结果类型枚举
const disposeTypeEnum = ['误报', '确认报警，发送报警给车主', '确认报警，稽查人员创建订单'];
// 处理车型枚举
const carTypeEnum = ['基础-小型车+蓝牌非新能源车', '大型车+蓝牌非新能源车', '小型车+绿牌新能源车', '大型车+绿牌新能源车'];

export default class AlarmDetail extends Component {
    constructor (props) {
        super(props);
        this.state = {
            id: this.props.location.query.id || '',
            loading: true,
            parkWarningDetail: {},
            parkWarningDisposeDetail: {},
            ImagePreviewVisible: false,
            imageUrl: '',
        };
    }

    // 组件挂载之前
    componentWillMount () {
    }

    // 组件挂载后
    componentDidMount () {
        HttpClient.query(`${window.MODULE_PARKING_RESOURCE}/admin/resource/parking/warning/${this.state.id}`, 'GET', null, this.handleQuery.bind(this))
    }

    // 组件卸载之前
    componentWillUnmount () {
    }

    // 处理请求回调
    handleQuery (d, type) {
        const data = d.data;
        if (type === HttpClient.requestSuccess) {
            //成功-------在这里做你的数据处理
            this.setState({
                parkWarningDetail: data.parkWarningDetail,
                parkWarningDisposeDetail: data.parkWarningDisposeDetail
            })
        } else {
            //失败----做除了报错之外的操作
        }
        this.setState({
            loading: false,
        })
    }

    render () {
        if (!window.checkPageEnable('/AbnormalParkingAlarm')) {
            return <Exception type='403'/>
        }
        const { loading, parkWarningDetail, parkWarningDisposeDetail, ImagePreviewVisible, imageUrl } = this.state;
        return (
            <div className='page'>
                <div className='page-header'>
                    <div style={{
                        position: "relative", height: 44,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end'
                    }}>
                        <div style={{
                            fontSize: '20px',
                            fontFamily: 'PingFangSC-Medium',
                            color: 'rgba(0,0,0,0.85)',
                            lineHeight: '28px',
                        }}>报警详情
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                                <div style={{
                                    textAlign: 'right',
                                    color: 'rgba(0,0,0,0.45)',
                                    lineHeight: '22px',
                                    fontSize: '14px'
                                }}>状态
                                </div>
                                <div>
                                    <Badge className='header-dot'
                                           status={parkWarningDetail.warningDisposeStatus === 0 ? 'success' : 'default'}/>
                                    <span className='statusText'>
                                        {warningDisposeStatusEnum[parkWarningDetail.warningDisposeStatus]}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='page-content' style={{ padding: 0, background: 'transparent' }}>
                    <Spin spinning={loading} tip='加载中...'>
                        {/*报警详情*/}
                        <Card title='报警详情' className='detail-card'>
                            <Row gutter={30}>
                                <Col span={8} className='detail-card-col'>
                                    <label>报警类型：</label>
                                    <span>{parkWarningDetail.warningType ? warningTypeEnum[parkWarningDetail.warningType] : ''}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>报警时间：</label>
                                    <span>{parkWarningDetail.createTime}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>报警泊位编号：</label>
                                    <span>{parkWarningDetail.parkingSpaceNo}</span>
                                </Col>
                            </Row>
                            <Row gutter={30}>
                                <Col span={8} className='detail-card-col'>
                                    <label>报警设备类型：</label>
                                    <span>{parkWarningDetail.deviceType ? deviceTypeEnum[parkWarningDetail.deviceType] : ''}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>报警设备位置：</label>
                                    <span>{parkWarningDetail.deviceLatlong || ''}</span>
                                </Col>
                                <Col span={8}>
                                    <label>处理状态：</label>
                                    <Badge
                                        status={parkWarningDetail.warningDisposeStatus === 0 ? 'success' : 'default'}
                                        text={warningDisposeStatusEnum[parkWarningDetail.warningDisposeStatus]}
                                        style={{ fontSize: '14px', color: 'rgba(0,0,0,0.65)', lineHeight: '22px' }}/>
                                </Col>
                            </Row>
                            <Row gutter={30}>
                                <Col span={8} className='detail-card-col'>
                                    <label>报警描述：</label>
                                    <span>{parkWarningDetail.warningDescribe || ''}</span>
                                </Col>
                                <Col span={16} className='detail-card-col'>
                                    <label>证明照片：</label>
                                    <span>
                                        {
                                            parkWarningDetail.warningPhotos && parkWarningDetail.warningPhotos.map((item, index) => (
                                                <img src={item.photoUrl} key={index}
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
                                            ))
                                        }
                                    </span>
                                </Col>
                            </Row>
                        </Card>
                        {/*处理详情*/}
                        {
                            parkWarningDisposeDetail ? (
                                <Card title='处理详情' className='detail-card'>
                                    <Row gutter={30}>
                                        <Col span={8}>
                                            <label>处理人：</label>
                                            <span>{parkWarningDisposeDetail.adminUserName}</span>
                                        </Col>
                                        <Col span={8}>
                                            <label>处理时间：</label>
                                            <span>{parkWarningDisposeDetail.createTime}</span>
                                        </Col>
                                        <Col span={8}>
                                            <label>处理结果：</label>
                                            <span>{disposeTypeEnum[parkWarningDisposeDetail.disposeType || 0]}</span>
                                        </Col>
                                    </Row>
                                    {
                                        // 判断是否误报，误报则不显示以下元素
                                        parkWarningDisposeDetail.disposeType === 0 || (
                                            <div>
                                                {
                                                    // 判断报警类型，如果是跨泊位或者是未付费停车，则显示该处理行
                                                    (parkWarningDetail.warningType === 2 || parkWarningDetail.warningType === 4) && (
                                                        <Row gutter={30}>
                                                            <Col span={8}>
                                                                <label>处理车型：</label>
                                                                <span>{carTypeEnum[parkWarningDisposeDetail.carType || 0]}</span>
                                                            </Col>
                                                            <Col span={12} style={{ display: 'flex' }}>
                                                                <div style={{ color: 'rgba(0,0,0,0.85)' }}>贴条矫正收费：</div>
                                                                {
                                                                    parkWarningDisposeDetail.extraChargeDetail ? (
                                                                        <div className='extraChargeDetailCol'>
                                                                            <div>已贴条</div>
                                                                            <div>车牌号：{parkWarningDisposeDetail.extraChargeDetail.plateNumber}</div>
                                                                            <div>订单号：{parkWarningDisposeDetail.extraChargeDetail.orderId}</div>
                                                                            <div>收费车型：{carTypeEnum[parkWarningDisposeDetail.extraChargeDetail.carType]}</div>
                                                                        </div>
                                                                    ) : '--'
                                                                }
                                                            </Col>
                                                        </Row>
                                                    )
                                                }
                                                <Row gutter={30}>
                                                    <Col span={8} className='detail-card-col'>
                                                        <label>处理说明：</label>
                                                        <span>{parkWarningDisposeDetail.disposeInstructions || ''}</span>
                                                    </Col>
                                                    <Col span={16} className='detail-card-col'>
                                                        <label>取证照片：</label>
                                                        <span>
                                                            {
                                                                parkWarningDisposeDetail.disposePhotos && parkWarningDisposeDetail.disposePhotos.map((item, index) => (
                                                                    <img src={item.photoUrl} key={index}
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
                                                                ))
                                                            }
                                                        </span>
                                                    </Col>
                                                </Row>
                                            </div>
                                        )
                                    }
                                </Card>
                            ) : ''
                        }
                        <ImagePreview visible={ImagePreviewVisible} imageUrl={imageUrl} onCancel={() => {
                            this.setState({
                                ImagePreviewVisible: false
                            })
                        }}/>
                    </Spin>
                </div>
            </div>
        );
    }
}

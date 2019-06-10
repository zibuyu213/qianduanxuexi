import React, {Component} from 'react';

import {Card, Spin, Row, Col, Badge, Button, Modal, Input, message, Form, Icon} from 'antd';
import {HttpClient} from "../../common/HttpClient";
import ImagePreview from '../../components/ImagePreview/'
import Exception from "../../components/Exception";

const TextArea = Input.TextArea;

// 处理状态枚举
const statusEnum = ['', '待处理', '', '已处理', '已失效'];
const disposeStatus = ['', 'processing', '', 'default', 'default'];
// 报警类型枚举
const warningTypeEnum = ['', '长期停放', '', '同泊位异常订单', '同车牌异常订单', '同车牌异常订单'];
// 处理结果类型枚举
const disposeTypeEnum = ['', '无车', '有车'];

export default class OrderAlarmDetail extends Component {
    constructor (props) {
        super(props);
        this.state = {
            id: this.props.location.query.id || '',
            loading: true,
            modalVisible: false,
            remark: '',
            confirmLoading: false,
            detailData: {},
            remarkValidateStatus: '',
            remarkHelp: '',
            ImagePreviewVisible: false,
            imageUrl: '',
        };
    }

    // 组件挂载之前
    componentWillMount () {
    }

    // 组件挂载后
    componentDidMount () {
        HttpClient.query(`${window.MODULE_PARKING_ORDERS}/parkOrder/exception/warnings/${this.state.id}`, 'GET', null, this.handleQuery.bind(this))
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
                detailData: data,
            })
        } else {
            //失败----做除了报错之外的操作
        }
        this.setState({
            loading: false,
            modalVisible: false,
            confirmLoading: false,
            remarkValidateStatus: '',
            remarkHelp: '',
        })
    }

    // 关闭订单
    closeOrder () {
        this.setState({
            modalVisible: true
        })
    }

    // 模态框OK按钮
    onOk () {
        if (this.state.remarkValidateStatus === 'error') {
            return;
        }
        this.setState({
            confirmLoading: true
        });
        const params = `?remark=${this.state.remark}`;
        HttpClient.query(`/parking-orders/parkOrder/exception/warnings/${this.state.id}/close${params}`, 'PUT', null, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                message.success(d.data);
                HttpClient.query(`/parking-orders/parkOrder/exception/warnings/${this.state.id}`, 'GET', null, this.handleQuery.bind(this));
            } else {

            }
        });
    }

    // 模态框Cancel按钮
    onCancel () {
        this.setState({
            modalVisible: false
        })
    }

    render () {
        if (!window.checkPageEnable('/AbnormalOrderAlarm')) {
            return <Exception type='403'/>
        }
        const { loading, modalVisible, id, detailData, confirmLoading, remarkValidateStatus, remarkHelp, ImagePreviewVisible, imageUrl } = this.state;
        const { inspectDispose, manageDispose } = detailData;
        const closeOrderModal = (
            <Modal
                visible={modalVisible}
                title='关闭订单'
                destroyOnClose
                maskClosable={false}
                onOk={this.onOk.bind(this)}
                onCancel={this.onCancel.bind(this)}
                bodyStyle={{ margin: 20 }}
                confirmLoading={confirmLoading}
            >
                <Row>
                    <Col style={{ display: 'flex', alignItems: 'center' }}>
                        <Icon type="exclamation-circle" theme='filled'
                              style={{ color: 'rgba(250,173,20,1)', fontSize: '22px' }}/>
                        <span style={{
                            fontSize: 16,
                            color: 'rgba(0,0,0,0.85)',
                            fontFamily: 'PingFangSC-Medium',
                            marginLeft: 20
                        }}>处理说明</span>
                    </Col>
                </Row>
                <Row>
                    <Col span={2}/>
                    <Col style={{ display: 'flex', alignItems: 'center', lineHeight: '22px' }}>
                        稽查人员已对此异常订单进行处理，您需要执行关闭订单操作，执行关闭操作后，系统将自动保留正确订单，关闭相关异常订单。
                    </Col>
                </Row>
                <Row style={{ marginTop: 20 }}>
                    <Col span={4}>
                        <label>处理说明: </label>
                    </Col>
                    <Col span={20}>
                        <Form>
                            <Form.Item
                                validateStatus={remarkValidateStatus}
                                help={remarkHelp}
                            >
                                <TextArea rows={3} placeholder='请输入' onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.length > 200) {
                                        this.setState({
                                            remarkValidateStatus: 'error',
                                            remarkHelp: '输入内容请在200位以内'
                                        });
                                    } else {
                                        this.setState({
                                            remarkValidateStatus: '',
                                            remarkHelp: ''
                                        });
                                    }
                                    this.state.remark = e.target.value
                                }}/>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Modal>
        );
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
                        }}>订单号: {detailData.parkOrderId}</div>
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
                                    <Badge className='header-dot' status={disposeStatus[detailData.status]}/>
                                    <span className='statusText'>
                                        {statusEnum[detailData.status]}
                                    </span>
                                </div>
                            </div>
                            {/*{
                                // 当报警状态为待中台处理时出现
                                detailData.status === 1 && (
                                    <Button type='primary' style={{ marginLeft: 20 }}
                                            onClick={this.closeOrder.bind(this)}>关闭订单</Button>
                                )
                            }*/}
                        </div>
                    </div>
                </div>
                {closeOrderModal}
                <div className='page-content' style={{ padding: 0, background: 'transparent' }}>
                    <Spin spinning={loading} tip='加载中...'>
                        {/*报警详情*/}
                        <Card title='报警详情' className='detail-card'>
                            <Row gutter={30}>
                                <Col span={8} className='detail-card-col'>
                                    <label>报警泊位编号：</label>
                                    <span>{detailData.parkingSpaceNo || ''}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>报警车牌：</label>
                                    <span>{detailData.plateNumber || ''}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>停车时长：</label>
                                    <span>{detailData.parkingTime ? `${detailData.parkingTime}分钟` : ''}</span>
                                </Col>
                            </Row>
                            <Row gutter={30}>
                                <Col span={8} className='detail-card-col'>
                                    <label>报警时间：</label>
                                    <span>{detailData.createTime || ''}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>报警类型：</label>
                                    <span>{detailData.type ? warningTypeEnum[detailData.type] : ''}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>报警描述：</label>
                                    <span>{detailData.remark || ''}</span>
                                </Col>
                            </Row>
                            <Row gutter={30}>
                                <Col span={16} className='detail-card-col'>
                                    <label>证明照片：</label>
                                    <span>
                                        {
                                            detailData.parkOrderPhotoList && detailData.parkOrderPhotoList.map((item, index) => (
                                                <img src={item} key={index}
                                                     onClick={(e) => {
                                                         this.setState({
                                                             ImagePreviewVisible: true,
                                                             imageUrl: e.target.src,
                                                         })
                                                     }}
                                                     style={{
                                                         verticalAlign: 'text-top',
                                                         marginRight: '10px',
                                                         width: 150, height: 100,
                                                         cursor: 'pointer'
                                                     }}/>
                                            ))
                                        }
                                    </span>
                                </Col>
                            </Row>
                        </Card>
                        {/*稽查处理详情*/}
                        {
                            inspectDispose ? (
                                <Card title='稽查处理详情' className='detail-card'>
                                    <Row gutter={30}>
                                        <Col span={8}>
                                            <label>空闲状态：</label>
                                            <span>{`当前泊位-${disposeTypeEnum[inspectDispose.disposeResultType]}`}</span>
                                        </Col>
                                        <Col span={8}>
                                            <label>当前车牌号：</label>
                                            <span>{inspectDispose.plateNumber || '--'}</span>
                                        </Col>
                                        <Col span={8}>
                                            <label>处理人：</label>
                                            <span>{inspectDispose.adminUserName || ''}</span>
                                        </Col>
                                    </Row>
                                    <Row gutter={30}>
                                        <Col span={8} className='detail-card-col'>
                                            <label>处理说明：</label>
                                            <span>{inspectDispose.remark || ''}</span>
                                        </Col>
                                        <Col span={8}>
                                            <label>处理时间：</label>
                                            <span>{inspectDispose.createTime || ''}</span>
                                        </Col>
                                    </Row>
                                    {/* <Row gutter={30}>
                                        <Col span={24} className='detail-card-col'>
                                            <label>证明照片：</label>
                                            <span>
                                                    {
                                                        inspectDispose.disposePhotoList && inspectDispose.disposePhotoList.map((item, index) => (
                                                            <img src={item} key={index}
                                                                 onClick={(e) => {
                                                                     this.setState({
                                                                         ImagePreviewVisible: true,
                                                                         imageUrl: e.target.src,
                                                                     })
                                                                 }}
                                                                 style={{
                                                                     verticalAlign: 'text-top',
                                                                     marginRight: '10px',
                                                                     width: 150, height: 100,
                                                                     cursor: 'pointer'
                                                                 }}/>
                                                        ))
                                                    }
                                                </span>
                                        </Col>
                                    </Row> */}
                                </Card>
                            ) : ''
                        }
                        {/*中台处理详情*/}
                        {
                            // 当不是误报且已处理时才显示
                            manageDispose && detailData.status === 3 && (
                                <Card title='中台处理详情' className='detail-card'>
                                    <Row gutter={30}>
                                        <Col span={8}>
                                            <label>处理人：</label>
                                            <span>{manageDispose.adminUserName || ''}</span>
                                        </Col>
                                        <Col span={8}>
                                            <label>处理时间：</label>
                                            <span>{manageDispose.createTime || ''}</span>
                                        </Col>
                                        <Col span={8} className='detail-card-col'>
                                            <label>处理说明：</label>
                                            <span>{manageDispose.remark || ''}</span>
                                        </Col>
                                    </Row>
                                </Card>
                            )
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

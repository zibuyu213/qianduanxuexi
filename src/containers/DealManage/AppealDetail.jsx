import React, {Component, Fragment} from 'react';

import {Button, Spin, Badge, message, Modal, Row, Col, Input, Icon, Form} from 'antd';
import {HttpClient} from "../../common/HttpClient";
import LastAppeal from './Components/LastAppeal';
import HistoryAppeal from './Components/HistoryAppeal';
import './Style/ParkingRecord.css';
import Exception from "../../components/Exception";

const TextArea = Input.TextArea;

class AppealDetail extends Component {
    constructor (props) {
        super(props);
        this.state = {
            currentTab: 0,
            loading: true,
            orderId: this.props.location.query.orderId,
            appealData: null,
            modalVisible: false,
            confirmLoading: false,
            remark: '',
            handleStatus: null, //处理情况
            waiverAmount: '', //减免金额
        };
    }

    // 组件挂载之前
    componentWillMount () {
    }

    // 组件挂载后
    componentDidMount () {
        if (!window.checkPageEnable('appealDetail')) return;
        if (!this.props.location.query.orderId) {
            const orderId = sessionStorage.getItem('orderId_AppealDetail');
            sessionStorage.removeItem('orderId_AppealDetail');
            window.location.hash = 'DealManage/AppealManage/AppealDetail?orderId=' + orderId
        }
        this.setState({
            loading: true,
        });
        setTimeout(() => {
            this.isFromParkingDetail();
            HttpClient.query(`${window.MODULE_PARKING_ORDERS}/costAppeal/detail`, 'GET', { parkOrderId: this.props.location.query.orderId }, this.handleQuery.bind(this));
            this.setState({
                orderId: this.props.location.query.orderId,
            })
        }, 100);
    }

    // 组件卸载之前
    componentWillUnmount () {
    }

    handleQuery (d, type) {
        // console.log('接口请求回调，停车记录列表：', d);
        const data = d.data;
        if (type === HttpClient.requestSuccess) {
            //成功-------在这里做你的数据处理
            this.setState({
                appealData: data
            });
        } else {
            //失败----做除了报错之外的操作
        }
        this.setState({
            loading: false,
        })
    }

    checkTab (index) {
        if (index === this.state.currentTab) {
            return 'active'
        } else {
            return ''
        }
    }

    chooseTab (index) {
        this.setState({
            currentTab: index
        })
    }

    getContent () {
        switch (this.state.currentTab) {
            case 0:
                return <LastAppeal latestCostAppeal={this.state.appealData.latestCostAppeal || null}
                                   latestCostAppealDispose={this.state.appealData.latestCostAppealDispose || null}/>;
            case 1:
                return <HistoryAppeal costAppealHistory={this.state.appealData.costAppealHistory || []}/>;
        }
    }

    getOrderDetail () {
        if (this.isFromParkingDetail()) {
            window.location.history.back(-1)
        } else {
            window.location.hash = 'DealManage/AppealManage/AppealDetail/ParkingRecordDetail?id=' + this.state.orderId;
            sessionStorage.setItem('orderId_AppealDetail', this.state.orderId)
        }
    }

    // 判断是否是从订单详情跳转过来的
    isFromParkingDetail () {
        // console.log(this.props.location.pathname.indexOf('ParkingRecord/ParkingRecordDetail'));
        if (this.props.location.pathname.indexOf('ParkingRecord/ParkingRecordDetail') !== -1) {
            sessionStorage.setItem('orderId_AppealDetail', this.props.location.query.orderId);
            return true
        } else {
            return false
        }
    }

    onCancel () {
        this.setState({
            remarkValidateStatus: '',
            remarkHelp: '',
            waiverAmount: '',
            remark: '',
            confirmLoading: false,
            modalVisible: false
        })
    }

    onOk () {
        this.props.form.validateFields((err, values) => {
            if (err) return;
            this.setState({
                confirmLoading: true,
            });
            let optional = {};
            for (let item in values) {
                if (values[item]) {
                    optional[item] = values[item];
                }
            }
            let params = {
                parkOrderId: this.state.orderId,
                status: this.state.handleStatus,
                ...optional
            };
            console.log(params);
            HttpClient.query(`${window.MODULE_PARKING_ORDERS}/costAppeal/dispose`, 'POST', params, (d, type) => {
                const data = d.data;
                if (type === HttpClient.requestSuccess) {
                    //成功-------在这里做你的数据处理
                    message.success(data);
                    this.setState({
                        waiverAmount: '',
                        remark: '',
                        modalVisible: false,
                    });
                    HttpClient.query(`${window.MODULE_PARKING_ORDERS}/costAppeal/detail`, 'GET', { parkOrderId: this.state.orderId }, this.handleQuery.bind(this))
                } else {
                    //失败----做除了报错之外的操作
                }
                this.setState({
                    confirmLoading: false,
                })
            }, 'application/x-www-form-urlencoded')
        });
    }

    handleAppeal (status) {
        this.setState({
            handleStatus: status,
            modalVisible: true,
        });
    }

    validatorPrice (rule, value, callback) {
        if (isNaN(parseFloat(value))) callback('金额只能为数字');
        const reg = /^\d+(\.{0,1}\d+){0,1}$/;
        if (!reg.test(value)) callback('要求正数');
        // 小数
        if (value.indexOf('.') !== -1) {
            const integerBit = value.split('.')[0];
            if (integerBit.length > 5) callback('整数位最多5位');
            const decimalPlace = value.split('.')[1];
            if (decimalPlace.length > 2) callback('小数位最多2位');
        } else { //整数
            if (value.length > 5) callback('整数位最多5位');
        }
        if (this.state.appealData.parkOrderRealPrice - parseFloat(value) < 0) {
            callback('减免金额不得超过该订单实际费用')
        } else {
            callback()
        }
        callback()
    }

    getModal () {
        const { handleStatus, modalVisible, confirmLoading, appealData } = this.state;
        let TextAreaRules = null;
        if (handleStatus === 0) { //拒绝
            TextAreaRules = [{
                required: true,
                message: '请填写拒绝说明'
            }, {
                max: 200,
                message: '输入不可超过200字'
            }]
        } else {
            TextAreaRules = [{
                max: 200,
                message: '输入不可超过200字'
            }]
        }
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                visible={modalVisible}
                width={550}
                title={handleStatus === 0 ? '拒绝申诉' : '通过申诉'}
                destroyOnClose
                maskClosable={false}
                onOk={this.onOk.bind(this)}
                onCancel={this.onCancel.bind(this)}
                bodyStyle={{ margin: 20 }}
                confirmLoading={confirmLoading}
            >
                <Form>
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
                            {
                                handleStatus === 0 ? '管理人员对此申诉订单进行拒绝处理，必需填写拒绝理由，该用户将会收到申诉被拒绝消息' :
                                    '管理人员对此申诉订单进行通过处理，必需填写通过理由以及减免金额，减免金额不得超过该订单应付费用。'
                            }
                        </Col>
                    </Row>
                    {
                        handleStatus === 1 && (
                            <Fragment>
                                <Row style={{ marginTop: 10 }}>
                                    <Col span={4}>
                                        <label>应付金额: </label>
                                    </Col>
                                    <Col span={20}>
                                        <span style={{ color: '#1890ff' }}>{appealData.parkOrderRealPrice} 元</span>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: 10 }}>
                                    <Col span={4}>
                                        <label><span className="require_status" style={{ marginLeft: -6 }}>*</span>减免金额:
                                        </label>
                                    </Col>
                                    <Col span={20}>
                                        <Form.Item style={{ marginBottom: 0 }}>
                                            {getFieldDecorator('waiverAmount', {
                                                rules: [{
                                                    required: true,
                                                    message: '请填写减免金额'
                                                }, {
                                                    validator: this.validatorPrice.bind(this)
                                                }],
                                                validateFirst: true
                                            })(
                                                <Input placeholder='请输入' onChange={(e) => {
                                                    const value = e.target.value;
                                                    this.state.waiverAmount = value;
                                                }}/>
                                            )}
                                        </Form.Item>
                                        <div style={{ clear: 'both' }}/>
                                        <span style={{ color: '#FAAD14' }}>*注意减免金额不得超过该订单应付费用</span>
                                    </Col>
                                </Row>
                            </Fragment>
                        )
                    }
                    <Row style={{ marginTop: 20 }}>
                        <Col span={4}>
                            <label>{handleStatus === 0 ?
                                <Fragment><span className="require_status">*</span>拒绝说明</Fragment> : '通过说明'}: </label>
                        </Col>
                        <Col span={20}>
                            <Form.Item>
                                {getFieldDecorator('reason', {
                                    rules: TextAreaRules
                                })(
                                    <TextArea rows={3} placeholder='请输入' onChange={(e) => {
                                        const value = e.target.value;
                                        this.state.remark = value
                                    }}/>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }

    render () {
        if (!window.checkPageEnable('appealDetail')) return <Exception type={403}/>;
        const { appealData, loading } = this.state;
        if (!appealData && !loading) return <Exception type='500'/>;
        const tabs = ['最新申诉处理', '历史申诉处理'];
        const statusText = ['待处理', '已通过', '已拒绝'];
        const statusBoolean = appealData && appealData.status === 0 && this.state.currentTab === 0;
        return (
            <div className='page'>
                <Spin spinning={loading} tip='加载中...'>
                    <div className='page-header' style={{ paddingBottom: 8 }}>
                        <div style={{ position: 'relative', height: 50 }}>
                            <div style={{ float: 'left' }}>订单号：{this.props.location.query.orderId}
                                {
                                    window.checkPageEnable('parkingRecordDetail') && (
                                        <a onClick={this.getOrderDetail.bind(this)}
                                           style={{
                                               padding: '0 5px 5px 5px',
                                               fontSize: 14
                                           }}>查看订单详情>></a>
                                    )
                                }
                            </div>
                            <div
                                style={{
                                    position: 'absolute',
                                    right: (statusBoolean && window.checkPageEnable('handleAppeal')) ? 120 : 10,
                                    height: 54,
                                    bottom: 10
                                }}>
                                <div className="detail_header_status_title">状态</div>
                                <Badge className='header-dot'
                                       status={statusBoolean ? 'processing' : 'default'}/>
                                <span
                                    className='statusText'>{this.state.currentTab === 0 ? (appealData && statusText[appealData.status]) : '已拒绝'}</span>
                                <div style={{ clear: 'both' }}/>
                            </div>
                            {
                                statusBoolean && window.checkPageEnable('handleAppeal') && (
                                    <div style={{ position: 'absolute', right: 0, bottom: 0 }}>
                                        <div style={{ marginBottom: 10 }}>
                                            <Button type="danger" style={{ background: '#FF6E6E', color: 'white' }}
                                                    onClick={this.handleAppeal.bind(this, 0)}>拒绝申诉</Button>
                                        </div>
                                        <Button type="primary" onClick={this.handleAppeal.bind(this, 1)}>通过申诉</Button>
                                    </div>
                                )
                            }
                        </div>
                        <div
                            style={{
                                color: 'rgba(0,0,0,0.85)',
                                lineHeight: '22px',
                                fontSize: '14px'
                            }}>
                            <span style={{ color: 'rgba(0,0,0,0.85' }}>实际停车时长：</span>
                            <span style={{ color: 'rgba(0,0,0,0.65' }}>{appealData && appealData.realTime} 分钟</span>
                        </div>
                        <div className='appeal-tabs'>
                            {tabs.map((item, i) => {
                                return <a className={this.checkTab(i)} key={i}
                                          onClick={this.chooseTab.bind(this, i)}>{item}</a>
                            })}
                        </div>
                    </div>
                    <div className='page-content' style={{ padding: 0, background: 'transparent' }}>
                        {
                            appealData && this.getContent()
                        }
                    </div>
                </Spin>
                {
                    this.getModal()
                }
            </div>
        );
    }
}

export default Form.create()(AppealDetail)

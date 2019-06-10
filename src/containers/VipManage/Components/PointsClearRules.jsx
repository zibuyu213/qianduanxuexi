import React, {Component} from 'react';

import {Button, Card, Modal, Row, Col, Form, DatePicker, message, Spin} from 'antd';
import {HttpClient} from "../../../common/HttpClient";

const FormItem = Form.Item;

class PointsClearRules extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageLoading: true,
            modalVisible: false,
            confirmLoading: false,
            runTime: '',
            effectMemberScoreTime: '',
        };
    }

    // 组件挂载之前
    componentWillMount() {
    }

    // 组件挂载后
    componentDidMount() {
        HttpClient.query(`${window.MODULE_PARKING_PERSON_INFO}/memberScore/getMemberScoreCleanRule`, 'GET', null, this.handleQuery.bind(this))
    }

    // 组件卸载之前
    componentWillUnmount() {
    }

    // 处理请求回调
    handleQuery(d, type) {
        const data = d.data;
        if (type === HttpClient.requestSuccess) {
            //成功-------在这里做你的数据处理
            this.setState({
                runTime: data.runTime,
                effectMemberScoreTime: data.effectMemberScoreTime,
                modalVisible: false,
                pageLoading: false,
                confirmLoading: false,
            });
        } else {
            //失败----做除了报错之外的操作
        }
    }

    // 开始日期不可选
    disabledStartDate(startValue) {
        const form = this.props.form;
        const endValue = form.getFieldValue('effectMemberScoreTime');
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.endOf('day').valueOf() < endValue.endOf('day').valueOf();
    }

    // 开始日期变化
    onStartChange(value) {
        const form = this.props.form;
        form.setFieldsValue({runTime: value});
    }

    // 结束日期不可选
    disabledEndDate(endValue) {
        const form = this.props.form;
        const startValue = form.getFieldValue('runTime');
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.endOf('day').valueOf() > startValue.endOf('day').valueOf();
    }

    // 结束日期变化
    onEndChange(value) {
        const form = this.props.form;
        form.setFieldsValue({effectMemberScoreTime: value});
    }

    // 点击配置按钮
    configModal() {
        this.setState({
            modalVisible: true
        })
    }

    // 模态框OK按钮
    onOk() {
        const form = this.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return
            }
            const params = {
                runTime: values.runTime.format('MM-DD'),
                effectMemberScoreTime: values.effectMemberScoreTime.format('MM-DD'),
            };
            this.setState({
                pageLoading: true,
                confirmLoading: true
            });
            HttpClient.query(`${window.MODULE_PARKING_PERSON_INFO}/memberScore/configureScoreCleanRule`, 'POST', JSON.stringify(params), (d, type) => {
                if (type === HttpClient.requestSuccess) {
                    message.success(d.data);
                    HttpClient.query(`${window.MODULE_PARKING_PERSON_INFO}/memberScore/getMemberScoreCleanRule`, 'GET', null, this.handleQuery.bind(this))
                }else {
                    this.setState({
                        pageLoading: false,
                        confirmLoading: false
                    });
                }
            });
        });
    }

    // 模态框Cancel按钮
    onCancel() {
        this.setState({
            modalVisible: false
        })
    }

    render() {
        const {modalVisible, runTime, effectMemberScoreTime, pageLoading, confirmLoading} = this.state;
        const {getFieldDecorator} = this.props.form;
        const formLayout = {
            labelCol: {span: 10},
            wrapperCol: {span: 14}
        };
        const ConfigModal = (
            <Modal
                title='积分清零规则'
                visible={modalVisible}
                destroyOnClose
                confirmLoading={confirmLoading}
                maskClosable={false}
                onOk={this.onOk.bind(this)}
                onCancel={this.onCancel.bind(this)}
                width={700}
                bodyStyle={{margin: '50px 20px 20px 20px'}}
            >
                <Form style={{display: 'flex'}}>
                    <FormItem style={{flexBasis: 300}} label='积分清零规则' {...formLayout}>
                        每年的
                        {getFieldDecorator('runTime', {
                            rules: [{
                                required: true,
                                message: '请选择日期'
                            }]
                        })(
                            <DatePicker placeholder='请选择' format='MM-DD' style={{width: 100, marginLeft: '10px'}}
                                        disabledDate={this.disabledStartDate.bind(this)}
                                        onChange={this.onStartChange.bind(this)}/>
                        )}
                    </FormItem>
                    <FormItem style={{width: 260}}>
                        清除本年度
                        {getFieldDecorator('effectMemberScoreTime', {
                            rules: [{
                                required: true,
                                message: '请选择日期'
                            }]
                        })(
                            <DatePicker placeholder='请选择' format='MM-DD'
                                        style={{width: 100, marginLeft: 10, marginRight: 10}}
                                        disabledDate={this.disabledEndDate.bind(this)}
                                        onChange={this.onEndChange.bind(this)}/>
                        )}
                        之前的积分
                    </FormItem>
                </Form>
            </Modal>
        );
        return (
            <Spin spinning={pageLoading}>
                <div className="page-content page-content-transparent">
                    <Card
                        title='积分清零规则'
                        extra={
                            window.getPerValue('vipClearRule') &&
                                <Button type='primary' onClick={this.configModal.bind(this)}>配 置</Button>
                        }
                    >
                        {ConfigModal}
                        <Row>
                            <Col>
                                <label>积分清零规则：</label>
                                {
                                    runTime ? <span>每年的 {runTime} 清除 本年度 {effectMemberScoreTime} 之前的积分</span> : '未配置'
                                }
                            </Col>
                        </Row>
                    </Card>
                </div>
            </Spin>
        );
    }
}

const WrapperPointsClearRules = Form.create()(PointsClearRules);
export default WrapperPointsClearRules;

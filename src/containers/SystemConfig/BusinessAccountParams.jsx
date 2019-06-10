import React, {Component, Fragment} from 'react';

import {Button, Card, Row, Col, message, Spin} from 'antd';
import {HttpClient} from "../../common/HttpClient";
import EmailAccountModal from './Components/EmailAccountModal.jsx';
import SortMessageModal from './Components/SortMessageModal.jsx';
import Exception from "../../components/Exception";

const statusEnum = {
    1: '启用',
    2: '停用'
};
export default class extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: true,
            emailModalVisible: false,
            messageModalVisible: false,
            mailAccountParams: {},
            messageParams: {},
        };
    }

    // 组件挂载之前
    componentWillMount () {
    }

    // 组件挂载后
    componentDidMount () {
        HttpClient.query(`${window.MODULE_PARKING_INFO}/centerConsole/getBusinessAccountParams`, 'GET', null, this.handleQuery.bind(this))
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
                mailAccountParams: data.mailAccountParams,
                messageParams: data.messageParams
            }, () => {
                this.setState({
                    loading: false,
                    emailModalVisible: false,
                    messageModalVisible: false,
                })
            })
        } else {
            //失败----做除了报错之外的操作
            this.setState({
                loading: false,
                emailModalVisible: false,
                messageModalVisible: false,
            })
        }
    }

    // 邮箱账号配置 OK
    emailModalOk () {
        const form = this.EmailFormRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log('Received values of form: ', values);
            delete values['testMailAddress'];
            HttpClient.query(`${window.MODULE_PARKING_INFO}/centerConsole/configureMailAccount`, 'POST', JSON.stringify(values), (d, type) => {
                if (type == HttpClient.requestSuccess) {
                    message.success(d.data);
                    HttpClient.query(`${window.MODULE_PARKING_INFO}/centerConsole/getBusinessAccountParams`, 'GET', null, this.handleQuery.bind(this))
                }
            });
        });
    }

    // 邮箱账号配置 Cancel
    emailModalCancel () {
        this.setState({
            emailModalVisible: false
        })
    }

    // 短信接口配置 OK
    messageModalOk () {
        const form = this.SortMessageFormRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            // console.log('Received values of form: ', values);
            HttpClient.query(`${window.MODULE_PARKING_INFO}/centerConsole/configureMessageParams`, 'POST', JSON.stringify(values), (d, type) => {
                if (type == HttpClient.requestSuccess) {
                    message.success(d.data);
                    HttpClient.query(`${window.MODULE_PARKING_INFO}/centerConsole/getBusinessAccountParams`, 'GET', null, this.handleQuery.bind(this))
                }
            });
        });
    }

    // 短信接口配置 Cancel
    messageModalCancel () {
        this.setState({
            messageModalVisible: false
        })
    }

    render () {
        if (!window.checkPageEnable('/BusinessAccountParams')) {
            return <Exception type='403'/>;
        }
        const { emailModalVisible, messageModalVisible, mailAccountParams, messageParams, loading } = this.state;
        return (
            <Spin spinning={loading}>
                <div className='page'>
                    <div className='page-header'>
                        业务账号参数
                    </div>
                    <div className='page-content' style={{ padding: 0, background: 'transparent' }}>
                        <Card
                            title='邮箱账号设置'
                            extra={window.checkPageEnable('businessAccountConfig') && <Button type='primary' onClick={() => {
                                this.setState({
                                    emailModalVisible: true
                                })
                            }}>配置</Button>}
                            className='detail-card'
                        >
                            <Row gutter={50}>
                                <Col span={8} className='detail-card-col'>
                                    <label>发信邮箱：</label>
                                    <span>{mailAccountParams && mailAccountParams.sendMailAccount || '-'}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>邮箱登录密码：</label>
                                    <span style={{
                                        flex: 1,
                                        wordBreak: 'break-all'
                                    }}>{mailAccountParams && mailAccountParams.passwordOfMail || '-'}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>SMTP服务器地址：</label>
                                    <span>{mailAccountParams && mailAccountParams.SMTPAddress || '-'}</span>
                                </Col>
                            </Row>
                            <Row gutter={50}>
                                <Col span={8} className='detail-card-col'>
                                    <label>SMTP服务器端口：</label>
                                    <span>{mailAccountParams && mailAccountParams.SMTPPort || '-'}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>状态：</label>
                                    <span>{mailAccountParams && mailAccountParams.status && statusEnum[mailAccountParams.status]}</span>
                                </Col>
                            </Row>
                        </Card>
                        <Card
                            title='短信接口'
                            extra={window.checkPageEnable('businessAccountConfig') && <Button type='primary' onClick={() => {
                                this.setState({
                                    messageModalVisible: true
                                })
                            }}>配置</Button>}
                            className='detail-card'
                        >
                            <Row gutter={50}>
                                <Col span={8} className='detail-card-col'>
                                    <label>用户名(accessKeyId)：</label>
                                    <span>{messageParams && messageParams.accessKeyId || '-'}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>密码(accessKeysecret)：</label>
                                    <span style={{
                                        flex: 1,
                                        wordBreak: 'break-all'
                                    }}>{messageParams && messageParams.accessKeySecret || '-'}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>短信签名(SignName)：</label>
                                    <span style={{
                                        flex: 1,
                                        wordBreak: 'break-all'
                                    }}>{messageParams && messageParams.signName || '-'}</span>
                                </Col>
                            </Row>
                        </Card>
                        {
                            !loading && (
                                <Fragment>
                                    <EmailAccountModal
                                        wrappedComponentRef={formRef => this.EmailFormRef = formRef}
                                        visible={emailModalVisible}
                                        payload={mailAccountParams}
                                        onOk={this.emailModalOk.bind(this)}
                                        onCancel={this.emailModalCancel.bind(this)}
                                    />
                                    <SortMessageModal
                                        wrappedComponentRef={formRef => this.SortMessageFormRef = formRef}
                                        visible={messageModalVisible}
                                        payload={messageParams}
                                        onOk={this.messageModalOk.bind(this)}
                                        onCancel={this.messageModalCancel.bind(this)}
                                    />
                                </Fragment>
                            )
                        }
                    </div>
                </div>
            </Spin>
        );
    }
}

import React, {Component, Fragment} from 'react';
import {Button, Card, Row, Col, message, Spin} from 'antd';
import AccountFormModal from './Components/AccountFormModal.jsx';
import ThirdPartyFormModal from './Components/ThirdPartyFormModal.jsx';
import OpeningBanckFormModal from './Components/OpeningBanckFormModal.jsx';
import {HttpClient} from "../../common/HttpClient";
import Exception from "../../components/Exception";

const accountTypeEnum = ['企业收款账号', '财政收款账号'];
export default class FinancialAccountParams extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            confirmLoading: false,
            accountVisible: false,
            thirdPartyPaymentVisible: false,
            openingBanckVisible: false,
            bankAccount: { //财务账号参数
                accountType: '',//账户类型(1:企业收款账号、2:财政收款账号)
                beneficiaryBank: '',//收款银行
                collectAccount: '',//收款账号
            },
            wxPayAccount: {
                publicAccountId: '',//微信公众号ID
                publicAccountKey: '',//微信公众号密钥
                merChantNumber: '',//微信商户号
                apiSecret: '',//API密钥
                domainName: '',//域名配置
            },
            billingAccountParams: {},
        };
    }

    // 组件挂载之前
    componentWillMount() {
    }

    // 组件挂载后
    componentDidMount() {
        HttpClient.query(`${window.MODULE_PARKING_INFO}/centerConsole/getFinancialAccountParams`, 'GET', null, this.handleQuery.bind(this))
    }

    // 组件卸载之前
    componentWillUnmount() {
    }

    // 处理请求回调
    handleQuery(d, type) {
        const data = d.data;
        if (type === HttpClient.requestSuccess) {
            //成功-------在这里做你的数据处理
            let wxPayAccount = {};
            for (let item in data.wxPayAccount) {
                if (data.wxPayAccount[item]) {
                    wxPayAccount[item] = data.wxPayAccount[item]
                }
            }
            this.setState({
                bankAccount: data.bankAccount,
                wxPayAccount: wxPayAccount,
                billingAccountParams: data.billingAccountParams,
            })
        } else {
            //失败----做除了报错之外的操作
        }
        this.setState({
            loading: false,
            accountVisible: false,
            thirdPartyPaymentVisible: false,
            openingBanckVisible: false,
            confirmLoading: false,
        })
    }

    // 运营方收款账号-银行账号 OK
    accountModalOk() {
        const form = this.AccountFormRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            this.setState({
                confirmLoading: true
            });
            // console.log('Received values of form: ', values);
            HttpClient.query(`${window.MODULE_PARKING_INFO}/centerConsole/configureBeneficiaryAccount`, 'POST', JSON.stringify(values), (d, type) => {
                this.setState({
                    confirmLoading: false
                });
                if (type == HttpClient.requestSuccess) {
                    message.success(d.data);
                    HttpClient.query(`${window.MODULE_PARKING_INFO}/centerConsole/getFinancialAccountParams`, 'GET', null, this.handleQuery.bind(this))
                }
            });
        });
    }

    // 运营方收款账号-银行账号 Cancel
    accountModalCancel() {
        this.setState({
            accountVisible: false
        })
    }

    // 第三方支付配置-微信 OK
    thirdPartyModalOk() {
        const form = this.ThirdPartyFormRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            this.setState({
                confirmLoading: true
            });
            // console.log('Received values of form: ', values);
            HttpClient.query(`${window.MODULE_PARKING_INFO}/centerConsole/configureWxParams`, 'POST', JSON.stringify(values), (d, type) => {
                this.setState({
                    confirmLoading: false
                });
                if (type == HttpClient.requestSuccess) {
                    message.success(d.data);
                    HttpClient.query(`${window.MODULE_PARKING_INFO}/centerConsole/getFinancialAccountParams`, 'GET', null, this.handleQuery.bind(this))
                }
            });
        });
    }

    // 第三方支付配置-微信 Cancel
    thirdPartyModalCancel() {
        this.setState({
            thirdPartyPaymentVisible: false
        })
    }

    // 运营方开票账号 OK
    openingBanckModalOk() {
        const form = this.OpeningBanckFormRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            this.setState({
                confirmLoading: true
            });
            // console.log('Received values of form: ', values);
            HttpClient.query(`${window.MODULE_PARKING_INFO}/centerConsole/configureBillingAccount`, 'POST', JSON.stringify(values), (d, type) => {
                this.setState({
                    confirmLoading: false
                });
                if (type == HttpClient.requestSuccess) {
                    message.success(d.data);
                    HttpClient.query(`${window.MODULE_PARKING_INFO}/centerConsole/getFinancialAccountParams`, 'GET', null, this.handleQuery.bind(this))
                }
            });
        });
    }

    // 运营方开票账号 Cancel
    openingBanckModalCancel() {
        this.setState({
            openingBanckVisible: false
        })
    }

    render() {
        if (!window.checkPageEnable('/FinancialAccountParams')) {
            return <Exception type='403'/>;
        }
        const {accountVisible, thirdPartyPaymentVisible, openingBanckVisible, bankAccount, wxPayAccount, billingAccountParams, loading, confirmLoading} = this.state;
        return (
            <Spin spinning={loading} tip='加载中...'>
                <div className='page'>
                    <div className='page-header'>
                        财务账号参数
                    </div>
                    <div className='page-content' style={{padding: 0, background: 'transparent'}}>
                        <Card
                            title='运营方收款账号-银行账号'
                            extra={window.checkPageEnable('financialAccountConfig') && <Button type='primary' onClick={() => {
                                this.setState({
                                    accountVisible: true
                                })
                            }}>配置</Button>}
                            className='detail-card'
                        >
                            <Row gutter={50}>
                                <Col span={8} className='detail-card-col'>
                                    <label>账号类型：</label>
                                    <span>{bankAccount && isFinite(bankAccount.accountType) ? accountTypeEnum[bankAccount.accountType] : '-'}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>收款银行：</label>
                                    <span>{bankAccount && bankAccount.beneficiaryBank || '-'}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>收款账号：</label>
                                    <span>{bankAccount && bankAccount.collectAccount || '-'}</span>
                                </Col>
                            </Row>
                        </Card>
                        <Card
                            title='第三方支付配置-微信'
                            extra={
                                window.checkPageEnable('financialAccountConfig') && (<Button type='primary' onClick={() => {
                                    this.setState({
                                        thirdPartyPaymentVisible: true
                                    })
                                }}>配置</Button>)
                            }
                            className='detail-card'
                        >
                            <Row gutter={50}>
                                <Col span={8} className='detail-card-col'>
                                    <label>APPID：</label>
                                    <span>{wxPayAccount && wxPayAccount.publicAccountId || '-'}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>微信商户号：</label>
                                    <span>{wxPayAccount && wxPayAccount.merChantNumber || '-'}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>API密钥：</label>
                                    <span>{wxPayAccount && wxPayAccount.apiSecret || '-'}</span>
                                </Col>
                            </Row>
                            <Row gutter={50}>
                                <Col span={8} className='detail-card-col'>
                                    <label>APPsecret：</label>
                                    <span>{wxPayAccount && wxPayAccount.publicAccountKey || '-'}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>域名配置：</label>
                                    <span>{wxPayAccount && wxPayAccount.domainName || '-'}</span>
                                </Col>
                            </Row>
                        </Card>
                        <Card
                            title='运营方开票账号'
                            extra={window.checkPageEnable('financialAccountConfig') && <Button type='primary' onClick={() => {
                                this.setState({
                                    openingBanckVisible: true
                                })
                            }}>配置</Button>}
                            className='detail-card'
                        >
                            <Row gutter={50}>
                                <Col span={8} className='detail-card-col'>
                                    <label>销方税号：</label>
                                    <span>{billingAccountParams && billingAccountParams.salerTaxNum || '-'}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>销方电话：</label>
                                    <span>{billingAccountParams && billingAccountParams.salerTel || '-'}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>销方地址：</label>
                                    <span>{billingAccountParams && billingAccountParams.salerAddress || '-'}</span>
                                </Col>
                            </Row>
                            <Row gutter={50}>
                                <Col span={8} className='detail-card-col'>
                                    <label>销方银行账号：</label>
                                    <span>{billingAccountParams && billingAccountParams.salerAccount || '-'}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>销方开户行地址：</label>
                                    <span>{billingAccountParams && billingAccountParams.salerOpenBankAddress || '-'}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>开票员：</label>
                                    <span>{billingAccountParams && billingAccountParams.invoiceClerk || '-'}</span>
                                </Col>
                            </Row>
                            <Row gutter={50}>
                                <Col span={8} className='detail-card-col'>
                                    <label>APP Key：</label>
                                    <span>{billingAccountParams && billingAccountParams.appKey || '-'}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>APP Secret：</label>
                                    <span>{billingAccountParams && billingAccountParams.appSecret || '-'}</span>
                                </Col>
                            </Row>
                        </Card>
                    </div>
                    {
                        !loading && (
                            <Fragment>
                                <AccountFormModal
                                    wrappedComponentRef={formRef => this.AccountFormRef = formRef}
                                    visible={accountVisible}
                                    payload={bankAccount}
                                    onOk={this.accountModalOk.bind(this)}
                                    onCancel={this.accountModalCancel.bind(this)}
                                    confirmLoading={confirmLoading}
                                />
                                <ThirdPartyFormModal
                                    wrappedComponentRef={formRef => this.ThirdPartyFormRef = formRef}
                                    visible={thirdPartyPaymentVisible}
                                    payload={wxPayAccount}
                                    onOk={this.thirdPartyModalOk.bind(this)}
                                    onCancel={this.thirdPartyModalCancel.bind(this)}
                                    confirmLoading={confirmLoading}
                                />
                                <OpeningBanckFormModal
                                    wrappedComponentRef={formRef => this.OpeningBanckFormRef = formRef}
                                    visible={openingBanckVisible}
                                    payload={billingAccountParams}
                                    onOk={this.openingBanckModalOk.bind(this)}
                                    onCancel={this.openingBanckModalCancel.bind(this)}
                                    confirmLoading={confirmLoading}
                                />
                            </Fragment>
                        )
                    }
                </div>
            </Spin>
        );
    }
}

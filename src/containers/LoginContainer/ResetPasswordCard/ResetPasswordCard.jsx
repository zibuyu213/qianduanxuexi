import React, {Component} from 'react';

import {Button, Card, Form, Input, Select, message} from 'antd';
import './Styles.css';
import {HttpClient} from "../../../common/HttpClient";

const FormItem = Form.Item;
const Option = Select.Option;
let globalCountDown = null;

class ResetPasswordCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            countDown: 60, // 倒计时
            getVerifyText: '获取验证码', // 倒计时text
            getVerifyButtonDisabled: false, // 按钮状态
        };
    }

    // 组件挂载之前
    componentWillMount() {
    }

    // 组件挂载后
    componentDidMount() {
    }

    // 组件卸载之前
    componentWillUnmount() {

    }

    // 获取验证码
    getVerifyCode() {
        const params = {
            mobileNumber: this.state.mobile,
            operatorId: window.OPERATOR_ID,
        };
        if (this.state.mobile) {
            this.setState({
                getVerifyButtonDisabled: true,
                countDown: 60,
            });
            let url = window.MODULE_PARKING_AUTHORITY;
            url += this.props.context === '修改密码' ? '/admin/getVerificationCode' : '/admin/forgetPassWord/getVerificationCode';
            HttpClient.query(url, 'POST', params, (d, type) => {
                if (type === HttpClient.requestSuccess) {
                    message.success('验证码发送成功', 1.5);
                    // 倒计时
                    globalCountDown = setInterval(() => {
                        this.cuontDown()
                    }, 1000);
                } else {
                    // 用户不存在时
                    this.setState({
                        getVerifyButtonDisabled: false,
                    });
                }
            }, 'application/x-www-form-urlencoded')
        } else {
            message.info('请输入手机号！', 1);
            this.setState({
                getVerifyButtonDisabled: false,
            });
        }
    }

    // 倒计时
    cuontDown() {
        if (this.state.countDown === 0) {
            this.setState({
                getVerifyText: '获取验证码',
                getVerifyButtonDisabled: false,
            });
            clearInterval(globalCountDown);
        } else {
            this.setState({
                countDown: --this.state.countDown,
                getVerifyText: `重新发送 ${this.state.countDown}`,
            })
        }
    }

    // 提交
    ResetSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const params = {
                    password: values.password,
                    mobileNumber: values.mobile,
                    verificationCode: values.verifyCode,
                    operatorId: window.OPERATOR_ID,
                };
                if (this.props.context === '忘记密码') {
                    HttpClient.query('/parking-authority/admin/ForgetPassWord/updatePassWord', 'POST', params, this.queryCallback.bind(this), 'application/x-www-form-urlencoded')
                } else if (this.props.context === '修改密码') {
                    HttpClient.query('/parking-authority/admin/updatePassword', 'POST', params, this.queryCallback.bind(this), 'application/x-www-form-urlencoded')
                }
            }
        });
    }

    // 请求回调
    queryCallback(d, type) {
        if (type === HttpClient.requestSuccess) {
            //成功-------在这里做你的数据处理
            sessionStorage.clear();
            localStorage.clear();
            window.setPermission({});
            window.setManagePartnerList([]);
            window.currentIsSystemAdmin = false;
            clearInterval(globalCountDown);
            message.success('密码修改成功，两秒后返回登录页面', 2);
            setTimeout(() => {
                window.window.location.hash = '/Login'
            }, 2000)
        } else {
            //失败----做除了报错之外的操作
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {context, style} = this.props;
        const {getVerifyText, getVerifyButtonDisabled} = this.state;
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select style={{width: 70}}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        );
        return (
            <Card className='reset-card' style={style} bordered={false} hoverable={false}>
                <div className='top'>
                    <div className='header'>
                        <img style={{width: 50, height: 50}} src={window.LOGO_SRC}/>
                        <span style={{
                            color: "#1890FF",
                            fontSize: "34px",
                            lineHeight: "42px",
                            margin: "0 20px"
                        }}>{window.OPERATOR_NAME}中台</span>
                    </div>
                </div>
                <div className='form-title'>
                    <span>{context}</span>
                    {
                        context === '忘记密码' && (
                            <span className='back-login' onClick={() => {
                                window.location.hash = '/Login';
                            }}>返回登录</span>
                        )
                    }
                </div>
                <Form onSubmit={this.ResetSubmit.bind(this)} className="login-form">
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{
                                required: true,
                                message: '只能输入6-16位',
                            }, {
                                validator: (rule, value, callback) => {
                                    let reg = /^[0-9a-zA-Z]{6,16}$/;
                                    if (value) {
                                        if (!(value.length > 5 && value.length < 17)) {
                                            callback('只能输入6-16位');
                                        }else {
                                            if (!reg.test(value)) {
                                                callback('支持数字、英文，不支持特殊字符');
                                            }
                                        }
                                    }
                                    callback();
                                },
                            }],
                        })(
                            <Input className='login-form-input' type="password" placeholder="6-16 位密码，区分大小写"/>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('configPassword', {
                            rules: [{
                                required: true,
                                message: '请输入确认密码!'
                            }, {
                                validator: (rule, value, callback) => {
                                    const {getFieldValue} = this.props.form;
                                    if (value && value !== getFieldValue('password')) {
                                        callback('两次输入不一致！')
                                    }
                                    callback();
                                },
                            }],
                        })(
                            <Input className='login-form-input' type="password" placeholder="确认密码"/>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('mobile', {
                            rules: [{required: true, message: ' '}, {
                                validator: (rule, value, callback) => {
                                    const reg = /^1\d{10}$/;
                                    if (!reg.test(value)) {
                                        callback('请输入正确的手机号!')
                                    }
                                    callback();
                                }
                            }],

                        })(
                            <Input className='login-form-input' addonBefore={prefixSelector}
                                   placeholder="11 位手机号"
                                   onChange={(e) => {
                                       this.state.mobile = e.target.value
                                   }}
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('verifyCode', {
                            rules: [{required: true, message: '请输入验证码!'}],
                        })(
                            <Input className='login-form-input' placeholder="请输入验证码" style={{width: '72%'}}/>
                        )}
                        <Button style={{width: '25%', height: '40px', float: 'right'}}
                                onClick={this.getVerifyCode.bind(this)}
                                disabled={getVerifyButtonDisabled}>{getVerifyText}</Button>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            提交
                        </Button>
                    </FormItem>
                </Form>
            </Card>
        );
    }
}

const WrapperResetPasswordCard = Form.create()(ResetPasswordCard);
export default WrapperResetPasswordCard;

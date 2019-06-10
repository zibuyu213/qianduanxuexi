import React, {Component} from 'react';
import {Card, Checkbox, Button, Input, Icon, Form, message} from 'antd';
import {HttpClient} from "../../common/HttpClient";
import _ from 'lodash';
import './Style/LoginContainer.css';

const FormItem = Form.Item;

class LoginContainer extends Component {
    constructor (props) {
        super(props);
        this.state = {
            autoLogin: false,
            loadLogin: false,
            username: '',
            password: '',
        };
    }

    componentWillMount () {
    }

    componentDidMount () {
        if (window.isInvalidToLogin) { // 防止出现多个提示信息
            message.warning('认证失效，请重新登录');
            window.isInvalidToLogin = false;
        }
        this.clearUserInfo();
    }

    clearUserInfo () {
        sessionStorage.clear();
        localStorage.clear();
        window.customCookie.remove('access_token');
        window.setPageMenu([]);
        window.setNewPageMenu([]);
        window.setPermission({});
        window.setManagePartnerList([]);
        window.currentIsSystemAdmin = false;
    }

    changeAutoLogin () {
        this.setState({
            autoLogin: !this.state.autoLogin
        });
    };

    // 点击登录
    handleSubmit (e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    loadLogin: true,
                });
                let data = {
                    grant_type: 'password',
                    password: values.password,
                    username: _.trim(values.username),
                    operatorId: window.OPERATOR_ID,
                };
                HttpClient.query(window.MODULE_PARKING_AUTHORITY + '/admin/token', 'POST', JSON.stringify(data), this.handleLogin.bind(this));
            }
        });
    };

    // 处理登录回调
    handleLogin (d, type) {
        this.setState({
            loadLogin: false,
        });
        if (type === HttpClient.requestSuccess) {
            //成功-------在这里做你的数据处理，需要提示的自己加
            if (d.success) {
                const data = d.data;
                window.customCookie.set('access_token', data.access_token);
                if (this.state.autoLogin) {
                    window.customCookie.set('access_token', data.access_token, 7);
                }
                localStorage.setItem('autoLogin', this.state.autoLogin);
                message.success('登录成功！');
                window.location.hash = '/';
            } else {
                message.error(d.error.message);
            }
        } else {
            //失败----做除了报错之外的操作
        }
    }

    render () {
        const { getFieldDecorator } = this.props.form;
        const { autoLogin, loadLogin, username, password } = this.state;
        return (
            <div className='container'>
                <div className='content'>
                    <div className='top'>
                        <div className='header'>
                            <img style={{ width: 60, height: 50 }} src={window.LOGO_SRC}/>
                            <span style={{
                                color: "white",
                                fontSize: "33px",
                                lineHeight: "52px",
                                margin: "0 20px"
                            }}>{window.OPERATOR_NAME}中台</span>
                        </div>
                    </div>
                    {/*用户登录输入表单*/}
                    <Card className='card'>
                        <div className='main'>
                            <div className='accountLogin'>
                                <span>账户密码登录</span>
                            </div>
                            <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
                                <FormItem>
                                    {getFieldDecorator('username', {
                                        initialValue: username,
                                        rules: [{ required: true, message: '请输入用户名!' }],
                                    })(
                                        <Input className='login-form-input'
                                               prefix={<Icon type="user" style={{ fontSize: 13 }}/>} placeholder="账户"/>
                                    )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('password', {
                                        initialValue: password,
                                        rules: [{ required: true, message: '请输入密码!' }],
                                    })(
                                        <Input className='login-form-input'
                                               prefix={<Icon type="lock" style={{ fontSize: 13 }}/>} type="password"
                                               placeholder="密码" onPressEnter={this.handleSubmit.bind(this)}/>
                                    )}
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" htmlType="submit" loading={loadLogin}
                                            className="login-form-button">
                                        登录
                                    </Button>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        {getFieldDecorator('autoLogin', {
                                            valuePropName: 'checked',
                                            initialValue: autoLogin,
                                        })(
                                            <Checkbox onChange={this.changeAutoLogin.bind(this)}>
                                                下次自动登录
                                            </Checkbox>
                                        )}
                                        <a style={{ fontSize: '14px', lineHeight: '22px' }} onClick={(e) => {
                                            window.location.hash = '/ResetPassword';
                                        }}>忘记密码</a>
                                    </div>
                                </FormItem>
                            </Form>
                        </div>
                    </Card>
                </div>
                <footer className='login-footer'>Copyright © 2018 智而行科技有限公司</footer>
            </div>
        )
    }
}

const WrappedLoginContainer = Form.create()(LoginContainer);
export default WrappedLoginContainer;

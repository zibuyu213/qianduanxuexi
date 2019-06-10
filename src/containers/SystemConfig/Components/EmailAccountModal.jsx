import React, {Component} from 'react';

import {Button, Modal, Radio, message, Form, Input} from 'antd';
import {HttpClient} from "../../../common/HttpClient";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class EmailAccountModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            testEmailButton: this.props.payload ? this.props.payload.status == 2 : true, // true为禁用按钮
        };
    }

    // 组件挂载之前
    componentWillMount () {
    }

    // 组件挂载后
    componentDidMount () {
    }

    // 组件卸载之前
    componentWillUnmount () {
    }

    // 状态选择变化
    handleStateChange (e) {
        if (e.target.value === 2) {
            this.setState({
                testEmailButton: true
            })
        } else {
            this.setState({
                testEmailButton: false
            })
        }
    }

    // 发送测试邮件
    sendTestEmail () {
        const params = this.props.form.getFieldsValue();
        if (!params.testMailAddress) {
            message.info('请输入测试邮件地址！')
        } else {
            HttpClient.query(`${window.MODULE_PARKING_INFO}/centerConsole/sendTestMail`, 'POST', JSON.stringify(params), (d, type) => {
                if (type === HttpClient.requestSuccess) {
                    //成功-------在这里做你的数据处理
                    message.success(d.data);
                } else {
                    //失败----做除了报错之外的操作
                }
            })
        }
    }

    render () {
        const { testEmailButton } = this.state;
        const { visible, onOk, onCancel, form, payload } = this.props;
        const payLoad = payload || {};
        const { getFieldDecorator } = form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        return (
            <Modal
                visible={visible}
                title='邮箱账号配置'
                destroyOnClose
                maskClosable={false}
                onOk={onOk}
                onCancel={onCancel}
                bodyStyle={{ margin: 20 }}
                width={650}
            >
                <Form>
                    <FormItem {...formItemLayout} label='发信邮箱'>
                        {getFieldDecorator('sendMailAccount', {
                            rules: [{
                                required: true,
                                message: '请输入发信邮箱',
                            }, {
                                max: 30,
                                message: '输入内容需在30字以内',
                            }, {
                                validator: (rule, value, callback) => {
                                    let reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]+$/;
                                    if (!reg.test(value)) {
                                        value && callback('请输入正确的邮箱');
                                    }
                                    callback();
                                }
                            }],
                            initialValue: payLoad.sendMailAccount ? payLoad.sendMailAccount : ''
                        })(
                            <Input placeholder='请输入'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='登录邮箱密码'>
                        {getFieldDecorator('passwordOfMail', {
                            rules: [{ required: true, message: '请输入登录邮箱密码' }, {
                                max: 30,
                                message: '输入内容需在30字以内',
                            }],
                            initialValue: payLoad.passwordOfMail ? payLoad.passwordOfMail : ''
                        })(
                            <Input placeholder='请输入'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='SMTP服务器地址'>
                        {getFieldDecorator('SMTPAddress', {
                            rules: [{
                                required: true,
                                message: '请输入服务器地址',
                            }, {
                                max: 50,
                                message: '输入内容需在50字以内',
                            }],
                            initialValue: payLoad.SMTPAddress ? payLoad.SMTPAddress : ''
                        })(
                            <Input placeholder='请输入'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='SMTP服务器端口'>
                        {getFieldDecorator('SMTPPort', {
                            rules: [{ required: true, message: '请选输入SMTP服务器端口' }, {
                                max: 50,
                                message: '输入内容需在50字以内',
                            }],
                            initialValue: payLoad.SMTPPort ? payLoad.SMTPPort : ''
                        })(
                            <Input placeholder='请输入'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='状态'>
                        {getFieldDecorator('status', {
                            rules: [{ required: true, message: '请选择状态' }],
                            initialValue: payLoad.status ? parseInt(payLoad.status) : ''
                        })(
                            <RadioGroup onChange={this.handleStateChange.bind(this)}>
                                <Radio value={1}>启用</Radio>
                                <Radio value={2}>停用</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='测试邮件地址'>
                        {getFieldDecorator('testMailAddress', {
                            rules: [{
                                max: 30,
                                message: '输入内容需在30字以内',
                            }, {
                                validator: (rule, value, callback) => {
                                    let reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]+$/;
                                    if (!reg.test(value)) {
                                        value && callback('请输入正确的邮箱');
                                    }
                                    callback();
                                }
                            }],
                            initialValue: payLoad.testMailAddress ? payLoad.testMailAddress : null
                        })(
                            <Input placeholder='请输入' style={{ width: '72%' }}/>
                        )}
                        <Button type='primary' style={{ float: 'right', width: '25%' }}
                                disabled={testEmailButton} onClick={this.sendTestEmail.bind(this)}>发送测试邮件</Button>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

const FormWrapper = Form.create()(EmailAccountModal);
export default FormWrapper

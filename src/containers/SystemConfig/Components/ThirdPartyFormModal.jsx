import React, {Component} from 'react';

import {Modal, Form, Input} from 'antd';

class ThirdPartyFormModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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

    render() {
        const {visible, onOk, onCancel, form, confirmLoading, payload} = this.props;
        const payLoad = payload || {};
        const FormItem = Form.Item;
        const {getFieldDecorator} = form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 18},
            },
        };
        return (
            <Modal
                visible={visible}
                title='第三方支付配置-微信'
                destroyOnClose
                maskClosable={false}
                onOk={onOk}
                onCancel={onCancel}
                bodyStyle={{margin: 20}}
                width={600}
                confirmLoading={confirmLoading}
            >
                <Form>
                    <FormItem {...formItemLayout} label='APPID'>
                        {getFieldDecorator('publicAccountId', {
                            rules: [{
                                required: true,
                                message: '请输入',
                            }, {
                                validator: (rule, value, callback) => {
                                    let reg = /^[a-zA-Z\d]+$/;
                                    if (!reg.test(value)) {
                                        value && callback('仅支持数字、英文、区分大小写');
                                    }
                                    callback();
                                }
                            }, {
                                max: 50,
                                message: '输入内容需在50字以内',
                            }],
                            initialValue: payLoad.publicAccountId ? payLoad.publicAccountId : ''
                        })(
                            <Input placeholder='请输入'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='微信支付商户号'>
                        {getFieldDecorator('merChantNumber', {
                            rules: [{required: true, message: '请输入'},
                                {
                                    validator: (rule, value, callback) => {
                                        let reg = /^[a-zA-Z\d]+$/;
                                        if (!reg.test(value)) {
                                            value && callback('仅支持数字、英文，区分大小');
                                        }
                                        callback();
                                    }
                                }, {
                                    max: 50,
                                    message: '输入内容需在50字以内',
                                }],
                            initialValue: payLoad.merChantNumber ? payLoad.merChantNumber : ''
                        })(
                            <Input placeholder='请输入'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='API密钥'>
                        {getFieldDecorator('apiSecret', {
                            rules: [{
                                required: true,
                                message: '请输入',
                            }, {
                                validator: (rule, value, callback) => {
                                    let reg = /^[a-zA-Z\d]+$/;
                                    if (!reg.test(value)) {
                                        value && callback('仅支持数字、英文，区分大小');
                                    }
                                    callback();
                                }
                            }, {
                                max: 50,
                                message: '输入内容需在50字以内',
                            }],
                            initialValue: payLoad.apiSecret ? payLoad.apiSecret : ''
                        })(
                            <Input placeholder='请输入'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='APPsecret'>
                        {getFieldDecorator('publicAccountKey', {
                            rules: [{required: true, message: '请输入'},
                                {
                                    validator: (rule, value, callback) => {
                                        let reg = /^[a-zA-Z\d]+$/;
                                        if (!reg.test(value)) {
                                            value && callback('仅支持数字、英文，区分大小');
                                        }
                                        callback();
                                    }
                                }, {
                                    max: 50,
                                    message: '输入内容需在50字以内',
                                }],
                            initialValue: payLoad.publicAccountKey ? payLoad.publicAccountKey : ''
                        })(
                            <Input placeholder='请输入'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='域名配置'>
                        {getFieldDecorator('domainName', {
                            rules: [{required: true, message: '请输入'},
                                {
                                    validator: (rule, value, callback) => {
                                        let reg = /^[\u4e00-\u9fa5]+$/;
                                        if (reg.test(value)) {
                                            value && callback('不支持中文');
                                        }
                                        callback();
                                    }
                                }, {
                                    max: 50,
                                    message: '输入内容需在50字以内',
                                }],
                            initialValue: payLoad.domainName ? payLoad.domainName : ''
                        })(
                            <Input placeholder='请输入'/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(ThirdPartyFormModal)

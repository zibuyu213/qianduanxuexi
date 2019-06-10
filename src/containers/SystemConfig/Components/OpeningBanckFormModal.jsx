import React, {Component} from 'react';

import {Modal, Form, Input} from 'antd';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

class OpeningBanckFormModal extends Component {
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
                title='运营方开票账号'
                destroyOnClose
                maskClosable={false}
                onOk={onOk}
                onCancel={onCancel}
                width={600}
                bodyStyle={{margin: 20}}
                confirmLoading={confirmLoading}
            >
                <Form>
                    <FormItem {...formItemLayout} label='销方税号'>
                        {getFieldDecorator('salerTaxNum', {
                            rules: [{
                                required: true,
                                message: '请输入',
                            }, {
                                validator: (rule, value, callback) => {
                                    let reg = /^[0-9a-zA-Z]+$/;
                                    if (!reg.test(value)) {
                                        value && callback('仅支持数字、英文，区分大小写');
                                    }
                                    callback();
                                }
                            }, {
                                max: 20,
                                message: '输入内容需在20字以内',
                            }],
                            initialValue: payLoad.salerTaxNum ? payLoad.salerTaxNum : ''
                        })(
                            <Input placeholder='请输入'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='销方电话'>
                        {getFieldDecorator('salerTel', {
                            rules: [{
                                required: true,
                                message: '请输入',
                            }, {
                                validator: (rule, value, callback) => {
                                    let reg = /[\d]+$/;
                                    if (!reg.test(value)) {
                                        value && callback('请输入正确的销方电话');
                                    }
                                    callback();
                                }
                            }, {
                                max: 20,
                                message: '输入内容需在20字以内',
                            }],
                            initialValue: payLoad.salerTel ? payLoad.salerTel : ''
                        })(
                            <Input placeholder='请输入'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='销方地址'>
                        {getFieldDecorator('salerAddress', {
                            rules: [{required: true, message: '请输入'}, {
                                max: 50,
                                message: '输入内容需在50字以内',
                            }],
                            initialValue: payLoad.salerAddress ? payLoad.salerAddress : ''
                        })(
                            <TextArea placeholder='请输入' rows={3}/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='销方银行账号'>
                        {getFieldDecorator('salerAccount', {
                            rules: [
                                {required: true, message: '请输入'},
                                {
                                    validator: (rule, value, callback) => {
                                        let reg = /^\d+$/;
                                        if (!reg.test(value)) {
                                            value && callback('请输入正确的银行账号');
                                        }
                                        callback();
                                    }
                                }, {
                                    max: 20,
                                    message: '输入内容需在20字以内',
                                }],
                            initialValue: payLoad.salerAccount ? payLoad.salerAccount : ''
                        })(
                            <Input placeholder='请输入'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='销方开户行地址'>
                        {getFieldDecorator('salerOpenBankAddress', {
                            rules: [{required: true, message: '请输入'}, {
                                max: 50,
                                message: '输入内容需在50字以内',
                            }],
                            initialValue: payLoad.salerOpenBankAddress ? payLoad.salerOpenBankAddress : ''
                        })(
                            <TextArea placeholder='请输入' rows={3}/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='开票员'>
                        {getFieldDecorator('invoiceClerk', {
                            rules: [{required: true, message: '请输入'}, {
                                max: 20,
                                message: '输入内容需在20字以内',
                            }],
                            initialValue: payLoad.invoiceClerk ? payLoad.invoiceClerk : ''
                        })(
                            <Input placeholder='请输入'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='APP Key'>
                        {getFieldDecorator('appKey', {
                            rules: [{required: true, message: '请输入'},
                                {
                                    validator: (rule, value, callback) => {
                                        let reg = /^[A-Za-z0-9]+$/;
                                        if (!reg.test(value)) {
                                            value && callback('仅支持数字、英文，区分大小写');
                                        }
                                        callback();
                                    }
                                }, {
                                    max: 50,
                                    message: '输入内容需在50字以内',
                                }],
                            initialValue: payLoad.appKey ? payLoad.appKey : ''
                        })(
                            <Input placeholder='请输入'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='APP Secret'>
                        {getFieldDecorator('appSecret', {
                            rules: [{required: true, message: '请输入'},
                                {
                                    validator: (rule, value, callback) => {
                                        let reg = /^[0-9a-zA-Z]+$/;
                                        if (!reg.test(value)) {
                                            value && callback('仅支持数字、英文，区分大小写');
                                        }
                                        callback();
                                    }
                                }, {
                                    max: 50,
                                    message: '输入内容需在50字以内',
                                }],
                            initialValue: payLoad.appSecret ? payLoad.appSecret : ''
                        })(
                            <Input placeholder='请输入'/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(OpeningBanckFormModal)

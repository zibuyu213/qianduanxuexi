import React, {Component} from 'react';

import {Modal, Radio, Form, Input} from 'antd';

class AccountFormModal extends Component {
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
        const FormItem = Form.Item;
        const RadioGroup = Radio.Group;
        const {visible, onOk, onCancel, form, confirmLoading, payload} = this.props;
        const payLoad = payload || {};
        const {getFieldDecorator} = form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 20},
            },
        };
        return (
            <Modal
                visible={visible}
                title='运营方收款账号-银行账号'
                destroyOnClose
                maskClosable={false}
                onOk={onOk}
                onCancel={onCancel}
                bodyStyle={{margin: 20}}
                confirmLoading={confirmLoading}
            >
                <Form>
                    <FormItem {...formItemLayout} label='账号类型'>
                        {getFieldDecorator('accountType', {
                            rules: [{
                                required: true,
                                message: '请选择账号类型',
                            }],
                            initialValue: isFinite(payLoad.accountType) ? payLoad.accountType : ''
                        })(
                            <RadioGroup>
                                <Radio value={0}>企业收款账号</Radio>
                                <Radio value={1}>财政收款账号</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='收款银行'>
                        {getFieldDecorator('beneficiaryBank', {
                            rules: [{required: true, message: '请输入'}, {
                                max: 50,
                                message: '输入内容需在50字以内',
                            }],
                            initialValue: payLoad.beneficiaryBank ? payLoad.beneficiaryBank : ''
                        })(
                            <Input placeholder='请输入'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='收款账号'>
                        {getFieldDecorator('collectAccount', {
                            rules: [{
                                required: true,
                                message: '请输入收款账号',
                            }, {
                                max: 20,
                                message: '输入内容需在20字以内',
                            }],
                            initialValue: payLoad.collectAccount ? payLoad.collectAccount : ''
                        })(
                            <Input placeholder='请输入'/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

const AccountFormModalWrapper = Form.create()(AccountFormModal);
export default AccountFormModalWrapper

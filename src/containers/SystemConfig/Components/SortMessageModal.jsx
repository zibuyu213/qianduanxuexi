import React, {Component} from 'react';

import {Modal, Form, Input} from 'antd';

const FormItem = Form.Item;

class SortMessageModal extends Component {
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
        const {visible, onOk, onCancel, form, payload} = this.props;
        const payLoad = payload || {};
        const {getFieldDecorator} = form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 7},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 17},
            },
        };
        return (
            <Modal
                visible={visible}
                title='短信接口配置'
                destroyOnClose
                maskClosable={false}
                onOk={onOk}
                onCancel={onCancel}
                bodyStyle={{margin: 20}}
                width={700}
            >
                <Form>
                    <FormItem {...formItemLayout} label='用户名(accessKeyId)'>
                        {getFieldDecorator('accessKeyId', {
                            rules: [{
                                required: true,
                                message: '请输入用户名',
                            }, {
                                max: 30,
                                message: '输入内容需在30字以内',
                            }],
                            initialValue: payLoad.accessKeyId ? payLoad.accessKeyId : ''
                        })(
                            <Input placeholder='请输入'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='密码(accessKeySecret)'>
                        {getFieldDecorator('accessKeySecret', {
                            rules: [{required: true, message: '请输入密码'}, {
                                max: 30,
                                message: '输入内容需在30字以内',
                            }],
                            initialValue: payLoad.accessKeySecret ? payLoad.accessKeySecret : ''
                        })(
                            <Input placeholder='请输入'/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='短信签名(SignName)'>
                        {getFieldDecorator('signName', {
                            rules: [{
                                required: true,
                                message: '请输入短信签名',
                            }, {
                                max: 10,
                                message: '输入内容需在10字以内',
                            }],
                            initialValue: payLoad.signName ? payLoad.signName : ''
                        })(
                            <Input placeholder='请输入'/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

const SortMessageModalWrapper = Form.create()(SortMessageModal);
export default SortMessageModalWrapper

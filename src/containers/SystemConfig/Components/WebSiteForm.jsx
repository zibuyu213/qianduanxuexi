import React, {Component} from 'react';

import {Button, Form, Input, Icon, message} from 'antd';

const FormItem = Form.Item;

class WebSiteForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            webSite: Array.isArray(this.props.webSite) ? this.props.webSite : [],
        };
    }

    // 组件挂载之前
    componentWillMount() {
    }

    // 组件挂载后
    componentDidMount() {}

    // 组件卸载之前
    componentWillUnmount() {
    }

    // 添加官网
    addWebSite() {
        let webSite = this.state.webSite;
        if (webSite.length >= 10) {
            message.info('网站最多添加10个', 1.5)
        } else {
            webSite.push('');
            this.setState({
                webSite
            });
        }
    }

    // 移除官网
    removeWebSite(webSiteIndex) {
        let webSite = this.state.webSite;
        webSite.splice(webSiteIndex, 1);
        let formValues = {};
        webSite.forEach((firstItem, firstIndex) => {
            formValues[`webSite${firstIndex}`] = firstItem;
        });
        this.setState({
            webSite
        }, () => {
            const form = this.props.form;
            form.setFieldsValue(formValues);
        })
    }

    // 官网输入框变化
    onWebSiteChange(index, e) {
        let webSite = this.state.webSite;
        webSite[index] = e.target.value;
        this.setState({
            webSite,
        })
    }

    render() {
        const {webSite} = this.state;
        const {getFieldDecorator} = this.props.form;
        return (
            <Form>
                {
                    webSite.map((item, index) => (
                        <FormItem label={index === 0 ? '客服官网' : ''} key={index}>
                            {getFieldDecorator(`webSite${index}`, {
                                validateTrigger: ['onChange', 'onBlur'],
                                rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: "请输入官网",
                                }, {
                                    max: 50,
                                    message: '请输入50位以内'
                                }],
                                initialValue: item
                            })(
                                <Input placeholder="请输入" style={{width: '30%', marginRight: 8}}
                                       onChange={this.onWebSiteChange.bind(this, index)}/>
                            )}
                            {webSite.length > 0 ? (
                                <Icon
                                    className="dynamic-delete-button"
                                    type="minus-circle-o"
                                    onClick={this.removeWebSite.bind(this, index)}
                                />
                            ) : null}
                        </FormItem>
                    ))
                }
                <FormItem>
                    <Button type="dashed"
                            title='网站最多添加10个'
                            onClick={this.addWebSite.bind(this)}
                            style={{width: '30%'}}>
                        <Icon type="plus"/> 添加
                    </Button>
                </FormItem>
            </Form>
        );
    }
}

export default Form.create()(WebSiteForm)

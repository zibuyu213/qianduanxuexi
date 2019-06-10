import React, {Component} from 'react';
import {Button, Form, Input, Icon, Row, Col, message} from 'antd';

const FormItem = Form.Item;

class CustomServiceForm extends Component {
    constructor (props) {
        super(props);
        this.state = {
            customServiceInfo: Array.isArray(this.props.customServiceInfo) ? this.props.customServiceInfo : [],
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

    // 增加区域客服配置
    addCustomService () {
        let customServiceInfo = this.state.customServiceInfo;
        customServiceInfo.push({
            areaName: '',
            tel: ['']
        });
        this.setState({
            customServiceInfo
        })
    }

    // 添加电话
    addPhone (areaNameIndex) {
        let customServiceInfo = this.state.customServiceInfo;
        if (customServiceInfo[areaNameIndex].tel.length >= 5) {
            message.info('单个区域电话最多添加5个', 1.5)
        } else {
            customServiceInfo[areaNameIndex].tel.push('');
            this.setState({
                customServiceInfo
            });
        }
    }

    // 当区域变化
    onAreaNameChange (areaNameIndex, e) {
        let customServiceInfo = this.state.customServiceInfo;
        customServiceInfo[areaNameIndex].areaName = e.target.value;
        this.setState({
            customServiceInfo
        })
    }

    // 当电话变化
    onTelChange (areaNameIndex, TelIndex, e) {
        let customServiceInfo = this.state.customServiceInfo;
        customServiceInfo[areaNameIndex].tel[TelIndex] = e.target.value;
        this.setState({
            customServiceInfo
        })
    }

    // 移除电话
    removePhone (areaNameIndex, TelIndex) {
        let customServiceInfo = this.state.customServiceInfo;
        customServiceInfo[areaNameIndex].tel.splice(TelIndex, 1);
        let formValues = {};
        customServiceInfo.forEach((firstItem, firstIndex) => {
            formValues[`areaName_${firstIndex}`] = firstItem.areaName;
            firstItem.tel.forEach((secondItem, secondIndex) => {
                formValues[`areaName_${firstIndex}-tel_${secondIndex}`] = secondItem
            })
        });
        this.setState({
            customServiceInfo
        }, () => {
            const form = this.props.form;
            form.setFieldsValue(formValues);
        })
    }

    // 移除区域客服
    removeCustomService (areaNameIndex) {
        let customServiceInfo = this.state.customServiceInfo;
        customServiceInfo.splice(areaNameIndex, 1);
        let formValues = {};
        customServiceInfo.forEach((firstItem, firstIndex) => {
            formValues[`areaName_${firstIndex}`] = firstItem.areaName;
            firstItem.tel.forEach((secondItem, secondIndex) => {
                formValues[`areaName_${firstIndex}-tel_${secondIndex}`] = secondItem
            })
        });
        this.setState({
            customServiceInfo
        }, () => {
            const form = this.props.form;
            form.setFieldsValue(formValues);
        })
    }

    render () {
        const { customServiceInfo } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 2 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };

        const formItem = customServiceInfo.map((item, areaNameIndex) =>
            <Row key={`CustomServiceKeys${areaNameIndex}`}>
                <Col span={3}>区域客服配置{areaNameIndex + 1}:</Col>
                <Col span={18}>
                    {/*区域*/}
                    <FormItem
                        {...formItemLayout}
                        label='区域'
                    >
                        {getFieldDecorator(`areaName_${areaNameIndex}`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{
                                required: true,
                                message: "请输入区域",
                            }, {
                                max: 50,
                                message: '请输入50位以内'
                            }],
                            initialValue: item.areaName
                        })(
                            <Input placeholder="请输入" style={{ width: '50%', marginRight: 8 }}
                                   onChange={this.onAreaNameChange.bind(this, areaNameIndex)}/>
                        )}
                        {customServiceInfo.length > 0 ? (
                            <a className="dynamic-delete-a"
                               title={`删除区域客服配置${areaNameIndex + 1}`}
                               onClick={this.removeCustomService.bind(this, areaNameIndex)}
                            >删除</a>
                        ) : null}
                    </FormItem>
                    {/*根据数据生成电话表单*/}
                    {
                        item.tel.map((telItem, TelIndex) => (
                            <Row key={`tel${TelIndex}`}>
                                {TelIndex !== 0 && <Col span={2}/>}
                                <Col>
                                    <FormItem
                                        label={TelIndex === 0 ? '电话' : ''}
                                        {...formItemLayout}
                                    >
                                        {getFieldDecorator(`areaName_${areaNameIndex}-tel_${TelIndex}`, {
                                            validateTrigger: ['onChange', 'onBlur'],
                                            rules: [{
                                                required: true,
                                                whitespace: true,
                                                message: "请输入电话",
                                            }, {
                                                max: 20,
                                                message: '请输入20位以内'
                                            }, {
                                                validator: (rule, value, callback) => {
                                                    let reg = /[\d-+]+$/;
                                                    if (!reg.test(value)) {
                                                        value && callback('请输入正确的电话');
                                                    }
                                                    callback();
                                                }
                                            }],
                                            initialValue: telItem
                                        })(
                                            <Input placeholder="请输入" style={{ width: '50%', marginRight: 8 }}
                                                   onChange={this.onTelChange.bind(this, areaNameIndex, TelIndex)}/>
                                        )}
                                        {item.tel.length > 1 ? (
                                            <Icon
                                                className="dynamic-delete-button"
                                                type="minus-circle-o"
                                                onClick={this.removePhone.bind(this, areaNameIndex, TelIndex)}
                                            />
                                        ) : null}
                                    </FormItem>
                                </Col>
                            </Row>
                        ))
                    }
                    {/*新增电话按钮*/}
                    <FormItem>
                        <Row>
                            <Col xs={{ span: 0 }} sm={{ span: 2 }}/>
                            <Col xs={{ span: 24 }} sm={{ span: 20 }}>
                                <Button type="dashed"
                                        onClick={this.addPhone.bind(this, areaNameIndex)}
                                        title='区域电话最多添加5个'
                                        style={{ width: '50%' }}>
                                    <Icon type="plus"/> 添加电话
                                </Button>
                            </Col>
                        </Row>
                    </FormItem>
                </Col>
            </Row>
        );
        return (
            <Form>
                <FormItem label='区域客服电话' {...formItemLayout}>
                    <Button type="dashed"
                            onClick={this.addCustomService.bind(this)}
                            style={{ width: '50%' }}>
                        <Icon type="plus"/> 添加
                    </Button>
                </FormItem>
                <Row>
                    <Col span={2}/>
                    <Col span={20}>
                        {/*根据数据生成区域配置表单*/}
                        {formItem}
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create()(CustomServiceForm)

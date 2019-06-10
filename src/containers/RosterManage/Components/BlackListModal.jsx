import React, {Component} from 'react';
import {Form, Modal, Input, message, Select, Spin, TreeSelect} from "antd/lib/index";
import {HttpClient} from "../../../common/HttpClient";
import moment from "moment/moment";
import _ from 'lodash';

const FormItem = Form.Item;
const Option = Select.Option;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

class BlackListModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            submitLoading: false,
            visible: this.props.visible,
            stopSectionList: [],
            parkingSelect: [],
        };
    }


    componentWillMount() {

    }

    componentDidMount() {
        this.loadStopSection();
    }

    componentWillReceiveProps(nextProps) {
        const oldVisible = this.props.visible;
        const newVisible = nextProps.visible;
        if (oldVisible !== newVisible) {
            this.setState({
                visible: newVisible,
            });
        }
    }

    /**
     * 加载禁停路段
     */
    loadStopSection() {
        // /parking-resource/admin/resource/parking
        this.setState({
            loading: true,
        });
        HttpClient.query(window.MODULE_PARKING_RESOURCE + `/admin/resource/parking/gets`, "GET", {}, (d, type) => {
            this.state.submitLoading = false;
            if (type == HttpClient.requestSuccess) {
                let childrenData = [];
                _.toArray(d.data).map(item => {
                    const obj = {
                        title: item.parkingName,
                        value: item.id,
                        key: item.id,
                    };
                    childrenData.push(obj)
                });
                this.setState({
                    loading: false,
                    stopSectionList: [{
                        title: '全部',
                        value: 'all',
                        key: 'all',
                        children: childrenData
                    }]
                });
            } else {
                this.setState({
                    loading: false,
                })
            }
        });
    }

    check() {
        if (!this.state.submitLoading) {
            this.state.submitLoading = true;
            this.props.form.validateFields((err, fieldsValue) => {
                if (!err) {
                    let parkingSelect = fieldsValue['forbidSection'];
                    if (this.props.type == 0) {//新建
                        let data = {
                            ...fieldsValue,
                            'forbidSection': parkingSelect.join(','),
                        };
                        HttpClient.query(window.MODULE_PARKING_INFO + `/centerConsole/info/blacklist`, "POST", JSON.stringify(data), (d, type) => {
                            this.state.submitLoading = false;
                            if (type == HttpClient.requestSuccess) {
                                this.setState({
                                    visible: false,
                                });
                                message.success(d.data);
                                this.props.form.resetFields();
                                this.props.onOk();
                            }
                        });

                    } else {
                        let data = {
                            ...fieldsValue,
                            'plateNumber': this.props.data.plateNumber,
                            'forbidSection': parkingSelect.join(','),
                        };
                        HttpClient.query(window.MODULE_PARKING_INFO + `/centerConsole/info/blacklist/${this.props.data.nameId}`, "PUT", JSON.stringify(data), (d, type) => {
                            this.state.submitLoading = false;
                            if (type == HttpClient.requestSuccess) {
                                this.setState({
                                    visible: false,
                                });
                                message.success(d.data);
                                this.props.form.resetFields();
                                this.props.onOk();
                            }
                        });
                    }

                } else {
                    this.state.submitLoading = false;
                }
            });
        }
    }

    cancel() {
        this.props.form.resetFields();
        this.setState({
            visible: false,
            submitLoading: false,
        });
        this.props.onCancel();
    }


    render() {
        const formModalLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 20},
            },
        };
        const {getFieldDecorator} = this.props.form;
        let parkingIds = [];
        _.toArray(this.props.data.forbidSection || []).map(item => {
            parkingIds.push(item.parkingId);
        });
        return (
            <Modal
                title={this.props.type === 0 ? "新建" : "编辑"}
                visible={this.state.visible}
                onOk={this.check.bind(this)}
                onCancel={this.cancel.bind(this)}
                maskClosable={false}
                okText="确 定"
                cancelText="取 消"
            >
                <Spin tip="加载中.." spinning={this.state.loading}>
                    <Form style={{padding: "24px"}}>
                        <FormItem label="姓名" {...formModalLayout} required={true}>
                            {getFieldDecorator(`userName`, {
                                initialValue: this.props.data.userName,
                                rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: '请输入姓名',
                                }, {
                                    max: 20,
                                    message: '输入内容需在20字以内',
                                }],
                            })(
                                <Input placeholder="请输入"/>
                            )}
                        </FormItem>
                        {/*{this.props.type === 0 ?*/}
                        <FormItem label="手机号" {...formModalLayout} required={true}>
                            {getFieldDecorator(`mobile`, {
                                initialValue: this.props.data.mobile,
                                rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: '请输入手机号',
                                }, {
                                    pattern: new RegExp(/^1\d{10}$/),
                                    message: '请输入正确的手机号',
                                }],
                            })(
                                <Input placeholder="请输入"/>
                            )}
                        </FormItem>
                        {/*:<FormItem label="手机号" {...formModalLayout} required={true}>*/}
                        {/*<span>{this.props.data.mobileNumber}</span>*/}
                        {/*</FormItem>*/}
                        {/*}*/}
                        {this.props.type === 0 ?
                            <FormItem label="车牌号" {...formModalLayout} required={true}>
                                {getFieldDecorator(`plateNumber`, {
                                    rules: [{
                                        required: true,
                                        whitespace: true,
                                        message: '请输入车牌号',
                                    }, {
                                        max: 8,
                                        message: '输入内容需在8字以内',
                                    }],
                                })(
                                    <Input placeholder="请输入"/>
                                )}
                            </FormItem> :
                            <FormItem label="车牌号" {...formModalLayout} required={true}>
                                <span>{this.props.data.plateNumber}</span>
                            </FormItem>
                        }
                        <FormItem label="禁停路段" {...formModalLayout} require={true}>
                            {getFieldDecorator(`forbidSection`, {
                                initialValue: parkingIds,
                                rules: [{
                                    type: 'array',
                                    required: true,
                                    whitespace: true,
                                    message: '请选择禁停路段',
                                }],
                            })(
                                <TreeSelect
                                    treeDefaultExpandAll={true}
                                    getPopupContainer={triggerNode => triggerNode.parentNode}
                                    style={{width: '100%'}}
                                    dropdownStyle={{height: 300}}
                                    treeCheckable={true}
                                    showCheckedStrategy={SHOW_PARENT}
                                    placeholder="请选择"
                                    treeData={this.state.stopSectionList}
                                    treeNodeFilterProp='title'
                                />
                            )}
                        </FormItem>
                    </Form>
                </Spin>
            </Modal>
        )
    }


}

export default Form.create()(BlackListModal);

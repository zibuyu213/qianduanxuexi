import React, {Component} from 'react';
import {Form, Modal, Input, Select, message, Spin} from "antd/lib/index";
import {HttpClient} from "../../../common/HttpClient";
import _ from 'lodash';

const FormItem = Form.Item;
const Option = Select.Option;

class PersonModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            submitLoading: false,
            visible: this.props.visible,
            departmentList: [],
            departmentSelect: [],
            roleList: [],
            roleSelect: [],
            modalUserExist: false,//未输入
            modalUserPartner: false,
            modalUserSystem: false,
            modalUserName: "",
            modalUserMobile: "",
            modalUserPassword: "",
        }
    }


    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {
        const oldVisible = this.props.visible;
        const newVisibile = nextProps.visible;
        const oldData = this.props.dataResource;
        const newData = nextProps.dataResource;
        if (newData !== oldData) {
            let roleSelect = [];
            _.toArray(newData.roleIds).map(item => {
                roleSelect.push(item.roleId);

            });
            this.setState({
                roleSelect: roleSelect
            })
        }

        if (oldVisible !== newVisibile) {
            this.setState({
                visible: newVisibile,
            });
            this.loadDepartments();
        }
    }

    componentDidMount() {
        this.loadDepartments();
        this.loadRoles();
    }

    loadDepartments() {
        let searchParams = {
            // pageNum: 1,
            // pageSize: 1000,
        };
        HttpClient.query(window.MODULE_PARKING_INFO + `/centerConsole/info/departmentList`, "GET", searchParams, (d, type) => {
            if (type == HttpClient.requestSuccess) {
                //成功-------在这里做你的数据处理，需要提示的自己加
                this.setState({
                    departmentList: d.data.list,
                })
            }
        });
    }

    loadRoles() {
        let searchParams = {
            // pageNum: 1,
            // pageSize: 1000,
        };
        HttpClient.query(window.MODULE_PARKING_INFO + `/centerConsole/info/roleList`, "GET", searchParams, (d, type) => {
            if (type == HttpClient.requestSuccess) {
                //成功-------在这里做你的数据处理，需要提示的自己加
                this.setState({
                    roleList: d.data.list,
                })
            }
        });
    }

    check() {
        if (this.state.modalUserSystem) {//不可用
            message.error('此账号不可重新创建')
        } else if (!this.state.submitLoading) {
            this.state.submitLoading = true;
            this.props.form.validateFields((err, fieldsValue) => {
                if (!err) {
                    if (this.props.type == 0) {//新建
                        if (this.state.modalUserPartner) {//合作方账号
                            let data = {
                                ...fieldsValue,
                                'mobileNumber': this.state.modalUserMobile,
                                'departmentIds': this.state.departmentSelect.join(','),
                                'roleIds': this.state.roleSelect.join(','),
                            };
                            HttpClient.query(window.MODULE_PARKING_INFO + `/centerConsole/info/bindUserToDepartment`, "POST", JSON.stringify(data), (d, type) => {
                                this.state.submitLoading = false;
                                if (type == HttpClient.requestSuccess) {
                                    this.setState({
                                        visible: false,
                                        modalUserExist: false,//未输入
                                        modalUserPartner: false,
                                        modalUserSystem: false,
                                    });
                                    message.success("新建成功");
                                    this.props.form.resetFields();
                                    this.props.onOk();
                                }
                            });
                        } else {
                            let data = {
                                ...fieldsValue,
                                'departmentIds': this.state.departmentSelect.join(','),
                                'roleIds': this.state.roleSelect.join(','),
                            };
                            HttpClient.query(window.MODULE_PARKING_INFO + `/centerConsole/info/addUser`, "POST", JSON.stringify(data), (d, type) => {
                                this.state.submitLoading = false;
                                if (type == HttpClient.requestSuccess) {
                                    this.setState({
                                        visible: false,
                                        modalUserExist: false,//未输入
                                        modalUserPartner: false,
                                        modalUserSystem: false,
                                    });
                                    message.success("新建成功");
                                    this.props.form.resetFields();
                                    this.props.onOk();
                                }
                            });
                        }
                    } else {
                        let data = {
                            ...fieldsValue,
                            'userId': this.props.dataResource.id,
                            'roleIds': this.state.roleSelect.join(','),
                        };
                        HttpClient.query(window.MODULE_PARKING_INFO + `/centerConsole/info/updateUser`, "POST", JSON.stringify(data), (d, type) => {
                            this.state.submitLoading = false;
                            if (type == HttpClient.requestSuccess) {
                                this.setState({
                                    visible: false,
                                    modalUserExist: false,//未输入
                                    modalUserPartner: false,
                                    modalUserSystem: false,
                                });
                                message.success("修改成功");
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
            loading: false,
            modalUserExist: false,//未输入
            modalUserPartner: false,
            modalUserSystem: false,
            submitLoading: false,
        });
        this.props.onCancel();
    }

    //手机号验证
    PhoneNumberRegex(value) {
        // var phoneReg = /^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
        var phoneReg = /^1\d{10}$/;
        var flag = phoneReg.test(value);
        return flag;
    }

    /**
     * 校验账号
     * @param value
     */
    checkAccount(e) {
        let value = e.target.value;
        if (this.PhoneNumberRegex(value) && value.length === 11) {
            let data = {
                mobile: value,
            };
            this.setState({
                loading: true
            });
            HttpClient.query(window.MODULE_PARKING_INFO + `/admin/partner/getUserName`, "GET", data, (d, type) => {
                if (type == HttpClient.requestSuccess) {
                    this.props.form.resetFields();
                    this.props.form.setFieldsValue(
                        {userPhone: value}
                    );
                    this.setState({
                        loading: false,
                        modalUserExist: true,
                        modalUserPartner: d.data.isPartnerAdmin,//是否是合作方管理员
                        modalUserSystem: d.data.isSystemAdmin,//是否是中台运营方管理员
                        modalUserName: d.data.userName,
                        modalUserMobile: value,
                        // modalUserPassword:d.data.password,
                    })
                }
            });
        } else {
            this.props.form.resetFields();
            this.props.form.setFieldsValue(
                {userPhone: value}
            );
            this.setState({
                modalUserExist: false,
                modalUserPartner: false,//是否是合作方管理员
                modalUserSystem: false,//是否是中台运营方管理员
                modalUserName: "",
            })
        }

    }

    handleDepartmentSelect(value, arr) {
        let select = [];
        arr.map(item => {
            select.push(item.key);
        });
        this.state.departmentSelect = select;
    }

    handleRoleSelect(value, arr) {
        let select = [];
        arr.map(item => {
            select.push(item.key);
        });
        this.state.roleSelect = select;
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
        let roleIds = [];
        _.toArray(this.props.dataResource.roleIds || []).map(item => {
            roleIds.push(item.roleName);

        });
        const {getFieldDecorator} = this.props.form;
        return (
            <Modal
                title={this.props.type === 0 ? "新建人员" : "编辑人员"}
                visible={this.state.visible}
                onOk={this.check.bind(this)}
                onCancel={this.cancel.bind(this)}
                maskClosable={false}
                okText="确 定"
                cancelText="取 消"
            >
                <Spin tip="加载中.." spinning={this.state.loading}>
                    <div style={{padding: "24px"}}>
                        {this.props.type == 0 ?
                            <Form>
                                <FormItem label="手机号" {...formModalLayout} required={true}>
                                    {getFieldDecorator(`userPhone`, {
                                        // initialValue: this.props.initialValue,
                                        rules: [{
                                            required: true,
                                            whitespace: true,
                                            message: '请输入手机号',
                                        }, {
                                            pattern: new RegExp(/^1\d{10}$/),
                                            message: '请输入正确的手机号',
                                        }],
                                    })(
                                        <Input placeholder="请输入" onChange={this.checkAccount.bind(this)}/>
                                    )}
                                </FormItem>
                                {this.state.modalUserExist && !this.state.modalUserPartner && !this.state.modalUserSystem ?//两个管理员都不是
                                    <div>
                                        <div className="partner-modal-tips">
                                            <div className="partner-modal-tips-line"/>
                                            <div className='partner-modal-tips-content'>
                                                新账号，请设置以下信息
                                            </div>
                                            <div className="partner-modal-tips-line"/>
                                        </div>
                                        <FormItem label="人员名称" {...formModalLayout} required={true}>
                                            {getFieldDecorator(`userName`, {
                                                // initialValue: this.props.dataResource.userName || "",
                                                rules: [{
                                                    required: true,
                                                    whitespace: true,
                                                    message: '请输入人员名称',
                                                }, {
                                                    max: 20,
                                                    message: '输入内容需在20字以内',
                                                }],
                                            })(
                                                <Input placeholder="请输入"/>
                                            )}
                                        </FormItem>
                                        <FormItem label="初始密码" {...formModalLayout} required={true}>
                                            {getFieldDecorator(`password`, {
                                                // initialValue: this.props.initialValue,
                                                rules: [{
                                                    required: true,
                                                    whitespace: true,
                                                    message: '请输入初始密码',
                                                }, {
                                                    pattern: new RegExp(/^[0-9a-zA-Z]{6,16}$/),
                                                    message: '密码6-16位,只能包含数字和字母',
                                                }],
                                            })(
                                                <Input placeholder="6-16 位密码，区分大小写"/>
                                            )}
                                        </FormItem>
                                        <FormItem label="所属部门" {...formModalLayout} required={true}>
                                            {getFieldDecorator(`departmentIds`, {
                                                // initialValue: this.props.initialValue,
                                                rules: [{
                                                    type: 'array',
                                                    required: true,
                                                    whitespace: true,
                                                    message: '请选择所属部门',
                                                }],
                                            })(
                                                <Select
                                                    mode="multiple"
                                                    getPopupContainer={triggerNode => triggerNode.parentNode}
                                                    style={{width: '100%'}}
                                                    placeholder="请选择"
                                                    onChange={this.handleDepartmentSelect.bind(this)}
                                                >
                                                    {this.state.departmentList.map((item, i) => {
                                                        return <Option key={item.id}
                                                                       value={item.departmentName}>{item.departmentName}</Option>
                                                    })}
                                                </Select>
                                            )}
                                        </FormItem>
                                        <FormItem label="角色选择" {...formModalLayout}>
                                            {getFieldDecorator(`roleIds`, {
                                                // initialValue: this.props.dataResource.roleIds || [],
                                                rules: [{
                                                    type: 'array',
                                                }],
                                            })(
                                                <Select
                                                    mode="multiple"
                                                    getPopupContainer={triggerNode => triggerNode.parentNode}
                                                    style={{width: '100%'}}
                                                    placeholder="请选择"
                                                    onChange={this.handleRoleSelect.bind(this)}
                                                >
                                                    {this.state.roleList.map((item, i) => {
                                                        return <Option key={item.id}
                                                                       value={item.name}>{item.name}</Option>
                                                    })}
                                                </Select>
                                            )}
                                        </FormItem>
                                    </div>
                                    : this.state.modalUserExist && this.state.modalUserPartner && !this.state.modalUserSystem ?
                                        <div>
                                            <div className="partner-modal-tips">
                                                <div className="partner-modal-tips-line"/>
                                                <div className='partner-modal-tips-content'>
                                                    该账号已存在，账号可用
                                                </div>
                                                <div className="partner-modal-tips-line"/>
                                            </div>
                                            <FormItem label="人员名称" {...formModalLayout} required={true}>
                                                <span>{this.state.modalUserName}</span>
                                            </FormItem>
                                            <FormItem label="所属部门" {...formModalLayout} required={true}>
                                                {getFieldDecorator(`departmentIds`, {
                                                    // initialValue: this.props.initialValue,
                                                    rules: [{
                                                        type: 'array',
                                                        required: true,
                                                        whitespace: true,
                                                        message: '请选择所属部门',
                                                    }],
                                                })(
                                                    <Select
                                                        mode="multiple"
                                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                                        style={{width: '100%'}}
                                                        placeholder="请选择"
                                                        onChange={this.handleDepartmentSelect.bind(this)}
                                                    >
                                                        {this.state.departmentList.map((item, i) => {
                                                            return <Option key={item.id}
                                                                           value={item.departmentName}>{item.departmentName}</Option>
                                                        })}
                                                    </Select>
                                                )}
                                            </FormItem>
                                            <FormItem label="角色选择" {...formModalLayout}>
                                                {getFieldDecorator(`roleIds`, {
                                                    // initialValue: this.props.dataResource.roleIds || [],
                                                    rules: [{
                                                        type: 'array',
                                                    }],
                                                })(
                                                    <Select
                                                        mode="multiple"
                                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                                        style={{width: '100%'}}
                                                        placeholder="请选择"
                                                        onChange={this.handleRoleSelect.bind(this)}
                                                    >
                                                        {this.state.roleList.map((item, i) => {
                                                            return <Option key={item.id}
                                                                           value={item.name}>{item.name}</Option>
                                                        })}
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </div> : this.state.modalUserExist && this.state.modalUserSystem ?
                                            <div className="partner-modal-tips">
                                                <div className="partner-modal-tips-line"/>
                                                <div className='partner-modal-tips-content'>
                                                    该人员已存在，不可新建
                                                </div>
                                                <div className="partner-modal-tips-line"/>
                                            </div> : !this.state.modalUserExist ? null : null
                                }
                            </Form> : <Form>
                                <FormItem label="人员名称" {...formModalLayout} required={true}>
                                    {getFieldDecorator(`userName`, {
                                        initialValue: this.props.dataResource.userName || "",
                                        rules: [{
                                            required: true,
                                            whitespace: true,
                                            message: '请输入人员名称',
                                        }, {
                                            max: 20,
                                            message: '输入内容需在20字以内',
                                        }],
                                    })(
                                        <Input placeholder="请输入"/>
                                    )}
                                </FormItem>
                                <FormItem label="手机号" {...formModalLayout} required={true}>
                                    <span>{this.props.dataResource.mobileNumber}</span>
                                </FormItem>
                                <FormItem label="所属部门" {...formModalLayout} required={true}>
                                    <span>{this.props.dataResource.departmentNames}</span>
                                </FormItem>
                                <FormItem label="角色选择" {...formModalLayout}>
                                    {getFieldDecorator(`roleIds`, {
                                        initialValue: roleIds,
                                        rules: [{
                                            type: 'array',
                                        }],
                                    })(
                                        <Select
                                            mode="multiple"
                                            getPopupContainer={triggerNode => triggerNode.parentNode}
                                            style={{width: '100%'}}
                                            placeholder="请选择"
                                            onChange={this.handleRoleSelect.bind(this)}
                                        >
                                            {this.state.roleList.map((item, i) => {
                                                return <Option key={item.id}
                                                               value={item.name}>{item.name}</Option>
                                            })}
                                        </Select>
                                    )}
                                </FormItem>
                            </Form>
                        }
                    </div>
                </Spin>
            </Modal>
        )
    }

}

export default Form.create()(PersonModal);

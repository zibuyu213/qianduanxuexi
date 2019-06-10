import React, {Component} from 'react';
import {Form, Modal, Input, message} from "antd/lib/index";
import {HttpClient} from "../../../common/HttpClient";

const FormItem = Form.Item;

class DepartmentModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            submitLoading: false,
            visible: this.props.visible
        }
    }


    componentWillMount() {

    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        const oldVisible = this.props.visible;
        const newVisbile = nextProps.visible;
        if (oldVisible !== newVisbile) {
            this.setState({
                visible: newVisbile,
            });
        }
    }

    check() {
        if (!this.state.submitLoading) {
            this.state.submitLoading = true;
            this.props.form.validateFields((err, fieldsValue) => {
                if (!err) {
                    if (this.props.type == 0) {//新建
                        HttpClient.query(window.MODULE_PARKING_INFO + `/centerConsole/info/addDepartment`, "POST", JSON.stringify(fieldsValue), (d, type) => {
                            this.state.submitLoading = false;
                            if (type == HttpClient.requestSuccess) {
                                this.setState({
                                    visible: false,
                                });
                                message.success("新建成功");
                                this.props.form.resetFields();
                                this.props.onOk();
                            }
                        });
                    } else {
                        let data = {
                            departmentId: this.props.departmentId,
                            departmentName: fieldsValue['departmentName'],
                        };
                        HttpClient.query(window.MODULE_PARKING_INFO + `/centerConsole/info/updateDepartment`, "POST", JSON.stringify(data), (d, type) => {
                            this.state.submitLoading = false;
                            if (type == HttpClient.requestSuccess) {
                                this.setState({
                                    visible: false,
                                });
                                message.success("修改成功");
                                this.props.form.resetFields();
                                this.props.onOk();
                            }
                        });
                    }
                }else{
                    this.state.submitLoading = false;
                }
            });
        }
    }

    cancel() {
        this.props.form.resetFields();
        this.setState({
            visible: false,
            submitLoading:false,
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
        return (
            <Modal
                title={this.props.type === 1 ? "编辑部门" : "新建部门"}
                visible={this.state.visible}
                onOk={this.check.bind(this)}
                onCancel={this.cancel.bind(this)}
                maskClosable={false}
                okText="确 定"
                cancelText="取 消"
            >
                <div style={{padding: "24px"}}>
                    <Form>
                        <FormItem label="部门名称" {...formModalLayout} required={true}>
                            {getFieldDecorator(`departmentName`, {
                                initialValue: this.props.departmentName,
                                rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: '请输入部门名称',
                                }, {
                                    max: 20,
                                    message: '输入内容需在20字以内',
                                }],
                            })(
                                <Input placeholder="请输入"/>
                            )}
                        </FormItem>
                    </Form>
                </div>
            </Modal>
        )
    }


}

export default Form.create()(DepartmentModal);
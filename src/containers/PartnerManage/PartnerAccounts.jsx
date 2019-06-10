import React, {Component} from 'react';
import {
    message,
    Modal,
    Form,
    Row,
    Col,
    Button,
    Input,
    Dropdown,
    Select,
    Menu,
    Icon,
    Spin,
    Table,
    Pagination,
    Popconfirm,
    Cascader
} from 'antd';
import {HttpClient} from '../../common/HttpClient.jsx';
import Exception from "../../components/Exception";

const Option = Select.Option;
const FormItem = Form.Item;

//合作方主账号
class PartnerAccounts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            modalEditVisible: false,
            loading: true,
            modalLoading: false,
            pageNum: 1,            // 当前页面
            pageSize: 10,       // 页面条数
            total: 0,          // 总共查询数量
            searchParams: {},
            search: {},
            data: [],
            partnerList: [],//合作方数据
            modalType: 1,//0新建；1修改
            modalPartner: "",
            modalAccount: "",
            modalUserExist: 0,//0：未输入；1：存在旧的，2：新的
            modalMessage: "",
            modalUserName: "",
            modalPassword: "",
            editPartnerUser: "",//编辑框-输入
            editPartnerId: "",
            editPartnerName: "",
            editPartnerAccount: "",
        }
    }


    componentWillMount() {

    }

    componentDidMount() {
        if (window.checkPageEnable('/PartnerAccounts')) {
            this.loadReviewCompanyList();
            this.loadData();
        }
    }

    loadData(page, pageSize, searchData) {
        let params = searchData ? searchData : this.state.search;
        params.pageNum = page ? page : this.state.pageNum;
        params.pageSize = pageSize ? pageSize : this.state.pageSize;
        HttpClient.query(window.MODULE_PARKING_INFO + "/admin/partner", "GET", params, this.configData.bind(this))
    }

    configData(d, type) {
        this.setState({
            loading: false
        });
        if (type == HttpClient.requestSuccess) {
            //成功
            this.setState({
                data: d.data.list,
                total: d.data.total
            })
        }
    }

    //查询条件
    searchChange(name, e) {
        let obj = this.state.searchParams;
        obj[name] = e.target.value;
        this.setState({searchParams: obj});
    }

    //提交查询
    submitQuery(e) {
        // e.preventDefault();
        const params = {...this.state.searchParams};
        this.setState({
            loading: true,
            pageNum: 1,
            search: params
        });
        this.loadData(1, this.state.pageSize, params);
    }

    resetFilter() {
        // this.props.form.resetFields();
        this.setState({
            loading: true,
            pageNum: 1,
            searchParams: {}
        });
        this.loadData(1, this.state.pageSize, {});
    }

    // 分页
    onPageChange(page, pageSize) {
        this.setState({
            pageNum: page,
            pageSize: pageSize
        });
        this.loadData(page, pageSize);
    }

    // 切换页面条数
    onShowSizeChange(page, pageSize) {
        this.setState({
            pageNum: 1,
            pageSize: pageSize
        });
        this.loadData(1, pageSize);
    }

    //获取可用合作方列表---公司无管理员主账号
    loadReviewCompanyList() {
        HttpClient.query(window.MODULE_PARKING_INFO + `/admin/reviewPassCompany`, "GET", {
            isHaveAdminAccount: false
        }, this.fetchCompanyList.bind(this));
    }

    fetchCompanyList(d, type) {
        if (type == HttpClient.requestSuccess) {
            this.setState({
                partnerList: d.data
            })
        }
    }

    /**
     *编辑表单内容
     */
    handleEditPartner() {
        this.setState({
            loading: true,
        });
        let data = {
            id: this.state.editPartnerId,
            editPartnerUser: this.state.editPartnerUser,
        };
        HttpClient.query(window.MODULE_PARKING_INFO + `/`, "POST", data, (d, type) => {
            this.setState({
                loading: false,
            });
            if (type == HttpClient.requestSuccess) {
                //成功-------在这里做你的数据处理
                message.success("操作成功");
                this.loadData();
            }
        });
    }

    //modal
    showModal() {
        this.setState({
            visible: true,
            modalType: 0
        });
    }

    showEditModal(id, name, mobile) {
        this.setState({
            modalCompanyId: id,
            modalCompanyName: name,
            mobile: mobile,
            visible: true,
            modalType: 1,
            modalLoading: false,
            modalUserExist: 0,
        });
    }

    hideModal() {
        this.setState({
            visible: false,
            modalLoading: false,
            modalUserExist: 0,
        });
        this.props.form.resetFields();
    }

    /**
     * modal--选择合作方
     */
    handleChangePartner(value) {
        console.log(value)
    }

    onInputChange(name, e) {
        // let obj = this.state;
        // obj[name] = e.target.value;
        // this.setState(obj);
        this.checkAccount(e.target.value);
    }

    //手机号验证
    PhoneNumberRegex(value) {
        var phoneReg = /^1\d{10}$/;
        var flag = phoneReg.test(value);
        return flag;
    }

    /**
     * 校验账号
     * @param value
     */
    checkAccount(value) {
        // this.props.form.validateFields(['modalMobile'], (errors, values) => {
        //     console.log(errors, values);
        if (this.PhoneNumberRegex(value) && value.length === 11) {
            let data = {
                mobile: value,
            };
            this.setState({
                modalLoading: true
            });
            HttpClient.query(window.MODULE_PARKING_INFO + `/admin/partner/getUserName`, "GET", data, (d, type) => {
                if (type == HttpClient.requestSuccess) {
                    this.props.form.resetFields('modalUserName', 'modalPassword');
                    this.setState({
                        modalLoading: false,
                        modalUserExist: (d.data.isPartnerAdmin || d.data.isSystemAdmin) ? 1 : 2,
                        modalUserName: d.data.userName,
                    })
                }
            });
        } else {
            this.props.form.resetFields('modalUserName', 'modalPassword');
            this.setState({
                modalUserExist: 0,
                modalUserName: "",
            })
        }
        // });
    }

    /**
     * modal确认
     */
    checkModal(e) {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
            if (!err) {
                this.setState({
                    loading: true,
                });
                if (this.state.modalType == 1) {
                    //更换
                    let data = {
                        partnerCompanyId: this.state.modalCompanyId,
                        mobile: fieldsValue['modalMobile'],
                        userName: fieldsValue['modalUserName'] || "",
                        password: fieldsValue['modalPassword'] || "",
                    };
                    HttpClient.query(window.MODULE_PARKING_INFO + `/admin/partner/update`, "PUT", JSON.stringify(data), (d, type) => {
                        if (type == HttpClient.requestSuccess) {
                            this.props.form.resetFields();
                            this.setState({
                                loading: false,
                                modalUserExist: 0,
                                visible: false,
                            });
                            message.success('更换成功');
                            this.loadData(1);
                        }
                    });
                } else {
                    //新建
                    if (this.state.modalUserExist == 2) {//new
                        let data = {
                            partnerCompanyId: fieldsValue['modalPartnerCompanyName'],
                            mobile: fieldsValue['modalMobile'],
                            userName: fieldsValue['modalUserName'],
                            password: fieldsValue['modalPassword'],
                        };
                        // let params="?partnerCompanyId="+data.partnerCompanyId+"&mobile="+data.mobile+"&userName="+data.userName+"&password="+data.password;
                        HttpClient.query(window.MODULE_PARKING_INFO + `/admin/partner`, "POST", JSON.stringify(data), (d, type) => {
                            if (type == HttpClient.requestSuccess) {
                                this.props.form.resetFields();
                                this.setState({
                                    loading: false,
                                    modalUserExist: 0,
                                    visible: false,
                                });
                                message.success('新建成功');
                                this.loadData(1);
                                this.loadReviewCompanyList();
                            }
                        });
                    } else if (this.state.modalUserExist == 1) {//old
                        let data = {
                            partnerCompanyId: fieldsValue['modalPartnerCompanyName'],
                            mobile: fieldsValue['modalMobile'],
                            // userName:fieldsValue['modalUserName'],
                            // password:fieldsValue['modalPassword'],
                        };
                        let params = "?mobile=" + data.mobile + "&partnerCompanyId=" + data.partnerCompanyId;
                        HttpClient.query(window.MODULE_PARKING_INFO + `/admin/partner/connectUserAndpartner` + params, "PUT", {}, (d, type) => {
                            if (type == HttpClient.requestSuccess) {
                                this.props.form.resetFields();
                                this.setState({
                                    loading: false,
                                    modalUserExist: 0,
                                    visible: false,
                                });
                                message.success('新建成功');
                                this.loadData(1);
                                this.loadReviewCompanyList();
                            }
                        });
                    }
                }
                // this.loadData(1, this.state.limit, fieldsValue);
            }
        });

    }

    render() {
        if (!window.checkPageEnable('/PartnerAccounts')) {
            return <Exception type='403'/>;
        }
        const {searchParams} = this.state;
        const {getFieldDecorator} = this.props.form;
        const formMoadlLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 20},
            },
        };

        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19}
        };
        const columns = [{
            title: '合作方',
            dataIndex: 'partnerCompanyName',
        }, {
            title: '主管理员名称',
            dataIndex: 'userName'
        }, {
            title: '登录账号',
            dataIndex: 'mobile',
        },];
        if (window.getPerValue('partnerCompanyAdminConfig')) {
            columns.push({
                title: '操作',
                key: 'action',
                render: (value, row) => (
                    <span>
                        <a onClick={this.showEditModal.bind(this, row.partnerCompanyId, row.partnerCompanyName, row.mobile)}>更换</a>
                    </span>
                )
            })
        }
        return (
            <div className="page">
                <div className="page-header">合作方主账号</div>
                <div className="page-content">

                    {/*查询表单*/}
                    <Form>
                        <Row gutter={46}>
                            <Col span={8}>
                                <FormItem label='合作方' labelCol={{span: 4}}
                                          wrapperCol={{span: 19}}>
                                    <Input placeholder="请输入" value={searchParams.partnerCompanyName}
                                           onChange={this.searchChange.bind(this, 'partnerCompanyName')}/>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='主管理员名称' labelCol={{span: 7}}
                                          wrapperCol={{span: 17}}>
                                    <Input placeholder="请输入" value={searchParams.userName}
                                           onChange={this.searchChange.bind(this, 'userName')}/>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='手机号' labelCol={{span: 5}}
                                          wrapperCol={{span: 19}}>
                                    <Input placeholder="请输入" value={searchParams.mobile}
                                           onChange={this.searchChange.bind(this, 'mobile')}/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={46}>
                            <Col span={8}/>
                            <Col span={8}/>
                            <Col span={8} style={{height: 32, textAlign: 'right', marginBottom: 24}}>
                                <Button type="primary"
                                        onClick={this.submitQuery.bind(this)}>查询</Button>
                                <Button style={{marginLeft: 8}}
                                        onClick={this.resetFilter.bind(this)}>重置</Button>
                            </Col>
                        </Row>
                    </Form>

                    {/*新建页面*/}
                    {window.getPerValue('partnerCompanyAdminConfig') ?
                        <div style={{height: 32, marginBottom: "16px"}}>
                            <Button type="primary" className="partnerList_button_add"
                                    onClick={this.showModal.bind(this)}>
                                <Icon type="plus"/>
                                新建
                            </Button>
                        </div> : null}

                    {/*表格*/}
                    <Spin tip="加载中.." spinning={this.state.loading}>
                        <Table
                            className="partnerList_table"
                            rowKey="partnerCompanyId"
                            columns={columns}
                            dataSource={this.state.data}
                            pagination={false}
                        />

                        {this.state.data && this.state.data.length > 0 ? (
                            <div>
                                <div className="partnerList_table_total">共{this.state.total}条</div>
                                <Pagination
                                    className="partnerList_table_pagination"
                                    showSizeChanger
                                    showQuickJumper
                                    total={this.state.total}
                                    current={this.state.pageNum}
                                    onChange={this.onPageChange.bind(this)}
                                    onShowSizeChange={this.onShowSizeChange.bind(this)}
                                />
                                <div style={{clear: 'both'}}/>
                            </div>
                        ) : ''}
                    </Spin>

                    {/*新建MOdal*/}
                    <Modal
                        title={this.state.modalType === 1 ? "更换主管理员" : "新建"}
                        visible={this.state.visible}
                        onOk={this.checkModal.bind(this)}
                        onCancel={this.hideModal.bind(this)}
                        maskClosable={false}
                        okText="确 定"
                        cancelText="取 消"
                    >
                        <Spin tip="加载中.." spinning={this.state.modalLoading}>
                            <div style={{padding: "24px"}}>
                                <Form>
                                    {this.state.modalType === 1 ?
                                        <FormItem label="合作方" {...formMoadlLayout} required={true}>
                                            <span>{this.state.modalCompanyName}</span>
                                        </FormItem> :
                                        <FormItem {...formMoadlLayout} label="合作方" required={true}>
                                            {getFieldDecorator(`modalPartnerCompanyName`, {
                                                // initialValue: formData.partnerCompanyName,
                                                rules: [{
                                                    required: true,
                                                    message: '请选择合作方',
                                                }],
                                            })(
                                                <Select
                                                    showSearch
                                                    placeholder="请选择"
                                                    getPopupContainer={triggerNode => triggerNode.parentNode}
                                                    optionFilterProp="children"
                                                    onChange={this.handleChangePartner.bind(this)}
                                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                >
                                                    {this.state.partnerList.map((item, i) => {
                                                        return <Option value={item.id + ""} key={i}>
                                                            {item.partnerCompanyName}
                                                        </Option>
                                                    })}
                                                </Select>
                                            )}
                                        </FormItem>}

                                    <FormItem label="登录账号" {...formMoadlLayout} required={true}>
                                        {getFieldDecorator(`modalMobile`, {
                                            rules: [{
                                                required: true,
                                                whitespace: true,
                                                message: '请输入登录账号',
                                            }, {
                                                pattern: new RegExp(/^1\d{10}$/),
                                                message: '请输入正确的登录手机号',
                                            }],
                                        })(
                                            <Input placeholder="请输入"
                                                   onChange={this.onInputChange.bind(this, "mobile")}/>
                                        )}
                                    </FormItem>
                                    {this.state.modalUserExist === 2 ?
                                        <div>
                                            <div className="partner-modal-tips">
                                                <div className="partner-modal-tips-line"/>
                                                <div className='partner-modal-tips-content'>
                                                    新账号，请设置以下信息
                                                </div>
                                                <div className="partner-modal-tips-line"/>
                                            </div>
                                            <FormItem label="用户名称" {...formMoadlLayout} required={true}>
                                                {getFieldDecorator(`modalUserName`, {
                                                    rules: [{
                                                        required: true,
                                                        whitespace: true,
                                                        message: '请输入用户名称',
                                                    }, {
                                                        max: 20,
                                                        message: '输入内容需在20字以内',
                                                    }],
                                                })(
                                                    <Input placeholder="请输入"/>
                                                )}
                                            </FormItem>
                                            <FormItem label="初始密码" {...formMoadlLayout} required={true}>
                                                {getFieldDecorator(`modalPassword`, {
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
                                        </div> : this.state.modalUserExist === 1 ?
                                            <div>
                                                <div className="partner-modal-tips">
                                                    <div className="partner-modal-tips-line"/>
                                                    <div className='partner-modal-tips-content'>
                                                        该账号已存在，账号可用
                                                    </div>
                                                    <div className="partner-modal-tips-line"/>
                                                </div>
                                                <FormItem label="用户名称" {...formMoadlLayout} required={true}>
                                                    <div>{this.state.modalUserName}</div>
                                                </FormItem>
                                            </div> : null
                                    }
                                </Form>
                            </div>
                        </Spin>
                    </Modal>
                </div>
            </div>
        )
    }


}

export default Form.create()(PartnerAccounts);

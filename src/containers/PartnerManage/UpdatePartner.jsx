import React, {Component} from 'react';
import {
    Row,
    Col,
    Card,
    Form,
    Button,
    Input,
    Upload,
    DatePicker,
    Icon,
    Radio,
    Select,
    message,
    Spin,
    Cascader,
    Badge,
    Modal
} from 'antd';
import moment from 'moment';

//请求
import {HttpClient} from '../../common/HttpClient.jsx';
//其他
import {TimeUtils, Global} from '../../common/SystemFunction.jsx';
//上传
import {getUploadObj} from '../../common/UploadFn.jsx';
//省市区
// import ChinaRegion from "../../Components/ChinaRegion";
//css
import './Style/PartnerListContainer.css';
import ChinaRegion from "../../components/ChinaRegion";
import Exception from "../../components/Exception";
import _ from 'lodash';
import NewPartner from "./NewPartner";

const {TextArea} = Input;
const {RangePicker} = DatePicker;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const dateFormat = 'YYYY-MM-DD';

//编辑合作方
class UpdatePartner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyId: this.props.location.query.id,
            loading: true,
            checkModalVisible: false,//查看modal
            formData: {
                companyId: null,
                reviewTime: null,
                reviewState: 2,// 0：待审核 1：通过 2：不通过
                adminUserName: "",//审核人员
                failReason: "",
                partnerCompanyName: "",//公司名:
                business: "",//所属行业:
                partnerCompanyTel: "",//公司电话:
                partnerCompanyEmail: "",//公司邮箱:
                registrationAuthority: "",//登记机关:
                registeredCapital: "",//注册资本:
                provinceId: 0,//行政区域：省：
                cityId: 0,//市：
                areaId: 0,//区县：
                businessStatus: 1,//经营状态 0:停用 1：启用
                englishName: "",//英文名：
                actualPayCapital: "",//实缴资本：
                establishment: null,//成立日期：
                staffSize: "",//人员规模：
                unifiedSocialCreditCode: "",//统一社会信用代码：
                participantNumber: "",//参保人数：
                taxpayerIdentNumber: "",//纳税人识别号：
                deadline: "",//营业期限：
                registrationNumber: "",//注册号：
                organizationCode: "",//组织机构代码：
                partnerCompanyType: "",//公司类型：
                address: "",//企业地址：
                businessScope: "",//经营范围：
                licenseUrl: "",//营业执照：
                principalName: "",//负责人名：
                principalGender: "0",//性别：0：男 1：女 2 未知
                principalTel: "",//负责人电话：
                principalPhone: "",//负责人手机号：
                principalAge: null,//负责人年龄：
                principalIdNo: "",//负责人身份证：
                principal_department: "",//负责人部门：
                principalAddress: "",//负责人地址：
                accountName: "",//以下为结算信息-- 账户名：
                account_no: "",//账户账号：
                bankName: "",//开户银行：
                bankNo: "",//银行账号：
                payNoWx: "",//微信账号：
                payNoALi: "",//支付宝账号：
                contractTime: null,//以下为合同信息--    合同签约时间：
                contractPhotoUrl: "",//合同图片：
            },
            previewVisible: false,
            previewImage: '',
            fileList: [],
            canLicenseUpload: true,
            contractFileList: [],//合同
            options: []
        }
    }


    componentWillMount() {

    }


    componentDidMount() {
        if (window.checkPageEnable('partnerCompanyAdd')) {
            this.uploadObj = new getUploadObj({root: 'triplego_parking_manage_partner'});
            this.loadData();
        }
    }

    loadData() {
        let companyId = this.state.companyId;
        HttpClient.query(window.MODULE_PARKING_INFO + `/admin/company/${companyId}`, "GET", null, this.configDetailData.bind(this));
    }

    // 获取行政区回调
    regionData(d, type) {
        if (type == HttpClient.requestSuccess) {
            //成功-------在这里做你的数据处理，需要提示的自己加
            this.setState({
                options: d.data,
            })
        } else {
            //失败----做除了报错之外的操作
        }
    }

    /**
     * 接口回调--详情
     * @param d
     * @param type
     */
    configDetailData(d, type) {
        if (type == HttpClient.requestSuccess) {
            //成功-------在这里做你的数据处理
            let fileList = d.data.licenseUrl.length > 0 ? [
                {
                    uid: '-1',
                    name: this.getItemFileName(d.data.licenseUrl),
                    status: 'done',
                    url: d.data.licenseUrl,
                }
            ] : [];
            let contractFileList = d.data.contractPhotoUrl.length > 0 ? [
                {
                    uid: '-1',
                    name: this.getItemFileName(d.data.contractPhotoUrl),
                    status: 'done',
                    url: d.data.contractPhotoUrl,
                }
            ] : [];
            this.setState({
                loading: false,
                formData: d.data,
                fileList,
                contractFileList
            });
        } else {
            this.setState({
                loading: false
            });
        }
    }

    /**
     *获取文件名
     */
    getItemFileName(url) {
        let arr = _.toString(url).split('/');
        return arr[arr.length - 1];
    }

    showCheckModal() {
        this.setState({
            checkModalVisible: true,
        });
    }

    hideModal() {
        this.setState({
            checkModalVisible: false
        });
    }

    /**
     * 合作方状态
     */
    onStateChange(e) {
        this.props.form.setFieldsValue({
            businessStatus: e.target.value,
        });
    }

    /**
     * 行政区域
     * @param value
     */
    onZoomChange(arr) {
        this.props.form.setFieldsValue({
            provinceId: arr[0],
            cityId: arr[1],
            areaId: arr[2],
        });
    }


    /**
     * 提交
     */
    submit() {
        if (!this.state.loading) {
            this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
                if (!err) {
                    this.setState({
                        loading: true
                    });
                    const rangeValue = fieldsValue['deadline'];
                    const values = {
                        ...fieldsValue,
                        'companyId': this.state.companyId,
                        'reviewState': 0,//重新审核
                        'establishment': fieldsValue['establishment'].format(dateFormat),//date-picker
                        'contractTime': fieldsValue['contractTime'].format(dateFormat),//date-picker
                        'startDate': rangeValue[0].format(dateFormat),//range-picker-start
                        'endDate': rangeValue[1].format(dateFormat),//range-picker-end
                        // 'registeredCapital': parseInt(fieldsValue['registeredCapital']),
                        // 'actualPayCapital': parseInt(fieldsValue['actualPayCapital']),
                        'provinceId': fieldsValue['zoom'][0],
                        'cityId': fieldsValue['zoom'][1],
                        'areaId': fieldsValue['zoom'][2],
                    };
                    let data = JSON.stringify(values);
                    HttpClient.query(window.MODULE_PARKING_INFO + '/admin/company/' + this.state.companyId, 'PUT', data, (d, type) => {
                        this.setState({
                            loading: false
                        });
                        if (type == HttpClient.requestSuccess) {
                            //成功-------在这里做你的数据处理
                            message.success("修改成功");
                            setTimeout(function () {
                                window.location.history.back(-1);
                            }, 1000);
                        }

                    })
                }
            });
        }
    }

    handleCancel() {
        this.setState({previewVisible: false});
    }

    handlePreview(file) {
        if (file.type == "application/pdf") {
            window.open(file.response.data || file.url);
        } else {
            this.setState({
                previewImage: file.url || file.response.data,
                previewVisible: true,
            });
        }
    }

    handleRemove(file) {
        this.props.form.setFieldsValue({
            licenseUrl: "",
        });
        this.setState({fileList: []});
    }

    handleContractRemove(file) {
        this.props.form.setFieldsValue({
            contractPhotoUrl: "",
        });
        this.setState({contractFileList: []});
    }

    handleFileChange({file, fileList}) {
        if (this.state.canLicenseUpload) {
            if (file.status === "done") {
                this.props.form.setFieldsValue({
                    licenseUrl: file.response.data,
                });
            }
            this.setState({fileList});
        } else {
            setTimeout(() => {
                this.props.form.setFieldsValue({
                    licenseUrl: "",
                });
                this.setState({fileList: []});
            }, 500)
        }
    }

    handleContractFileChange({file, fileList}) {
        if (this.state.canLicenseUpload) {
            if (file.status === "done") {
                this.props.form.setFieldsValue({
                    contractPhotoUrl: file.response.data,
                });
            }
            this.setState({contractFileList: fileList});
        } else {
            setTimeout(() => {
                this.props.form.setFieldsValue({
                    contractPhotoUrl: "",
                });
                this.setState({contractFileList: []});
            }, 500)
        }
    }

    beforeUpload(file) {
        console.log('beforeUpload:' + file.size / 1024 / 1024 + "MB");
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (file.type === "image/jpg" || file.type === "image/jpeg" || file.type === "image/png") {//类型确认
            if (isLt5M) {
                this.state.canLicenseUpload = true;
                return true;
            } else {//大小确认
                message.error('图片大小需小于5MB!');
                this.state.canLicenseUpload = false;
                return false;
            }
        } else {
            message.error('类型错误');
            this.state.canLicenseUpload = false;
            return false;
        }
    };

    beforeUploadCheckPDF(file) {
        if (file.type === "application/pdf") {
            this.state.canLicenseUpload = true;
            return true;
        } else {
            message.error('类型错误');
            this.state.canLicenseUpload = false;
            return false;
        }
    }

    uploadOss(e) {
        console.log(".....");
        this.uploadObj.getPromise(() => {
            this.uploadObj.setOption({
                success: response => {
                    e.onSuccess(response);
                    console.log('success', response);
                    // message.success("上传OSS成功");
                },
                error: (err, response) => {
                    e.onError(err, response, e.file);
                    console.log('onError', err, response);
                    message.error("上传OSS失败，请重试");
                }
            });
            this.uploadObj.uploadToOSS(e.file, e.onProgress);
        });
    }

    render() {
        if (!window.checkPageEnable('partnerCompanyAdd')) {
            return <Exception type='403'/>;
        }
        const {formData, previewVisible, previewImage, fileList, contractFileList, options} = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">添加附件</div>
            </div>
        );
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                <Modal
                    title="查看审核"
                    visible={this.state.checkModalVisible}
                    onCancel={this.hideModal.bind(this)}
                    footer={null}
                >
                    <div style={{padding: "24px", lineHeight: "30px"}}>
                        <div style={{display: "flex"}}>
                            <div style={{width: 80, textAlign: "right"}}>审核状态：</div>
                            <div>{formData.reviewState == 1 ? '通过' : '拒绝'}</div>
                        </div>
                        {formData.reviewState == 2 ?
                            <div style={{display: "flex"}}>
                                <div style={{minWidth: 80, textAlign: "right"}}>拒绝原因：</div>
                                <div style={{maxWidth: 400}}>{formData.failReason}</div>
                            </div> : null}
                        <div style={{display: "flex"}}>
                            <div style={{width: 80, textAlign: "right"}}>审核人员：</div>
                            <div>{formData.adminUserName}</div>
                        </div>
                        <div style={{display: "flex"}}>
                            <div style={{width: 80, textAlign: "right"}}>审核时间：</div>
                            <div>{formData.reviewTime}</div>
                        </div>
                    </div>
                </Modal>
                <div className="page">
                    <div className="page-header">
                        <div className="partner-detail-header" style={{position: "relative"}}>
                            编辑合作方
                            <div style={{float: "right", textAlign: "right", width: 100}}>
                                <Button type='default' className="partnerList_search_button"
                                        style={{verticalAlign: "bottom"}}
                                        onClick={this.showCheckModal.bind(this)}>查 看</Button>
                            </div>
                            <div style={{
                                position: "absolute",
                                width: 100,
                                textAlign: "right",
                                right: 100,
                                bottom: 0
                            }}>
                                <div className="partnerDetail-state-title">状态</div>
                                <span className="partnerDetail-state-dot"><Badge status="error"/></span>
                                <span>审核失败</span>
                            </div>
                        </div>
                    </div>
                    <Spin tip="加载中.." spinning={this.state.loading}>
                        <Form className="page-content page-content-transparent" onSubmit={this.submit.bind(this)}>
                            <Card title="工商信息" bordered={false}>
                                <div>
                                    <Row gutter={32}>
                                        <Col span={8}>
                                            <FormItem label="公司名称：" required={true}>
                                                {getFieldDecorator(`partnerCompanyName`, {
                                                    initialValue: formData.partnerCompanyName,
                                                    rules: [{
                                                        required: true,
                                                        whitespace: true,
                                                        message: '请输入公司名称',
                                                    }, {
                                                        max: 20,
                                                        message: '输入内容需在20字以内',
                                                    }],
                                                })(
                                                    <Input placeholder="请输入"/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label="所属行业：" required={true}>
                                                {getFieldDecorator(`business`, {
                                                    initialValue: formData.business,
                                                    rules: [{
                                                        required: true,
                                                        whitespace: true,
                                                        message: '请输入所属行业',
                                                    }, {
                                                        max: 20,
                                                        message: '输入内容需在20字以内',
                                                    }],
                                                })(
                                                    <Input placeholder="请输入"/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label="合作方状态：" required={true} style={{height: "70px"}}>
                                                {getFieldDecorator(`businessStatus`, {
                                                    initialValue: formData.businessStatus,
                                                    rules: [],
                                                })(
                                                    <RadioGroup onChange={this.onStateChange.bind(this)}>
                                                        <Radio value={1} style={{marginRight: "100px"}}>启用</Radio>
                                                        <Radio value={0}>停用</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={32}>
                                        <Col span={8}>
                                            <FormItem label="公司电话：" required={true}>
                                                {getFieldDecorator(`partnerCompanyTel`, {
                                                    initialValue: formData.partnerCompanyTel,
                                                    rules: [{
                                                        required: true,
                                                        whitespace: true,
                                                        message: '请输入公司电话',
                                                    }, {
                                                        max: 20,
                                                        message: '输入内容需在20字以内',
                                                    }],
                                                })(
                                                    <Input placeholder="请输入"/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label="公司邮箱：" required={true}>
                                                {getFieldDecorator(`partnerCompanyEmail`, {
                                                    initialValue: formData.partnerCompanyEmail,
                                                    rules: [{
                                                        required: true,
                                                        whitespace: true,
                                                        message: '请输入公司邮箱',
                                                    }, {
                                                        max: 30,
                                                        message: '输入内容需在30字以内',
                                                    }, {
                                                        type: 'email', message: '输入邮箱的类型错误'
                                                    }],
                                                })(
                                                    <Input placeholder="请输入"/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label="登记机关：" required={true}>
                                                {getFieldDecorator(`registrationAuthority`, {
                                                    initialValue: formData.registrationAuthority,
                                                    rules: [{
                                                        required: true,
                                                        whitespace: true,
                                                        message: '请输入登记机关',
                                                    }, {
                                                        max: 50,
                                                        message: '输入内容需在50字以内',
                                                    }],
                                                })(
                                                    <Input placeholder="请输入"/>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={32}>
                                        <Col span={8}>
                                            <FormItem label="注册资本：" required={true}>
                                                {getFieldDecorator(`registeredCapital`, {
                                                    initialValue: formData.registeredCapital,
                                                    rules: [{
                                                        required: true,
                                                        whitespace: true,
                                                        message: '请输入注册资本',
                                                    }, {
                                                        max: 10,
                                                        message: '输入内容需在10字以内',
                                                    }, {
                                                        pattern: new RegExp("(^[1-9]\\d*$)"),
                                                        message: '请输入正整数',
                                                    }],
                                                })(
                                                    <Input placeholder="请输入" addonAfter="万元"/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label="行政区域：" required={true}>
                                                {getFieldDecorator('zoom', {
                                                    initialValue: [formData.provinceId, formData.cityId, formData.areaId],
                                                    rules: [{
                                                        required: true,
                                                        message: '请选择行政区域'
                                                    }, {
                                                        type: 'array',
                                                        message: '数组'
                                                    }
                                                    ],
                                                })(
                                                    <ChinaRegion placeholder="省/市/区，县"
                                                                 onChange={this.onZoomChange.bind(this)}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label="英文名：">
                                                {getFieldDecorator(`englishName`, {
                                                    initialValue: formData.englishName,
                                                    rules: [{
                                                        max: 50,
                                                        message: '输入内容需在50字以内',
                                                    }],
                                                })(
                                                    <Input placeholder="请输入"/>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={32}>
                                        <Col span={8}>
                                            <FormItem label="实缴资本：">
                                                {getFieldDecorator(`actualPayCapital`, {
                                                    initialValue: formData.actualPayCapital,
                                                    rules: [, {
                                                        max: 10,
                                                        message: '输入内容需在10字以内',
                                                    }, {
                                                        pattern: new RegExp("(^[1-9]\\d*$)"),
                                                        message: '请输入正整数',
                                                    }],
                                                })(
                                                    <Input placeholder="请输入" addonAfter="万元"/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label="成立日期：" required={true}>
                                                {getFieldDecorator(`establishment`, {
                                                    initialValue: moment(formData.establishment, dateFormat),
                                                    rules: [{
                                                        required: true,
                                                        message: '请选择成立日期',
                                                    }],
                                                })(
                                                    <DatePicker style={{width: "100%"}}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label="人员规模：" required={true}>
                                                {getFieldDecorator(`staffSize`, {
                                                    initialValue: formData.staffSize,
                                                    rules: [{
                                                        required: true,
                                                        whitespace: true,
                                                        message: '请输入人员规模',
                                                    }, {
                                                        max: 10,
                                                        message: '输入内容需在10字以内',
                                                    }, {
                                                        pattern: new RegExp("(^[1-9]\\d*$)"),
                                                        message: '请输入正整数',
                                                    }],
                                                })(
                                                    <Input placeholder="请输入"/>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={32}>
                                        <Col span={8}>
                                            <FormItem label="统一社会信用代码：" required={true}>
                                                {getFieldDecorator(`unifiedSocialCreditCode`, {
                                                    initialValue: formData.unifiedSocialCreditCode,
                                                    rules: [{
                                                        required: true,
                                                        whitespace: true,
                                                        message: '请输入统一社会信用代码',
                                                    }, {
                                                        max: 18,
                                                        message: '输入内容需在18字以内',
                                                    }, {
                                                        pattern: new RegExp(/^[0-9a-zA-Z]+$/),
                                                        message: '仅可输入数字与英文',
                                                    }],
                                                })(
                                                    <Input placeholder="请输入"/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label="参保人数：" required={true}>
                                                {getFieldDecorator(`participantNumber`, {
                                                    initialValue: _.toString(formData.participantNumber),
                                                    rules: [{
                                                        required: true,
                                                        whitespace: true,
                                                        message: '请输入参保人数',
                                                    }, {
                                                        max: 10,
                                                        message: '输入内容需在10字以内',
                                                    }, {
                                                        pattern: new RegExp("^[1-9]\\d*$"),
                                                        message: '请输入正整数',
                                                    }],
                                                })(
                                                    <Input placeholder="请输入"/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label="纳税人识别号：" required={true}>
                                                {getFieldDecorator(`taxpayerIdentNumber`, {
                                                    initialValue: formData.taxpayerIdentNumber,
                                                    rules: [{
                                                        required: true,
                                                        whitespace: true,
                                                        message: '请输入纳税人识别号',
                                                    }, {
                                                        pattern: new RegExp("^[A-Za-z0-9]+$"),
                                                        message: '仅可输入数字与英文',
                                                    }, {
                                                        max: 20,
                                                        message: '输入内容需在20字以内',
                                                    }],
                                                })(
                                                    <Input placeholder="请输入"/>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={32}>
                                        <Col span={8}>
                                            <FormItem label="营业期限：" required={true}>
                                                {getFieldDecorator(`deadline`, {
                                                    initialValue: formData.startDate && formData.endDate ?
                                                        [moment(formData.startDate, dateFormat), moment(formData.endDate, dateFormat)] : null,
                                                    rules: [{
                                                        required: true,
                                                        message: '请输入营业期限',
                                                    }],
                                                })(
                                                    <RangePicker style={{width: "100%"}}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label="注册号：" required={true}>
                                                {getFieldDecorator(`registrationNumber`, {
                                                    initialValue: formData.registrationNumber,
                                                    rules: [{
                                                        required: true,
                                                        whitespace: true,
                                                        message: '请输入注册号',
                                                    }, {
                                                        max: 18,
                                                        message: '输入内容需在18字以内',
                                                    }, {
                                                        pattern: new RegExp("^[A-Za-z0-9]+$"),
                                                        message: '仅可输入数字与英文',
                                                    }],
                                                })(
                                                    <Input placeholder="请输入"/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label="组织机构代码：" required={true}>
                                                {getFieldDecorator(`organizationCode`, {
                                                    initialValue: formData.organizationCode,
                                                    rules: [{
                                                        required: true,
                                                        whitespace: true,
                                                        message: '请输入组织机构代码',
                                                    }, {
                                                        max: 18,
                                                        message: '输入内容需在18字以内',
                                                    }, {
                                                        pattern: new RegExp("^[A-Za-z0-9]+$"),
                                                        message: '仅可输入数字与英文',
                                                    }],
                                                })(
                                                    <Input placeholder="请输入"/>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={32}>
                                        <Col span={8}>
                                            <FormItem label="公司类型：" required={true}>
                                                {getFieldDecorator(`partnerCompanyType`, {
                                                    initialValue: formData.partnerCompanyType,
                                                    rules: [{
                                                        required: true,
                                                        whitespace: true,
                                                        message: '请输入公司类型',
                                                    }, {
                                                        max: 20,
                                                        message: '输入内容需在20字以内',
                                                    }],
                                                })(
                                                    <Input placeholder="请输入"/>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </div>
                                <div style={{width: "50%"}}>
                                    <FormItem label="企业地址：" required={true}>
                                        {getFieldDecorator(`address`, {
                                            initialValue: formData.address,
                                            rules: [{
                                                required: true,
                                                whitespace: true,
                                                message: '请输入企业地址',
                                            }, {
                                                max: 50,
                                                message: '输入内容需在50字以内',
                                            }],
                                        })(
                                            <Input placeholder="请输入"/>
                                        )}
                                    </FormItem>
                                </div>
                                <div style={{width: "50%"}}>
                                    <FormItem label="经营范围：" required={true}>
                                        {getFieldDecorator(`businessScope`, {
                                            initialValue: formData.businessScope,
                                            rules: [{
                                                required: true,
                                                whitespace: true,
                                                message: '请输入经营范围',
                                            }, {
                                                max: 500,
                                                message: '输入内容需在500字以内',
                                            }],
                                        })(
                                            <TextArea rows={4} placeholder="请输入经营范围"/>
                                        )}
                                    </FormItem>
                                </div>
                                <div>
                                    <FormItem label='营业执照'>
                                        {getFieldDecorator(`licenseUrl`, {
                                            initialValue: formData.licenseUrl,
                                            rules: [{
                                                required: true,
                                                message: '请选择',
                                            }],
                                        })(
                                            <div className="flex flex-direction-column">
                                                <Upload
                                                    customRequest={this.uploadOss.bind(this)}
                                                    listType="picture-card"
                                                    fileList={fileList}
                                                    accept="image/jpg,image/jpeg,image/png"
                                                    beforeUpload={this.beforeUpload.bind(this)}
                                                    onPreview={this.handlePreview.bind(this)}
                                                    onChange={this.handleFileChange.bind(this)}
                                                    onRemove={this.handleRemove.bind(this)}
                                                >
                                                    {fileList.length >= 1 ? null : uploadButton}
                                                </Upload>
                                                <div className="flex">支持文件格式：jpg，png。
                                                    文件大小不可超过5MB
                                                </div>
                                                <Modal visible={previewVisible} footer={null}
                                                       onCancel={this.handleCancel.bind(this)}>
                                                    <img alt="error" style={{width: '100%'}} src={previewImage}/>
                                                </Modal>
                                            </div>
                                        )}
                                    </FormItem>
                                </div>
                            </Card>
                            <Card title="合作方结算信息" bordered={false}>
                                <Row gutter={32}>
                                    <Col span={8}>
                                        <FormItem label="账户名称：" required={true}>
                                            {getFieldDecorator(`accountName`, {
                                                initialValue: formData.accountName,
                                                rules: [{
                                                    required: true,
                                                    whitespace: true,
                                                    message: '请输入账户名称',
                                                }, {
                                                    max: 20,
                                                    message: '输入内容需在20字以内',
                                                }],
                                            })(
                                                <Input placeholder="请输入"/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem label="开户银行：" required={true}>
                                            {getFieldDecorator(`bankName`, {
                                                initialValue: formData.bankName,
                                                rules: [{
                                                    required: true,
                                                    whitespace: true,
                                                    message: '请输入开户银行名称',
                                                }, {
                                                    max: 30,
                                                    message: '输入内容需在30字以内',
                                                }],
                                            })(
                                                <Input placeholder="请输入"/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem label="银行账号：" required={true}>
                                            {getFieldDecorator(`bankNo`, {
                                                initialValue: formData.bankNo,
                                                rules: [{
                                                    required: true,
                                                    whitespace: true,
                                                    message: '请输入银行账号',
                                                }, {
                                                    max: 20,
                                                    message: '输入内容需在20字以内',
                                                }, {
                                                    pattern: new RegExp("^[0-9]\\d*$"),
                                                    message: '仅可输入数字',
                                                }],
                                            })(
                                                <Input placeholder="请输入"/>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={32}>
                                    <Col span={8}>
                                        <FormItem label="第三方支付-微信：" required={true}>
                                            {getFieldDecorator(`payNoWx`, {
                                                initialValue: formData.payNoWx,
                                                rules: [{
                                                    required: true,
                                                    whitespace: true,
                                                    message: '请输入微信账户名称',
                                                }, {
                                                    max: 30,
                                                    message: '输入内容需在30字以内',
                                                }],
                                            })(
                                                <Input placeholder="请输入"/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem label="第三方支付-支付宝：" required={true}>
                                            {getFieldDecorator(`payNoAli`, {
                                                initialValue: formData.payNoAli,
                                                rules: [{
                                                    required: true,
                                                    whitespace: true,
                                                    message: '请输入支付宝账户名称',
                                                }, {
                                                    max: 30,
                                                    message: '输入内容需在30字以内',
                                                }],
                                            })(
                                                <Input placeholder="请输入"/>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Card>
                            <Card title="负责人信息" bordered={false}>
                                <Row gutter={32}>
                                    <Col span={8}>
                                        <FormItem label="姓名：" required={true}>
                                            {getFieldDecorator(`principalName`, {
                                                initialValue: formData.principalName,
                                                rules: [{
                                                    required: true,
                                                    whitespace: true,
                                                    message: '请输入负责人姓名',
                                                }, {
                                                    max: 20,
                                                    message: '输入内容需在20字以内',
                                                }],
                                            })(
                                                <Input placeholder="请输入"/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem label="性别：" required={true}>
                                            {getFieldDecorator(`principalGender`, {
                                                initialValue: formData.principalGender + "",
                                                rules: [{
                                                    required: true,
                                                    message: '请选择性别',
                                                }],
                                            })(
                                                <Select>
                                                    <Option value="0">男</Option>
                                                    <Option value="1">女</Option>
                                                    <Option value="2">未知</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem label="电话：" required={true}>
                                            {getFieldDecorator(`principalTel`, {
                                                initialValue: formData.principalTel,
                                                rules: [{
                                                    required: true,
                                                    whitespace: true,
                                                    message: '请输入电话',
                                                }, {
                                                    max: 20,
                                                    message: '输入内容需在20字以内',
                                                }],
                                            })(
                                                <Input placeholder="请输入"/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem label="手机号码：" required={true}>
                                            {getFieldDecorator(`principalPhone`, {
                                                initialValue: formData.principalPhone,
                                                rules: [{
                                                    required: true,
                                                    whitespace: true,
                                                    message: '请输入手机号码',
                                                }, {
                                                    pattern: new RegExp("^1\\d{10}$"),
                                                    message: '请输入正确的手机号',
                                                }],
                                            })(
                                                <Input placeholder="请输入"/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem label="年龄：" required={true}>
                                            {getFieldDecorator(`principalAge`, {
                                                initialValue: _.toString(formData.principalAge),
                                                rules: [{
                                                    required: true,
                                                    whitespace: true,
                                                    message: '请输入年龄',
                                                }, {
                                                    pattern: new RegExp("^(\\d|[1-9]\\d|100)$"),
                                                    message: '请输入0～100的整数',
                                                }],
                                            })(
                                                <Input placeholder="请输入"/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem label="身份证号码：" required={true}>
                                            {getFieldDecorator(`principalIdNo`, {
                                                initialValue: formData.principalIdNo,
                                                rules: [{
                                                    required: true,
                                                    whitespace: true,
                                                    message: '请输入身份证号码',
                                                }, {
                                                    pattern: new RegExp(/(^\d{15}$)|(^\d{17}(\d|X)$)/),
                                                    message: '请输入一代或二代身份证号码',
                                                }],
                                            })(
                                                <Input placeholder="请输入"/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem label="居住地址：" required={true}>
                                            {getFieldDecorator(`principalAddress`, {
                                                initialValue: formData.principalAddress,
                                                rules: [{
                                                    required: true,
                                                    whitespace: true,
                                                    message: '请输入居住地址',
                                                }, {
                                                    max: 50,
                                                    message: '输入内容需在50字以内',
                                                }],
                                            })(
                                                <Input placeholder="请输入"/>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Card>
                            <Card title="合作协议/合同" bordered={false}>
                                <Row gutter={32}>
                                    <Col span={8}>
                                        <FormItem label="签署时间：" required={true}>
                                            {getFieldDecorator(`contractTime`, {
                                                initialValue: moment(formData.contractTime, dateFormat),
                                                rules: [{
                                                    required: true,
                                                    message: '请选择签署时间',
                                                }],
                                            })(
                                                <DatePicker style={{width: "100%"}}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <div>
                                    <FormItem label='合同照片' extra="支持扩展名：pdf 文件。">
                                        {getFieldDecorator(`contractPhotoUrl`, {
                                            initialValue: formData.contractPhotoUrl,
                                            rules: [{
                                                required: true,
                                                message: '请选择',
                                            }],
                                        })(
                                            <div>
                                                <Upload
                                                    customRequest={this.uploadOss.bind(this)}
                                                    className="partner-upload"
                                                    fileList={contractFileList}
                                                    accept="application/pdf"
                                                    beforeUpload={this.beforeUploadCheckPDF.bind(this)}
                                                    onPreview={this.handlePreview.bind(this)}
                                                    onChange={this.handleContractFileChange.bind(this)}
                                                    onRemove={this.handleContractRemove.bind(this)}
                                                >
                                                    {contractFileList.length >= 1 ? null :
                                                        <Button>
                                                            <Icon type="upload"/> 上传文件
                                                        </Button>}
                                                </Upload>
                                                {/*<div style={{position: "absolute", bottom: "-22px"}}>支持文件格式：jpg,png。*/}
                                                {/*文件大小不可超过5MB*/}
                                                {/*</div>*/}
                                            </div>
                                        )}
                                    </FormItem>
                                </div>
                            </Card>
                        </Form>
                    </Spin>
                </div>
                <div className="newpartner-bottom-fixed"
                     style={this.props.collapsed ? {width: "calc(100% - 80px)"} : {width: "calc(100% - 256px)"}}>
                    <Button className="partnerList_search_button" onClick={e => {
                        window.location.history.back(-1)
                    }}>取 消</Button>
                    <Button type="primary" style={{width: 65}} onClick={this.submit.bind(this)}>提 交</Button>
                </div>
            </div>
        )
    }


}

UpdatePartner = Form.create()(UpdatePartner);
export default UpdatePartner;

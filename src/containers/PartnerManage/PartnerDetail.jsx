import React, {Component} from 'react';
import {
    Row,
    Col,
    Card,
    Form,
    Button,
    Input,
    Icon,
    Radio,
    Table,
    Pagination,
    Popconfirm,
    message,
    Spin,
    Cascader,
    Badge,
    Modal
} from 'antd';
//请求
import {HttpClient} from '../../common/HttpClient.jsx';
//其他
import {TimeUtils, Global} from '../../common/SystemFunction.jsx';
import ImagePreview from "../../components/ImagePreview";
//css
import './Style/PartnerListContainer.css';
import Exception from "../../components/Exception";
import _ from 'lodash';
import NewPartner from "./NewPartner";

const {TextArea} = Input;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const radioStyle1 = {
    display: 'block',
    height: '32px',
    lineHeight: '32px',
    marginBottom: "14px"
};
const radioStyle2 = {
    display: 'block',
    height: '32px',
    lineHeight: '32px',
};

class PartnerDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyId: this.props.location.query.id,
            visible: false,//审核modal
            checkModalVisible: false,//查看modal
            requestState: 0,//radio起始值
            requestReason: "",
            loading: true,
            page: 1,
            pageSize: 10,
            total: 0,
            totalSpace: 0,//停车场总数
            data: {},
            parkingList: [],
            ImagePreviewVisible: false,
            imageUrl: '',
        }
    }


    componentWillMount() {

    }

    componentDidMount() {
        if (window.checkPageEnable('partnerCompanyDetail')) {
            this.loadDetail();
            this.loadParkingLotList();
        }
    }

    /**
     * 加载详情
     */
    loadDetail() {
        let companyId = this.state.companyId;
        HttpClient.query(window.MODULE_PARKING_INFO + `/admin/company/${companyId}`, "GET", null, this.configDetailData.bind(this));
    }

    /**
     * 加载停车场列表
     * @param start
     * @param limit
     */
    loadParkingLotList(start, limit) {
        const {companyId, page, pageSize} = this.state;
        let requestData = {
            currentPage: start ? start : page,
            limit: limit ? limit : pageSize,
            partnerCompanyId: companyId
        };
        HttpClient.query(window.MODULE_PARKING_RESOURCE + `/admin/resource/parking`, "GET", requestData, this.configParkingList.bind(this));
    }

    /**
     * 接口回调--详情
     * @param d
     * @param type
     */
    configDetailData(d, type) {
        if (type == HttpClient.requestSuccess) {
            //成功-------在这里做你的数据处理
            console.log("success");
            this.setState({
                loading: false,
                data: d.data,
            });
        } else {
            this.setState({
                loading: false
            });
        }
    }

    /**
     * 接口回调--list
     * @param d
     * @param type
     */
    configParkingList(d, type) {
        if (type == HttpClient.requestSuccess) {
            //成功-------在这里做你的数据处理
            this.setState({
                loading: false,
                total: d.data.totalCount,
                totalSpace: d.data.parkingSpaceTotal,
                parkingList: d.data.returnList || [],
            });
        } else {
            this.setState({
                loading: false
            });
        }
    }

    /**
     * 合作方状态
     */
    onStateChange(e) {
        let data = {
            companyId: this.state.companyId,
            businessStatus: e.target.value,
        };
        this.updatePartner(data, '更改');
    }

    showCheckModal() {
        this.setState({
            checkModalVisible: true,
        });
    }

    showModal() {
        this.setState({
            visible: true,
        });
    }

    hideModal() {
        this.props.form.resetFields();
        this.setState({
            requestState: 0,
            requestReason: "",
            visible: false,
            checkModalVisible: false
        });
    }

    /**
     * 审核
     */
    changeReviewState() {
        this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
            if (!err) {
                // if (this.state.requestState == 2 && !this.state.requestReason) {
                //     message.error('请输入拒绝原因');
                // } else {
                let data = {
                    companyId: this.state.companyId,
                    reviewState: fieldsValue['requestState'],
                    failReason: fieldsValue['requestReason'],
                };
                this.updatePartner(data, '提交审核');
                // }
            }
        })
    }

    // modal内状态修改
    onModalChange(e) {
        this.setState({
            requestState: e.target.value,
        });
    }

    updatePartner(obj, str) {
        let data = JSON.stringify(obj);
        this.setState({
            loading: true
        });
        HttpClient.query(window.MODULE_PARKING_INFO + '/admin/company/' + obj.companyId, 'PUT', data, (d, type) => {
            if (type == HttpClient.requestSuccess) {
                //成功-------在这里做你的数据处理
                message.success(str + "成功");
                this.setState({
                    requestState: 0,
                    visible: false,
                    checkModalVisible: false
                });
                this.loadDetail();
                this.loadParkingLotList();
            } else {
                this.setState({
                    loading: false
                });
            }

        })
    }

    ToUpdate() {
        window.location.hash = `/PartnerManage/PartnerList/Update?id=${this.state.companyId}`;
    }

    // 表内状态修改
    handleChangeStatus(parkingId, status) {
        let requestData = [{
            id: parkingId,
            parkingState: status == 0 ? 1 : 0,
        }];
        requestData = JSON.stringify(requestData);
        console.log(requestData);
        //资源路段更新
        HttpClient.query(window.MODULE_PARKING_RESOURCE + `/admin/resource/parking`, "PUT", requestData, this.updateParkingLot.bind(this));
    }

    /**
     * 更新停车场信息
     */
    updateParkingLot(d, type) {
        if (type == HttpClient.requestSuccess) {
            //成功-------在这里做你的数据处理
            message.success("操作成功");
            this.loadParkingLotList();
        } else {

        }
    }

    // 分页
    onPageChange(page, pageSize) {
        this.setState({
            page: page,
            pageSize: pageSize
        });
        this.loadParkingLotList(page, pageSize);
    }

    // 切换页面条数
    onShowSizeChange(page, pageSize) {
        this.setState({
            page: 1,
            pageSize: pageSize
        });
        this.loadParkingLotList(1, pageSize);
    }

    configState(status) {
        let content = null;
        switch (parseInt(status)) {
            case 1://启用
                content = <Badge status="success" text="启用"/>;
                break;
            case 0://停用
                content = <Badge status="default" text="停用"/>;
                break;
        }
        return content;

    }

    /**
     *获取文件名
     */
    getItemFileName(url) {
        console.log(url);
        let arr = _.toString(url).split('/');
        return arr[arr.length - 1];
    }

    /**
     * 下载PDF
     * @param url
     */
    downloadPDF(url) {
        // let filePath = _.toString(url).replace('http://triplego-parking01.shenzhen.aliyuncs.com/', "");
        let filePath = _.toString(url).replace('http://triplego-parking.oss-cn-beijing.aliyuncs.com/', "");
        return HttpClient.ClientHost + window.MODULE_PARKING_INFO + '/admin/download?filePath=' + filePath + `&token=Bearer ${window.customCookie.get('access_token')}`;
    }


    render() {
        if (!window.checkPageEnable('partnerCompanyDetail')) {
            return <Exception type='403'/>;
        }
        const {data, parkingList, ImagePreviewVisible, imageUrl} = this.state;
        const {getFieldDecorator} = this.props.form;
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
        // 停车场列表
        const columns = [{
            title: '路段/停车场',
            dataIndex: 'parkingName',
        }, {
            title: '坐标',
            key: 'location',
            render: (value) => (value.parkingLongitude && value.parkingLatitude ?
                <div>{value.parkingLongitude},{value.parkingLatitude}</div> : "")
        }, {
            title: '剩余车位数/车位总数',
            key: 'parkingSpace',
            render: (value) => (<div>{value.parkingSpaceResidual}/{value.parkingSpaceTotal}</div>)
        }, {
            title: '状态',
            dataIndex: 'parkingState',
            render: (value) => (this.configState(value))
        },];
        if (window.getPerValue('sectionUpdate')) {
            columns.push({
                title: '操作',
                key: 'action',
                render: (value) => (
                    <Popconfirm
                        placement="topRight"
                        title={`你确定${value.parkingState == '0' ? '启用' : '停用'}此路段吗？`}
                        onConfirm={this.handleChangeStatus.bind(this, value.id, value.parkingState)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <a>{value.parkingState == '0' ? '启用' : '停用'}</a>
                    </Popconfirm>
                )
            });
        }
        return (
            <div className="page">
                <Modal
                    title="审核状态"
                    visible={this.state.visible}
                    onOk={this.changeReviewState.bind(this)}
                    onCancel={this.hideModal.bind(this)}
                    maskClosable={false}
                    okText="确认"
                    cancelText="取消"
                >
                    <Form>
                        <div style={{padding: "24px"}}>
                            <FormItem label="审核" {...formModalLayout} require={true}>
                                {getFieldDecorator(`requestState`, {
                                    rules: [{
                                        required: true,
                                        message: '请选择',
                                    }],
                                })(
                                    <RadioGroup onChange={this.onModalChange.bind(this)}>
                                        <Radio style={radioStyle1} value={1}>通过</Radio>
                                        <Radio style={radioStyle2} value={2}>拒绝</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                            {this.state.requestState === 2 ?
                                <FormItem label="拒绝原因" {...formModalLayout} require={true}>
                                    {getFieldDecorator(`requestReason`, {
                                        rules: [{
                                            required: true,
                                            message: '请输入拒绝原因',
                                        }, {
                                            max: 100,
                                            message: '输入内容需在100字以内',
                                        }],
                                    })(
                                        <TextArea autosize={{minRows: 4, maxRows: 8}}
                                                  onChange={e => {
                                                      this.setState({requestReason: e.target.value})
                                                  }} placeholder="请输入拒绝原因"/>
                                    )}
                                </FormItem> : null}
                        </div>
                    </Form>
                </Modal>
                <Modal
                    title="查看审核"
                    visible={this.state.checkModalVisible}
                    onCancel={this.hideModal.bind(this)}
                    footer={null}
                >
                    <div style={{padding: "24px", lineHeight: "30px"}}>
                        <div style={{display: "flex"}}>
                            <div style={{width: 80, textAlign: "right"}}>审核状态：</div>
                            <div>{data.reviewState == 1 ? '通过' : '拒绝'}</div>
                        </div>
                        {data.reviewState == 2 ?
                            <div style={{display: "flex"}}>
                                <div style={{minWidth: 80, textAlign: "right"}}>拒绝原因：</div>
                                <div style={{maxWidth: 400}}>{data.failReason}</div>
                            </div> : null}
                        <div style={{display: "flex"}}>
                            <div style={{width: 80, textAlign: "right"}}>审核人员：</div>
                            <div>{data.adminUserName}</div>
                        </div>
                        <div style={{display: "flex"}}>
                            <div style={{width: 80, textAlign: "right"}}>审核时间：</div>
                            <div>{data.reviewTime}</div>
                        </div>
                    </div>
                </Modal>
                <Spin tip="加载中.." spinning={this.state.loading}>
                    <div className="page-header ">
                        {
                            data.reviewState === 0 ?
                                <div className="partner-detail-header" style={{position: "relative"}}>
                                    公司名称：{data.partnerCompanyName}
                                    {window.getPerValue('partnerCompanyVerify') ?
                                        <div style={{float: "right"}}>
                                            <Button type='primary' className="partnerDetail_check_button"
                                                    onClick={this.showModal.bind(this)}>审 核</Button>
                                        </div>
                                        : null}
                                    <div className="partner-detail_state">
                                        <div className="partnerDetail-state-title">状态</div>
                                        <span className="partnerDetail-state-dot"><Badge className='header-dot'
                                                                                         status="default"/></span>
                                        <span>待审核</span>
                                    </div>
                                </div> : data.reviewState === 1 ?
                                <div className="partner-detail-header" style={{position: "relative"}}>
                                    公司名称：{data.partnerCompanyName}
                                    <div style={{float: "right"}}>
                                        <Button type='default' className="partnerDetail_check_button"
                                                onClick={this.showCheckModal.bind(this)}>查 看</Button>
                                    </div>
                                    <div className="partner-detail_state">
                                        <div className="partnerDetail-state-title">状态</div>
                                        <span className="partnerDetail-state-dot"><Badge className='header-dot'
                                                                                         status="success"/></span>
                                        <span>审核成功</span>
                                    </div>
                                </div> : data.reviewState === 2 ?
                                    <div className="partner-detail-header" style={{position: "relative"}}>
                                        公司名称：{data.partnerCompanyName}
                                        <div style={{float: "right"}}>
                                            <Button type='default' className="partnerDetail_check_button"
                                                    onClick={this.showCheckModal.bind(this)}>查 看</Button>
                                            {window.getPerValue('partnerCompanyAdd') ?
                                                <Button type='primary' className="partnerDetail_edit_button"
                                                        onClick={this.ToUpdate.bind(this)}>重新编辑</Button>
                                                : null}
                                        </div>
                                        <div className="partner-detail_state">
                                            <div className="partnerDetail-state-title">状态</div>
                                            <span className="partnerDetail-state-dot"><Badge className='header-dot'
                                                                                             status="error"/></span>
                                            <span>审核失败</span>
                                        </div>
                                    </div> : <div className="partner-detail-header" style={{position: "relative"}}>
                                        公司名称：{data.partnerCompanyName}
                                    </div>
                        }
                    </div>
                    <div className="page-content page-content-transparent">
                        <Card title="工商信息" bordered={false}>
                            <Row gutter={32} style={{lineHeight: '22px', paddingBottom: "16px"}}>
                                <Col xs={24} sm={12} md={8} style={{display: 'flex'}}>
                                    <span className="partnerDetail-col-key">所属行业：</span>
                                    <div className="partnerDetail-col-value">{data.business}</div>
                                </Col>
                                <Col xs={24} sm={12} md={8}>
                                    <div style={{display: "flex"}}>
                                        <span className="partnerDetail-col-key">合作方状态：</span>
                                        <RadioGroup onChange={this.onStateChange.bind(this)}
                                                    value={data.businessStatus}
                                                    disabled={window.getPerValue('partnerCompanyStatusUpdate') ? false : true}>
                                            <Radio value={1}>启用</Radio>
                                            <Radio value={0}>停用</Radio>
                                        </RadioGroup>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12} md={8}><span
                                    className="partnerDetail-col-key">公司电话：</span>{data.partnerCompanyTel}</Col>
                            </Row>
                            <Row gutter={32} style={{lineHeight: '22px', paddingBottom: "16px"}}>
                                <Col xs={24} sm={12} md={8} style={{display: 'flex'}}>
                                    <span className="partnerDetail-col-key">公司邮箱：</span>
                                    <div className="partnerDetail-col-value">{data.partnerCompanyEmail}</div>
                                </Col>
                                <Col xs={24} sm={12} md={8} style={{display: 'flex'}}>
                                    <div className="partnerDetail-col-key">登记机关：</div>
                                    <div className="partnerDetail-col-value">{data.registrationAuthority}</div>
                                </Col>
                                <Col xs={24} sm={12} md={8}><span
                                    className="partnerDetail-col-key">注册资本：</span>{data.registeredCapital + "万元"}</Col>
                            </Row>
                            <Row gutter={32} style={{lineHeight: '22px', paddingBottom: "16px"}}>
                                <Col xs={24} sm={12} md={8}><span
                                    className="partnerDetail-col-key">行政区域：</span>{data.provinceName + "/" + data.cityName + (data.areaName ? "/" + data.areaName : "")}
                                </Col>
                                <Col xs={24} sm={12} md={8} style={{display: 'flex'}}>
                                    <div className="partnerDetail-col-key">英文名：</div>
                                    <div className="partnerDetail-col-value">{data.englishName || "-"}</div>
                                </Col>
                                <Col xs={24} sm={12} md={8}><span
                                    className="partnerDetail-col-key">实缴资本：</span>{data.actualPayCapital ? data.actualPayCapital + "万元" : "未填写"}
                                </Col>
                            </Row>
                            <Row gutter={32} style={{lineHeight: '22px', paddingBottom: "16px"}}>
                                <Col xs={24} sm={12} md={8}><span
                                    className="partnerDetail-col-key">成立日期：</span>{data.establishment}</Col>
                                <Col xs={24} sm={12} md={8}><span
                                    className="partnerDetail-col-key">人员规模：</span>{data.staffSize}</Col>
                                <Col xs={24} sm={12} md={8} style={{display: 'flex'}}>
                                    <div className="partnerDetail-col-key">统一社会信用代码：</div>
                                    <div className="partnerDetail-col-value">{data.unifiedSocialCreditCode}</div>
                                </Col>
                            </Row>
                            <Row gutter={32} style={{lineHeight: '22px', paddingBottom: "16px"}}>
                                <Col xs={24} sm={12} md={8}><span
                                    className="partnerDetail-col-key">参保人数：</span>{data.participantNumber}</Col>
                                <Col xs={24} sm={12} md={8} style={{display: 'flex'}}>
                                    <div className="partnerDetail-col-key">纳税人识别号：</div>
                                    <div className="partnerDetail-col-value">{data.taxpayerIdentNumber}</div>
                                </Col>
                                <Col xs={24} sm={12} md={8}><span
                                    className="partnerDetail-col-key">营业期限：</span>{data.startDate} 至 {data.endDate}
                                </Col>
                            </Row>
                            <Row gutter={32} style={{lineHeight: '22px', paddingBottom: "16px"}}>
                                <Col xs={24} sm={12} md={8} style={{display: 'flex'}}>
                                    <span className="partnerDetail-col-key">注册号：</span>
                                    <div className="partnerDetail-col-value">{data.registrationNumber}</div>
                                </Col>
                                <Col xs={24} sm={12} md={8}><span
                                    className="partnerDetail-col-key">组织机构代码：</span>{data.organizationCode} </Col>
                                <Col xs={24} sm={12} md={8} style={{display: 'flex'}}>
                                    <span className="partnerDetail-col-key">公司类型：</span>
                                    <div className="partnerDetail-col-value">{data.partnerCompanyType}</div>
                                </Col>
                            </Row>
                            <Row gutter={32} style={{lineHeight: '22px'}}>
                                <Col xs={24} sm={12} md={8} style={{display: 'flex'}}>
                                    <span className="partnerDetail-col-key">企业地址：</span>
                                    <div className="partnerDetail-col-value">{data.address}</div>
                                </Col>
                                <Col xs={24} sm={12} md={8} style={{display: 'flex'}}>
                                    <span className="partnerDetail-col-key">经营范围：</span>
                                    <div className="partnerDetail-col-value">{data.businessScope}</div>
                                </Col>
                                <Col xs={24} sm={12} md={8} style={{display: 'flex'}}>
                                    <span className="partnerDetail-col-key">营业执照：</span>
                                    <div className="partnerDetail-col-value">{data.licenseUrl ?
                                        <img style={{width: 140, height: 100}} src={data.licenseUrl}
                                             onClick={(e) => {
                                                 this.setState({
                                                     ImagePreviewVisible: true,
                                                     imageUrl: e.target.src,
                                                 })
                                             }}/> : null}</div>
                                </Col>
                            </Row>
                        </Card>
                        <Card title="合作方结算信息" bordered={false}>
                            <Row gutter={32} style={{lineHeight: '22px', paddingBottom: "16px"}}>
                                <Col xs={24} sm={12} md={8} style={{display: 'flex'}}>
                                    <div className="partnerDetail-col-key">账户名称：</div>
                                    <div className="partnerDetail-col-value">{data.accountName}</div>
                                </Col>
                                <Col xs={24} sm={12} md={8} style={{display: 'flex'}}>
                                    <div className="partnerDetail-col-key">开户银行：</div>
                                    <div className="partnerDetail-col-value">{data.bankName}</div>
                                </Col>
                                <Col xs={24} sm={12} md={8} style={{display: 'flex'}}>
                                    <div className="partnerDetail-col-key">银行账号：</div>
                                    <div className="partnerDetail-col-value">{data.bankNo}</div>
                                </Col>
                            </Row>
                            <Row gutter={32} style={{lineHeight: '22px'}}>
                                <Col xs={24} sm={12} md={8} style={{display: 'flex'}}>
                                    <div className="partnerDetail-col-key" style={{minWidth: 120}}>第三方支付-微信：</div>
                                    <div className="partnerDetail-col-value">{data.payNoWx}</div>
                                </Col>
                                <Col xs={24} sm={12} md={8} style={{display: 'flex'}}>
                                    <div className="partnerDetail-col-key" style={{minWidth: 133}}>第三方支付-支付宝：</div>
                                    <div className="partnerDetail-col-value">{data.payNoAli}</div>
                                </Col>
                            </Row>
                        </Card>
                        <Card title="负责人信息" bordered={false}>
                            <Row gutter={32} style={{lineHeight: '22px', paddingBottom: "16px"}}>
                                <Col xs={24} sm={12} md={8} style={{display: 'flex'}}>
                                    <div className="partnerDetail-col-key">姓名：</div>
                                    <div className="partnerDetail-col-value">{data.principalName}</div>
                                </Col>
                                <Col xs={24} sm={12} md={8}><span
                                    className="partnerDetail-col-key">性别：</span>{data.principalGender == 0 ?
                                    '男' : data.principalGender == 1 ? '女' : '未知'}</Col>
                                <Col xs={24} sm={12} md={8}><span
                                    className="partnerDetail-col-key">电话：</span>{data.principalTel}</Col>
                            </Row>
                            <Row gutter={32} style={{lineHeight: '22px', paddingBottom: "16px"}}>
                                <Col xs={24} sm={12} md={8}><span
                                    className="partnerDetail-col-key">手机号码：</span>{data.principalPhone}</Col>
                                <Col xs={24} sm={12} md={8}><span
                                    className="partnerDetail-col-key">年龄：</span>{data.principalAge}</Col>
                                <Col xs={24} sm={12} md={8}><span
                                    className="partnerDetail-col-key">身份证号码：</span>{data.principalIdNo}</Col>
                            </Row>
                            <Row gutter={32} style={{lineHeight: '22px'}}>
                                {/*<Col xs={24} sm={12} md={8}><span*/}
                                {/*className="partnerDetail-col-key">部门：</span>{data.principalDepartment}</Col>*/}
                                {/*<Col xs={24} sm={12} md={8}><span*/}
                                {/*className="partnerDetail-col-key">所属停车路段/车场：</span>无</Col>*/}
                                <Col xs={24} sm={12} md={8} style={{display: 'flex'}}>
                                    <div className="partnerDetail-col-key">居住地址：</div>
                                    <div className="partnerDetail-col-value">{data.principalAddress}</div>
                                </Col>
                            </Row>
                        </Card>
                        <Card title="所辖路段/停车场" bordered={false}>
                            <Table
                                className="partnerList_table"
                                rowKey={data => data.id}
                                columns={columns}
                                dataSource={parkingList}
                                pagination={false}
                            />
                            <div className="table-foot">
                                <span style={{marginRight: 32}}>合计</span>
                                所辖路段总数：<span style={{marginRight: 32}}>{this.state.total}</span>
                                总车位：<span>{this.state.totalSpace}</span>
                            </div>
                            {parkingList.length > 0 ? (
                                <div>
                                    {/*<div className="partnerList_table_total">共{this.state.total}条</div>*/}
                                    <Pagination
                                        className="partnerList_table_pagination"
                                        showSizeChanger
                                        showQuickJumper
                                        total={this.state.total}
                                        current={this.state.page}
                                        onChange={this.onPageChange.bind(this)}
                                        onShowSizeChange={this.onShowSizeChange.bind(this)}
                                    />
                                    <div style={{clear: 'both'}}></div>
                                </div>
                            ) : ''}
                        </Card>
                        <Card title="合作协议/合同" bordered={false}>
                            <Row gutter={32} style={{lineHeight: '22px'}}>
                                <Col xs={24} sm={12} md={8}><span
                                    className="partnerDetail-col-key">签署时间：</span>{data.contractTime}</Col>
                                <Col xs={24} sm={12} md={16}>
                                    <div style={{display: "flex"}}>
                                        <div className="partnerDetail-col-key" style={{width: 140}}>上传合同扫描件PDF：</div>
                                        <div>
                                            {window.getPerValue('partnerCompanyContractDownload') ?
                                                <div className="partnerDetail-contract-file">
                                                    <Icon type="paper-clip"/>
                                                    <span
                                                        style={{marginLeft: "8px"}}>{this.getItemFileName(data.contractPhotoUrl)}</span>
                                                    <span className="partnerDetail-contract-download">
                                                        <a href={this.downloadPDF(data.contractPhotoUrl)}>下载</a>
                                                    </span>
                                                </div>
                                                : <div>
                                                    <Icon type="paper-clip"/>
                                                    <span
                                                        style={{marginLeft: "8px"}}>{this.getItemFileName(data.contractPhotoUrl)}</span>
                                                </div>}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </div>
                    <ImagePreview visible={ImagePreviewVisible} imageUrl={imageUrl} onCancel={() => {
                        this.setState({
                            ImagePreviewVisible: false
                        })
                    }}/>
                </Spin>
            </div>
        )
    }


}

PartnerDetail = Form.create()(PartnerDetail);
export default  PartnerDetail;

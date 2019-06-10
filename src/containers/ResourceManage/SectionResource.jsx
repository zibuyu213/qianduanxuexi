import React, {Component} from 'react';
import './Style/SectionResource.css'
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
    Cascader,
    Badge
} from 'antd';
import {HttpClient} from '../../common/HttpClient.jsx';
import Exception from '../../components/Exception';
import {custom} from "../../common/SystemStyle";
import {Global} from "../../common/SystemFunction";

const { TextArea } = Input;
const FormItem = Form.Item;
const auditStatus = {
    0: '已停用',
    1: '已启用'
};


class SectionResource extends Component {
    constructor (props) {
        super(props);
        message.config({
            duration: 1
        });

        this.state = {
            currentPage: 1,            // 当前页面
            limit: 10,       // 页面条数
            total: 0,          // 总共查询数量
            //列表参数
            parkingList: [],
            companyList: [],
            batchList: [],
            //筛选参数
            parkingName: '',
            partnerCompanyId: undefined,
            parkingState: undefined,
            provinceId: undefined,
            cityId: undefined,
            areaId: undefined,

            //临时存放筛选输入
            temporaryParkingName: '',
            temporaryCompanyId: undefined,
            temporaryParkingState: undefined,
            temporaryProvinceId: undefined,
            temporaryCityId: undefined,
            temporaryAreaId: undefined,
            //各类状态
            loading: true,      // 载入
            isBatch: false,     // 批量处理，是否隐藏其他按钮
            isAdd: false,       // 添加弹窗
            //其他 稍后整理
            addResource: {      // 添加页面
                parkingRecordNo: '',
                parkingName: '',
                streetName: '',
                provinceId: '',
                cityId: '',
                areaId: '',
                partnerCompanyId: '',
                parkingState: 0,
                parkingDesc: ''
            },
            selectedRowKeys: [],
            //省市区
            options: [],
            inSubmit: false
        }
    }

    componentWillMount () {

    }

    componentDidMount () {
        this.handleCompanyListQuerys();
        this.handleParkingListQuerys();
        this.getRegion();
    }

    getRegion () {
        HttpClient.query(window.MODULE_PARKING_INFO + '/admin/adminRegion', 'GET', null, this.regionData.bind(this));
    }

    // 获取行政区回调
    regionData (d, type) {
        if (type == HttpClient.requestSuccess) {
            if (d.success) {
                this.setState({
                    options: d.data
                })
            }
        }
    }

    //获取公司列表
    handleCompanyListQuerys () {
        HttpClient.query(window.MODULE_PARKING_INFO + `/admin/reviewPassCompany`, "GET", {}, this.fetchCompanyList.bind(this));
    }

    fetchCompanyList (e, type) {
        if (type == HttpClient.requestSuccess) {
            this.setState({
                companyList: e.data
            })
        }
    }

    //路段资源列表
    handleParkingListQuerys () {
        //转菊花
        this.setState({
            loading: true
        });
        let params = {
            currentPage: this.state.currentPage,
            limit: this.state.limit
        };
        if (!window.currentIsSystemAdmin) {
            params.partnerCompanyId = localStorage.partnerCompanyId;
        }

        if (this.state.parkingName.length > 0) {
            params.parkingName = this.state.parkingName;
        }
        if (this.state.partnerCompanyId !== undefined) {
            params.partnerCompanyId = parseInt(this.state.partnerCompanyId);
        }
        if (this.state.parkingState !== undefined) {
            params.parkingState = this.state.parkingState;
        }
        if (this.state.provinceId !== undefined) {
            params.provinceId = this.state.provinceId;
        }
        if (this.state.cityId !== undefined) {
            params.cityId = this.state.cityId;
        }
        if (this.state.areaId !== undefined) {
            params.areaId = this.state.areaId;
        }
        console.log(params);
        HttpClient.query(window.MODULE_PARKING_RESOURCE + `/admin/resource/parking`, "GET", params, this.fetchParkingList.bind(this));
    }

    fetchParkingList (e, type) {
        this.setState({
            loading: false
        });
        if (type === HttpClient.requestSuccess) {
            //成功
            this.setState({
                parkingList: e.data.returnList,
                total: e.data.totalCount
            });
            if (this.state.isBatch) {
                console.log("in batch");
                this.setState({
                    selectedRowKeys: this.getSelectRowKeys(e.data.returnList)
                })
            }
        }
    }

    //单个停启用
    handleChangeStatus (e) {
        this.setState({
            loading: true
        });
        let batchList = [{
            id: e.id,
            parkingState: e.parkingState === 0 ? 1 : 0
        }];
        //用批量操作的接口
        HttpClient.query(window.MODULE_PARKING_RESOURCE + `/admin/resource/parking`, "PUT", JSON.stringify(batchList), this.singleOperateResponse.bind(this));

    }

    singleOperateResponse (e, type) {
        this.setState({
            loading: false
        });
        if (type === HttpClient.requestSuccess) {
            message.success(e.data);
            this.handleParkingListQuerys();
        }
    }

    //批量停启用
    handleMoreActionMenuClick (e) {
        let batchList = this.state.batchList;
        if (batchList.length > 0) {
            this.setState({
                loading: true
            });
            for (let i = 0; i < batchList.length; i++) {
                batchList[i].parkingState = e.key;
            }
            HttpClient.query(window.MODULE_PARKING_RESOURCE + `/admin/resource/parking`, "PUT", JSON.stringify(batchList), this.batchOperateResponse.bind(this));
        } else {
            message.error("没有选择任何停车位");
        }
    }

    batchOperateResponse (e, type) {
        this.setState({
            loading: false
        });
        if (type === HttpClient.requestSuccess) {
            message.success(e.data);
            this.setState({
                batchList: [],
                selectedRowKeys: []
            });
            this.handleParkingListQuerys();
        }
    }

    //新增
    insertRoadResources (hidden) {
        this.props.form.validateFieldsAndScroll(((err, values) => {
            if (!err) {
                if (this.state.inSubmit === true) {
                    return;
                }
                this.state.inSubmit = true;
                HttpClient.query(window.MODULE_PARKING_RESOURCE + `/admin/resource/parking`, "POST", JSON.stringify(this.state.addResource), hidden ? this.fetchInsetResponseWithHidden.bind(this) : this.fetchInsetResponseWithoutHidden.bind(this));
            }
        }).bind(this));

    }

    fetchInsetResponseWithoutHidden (e, type) {
        this.state.inSubmit = false;
        if (type === HttpClient.requestSuccess) {
            message.success(e.data);

            this.handleParkingListQuerys();
            this.state.addResource = {      // 添加页面
                parkingRecordNo: '',
                parkingName: '',
                streetName: '',
                provinceId: '',
                cityId: '',
                areaId: '',
                partnerCompanyId: '',
                parkingState: 0,
                parkingDesc: ''
            };
            //重置
            this.props.form.resetFields(['addParkingRecordNo', 'addParkingName', 'addStreetName', 'addAdministrativeArea', 'addPartnerCompanyId', 'addParkingDesc']);
        }
    }

    fetchInsetResponseWithHidden (e, type) {
        this.state.inSubmit = false;
        if (type === HttpClient.requestSuccess) {
            this.setState({
                isAdd: false
            });
            message.success(e.data);
            this.handleParkingListQuerys();
            //重置
            this.props.form.resetFields(['addParkingRecordNo', 'addParkingName', 'addStreetName', 'addAdministrativeArea', 'addPartnerCompanyId', 'addParkingDesc']);
        }
    }

    // 跳转页面
    handleToSectionDetails (id) {
        if (window.checkPageEnable("sectionDetail")) {
            window.location.hash = '/ResourceManage/SectionResource/SectionDetails?id=' + id;
        } else {
            message.error("您无权限访问路段资源详情，请联系管理员！");
        }

    }

    //打开新建弹窗
    handleAdd () {
        this.setState({
            isAdd: true
        });
    }

    handleCancel () {
        this.setState({
            isAdd: false
        });
        this.props.form.resetFields(['addParkingRecordNo', 'addParkingName', 'addStreetName', 'addAdministrativeArea', 'addPartnerCompanyId', 'addParkingDesc']);
    }

    //批量操作开关
    handleBatchOperation () {
        this.setState({
            isBatch: !this.state.isBatch,
            batchList: [],
            selectedRowKeys: []
        });
    }

    //列表-公司选择器 新增时
    handleCompanyInsertChange (e) {
        this.state.addResource.partnerCompanyId = e;
    }

    //列表-公司选择器
    handleCompanyChange (e) {
        this.state.temporaryCompanyId = e;
    }

    //状态选择器
    handleConditionChange (e) {
        this.state.temporaryParkingState = e;
    }

    //列表-省市区联级选择
    onCascaderChange (value, selectedOptions) {
        if (!selectedOptions.length) {
            this.state.temporaryProvinceId = undefined;
            this.state.temporaryCityId = undefined;
            this.state.temporaryAreaId = undefined;
            return;
        }
        if (selectedOptions[0]) {
            this.state.temporaryProvinceId = selectedOptions[0].value;
        }
        if (selectedOptions[1]) {
            this.state.temporaryCityId = selectedOptions[1].value;
        }
        if (selectedOptions[2]) {
            this.state.temporaryAreaId = selectedOptions[2].value;
        }
    }

    //新建-省市区联级选择
    onCascaderChangeWhenInsert (value, selectedOptions) {
        if (selectedOptions[0]) {
            this.state.addResource.provinceId = selectedOptions[0].value;
        }
        if (selectedOptions[1]) {
            this.state.addResource.cityId = selectedOptions[1].value;
        }
        if (selectedOptions[2]) {
            this.state.addResource.areaId = selectedOptions[2].value;
        }
    }

    //分页
    onPageChange (page, pageSize) {
        this.state.currentPage = page;
        this.state.limit = pageSize;
        this.handleParkingListQuerys();
    }

    // 切换页面条数
    onShowSizeChange (page, pageSize) {
        this.state.currentPage = 1;
        this.state.limit = pageSize;
        this.handleParkingListQuerys();
    };

    //切换分页后 获取选择状态
    getSelectRowKeys (list) {
        //提取本页数据
        let currentSelectedRowKeys = [];
        this.state.batchList.map(batchItem => {
            let index = list.findIndex(item => {
                return item.id === batchItem.id;
            });
            if (index !== -1) {
                //本页数据
                currentSelectedRowKeys.push(batchItem.id);
            }
        });
        return currentSelectedRowKeys;
    }

    //提交查询
    submitQuery () {
        this.state.currentPage = 1;
        //这里吧input 赋值
        this.state.parkingName = this.state.temporaryParkingName;
        this.state.partnerCompanyId = this.state.temporaryCompanyId;
        this.state.parkingState = this.state.temporaryParkingState;
        this.state.provinceId = this.state.temporaryProvinceId;
        this.state.cityId = this.state.temporaryCityId;
        this.state.areaId = this.state.temporaryAreaId;

        /*console.log(this.state.temporaryParkingName);
        console.log(this.state.temporaryCompanyId);
        console.log(this.state.temporaryParkingState);
        console.log(this.state.temporaryProvinceId);
        console.log(this.state.temporaryCityId);
        console.log(this.state.temporaryAreaId);*/


        this.handleParkingListQuerys();
    }

    //重置
    resetFilter () {
        this.props.form.resetFields();

        this.state.parkingName = "";
        this.state.partnerCompanyId = undefined;
        this.state.parkingState = undefined;
        this.state.provinceId = undefined;
        this.state.cityId = undefined;
        this.state.areaId = undefined;
        this.state.currentPage = 1;
        this.state.limit = 10;

        this.state.temporaryParkingName = '';
        this.state.temporaryCompanyId = undefined;
        this.state.temporaryParkingState = undefined;
        this.state.temporaryProvinceId = undefined;
        this.state.temporaryCityId = undefined;
        this.state.temporaryAreaId = undefined;

        this.handleParkingListQuerys();
    }

    displayData (row, key1, key2) {
        if (row.parkingPriceVO[key1] === null || row.parkingPriceVO[key2] === null) {
            return "未设置";
        } else {
            return row.parkingPriceVO[key1] + "~" + row.parkingPriceVO[key2];
        }
    }

    configState (status) {
        let content = null;
        switch (parseInt(status)) {
            case 0://失败
                content = <Badge status="default" text={auditStatus[status]}/>;
                break;
            case 1://成功
                content = <Badge status="success" text={auditStatus[status]}/>;
                break;
        }
        return content;

    }

    //渲染
    render () {
        //判断页面权限
        if (!window.checkPageEnable("/SectionResource")) {
            return <Exception type={403}/>
        }


        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
        };
        const modalFormItem = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
        };
        const columns = [
            {
                title: '备案编号',
                dataIndex: 'parkingRecordNo',
                width: 150,
                fixed: 'left',
                render: (value, row) => (
                    window.checkPageEnable('sectionDetail') ?
                        <a style={{ color: '#1890FF' }}
                           onClick={this.handleToSectionDetails.bind(this, row.id)}>{value}</a> : value)
            }, {
                title: '路段名称',
                dataIndex: 'parkingName',
                width: 200,
            }, {
                title: '行政区域',
                dataIndex: 'administrativeArea',
                render: (value, row) => (
                    <span>{row.provinceName !== null ? row.provinceName : ""}{row.cityName !== null ? ("/" + row.cityName) : ""}{row.areaName !== null ? ("/" + row.areaName) : ""}</span>)
            }, {
                title: '所属公司',
                dataIndex: 'partnerCompanyName',
                width: 200,
            }, {
                title: '泊位数量',
                dataIndex: 'parkingSpaceTotal',
            }, {
                title: '工作日',
                dataIndex: 'workDay',
                className: 'column-content-time',
                render: (value, row) => (
                    row.parkingPriceVO == undefined ?
                        <div>未设置 </div> :
                        <div>
                            <div
                                className="sectionResource_table_time_text">禁停时段：{this.displayData(row, "workdayForbidStartTime", "workdayForbidEndTime")}</div>
                            <div
                                className="sectionResource_table_time_text">免费时段：{this.displayData(row, "workdayFreeStartTime", "workdayFreeEndTime")}</div>
                            <div
                                className="sectionResource_table_time_text">白天时段：{this.displayData(row, "workdayDaytimeStartTime", "workdayDaytimeEndTime")}</div>
                            <div
                                className="sectionResource_table_time_text">夜间时段：{this.displayData(row, "workdayNighttimeStartTime", "workdayNighttimeEndTime")}</div>
                        </div>
                )
            }, {
                title: '非工作日',
                dataIndex: 'restDay',
                className: 'column-content-time',
                render: (value, row) => (
                    row.parkingPriceVO == undefined ?
                        <div>未设置 </div> :
                        <div>
                            <div
                                className="sectionResource_table_time_text">禁停时段：{this.displayData(row, "weekendForbidStartTime", "weekendForbidEndTime")}</div>
                            <div
                                className="sectionResource_table_time_text">免费时段：{this.displayData(row, "weekendFreeStartTime", "weekendFreeEndTime")}</div>
                            <div
                                className="sectionResource_table_time_text">白天时段：{this.displayData(row, "weekendDaytimeStartTime", "weekendDaytimeEndTime")}</div>
                            <div
                                className="sectionResource_table_time_text">夜间时段：{this.displayData(row, "weekendNighttimeStartTime", "weekendNighttimeEndTime")}</div>
                        </div>)
            }, {
                title: '运行状态',
                dataIndex: 'parkingState',
                className: 'column-content-inspection',
                width: 100,
                fixed: 'right',
                render: (value) => this.configState(value)
            },
            {
                title: '车检器',
                dataIndex: 'hasDetector',
                width: 100,
                fixed: 'right',
                render: (value) => value ? '有' : '无'
            }
        ];
        if (window.currentIsSystemAdmin && !(window.checkPageEnable('sectionDetail') === false && window.checkPageEnable('sectionUpdate') === false)) {
            columns.push({
                title: '操作',
                key: 'action',
                width: 130,
                fixed: 'right',
                render: (value, row) => (
                    <div style={{ display: 'flex' }}>
                        {window.checkPageEnable('sectionDetail') ?
                            <a onClick={this.handleToSectionDetails.bind(this, row.id)}>编辑</a> : ""}
                        {/*中间的竖线*/}
                        {window.checkPageEnable('sectionDetail') && window.checkPageEnable('sectionUpdate') ?
                            <span style={{
                                width: '1px',
                                height: '13px',
                                backgroundColor: '#C0C0C0',
                                marginLeft: '6px',
                                marginTop: '4px'
                            }}/> : ''
                        }
                        {window.checkPageEnable('sectionUpdate') ?
                            <Popconfirm
                                placement="topRight"
                                title={`你确定${value.parkingState === 0 ? '启用' : '停用'}此路段吗？`}
                                onConfirm={this.handleChangeStatus.bind(this, value)}
                                okText="确定"
                                cancelText="取消"
                            >
                                <a style={{ marginLeft: '5px' }}>{value.parkingState === 1 ? '停用' : '启用'}</a>
                            </Popconfirm>
                            :
                            ""
                        }
                    </div>
                )
            })
        }

        const moreActionMenu =
            <Menu onClick={this.handleMoreActionMenuClick.bind(this)}>
                <Menu.Item key="1">启用</Menu.Item>
                <Menu.Item key="0">停用</Menu.Item>
            </Menu>
        ;
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                //先提取非本页数据
                let protectList = [];

                this.state.batchList.map(batchItem => {
                    let index = this.state.parkingList.findIndex(item => {
                        return item.id == batchItem.id;
                    });
                    if (index == -1) {
                        //非本页数据
                        protectList.push(batchItem);
                    }
                });
                //本页数据
                let updateList = [];
                for (let i = 0; i < selectedRows.length; i++) {
                    updateList[i] = {
                        id: selectedRows[i].id
                    }
                }
                //最终结果
                let result = protectList.concat(updateList);
                this.setState({
                    batchList: result,
                    selectedRowKeys: selectedRowKeys
                })
            },
            selectedRowKeys: this.state.selectedRowKeys
        };

        console.log(this.props.form);

        return (
            <div className="page">
                <div className="page-header">路段资源</div>
                <div className="page-content">
                    {/*查询表单*/}
                    <Form>
                        {!window.currentIsSystemAdmin ?
                            <Row gutter={46}>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label='路段名称'>
                                        {getFieldDecorator('parkingName')(
                                            <Input placeholder="请输入" onChange={(e) => {
                                                this.state.temporaryParkingName = e.target.value;
                                            }}/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label='行政区域'>
                                        {getFieldDecorator('regions')(
                                            <Cascader placeholder="省/市/区，县"
                                                      options={this.state.options}
                                                      onChange={this.onCascaderChange.bind(this)}/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label='运行状态'>
                                        {getFieldDecorator('conditions')(
                                            <Select placeholder="请选择" onChange={this.handleConditionChange.bind(this)}
                                                    allowClear>
                                                <Select.Option value="0">停用</Select.Option>
                                                <Select.Option value="1">启用</Select.Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row> :
                            <Row gutter={46}>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label='路段名称'>
                                        {getFieldDecorator('parkingName')(
                                            <Input placeholder="请输入" onChange={(e) => {
                                                this.state.temporaryParkingName = e.target.value;
                                            }}/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label='所属公司'>
                                        {getFieldDecorator('partnerCompanyName')(
                                            <Select
                                                showSearch
                                                placeholder="请输入"
                                                onChange={this.handleCompanyChange.bind(this)}
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                optionFilterProp="children"
                                            >
                                                {this.state.companyList.map((item, index) => {
                                                    return <Select.Option key={index}
                                                                          value={item.id + ""}>{item.partnerCompanyName}</Select.Option>
                                                })}
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label='行政区域'>
                                        {getFieldDecorator('regions')(
                                            <Cascader placeholder="省/市/区，县"
                                                      options={this.state.options}
                                                      onChange={this.onCascaderChange.bind(this)}/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>}
                        <Row gutter={46}>
                            <Col span={8}>
                                {!window.currentIsSystemAdmin ? "" :
                                    <FormItem {...formItemLayout} label='运行状态'>
                                        {getFieldDecorator('conditions')(
                                            <Select placeholder="请选择" onChange={this.handleConditionChange.bind(this)}
                                                    allowClear>
                                                <Select.Option value="0">停用</Select.Option>
                                                <Select.Option value="1">启用</Select.Option>
                                            </Select>
                                        )}
                                    </FormItem>}
                            </Col>
                            <Col span={8}/>
                            <Col span={8} style={{ textAlign: 'right' }}>
                                <FormItem>
                                    <Button type="primary" onClick={this.submitQuery.bind(this)}>查询</Button>
                                    <Button style={{ marginLeft: 8 }} onClick={this.resetFilter.bind(this)}>重置</Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>

                    {/*新建页面*/}
                    <div className="sectionResource_selection">
                        {window.checkPageEnable('sectionAdd') ?
                            <Button type="primary"
                                    className="sectionResource_button_add"
                                    onClick={this.handleAdd.bind(this)}>
                                <Icon type="plus"/>
                                新建
                            </Button>
                            :
                            ''
                        }
                        {/* 批量操作*/}
                        {window.checkPageEnable('sectionUpdate') ?
                            <div><Button className="sectionResource_batch_button"
                                         onClick={this.handleBatchOperation.bind(this)}>{!this.state.isBatch ? '批量操作' : '退出批量'}</Button>
                                {this.state.isBatch ? (
                                    <Dropdown overlay={moreActionMenu}>
                                        <Button style={{ marginLeft: '8px' }}>
                                            更多操作<Icon type="down"/>
                                        </Button>
                                    </Dropdown>
                                ) : ''}
                            </div>
                            :
                            ''
                        }
                        <div style={custom.clear}/>
                    </div>

                    {/*表格*/}
                    <Spin tip="加载中.." spinning={this.state.loading}>
                        <Table
                            className="sectionResource_table"
                            rowKey="id"
                            columns={columns}
                            scroll={{ x: '180%' }}
                            dataSource={this.state.parkingList}
                            pagination={false}
                            rowSelection={this.state.isBatch ? rowSelection : null}
                        />

                        {this.state.parkingList !== undefined && this.state.parkingList.length > 0 ? (
                            <div>
                                <div className="sectionResource_table_total">共{this.state.total}条</div>
                                <Pagination
                                    className="sectionResource_table_pagination"
                                    showSizeChanger
                                    showQuickJumper
                                    total={this.state.total}
                                    pageSize={this.state.limit}
                                    current={this.state.currentPage}
                                    onChange={this.onPageChange.bind(this)}
                                    onShowSizeChange={this.onShowSizeChange.bind(this)}
                                />
                                <div style={custom.clear}/>
                            </div>
                        ) : ''}
                    </Spin>
                </div>

                {/* 新建 Modal*/}
                <Modal
                    maskClosable={false}
                    title="新建"
                    centered
                    visible={this.state.isAdd}
                    onCancel={this.handleCancel.bind(this)}
                    footer={<div><Button className="sectionDetails_button"
                                         onClick={this.handleCancel.bind(this)}>取消</Button>
                        <Button type="primary" className="sectionDetails_button"
                                onClick={this.insertRoadResources.bind(this, true)}>确定</Button>
                        <Button type="primary" className="sectionDetails_button"
                                onClick={this.insertRoadResources.bind(this, false)}>确定并新增下一个</Button>
                    </div>}
                    closable={true}
                >
                    <Form className='addForm'>
                        <FormItem {...modalFormItem} label="备案编号">
                            {getFieldDecorator('addParkingRecordNo', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入备案编号'
                                    },
                                    {
                                        pattern: new RegExp("^([0-9A-Za-z]*)$"),
                                        message: '仅能填写数字与英文'
                                    },
                                    {
                                        max: 20,
                                        message: '输入不可超过20字'
                                    }]
                            })(
                                <Input placeholder="请输入"
                                       onChange={(e) => {
                                           this.state.addResource.parkingRecordNo = e.target.value;
                                       }}
                                />
                            )}
                        </FormItem>
                        <FormItem {...modalFormItem} label="路段名称">
                            {getFieldDecorator('addParkingName', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入路段名称'
                                    },
                                    {
                                        max: 20,
                                        message: '输入不可超过20字'
                                    }, {
                                        pattern: new RegExp(/^[A-Za-z0-9\u4e00-\u9fa5]+$/),
                                        message: '仅支持输入中英文和数字',
                                    }, {
                                        validator: (rule, value, callback) => {
                                            if (value === "全部") {
                                                callback("此命名不允许")
                                            }
                                            callback();
                                        }
                                    }]
                            })(
                                <Input placeholder="请输入"
                                       onChange={(e) => {
                                           this.state.addResource.parkingName = e.target.value;
                                       }}
                                />
                            )}
                        </FormItem>
                        <FormItem {...modalFormItem} label="街道名称">
                            {getFieldDecorator('addStreetName', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入街道名称'
                                    },
                                    {
                                        max: 20,
                                        message: '输入不可超过20字'
                                    }]
                            })(
                                <Input placeholder="请输入"
                                       onChange={(e) => {
                                           this.state.addResource.streetName = e.target.value;
                                       }}
                                />
                            )}
                        </FormItem>
                        <FormItem {...modalFormItem} label="行政区域">
                            {getFieldDecorator('addAdministrativeArea', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入行政区域'
                                    }]
                            })(
                                <Cascader placeholder="省/市/区，县"
                                          options={this.state.options}
                                          onChange={this.onCascaderChangeWhenInsert.bind(this)}/>
                            )}
                        </FormItem>
                        <FormItem {...modalFormItem} label="所属公司">
                            {getFieldDecorator('addPartnerCompanyId', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入所属公司'
                                    }]
                            })(
                                <Select
                                    showSearch
                                    placeholder="请输入"
                                    optionFilterProp="children"
                                    onChange={this.handleCompanyInsertChange.bind(this)}
                                >
                                    {this.state.companyList.map(item => {
                                        return <Select.Option key={item.id}
                                                              value={item.id + ""}>{item.partnerCompanyName}</Select.Option>
                                    })}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...modalFormItem} label="范围/描述">
                            {getFieldDecorator('addParkingDesc', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入范围/描述'
                                    },
                                    {
                                        max: 200,
                                        message: '输入不可超过200字'
                                    }]
                            })(
                                <TextArea placeholder="请输入" rows={5}
                                          onChange={(e) => {
                                              this.state.addResource.parkingDesc = e.target.value;
                                          }}
                                />
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default Form.create()(SectionResource);

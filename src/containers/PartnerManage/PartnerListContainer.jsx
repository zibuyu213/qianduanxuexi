import React, {Component} from 'react';
import {Form, Button, Input, Icon, Radio, Table, Pagination, Popconfirm, message, Spin, Row, Col, Badge} from 'antd';
import './Style/PartnerListContainer.css';
import Exception from "../../components/Exception";
//请求
import {HttpClient} from '../../common/HttpClient.jsx';
//省市区
import ChinaRegion from '../../components/ChinaRegion.jsx';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


// 状态——枚举
const businessStatus = {
    0: '停用',
    1: '启用'
};
const reviewState = {
    0: '待审核',
    1: '审核成功',
    2: '审核失败'
};

export default class PartnerListContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchParams: {
                partnerCompanyName: '',
                provinceId: null,
                cityId: null,
                areaId: null,
            },
            reviewState: "-1",
            search: {},
            page: 1,
            pageSize: 10,
            total: 0,
            partnerList: [],
            loading: true
        };
    }

    componentWillMount() {
    }

    componentDidMount() {
        if (window.checkPageEnable('/PartnerList')) {
            this.loadData();
        }
    }

    loadData(start, limit, searchData) {
        this.setState({
            loading: true,
        });
        const {search, page, pageSize} = this.state;
        let data = searchData ? searchData : search;
        data.currentPage = start ? start : page;
        data.limit = limit ? limit : pageSize;
        data.reviewState = this.state.reviewState;
        HttpClient.query(window.window.MODULE_PARKING_INFO + `/admin/company`, "GET", data, this.configData.bind(this));
    }

    /**
     * 接口请求回调
     * @param d
     * @param type
     */
    configData(d, type) {
        if (type == HttpClient.requestSuccess) {
            //成功-------在这里做你的数据处理，需要提示的自己加
            this.setState({
                loading: false,
                total: d.data.totalCount,
                partnerList: d.data.returnList,
            })
        } else {
            //失败----做除了报错之外的操作
            this.setState({
                loading: false,
            });

        }
    }

    // 搜索
    handleSearch() {
        const params = {...this.state.searchParams};
        this.setState({
            page: 1,
            search: params
        });
        this.loadData(1, this.state.pageSize, params);
    }

    // 重置
    handleReset() {
        let searchParams = {
            partnerCompanyName: '',
            provinceId: null,
            cityId: null,
            areaId: null,
        };
        this.state.reviewState = "-1";
        this.setState({
            searchParams,
            page: 1,
            pageSize: 10,
            search: {}
        });
        this.loadData(1, 10, {});

    }

    // 新建
    handleAdd() {
        window.location.hash = `/PartnerManage/PartnerList/NewPartner`
    }

    // 筛选状态选择---->审核
    handleSelect(e) {
        this.state.reviewState = e.target.value;
        this.loadData();
    }

    configState(status) {
        let content = null;
        switch (parseInt(status)) {
            case 0://待审核
                content = <Badge status="default" text={reviewState[0]}/>;
                break;
            case 1://审核成功
                content = <Badge status="success" text={reviewState[1]}/>;
                break;
            case 2://审核失败
                content = <Badge status="error" text={reviewState[2]}/>;
                break;

        }
        return content;

    }

    // 合作方状态修改
    handleChangeStatus(id, status) {
        let data = {
            companyId: id,
            businessStatus: status == 0 ? 1 : 0,
        };
        data = JSON.stringify(data);
        HttpClient.query(window.window.MODULE_PARKING_INFO + '/admin/company/' + id, 'PUT', data, (d, type) => {
            if (type == HttpClient.requestSuccess) {
                //成功-------在这里做你的数据处理
                message.success("操作成功");
                this.loadData();
            } else {

            }

        })
    }

    //跳转详情
    DetailClick(id) {
        window.location.hash = `/PartnerManage/PartnerList/PartnerDetail?id=${id}`
    }

    // 分页
    onPageChange(page, pageSize) {
        this.setState({
            page: page,
            pageSize: pageSize
        });
        this.loadData(page, pageSize);
    }

    // 切换页面条数
    onShowSizeChange(page, pageSize) {
        this.setState({
            page: 1,
            pageSize: pageSize
        });
        this.loadData(1, pageSize);
    }

    render() {
        if (!window.checkPageEnable('/PartnerList')) {
            return <Exception type='403'/>;
        }
        const {searchParams} = this.state;
        // 合作方列表
        const columns = [
            // {
            //     title: '编号',
            //     dataIndex: 'companyId'
            // },
            {
                title: '公司名称/单位名称',
                dataIndex: 'partnerCompanyName',
                render: (value, row) => (
                    <div>{window.getPerValue('partnerCompanyDetail') ?
                        <span className="cursor-pointer" style={{color: '#1890FF'}}
                              onClick={this.DetailClick.bind(this, row.companyId)}>{value}</span> :
                        <span>{value}</span>}
                    </div>)
            }, {
                title: '行政区域',
                key: 'administrativeArea',
                render: (value, row) => (
                    <span>{row.provinceName}/{row.cityName}{row.areaName ? '/' + row.areaName : ''}</span>)
            }, {
                title: '负责人',
                dataIndex: 'principalName'
            }, {
                title: '负责人联系电话',
                dataIndex: 'principalPhone'
            }, {
                title: '状态',
                dataIndex: 'businessStatus',
                render: (value) => (
                    <div style={value == '0' ? {color: 'rgba(0,0,0,0.25)'} : {}}>{businessStatus[value]}</div>)
            }, {
                title: '审核状态',
                dataIndex: 'reviewState',
                render: (value) => (this.configState(value))
            },];
        if (window.getPerValue('partnerCompanyStatusUpdate')) {
            columns.push({
                title: '操作',
                key: 'action',
                render: (value) => (
                    <Popconfirm
                        placement="topRight"
                        title={`你确定${value.businessStatus == '0' ? '启用' : '停用'}合作方吗？`}
                        onConfirm={this.handleChangeStatus.bind(this, value.companyId, value.businessStatus)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <a>{value.businessStatus == '0' ? '启用' : '停用'}</a>
                    </Popconfirm>
                )
            });
        }
        return (
            <div className="page">
                <div className="page-header">合作方列表</div>
                <div className="page-content">
                    <Form>
                        <Row gutter={46}>
                            <Col span={8}>
                                <FormItem label='公司名称' labelCol={{span: 5}}
                                          wrapperCol={{span: 19}}>
                                    <Input
                                        placeholder="请输入公司名称"
                                        value={searchParams.partnerCompanyName}
                                        onChange={(e) => {
                                            let search = this.state.searchParams;
                                            search.partnerCompanyName = e.target.value;
                                            this.setState({searchParams: search})
                                        }}
                                    />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='行政区域' labelCol={{span: 5}}
                                          wrapperCol={{span: 19}}>
                                    <ChinaRegion placeholder="省/市/区，县"
                                                 value={searchParams.provinceId ? [searchParams.provinceId, searchParams.cityId, searchParams.areaId] : []}
                                                 onChange={(value) => {
                                                     console.log(value);
                                                     let search = this.state.searchParams;
                                                     search.provinceId = value[0];
                                                     search.cityId = value[1];
                                                     search.areaId = value[2];
                                                     this.setState({searchParams: search})
                                                 }}/>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem>
                                    <Button type="primary" className="partnerList_search_button"
                                            onClick={this.handleSearch.bind(this)}>查询</Button>
                                    <Button className="partnerList_search_button"
                                            onClick={this.handleReset.bind(this)}>重置</Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    <div className="partnerList_selection">
                        {window.getPerValue('partnerCompanyAdd') ?
                            <Button type="primary" className="partnerList_button_add"
                                    onClick={this.handleAdd.bind(this)}>
                                <Icon type="plus"/>
                                新建
                            </Button> : null}
                        <RadioGroup onChange={this.handleSelect.bind(this)} value={this.state.reviewState}
                                    className="partnerList_selection_radioGroup">
                            <RadioButton value="-1" className="partnerList_selection_radio">全部审核状态</RadioButton>
                            <RadioButton value="0" className="partnerList_selection_radio">待审核</RadioButton>
                            <RadioButton value="1" className="partnerList_selection_radio">审核通过</RadioButton>
                            <RadioButton value="2" className="partnerList_selection_radio">审核失败</RadioButton>
                        </RadioGroup>
                        <div style={{clear: 'both'}}></div>
                    </div>
                    <Spin tip="加载中.." spinning={this.state.loading}>
                        <Table
                            className="partnerList_table"
                            rowKey={data => data.companyId}
                            columns={columns}
                            dataSource={this.state.partnerList}
                            pagination={false}
                        />
                        {this.state.partnerList.length > 0 ? (
                            <div>
                                <div className="table_pagination_total">共{this.state.total}条</div>
                                <Pagination
                                    className="table_pagination"
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
                    </Spin>
                </div>
            </div>
        )
    }
}

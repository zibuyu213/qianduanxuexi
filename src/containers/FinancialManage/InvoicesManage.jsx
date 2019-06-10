import React, {Component} from 'react';

import {Button, Row, Col, Spin, Pagination, Radio, Input, DatePicker, Table, Form, Badge} from 'antd';
import {HttpClient} from "../../common/HttpClient";
import moment from "moment/moment";

import './Style/FinancialManage.css';
import Exception from "../../components/Exception";

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const dateFormat = "YYYY-MM-DD";

export default class InvoicesManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            searchParams: {
                startTime: "",
                endTime: "",
                userPhone: "",
                invoiceTitle: "",
                radioInvoiceType: -1,//发票类型 0：个人 1： 企业
                radioInvoiceStatus: -1,//发票状态 0：开票中 1：开票成功 2：开票失败
            },
            search: {},
            pageNum: 1,
            pageSize: 10,
            total: 0,
            dataList: [],
        };
    }

    // 组件挂载之前
    componentWillMount() {
    }

    // 组件挂载后
    componentDidMount() {
        if (window.checkPageEnable('/InvoicesManage')) {
            this.loadData();
        }
    }

    // 组件卸载之前
    componentWillUnmount() {
    }

    //查询条件
    searchChange(name, e) {
        let obj = this.state.searchParams;
        obj[name] = e.target.value;
        this.setState({searchParams: obj});
    }

    searchTimeChange(value, dateString) {
        console.log(dateString);
        let obj = this.state.searchParams;
        obj.startTime = dateString[0];
        obj.endTime = dateString[1];
        this.setState({searchParams: obj});
    }

    loadData(page, size,searchData) {
        this.setState({
            loading: true,
        });
        const searchParams = {
            ...searchData ? searchData:this.state.search,
            'invoiceType': this.state.searchParams.radioInvoiceType,
            'invoiceStatus': this.state.searchParams.radioInvoiceStatus,
            'pageNum': page ? page : this.state.pageNum,
            'pageSize': size ? size : this.state.pageSize
        };
        HttpClient.query(window.MODULE_PARKING_PERSON_INFO + `/invoices/admin`, "GET", searchParams, this.configData.bind(this));
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
                total: d.data.total,
                dataList: d.data.list,
            })
        } else {
            //失败----做除了报错之外的操作
            this.setState({
                loading: false,
            })
        }
    }

    // 选择发票类型
    handleInvoiceType(e) {
        this.state.searchParams.radioInvoiceType = e.target.value;
        this.loadData();
    }

    // 选择开票状态
    handleInvoiceStatus(e) {
        this.state.searchParams.radioInvoiceStatus = e.target.value;
        this.loadData();
    }

    // 搜索
    handleSearch() {
        const params = {...this.state.searchParams};
        this.setState({
            pageNum: 1,
            search: params,
        });
        this.loadData(1, this.state.pageSize, params);
    }

    // 重置
    handleReset() {
        this.state.searchParams = {
            startTime: null,
            endTime: null,
            userPhone: "",
            invoiceTitle: "",
            radioInvoiceType: -1,//发票类型 0：个人 1： 企业
            radioInvoiceStatus: -1,//发票状态 0：开票中 1：开票成功 2：开票失败
        };
        this.setState({
            pageNum: 1,
            pageSize: 10,
            search: {},
        });
        this.loadData(1,10,{});
    }

    configState(status) {
        let content = null;
        switch (parseInt(status)) {
            case 0://开票中
                content = <Badge status="processing" text='开票中'/>;
                break;
            case 1://开票成功
                content = <Badge status="success" text='开票成功'/>;
                break;
            case 2://开票失败
                content = <Badge status="error" text='开票失败'/>;
                break;
        }
        return content;

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

    render() {
        if (!window.checkPageEnable('/InvoicesManage')) {
            return <Exception type='403'/>;
        }
        const {searchParams, pageNum, pageSize, total, dataList, loading} = this.state;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19},
        };
        const columns = [
            {
                title: '申请开票编号',
                dataIndex: 'number',
                width:180,
                fixed: 'left',
                render: (value, row) => (
                    <div className="column-invoice-number">
                        <a onClick={e => location.hash = `/FinancialManage/InvoicesManage/InvoiceDetail?id=${row.id}`}>
                            {value}</a>
                    </div>)
            }, {
                title: '申请开票用户',
                dataIndex: 'userPhone',
                width:150,
            }, {
                title: '发票类型',
                dataIndex: 'invoiceType',
                width:100,
                render: (value) => {
                    return value == 0 ? "个人" : value == 1 ? "公司" : ''
                }
            }, {
                title: '发票抬头',
                dataIndex: 'invoiceTitle',
                width:330,
                // render: (value) => {
                //     return <div className="column-invoice-title">{value}</div>
                // }
            }, {
                title: '申请开票金额',
                dataIndex: 'amount',
                width:150,
                sorter: (a, b) => a.amount - b.amount,
                render: (value) => (value + "元")
            }, {
                title: '申请开票时间',
                dataIndex: 'createTime',
                width:150,
                sorter: (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
            }, {
                title: '开票状态',
                dataIndex: 'status',
                width:150,
                render: (value) => (this.configState(value))
            },
        ];
        return (
            <div className='page'>
                <div className='page-header'>
                    发票管理
                </div>
                <div className='page-content'>
                    <Form>
                        <Row gutter={46}>
                            <Col span={8}>
                                <FormItem label='开票时间' {...formItemLayout}>
                                    <RangePicker style={{width: '100%'}} format={dateFormat}
                                                 placeholder={['起始时间', '结束时间']}
                                                 value={searchParams.startTime && searchParams.endTime ?
                                                     [moment(searchParams.startTime, dateFormat), moment(searchParams.endTime, dateFormat)] : null}
                                                 onChange={this.searchTimeChange.bind(this)}/>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='开票用户' {...formItemLayout}>
                                    <Input placeholder='请输入'
                                           value={searchParams.userPhone}
                                           onChange={this.searchChange.bind(this, 'userPhone')}/>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='发票抬头' {...formItemLayout}>
                                    <Input placeholder='请输入'
                                           value={searchParams.invoiceTitle}
                                           onChange={this.searchChange.bind(this, 'invoiceTitle')}/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row style={{textAlign: 'right'}}>
                            <Button type="primary" className="author_search_button"
                                    onClick={this.handleSearch.bind(this)}>查询</Button>
                            <Button className="author_search_button"
                                    onClick={this.handleReset.bind(this)}>重置</Button>
                        </Row>
                    </Form>
                    <Row style={{marginTop: '20px'}}>
                        <Col span={12}>
                            <RadioGroup onChange={this.handleInvoiceType.bind(this)}
                                        value={searchParams.radioInvoiceType}>
                                <RadioButton value={-1} className="selection_radio_button">全部开票类型</RadioButton>
                                <RadioButton value={1} className="selection_radio_button">公司</RadioButton>
                                <RadioButton value={0} className="selection_radio_button">个人</RadioButton>
                            </RadioGroup>
                        </Col>
                        <Col span={12} style={{textAlign: 'right'}}>
                            <RadioGroup onChange={this.handleInvoiceStatus.bind(this)}
                                        value={searchParams.radioInvoiceStatus}>
                                <RadioButton value={-1} className="selection_radio_button">全部开票状态</RadioButton>
                                <RadioButton value={1} className="selection_radio_button">开票成功</RadioButton>
                                <RadioButton value={0} className="selection_radio_button">开票中</RadioButton>
                                <RadioButton value={2} className="selection_radio_button">开票失败</RadioButton>
                            </RadioGroup>
                        </Col>
                    </Row>
                    {/*表格*/}
                    <Spin tip="加载中.." spinning={loading}>
                        <Table
                            style={{marginTop: '20px'}}
                            rowKey="id"
                            columns={columns}
                            scroll={{x: '130%'}}
                            dataSource={dataList}
                            pagination={false}
                        />
                        {/*分页*/}
                        {dataList.length > 0 ? (
                            <div>
                                <div className="table_pagination_total">共{total}条</div>
                                <Pagination
                                    className="table_pagination"
                                    showSizeChanger
                                    showQuickJumper
                                    total={total}
                                    current={pageNum}
                                    pageSize={pageSize}
                                    onChange={this.onPageChange.bind(this)}
                                    onShowSizeChange={this.onShowSizeChange.bind(this)}
                                />
                                <div style={{clear: 'both'}}>
                                </div>
                            </div>
                        ) : ''}
                    </Spin>
                </div>
            </div>
        );
    }
}

import React, {Component} from 'react';

import {Row, Col, Card, message, Spin, Table, Badge, Pagination} from 'antd';
//请求
import {HttpClient} from '../../common/HttpClient.jsx';
//其他
import {TimeUtils, Global} from '../../common/SystemFunction.jsx';
import Exception from "../../components/Exception";

export default class InvoiceDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.location.query.id,
            loading: true,
            pageNum: 1,
            pageSize: 10,
            total: 0,
            data: {},
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
            this.loadTableData();
        }
    }

    // 组件卸载之前
    componentWillUnmount() {
    }

    //加载详情
    loadData() {
        HttpClient.query(window.MODULE_PARKING_PERSON_INFO + `/invoices/admin/${this.state.id}`, "GET", {}, (d, type) => {
            if (type == HttpClient.requestSuccess) {
                //成功-------在这里做你的数据处理，需要提示的自己加
                this.setState({
                    data: d.data || {},
                })
            }
        });
    }

    //加载支付流水订单列表
    loadTableData(page, size) {
        this.setState({
            loading: true,
        });
        let data = {
            pageNum: page ? page : this.state.pageNum,
            pageSize: size ? size : this.state.pageSize,
        };
        HttpClient.query(window.MODULE_PARKING_PERSON_INFO + `/invoices/admin/${this.state.id}/parkOrderPayInfos`, "GET", data, this.configTable.bind(this));
    }

    /**
     * 接口请求回调-支付流水订单列表
     * @param d
     * @param type
     */
    configTable(d, type) {
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

    configState(status) {
        let content = null;
        switch (parseInt(status)) {
            case 0://开票中
                content = <Badge status="processing"/>;
                break;
            case 1://开票成功
                content = <Badge status="success"/>;
                break;
            case 2://开票失败
                content = <Badge status="error"/>;
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
        this.loadTableData(page, pageSize);
    }

    // 切换页面条数
    onShowSizeChange(page, pageSize) {
        this.setState({
            pageNum: 1,
            pageSize: pageSize
        });
        this.loadTableData(1, pageSize);
    }

    render() {
        if (!window.checkPageEnable('/InvoicesManage')) {
            return <Exception type='403'/>;
        }
        const {data, dataList} = this.state;
        const columns = [{
            title: '开票关联支付流水号',
            dataIndex: 'parkOrderPayInfoId',
        }, {
            title: '支付费用',
            dataIndex: 'payMoney',
            render: (value) => (value + "元")
        }, {
            title: '支付时间',
            dataIndex: 'payTime',
        }];
        return (
            <div className='page'>
                <div className='page-header'>
                    <div style={{display: "flex", color: "rgba(0,0,0,0.85)"}}>
                        <div style={{flex: "1", textAlign: "left"}}>
                            <div style={{fontSize: "20px", lineHeight: "28px"}}>
                                开票编号：{data.number}
                            </div>
                            <div style={{fontSize: "14px", lineHeight: "22px", marginTop: 20}}>
                                申请开票用户：<span style={{color: 'rgba(0,0,0,0.65)'}}>{data.userPhone}</span>
                            </div>
                        </div>
                        <div style={{flex: "1", textAlign: "right"}}>
                            <div style={{display: "inline-block"}}>
                                <div style={{fontSize: "14px", lineHeight: "22px", color: "rgba(0,0,0,0.45)"}}>
                                    申请开票金额
                                </div>
                                <div style={{fontSize: "20px", lineHeight: "28px"}}>¥ {data.amount}</div>
                            </div>
                            <div style={{display: "inline-block", marginLeft: "32px"}}>
                                <div style={{fontSize: "14px", lineHeight: "22px", color: "rgba(0,0,0,0.45)"}}>开票状态
                                </div>
                                <div style={{fontSize: "20px", lineHeight: "28px"}}>
                                    <span className="partnerDetail-state-dot">{this.configState(data.status)}</span>
                                    <span>{data.statusName}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='page-content page-content-transparent'>

                    <Card title="发票信息" bordered={false}>
                        <Row gutter={32} style={{lineHeight: '22px', paddingBottom: "16px"}}>
                            <Col xs={24} sm={12} md={8}>
                                <span className="partnerDetail-col-key">发票类型：</span>
                                {data.invoiceTypeName}
                            </Col>
                            <Col xs={24} sm={12} md={8} style={{display: 'flex'}}>
                                <div className="partnerDetail-col-key">发票抬头：</div>
                                <div className="partnerDetail-col-value">{data.invoiceTitle}</div>
                            </Col>
                            {data.invoiceType == 1 ?
                                <Col xs={24} sm={12} md={8}>
                                    <span className="partnerDetail-col-key">发票税号：</span>
                                    {data.invoiceTaxpayerNo}
                                </Col> : <Col xs={24} sm={12} md={8}>
                                    <span className="partnerDetail-col-key">收票邮箱：</span>
                                    {data.userEmail}
                                </Col>}
                        </Row>
                        <Row gutter={32}>
                            {data.invoiceType == 1 ?
                                <Col xs={24} sm={12} md={8}>
                                    <span className="partnerDetail-col-key">收票邮箱：</span>
                                    {data.userEmail}
                                </Col> : null}
                            <Col xs={24} sm={12} md={8}>
                                <span className="partnerDetail-col-key">申请开票时间：</span>
                                {data.createTime}
                            </Col>
                        </Row>
                        <Spin tip="加载中.." spinning={this.state.loading}>
                            <Table
                                title={() => <span className="partnerDetail-col-key">开票关联支付流水号</span>}
                                className="invoiceDetail_table"
                                rowKey="parkOrderPayInfoId"
                                columns={columns}
                                dataSource={dataList}
                                pagination={false}
                            />
                            {dataList.length > 0 ? (
                                <div>
                                    <div className="table_pagination_total">共{this.state.total}条</div>
                                    <Pagination
                                        className="table_pagination"
                                        showSizeChanger
                                        showQuickJumper
                                        pageSize={this.state.pageSize}
                                        total={this.state.total}
                                        current={this.state.pageNum}
                                        onChange={this.onPageChange.bind(this)}
                                        onShowSizeChange={this.onShowSizeChange.bind(this)}
                                    />
                                    <div style={{clear: 'both'}}></div>
                                </div>
                            ) : ''}
                        </Spin>
                    </Card>
                </div>
            </div>
        );
    }
}

import React, {Component} from 'react';

import {Button, Form, Badge, Input, Radio, Table, Pagination, Row, Col, DatePicker, Spin} from 'antd';
import {HttpClient} from "../../common/HttpClient";
import Exception from "../../components/Exception";

const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

// 申诉处理
class AppealManage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            optionalParams: {
                startTime: null,//开始时间
                endTime: null,//结束时间
                parkOrderId: null,
                mobile: null,
            },
            pageSize: 10,
            pageNum: 1,
            total: 10,
            RadioGroupOrderStatus: -1,
            tableList: [],
            loading: false
        };
    }

    // 组件挂载之前
    componentWillMount () {
    }

    // 组件挂载后
    componentDidMount () {
        this.loadData(this.state.pageNum, this.state.pageSize, this.state.optionalParams)
    }

    // 组件卸载之前
    componentWillUnmount () {
    }

    // 筛选数据
    filterParams (otherParams) {
        let params = {};
        for (let item in otherParams) {
            if (otherParams[item] || item === 'status') {
                params[item] = otherParams[item]
            }
        }
        return params
    }

    // 请求数据
    loadData (pageNum, pageSize, otherParams) {
        this.setState({
            loading: true
        });
        let queryParams = {
            pageNum: pageNum ? pageNum : 1,
            pageSize: pageSize ? pageSize : 10,
            status: this.state.RadioGroupOrderStatus,
            ...otherParams,
        };
        queryParams = this.filterParams(queryParams);
        console.log(queryParams);
        // return;
        HttpClient.query(`${window.MODULE_PARKING_ORDERS}/costAppeal/list`, "GET", queryParams, this.handleQuery.bind(this));
    }

    handleQuery (d, type) {
        // console.log('接口请求回调，停车记录列表：', d);
        const data = d.data;
        if (type === HttpClient.requestSuccess) {
            //成功-------在这里做你的数据处理
            this.setState({
                total: data.total,
                tableList: data.list,
            });
        } else {
            //失败----做除了报错之外的操作
        }
        this.setState({
            loading: false,
        })
    }

    // 查询
    queryList () {
        this.loadData(this.state.pageNum, this.state.pageSize, this.state.optionalParams)
    }

    // 重置
    resetParams () {
        this.props.form.resetFields();
        const optionalParams = {
            startTime: null,//开始时间
            endTime: null,//结束时间
            parkOrderId: null,
            mobile: null,
        };
        this.setState({
            optionalParams,
            pageSize: 10,
            pageNum: 1,
            RadioGroupOrderStatus: -1
        }, () => {
            this.loadData(this.state.pageNum, this.state.pageSize, this.state.optionalParams)
        })
    }

    // 点击radiobutton的筛选
    handleSelectRadio (e) {
        this.setState({
            pageNum: 1,
            RadioGroupOrderStatus: e.target.value,
        }, () => {
            this.loadData(this.state.pageNum, this.state.pageSize, this.state.optionalParams)
        });
    }

    // 当前页改变
    onPageChange (page) {
        this.setState({
            pageNum: page,
        }, () => {
            this.loadData(this.state.pageNum, this.state.pageSize, this.state.optionalParams)
        });

    }

    // 切换页面条数
    onShowSizeChange (current, pageSize) {
        this.setState({
            pageNum: current,
            pageSize: pageSize
        }, () => {
            this.loadData(this.state.pageNum, this.state.pageSize, this.state.optionalParams)
        });

    }

    // 导出
    exportList () {
        const { optionalParams, RadioGroupOrderStatus } = this.state;
        const paramsObj = {
            status: RadioGroupOrderStatus,
            ...this.filterParams(optionalParams)
        };
        const paramsArr = [];
        for (let item in paramsObj) {
            if (paramsObj[item] || item === 'status') {
                const str = `${item}=${paramsObj[item]}`;
                paramsArr.push(str)
            }
        }
        paramsArr.push(`token=Bearer ${window.customCookie.get('access_token')}`);
        const url = `${window.MODULE_PARKING_ORDERS}/costAppeal/listForExcel?${paramsArr.join('&')}`;
        let downloadHtml = (
            <a target="_blank" href={HttpClient.ClientHost + url}>
                <Button icon='save' type='primary'>
                    <span style={{ color: "white", marginLeft: 5 }}>导出</span>
                </Button>
            </a>
        );
        return downloadHtml;
    }

    render () {
        if (!window.checkPageEnable('/AppealManage')) return <Exception type='403'/>;
        const { optionalParams, tableList, pageNum, pageSize, total, loading, RadioGroupOrderStatus } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const orderState = ['待处理', '已通过', '已拒绝'];
        const columnsAppeal = [
            {
                title: '订单号',
                dataIndex: 'parkOrderId',
                render: (text, row) => (
                    window.checkPageEnable('appealDetail') ?
                        <a href={'#/DealManage/AppealManage/AppealDetail?orderId=' + row.parkOrderId}>{text}</a> : text
                )

            }, {
                title: '车牌号',
                dataIndex: 'plateNumber',
            }, {
                title: '申诉时间',
                dataIndex: 'createTime',
            }, {
                title: '手机号',
                dataIndex: 'userMobile',
            }, {
                title: '申诉状态',
                dataIndex: 'status',
                render: (value) => (
                    <div style={{ minWidth: 70 }}>
                        <Badge status={
                            value === 0 ? 'success' : 'default'
                        } text={orderState[value]}/>
                    </div>
                )
            }
        ];
        if (window.checkPageEnable('appealDetail')) {
            columnsAppeal.push({
                title: '操作',
                render: (text, row) => {
                    const href = `#/DealManage/AppealManage/AppealDetail?orderId=${row.parkOrderId}`;
                    return <a href={href}>查看详情</a>
                }
            })
        }
        return (
            <div className='page'>
                <div className='page-header'>
                    申诉处理
                </div>
                <div className='page-content'>
                    <Form>
                        <Row gutter={40}>
                            <Col span={8}>
                                <FormItem label='选择日期' {...formItemLayout} style={{ marginBottom: 15 }}>
                                    {getFieldDecorator('RangeTime')(
                                        <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD"
                                                     onChange={(dates, dateStrings) => {
                                                         optionalParams.startTime = dateStrings[0] ? dateStrings[0] + ' 00:00:00' : null;
                                                         optionalParams.endTime = dateStrings[1] ? dateStrings[1] + ' 23:59:59' : null;
                                                     }}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='订单号' {...formItemLayout} style={{ marginBottom: 15 }}>
                                    {getFieldDecorator('parkOrderId')(
                                        <Input onChange={(e) => {
                                            optionalParams.parkOrderId = e.target.value
                                        }} placeholder="请输入"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='手机号' {...formItemLayout} style={{ marginBottom: 15 }}>
                                    {getFieldDecorator('mobile')(
                                        <Input onChange={(e) => {
                                            optionalParams.mobile = e.target.value
                                        }} placeholder="请输入"/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    <Row style={{ marginTop: 15 }}>
                        <Col span={8}>
                            <RadioGroup onChange={this.handleSelectRadio.bind(this)} value={RadioGroupOrderStatus}
                                        className="parkingRecord_selection_radioGroup">
                                <RadioButton value={-1} className="selection_radio_button">全部</RadioButton>
                                <RadioButton value={0} className="selection_radio_button">待处理</RadioButton>
                                <RadioButton value={1} className="selection_radio_button">已通过</RadioButton>
                                <RadioButton value={2} className="selection_radio_button">已拒绝</RadioButton>
                            </RadioGroup>
                        </Col>
                        <Col span={16} style={{ textAlign: 'right' }}>
                            <Button type='primary'
                                    onClick={this.queryList.bind(this)}>查询</Button>
                            <Button style={{ marginLeft: '20px' }}
                                    onClick={this.resetParams.bind(this)}>重置</Button>
                        </Col>
                    </Row>
                    {/*<Row>
                        <Col span={12}>
                            {this.exportList()}
                        </Col>
                        <Col span={12} style={{ textAlign: 'right' }}>
                            <RadioGroup onChange={this.handleSelectRadio.bind(this)} value={RadioGroupOrderStatus}
                                        className="parkingRecord_selection_radioGroup">
                                <RadioButton value={-1} className="selection_radio_button">全部</RadioButton>
                                <RadioButton value={0} className="selection_radio_button">待处理</RadioButton>
                                <RadioButton value={1} className="selection_radio_button">已通过</RadioButton>
                                <RadioButton value={2} className="selection_radio_button">已拒绝</RadioButton>
                            </RadioGroup>
                        </Col>
                    </Row>*/}
                    <Row>
                        <Spin tip="加载中.." spinning={loading}>
                            <Table
                                style={{ marginTop: '20px' }}
                                rowKey={data => data.parkOrderId}
                                columns={columnsAppeal}
                                dataSource={tableList}
                                pagination={false}
                            />

                            {/*分页*/}
                            {(tableList.length > 0) ? (
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
                                    <div style={{ clear: 'both' }}>
                                    </div>
                                </div>
                            ) : ''}
                        </Spin>
                    </Row>
                </div>
            </div>
        );
    }
}

export default Form.create()(AppealManage);

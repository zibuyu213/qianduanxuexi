import React, {Component} from 'react';
import {
    Form,
    Row,
    Col,
    Input,
    Button,
    Radio,
    Table,
    Pagination,
    Spin,
    DatePicker,
    Badge,
    Tooltip,
} from 'antd';
import './Style/ParkingRecord.css';
import {HttpClient} from "../../common/HttpClient";
import Exception from "../../components/Exception";
import {StringUtil} from '../../common/SystemFunction';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

// 订单状态——枚举
// 0：停车中 1：行程结束 2：退款中 3：欠费
const status = {
    0: '停车中',
    1: '行程结束',
    2: '退款中',
    3: '欠费',
    4: '异常',
};

class ParkingRecord extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            pageNum: 1, // 当前页
            size: 10,
            total: null, // 总记录数
            parkingRecord: [],
            otherParams: {
                parkName: null,
                parkOrderId: null,
                parkingSpaceNo: null,
                startDate: null,
                endDate: null,
                mobile: null,
                plateNumber: null,
            }, // loadData其他可选参数
            RadioGroupParkOrderStatus: -1, // RadioGroup订单状态值
            parkingRecordDetail: window.getPerValue('parkingRecordDetail'), // 是否有权限查看
        }
    }

    componentWillMount () {
    }

    componentDidMount () {
        if (window.checkPageEnable('/ParkingRecord')) {
            this.loadData(this.state.pageNum, this.state.size)
        }
    }

    // 筛选参数
    filterOtherParams (otherParams) {
        let params = {};
        for (let item in otherParams) {
            if (otherParams[item] || item === 'parkOrderStatus') {
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
        let orderQueryParams = {
            pageNum: pageNum ? pageNum : 1,
            pageSize: pageSize ? pageSize : 10,
            ...otherParams,
        };
        orderQueryParams = this.filterOtherParams(orderQueryParams);
        HttpClient.query(window.MODULE_PARKING_ORDERS + "/admin/business/parking/order", "GET", orderQueryParams, this.parkingData.bind(this));
    }

    /**
     * 接口请求回调
     * 获取停车订单列表
     * @param d
     * @param type
     */
    parkingData (d, type) {
        // console.log('接口请求回调，停车记录列表：', d);
        const data = d.data;
        if (type === HttpClient.requestSuccess) {
            //成功-------在这里做你的数据处理
            this.setState({
                total: data.total,
                parkingRecord: data.list,
            });
        } else {
            //失败----做除了报错之外的操作
        }
        this.setState({
            loading: false,
        })
    }

    // 表单查询
    handleSearch (e) {
        e.preventDefault();
        this.setState({
            loading: true,
            pageNum: 1,
        });
        let otherParams = {};
        if (this.state.otherParams.parkName !== null) {
            otherParams.parkName = this.state.otherParams.parkName;
        }
        if (this.state.otherParams.parkOrderId !== null) {
            otherParams.parkOrderId = this.state.otherParams.parkOrderId;
        }
        if (this.state.otherParams.parkingSpaceNo !== null) {
            otherParams.parkingSpaceNo = this.state.otherParams.parkingSpaceNo;
        }
        if (this.state.otherParams.startDate !== null) {
            otherParams.startDate = this.state.otherParams.startDate;
        }
        if (this.state.otherParams.endDate !== null) {
            otherParams.endDate = this.state.otherParams.endDate;
        }
        if (this.state.otherParams.mobile !== null) {
            otherParams.mobile = this.state.otherParams.mobile;
        }
        if (this.state.otherParams.plateNumber !== null) {
            otherParams.plateNumber = this.state.otherParams.plateNumber;
        }
        otherParams.parkOrderStatus = this.state.RadioGroupParkOrderStatus;
        this.loadData(1, this.state.size, otherParams);
    }

    //重置
    handleReset () {
        this.props.form.resetFields();
        this.setState({
            otherParams: {
                parkName: null,
                parkOrderId: null,
                parkingSpaceNo: null,
                startDate: null,
                endDate: null,
                mobile: null,
                plateNumber: null,
                parkOrderStatus: null,
            },
            pageNum: 1,
            size: 10,
            RadioGroupParkOrderStatus: -1,
        }, () => {
            this.loadData()
        });
    }

    // 点击订单号
    idClick (id) {
        window.location.hash = `/DealManage/ParkingRecord/ParkingRecordDetail?id=${id}`;
    }

    // 选择订单状态
    handleSelect (e) {
        const otherParams = {
            ...this.state.otherParams,
            parkOrderStatus: e.target.value,
        };
        this.setState({
            pageNum: 1,
            RadioGroupParkOrderStatus: e.target.value,
            otherParams
        }, () => {
            this.loadData(this.state.pageNum, this.state.size, otherParams)
        });
    }

    // 当前页改变
    onPageChange (page) {
        this.setState({
            pageNum: page,
        }, () => {
            this.loadData(page, this.state.size, this.state.otherParams)
        });

    }

    // 切换页面条数
    onShowSizeChange (current, pageSize) {
        this.setState({
            pageNum: current,
            size: pageSize
        }, () => {
            this.loadData(current, pageSize, this.state.otherParams)
        });

    }

    render () {
        if (!window.checkPageEnable('/ParkingRecord')) {
            return <Exception type='403'/>;
        }
        const { loading, total, pageNum, size, parkingRecord, RadioGroupParkOrderStatus, parkingRecordDetail } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };

        // 停车记录
        const columns = [
            {
                title: '订单号',
                dataIndex: 'id',
                width: 310,
                fixed: 'left',
                render: (value) => (parkingRecordDetail ? (
                    <a onClick={this.idClick.bind(this, value)} style={{ color: '#1890FF' }}>{value}</a>) : value)
            }, {
                title: '车牌号',
                dataIndex: 'plateNumber',
                render: (value) => value || '--'
            }, {
                title: '手机号',
                dataIndex: 'mobile',
                render: (value) => value || '--'
            }, {
                title: '路段名称',
                dataIndex: 'parkingName',
                render: (value) => {
                    let strDom = null;
                    if (value) {
                        if (StringUtil.getStrFullLength(value) > 26) {
                            strDom = (
                                <Tooltip title={value}>
                                    <div
                                        style={{ maxWidth: 300 }}>{`${StringUtil.cutStrByFullLength(value, 20)}...`}</div>
                                </Tooltip>
                            )
                        } else {
                            strDom = <div style={{ maxWidth: 300 }}>{value}</div>
                        }
                    }
                    return strDom || '--'
                }
            }, {
                title: '泊位编号',
                dataIndex: 'parkingSpaceNo',
                render: (value, row) => {
                    if (row.parkOrderType === 1 || row.parkingSpaceDetector) {
                        return value
                    } else {
                        return '--'
                    }
                }
            }, {
                title: '驶入时间',
                dataIndex: 'inTime',
                render: (value) => value || '--'
            }, {
                title: '订单状态',
                dataIndex: 'parkOrderStatus',
                render: (value) => (
                    <div style={{ minWidth: 70 }}>
                        <Badge status={
                            value === 0 ? 'success' : (value === 1 || value === 5 ? 'default' : (value === 3 || value === 4 ? 'error' : 'processing'))
                        } text={status[value]}/>
                    </div>
                )
            }, {
                title: '停车时长(分钟)',
                dataIndex: 'realTime',
                render: (value) => {
                    if (value || value == 0) {
                        return value
                    } else {
                        return '--'
                    }
                }
            }
        ];

        return (
            <div className="page">
                <div className="page-header">
                    停车记录
                </div>
                <div className="page-content ">
                    {/*查询表单参数*/}
                    <Form className="parking_search_form">
                        <Row gutter={46}>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label='路段名称'>
                                    {getFieldDecorator('parkName')(
                                        <Input placeholder="请输入" onChange={(e) => {
                                            this.state.otherParams.parkName = e.target.value;
                                        }}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label='订单号'>
                                    {getFieldDecorator('parkOrderId')(
                                        <Input placeholder="请输入" onChange={(e) => {
                                            this.state.otherParams.parkOrderId = e.target.value;
                                        }}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label='泊位编号'>
                                    {getFieldDecorator('parkingSpaceNo')(
                                        <Input placeholder="请输入" onChange={(e) => {
                                            this.state.otherParams.parkingSpaceNo = e.target.value;
                                        }}/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={46}>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label='驶入时间'>
                                    {getFieldDecorator('startDate')(
                                        <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD"
                                                     onChange={(dates, dateString) => {
                                                         dateString[0].length > 0 ? (this.state.otherParams.startDate = `${dateString[0]} 00:00:00`) : (this.state.otherParams.startDate = null);
                                                         dateString[1].length > 0 ? (this.state.otherParams.endDate = `${dateString[1]} 23:59:59`) : (this.state.otherParams.endDate = null);
                                                     }}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label='手机号码'>
                                    {getFieldDecorator('mobile', {
                                        rules: [{
                                            required: false,
                                        }]
                                    })(
                                        <Input placeholder="请输入" onChange={(e) => {
                                            this.state.otherParams.mobile = e.target.value;
                                        }}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label='车牌号'>
                                    {getFieldDecorator('plateNumber')(
                                        <Input placeholder="请输入" onChange={(e) => {
                                            this.state.otherParams.plateNumber = e.target.value;
                                        }}/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        {/*操作按钮*/}
                        <Row>
                            <Col span={24} style={{ textAlign: 'right' }}>
                                <Button type="primary" onClick={this.handleSearch.bind(this)}>查询</Button>
                                <Button style={{ marginLeft: 8 }}
                                        onClick={this.handleReset.bind(this)}>重置</Button>
                            </Col>
                        </Row>
                    </Form>
                    {/*订单状态Radio*/}
                    <Row style={{ marginTop: '10px' }}>
                        <RadioGroup onChange={this.handleSelect.bind(this)} value={RadioGroupParkOrderStatus}
                                    className="parkingRecord_selection_radioGroup">
                            <RadioButton value={-1} className="selection_radio_button">全部订单状态</RadioButton>
                            <RadioButton value={0} className="selection_radio_button">停车中</RadioButton>
                            <RadioButton value={1} className="selection_radio_button">行程结束</RadioButton>
                            <RadioButton value={3} className="selection_radio_button">欠费</RadioButton>
                            <RadioButton value={4} className="selection_radio_button">异常</RadioButton>
                            <RadioButton value={2} className="selection_radio_button">退款中</RadioButton>
                        </RadioGroup>
                    </Row>
                    {/*表格*/}
                    <Spin tip="加载中.." spinning={loading}>
                        <Table
                            className="parking_table"
                            rowKey={data => data.id}
                            columns={columns}
                            dataSource={parkingRecord}
                            scroll={{ x: '120%' }}
                            pagination={false}
                        />
                        {/*分页*/}
                        {parkingRecord.length > 0 ? (
                            <div>
                                <div className="table_pagination_total">共{total}条</div>
                                <Pagination
                                    className="table_pagination"
                                    showSizeChanger
                                    showQuickJumper
                                    total={total}
                                    current={pageNum}
                                    pageSize={size}
                                    onChange={this.onPageChange.bind(this)}
                                    onShowSizeChange={this.onShowSizeChange.bind(this)}
                                />
                                <div style={{ clear: 'both' }}></div>
                            </div>
                        ) : ''}
                    </Spin>
                </div>
            </div>
        )
    }
}

const WrappedParkingRecord = Form.create()(ParkingRecord);
export default WrappedParkingRecord

import React, {Component} from 'react';
import {
    Button,
    Form,
    Select,
    Radio,
    Table,
    Row,
    Col,
    DatePicker,
    Input,
    Spin,
    Pagination,
    Badge,
    Icon,
    Tooltip
} from 'antd';
import {HttpClient} from "../../common/HttpClient";
import Exception from "../../components/Exception";
import moment from 'moment'

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

// 处理状态枚举
const statusEnum = ['', '待处理', '', '已处理', '已失效'];
// 报警类型枚举
const warningTypeEnum = ['', '长期停放', '', '同泊位异常订单', '同车牌异常订单', '同车牌异常订单'];

class AbnormalOrderAlarm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false, //表格加载状态
            AlarmRecord: [], //表格数据
            pageNum: 1, //当前页
            pageSize: 10, //一页多少数据
            total: 1, //数据总条数
            otherParams: {
                parkOrderId: null, //订单id
                parkingSpaceNo: null,//泊位编号
                plateNumber: null, //车牌
                parkOrderWarnStatus: -1, //处理状态按钮组当前值
                warningStartTime: null, //开始时间
                warningEndTime: null,//结束时间
                parkOrderWarnType: null,//报警类型 1:长期 2:异常
            },
        };
    }

    // 组件挂载之前
    componentWillMount() {
    }

    // 组件挂载后
    componentDidMount() {
        // if (window.checkPageEnable('/AbnormalParkingAlarm')) {
        this.loadData(1, 10, this.state.otherParams);
        // }
    }

    // 组件卸载之前
    componentWillUnmount() {

    }

    // 筛选参数
    filterOtherParams(otherParams) {
        let params = {};
        for (let item in otherParams) {
            if (otherParams[item] || item === 'parkOrderWarnStatus') {
                params[item] = otherParams[item]
            }
        }
        return params
    }

    //加载数据
    loadData(pageNum = 1, pageSize = 10, otherParams) {
        this.setState({
            loading: true
        });
        let params = {
            pageNum: pageNum,
            pageSize: pageSize,
            ...otherParams
        };
        params = this.filterOtherParams(params);
        HttpClient.query(window.MODULE_PARKING_ORDERS + '/parkOrder/exception/warnings', 'GET', params, this.handleQueryData.bind(this))
    }

    // loadData回调函数
    handleQueryData(d, type) {
        const data = d.data;
        if (type === HttpClient.requestSuccess) {
            this.setState({
                AlarmRecord: data.list,
                total: data.total
            })
        } else {
            //失败----做除了报错之外的操作
        }
        this.setState({
            loading: false,
        })
    }

    //查询按钮
    handleQuery() {
        const pageSize = this.state.pageSize;
        this.setState({
            pageNum: 1
        });
        this.loadData(1, pageSize, this.state.otherParams)
    }

    //重置
    handleReset() {
        this.props.form.resetFields();
        this.setState({
            pageNum: 1, //当前页
            pageSize: 10, //一页多少数据
            otherParams: {
                parkOrderWarnStatus: -1, //处理状态按钮组当前值
                startTime: null,
                endTime: null,
                warningType: null,
                parkingSpaceNo: null,
            }
        }, () => {
            this.loadData(this.state.pageNum, this.state.pageSize, this.state.otherParams)
        });
    }

    // 处理状态变化
    handleRadioSelect(e) {
        const parkOrderWarnStatus = e.target.value;
        this.setState({
            pageNum: 1,
            otherParams: {
                ...this.state.otherParams,
                parkOrderWarnStatus,
            }
        }, () => {
            this.loadData(this.state.pageNum, this.state.pageSize, this.state.otherParams)
        })
    }

    // 分页变化
    onPageChange(pageNum) {
        this.setState({
            pageNum: pageNum,
        }, () => {
            this.loadData(pageNum, this.state.pageSize, this.state.otherParams)
        });
    }

    // 分页大小变化
    onShowSizeChange(pageNum, pageSize) {
        this.setState({
            pageNum,
            pageSize
        }, () => {
            this.loadData(pageNum, pageSize, this.state.otherParams)
        });
    }

    render() {
        if (!window.checkPageEnable('/AbnormalOrderAlarm')) {
            return <Exception type='403'/>
        }
        const {loading, pageNum, pageSize, AlarmRecord, total, otherParams: {parkOrderWarnStatus}} = this.state;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19},
        };
        const columns = [
            {
                title: '订单号',
                dataIndex: 'parkOrderId',
                render: (text, record) => (
                    <a onClick={(e) => {
                        e.preventDefault();
                        location.hash = `/AlarmManage/AbnormalOrderAlarm/OrderAlarmDetail?id=${record.id}`;
                    }}>{text}</a>
                )
            }, {
                title: '报警泊位编号',
                dataIndex: 'parkingSpaceNo',
            }, {
                title: '报警车牌',
                dataIndex: 'plateNumber',
            }, {
                title: '停车时长(分钟)',
                dataIndex: 'parkingTime',
            }, {
                title: '报警时间',
                dataIndex: 'createTime',
                sorter: (a, b) => {
                    let aCreateTime = moment(a.createTime).unix() || 0;
                    let bCreateTime = moment(b.createTime).unix() || 0;
                    return aCreateTime - bCreateTime;
                },
            }, {
                title: '报警类型',
                dataIndex: 'type',
                render: (value) => warningTypeEnum[value]
            }, {
                title: '处理状态',
                dataIndex: 'status',
                render: (value) => (
                    <Badge status={
                        value === 1 ? 'processing' : 'default'
                    } text={statusEnum[value]}/>
                )
            },
            /*{
                title: '操作',
                dataIndex: 'action',
                render: (value, record) => (
                    record.status === 2 && <a onClick={(e) => {
                        e.preventDefault();
                        location.hash = `/AlarmManage/AbnormalOrderAlarm/OrderAlarmDetail?id=${record.id}`;
                    }}>编辑</a>
                )
            },*/
        ];
        const popoverInfo = (
            <div style={{width: 360, padding: 5, lineHeight: '22px', fontFamily: 'PingFangSC-Regular'}}>
                <div>1. 长期停放报警：系统对停放超过24小时的车辆会报异常；</div>
                <div>2. 同泊位异常订车：存在网络异常等问题导致同一泊位存在多笔停车订单，则泊位会报异常；</div>
                <div>3.同车牌异常订单：存在网络异常等问题，或疑为套牌车嫌疑，导致同一车辆同一时段在多个泊位存在停车订单，则泊位会报异常；</div>
            </div>
        );
        return (
            <div className='page'>
                <div className='page-header'>
                    异常订单报警
                    <Tooltip title={popoverInfo} placement='right' overlayStyle={{maxWidth: 400, width: 370}}>
                        <Icon
                            style={{color: 'rgba(0,0,0,0.45)', marginLeft: 10}}
                            type="info-circle"
                        />
                    </Tooltip>
                </div>
                <div className='page-content'>
                    {/*查询表单*/}
                    <Form>
                        <Row gutter={46}>
                            <Col span={8}>
                                <FormItem label='订单号' {...formItemLayout}>
                                    {getFieldDecorator('parkOrderId')(
                                        <Input placeholder='请输入' onChange={(e) => {
                                            this.state.otherParams.parkOrderId = e.target.value;
                                        }}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='泊位号' {...formItemLayout}>
                                    {getFieldDecorator('parkingSpaceNo')(
                                        <Input placeholder='请输入' onChange={(e) => {
                                            this.state.otherParams.parkingSpaceNo = e.target.value;
                                        }}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='车牌号' {...formItemLayout}>
                                    {getFieldDecorator('plateNumber')(
                                        <Input placeholder='请输入' onChange={(e) => {
                                            this.state.otherParams.plateNumber = e.target.value;
                                        }}/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={46}>
                            <Col span={8}>
                                <FormItem label='报警时间' {...formItemLayout}>
                                    {getFieldDecorator('warningTime')(
                                        <RangePicker style={{width: '100%'}} format="YYYY-MM-DD"
                                                     onChange={(dates, dateString) => {
                                                         this.state.otherParams.warningStartTime = dateString[0];
                                                         this.state.otherParams.warningEndTime = dateString[1];
                                                     }}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='报警类型' {...formItemLayout}>
                                    {getFieldDecorator('parkOrderWarnType')(
                                        <Select placeholder='请选择' allowClear={true} onChange={(value) => {
                                            this.state.otherParams.parkOrderWarnType = value ? parseInt(value) : null;
                                        }}>
                                            {
                                                warningTypeEnum.map((value, index) => {
                                                    if (value && index <= 4) {
                                                        return (
                                                            <Option key={index}
                                                                    value={index.toString()}>{value}</Option>
                                                        )
                                                    }
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} style={{textAlign: 'right'}}>
                                <Button type='primary' onClick={this.handleQuery.bind(this)}>查询</Button>
                                <Button style={{marginLeft: '20px'}}
                                        onClick={this.handleReset.bind(this)}>重置</Button>
                            </Col>
                        </Row>
                    </Form>
                    {/*订单状态Radio*/}
                    <Row style={{marginTop: '10px', textAlign: 'left'}}>
                        <RadioGroup onChange={this.handleRadioSelect.bind(this)} value={parkOrderWarnStatus}>
                            <RadioButton value={-1} className="selection_radio_button">全部处理状态</RadioButton>
                            <RadioButton value={1} className="selection_radio_button">待处理</RadioButton>
                            <RadioButton value={3} className="selection_radio_button">已处理</RadioButton>
                            <RadioButton value={4} className="selection_radio_button">已失效</RadioButton>
                        </RadioGroup>
                    </Row>
                    {/*表格*/}
                    <Spin tip="加载中.." spinning={loading}>
                        <Table
                            style={{marginTop: '20px'}}
                            rowKey={data => data.id}
                            columns={columns}
                            dataSource={AlarmRecord}
                            pagination={false}
                        />
                        {/*分页*/}
                        {AlarmRecord.length > 0 ? (
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
                                <div style={{clear: 'both'}}></div>
                            </div>
                        ) : ''}
                    </Spin>
                </div>
            </div>
        );
    }
}

const WrapperAbnormalOrderAlarm = Form.create()(AbnormalOrderAlarm);
export default WrapperAbnormalOrderAlarm;

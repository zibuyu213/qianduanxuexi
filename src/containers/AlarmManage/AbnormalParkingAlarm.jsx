import React, {Component} from 'react';
import {
    Button, Form, Select, Radio, Table, Row, Col, DatePicker, Input, Spin, Pagination, Badge
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
const statusEnum = ['待处理', '已处理', '已失效'];
// 报警类型枚举
const warningTypeEnum = ['', '逆向停车', '跨泊位停车', '禁停时段停车', '未付费停车', '黑名单禁停区域停车'];
// 报警设备类型枚举
const deviceTypeEnum = ['摄像头', 'UWB定位', 'UWB+摄像头双机', '地磁检测器', '车控机'];

class AbnormalParkingAlarm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false, //表格加载状态
            AlarmRecord: [], //表格数据
            pageNum: 1, //当前页
            pageSize: 10, //一页多少数据
            total: 1, //数据总条数
            otherParams: {
                warningDisposeStatus: -1, //处理状态按钮组当前值
                startTime: null, //开始时间
                endTime: null,//结束时间
                warningType: null,//报警类型
                parkingSpaceNo: null,//泊位编号
            },
        };
    }

    // 组件挂载之前
    componentWillMount() {
    }

    // 组件挂载后
    componentDidMount() {
        if (window.checkPageEnable('/AbnormalParkingAlarm')) {
            this.loadData();
        }
    }

    // 组件卸载之前
    componentWillUnmount() {

    }

    // 筛选参数
    filterOtherParams(otherParams) {
        let params = {};
        for (let item in otherParams) {
            if (otherParams[item] || item === 'warningDisposeStatus') {
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
        HttpClient.query(window.MODULE_PARKING_RESOURCE + '/admin/resource/parking/warning', 'GET', params, this.handleQueryData.bind(this))
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
                warningDisposeStatus: -1, //处理状态按钮组当前值
                startTime: null,
                endTime: null,
                warningType: null,
                parkingSpaceNo: null,
            }
        }, () => {
            this.loadData()
        });
    }

    // 处理状态变化
    handleRadioSelect(e) {
        this.setState({
            pageNum: 1,
            otherParams: {
                ...this.state.otherParams,
                warningDisposeStatus: e.target.value
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
        if (!window.checkPageEnable('/AbnormalParkingAlarm')) {
            return <Exception type='403'/>
        }
        const {loading, pageNum, pageSize, AlarmRecord, total, otherParams: {warningDisposeStatus}} = this.state;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19},
        };
        const columns = [
            {
                title: '报警类型',
                dataIndex: 'warningType',
                render: (value) => warningTypeEnum[value] || '--'
            }, {
                title: '报警时间',
                dataIndex: 'createTime',
                render: (value) => value || '--',
                sorter: (a, b) => {
                    let aCreateTime = moment(a.createTime).unix() || 0;
                    let bCreateTime = moment(b.createTime).unix() || 0;
                    return aCreateTime - bCreateTime;
                },
            }, {
                title: '报警泊位编号',
                dataIndex: 'parkingSpaceNo',
                render: (text, record) => (
                    <a onClick={(e) => {
                        e.preventDefault();
                        location.hash = `/AlarmManage/AbnormalParkingAlarm/AlarmDetail?id=${record.id}`;
                    }}>{text}</a>
                )
            }, {
                title: '报警设备类型',
                dataIndex: 'deviceType',
                render: (value) => deviceTypeEnum[value] || '--',
            }, {
                title: '报警设备位置',
                dataIndex: 'deviceLatlong',
                render: (value) => value || '--',
            }, {
                title: '处理状态',
                dataIndex: 'warningDisposeStatus',
                render: (value) => (
                    <Badge status={
                        value === 0 ? 'processing' : 'default'
                    } text={statusEnum[value]}/>
                )
            },
        ];
        return (
            <div className='page'>
                <div className='page-header'>
                    违停报警
                </div>
                <div className='page-content'>
                    {/*查询表单*/}
                    <Form className='queryForm'>
                        <Row gutter={46}>
                            <Col span={8}>
                                <FormItem label='报警时间' {...formItemLayout}>
                                    {getFieldDecorator('warningTime')(
                                        <RangePicker style={{width: '100%'}} format="YYYY-MM-DD"
                                                     onChange={(dates, dateString) => {
                                                         this.state.otherParams.startTime = dateString[0];
                                                         this.state.otherParams.endTime = dateString[1];
                                                     }}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='报警类型' {...formItemLayout}>
                                    {getFieldDecorator('warningType')(
                                        <Select placeholder='请选择' allowClear={true} onChange={(value) => {
                                            this.state.otherParams.warningType = value ? parseInt(value) : null;
                                        }}>
                                            {
                                                warningTypeEnum.map((value, index) => {
                                                    if (index > 2) {
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
                            <Col span={8}>
                                <FormItem label='泊位号' {...formItemLayout}>
                                    {getFieldDecorator('parkingSpaceNo')(
                                        <Input placeholder='请输入' onChange={(e) => {
                                            this.state.otherParams.parkingSpaceNo = e.target.value;
                                        }}/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={46}>
                            <Col style={{textAlign: 'right'}}>
                                <Button type='primary' onClick={this.handleQuery.bind(this)}>查询</Button>
                                <Button style={{marginLeft: '20px'}}
                                        onClick={this.handleReset.bind(this)}>重置</Button>
                            </Col>
                        </Row>
                    </Form>
                    {/*订单状态Radio*/}
                    <Row style={{marginTop: '10px', textAlign: 'left'}}>
                        <RadioGroup onChange={this.handleRadioSelect.bind(this)} value={warningDisposeStatus}>
                            <RadioButton value={-1} className="selection_radio_button">全部处理状态</RadioButton>
                            <RadioButton value={0} className="selection_radio_button">待处理</RadioButton>
                            <RadioButton value={1} className="selection_radio_button">已处理</RadioButton>
                            <RadioButton value={2} className="selection_radio_button">已失效</RadioButton>
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

const WrapperAbnormalParkingAlarm = Form.create()(AbnormalParkingAlarm);
export default WrapperAbnormalParkingAlarm;

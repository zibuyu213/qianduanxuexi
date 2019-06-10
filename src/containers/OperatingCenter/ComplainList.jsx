import React, {Component} from 'react';
import {
    Button, Form, Select, Radio, Table, Row, Col, DatePicker, Input, Spin, Pagination, Badge
} from 'antd';
import {HttpClientImmidIot} from "../../common/HttpClientImmidIot";
import Exception from "../../components/Exception";
import moment from 'moment'

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;


class ComplainList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false, //表格加载状态
            AlarmRecord: [
            ], //表格数据
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
      this.loadData();
         // if (window.checkPageEnable('/AbnormalParkingAlarm')) {
         //     this.loadData();
         // }
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
        HttpClientImmidIot.query('/Vip/VipLog', 'GET', params, this.handleQueryData.bind(this))
    }

    // loadData回调函数
    handleQueryData(d, type) {
        const data = d.data;
        if (type === HttpClientImmidIot.requestSuccess) {
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
    // 点击跳转详情
    idClick (id) {
        window.location.hash = `/OperatingCenter/Complain/ComplainDetails?id=${id}`;
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
                title: '投诉编号',
                dataIndex: 'uId',
                render: (value) =>  (
                    <a onClick={this.idClick.bind(this, value)} style={{ color: '#1890FF' }}>{value}</a>),
            },
            {
                title: '投诉类型',
                dataIndex: 'comfrom',
                render: (value) => value || '--',
            },
            {
                title: '投诉内容',
                dataIndex: 'openid',
                render: (value) => value || '--',
            },
            {
                title: '手机号',
                dataIndex: 'phoneNum',
                render: (value) => value || '--',
            },
            {
                title: '投诉时间',
                dataIndex: 'enrollTime',
                render: (value) => value || '--',
            },
            {
                title: '处理人',
                dataIndex: 'tate',
                render: (value) => value || '--',
            },
            {
                title: '投诉来源',
                dataIndex: 'tate',
                render: (value) => value || '--',
            },
            {
                title: '投诉状态',
                dataIndex: 'tate',
                render: (value) => value || '--',
            },
        ];
        return (
            <div className='page'>
                <div className='page-header'>
                    投诉建议
                </div>
                <div className='page-content'>
                    {/*查询表单*/}
                    <Form className='queryForm'>
                        <Row gutter={46}>
                            <Col span={8}>
                                <FormItem label='投诉内容' {...formItemLayout}>
                                    {getFieldDecorator('tousuneirong')(
                                        <Input placeholder='请输入' onChange={(e) => {
                                            this.state.otherParams.phoneNumber = e.target.value;
                                        }}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='手机号' {...formItemLayout}>
                                    {getFieldDecorator('phoneNumber')(
                                        <Input placeholder='请输入' onChange={(e) => {
                                            this.state.otherParams.phoneNumber = e.target.value;
                                        }}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='注册日期' {...formItemLayout}>
                                    {getFieldDecorator('enrollTime')(
                                        <RangePicker style={{width: '100%'}} format="YYYY-MM-DD"
                                                     onChange={(dates, dateString) => {
                                                         this.state.otherParams.startTime = dateString[0];
                                                         this.state.otherParams.endTime = dateString[1];
                                                     }}/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={46}>
                            <Col span={8}>
                                <FormItem label='投诉来源' {...formItemLayout}>
                                    {getFieldDecorator('tousulaiyuan')(
                                      <Select defaultValue="全部" style={{width: '100%'}}>
                                        <Option value="全部">全部</Option>
                                        <Option value="微信公众号">微信公众号</Option>
                                        <Option value="支付宝服务号">支付宝服务号</Option>
                                        <Option value="APP">APP</Option>
                                      </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='投诉状态' {...formItemLayout}>
                                    {getFieldDecorator('tousuzhuangtai')(
                                      <Select defaultValue="全部" style={{width: '100%'}}>
                                        <Option value="全部">全部</Option>
                                        <Option value="待处理">待处理</Option>
                                        <Option value="已结案">已结案</Option>
                                        <Option value="已生成工单">已生成工单</Option>
                                        <Option value="已关闭">已关闭</Option>
                                      </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='投诉类型' {...formItemLayout}>
                                    {getFieldDecorator('tousuleixin')(
                                      <Select defaultValue="全部" style={{width: '100%'}}>
                                        <Option value="全部">全部</Option>
                                        <Option value="泊位异常">泊位异常</Option>
                                        <Option value="充值异常">充值异常</Option>
                                        <Option value="订单异常">订单异常</Option>
                                        <Option value="其他问题">其他问题</Option>
                                        <Option value="咨询建议">咨询建议</Option>
                                      </Select>
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

const WrapperAbnormalParkingAlarm = Form.create()(ComplainList);
export default WrapperAbnormalParkingAlarm;

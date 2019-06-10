import React, {Component} from "react";
import {
    Button, Form, Select, Radio, Table, Row, Col, DatePicker, Input, Spin, Pagination, Switch, Badge,
} from "antd";
import {HttpClientImmidIot} from "../../../common/HttpClientImmidIot";


const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

class ComplainWorkOrder extends Component {
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
        window.location.hash = `/OperationsAndCenter/WorkOrder/ComplainWorkOrder/ComplainWorkOrderDetails?id=${id}`;
    }

    // 筛选参数
    filterOtherParams(otherParams) {
        let params = {};
        for (let item in otherParams) {
            if (otherParams[item] || item === "warningDisposeStatus") {
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
        HttpClientImmidIot.query("/OperationsAndCenter/WorkOrder/ComplainWorkOrder", "GET", params, this.handleQueryData.bind(this))
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



    // 组件挂载之前
    componentWillMount() {
    }

    // 组件挂载后
    componentDidMount() {
      this.loadData();
    }

    // 组件卸载之前
    componentWillUnmount() {

    }


    render() {

    const {loading, pageNum, pageSize, AlarmRecord, total, otherParams: {warningDisposeStatus}} = this.state;

    const { Option } = Select;

    function handleChange(value) {
      console.log(`selected ${value}`);
    }




          const columns = [
              {
                  title: "工单编号",
                  dataIndex: "uId",
                  render: (value) =>  (
                      <a onClick={this.idClick.bind(this, value)} style={{ color: "#1890FF" }}>{value}</a>),
              }, {
                  title: "工单级别",
                  dataIndex: "workorderPriority",
                    render: (text, record) => {
                        if(record.workorderPriority=="1"){
                            return(<span><Badge status="success" />
                            一般
                            </span>)
                        }else if(record.workorderPriority=="2"){
                            return(<span><Badge status="warning" />
                            紧急
                            </span>)
                        }else if(record.workorderPriority=="3"){
                            return(<span><Badge status="error" />
                            立即处理
                            </span>)
                        }else{
                            return(<span>
                            {record.workorderPriority}
                            </span>)
                        }
                    },
              }, {
                  title: "工单标题",
                  dataIndex: "workorderHeadline",
                  render: (value) => value || "--",
              }, {
                  title: "投诉人手机号",
                  dataIndex: "phoneNum",
                  render: (value) => value || "--",
              }, {
                  title: "投诉时间",
                  dataIndex: "creationTime",
                  render: (value) => value || "--",
              }, {
                  title: "投诉来源",
                  dataIndex: "comfrom",
                  render: (value) => value || "--",
              },{
                  title: "工单提交人",
                  dataIndex: "workorderInitiator",
                  render: (value) => value || "--",
              },{
                  title: "当前处理人",
                  dataIndex: "currentHandler",
                  render: (value) => value || "--",
              },{
                  title: "工单状态",
                  dataIndex: "workorderState",
                    render: (text, record) => {
                        if(record.workorderState=="1"){
                            return(<span><Badge status="default" />
                            待处理
                            </span>)
                        }else if(record.workorderState=="2"){
                            return(<span><Badge status="error" />
                            处理中
                            </span>)
                        }else if(record.workorderState=="3"){
                            return(<span><Badge status="success" />
                            已结案
                            </span>)
                        }else{
                            return(<span>
                            {record.workorderState}
                            </span>)
                        }
                    },
              },
          ];

        const {getFieldDecorator} = this.props.form;

        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19},
        };



        return (
             <div className="page">
                <div className="page-header">
                    投诉工单
                </div>
                <div className="page-content">
                    <Form className="queryForm">
                        <Row gutter={48}>
                            <Col span={8}>
                                <FormItem label="工单编号" {...formItemLayout}>
                                    {getFieldDecorator("workorderNumber")(
                                        <Input placeholder="请输入" onChange={(e) => {
                                            this.state.otherParams.workorderNumber = e.target.value;
                                        }}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="投诉人手机号" {...formItemLayout}>
                                    {getFieldDecorator("phoneNumber")(
                                        <Input placeholder="请输入" onChange={(e) => {
                                            this.state.otherParams.phoneNumber = e.target.value;
                                        }}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="投诉日期" {...formItemLayout}>
                                    {getFieldDecorator("enrollTime")(
                                        <RangePicker style={{width: "100%"}} format="YYYY-MM-DD"
                                            onChange={(dates, dateString) => {
                                                this.state.otherParams.startTime = dateString[0];
                                                this.state.otherParams.endTime = dateString[1];
                                                }}/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={48}>
                            <Col span={8}>
                                <FormItem label="投诉来源" {...formItemLayout}>
                                    <Select defaultValue="all"  onChange={handleChange}>
                                        <Option value="all">全部</Option>
                                        <Option value="WeChatOfficialAccount ">微信公众号</Option>
                                        <Option value="PayTreasureServiceNumber">支付宝服务号</Option>
                                        <Option value="APP">APP</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="工单级别" {...formItemLayout}>
                                    <Select defaultValue="all"  onChange={handleChange}>
                                        <Option value="all">全部</Option>
                                        <Option value="general">一般</Option>
                                        <Option value="urgency">紧急</Option>
                                        <Option value="atOnce">立即处理</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="工单状态" {...formItemLayout}>
                                    <Select defaultValue="all"  onChange={handleChange}>
                                        <Option value="all">全部</Option>
                                        <Option value="Pending">待处理</Option>
                                        <Option value="InHand ">处理中</Option>
                                        <Option value="ClosedOrders">已结案</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={48}>
                            <Col style={{textAlign: "right"}}>
                                <Button type="primary" onClick={this.handleQuery.bind(this)}>查询</Button>
                                <Button style={{marginLeft: "20px"}}
                                        onClick={this.handleReset.bind(this)}>重置</Button>
                            </Col>
                        </Row>
                    </Form>
                    <Spin tip="加载中.." spinning={loading}>




                        <Table
                            style={{marginTop: "20px"}}
                            columns={columns}
                            dataSource={AlarmRecord}
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
                                <div style={{clear: "both"}}></div>
                            </div>
                        ) : ""}
                    </Spin>
                </div>
             </div>


            );
    }
}

const WrapperAbnormalParkingAlarm = Form.create()(ComplainWorkOrder);
export default WrapperAbnormalParkingAlarm;

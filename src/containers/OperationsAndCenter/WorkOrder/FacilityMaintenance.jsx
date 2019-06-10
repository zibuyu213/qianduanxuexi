import React, {Component} from 'react';
import {
    Button, Form, Select, Radio, Table, Row, Col, DatePicker, Input, Spin, Pagination, Badge
} from 'antd';
import {HttpClientImmidIot} from "../../../common/HttpClientImmidIot";
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const Option = Select.Option;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

class FacilityMaintenance extends Component {
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

    }

    // 组件卸载之前
    componentWillUnmount() {
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
        HttpClientImmidIot.query('/OperationsAndCenter/WorkOrder/FacilityMaintenance', 'GET', params, this.handleQueryData.bind(this))
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
    handleReset(){
      this.props.form.resetFields();
      this.setState({
        pageNum: 1, //当前页
        pageSize: 10, //一页多少数据
        otherParams: {
                warningDisposeStatus: -1, //处理状态按钮组当前值
                startTime: null, //开始时间
                endTime: null,//结束时间
                warningType: null,//报警类型
                parkingSpaceNo: null,//泊位编号
            },
        },()=>{this.loadData()
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
        window.location.hash = `/OperationsAndCenter/WorkOrder/FacilityMaintenance/FacilityMaintenanceDetails?id=${id}`;
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {loading, pageNum, pageSize, AlarmRecord, total, otherParams: {warningDisposeStatus}} = this.state;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19},
        }
         // const dataSource = [
         //      {
         //        key: '1',
         //        priority: '立即处理',
         //        number: 'G02190527023',
         //        type: '车检器',
         //        title: '更换电池',
         //        content: '电量过低需要更换',
         //        order: '设备告警',
         //        initiator:'张三',
         //        hand: '张三',
         //        status: '待处理',
         //        time: '2019-05-05 21:20:22',
         //      },
         //     {
         //        key: '2',
         //        priority: '立即处理',
         //        number: 'G02190527023',
         //        type: '车检器',
         //        title: '更换电池',
         //        content: '电量过低需要更换',
         //        order: '设备告警',
         //        initiator:'张三',
         //        hand: '张三',
         //        status: '待处理',
         //        time: '2019-05-05 21:20:22',
         //      },
         //      {
         //        key: '3',
         //        priority: '立即处理',
         //        number: 'G02190527023',
         //        type: '车检器',
         //        title: '更换电池',
         //        content: '电量过低需要更换',
         //        order: '设备告警',
         //        hand: '张三',
         //        initiator: '张三',
         //        status: '待处理',
         //        time: '2019-05-05 21:20:22',
         //      },
         //    ];

        const columns = [
              {
                title: '工单编号',
                dataIndex: 'uId',
                render: (value) => (
                <a onClick={this.idClick.bind(this, value)} style={{ color: '#1890FF' }}>{value}</a>),
              },
              {
                title: '工单优先级',
                dataIndex: 'workorderPriority',
                render: (text, record) => {
                    if(record.workorderPriority=='1'){
                        return(<span><Badge status="success" />
                                空闲
                        </span>)
                    }else if(record.workorderPriority=='2'){
                         return(<span><Badge status="warning" />
                                紧急
                        </span>)
                    }else if(record.workorderPriority=='3'){
                         return(<span><Badge status="error" />
                                立即处理
                        </span>)
                    }else{
                      return(<span>
                          {record.workorderPriority}
                        </span>)
                    }
                  },
              },
              {
                title: '设备类型',
                dataIndex: 'deviceType',
                render: (value) => value || '--',
              },
               {
                title: '工单标题',
                dataIndex: 'workorderHeadline',
                render: (value) => value || '--',
              },
               {
                title: '工单内容',
                dataIndex: 'orderContent',
                render: (value) => value || '--',
              },
               {
                title: '工单来源',
                dataIndex: 'comfrom',
                render: (value) => value || '--',
              },
               {
                title: '工单发起人',
                dataIndex: 'workorderInitiator',
                render: (value) => value || '--',
              },
               {
                title: '当前处理人',
                dataIndex: 'currentHandler',
                render: (value) => value || '--',
              },
               {
                title: '工单状态',
                dataIndex: 'workorderState',
                render: (text, record) => {
                    if(record.workorderState=='1'){
                      return(<span><Badge status="error" />
                                待处理
                      </span>)
                    }else if(record.workorderState=='2'){
                       return(<span><Badge status="warning" />
                                自行处理中
                      </span>)
                    }else if(record.workorderState=='3'){
                         return(<span><Badge status="warning" />
                                厂家处理中
                      </span>)
                    }else if(record.workorderState=='4'){
                           return(<span><Badge status="processing" />
                                验收中
                        </span>)
                    }else if(record.workorderState=='5'){
                           return(<span><Badge status="success" />
                                工单完成
                        </span>)
                    }else{
                      return(<span>
                          {record.workorderState}
                    </span>)
                    }
                  },
              },
               {
                title: '创建时间',
                dataIndex: 'creationTime',
                render: (value) => value || '--',
              },
            ];

         return (
            <div className='page'>
                <div className='page-header'>
                    设备维保
                </div>

                <div className='page-content'>
                    <Form className='queryForm'>
                        <Row gutter={46}>
                            <Col span={8}>
                                <FormItem label='工单编号' {...formItemLayout}>
                                        {getFieldDecorator('uId')(
                                            <Input style={{ width: 240 }} placeholder='请输入' onChange={(e) => {
                                                this.state.otherParams.phoneNumber = e.target.value;
                                            }}/>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                               <FormItem label='设备类型' {...formItemLayout}>
                                 {getFieldDecorator('deviceType')(
                                      <Select placeholder='全部' defaultValue="全部" style={{ width: 240 }}>
                                            <Option value="jack">类型1</Option>
                                            <Option value="lucy">类型2</Option>
                                            <Option value="Yiminghe">类型3</Option>
                                          </Select>
                                        )}
                                </FormItem>
                            </Col>
                             <Col span={8}>
                               <FormItem label='工单优先级' {...formItemLayout}>
                                  {getFieldDecorator('workorderPriority')(
                                       <Select placeholder='全部' defaultValue="全部" style={{ width: 240 }}>
                                             <Option value="jack">一般</Option>
                                             <Option value="lucy">紧急</Option>
                                             <Option value="Yiminghe">立即处理</Option>
                                           </Select>
                                           )}
                                </FormItem>
                            </Col>
                        </Row>
                         <Row gutter={46}>
                            <Col span={8}>
                                <FormItem label='工单状态' {...formItemLayout}>
                                  {getFieldDecorator('workorderState')(
                                      <Select placeholder='全部' defaultValue="全部" style={{ width: 240 }}>
                                            <Option value="1">待处理</Option>
                                            <Option value="2">自行处理中</Option>
                                            <Option value="3">厂家处理中</Option>
                                            <Option value="4">验收中</Option>
                                            <Option value="5">工单完成</Option>
                                        </Select>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                               <FormItem label='创建日期' {...formItemLayout}>
                                     {getFieldDecorator('creationTime')(
                                         <RangePicker style={{width:360}} format="YYYY-MM-DD"
                                            onChange={(dates, dateString) => {
                                                this.state.otherParams.startTime = dateString[0];
                                                this.state.otherParams.endTime = dateString[1];
                                            }}/>
                                     )}
                                </FormItem>
                            </Col>
                             <Col span={8} style={{textAlign:'right'}}>
                                            <Button type="primary" onClick={this.handleQuery.bind(this)}>查询</Button>
                                            <Button onClick={this.handleReset.bind(this)} style={{marginLeft: '20px'}}>重置</Button>
                            </Col>
                        </Row>
                    </Form>

                    <Spin tip='加载中...' spinning={loading}>
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

const WrapperAbnormalParkingAlarm = Form.create()(FacilityMaintenance);
export default WrapperAbnormalParkingAlarm;

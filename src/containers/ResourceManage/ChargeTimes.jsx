import React, {Component, Fragment} from 'react';

import {Button, Form, Row, Col, Input, Radio, Table, Pagination, Spin, Badge, Popconfirm, message, Popover} from 'antd';
import {custom} from "../../common/SystemStyle";
import {HttpClient} from "../../common/HttpClient";
import Exception from "../../components/Exception";

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class ChargeTimes extends Component {
    constructor (props) {
        super(props);
        this.state = {
            chargeList: [], //表格数据
            optionalParams: {
                name: null,
                number: null,
                status: -1,
            },
            isLoading: false,
            total: 10,
            pageNum: 1,
            pageSize: 10,
        };
    }

    // 组件挂载之前
    componentWillMount () {
    }

    // 组件挂载后
    componentDidMount () {
        this.loadData()
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
    loadData (otherParams = this.state.optionalParams) {
        this.setState({
            isLoading: true
        });
        let queryParams = {
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize,
            status: this.state.RadioGroupOrderStatus,
            ...otherParams,
        };
        queryParams = this.filterParams(queryParams);
        console.log(queryParams);
        // return;
        HttpClient.query(`${window.MODULE_PARKING_RESOURCE}/parkTimeFrame/list`, "GET", queryParams, this.handleQuery.bind(this));
    }

    handleQuery (d, type) {
        // console.log('接口请求回调，停车记录列表：', d);
        const data = d.data;
        if (type === HttpClient.requestSuccess) {
            //成功-------在这里做你的数据处理
            this.setState({
                total: data.total,
                chargeList: data.list,
            });
        } else {
            //失败----做除了报错之外的操作
        }
        this.setState({
            isLoading: false,
        })
    }

    handleSearch () {
        this.loadData()
    }

    handleReset () {
        this.props.form.resetFields();
        const optionalParams = {
            name: null,
            number: null,
            status: -1,
        };
        this.setState({
            pageNum: 1,
            pageSize: 10,
            optionalParams
        }, () => {
            this.loadData()
        })
    }

    onRadioGroupChange (e) {
        let optionalParams = this.state.optionalParams;
        optionalParams.status = e.target.value;
        this.setState({
            optionalParams
        }, () => {
            this.loadData()
        })
    }

    onPageChange (page) {
        this.setState({
            pageNum: page,
        }, () => {
            this.loadData()
        });
    }

    onShowSizeChange (current, pageSize) {
        this.setState({
            pageNum: current,
            pageSize: pageSize
        }, () => {
            this.loadData()
        });
    }

    configState (status) {
        let content = null;
        if (status) {
            content = <Badge status="success" text="已启用"/>;
        } else {
            content = <Badge status="error" text="已停用"/>;
        }
        return content;
    }

    // 查看详情
    handleToDetail (id) {
        location.hash = '#/ResourceManage/ChargeTimes/ChargeTimesDetails?id=' + id
    }

    displayData (row, key1, key2) {
        if (row[key1] === null || row[key2] === null) {
            return "未设置";
        } else {
            return row[key1] + "~" + row[key2];
        }
    }

    // 新建
    handleToInsert () {
        location.hash = '/ResourceManage/ChargeTimes/InsertChargeTimes'
    }

    // 编辑
    handleToChargeTimesEdit (id) {
        location.hash = '#/ResourceManage/ChargeTimes/EditChargeTimes?id=' + id
    }

    // 停启用计费时段
    handleChangeStatus (row) {
        const params = { status: !row.status ? 1 : 0 };
        HttpClient.query(`/parking-resource/parkTimeFrame/${row.id}/status`, 'PUT', params, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                message.success(d.data);
                this.loadData()
            }
        }, 'application/x-www-form-urlencoded')
    }

    render () {
        if (!window.checkPageEnable('/ChargeTimes')) return <Exception type='403'/>;
        const { optionalParams } = this.state;
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                title: '收费时段编号',
                dataIndex: 'number',
                width: 200,
                fixed: 'left',
                render: (value, row) => (
                    window.checkPageEnable('chargeTimesEdit') ? // 新增&修改-可看详情
                        <a style={{ color: '#1890FF' }}
                           onClick={this.handleToDetail.bind(this, row.id)}>{value}</a> : value)
            }, {
                title: '收费时段名称',
                dataIndex: 'name',
                width: 200,
            }, {
                title: '工作日',
                className: 'column-content-time',
                dataIndex: 'workingDay',
                render: (value, row) => (
                    <div>
                        <div
                            className="sectionResource_table_time_text">禁停时段：{this.displayData(row, "workdayForbidStartTime", "workdayForbidEndTime")}</div>
                        <div
                            className="sectionResource_table_time_text">免费时段：{this.displayData(row, "workdayFreeStartTime", "workdayFreeEndTime")}</div>
                        <div
                            className="sectionResource_table_time_text">白天时段：{this.displayData(row, "workdayDaytimeStartTime", "workdayDaytimeEndTime")}</div>
                        <div
                            className="sectionResource_table_time_text">夜间时段：{this.displayData(row, "workdayNighttimeStartTime", "workdayNighttimeEndTime")}</div>
                    </div>
                )
            }, {
                title: '非工作日',
                className: 'column-content-time',
                dataIndex: 'restDay',
                render: (value, row) => (
                    <div>
                        <div
                            className="sectionResource_table_time_text">禁停时段：{this.displayData(row, "weekendForbidStartTime", "weekendForbidEndTime")}</div>
                        <div
                            className="sectionResource_table_time_text">免费时段：{this.displayData(row, "weekendFreeStartTime", "weekendFreeEndTime")}</div>
                        <div
                            className="sectionResource_table_time_text">白天时段：{this.displayData(row, "weekendDaytimeStartTime", "weekendDaytimeEndTime")}</div>
                        <div
                            className="sectionResource_table_time_text">夜间时段：{this.displayData(row, "weekendNighttimeStartTime", "weekendNighttimeEndTime")}</div>
                    </div>
                )
            }, {
                title: '应用路段',
                dataIndex: 'parkingNameList',
                render: (value) => (
                    value.join('、')
                )
            }, {
                title: '运行状态',
                dataIndex: 'status',
                width: 80,
                fixed: 'right',
                className: 'column-status-charge',
                render: (value) => this.configState(value)
            }
        ];
        if (window.checkPageEnable('chargeTimesEdit')) {
            columns.push({
                title: '操作',
                dataIndex: 'action',
                width: 150,
                fixed: 'right',
                render: (value, row) => (
                    <div style={{ display: 'flex' }}>
                        <a onClick={this.handleToChargeTimesEdit.bind(this, row.id)}>编辑</a>
                        {/*中间的竖线*/}
                        <span style={{
                            width: '1px',
                            height: '13px',
                            backgroundColor: '#C0C0C0',
                            marginLeft: '6px',
                            marginTop: '4px'
                        }}/>
                        {
                            (row.parkingNameList && row.parkingNameList.length > 0) ? (
                                <Popover placement="topRight" title="" content="此计费时段正在应用，无法修改状态" trigger="hover">
                                    <a style={{ marginLeft: '5px' }}>{row.status ? '停用' : '启用'}</a>
                                </Popover>
                            ) : (
                                <Popconfirm
                                    placement="topRight"
                                    title={`你确定${row.status ? '停用' : '启用'}此收费时段吗？`}
                                    onConfirm={this.handleChangeStatus.bind(this, row)}
                                    okText="确定"
                                    cancelText="取消"
                                >
                                    <a style={{ marginLeft: '5px' }}>{row.status ? '停用' : '启用'}</a>
                                </Popconfirm>
                            )
                        }
                    </div>
                )
            });
        }
        return (
            <div className='page'>
                <div className='page-header'>
                    收费时段
                </div>
                <div className='page-content'>
                    <Form>
                        <Row gutter={46}>
                            <Col span={8}>
                                <FormItem label='时段名称' labelCol={{ span: 5 }}
                                          wrapperCol={{ span: 19 }}>
                                    {getFieldDecorator('chargeName')(
                                        <Input
                                            placeholder="请输入"
                                            onChange={((e) => {
                                                this.state.optionalParams.name = e.target.value;
                                            })}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='时段编号' labelCol={{ span: 5 }}
                                          wrapperCol={{ span: 19 }}>
                                    {getFieldDecorator('chargeNo')(
                                        <Input placeholder="请输入" onChange={((e) => {
                                            console.log(e);
                                            this.state.optionalParams.number = e.target.value;
                                        })}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem>
                                    <Button type="primary" className="list_filter_button"
                                            onClick={this.handleSearch.bind(this)}>查询</Button>
                                    <Button className="list_filter_button"
                                            onClick={this.handleReset.bind(this)}>重置</Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>

                    <div className="list_operation_box">
                        {
                            window.checkPageEnable('chargeTimesEdit') && (
                                <Button type="primary" icon={"plus"}
                                        style={{ float: 'left' }}
                                        onClick={this.handleToInsert.bind(this)}>
                                    新建
                                </Button>
                            )
                        }
                        <RadioGroup onChange={this.onRadioGroupChange.bind(this)} defaultValue={optionalParams.status}
                                    style={{ float: 'right' }}>
                            <RadioButton value={-1}>全部</RadioButton>
                            <RadioButton value={1}>已启用</RadioButton>
                            <RadioButton value={0}>已停用</RadioButton>
                        </RadioGroup>
                        <div style={custom.clear}/>
                    </div>
                    <Spin tip="加载中.." spinning={this.state.isLoading}>
                        <Table
                            className="sectionResource_table"
                            rowKey={(row) => row.id}
                            columns={columns}
                            dataSource={this.state.chargeList}
                            pagination={false}
                            scroll={{ x: '120%' }}
                        />
                        <div>
                            <div className="sectionResource_table_total">共{this.state.total}条</div>
                            <Pagination
                                className="sectionResource_table_pagination"
                                showSizeChanger
                                showQuickJumper
                                total={this.state.total}
                                current={this.state.pageNum}
                                pageSize={this.state.pageSize}
                                onChange={this.onPageChange.bind(this)}
                                onShowSizeChange={this.onShowSizeChange.bind(this)}
                            />
                            <div style={custom.clear}/>
                        </div>
                    </Spin>
                </div>
            </div>
        );
    }
}

export default Form.create()(ChargeTimes)

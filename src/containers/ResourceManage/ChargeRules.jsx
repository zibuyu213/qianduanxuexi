import React, {Component} from 'react';
import {CSS} from "./Style/Rule.css";
import './Style/SectionResource.css'
import {HttpClient} from "../../common/HttpClient";
import {custom} from "../../common/SystemStyle";
import Exception from '../../components/Exception';

import {Button, Form, Table, Pagination, message, Popconfirm, Radio, Input, Popover, Badge, Spin, Row, Col} from "antd";

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


class ChargeRules extends Component {
    constructor(props) {
        super(props);

        message.config({
            duration: 1
        });

        this.state = {
            pageSize: 10,            // 当前页面
            pageNum: 1,       // 页面条数
            total: 0,          // 总共查询数量
            //列表参数
            ruleList: [],
            ruleName: "",
            ruleNumber: "",
            ruleStatus: undefined,
            isLoading: false
        }
    }


    componentWillMount() {

    }

    componentDidMount() {
        this.queryRuleList();
    }


    queryRuleList() {
        this.setState({
            isLoading: true
        });
        let params = {
            pageSize: this.state.pageSize,
            pageNum: this.state.pageNum
        };

        if (this.state.ruleName.length > 0) {
            params.ruleName = this.state.ruleName;
        }
        if (this.state.ruleNumber.length > 0) {
            params.ruleNumber = this.state.ruleNumber;
        }
        if (this.state.ruleStatus != undefined) {
            params.ruleStatus = this.state.ruleStatus;
        }
        console.log(params);
        HttpClient.query(`/parking-resource/parkingPriceRules`, "GET", params, this.fetchRuleList.bind(this));
    }

    fetchRuleList(e, type) {
        this.setState({
            isLoading: false
        });
        if (type == HttpClient.requestSuccess) {
            //成功
            this.setState({
                ruleList: e.data.list,
                total: e.data.total
            });
        }
    }

    handleSearch() {
        this.state.pageNum = 1;
        //load data
        this.queryRuleList();
    }

    // 重置
    handleReset() {
        this.props.form.resetFields();
        this.state.ruleName = "";
        this.state.ruleNumber = "";
        this.state.pageNum = 1;
        this.state.pageSize = 10;
        //load data
        this.queryRuleList();
    }

    //跳转详情
    handleToDetail(id) {
        window.location.hash = '/ResourceManage/ChargeRules/DisplayChargeRules?id=' + id;
    }

    //跳转编辑
    handleToEdit(id) {
        window.location.hash = '/ResourceManage/ChargeRules/EditChargeRules?id=' + id;
    }

    //跳转新增
    handleToInsert() {
        if (window.checkPageEnable("chargeRuleAdd")) {
            window.location.hash = '/ResourceManage/ChargeRules/InsertChargeRules';
        } else {
            message.error("您无权限新增计费规则，请联系管理员！");
        }

    }

    //停启用
    handleChangeStatus(e) {
        let status = !e.status;


        let params = {
            status: !e.status
        };
        // console.log(params);
        let id = 1001;
        if (HttpClient.REQUEST === "truth") {
            id = e.id
        }
        HttpClient.query(`/parking-resource/parkingPriceRules/` + id + `/status`, HttpClient.PUT, params, this.fetchOperation.bind(this), 'application/x-www-form-urlencoded;charset=UTF-8');
    }


    fetchOperation(e, type) {
        if (type === HttpClient.requestSuccess) {
            message.success(e.data);
            this.queryRuleList();
        }
    }


    //radio
    onChange(e) {
        console.log(`radio checked:${e.target.value}`);
        if (e.target.value == "all") {
            this.state.ruleStatus = undefined;
        } else {
            this.state.ruleStatus = e.target.value;
        }
        this.state.pageNum = 1;
        this.queryRuleList();
    }

    //table
    //分页
    onPageChange(page, pageSize) {
        console.log(page);
        this.state.pageNum = page;
        this.state.pageSize = pageSize;
        this.queryRuleList();
    }

    // 切换页面条数
    onShowSizeChange(page, pageSize) {
        this.state.pageNum = 1;
        this.state.pageSize = pageSize;
        this.queryRuleList();
    };

    configState(status) {
        let content = null;
        if (status) {
            content = <Badge status="success" text="已启用"/>;
        } else {
            content = <Badge status="error" text="已停用"/>;
        }
        return content;

    }


    render() {
        //判断页面权限
        if (!window.checkPageEnable("/ChargeRules")) {
            return <Exception type={403}/>
        }


        const {getFieldDecorator} = this.props.form;


        const columns = [{
            title: '计费规则名称',
            dataIndex: 'name',
            render: (value, row) => (
                window.checkPageEnable('chargeRuleAdd') || window.checkPageEnable('chargeRuleUpdate') ?//新增&修改-可看详情
                    <a style={{color: '#1890FF'}} onClick={this.handleToDetail.bind(this, row.id)}>{value}</a> : value)
        }, {
            title: '规则编号',
            dataIndex: 'number'
        }, {
            title: '应用路段',
            dataIndex: 'parkingNames'
        }, {
            title: '状态',
            dataIndex: 'status',
            className: 'column-status-charge',
            render: (value) => this.configState(value)
        }];

        if (window.checkPageEnable("chargeRuleStatusUpdate") || window.checkPageEnable("chargeRuleUpdate")) {
            columns.push({
                title: '操作',
                key: 'action',
                className: 'column-action-charge',
                render: (value, row) => (
                    <span style={{display: 'flex'}}>
                        {window.checkPageEnable("chargeRuleUpdate") ?
                            <div>
                                {value.status === true && value.parkingNames && value.parkingNames.length > 0 ?
                                    <Popover placement="topRight" title="" content="此计费规则正在应用，无法编辑" trigger="hover">
                                        <a>编辑</a>
                                    </Popover>
                                    :
                                    <a onClick={this.handleToEdit.bind(this, row.id)}>编辑</a>}
                            </div>
                            :
                            ""
                        }
                        {window.checkPageEnable("chargeRuleStatusUpdate") && window.checkPageEnable("chargeRuleUpdate") ?
                            <span style={{
                                width: '1px',
                                height: '13px',
                                backgroundColor: '#C0C0C0',
                                marginLeft: '5px',
                                marginRight: '5px',
                                marginTop: '4px'
                            }}/>
                            :
                            ""
                        }
                        {window.checkPageEnable("chargeRuleStatusUpdate") ?
                            <div>
                                {value.status === true && value.parkingNames && value.parkingNames.length > 0 ?
                                    <Popover placement="topRight" title="" content="此计费规则正在应用，无法修改状态" trigger="hover">
                                        <a>{value.status ? '停用' : '启用'}</a>
                                    </Popover>
                                    :
                                    <Popconfirm
                                        placement="topRight"
                                        title={`你确定${value.status ? '停用' : '启用'}计费规则吗？`}
                                        onConfirm={this.handleChangeStatus.bind(this, value)}
                                        okText="确定"
                                        cancelText="取消"
                                    >
                                        <a>{value.status ? '停用' : '启用'}</a>
                                    </Popconfirm>
                                }
                            </div>
                            :
                            ""
                        }

                </span>
                )
            })
        }


        return (
            <div className="page">
                <div className="page-header">计费规则</div>
                <div className="page-content">
                    <Form>
                        <Row gutter={46}>
                            <Col span={8}>
                                <FormItem label='规则名称' labelCol={{span: 5}}
                                          wrapperCol={{span: 19}}>
                                    {getFieldDecorator('ruleName')(
                                        <Input
                                            placeholder="请输入"
                                            onChange={((e) => {
                                                this.state.ruleName = e.target.value;
                                            })}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='规则编号' labelCol={{span: 5}}
                                          wrapperCol={{span: 19}}>
                                    {getFieldDecorator('ruleNo')(
                                        <Input placeholder="请输入" onChange={((e) => {
                                            this.state.ruleNumber = e.target.value;
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
                        {window.checkPageEnable('chargeRuleAdd') ?
                            <Button type="primary" icon={"plus"}
                                    style={{float: 'left'}}
                                    onClick={this.handleToInsert.bind(this)}>
                                新建
                            </Button>
                            :
                            ""
                        }


                        <RadioGroup onChange={this.onChange.bind(this)} defaultValue="all" style={{float: 'right'}}>
                            <RadioButton value="all">全部</RadioButton>
                            <RadioButton value={true}>已启用</RadioButton>
                            <RadioButton value={false}>已停用</RadioButton>
                        </RadioGroup>

                        <div style={custom.clear}></div>

                    </div>

                    <Spin tip="加载中.." spinning={this.state.isLoading}>
                        <Table
                            className="sectionResource_table"
                            rowKey="id"
                            columns={columns}
                            dataSource={this.state.ruleList}
                            pagination={false}
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
                            <div style={custom.clear}></div>
                        </div>
                    </Spin>
                </div>
            </div>
        )
    }


}

export default Form.create()(ChargeRules);

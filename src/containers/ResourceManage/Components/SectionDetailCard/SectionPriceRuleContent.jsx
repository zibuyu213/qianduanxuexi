import React, {Component} from 'react';
import {Table, message, Radio, DatePicker, Button, Modal, Select, Popconfirm, Form} from 'antd';
import {CSS} from "../../Style/SectionDetails.css";
import {custom} from "../../../../common/SystemStyle";
import {HttpClient} from '../../../../common/HttpClient.jsx';
import {Global} from "../../../../common/SystemFunction";
import moment from 'moment';
import {react} from 'react.eval';
import _ from 'lodash';

const dateFormat = 'YYYY-MM-DD';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const {RangePicker} = DatePicker;

const radioStyle = {
    display: 'block',
    height: '32px',
    lineHeight: '32px',
    fontSize: "14px",
    color: "rgba(0,0,0,0.65)"
};

class SectionPriceRuleContent extends Component {
    constructor(props) {
        super(props);

        message.config({
            duration: 1
        });

        this.state = {
            ruleList: [],
            isInsertBind: false,      //绑定计费规则
            isEditBind: false,   //修改绑定
            selectRule: undefined,
            effective: 1,
            start: undefined,
            end: undefined,
            selectCarType: undefined, //应用车型
            //编辑
            currentBindRule: undefined
        }
    }

    componentWillMount() {

    }

    componentDidMount() {
        window.checkPageEnable("sectionChargeRuleSet") && this.queryRuleList();
    }

    //获取规则列表
    queryRuleList() {
        let params = {
            ruleStatus: true,
            pageNum: 1,
            pageSize: 10000
        };
        HttpClient.query("/parking-resource/parkingPriceRules", HttpClient.GET, params, this.fetchRuleList.bind(this));
    }

    fetchRuleList(e, type) {
        if (type === HttpClient.requestSuccess) {
            this.setState({
                ruleList: e.data.list
            })
        }
    }

    //触发新增绑定按钮
    handleInsertBindClick() {
        this.setState({
            isInsertBind: true,
            //数据重置
            selectRule: undefined,
            start: undefined,
            end: undefined,
            effective: 1
        });
    }

    //提交新增
    insertBindSubmit() {
        this.props.form.validateFields((err, values) => {
            if (err) return;
            let id = 1001;
            if (HttpClient.REQUEST === "truth") {
                id = this.props.parkId;
            }
            let params = {
                parkingId: id,
                effective: this.state.effective,
                parkingPriceRuleId: this.state.selectRule.id,
                carType: this.state.selectCarType,
            };
            if (values.effective) {
                params.startTime = this.state.start;
                params.endTime = this.state.end
            }
            console.log(params);
            HttpClient.query(`${window.MODULE_PARKING_RESOURCE}/admin/resource/parking/${id}/parkingPriceRule`, HttpClient.POST, params, this.fetchInsertBind.bind(this), 'application/x-www-form-urlencoded;charset=UTF-8');
        });
    }

    fetchInsertBind(e, type) {
        if (type === HttpClient.requestSuccess) {
            message.success(e.data, 1, () => {
                //刷新数据
                react('SectionDetailCard.queryRoadResource');
            });
            this.insertBindCancel();
        }
    }

    //取消新增
    insertBindCancel() {
        this.setState({
            isInsertBind: false,
            selectRule: undefined,
            start: undefined,
            end: undefined,
            selectCarType: undefined,
            effective: 1
        });
    }

    //触发编辑绑定按钮
    handleEditBindClick(target) {
        this.setState({
            isEditBind: true,
            //设置当前选中值
            currentBindRule: Global.deepCopy(target)
        })
    }

    //提交编辑
    editBindSubmit() {
        this.props.form.validateFields((err, values) => {
            if (err) return;
            let parkingId = "{parkingId}";
            let id = "{id}";
            if (HttpClient.REQUEST === "truth") {
                parkingId = this.props.parkId;
                id = this.state.currentBindRule.id;
            }

            let params = {
                parkingId: this.props.parkId,
                parkingPriceRuleId: this.state.currentBindRule.parkingPriceRuleId,
                effective: this.state.currentBindRule.effective,
                carType: this.state.currentBindRule.carType,
            };
            if (this.state.currentBindRule.effective === 0) {
                params.startTime = this.state.currentBindRule.startTime;
                params.endTime = this.state.currentBindRule.endTime;

            }
            HttpClient.query('/parking-resource/admin/resource/parking/' + parkingId + '/parkingPriceRule/' + id, HttpClient.PUT, params, this.fetchEditBind.bind(this), 'application/x-www-form-urlencoded');
        });
    }

    fetchEditBind(e, type) {
        if (type === HttpClient.requestSuccess) {
            message.success(e.data, 1, () => {
                //刷新数据
                react('SectionDetailCard.queryRoadResource');
            });
            this.editBindCancel();
        }
    }

    //取消编辑
    editBindCancel() {
        this.setState({
            isEditBind: false,
            currentBindRule: undefined
        });
    }


    //其他组件事件
    handleRuleChange(e) {
        console.log(e);
        let rule = this.state.ruleList.find(item => {
            return item.id + "" === e;
        });
        this.state.selectRule = rule;
    }

    onInsertRadioChange(e) {
        this.state.start = undefined;
        this.state.end = undefined;
        this.setState({
            effective: e.target.value,
        });
    }

    onInsertDateRangePickerChange(dates, dateStrings) {
        if (dates.length > 0) {
            this.state.start = dateStrings[0] + " 00:00:00";
            this.state.end = dateStrings[1] + " 23:59:59";
        } else {
            this.state.start = undefined;
            this.state.end = undefined;
        }
    }


    onEditRadioChange(e) {
        this.state.currentBindRule.effective = e.target.value;
        this.setState({
            currentBindRule: this.state.currentBindRule
        });
    }

    onEditDateRangePickerChange(dates, dateStrings) {
        console.log(dates);
        if (dates.length > 0) {
            this.state.currentBindRule.startTime = dateStrings[0] + " 00:00:00";
            this.state.currentBindRule.endTime = dateStrings[1] + " 23:59:59";
        } else {
            this.state.currentBindRule.startTime = undefined;
            this.state.currentBindRule.endTime = undefined;
        }
        this.setState({
            currentBindRule: this.state.currentBindRule
        });
    }

    handleToRuleDetails(id) {
        if (window.checkPageEnable("sectionChargeRuleAdd") || window.checkPageEnable("chargeRuleUpdate")) {
            let currentId = this.props.parkId;
            window.localStorage.setItem("RoadResourceId", currentId);
            location.hash = window.location.hash.split("#")[1].split('?')[0] + '/DisplayChargeRules?id=' + id;
        } else {
            message.error("您无权限访问计费规则详情，请联系管理员！");
        }
    }

    unbind(e) {
        console.log(e);
        let id = "{id}";
        if (HttpClient.REQUEST === "truth") {
            id = e.id;
        }
        HttpClient.query('/parking-resource/admin/resource/parking/parkingPrice/parkingPriceRules/' + id, HttpClient.DELETE, null, this.fetchUnbind.bind(this));

    }

    fetchUnbind(e, type) {
        if (type === HttpClient.requestSuccess) {
            message.success(e.data, 1, () => {
                //刷新数据
                react('SectionDetailCard.queryRoadResource');
            });
        }
    }

    // 应用车型变化
    handleCarTypeChange(value) {
        this.state.selectCarType = value
    }

    render() {
        const carType = ['基础-小型车+蓝牌非新能源车', '大型车+蓝牌非新能源车', '小型车+绿牌新能源车', '大型车+绿牌新能源车'];
        const columns = [{
            title: '计费规则',
            dataIndex: 'parkingPriceRuleName',
            render: (value, row) => (
                window.checkPageEnable('sectionChargeAdd') || window.checkPageEnable("chargeRuleUpdate") ?
                    <a style={{color: '#1890FF'}}
                       onClick={this.handleToRuleDetails.bind(this, row.parkingPriceRuleId)}>{value}</a> : value)
        }, {
            title: '适用车型',
            dataIndex: 'carType',
            render: (value, row) => (
                <div>
                    {carType[value]}
                </div>
            )

        }, {
            title: '应用时段',
            dataIndex: 'parkingPriceTime',
            render: (value, row) => (
                <div>
                    {row.effective === 0 ? ("生效" + row.startTime + "至失效" + row.endTime) : "长期生效"}
                </div>
            )
        }];
        if (window.checkPageEnable("sectionChargeRuleSet")) {
            columns.push({
                title: '操作',
                key: 'action',
                render: (value, row) => (
                    <div style={{display: 'flex'}}>
                        <a onClick={this.handleEditBindClick.bind(this, row)}>编辑</a>
                        {/*中间的竖线*/}

                        <span style={{
                            width: '1px',
                            height: '13px',
                            backgroundColor: '#C0C0C0',
                            marginLeft: '3px',
                            marginTop: '4px'
                        }}/>
                        <Popconfirm
                            placement="topRight"
                            title={`你确定解绑计费规则吗？`}
                            onConfirm={this.unbind.bind(this, value)}
                            okText="确定"
                            cancelText="取消"
                        >
                            <a style={{marginLeft: '5px'}}>解绑</a>
                        </Popconfirm>
                    </div>

                )
            })
        }
        const formModalLayout = {
            labelCol: {
                xs: {span: 20},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 20},
                sm: {span: 18},
            },
        };
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                {window.checkPageEnable("sectionChargeRuleSet") ?
                    <Button type="primary" style={{marginBottom: "16px"}} icon={"plus"}
                            onClick={this.handleInsertBindClick.bind(this)}>绑定计费规则</Button> : ""}
                <Table
                    rowKey={data => {
                        return data.id
                    }}
                    columns={columns}
                    dataSource={this.props.parkingPrice ? _.toArray(this.props.parkingPrice) : []}
                    pagination={false}
                />
                {/*新增绑定弹窗*/}
                {this.state.isInsertBind ?
                    <Modal
                        maskClosable={false}
                        title="绑定计费规则"
                        destroyOnClose
                        centered
                        visible={true}
                        onOk={this.insertBindSubmit.bind(this)}
                        onCancel={this.insertBindCancel.bind(this)}
                    >
                        <Form className="sectionDetails_Model_box">
                            <FormItem
                                label='应用计费规则' {...formModalLayout}
                                require={true}>
                                {getFieldDecorator('selectChargeRule', {
                                    rules: [{
                                        required: true,
                                        message: '请选择计费规则'
                                    }]
                                })(
                                    <Select
                                        showSearch
                                        placeholder="请选择计费规则"
                                        onChange={this.handleRuleChange.bind(this)}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        optionFilterProp="children"
                                    >
                                        {this.state.ruleList.map(item => {
                                            return <Select.Option key={item.id}
                                                                  value={item.id + ""}>{item.name}</Select.Option>
                                        })}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem label='应用车型' {...formModalLayout}
                                      require={true}>
                                {getFieldDecorator('selectCarType', {
                                    rules: [{
                                        required: true,
                                        message: '请选择应用车型'
                                    }]
                                })(
                                    <Select
                                        placeholder="请选择应用车型"
                                        onChange={this.handleCarTypeChange.bind(this)}
                                    >
                                        {carType.map((item, index) => {
                                            return <Select.Option key={index} value={index}>{item}</Select.Option>
                                        })}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem label='应用时段' {...formModalLayout}
                                      require={true}>
                                <RadioGroup onChange={this.onInsertRadioChange.bind(this)} value={this.state.effective}>
                                    <Radio style={radioStyle} value={1}>长期生效</Radio>
                                    <Radio style={Object.assign({}, radioStyle, {marginTop: "16px"})} value={0}>
                                        自定义时间
                                        {!this.state.effective ? getFieldDecorator('effective', {
                                                rules: [{
                                                    required: true,
                                                    message: '请选择自定义时间'
                                                }]
                                            })(
                                            <RangePicker placeholder={['开始时间', '结束时间']}
                                                         format={dateFormat}
                                                         style={{width: 252}}
                                                         className="sectionDetails_Model_range_picker"
                                                         onChange={this.onInsertDateRangePickerChange.bind(this)}
                                            />
                                            )
                                            : null}
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                            {/*<div className="sectionDetails_Model_title"><span className="sectionDetails_Model_require_status">*</span>应用计费规则：</div>*/}

                            {/*<div style={custom.clear}/>*/}
                            {/*<div className="sectionDetails_Model_title" style={{marginTop:"37px"}}><span className="sectionDetails_Model_require_status">*</span>应用时段：</div>*/}

                            {/*<div style={custom.clear}/>*/}
                        </Form>
                    </Modal>
                    :
                    ""
                }
                {/*编辑绑定弹窗*/}
                {this.state.isEditBind ?
                    <Modal
                        maskClosable={false}
                        title="编辑绑定计费规则"
                        destroyOnClose
                        centered
                        visible={true}
                        onOk={this.editBindSubmit.bind(this)}
                        onCancel={this.editBindCancel.bind(this)}
                    >
                        <div className="sectionDetails_Model_box">
                            <div className="sectionDetails_Model_title"><span
                                className="sectionDetails_Model_require_status">*</span>应用计费规则：
                            </div>
                            <div
                                className="sectionDetails_Model_content">{this.state.currentBindRule.parkingPriceRuleName}</div>
                            <div style={custom.clear}/>
                            <div className="sectionDetails_Model_title" style={{marginTop: 32}}><span
                                className="sectionDetails_Model_require_status">*</span>应用车型：
                            </div>
                            <div className="sectionDetails_Model_content"
                                 style={{marginTop: 32}}>{carType[this.state.currentBindRule.carType]}</div>
                            <div style={custom.clear}/>
                            <div className="sectionDetails_Model_title" style={{marginTop: "32px"}}><span
                                className="sectionDetails_Model_require_status">*</span>应用时段：
                            </div>
                            <RadioGroup onChange={this.onEditRadioChange.bind(this)}
                                        value={this.state.currentBindRule.effective}>
                                <Radio style={Object.assign({}, radioStyle, {marginTop: "32px"})}
                                       value={1}>长期生效</Radio>
                                <FormItem>
                                    <Radio style={Object.assign({}, radioStyle, {marginTop: "16px"})} value={0}>
                                        自定义时间
                                        {!this.state.currentBindRule.effective ? (getFieldDecorator('effective', {
                                            rules: [{
                                                required: true,
                                                message: '请选择自定义时间'
                                            }],
                                            initialValue: this.state.currentBindRule.startTime !== undefined && this.state.currentBindRule.startTime !== null ? [moment(this.state.currentBindRule.startTime, dateFormat), moment(this.state.currentBindRule.endTime, dateFormat)] : []
                                        })(
                                            <RangePicker placeholder={['开始时间', '结束时间']}
                                                         format={dateFormat}
                                                         style={{width: "240px"}}
                                                         className="sectionDetails_Model_range_picker"
                                                         onChange={this.onEditDateRangePickerChange.bind(this)}
                                            />
                                        )) : null}
                                    </Radio>
                                </FormItem>
                            </RadioGroup>
                            <div style={custom.clear}/>
                        </div>
                    </Modal>
                    :
                    ""
                }
            </div>
        )
    }
}

export default Form.create()(SectionPriceRuleContent)

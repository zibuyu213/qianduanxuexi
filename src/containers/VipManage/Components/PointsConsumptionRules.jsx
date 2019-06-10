import React, {Component} from 'react';
import {HttpClient} from "../../../common/HttpClient";
import {
    Button,
    Radio,
    Spin,
    Icon,
    Badge,
    Table,
    Pagination,
    Popconfirm,
    Modal,
    Input,
    Form,
    DatePicker, message
} from "antd/lib/index";
import '../Style/Vip.css';
import _ from 'lodash';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const {RangePicker} = DatePicker;
const effectiveState = {
    0: '待生效',
    1: '生效中',
    2: '已失效'
};
const dateFormat = "YYYY-MM-DD HH:mm";

//消费积分规则
class PointsConsumptionRules extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            radioStatus: -1,
            pageNum: 1,
            pageSize: 10,
            total: 0,
            dataList: [],
            visible: false,
            submitLoading: false,
            modalTableData: [],
        }
    }


    componentWillMount() {

    }

    componentDidMount() {
        this.loadData();
    }

    componentWillReceiveProps(nextProps) {
        const oldGradeList = this.props.gradeList;
        const newGradeList = nextProps.gradeList;
        if (oldGradeList !== newGradeList && _.toArray(newGradeList).length > 0) {
            let list = [];
            _.toArray(newGradeList).forEach(item => {
                let obj = {
                    id: item.id,
                    name: item.memberGradeName,
                    rate: null
                };
                list.push(obj);
            });
            this.setState({
                modalTableData: list,
            });
        }
    }

    loadData(page, size, searchData) {
        this.setState({
            loading: true,
        });
        const {pageNum, pageSize, radioStatus} = this.state;
        let data = searchData ? searchData : {};
        data.type = 1;//规则类型 1：消费积分 2：充值积分 3：活跃积分-新用户注册 4：活跃积分-个人信息完善
        data.pageNum = page ? page : pageNum;
        data.pageSize = size ? size : pageSize;
        data.status = radioStatus;
        HttpClient.query(window.MODULE_PARKING_PERSON_INFO + `/memberScore/rule`, "GET", data, this.configData.bind(this));
    }

    /**
     * 接口请求回调
     * @param d
     * @param type
     */
    configData(d, type) {
        if (type === HttpClient.requestSuccess) {
            //成功-------在这里做你的数据处理，需要提示的自己加
            this.setState({
                loading: false,
                total: d.data.total,
                dataList: d.data.list,
            })

        } else {
            //失败----做除了报错之外的操作
            this.setState({
                loading: false,
            })
        }
    }

    /**
     * 新建
     */
    addRule() {
        //初始化
        let list = [];
        this.props.gradeList.forEach(item => {
            let obj = {
                id: item.id,
                name: item.memberGradeName,
                rate: null
            };
            list.push(obj);
        });
        this.setState({
            visible: true,
            modalTableData: list,
        })
    }

    /**
     * 选择状态
     */
    handleSelect(e) {
        this.state.radioStatus = e.target.value;
        this.loadData(1)
    }

    /**
     * 表内规则无效化
     * @param id
     */
    invalidAction(id) {
        HttpClient.query(window.MODULE_PARKING_PERSON_INFO + `/memberScore/rule/change?scoreRuleId=${id}&status=2`, "POST", {}, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                message.success(d.data);
                this.loadData();
            }
        });
    }

    configState(status) {
        let content = null;
        switch (parseInt(status)) {
            case 1://等待
                content = <Badge status="warning" text={effectiveState[0]}/>;
                break;
            case 2://成功
                content = <Badge status="success" text={effectiveState[1]}/>;
                break;
            case 3://失败
                content = <Badge status="default" text={effectiveState[2]}/>;
                break;
            default:
                break;
        }
        return content;

    }

    // 分页
    onPageChange(page, pageSize) {
        this.setState({
            pageNum: page,
            pageSize: pageSize
        });
        this.loadData(page, pageSize);
    }

    // 切换页面条数
    onShowSizeChange(page, pageSize) {
        this.setState({
            pageNum: 1,
            pageSize: pageSize
        });
        this.loadData(1, pageSize);
    }

    modalDataChange(id, e) {
        let data = this.state.modalTableData;
        console.log(data);
        let index = _.findIndex(data, function (o) {
            return o.id === id;
        });
        data[index].rate = e.target.value;
        this.setState({modalTableData: data});
    }

    /**
     * modal确认
     */
    checkModal(e) {
        e.preventDefault();
        if (!this.state.submitLoading) {
            this.state.submitLoading = true;
            this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
                if (!err) {
                    const rangeTime = fieldsValue['effectiveTime'];
                    const rateArray = [];
                    fieldsValue['rateList'].map(item => {
                        rateArray.push({
                            userMemberGradeId: item.id,
                            rate: item.rate,
                        })
                    });
                    let data = {
                        "type": 1,//规则类型 1：消费积分 2：充值积分 3：活跃积分-新用户注册 4：活跃积分-个人信息完善
                        "name": fieldsValue['ruleName'],
                        'startTime': rangeTime[0].format(dateFormat),
                        'endTime': rangeTime[1].format(dateFormat),
                        "minAmount": fieldsValue['minAmount'],
                        "memberScore": fieldsValue['memberScore'],
                        "rateArray": rateArray,
                    };
                    HttpClient.query(window.MODULE_PARKING_PERSON_INFO + `/memberScore/rule`, "POST", JSON.stringify(data), (d, type) => {
                        this.state.submitLoading = false;
                        if (type === HttpClient.requestSuccess) {
                            this.setState({
                                visible: false,
                            });
                            message.success(d.data);
                            this.props.form.resetFields();
                            this.loadData();
                        }
                    });
                } else {
                    this.state.submitLoading = false;
                }
            })
        }
    }

    hideModal() {
        this.setState({
            visible: false,
        });
        this.props.form.resetFields();
    }

    validatorPrice(rule, value, callback) {
        const reg = /^\d+(\.{0,1}\d+){0,1}$/;
        if (!reg.test(value)) callback('要求正数');
        if (parseFloat(value) <= 0) callback('要求正数');
        // 小数
        if (value.indexOf('.') !== -1) {
            const integerBit = value.split('.')[0];
            if (integerBit.length > 5) callback('整数位最多5位');
            const decimalPlace = value.split('.')[1];
            if (decimalPlace.length > 2) callback('小数位最多2位');
        }else { //整数
            if (value > 5) callback('整数位最多5位');
        }
        callback()
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {dataList, loading, total, pageNum, pageSize, modalTableData} = this.state;
        const columns = [{
            title: '规则名称',
            className: "column-content-inspection",
            dataIndex: 'name',
        }, {
            title: '生效时段',
            className: 'column-range-time',
            render: (row) => {
                return <span>{row.startTime} - {row.endTime}</span>
            }
        }, {
            title: '换算规则',
            className: 'column-content-inspection',
            render: (row) => {
                return <div>每消费{row.minAmount}元，获得积分{row.memberScore}分</div>
            }
        }, {
            title: '会员等级及积分倍率',
            className: "column-content-inspection",
            dataIndex: 'rateArray',
            render: (list) => {
                if (list && list.length > 0) {
                    let arr = [];
                    list.forEach((item, i) => {
                        arr.push(item.memberGradeName + "：" + item.rate + "倍");
                    });
                    return arr.join("；")
                }
            }
        }, {
            title: '生效状态',
            className: "column-action-short",
            dataIndex: 'status',
            render: (value) => this.configState(value)
        }];
        if (window.getPerValue('vipAddEditRule')) {
            columns.push({
                title: '操作',
                className: 'column-action-short',
                render: (value, row) => {
                    if (row.status === 1 || row.status === 2) {//待生效或生效中
                        return <Popconfirm placement="topRight"
                                           title={`你确定将此规则无效化吗？`}
                                           onConfirm={this.invalidAction.bind(this, row.id)}
                                           okText="确定"
                                           cancelText="取消">
                            <a>手动无效</a>
                        </Popconfirm>
                    }
                }
            });
        }
        const formModalLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 5},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 19},
            },
        };
        const modalColumns = [{
            title: "会员等级",
            dataIndex: 'name',
            className: "column-modal-level",
        }, {
            title: "积分倍率",
            dataIndex: 'rate',
            render: (value, row) => {
                return <FormItem {...formModalLayout} style={{marginBottom: 0,}}>
                    {getFieldDecorator("input-require" + row.id, {
                        initialValue: value,
                        rules: [{
                            required: true,
                            message: '请输入',
                        }, {
                            validator: this.validatorPrice.bind(this)
                        }],
                    })(
                        <Input placeholder="请输入" onChange={this.modalDataChange.bind(this, row.id)}/>
                    )}
                </FormItem>;
            }
        }];
        return (
            <div className="page-content">
                <div style={{height: "32px", marginBottom: "20px"}}>
                    {window.getPerValue('vipAddEditRule') ?
                        <Button type="primary" className="vip-search-button" onClick={this.addRule.bind(this)}><Icon
                            type="plus"/>新建消费积分规则</Button> : null}
                    <RadioGroup onChange={this.handleSelect.bind(this)} value={this.state.radioStatus}
                                className="vip_selection_radioGroup">
                        <RadioButton value={-1} className="selection_radio_button">全部</RadioButton>
                        <RadioButton value={1} className="selection_radio_button">待生效</RadioButton>
                        <RadioButton value={2} className="selection_radio_button">生效中</RadioButton>
                        <RadioButton value={3} className="selection_radio_button">已失效</RadioButton>
                    </RadioGroup>
                </div>
                <Spin tip="加载中.." spinning={loading}>
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={dataList}
                        pagination={false}
                    />
                    {/*分页*/}
                    {dataList.length > 0 ? (
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
                            <div style={{clear: 'both'}}>
                            </div>
                        </div>
                    ) : ''}
                </Spin>
                {/*modal*/}
                <Modal
                    width={"590px"}
                    title="新建消费积分规则"
                    visible={this.state.visible}
                    onOk={this.checkModal.bind(this)}
                    onCancel={this.hideModal.bind(this)}
                    maskClosable={false}
                    okText="确 定"
                    cancelText="取 消"
                >
                    <Form style={{padding: "24px"}}>
                        <FormItem label="规则名称" {...formModalLayout} required={true}>
                            {getFieldDecorator(`ruleName`, {
                                rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: '请输入规则名称',
                                }, {
                                    max: 20,
                                    message: '输入内容需在20字以内',
                                }],
                            })(
                                <Input placeholder="请输入"/>
                            )}
                        </FormItem>
                        <FormItem label="生效时段" {...formModalLayout} require={true}>
                            {getFieldDecorator(`effectiveTime`, {
                                rules: [{
                                    required: true,
                                    message: '请选择',
                                }],
                            })(
                                <RangePicker style={{width: "-webkit-fill-available"}}
                                             format={dateFormat}
                                             showTime={{format: 'HH:mm'}}
                                             placeholder={['开始时间', '结束时间']}/>
                            )}
                        </FormItem>
                        <FormItem
                            label={<span className="vip-form-item-required">换算规则</span>} {...formModalLayout}
                            style={{marginBottom: "0"}}>
                            <div className="vip-points-flex">每消费
                                <FormItem style={{display: 'inline-flex', margin: "0 8px"}}>
                                    {getFieldDecorator(`minAmount`, {
                                        rules: [{
                                            required: true,
                                            message: '请输入',
                                        }, {
                                            max: 5,
                                            message: '5位以内',
                                        }, {
                                            pattern: new RegExp("^\\d+$"),
                                            message: '仅允许正整数'
                                        }],
                                    })(
                                        <Input placeholder="请输入"/>
                                    )}
                                </FormItem>元，获得积分
                                <FormItem style={{display: 'inline-flex', marginLeft: "8px"}}>
                                    {getFieldDecorator(`memberScore`, {
                                        rules: [{
                                            required: true,
                                            message: '请输入',
                                        }, {
                                            max: 5,
                                            message: '5位以内',
                                        }, {
                                            pattern: new RegExp("^\\d+$"),
                                            message: '仅允许正整数'
                                        }],
                                    })(
                                        <Input placeholder="请输入"/>
                                    )}
                                </FormItem>
                            </div>
                        </FormItem>
                        <FormItem label={<span className="vip-form-item-required">会员应用倍率</span>} {...formModalLayout}>
                            <div>
                                <div>请设置会员等级对应的积分倍率</div>
                                <FormItem>
                                    {getFieldDecorator(`rateList`, {
                                        initialValue: modalTableData,
                                    })(
                                        <Table rowKey="id" columns={modalColumns}
                                               dataSource={modalTableData}
                                               pagination={false}/>
                                    )}
                                </FormItem>
                            </div>
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }


}

export default Form.create()(PointsConsumptionRules);

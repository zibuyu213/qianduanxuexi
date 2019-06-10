import React, {Component} from 'react';

import {Button, Row, Col, Input, Icon, Table, Spin, Form, Popconfirm, Pagination, message} from 'antd/lib/index';
import {HttpClient} from "../../common/HttpClient";
import ScheduleModal from './Components/ScheduleModal.jsx';
import Exception from "../../components/Exception";
import './Styles/Inspection.css';
import _ from 'lodash';

const FormItem = Form.Item;

export default class ScheduleManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0,
            currentCount: 0,
            dataList: [],
            searchParams: {},
            scheduleName: "",
            createVisible: false,//modal
            editVisible: false,//modal
            modalData: {},
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

    /**
     * 加载数据
     */
    loadData(page, size, searchData) {
        this.setState({
            loading: true,
        });
        const {searchParams, pageNum, pageSize} = this.state;
        let data = searchData ? searchData : searchParams;
        data.pageNum = page ? page : pageNum;
        data.pageSize = size ? size : pageSize;
        HttpClient.query(window.MODULE_PARKING_INSPECTION + `/inspection/schedule`, "GET", data, this.configData.bind(this));
    }

    /**
     * 接口请求回调
     * @param d
     * @param type
     */
    configData(d, type) {
        if (type == HttpClient.requestSuccess) {
            //成功-------在这里做你的数据处理，需要提示的自己加
            this.setState({
                loading: false,
                total: d.data.total,
                currentCount: d.data.size,
                dataList: d.data.list,
            })

        } else {
            //失败----做除了报错之外的操作
            this.setState({
                loading: false,
            })
        }
    }

    // 输入稽查组名称
    handleInputChange(e) {
        this.setState({scheduleName: e.target.value});
    }

    // 搜索
    handleSearch() {
        let search = {
            scheduleName: this.state.scheduleName
        };
        this.setState({
            pageNum: 1,
            searchParams: search
        });
        this.loadData(1, this.state.pageSize, search);
    }

    // 重置
    handleReset() {
        this.setState({
            pageNum: 1,
            pageSize: 10,
            searchParams: {},
            scheduleName: ""
        });
        this.loadData(1, 10, {});
    }

    //modal
    showModal(index, data) {
        switch (index) {//0-新建；1-编辑
            case 0:
                this.setState({
                    createVisible: true,
                    editVisible: false
                });
                break;
            case 1:
                this.setState({
                    createVisible: false,
                    editVisible: true,
                    modalData: data
                });
                break;
            default:
                break;
        }
    }

    checkModal() {
        this.setState({
            createVisible: false,
            editVisible: false,
        });
        this.loadData();
    }

    hideModal() {
        this.setState({
            createVisible: false,//modal
            editVisible: false,//modal
        })
    }

    //删除
    deleteSchedule(id) {
        HttpClient.query(window.MODULE_PARKING_INSPECTION + `/inspection/schedule/${id}`, "DELETE", {}, (d, type) => {
            if (type == HttpClient.requestSuccess) {
                message.success(d.data);
                if (this.state.currentCount === 1 && this.state.pageNum > 1) {//最后一条
                    this.state.pageNum -= 1;
                }
                this.loadData();
            }
        });
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

    //表内班次显示
    getScheduleTime(scheduleType, scheduleTimes) {
        let name = scheduleType == 0 ? "一班制" : scheduleType == 1 ? "二班制" : scheduleType == 2 ? "三班制" : "";
        let timeArr = [name];
        _.toArray(scheduleTimes).map(item => {
            let str = item.workStartTime + "-" + item.workEndTime;
            timeArr.push(str);
        });
        return timeArr.join(" ");
    }


    render() {
        if (!window.checkPageEnable('/ScheduleManage')) {
            return <Exception type='403'/>;
        }
        const {searchParams, loading, total, pageNum, pageSize, dataList} = this.state;
        const columns = [
            {
                title: '班次名称',
                dataIndex: 'scheduleName',
                className: "column-content-inspection"
            }, {
                title: '班次类型',
                dataIndex: 'scheduleType',
                render: (text, row) => {
                    return this.getScheduleTime(text, row.scheduleTimes)
                }
            }, {
                title: '备注',
                className: 'column-comments',
                dataIndex: 'comments',
                render: (text, row) => {
                    return <div className="column-comments">{text}</div>
                }
            }];
        if (window.getPerValue('scheduleAddEdit') || window.getPerValue('scheduleDelete')) {
            columns.push({
                title: '操作',
                dataIndex: 'action',
                className: 'column-action-schedule',
                render: (text, row) => {
                    return <div>
                        {window.getPerValue('scheduleAddEdit') ?
                            <a onClick={this.showModal.bind(this, 1, row)}>编辑</a> : null}
                        {window.getPerValue('scheduleAddEdit') && window.getPerValue('scheduleDelete') ?
                            <span style={{color: "#E9E9E9"}}> | </span> : null}
                        {window.getPerValue('scheduleDelete') ?
                            <Popconfirm placement="topRight"
                                        title={`你确定删除此班次吗？`}
                                        onConfirm={this.deleteSchedule.bind(this, row.id)}
                                        okText="确定"
                                        cancelText="取消">
                                <a>删除</a>
                            </Popconfirm> : null}
                    </div>
                }
            });
        }
        return (
            <div className='page'>
                <div className='page-header'>
                    班次管理
                </div>
                <div className='page-content'>
                    <Form>
                        <Row gutter={46}>
                            <Col span={8}>
                                <FormItem label='班次名称' labelCol={{span: 5}}
                                          wrapperCol={{span: 19}}>
                                    <Input placeholder="请输入"
                                           value={this.state.scheduleName}
                                           onChange={this.handleInputChange.bind(this)}/>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem>
                                    <Button type="primary" className="inspection_search_button"
                                            onClick={this.handleSearch.bind(this)}>查询</Button>
                                    <Button className="inspection_search_button"
                                            onClick={this.handleReset.bind(this)}>重置</Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    {window.getPerValue('scheduleAddEdit') ?
                        <Row style={{marginTop: '24px'}}>
                            <Col>
                                <Button type="primary" className="inspection_button_add"
                                        onClick={this.showModal.bind(this, 0)}>
                                    <Icon type="plus"/>新建班次
                                </Button>
                            </Col>
                        </Row> : null}
                    {/*表格*/}
                    <Spin tip="加载中.." spinning={loading}>
                        <Table
                            className="inspectionTable"
                            rowKey={data => data.id}
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
                                <div style={{clear: 'both'}}></div>
                            </div>
                        ) : ''}
                    </Spin>
                    {/*modal*/}
                    <ScheduleModal type={0} visible={this.state.createVisible} data={{}}
                                   onOk={this.checkModal.bind(this)} onCancel={this.hideModal.bind(this)}/>
                    <ScheduleModal type={1} visible={this.state.editVisible} data={this.state.modalData}
                                   onOk={this.checkModal.bind(this)} onCancel={this.hideModal.bind(this)}/>
                </div>
            </div>
        );
    }
}

import React, {Component} from 'react';

import {Button, Row, Col, Input, Icon, Table, Spin, Form, Popconfirm, Pagination} from 'antd';
import './Styles/Inspection.css';
import {HttpClient} from "../../common/HttpClient";
import {message} from "antd/lib/index";
import Exception from "../../components/Exception";
import _ from 'lodash';

const FormItem = Form.Item;
export default class InspectionGroup extends Component {
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
            groupName: ""
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
        HttpClient.query(window.MODULE_PARKING_INSPECTION + `/inspection/group`, "GET", data, this.configData.bind(this));
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
        this.setState({groupName: e.target.value});
    }

    // 搜索
    handleSearch() {
        let search = {groupName: this.state.groupName};
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
            groupName: "",
        });
        this.loadData(1, 10, {});
    }

    // 新建稽查组
    addInspectionGroup() {
        location.hash = `/InspectionManage/InspectionGroup/AddInspectionGroup`;
    }

    //编辑排班
    editSchedule(id) {
        location.hash = `/InspectionManage/InspectionGroup/EditSchedule?id=${id}`;
    }

    //编辑稽查组
    editGroup(id) {
        location.hash = `/InspectionManage/InspectionGroup/EditInspectionGroup?id=${id}`;
    }

    //删除
    deleteGroup(id) {
        HttpClient.query(window.MODULE_PARKING_INSPECTION + `/inspection/group/${id}`, "DELETE", {}, (d, type) => {
            if (type == HttpClient.requestSuccess) {
                message.success(d.data);
                if (this.state.currentCount === 1 && this.state.pageNum > 1) {//最后一条
                    this.state.pageNum -= 1;
                }
                this.loadData();
            }
        });
    }

    //详情
    detailClick(id) {
        location.hash = `/InspectionManage/InspectionGroup/InspectionGroupDetail?id=${id}`;
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
    getScheduleStr(scheduleList) {
        let timeArr = [];
        _.toArray(scheduleList).map(item => {
            let group = item.groupScheduleType == 0 ? "通用班次" : item.groupScheduleType == 1 ? "工作日" : item.groupScheduleType == 2 ? "节假日" : "";
            // let name = item.scheduleType == 0 ? "一班制" : item.scheduleType == 1 ? "二班制" : item.scheduleType == 2 ? "三班制" : "";
            let str = group + "：" + item.scheduleName;
            timeArr.push(str);
        });
        return timeArr.join("；");
    }

    //表内管辖路段显示
    getParkingStr(parkingList) {
        let parkingArr = [];
        _.toArray(parkingList).map(item => {
            let group = item.parkingName;
            let str = group;
            let list = _.toArray(item.inspectionGroupParkingPoints);
            if (list.length > 0) {
                let points = [];
                list.map(item => {
                    points.push(item.parkingPointName);
                });
                str = group + "：" + points.join('，');
            }
            parkingArr.push(str);
        });
        return parkingArr.join("；");
    }


    render() {
        if (!window.checkPageEnable('/InspectionGroup')) {
            return <Exception type='403'/>;
        }
        const {searchParams, loading, total, pageNum, pageSize, dataList} = this.state;
        const columns = [
            {
                title: '稽查组名称',
                dataIndex: 'groupName',
                width: 200,
                fixed: 'left',
                render: (value, row) => {
                    return <span className="cursor-pointer" style={{color: '#1890FF'}}
                                 onClick={this.detailClick.bind(this, row.id)}>{value}</span>
                }
            }, {
                title: '人数',
                dataIndex: 'count',
                width: 150
            }, {
                title: '稽查组负责人',
                dataIndex: 'principalUserName',
                width: 150
            }, {
                title: '稽查班次',
                className: 'column-scheduleName',
                dataIndex: 'inspectionGroupSchedules',
                render: (text, row) => {
                    return <div className="column-scheduleName">{this.getScheduleStr(text)}</div>
                }
            }, {
                title: '管辖路段/停车点',
                dataIndex: 'inspectionGroupParkings',
                render: (text) => {
                    return <div className="column-parkingName">{this.getParkingStr(text)}</div>
                }
            }];
        if (window.getPerValue('inspectionClassEdit') || window.getPerValue('inspectionEdit') || window.getPerValue('inspectionDelete')) {
            columns.push({
                title: '操作',
                dataIndex: 'action',
                width: 250,
                fixed: "right",
                render: (text, row) => {
                    return <div>
                        {window.getPerValue('inspectionClassEdit') ?
                            <a onClick={this.editSchedule.bind(this, row.id)}>编辑排班</a> : null}
                        {window.getPerValue('inspectionClassEdit') && window.getPerValue('inspectionEdit') ?
                            <span style={{color: "#E9E9E9"}}> | </span> : null}
                        {window.getPerValue('inspectionEdit') ?
                            <a onClick={this.editGroup.bind(this, row.id)}>编辑稽查组</a> : null}
                        {window.getPerValue('inspectionEdit') && window.getPerValue('inspectionDelete') ?
                            <span style={{color: "#E9E9E9"}}> | </span> : null}
                        {window.getPerValue('inspectionDelete') ?
                            <Popconfirm placement="topRight"
                                        title={`你确定删除此稽查组吗？`}
                                        onConfirm={this.deleteGroup.bind(this, row.id)}
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
                    稽查组管理
                </div>
                <div className='page-content'>
                    <Form>
                        <Row gutter={46}>
                            <Col span={8}>
                                <FormItem label='稽查组名称' labelCol={{span: 6}}
                                          wrapperCol={{span: 18}}>
                                    <Input placeholder="请输入"
                                           value={this.state.groupName}
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
                    {window.getPerValue('inspectionAdd') ?
                        <Row style={{marginTop: '24px'}}>
                            <Col>
                                <Button type="primary" className="inspection_button_add"
                                        onClick={this.addInspectionGroup.bind(this)}>
                                    <Icon type="plus"/>新建稽查组
                                </Button>
                            </Col>
                        </Row> : null}
                    {/*表格*/}
                    <Spin tip="加载中.." spinning={loading}>
                        <Table
                            className="inspectionTable"
                            rowKey={data => data.id}
                            columns={columns}
                            scroll={{x: "140%"}}
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
                </div>
            </div>
        );
    }
}

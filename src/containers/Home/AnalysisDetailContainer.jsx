import React, {Component} from 'react';
import {Button, Form, message, Select, Tooltip, Spin} from "antd";
import {CSS} from "./Analysis.css";
import {HttpClient} from "../../common/HttpClient";
import {custom} from "../../common/SystemStyle";
import _ from 'lodash';
import Exception from '../../components/Exception';

const Option = Select.Option;
const FormItem = Form.Item;

class AnalysisDetailContainer extends Component {
    constructor (props) {
        super(props);
        message.config({
            duration: 1
        });
        // console.log(this.props.location.query.parkingId);
        // console.log(this.props.location.query.partnerCompanyId);
        this.state = {
            companyList: [],
            partnerCompanyId: this.props.location.query.partnerCompanyId || undefined,
            parkingList: [{ id: '-1', parkingName: "全部" }],
            parkingId: this.props.location.query.parkingId || undefined,
            resources: [],
            isLoading: true
        };
    }

    componentWillMount () {

    }

    componentDidMount () {
        HttpClient.query(window.MODULE_PARKING_INFO + `/admin/reviewPassCompany`, "GET", {}, (e, type) => {
            if (type === HttpClient.requestSuccess) {
                let companyList = e.data;
                this.setState({
                    companyList: companyList
                });

                let params = {};
                this.state.partnerCompanyId && (params.partnerCompanyId = this.state.partnerCompanyId);
                this.state.parkingId && (params.parkingId = this.state.parkingId);
                HttpClient.query("/parking-resource/admin/resource/parking/space/spaceUseState/list", HttpClient.GET, params, this.fetchInUse.bind(this));
                this.handleParkingListQuerys(this.state.partnerCompanyId);
            }
        });
    }

    //获取公司列表
    handleCompanyListQuerys () {
        HttpClient.query(window.MODULE_PARKING_INFO + `/admin/reviewPassCompany`, "GET", {}, this.fetchCompanyList.bind(this));
    }

    fetchCompanyList (e, type) {
        if (type === HttpClient.requestSuccess) {
            this.setState({
                companyList: e.data
            })
        }
    }

    //路段资源列表
    handleParkingListQuerys (partnerCompanyId) {
        let params = {
            partnerCompanyId: partnerCompanyId
        };
        HttpClient.query(window.MODULE_PARKING_RESOURCE + `/admin/resource/parking/getParkingByPartnerCompany`, "GET", params, this.fetchParkingList.bind(this));
    }

    fetchParkingList (e, type) {
        if (type === HttpClient.requestSuccess) {
            //成功
            this.setState({
                parkingList: [{ id: '-1', parkingName: "全部" }].concat(e.data)
            });
        }
    }

    //获取占用详情
    //占用情况
    queryInUse () {
        let params = {};
        if (this.state.parkingId !== undefined) {
            params.parkingId = this.state.parkingId
        }
        if (this.state.partnerCompanyId !== undefined) {
            params.partnerCompanyId = this.state.partnerCompanyId
        }
        console.log("in use query params ----->");
        this.setState({
            isLoading: true
        });

        console.log(params);
        HttpClient.query("/parking-resource/admin/resource/parking/space/spaceUseState/list", "GET", params, this.fetchInUse.bind(this));
    }

    fetchInUse (d, type) {
        if (type === HttpClient.requestSuccess) {
            this.setState({
                resources: d.data
            })
        }
        this.setState({
            isLoading: false
        });
    }


    //列表-公司选择器
    handleCompanyChange (e) {
        this.setState({
            partnerCompanyId: e
        });
        this.props.form.resetFields(['parking']);
        this.setState({
            parkingId: undefined
        });
        this.handleParkingListQuerys(e);
    }

    //列表-路段选择器
    handleParkingChange (e) {
        this.setState({
            parkingId: e === "-1" ? undefined : e
        });
    }

    // 搜索
    handleSearch () {
        //load data
        this.queryInUse();
    }

    // 重置
    handleReset () {
        this.props.form.resetFields();
        this.state.partnerCompanyId = undefined;
        this.state.parkingId = undefined;
        //load data
        this.queryInUse();
    }

    getColor (parkingSpaceStatus) {
        let color = "#E2E2E2";
        switch (parkingSpaceStatus) {
            case 0:
                color = "#2EC15A";
                break;
            case 1:
                color = "#F04864";
                break;
            case 2:
                color = "#E2E2E2";
                break;
            default:
                color = "#E2E2E2";
                break;
        }
        return color;
    }

    render () {
        //判断页面权限
        if (!window.checkPageEnable("parkingInUseStatus")) {
            return <Exception type={403}/>
        }

        const { getFieldDecorator } = this.props.form;

        return (
            <div className="page">
                <div className="page-header">泊位占用详情</div>
                <div className="page-content analysis-detail-container">
                    <Form layout="inline">
                        {!window.currentIsSystemAdmin ? '' :
                            <FormItem label='合作公司' style={{ marginRight: '48px' }}>
                                {getFieldDecorator('company', {
                                    initialValue: _.toString(this.state.partnerCompanyId)
                                })(
                                    <Select
                                        style={{ width: '256px' }}
                                        showSearch
                                        placeholder="请输入"
                                        onChange={this.handleCompanyChange.bind(this)}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        optionFilterProp="children"
                                    >
                                        {this.state.companyList.map((item, i) => {
                                            return <Option value={_.toString(item.id)}
                                                           key={i}>{item.partnerCompanyName}</Option>
                                        })}
                                    </Select>
                                )}
                            </FormItem>
                        }
                        <FormItem label='路段名称' style={{ marginRight: '48px' }}>
                            {getFieldDecorator('parking', {
                                initialValue: this.state.parkingId === undefined ? "-1" : _.toString(this.state.parkingId)
                            })(
                                <Select
                                    style={{ width: '256px' }}
                                    showSearch
                                    placeholder="请输入"
                                    onChange={this.handleParkingChange.bind(this)}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    optionFilterProp="children"
                                >
                                    {this.state.parkingList.map((item, i) => {
                                        return <Select.Option value={item.id + ""}
                                                              key={i}>{item.parkingName}</Select.Option>
                                    })}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" className="analysis-button"
                                    onClick={this.handleSearch.bind(this)}>查询</Button>

                        </FormItem>
                    </Form>
                    <div className="analysis-detail-tint-box">
                        <div className="analysis-detail-tint-text">不可用</div>
                        <div className="analysis-detail-tint-icon" style={{ backgroundColor: "#E2E2E2" }}/>
                        <div className="analysis-detail-tint-text">占用</div>
                        <div className="analysis-detail-tint-icon" style={{ backgroundColor: "#F04864" }}/>
                        <div className="analysis-detail-tint-text">空闲</div>
                        <div className="analysis-detail-tint-icon" style={{ backgroundColor: "#2EC15A" }}/>

                        <div style={custom.clear}/>
                    </div>
                    <Spin spinning={this.state.isLoading}>
                        {this.state.resources.length === 0 ?
                            <div>
                                {this.state.isLoading === true ?
                                    ""
                                    :
                                    <div className="analysis-chart-nodata-text" style={{ padding: 18 }}>
                                        <img className="analysis-chart-nodata-icon"
                                             src="resources/images/icon_index_chart_nodata.png"/>
                                        暂无数据
                                    </div>
                                }
                            </div>
                            :
                            this.state.resources.map((item, i) => {
                                return (
                                    <Tooltip key={i} placement="top" title={item.parkingSpaceNo}>
                                        <div className="analysis-detail-box cursor-pointer"
                                             style={{backgroundColor: this.getColor(item.parkingSpaceStatus)}}>
                                        </div>
                                    </Tooltip>
                                )
                                /*return (
                                    <div className="analysis-detail-box cursor-pointer"
                                         key={i}
                                         style={{ backgroundColor: this.getColor(item.parkingSpaceStatus) }}>
                                    </div>
                                )*/
                            })}
                        <div style={custom.clear}/>
                    </Spin>
                </div>
            </div>
        )
    }


}

export default Form.create()(AnalysisDetailContainer);

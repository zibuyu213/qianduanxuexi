import React, {Component} from 'react';
import {Button, Form, message, Select, DatePicker, Spin, Row, Col} from "antd";
import {CSS} from "./Analysis.css";
import {HttpClient} from "../../common/HttpClient";
import {custom} from "../../common/SystemStyle";
import moment from 'moment';
import Exception from '../../components/Exception';
import DateRange from '../../components/DateRange/DateRange';
import _ from 'lodash';

const FormItem = Form.Item;
const ReactHighcharts = require('react-highcharts');
const RangePicker = DatePicker.RangePicker;
const date = [moment().subtract(7, 'days'), moment().subtract(1, 'days')];

// const month = [moment().subtract(7,'month'), moment().subtract(-1,'month')];

class AnalysisIndexContainer extends Component {
    constructor(props) {
        super(props);

        message.config({
            duration: 1
        });

        this.state = {
            companyList: [],
            partnerCompanyId: undefined,
            parkingList: [{id: 0, parkingName: "全部"}],
            parkingId: undefined,
            incomeQueryType: 1,
            // mode: ['month', 'month'],
            // value: [],
            incomeList: [],
            start: undefined,
            end: undefined,
            spareCount: 0,
            occupiedCount: 0,
            maintainingCount: 0,
            spareRate: '',
            occupiedRate: '',
            maintainingRate: '',
            tPartnerCompanyId: undefined,
            tParkingId: undefined,
            inIncomeQuery: true,
            inInuseStatusQuery: true,
            dateValue: date,
            // monthValue: month
        };
    }

    componentWillMount() {
        if (!window.checkPageEnable('/AnalysisIndex')) {
            location.hash = window.getFirstPage();
        }
    }

    componentDidMount() {
        //待修复 进入首页需要默认选中一个合作方
        if (window.checkPageEnable('/AnalysisIndex')) {
            HttpClient.query(window.MODULE_PARKING_INFO + `/admin/reviewPassCompany`, "GET", {}, (e, type) => {
                if (type === HttpClient.requestSuccess) {
                    let companyList = e.data;
                    this.setState({
                        companyList: companyList
                    });
                    let partnerCompanyId = this.state.tPartnerCompanyId;
                    if (companyList !== undefined && companyList.length > 0) {
                        //是合作方中台时 公司id从localStorage获取
                        if (!window.currentIsSystemAdmin) {
                            partnerCompanyId = localStorage.partnerCompanyId;
                        } else {
                            partnerCompanyId = companyList[0].id;
                        }
                        this.setState({
                            tPartnerCompanyId: partnerCompanyId,
                            partnerCompanyId: partnerCompanyId
                        })
                    }
                    this.setState({
                        inIncomeQuery: window.checkPageEnable('parkingInCome'),
                        inInuseStatusQuery: window.checkPageEnable('parkingInUseStatus'),
                    });
                    //queryInUse
                    let params = {
                        partnerCompanyId: partnerCompanyId
                    };
                    window.checkPageEnable('parkingInUseStatus') && HttpClient.query("/parking-resource/admin/resource/parking/space/spaceUseState", HttpClient.GET, params, this.fetchInUse.bind(this));
                    //queryIncome
                    let queryIncomeParams = {
                        type: 0,
                        partnerCompanyId: partnerCompanyId
                    };
                    window.checkPageEnable('parkingInCome') && HttpClient.query("/parking-orders/dataAnalysis/parkSpaceInCome", HttpClient.GET, queryIncomeParams, this.fetchIncome.bind(this), "application/x-www-form-urlencoded");

                    this.handleParkingListQuerys(partnerCompanyId);
                }
            });
        }
    }


    //路段资源列表
    handleParkingListQuerys(partnerCompanyId) {

        let params = {
            partnerCompanyId: partnerCompanyId
        };
        HttpClient.query(window.MODULE_PARKING_RESOURCE + `/admin/resource/parking/getParkingByPartnerCompany`, "GET", params, this.fetchParkingList.bind(this));
    }

    fetchParkingList(e, type) {
        if (type === HttpClient.requestSuccess) {
            //成功
            this.setState({
                parkingList: [{id: 0, parkingName: "全部"}].concat(e.data)
            });
        }
    }

    //收入
    queryIncome() {
        let params = {
            type: this.state.incomeQueryType - 1
        };
        if (this.state.start !== undefined && this.state.end !== undefined) {
            params.startDate = this.state.start;
            params.endDate = this.state.end;
        }
        if (this.state.parkingId !== undefined) {
            params.parkId = this.state.parkingId
        }
        if (this.state.partnerCompanyId !== undefined) {
            params.partnerCompanyId = this.state.partnerCompanyId
        }
        this.setState({
            inIncomeQuery: window.checkPageEnable('parkingInCome')
        });
        console.log("income query params ----->");
        console.log(params);
        HttpClient.query("/parking-orders/dataAnalysis/parkSpaceInCome", HttpClient.GET, params, this.fetchIncome.bind(this), "application/x-www-form-urlencoded");
    }

    fetchIncome(d, type) {
        if (type === HttpClient.requestSuccess) {
            this.setState({
                incomeList: d.data
            })
        }
        this.setState({
            inIncomeQuery: false
        });
    }

    //占用情况
    queryInUse() {
        let params = {};
        if (this.state.parkingId !== undefined) {
            params.parkingId = this.state.parkingId
        }
        if (this.state.partnerCompanyId !== undefined) {
            params.partnerCompanyId = this.state.partnerCompanyId
        }
        this.setState({
            inInuseStatusQuery: window.checkPageEnable('parkingInUseStatus')
        });
        console.log("in use query params ----->");
        console.log(params);
        HttpClient.query("/parking-resource/admin/resource/parking/space/spaceUseState", HttpClient.GET, params, this.fetchInUse.bind(this));
    }

    fetchInUse(d, type) {
        if (type === HttpClient.requestSuccess) {
            this.setState({
                spareCount: d.data.spareCount,
                occupiedCount: d.data.occupiedCount,
                maintainingCount: d.data.maintainingCount,
                spareRate: d.data.spareRate,
                occupiedRate: d.data.occupiedRate,
                maintainingRate: d.data.maintainingRate
            })
        }
        this.setState({
            inInuseStatusQuery: false
        });
    }

    //列表-公司选择器
    handleCompanyChange(e) {
        console.log('handleCompanyChange', e);

        this.setState({
            tPartnerCompanyId: e,
            tParkingId: undefined
        });
        this.props.form.resetFields(['parking']);
        this.handleParkingListQuerys(e);
    }

    //列表-路段选择器
    handleParkingChange(e) {
        this.setState({
            tParkingId: e === "0" ? undefined : e
        });
    }

    // 搜索
    handleSearch(e) {
        let form = this.props.form;
        console.log('handleSearch', form.getFieldValue('company'), form.getFieldValue('parking'));
        if (form.getFieldValue('company') === undefined && form.getFieldValue('parking') === undefined) {
            message.error('请至少选择一个合作方或一个路段!')
        } else {

            this.state.partnerCompanyId = this.state.tPartnerCompanyId;
            this.state.parkingId = this.state.tParkingId;
            //load data
            window.checkPageEnable('parkingInCome') && this.queryIncome();
            window.checkPageEnable('parkingInUseStatus') && this.queryInUse();
        }
    }

    //去泊位占用详情
    goDetail() {
        if (window.checkPageEnable('parkingInUseStatus')) {
            const parkingId = this.state.parkingId;
            const partnerCompanyId = this.state.partnerCompanyId;
            // console.log(parkingId, partnerCompanyId);
            let params = `?${parkingId ? `parkingId=${parkingId}&` : ''}${partnerCompanyId ? `partnerCompanyId=${partnerCompanyId}` : ''}`;
            location.hash = `/Home/AnalysisIndex/AnalysisDetail${params}`
        }
    }

    //收入选项选择
    choseDay() {
        if (this.state.incomeQueryType === 1) {
            return;
        }
        //切换清空时间选择
        this.state.incomeQueryType = 1;
        this.state.start = undefined;
        this.state.end = undefined;
        this.queryIncome();
    }

    choseMonth() {
        if (this.state.incomeQueryType === 2) {
            return;
        }
        //切换清空时间选择
        this.setState({
            incomeQueryType: 2
        }, () => {
            this.state.start = undefined;
            this.state.end = undefined;
            this.queryIncome();
        });
    }

    disabledDate(current) {
        // Can not select days before today and today
        return current && current > moment().add(-1, 'day');
    }

    // 日收入时间范围选择变化
    onDateRangePickerChange(date, dateString) {
        this.setState({
            dateValue: date,
        });
        this.state.start = dateString[0] + ' 00:00:00';
        this.state.end = dateString[1] + " 23:59:59";
        this.queryIncome();
    }

    // 月收入时间范围变化
    onMonthRangePickerChange(start, end) {
        this.state.start = start.startOf('month').format('YYYY-MM-DD') + " 00:00:00";
        this.state.end = end.endOf('month').format('YYYY-MM-DD') + " 23:59:59";
        this.queryIncome();
    }

    render() {
        //判断页面权限
        if (!window.checkPageEnable("/AnalysisIndex")) {
            return <Exception type={403}/>
        }

        const {getFieldDecorator} = this.props.form;
        const {incomeQueryType, dateValue} = this.state;

        let categories = [];
        let data = [];
        _.toArray(this.state.incomeList).map(item => {
            if (this.state.incomeQueryType === 1) {
                categories.push(item.month + "月" + item.day + "日");
            } else {
                categories.push(item.month + "月");
            }

            data.push({
                y: parseFloat(item.receiveAmount + ""),
                color: 'rgba(24,144,255,0.85)'
            });
        });
        var columnConfig = {
            tooltip: {
                formatter: function () {
                    return `￥ ${this.y}`;
                },
                backgroundColor: 'white',
                borderRadius: 5,
                borderWidth: 0
            },
            title: {
                text: '销售额趋势',
                align: "left",
                style: {
                    fontSize: "14px"
                }
            },
            legend: {
                enabled: false,
            },
            credits: {
                enabled: false
            },
            chart: {
                spacingTop: 32,
                spacingBottom: 32,
                spacingLeft: 32,
                spacingRight: 32,
                height: "356px",
                type: 'column'
            },
            xAxis: {
                title: {
                    text: ''
                },
                categories: categories
            },
            yAxis: {
                title: {
                    text: ''
                },
                min: 0
            },
            series: [{
                data: data
            }]
        };

        var pieConfig = {
            tooltip: {
                enabled: false
            },
            title: {
                text: '',
                floating: true,
                style: {
                    fontSize: "14px",
                    color: "rgba(0,0,0,0.45)",
                    textAlign: "center"
                }
            },
            subtitle: {
                text: '',
                floating: true,
                style: {
                    fontSize: "30px",
                    color: "rgba(0,0,0,0.85)",
                    textAlign: "center"
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            chart: {
                spacingTop: 32,
                spacingBottom: 32,
                spacingLeft: 32,
                spacingRight: 32,
                // width:"50%",
                // marginLeft:100,
                height: "356px",
                type: 'pie',
                marginLeft: -200
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            series: [{
                size: '80%',
                innerSize: '60%',
                data: [{
                    y: this.state.spareCount,
                    color: "#4DCB73",
                    name: "空闲",
                    legendIndex: 1
                }, {
                    y: this.state.occupiedCount,
                    color: "#F2637B",
                    name: "占用",
                    legendIndex: 2
                }, {
                    y: this.state.maintainingCount,
                    color: "#DDDDDD",
                    name: "不可用",
                    legendIndex: 3
                }]
            }]
        };

        let total = this.state.spareCount + this.state.occupiedCount + this.state.maintainingCount;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19},
        };
        return (
            <div className="page">
                <div className="page-header">
                    <div style={{marginBottom: 18, fontWeight: 500}}>统计分析</div>
                    <Form>
                        <Row gutter={46}>
                            {!window.currentIsSystemAdmin ? '' :
                                <Col span={8}>
                                    <FormItem label='合作公司' {...formItemLayout}>
                                        {getFieldDecorator('company', {
                                            initialValue: _.toString(this.state.partnerCompanyId)
                                        })(
                                            <Select
                                                showSearch
                                                placeholder="请输入"
                                                onChange={this.handleCompanyChange.bind(this)}
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                optionFilterProp="children"
                                            >
                                                {_.toArray(this.state.companyList).map((item, i) => {
                                                    return <Select.Option value={item.id + ""}
                                                                          key={i}>{item.partnerCompanyName}</Select.Option>
                                                })}
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            }
                            <Col span={8}>
                                <FormItem label='路段名称' {...formItemLayout}>
                                    {getFieldDecorator('parking', {
                                        initialValue: "0"
                                    })(
                                        <Select
                                            showSearch
                                            placeholder="请输入"
                                            onChange={this.handleParkingChange.bind(this)}
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            optionFilterProp="children"
                                        >
                                            {_.toArray(this.state.parkingList).map((item, i) => {
                                                return <Select.Option value={item.id + ""}
                                                                      key={i}>{item.parkingName}</Select.Option>
                                            })}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem>
                                    <Button type="primary" className="analysis-button"
                                            onClick={this.handleSearch.bind(this)}>查询
                                    </Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>

                <div className="page-content" style={{background: "rgba(0,0,0,0)", padding: 0}}>

                    {window.checkPageEnable('parkingInUseStatus') ?
                        <div className="analysis-index-box" style={{paddingRight: 12}}>
                            <div className="analysis-chart-box">
                                <div style={{width: "100%", height: "100%"}}>
                                    <div className="analysis-chart-box-head">
                                        <div className="analysis-title">泊位占用</div>
                                        <Button className="analysis-detail-button"
                                                onClick={this.goDetail.bind(this)}>占用详情</Button>
                                        <div style={custom.clear}/>
                                    </div>
                                    {/*第一次的时候不要显示没数据 直接转菊花*/}
                                    <Spin spinning={this.state.inInuseStatusQuery}>
                                        {this.state.spareCount === 0 && this.state.occupiedCount === 0 && this.state.maintainingCount === 0 ?
                                            <div>
                                                {this.state.inInuseStatusQuery === true ?
                                                    <div style={{height: '356px'}}/>
                                                    :
                                                    <div className="analysis-chart-nodata-text" style={{padding: 18}}>
                                                        <img className="analysis-chart-nodata-icon"
                                                             src="resources/images/icon_index_chart_nodata.png"/>
                                                        暂无数据
                                                    </div>
                                                }
                                            </div>
                                            :
                                            <div className="analysis-chart-content">
                                                <div className="analysis-chart-title">实时占用比</div>
                                                <ReactHighcharts style={{width: "50%"}} config={pieConfig}
                                                                 callback={(c => {
                                                                     var centerY = c.series[0].center[1],
                                                                         titleHeight = parseInt(c.title.styles.fontSize);
                                                                     // debugger;
                                                                     // 动态设置标题位置
                                                                     c.setTitle({
                                                                         y: centerY + titleHeight / 2 - 20,
                                                                         x: -116,
                                                                         text: "总车位数"
                                                                     });
                                                                     c.setSubtitle({
                                                                         y: centerY + titleHeight / 2 + 20,
                                                                         x: -116,
                                                                         text: this.state.spareCount + this.state.occupiedCount + this.state.maintainingCount
                                                                     });
                                                                 }).bind(this)}/>
                                                <div className="analysis-chart-annotation">
                                                    <div className="analysis-chart-annotation-line">
                                                        <div style={{backgroundColor: "#4DCB73"}}
                                                             className="analysis-chart-annotation-line-tag"/>
                                                        <div className="analysis-chart-annotation-line-status">空闲</div>
                                                        <div className="analysis-chart-annotation-line-split"/>
                                                        <div
                                                            className="analysis-chart-annotation-line-percent">{this.state.spareRate}
                                                        </div>
                                                        <div
                                                            className="analysis-chart-annotation-line-count">{this.state.spareCount}</div>
                                                        <div style={custom.clear}/>
                                                    </div>
                                                    <div className="analysis-chart-annotation-line">
                                                        <div style={{backgroundColor: "#F2637B"}}
                                                             className="analysis-chart-annotation-line-tag"/>
                                                        <div className="analysis-chart-annotation-line-status">占用</div>
                                                        <div className="analysis-chart-annotation-line-split"/>
                                                        <div
                                                            className="analysis-chart-annotation-line-percent">{this.state.occupiedRate}
                                                        </div>
                                                        <div
                                                            className="analysis-chart-annotation-line-count">{this.state.occupiedCount}</div>
                                                        <div style={custom.clear}/>
                                                    </div>
                                                    <div className="analysis-chart-annotation-line"
                                                         style={{marginBottom: 0}}>
                                                        <div style={{backgroundColor: "#DDDDDD"}}
                                                             className="analysis-chart-annotation-line-tag"/>
                                                        <div className="analysis-chart-annotation-line-status">不可用</div>
                                                        <div className="analysis-chart-annotation-line-split"/>
                                                        {/*满足傻逼测试不要超过100*/}
                                                        <div
                                                            className="analysis-chart-annotation-line-percent">{this.state.maintainingRate}
                                                        </div>
                                                        <div
                                                            className="analysis-chart-annotation-line-count">{this.state.maintainingCount}</div>
                                                        <div style={custom.clear}/>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </Spin>
                                </div>
                            </div>
                        </div> : ''
                    }
                    {window.checkPageEnable('parkingInCome') ?
                        <div className="analysis-index-box" style={{paddingLeft: 12}}>
                            <div className="analysis-chart-box">
                                <div style={{width: "100%", height: "100%"}}>
                                    <div className="analysis-chart-box-head">
                                        <div className="analysis-title">车位收入</div>
                                        {
                                            incomeQueryType === 1 ? (
                                                <RangePicker
                                                    className='analysis-range-picker'
                                                    placeholder={['开始日期', '结束日期']}
                                                    value={dateValue}
                                                    allowClear={false}
                                                    disabledDate={this.disabledDate.bind(this)}
                                                    onChange={this.onDateRangePickerChange.bind(this)}
                                                />
                                            ) : (
                                                <DateRange className="analysis-range-picker"
                                                           type="month"
                                                           onDateRangeChange={this.onMonthRangePickerChange.bind(this)}/>
                                            )
                                        }
                                        <div className="analysis-tabs">
                                            <div
                                                className={"cursor-pointer analysis-tabs-left " + (this.state.incomeQueryType === 1 ? "analysis-selected-tab" : "analysis-unselected-tab")}
                                                onClick={this.choseDay.bind(this)}>日收入
                                            </div>
                                            <div
                                                className={"cursor-pointer analysis-tabs-right " + (this.state.incomeQueryType === 2 ? "analysis-selected-tab" : "analysis-unselected-tab")}
                                                onClick={this.choseMonth.bind(this)}>月收入
                                            </div>
                                            <div style={custom.clear}/>
                                        </div>
                                        <div style={custom.clear}/>
                                    </div>
                                    <Spin spinning={this.state.inIncomeQuery}>
                                        <ReactHighcharts config={columnConfig}/>
                                    </Spin>
                                </div>
                            </div>
                        </div>
                        : ''}

                    <div style={custom.clear}/>
                </div>
            </div>
        )
    }
}

export default Form.create()(AnalysisIndexContainer);

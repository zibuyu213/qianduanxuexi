import React, {Component} from 'react';
import {message, Button, Form, Col, Row, Spin} from 'antd';

import {CSS} from "../../Style/SectionDetails.css";
import {custom} from "../../../../common/SystemStyle";
import {HttpClient} from '../../../../common/HttpClient.jsx';

import { react } from 'react.eval';

import TimeSelectCtrl from "../../../../components/TimeSelectCtrl/TimeSelectCtrl";
import {PageConst} from "../../RoadResourceConst";


const sectionTitleStyle = {
    fontFamily: "PingFangSC-Medium",
    fontSize: "16px",
    color: "rgba(0,0,0,0.85)",
    lineHeight: "24px",
    margin:"8px 0"
};

const titleStyle = {
    fontSize: "14px",
    color: "rgba(0,0,0,0.85)",
    float: "left",
    lineHeight: "22px",
    height:"22px",
    margin:"8px 0"
};

const contentStyle = {
    width:"256px",
    fontSize: "14px",
    color: "rgba(0,0,0,0.65)",
    float: "left",
    lineHeight: "22px",
    margin:"8px 0 8px 4px",
    wordBreak: "break-all"
};

class SectionPriceSettingContent extends Component {
    constructor(props) {
        super(props);

        react(this);
        message.config({
            duration: 1
        });

        this.state = {
            inEdit: this.props.inEdit || false,
            inEditing:false
        }
    }


    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillReceiveProps (nextProps) {
        if (this.props.parkingPrice !== nextProps.parkingPrice){
            this.exitEdit();
        }
    }


    displayData(key1,key2){
        if (this.props.parkingPrice[key1] === null || this.props.parkingPrice[key2] === null) {
            return "未设置";
        }else {
            return this.props.parkingPrice[key1]+ "~" +this.props.parkingPrice[key2];
        }
    }


    getDisplayView(){
        return (
            <div>
                <div style={sectionTitleStyle}>工作日</div>
                <Row gutter={34}>
                    <Col span={8}>
                        <div style={titleStyle}>禁停时段：</div>
                        <div style={contentStyle}>{this.displayData("workdayForbidStartTime","workdayForbidEndTime")}</div>
                        <div style={custom.clear}/>
                    </Col>
                    <Col span={8}>
                        <div style={titleStyle}>免费时段：</div>
                        <div style={contentStyle}>{this.displayData("workdayFreeStartTime","workdayFreeEndTime")}</div>
                        <div style={custom.clear}/>
                    </Col>
                </Row>
                <Row gutter={34}>
                    <Col span={8}>
                        <div style={titleStyle}>白天时段：</div>
                        <div style={contentStyle}>{this.displayData("workdayDaytimeStartTime","workdayDaytimeEndTime")}</div>
                        <div style={custom.clear}/>
                    </Col>
                    <Col span={8}>
                        <div style={titleStyle}>夜间时段：</div>
                        <div style={contentStyle}>{this.displayData("workdayNighttimeStartTime","workdayNighttimeEndTime")}</div>
                        <div style={custom.clear}/>
                    </Col>
                </Row>
                <div style={sectionTitleStyle}>非工作日</div>
                <Row gutter={34}>
                    <Col span={8}>
                        <div style={titleStyle}>禁停时段：</div>
                        <div style={contentStyle}>{this.displayData("weekendForbidStartTime","weekendForbidEndTime")}</div>
                        <div style={custom.clear}/>
                    </Col>
                    <Col span={8}>
                        <div style={titleStyle}>免费时段：</div>
                        <div style={contentStyle}>{this.displayData("weekendFreeStartTime","weekendFreeEndTime")}</div>
                        <div style={custom.clear}/>
                    </Col>
                </Row>
                <Row gutter={34}>
                    <Col span={8}>
                        <div style={titleStyle}>白天时段：</div>
                        <div style={contentStyle}>{this.displayData("weekendDaytimeStartTime","weekendDaytimeEndTime")}</div>
                        <div style={custom.clear}/>
                    </Col>
                    <Col span={8}>
                        <div style={titleStyle}>夜间时段：</div>
                        <div style={contentStyle}>{this.displayData("weekendNighttimeStartTime","weekendNighttimeEndTime")}</div>
                        <div style={custom.clear}/>
                    </Col>
                </Row>

                {/*{checkPageEnable("sectionChargeRuleSet")?<Button type="primary" style={{marginTop:"24px"}} onClick={this.intoEdit.bind(this)}>编辑</Button>:""}*/}
            </div>
        )
    }

    getEditView(){
        return (
            <Spin spinning={this.state.inEditing}>
            <div>
                <div className="sectionDetails_free_title">工作日</div>
                <TimeSelectCtrl
                    id="workdayForbidden"
                    idName="workday_Forbidden"
                    title="禁停时段"
                    require={true}
                    defaultValues={this.checkExist("workdayForbidStartTime") && this.checkExist("workdayForbidEndTime")?
                            [this.props.parkingPrice.workdayForbidStartTime,this.props.parkingPrice.workdayForbidEndTime]
                            :
                            []
                    }
                    style={{float:"left",marginRight:"47px"}}
                />
                <TimeSelectCtrl
                    id="workdayFree"
                    idName="workday_Free"
                    title="免费时段"
                    require={true}
                    defaultValues={this.checkExist("workdayFreeStartTime") && this.checkExist("workdayFreeEndTime")?
                            [this.props.parkingPrice.workdayFreeStartTime,this.props.parkingPrice.workdayFreeEndTime]
                            :
                            []
                    }
                    style={{float:"left",marginRight:"47px"}}
                />
                <div style={custom.clear}/>
                <TimeSelectCtrl
                    id="workdayDaytime"
                    idName="workday_Daytime"
                    title="白天"
                    require={true}
                    defaultValues={this.checkExist("workdayDaytimeStartTime") && this.checkExist("workdayDaytimeEndTime")?
                        [this.props.parkingPrice.workdayDaytimeStartTime,this.props.parkingPrice.workdayDaytimeEndTime]
                        :
                        []
                    }
                    style={{float:"left",marginRight:"47px"}}
                />
                <TimeSelectCtrl
                    id="workdayNighttime"
                    idName="workday_Nighttime"
                    title="夜间"
                    require={true}
                    defaultValues={this.checkExist("workdayNighttimeStartTime") && this.checkExist("workdayNighttimeEndTime")?
                            [this.props.parkingPrice.workdayNighttimeStartTime,this.props.parkingPrice.workdayNighttimeEndTime]
                            :
                            []
                    }
                    style={{float:"left",marginRight:"47px"}}
                />
                <div style={custom.clear}/>
                <div className="sectionDetails_free_title">非工作日</div>
                <TimeSelectCtrl
                    id="weekendForbidden"
                    idName="weekend_Forbidden"
                    title="禁停时段"
                    require={true}
                    defaultValues={this.checkExist("weekendForbidStartTime") && this.checkExist("weekendForbidEndTime")?
                            [this.props.parkingPrice.weekendForbidStartTime,this.props.parkingPrice.weekendForbidEndTime]
                            :
                            []
                    }
                    style={{float:"left",marginRight:"47px"}}
                />
                <TimeSelectCtrl
                    id="weekendFree"
                    idName="weekend_Free"
                    title="免费时段"
                    require={true}
                    defaultValues={this.checkExist("weekendFreeStartTime") && this.checkExist("weekendFreeEndTime")?
                            [this.props.parkingPrice.weekendFreeStartTime,this.props.parkingPrice.weekendFreeEndTime]
                            :
                            []
                    }
                    style={{float:"left",marginRight:"47px"}}
                />
                <div style={custom.clear}/>
                <TimeSelectCtrl
                    id="weekendDaytime"
                    idName="weekend_Daytime"
                    title="白天"
                    require={true}
                    defaultValues={this.checkExist("weekendDaytimeStartTime") && this.checkExist("weekendDaytimeEndTime")?
                            [this.props.parkingPrice.weekendDaytimeStartTime,this.props.parkingPrice.weekendDaytimeEndTime]
                            :
                            []
                    }
                    style={{float:"left",marginRight:"47px"}}
                />
                <TimeSelectCtrl
                    id="weekendNighttime"
                    idName="weekend_Nighttime"
                    title="夜间"
                    require={true}
                    defaultValues={this.checkExist("weekendNighttimeStartTime") && this.checkExist("weekendNighttimeEndTime")?
                        [this.props.parkingPrice.weekendNighttimeStartTime,this.props.parkingPrice.weekendNighttimeEndTime]
                        :
                        []
                    }
                    style={{float:"left",marginRight:"47px"}}
                />
                <div style={custom.clear}/>
                {/*<Button type="primary" className="sectionDetails_free_button" onClick={this.freeDetailConfirm.bind(this)}>保存</Button>
                <Button className="sectionDetails_free_button" onClick={this.freeDetailClear.bind(this)}>重置</Button>
                {
                    this.checkExist("weekendNighttimeStartTime") &&
                    this.checkExist("weekendNighttimeEndTime") &&
                    this.checkExist("weekendDaytimeStartTime") &&
                    this.checkExist("weekendDaytimeEndTime") &&
                    this.checkExist("weekendFreeStartTime") &&
                    this.checkExist("weekendFreeEndTime") &&
                    this.checkExist("weekendForbidStartTime") &&
                    this.checkExist("weekendForbidEndTime") &&
                    this.checkExist("workdayNighttimeStartTime") &&
                    this.checkExist("workdayNighttimeEndTime") &&
                    this.checkExist("workdayDaytimeStartTime") &&
                    this.checkExist("workdayDaytimeEndTime") &&
                    this.checkExist("workdayFreeStartTime") &&
                    this.checkExist("workdayFreeEndTime") &&
                    this.checkExist("workdayForbidStartTime") &&
                    this.checkExist("workdayForbidEndTime")?
                        <Button className="sectionDetails_free_button" onClick={this.freeDetailCancel.bind(this)}>取消</Button>
                        :
                        ""
                }*/}
            </div>
            </Spin>
        )
    }

    /*计费详情*/
    //重置按钮
    freeDetailClear(){
        react('workdayForbidden.reset');
        react('workdayFree.reset');

        react('workdayDaytime.reset');
        react('workdayNighttime.reset');
        //weekend
        react('weekendForbidden.reset');
        react('weekendFree.reset');

        react('weekendDaytime.reset');
        react('weekendNighttime.reset');

    }

    //取消按钮
    freeDetailCancel(){
        // react('workdayForbidden.recover');
        // react('workdayFree.recover');
        //
        // react('workdayDaytime.recover');
        // react('workdayNighttime.recover');
        //
        // react('weekendForbidden.recover');
        // react('weekendFree.recover');
        //
        // react('weekendDaytime.recover');
        // react('weekendNighttime.recover');
        this.exitEdit();
    }

    checkExist(name){
        if (this.props.parkingPrice[name] !== null){
            return true;
        }else {
            return false;
        }
    }


    calc(start,end,identify){
        let startArray = start.split(":");
        let startNum = parseInt(startArray[0]) + parseInt(startArray[1])/60;
        console.log(startNum);


        let endArray = end.split(":");
        let endNum = parseInt(endArray[0]) + parseInt(endArray[1])/60;
        console.log(endNum);

        //结束小于开始 表示跨天 结束以24为起点
        if (endNum < startNum){
            endNum = 24;
        }


        let result = {
            start: startNum,
            end: endNum,
            key: identify
        };

        console.log(result);

        return result;
    }

    checkDup(array){
        let result = true;
        array.map((item, index) => {
            if (index < array.length - 1){
                let B = item.end;
                let nextA = array[index + 1].start;
                //如果 结尾值 大于下项开始值 有重合部分
                if (nextA < B){
                    result = false;
                }
            }
        });

        return result;
    }

    //提交按钮
    freeDetailConfirm() {
        if (this.props.status === 1) {
            message.error("请先停用该路段！");
            return;
        }

        let hasErr = false;
        let params = {
            parkingPriceId: this.props.parkingPrice.parkingPriceId
        };

        PageConst.paramKeys.map(item => {
            let err = react(item.getErrorMehtod, item.toastKey)();
            if (!err) {
                params[item.paramKey] = react(item.getValueMehtod, item.toastKey)();
            } else {
                hasErr = true;
            }
        });

        if (!hasErr) {
            console.log("put params",params);

            let workdayArray = [];
            workdayArray.push(this.calc(params.workdayDaytimeStartTime, params.workdayDaytimeEndTime, "Daytime"));
            workdayArray.push(this.calc(params.workdayForbidStartTime, params.workdayForbidEndTime, "Forbid"));
            workdayArray.push(this.calc(params.workdayFreeStartTime, params.workdayFreeEndTime, "Free"));
            workdayArray.push(this.calc(params.workdayNighttimeStartTime, params.workdayNighttimeEndTime, "Nighttime"));

            workdayArray.sort((a, b)=>{
                return a.start - b.start;
            });
            if (!this.checkDup(workdayArray)){
                message.error("工作日时间区间选择有冲突，请重新选择！");
                return false;
            }

            let weekendArray = [];
            weekendArray.push(this.calc(params.weekendDaytimeStartTime, params.weekendDaytimeEndTime, "Daytime"));
            weekendArray.push(this.calc(params.weekendForbidStartTime, params.weekendForbidEndTime, "Forbid"));
            weekendArray.push(this.calc(params.weekendFreeStartTime, params.weekendFreeEndTime, "Free"));
            weekendArray.push(this.calc(params.weekendNighttimeStartTime, params.weekendNighttimeEndTime, "Nighttime"));
            weekendArray.sort((a, b)=>{
                return a.start - b.start;
            });
            if (!this.checkDup(weekendArray)){
                message.error("非工作日时间区间选择有冲突，请重新选择！");
                return false;
            }


            this.setState({
                // inEditing:true
            });
            return params;
            HttpClient.query('/parking-resource/admin/resource/parking/parkingPrice', HttpClient.PUT, JSON.stringify(params), this.fetchUpdateFreeDetail.bind(this));
        }else {
            return false
        }
    }

    fetchUpdateFreeDetail(d,type){
        if (type === HttpClient.requestSuccess){
            message.success(d.data,1,()=>{
                //刷新数据
                // react('SectionDetailCard.queryRoadResource');
            });
        }else {
            this.setState({
                inEditing:false
            });
        }
    }


    intoEdit(){
        if (this.props.status === 1) {
            message.error("请先停用该路段！");
            return;
        }
        this.setState({
            inEdit:true
        })
    }

    exitEdit(){
        this.setState({
            inEdit:false,
            inEditing:false
        })
    }

    render() {


        return (
            <div>
                {this.state.inEdit?
                    <div>{this.getEditView()}</div>
                    :
                    <div>{this.getDisplayView()}</div>
                }
            </div>
        )
    }
}



export default Form.create()(SectionPriceSettingContent);

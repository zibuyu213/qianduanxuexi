import React, {Component} from 'react';
import {Card, Row, Col, Switch, message} from 'antd';


import {CSS} from "../../Style/SectionResource.css";
import {custom} from "../../../../common/SystemStyle";
import {HttpClient} from '../../../../common/HttpClient.jsx';
import {Global} from "../../../../common/SystemFunction";

import { react } from 'react.eval';

const auditStatus = {
    0: '已停用',
    1: '已启用'
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
    maxWidth:"256px",
    fontSize: "14px",
    color: "rgba(0,0,0,0.65)",
    float: "left",
    lineHeight: "22px",
    margin:"8px 0 8px 4px",
    wordBreak: "break-all"
};

const switchStyle = {
    width:"256px",
    fontSize: "14px",
    color: "rgba(0,0,0,0.65)",
    float: "left",
    lineHeight: "22px",
    margin:"6px 0 8px 4px",
    wordBreak: "break-all"
};

const statusStyle = {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    marginTop: "8px",
    marginRight: "8px"
};

export default class SectionDetailCard extends Component {
    constructor(props) {
        super(props);

        react(this);
        message.config({
            duration: 1
        });


        this.state = {
            roadInfo: undefined,   //路段信息
            switchCheckedStatus:false,
            isLoading:false,
            inChange:false  //停启
        }
    }


    componentWillMount() {

    }

    componentDidMount() {
        this.queryRoadResource();
    }

    //获取路段资源详情
    queryRoadResource(){
        this.setState({
            isLoading: true
        });
        let id = 1001;
        if (HttpClient.REQUEST === "truth") {
            id = this.props.parkId;
        }
        HttpClient.query(window.MODULE_PARKING_RESOURCE + `/admin/resource/parking/` + id, "GET", null, this.fetchRoadResource.bind(this));
    }


    fetchRoadResource(e, type) {
        this.setState({
            isLoading: false
        });
        if (type === HttpClient.requestSuccess) {
            this.setState({
                roadInfo: e.data,
                switchCheckedStatus:e.data.parkingState === 0 ? false:true
            });
            react('SectionPriceCard.setRoadInfo',e.data);
            react('SectionSpaceCard.queryParkingPointList');
        }
    }

    //资源路段停启用
    handleChangeStatus(state) {
        if (!this.state.inChange){
            this.state.inChange = true;
            // message.loading("");
            console.log("start single operate");
            this.setState({
                isLoading: true
            });
            let id = this.props.parkId;
            let batchList=[{
                id:id,
                parkingState:state===true?1:0
            }];
            HttpClient.query(window.MODULE_PARKING_RESOURCE + `/admin/resource/parking`, "PUT", JSON.stringify(batchList), this.singleOperateResponse.bind(this));
        }
    }

    singleOperateResponse(e, type) {
        // message.destroy();
        this.state.inChange = false;
        if (type === HttpClient.requestSuccess) {
            message.success(e.data);
        }
        this.queryRoadResource();
    }

    //资源路段停启用
    handleParkingStateChange(checked) {
        this.setState({
            switchCheckedStatus:checked
        });
        //调用接口
        this.handleChangeStatus(checked);
    }



    // loading={this.state.isLoading}
    render() {
        return (
            <Card
                title='路段详情'
            >
                {this.state.roadInfo !== undefined ?
                    <div>
                        <Row gutter={34}>
                            <Col span={8}>
                                <div style={titleStyle}>备案编号：</div>
                                <div style={contentStyle}>{this.state.roadInfo.parkingRecordNo}</div>
                                <div style={custom.clear}/>
                            </Col>
                            <Col span={8}>
                                <div style={titleStyle}>路段名称：</div>
                                <div style={contentStyle}>{this.state.roadInfo.parkingName}</div>
                                <div style={custom.clear}/>
                            </Col>
                            <Col span={8}>
                                <div style={titleStyle}>街道名称：</div>
                                <div style={contentStyle}>{this.state.roadInfo.streetName}</div>
                                <div style={custom.clear}/>
                            </Col>
                        </Row>
                        <Row gutter={34}>
                            <Col span={8}>
                                <div style={titleStyle}>行政区域：</div>
                                <div style={contentStyle}>{`${this.state.roadInfo.provinceName!==null?this.state.roadInfo.provinceName:""}${this.state.roadInfo.cityName!==null?'/'+this.state.roadInfo.cityName:''}${this.state.roadInfo.areaName!==null?'/'+this.state.roadInfo.areaName:''}`}</div>
                                <div style={custom.clear}/>
                            </Col>
                            <Col span={8}>
                                <div style={titleStyle}>所属公司：</div>
                                <div style={contentStyle}>{this.state.roadInfo?this.state.roadInfo.partnerCompanyName:""}</div>
                                <div style={custom.clear}/>
                            </Col>
                            <Col span={8} style={{display:'flex'}}>
                                <div style={titleStyle}>运行状态：</div>
                                {window.checkPageEnable("sectionUpdate")?
                                    <div style={switchStyle}>
                                        <Switch
                                            checked={this.state.switchCheckedStatus}
                                            checkedChildren={<div style={{fontSize: '12px',color: '#FFFFFF',textAlign: 'right',lineHeight: '20px'}}>启用</div>}
                                            unCheckedChildren={<div style={{fontSize: '12px',color: '#FFFFFF',textAlign: 'right',lineHeight: '20px'}}>停用</div>}
                                            onChange={this.handleParkingStateChange.bind(this)}
                                        />
                                    </div>:
                                    <div style={contentStyle}>
                                        <span style={statusStyle} className={`sectionDetail_auditStatus ${this.state.roadInfo.parkingState === 1 ? 'sectionResource_auditStatus_success' : 'sectionResource_auditStatus_fail'}`}/>
                                        {auditStatus[this.state.roadInfo.parkingState]}
                                    </div>
                                }

                            </Col>
                        </Row>
                        <Row gutter={34}>
                            <Col span={8}>
                                <div style={titleStyle}>范围/描述：</div>
                                <div style={contentStyle}>{this.state.roadInfo?this.state.roadInfo.parkingDesc:""}</div>
                                <div style={custom.clear}/>
                            </Col>
                            <Col span={8}>
                                <div style={titleStyle}>泊位数量：</div>
                                <div style={contentStyle}>{this.state.roadInfo?this.state.roadInfo.parkingSpaceTotal:""}</div>
                                <div style={custom.clear}/>
                            </Col>
                            <Col span={8}>
                                <div style={titleStyle}>有无车检器：</div>
                                <div style={contentStyle}>{this.state.roadInfo?(this.state.roadInfo.hasDetector?'有':'无'):''}</div>
                                <div style={custom.clear}/>
                            </Col>
                        </Row>
                    </div>
                    :
                    ""}
            </Card>
        )
    }
}

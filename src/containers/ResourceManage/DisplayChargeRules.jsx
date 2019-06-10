import React, {Component} from 'react';
import {CSS} from "./Style/Rule.css";
import './Style/SectionResource.css'
import {HttpClient} from "../../common/HttpClient";
import {custom} from "../../common/SystemStyle";

import RuleEdit from './Components/RuleEdit';
import RuleDisplay from './Components/RuleDisplay';

import {Button, Form, Table, Pagination, message, Popconfirm, Radio, Input, Spin} from "antd";
import {Global} from "../../common/SystemFunction";
import Exception from '../../components/Exception';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


export default class DisplayChargeRules extends Component {
    constructor (props) {
        super(props);

        message.config({
            duration: 1
        });

        this.state = {
            //列表参数
            rule: undefined,
            isLoading: false,
            inEdit: false
        }
    }


    componentWillMount () {

    }

    componentDidMount () {
        this.queryRuleDetail();
    }


    queryRuleDetail () {
        this.setState({
            isLoading: true
        });
        let id = 1001;
        if (HttpClient.REQUEST == "truth") {
            id = this.props.location.query.id;
        }
        HttpClient.query('/parking-resource/parkingPriceRules/' + id, HttpClient.GET, null, this.fetchRuleDetail.bind(this));
    }

    fetchRuleDetail (e, type) {
        this.setState({
            isLoading: false
        });
        if (type == HttpClient.requestSuccess) {
            this.setState({
                rule: e.data
            })
        }
    }

    //submit(){
    //    this.cancelEdit();
    //    this.queryRuleDetail();
    //}

    edit () {
        if (this.state.rule && this.state.rule.status && this.state.rule.hasParking) {//
            message.error('此计费规则正在应用，无法编辑');
        } else {
            location.hash = location.hash.split("#")[1].replace("DisplayChargeRules", "EditChargeRules");
        }
        //'/ResourceManage/ChargeRules/EditChargeRules/' + Global.getUrlId(window.location.hash);
        //DisplayChargeRules
    }

    //cancelEdit(){
    //    this.setState({
    //        inEdit:false
    //    })
    //}

    render () {
        // console.log(this.props.routes);
        //判断页面权限
        if (!window.checkPageEnable("chargeRuleAdd") && !window.checkPageEnable("chargeRuleUpdate")) {
            return <Exception type={403}/>
        }
        return (
            <div className="page">
                <Spin tip="加载中.." spinning={this.state.isLoading}>
                    <div className="page-header" style={{ position: "relative", height: 64 }}>
                        <div
                            style={{ float: "left" }}>{this.state.inEdit ? "编辑计费规则" : this.state.rule !== undefined ? this.state.rule.name : ""}</div>
                        <div className="detail_header_status_box"
                             style={{ right: (this.state.inEdit || !window.checkPageEnable("chargeRuleUpdate") ? 32 : 129) }}>
                            <div className="detail_header_status_title">生效状态</div>
                            <div className="detail_header_status_tag"
                                 style={{ backgroundColor: (this.state.rule && this.state.rule.status ? "#66BD5C" : "#F5222D") }}/>
                            <div
                                className="detail_header_status_text">{this.state.rule && this.state.rule.status ? "已启用" : "未启用"}</div>
                            <div style={custom.clear}/>
                        </div>
                        {!window.checkPageEnable('chargeRuleUpdate') ?
                            ""
                            :
                            <Button type="primary" style={{ float: "right" }} onClick={this.edit.bind(this)}>编辑</Button>
                        }
                        <div style={custom.clear}/>
                    </div>
                    <RuleDisplay rule={this.state.rule}/>
                </Spin>
            </div>
        )
    }


}

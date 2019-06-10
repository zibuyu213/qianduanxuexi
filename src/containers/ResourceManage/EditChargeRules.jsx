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


export default class EditChargeRules extends Component {
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
        if (!window.checkPageEnable("chargeRuleUpdate")) return;
        this.queryRuleDetail();
    }


    queryRuleDetail () {
        this.setState({
            isLoading: true
        });
        let id = 1001;
        if (HttpClient.REQUEST == "truth") {
            id = this.props.window.location.query.id;
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
        console.log('计费规则详情：', e.data)
    }

    submit (newId) {
        window.location.hash = "ResourceManage/ChargeRules/DisplayChargeRules?id=" + newId;
    }

    cancelEdit () {
        window.location.hash = window.location.hash.split("#")[1].replace("EditChargeRules", "DisplayChargeRules");
    }

    render () {
        //判断页面权限
        if (!window.checkPageEnable("chargeRuleUpdate")) {
            return <Exception type={403}/>
        }

        return (
            <div className="page">
                <div className="page-header" style={{ position: "relative", height: 64 }}>
                    <div style={{ float: "left" }}>编辑计费规则</div>
                    <div style={custom.clear}/>
                </div>
                <Spin tip="加载中.." spinning={this.state.isLoading}>
                    {this.state.rule !== undefined ? <RuleEdit rule={this.state.rule}
                                                               cancel={this.cancelEdit.bind(this)}
                                                               submit={this.submit.bind(this)}
                    /> : <div className="page-content"></div>}
                </Spin>
            </div>
        )
    }


}

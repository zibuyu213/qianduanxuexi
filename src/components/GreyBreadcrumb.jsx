import React, {Component} from 'react';
import {Breadcrumb} from 'antd';
import {Link} from 'react-router';
import _ from 'lodash';

const totalPathList = [
    {
        name: "首页",
        path: 'Home'
    }, {
        name: "统计分析",
        path: 'AnalysisIndex'
    }, {
        name: "泊位占用详情",
        path: 'AnalysisDetail'
    }, {
        name: "报警管理",
        path: 'AlarmManage'
    }, {
        name: "违停报警",
        path: 'AbnormalParkingAlarm'
    }, {
        name: "报警详情",
        path: 'AlarmDetail'
    }, {
        name: "异常订单报警",
        path: 'AbnormalOrderAlarm'
    }, {
        name: "报警详情",
        path: 'OrderAlarmDetail'
    }, {
        name: "合作方管理",
        path: 'PartnerManage'
    }, {
        name: "合作方列表",
        path: 'PartnerList'
    }, {
        name: "新建合作方",
        path: 'NewPartner'
    }, {
        name: "编辑合作方",
        path: 'Update'
    }, {
        name: "合作方详情",
        path: 'PartnerDetail'
    }, {
        name: "合作方主账号",
        path: 'PartnerAccounts'
    }, {
        name: "资源管理",
        path: 'ResourceManage'
    }, {
        name: "路段资源",
        path: 'SectionResource'
    }, {
        name: "路段详情",
        path: 'SectionDetails'
    }, {
        name: "计费规则详情",
        path: 'DisplayChargeRules'
    }, {
        name: "编辑计费规则",
        path: 'EditChargeRules'
    }, {
        name: "计费规则",
        path: 'ChargeRules'
    }, {
        name: "新建计费规则",
        path: 'InsertChargeRules'
    }, {
        name: "计费规则详情",
        path: 'DisplayChargeRules'
    }, {
        name: "编辑计费规则",
        path: 'EditChargeRules'
    }, {
        name: "收费时段",
        path: 'ChargeTimes'
    }, {
        name: "收费时段详情",
        path: 'ChargeTimesDetails'
    }, {
        name: "新建收费时段",
        path: 'InsertChargeTimes'
    }, {
        name: "编辑收费时段",
        path: 'EditChargeTimes'
    }, {
        name: "交易管理",
        path: 'DealManage'
    }, {
        name: "停车记录",
        path: 'ParkingRecord'
    }, {
        name: "订单详情",
        path: 'ParkingRecordDetail'
    }, {
        name: "申诉处理",
        path: 'AppealManage'
    }, {
        name: "申诉详情",
        path: 'AppealDetail'
    }, {
        name: "财务管理",
        path: 'FinancialManage'
    }, {
        name: "发票管理",
        path: 'InvoicesManage'
    }, {
        name: "发票详情",
        path: 'InvoiceDetail'
    }, {
        name: "财报下载",
        path: 'FinancialReportsDownload'
    }, {
        name: "权限管理",
        path: 'AuthorizationManage'
    }, {
        name: "用户管理",
        path: 'UserManage'
    }, {
        name: "角色管理",
        path: 'RoleManage'
    }, {
        name: "名单管理",
        path: 'RosterManage'
    }, {
        name: "黑名单",
        path: 'BlackList'
    }, {
        name: "优惠名单",
        path: 'WhiteList'
    }, {
        name: "稽查管理",
        path: 'InspectionManage'
    }, {
        name: "班次管理",
        path: 'ScheduleManage'
    }, {
        name: "稽查组管理",
        path: 'InspectionGroup'
    }, {
        name: "新建稽查组",
        path: 'AddInspectionGroup'
    }, {
        name: "编辑稽查组",
        path: 'EditInspectionGroup'
    }, {
        name: "稽查组详情",
        path: 'InspectionGroupDetail'
    }, {
        name: "编辑排班",
        path: 'EditSchedule'
    }, {
        name: "会员管理",
        path: 'VipManage'
    }, {
        name: "会员列表",
        path: 'VipList'
    }, {
        name: "会员详情",
        path: 'VipDetail'
    }, {
        name: "会员积分管理",
        path: 'VipPoints'
    }, {
        name: "系统配置",
        path: 'SystemConfig'
    }, {
        name: "财务账号参数",
        path: 'FinancialAccountParams'
    }, {
        name: "业务账号参数",
        path: 'BusinessAccountParams'
    }, {
        name: "节假日配置",
        path: 'HolidayConfig'
    }, {
        name: "客服配置",
        path: 'CustomerService'
    }, {
        name: "配置",
        path: 'CustomerServiceConfig'
    }, {
        name: "可视化",
        path: 'Visualization'
    }, {
        name: '泊位详情',
        path: 'BerthDetails'
    }, {
        name: '仪表盘',
        path: 'Today'
    }
];
export default class GreyBreadcrumb extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {

    }

    componentDidMount() {
    }

    getBreadName(path, i, pathArr) {
        let index = _.findIndex(totalPathList, function (o) {
            return o.path.toLowerCase() === path.toLowerCase();
        });
        if (index > -1) {
            if (i === 1 || i === pathArr.length - 1) {
                return <Breadcrumb.Item key={i}>{totalPathList[index].name}</Breadcrumb.Item>;
            } else {
                let url = "";
                for (let j = i; j > 0; j--) {
                    url = "/" + pathArr[j] + url;
                }
                return <Breadcrumb.Item key={i}><Link to={url}>{totalPathList[index].name}</Link></Breadcrumb.Item>;
            }
        } else {
            return null;
        }
    }


    render() {
        let pathHash = window.location.hash.split('?')[0];
        let pathArr = _.split(pathHash, '/');
        return (
            <Breadcrumb style={{ padding: '16px 32px 0 32px', background: "white" }}>
                {pathArr.map((path, i) => this.getBreadName(path, i, pathArr))}
            </Breadcrumb>
        )
    }


}

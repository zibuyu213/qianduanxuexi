import React, {Suspense, lazy} from 'react';
import _ from 'lodash';
import {Route, IndexRedirect, IndexRoute} from 'react-router';
import App from '../containers/App.jsx';

// import Index from '../containers/IndexContainer/IndexContainer.jsx';
// import AnalysisIndexContainer from "../containers/Home/AnalysisIndexContainer.jsx";//统计分析
// import AnalysisDetailContainer from "../containers/Home/AnalysisDetailContainer.jsx";//泊位图
import LoginContainer from '../containers/LoginContainer/LoginContainer.jsx'; //登录页
import ResetPassword from '../containers/LoginContainer/ResetPassword.jsx'; //修改密码
import PartnerList from '../containers/PartnerManage/PartnerListContainer.jsx';//合作方列表
import NewPartner from '../containers/PartnerManage/NewPartner.jsx';//新建合作方
import UpdatePartner from '../containers/PartnerManage/UpdatePartner.jsx';//编辑合作方
import PartnerDetail from '../containers/PartnerManage/PartnerDetail.jsx';//合作方详情
import PartnerAccounts from '../containers/PartnerManage/PartnerAccounts.jsx';//合作方主账号
// import PartnerOrganization from '../containers/PartnerManage/PartnerOrganization.jsx';//合作方组织结构
import SectionResource from '../containers/ResourceManage/SectionResource.jsx';//路段资源
import SectionDetails from '../containers/ResourceManage/SectionDetails.jsx';//路段资源
import ChargeRules from '../containers/ResourceManage/ChargeRules.jsx';//收费规则
import InsertChargeRules from '../containers/ResourceManage/InsertChargeRules.jsx';//收费规则
import DisplayChargeRules from '../containers/ResourceManage/DisplayChargeRules.jsx';//收费规则
import EditChargeRules from '../containers/ResourceManage/EditChargeRules.jsx';//收费规则
import ChargeTimes from '../containers/ResourceManage/ChargeTimes.jsx'; //收费时段
import ChargeTimesDetails from '../containers/ResourceManage/ChargeTimesDetails.jsx'//收费时段详情
import InsertChargeTimes from '../containers/ResourceManage/InsertChargeTimes.jsx'; //新建收费时段
import EditChargeTimes from '../containers/ResourceManage/EditChargeTimes.jsx'; //编辑收费时段
import ParkingRecord from '../containers/DealManage/ParkingRecord.jsx';//停车记录
import ParkingRecordDetail from '../containers/DealManage/ParkingRecordDetail.jsx';//停车记录详情
import AppealManage from '../containers/DealManage/AppealManage.jsx';// 申诉处理
import AppealDetail from '../containers/DealManage/AppealDetail.jsx';// 申诉处理详情
import AbnormalParkingAlarm from '../containers/AlarmManage/AbnormalParkingAlarm.jsx';// 异常停车报警
import AlarmDetail from '../containers/AlarmManage/AlarmDetail.jsx'; //报警详情
import InvoicesManage from '../containers/FinancialManage/InvoicesManage.jsx'; //财务管理
import InvoiceDetail from '../containers/FinancialManage/InvoiceDetail.jsx'; //发票详情
import FinancialReportsDownload from '../containers/FinancialManage/FinancialReportsDownload.jsx'; //财报下载
import UserManage from '../containers/AuthorizationManage/UserManage.jsx';//用户管理
import RoleManage from '../containers/AuthorizationManage/RoleManage.jsx';//角色管理
import BlackList from '../containers/RosterManage/BlackList.jsx';//黑名单
import WhiteList from '../containers/RosterManage/WhiteList.jsx';//优惠名单
import FinancialAccountParams from '../containers/SystemConfig/FinancialAccountParams.jsx';//财务账号参数
import BusinessAccountParams from '../containers/SystemConfig/BusinessAccountParams.jsx';//业务账号参数
import HolidayConfig from '../containers/SystemConfig/HolidayConfig.jsx';//节假日配置
import InspectionGroup from '../containers/InspectionManage/InspectionGroup.jsx';//稽查组管理
import AddInspectionGroup from '../containers/InspectionManage/AddInspectionGroup';//新建稽查组
import EditInspectionGroup from '../containers/InspectionManage/EditInspectionGroup.jsx';//编辑稽查组
import ScheduleManage from '../containers/InspectionManage/ScheduleManage.jsx';//稽查组管理
import InspectionGroupDetail from '../containers/InspectionManage/InspectionGroupDetail.jsx';//稽查组详情
import EditSchedule from '../containers/InspectionManage/EditSchedule.jsx';//编辑排班
import VipList from '../containers/VipManage/VipList.jsx';//会员列表
import VipDetail from '../containers/VipManage/VipDetail.jsx';//会员详情
import VipPoints from '../containers/VipManage/VipPoints.jsx';//会员积分管理
import AbnormalOrderAlarm from '../containers/AlarmManage/AbnormalOrderAlarm';//异常订单报警
import OrderAlarmDetail from '../containers/AlarmManage/OrderAlarmDetail';//异常订单详情
import CustomerService from '../containers/SystemConfig/CustomerService';//客服展示页
import CustomerServiceConfig from '../containers/SystemConfig/CustomerServiceConfig';//客服配置页

import Today from "../containers/Home/Today.jsx";//今日数据
import Visualization from '../containers/Home/Visualization'; //可视化页面
import BerthDetails from '../containers/BerthManage/BerthDetails'//泊位详情

import VipLog from "../containers/OperatingCenter/VipLog.jsx";//会员列表记录
import VipLogDetails from "../containers/OperatingCenter/VipLogDetails.jsx";//会员详情
import VipDelLog from "../containers/OperatingCenter/VipDelLog.jsx";//会员注销记录
import ComplainList from "../containers/OperatingCenter/ComplainList.jsx";//投诉建议
import ComplainDetails from "../containers/OperatingCenter/ComplainDetails.jsx";//投诉建议详情及处理

import ComplainWorkOrder from "../containers/OperationsAndCenter/WorkOrder/ComplainWorkOrder.jsx";//投诉工单
import ComplainWorkOrderDetails from "../containers/OperationsAndCenter/WorkOrder/ComplainWorkOrderDetails.jsx";//投诉工单详情
import FacilityMaintenance from "../containers/OperationsAndCenter/WorkOrder/FacilityMaintenance.jsx";//设备维保
import FacilityMaintenanceDetails from "../containers/OperationsAndCenter/WorkOrder/FacilityMaintenanceDetails.jsx";//设备维保详情

import Text from "../containers/Text/Text.jsx";//例子


import Page403 from '../containers/ExceptionPage/Page403' // 403页面
import NotMatch from '../containers/ExceptionPage/Page404'

//登录认证
const requireAuth = (nextState, replace) => {
    let cookie = window.customCookie.get('access_token');
    if (window.pageMenu[0] === 0 && !window.checkPageEnable(`/${_.last(nextState.location.pathname.split('/'))}`)) {
        // replace('/403')
    }
    if (cookie) {
        return;
    }
    replace('/Login');
};
export default (
    <Route path="/" component={App}>
        <Route path="Login" component={LoginContainer}/>
        <Route path='ResetPassword' component={ResetPassword}/>
        <IndexRedirect to="/Home/Today"/>
        <Route path="Home" breadcrumbName="监控中心">
            <Route path="Today" breadcrumbName="今日数据" component={Today} onEnter={requireAuth} />
            <Route path='Visualization' breadcrumbName="可视化监控">
                <IndexRoute component={Visualization}/>
                <Route path="BerthDetails" breadcrumbName="泊位详情" component={BerthDetails}/>
            </Route>
        </Route>
        <Route path="text" breadcrumbName="测试">
            <Route path="text" breadcrumbName="测试页面">
                <Route path="text" component={Text} breadcrumbName="测试页面"/>
            </Route>
        </Route>


        <Route path="OperationsAndCenter" breadcrumbName="运维中心">
            <Route path="WorkOrder" breadcrumbName="工单管理">
                <Route path="ComplainWorkOrder" breadcrumbName="投诉工单">
                    <IndexRoute component={ComplainWorkOrder}/>
                    <Route path="ComplainWorkOrderDetails" component={ComplainWorkOrderDetails} breadcrumbName="投诉工单详情"/>
                </Route>
                <Route path="FacilityMaintenance" breadcrumbName="设备维保">
                    <IndexRoute component={FacilityMaintenance}/>
                    <Route path="FacilityMaintenanceDetails" component={FacilityMaintenanceDetails} breadcrumbName="设备维保详情"/>
                </Route>
            </Route>
        </Route>

        <Route path="OperatingCenter" breadcrumbName="运营中心">
            <Route path="Vip" breadcrumbName="会员列表">
                <IndexRoute component={VipLog}/>
                <Route path="VipLogDetails" component={VipLogDetails} breadcrumbName="会员详情"/>
            </Route>
            <Route path="Complain" breadcrumbName="投诉建议">
                <IndexRoute component={ComplainList}/>
                <Route path="ComplainDetails" component={ComplainDetails} breadcrumbName="投诉详情"/>
            </Route>
        </Route>

        <Route path="AlarmManage" breadcrumbName="报警管理">
            <Route path="AbnormalParkingAlarm" breadcrumbName="违停报警">
                <IndexRoute component={AbnormalParkingAlarm} onEnter={requireAuth}/>
                <Route path="AlarmDetail" component={AlarmDetail} breadcrumbName="报警详情" onEnter={requireAuth}/>
            </Route>
            <Route path="AbnormalOrderAlarm" breadcrumbName="异常订单报警">
                <IndexRoute component={AbnormalOrderAlarm} onEnter={requireAuth}/>
                <Route path="OrderAlarmDetail" component={OrderAlarmDetail} breadcrumbName="报警详情"
                       onEnter={requireAuth}/>
            </Route>
        </Route>
        <Route path="PartnerManage" breadcrumbName="合作方管理">
            <Route path="PartnerList" breadcrumbName="合作方列表">
                <IndexRoute component={PartnerList} onEnter={requireAuth}/>
                <Route path="NewPartner" breadcrumbName="新建合作方" component={NewPartner} onEnter={requireAuth}/>
                <Route path="Update" breadcrumbName="编辑合作方" component={UpdatePartner} onEnter={requireAuth}/>
                <Route path="PartnerDetail" breadcrumbName="合作方详情" component={PartnerDetail} onEnter={requireAuth}/>
            </Route>
            <Route path="PartnerAccounts" breadcrumbName="合作方主账号" component={PartnerAccounts}/>
            {/*<Route path="PartnerOrganization" breadcrumbName="合作方组织结构" component={PartnerOrganization}/>*/}
        </Route>
        <Route path="ResourceManage" breadcrumbName="资源管理">
            <Route path="SectionResource" breadcrumbName="路段资源">
                <IndexRoute component={SectionResource} onEnter={requireAuth}/>
                <Route path="SectionDetails" breadcrumbName="路段详情">
                    <IndexRoute component={SectionDetails} onEnter={requireAuth}/>
                    <Route path="DisplayChargeRules" breadcrumbName="计费规则详情" component={DisplayChargeRules}
                           onEnter={requireAuth}/>
                    <Route path="EditChargeRules" breadcrumbName="编辑计费规则" component={EditChargeRules}
                           onEnter={requireAuth}/>
                </Route>
            </Route>
            <Route path="ChargeRules" breadcrumbName="计费规则">
                <IndexRoute component={ChargeRules} onEnter={requireAuth}/>
                <Route path="InsertChargeRules" breadcrumbName="新建计费规则" component={InsertChargeRules}
                       onEnter={requireAuth}/>
                <Route path="DisplayChargeRules" breadcrumbName="计费规则详情" component={DisplayChargeRules}
                       onEnter={requireAuth}/>
                <Route path="EditChargeRules" breadcrumbName="编辑计费规则" component={EditChargeRules}
                       onEnter={requireAuth}/>
            </Route>
            <Route path='ChargeTimes' breadcrumbName='收费时段'>
                <IndexRoute component={ChargeTimes} onEnter={requireAuth}/>
                <Route path="ChargeTimesDetails" breadcrumbName="收费时段详情" component={ChargeTimesDetails}
                       onEnter={requireAuth}/>
                <Route path="InsertChargeTimes" breadcrumbName="新建收费时段" component={InsertChargeTimes}
                       onEnter={requireAuth}/>
                <Route path="EditChargeTimes" breadcrumbName="编辑收费时段" component={EditChargeTimes}
                       onEnter={requireAuth}/>
            </Route>
        </Route>
        <Route path="DealManage" breadcrumbName="交易管理">
            <Route path="ParkingRecord" breadcrumbName="停车记录">
                <IndexRoute component={ParkingRecord} onEnter={requireAuth}/>
                <Route path='ParkingRecordDetail' breadcrumbName='订单详情'>
                    <IndexRoute component={ParkingRecordDetail} onEnter={requireAuth}/>
                    <Route path='AppealDetail' breadcrumbName='查看详情' component={AppealDetail} onEnter={requireAuth}/>
                </Route>
            </Route>
            <Route path="AppealManage" breadcrumbName="申诉处理">
                <IndexRoute component={AppealManage} onEnter={requireAuth}/>
                <Route path='AppealDetail' breadcrumbName='查看详情'>
                    <IndexRoute component={AppealDetail} onEnter={requireAuth}/>
                    <Route path='ParkingRecordDetail' breadcrumbName='订单详情' component={ParkingRecordDetail}
                           onEnter={requireAuth}/>
                </Route>
                <Route path='ParkingRecordDetail' breadcrumbName='订单详情' component={ParkingRecordDetail}
                       onEnter={requireAuth}/>
            </Route>
        </Route>
        <Route path="FinancialManage" breadcrumbName="财务管理">
            <Route path="InvoicesManage" breadcrumbName="发票管理">
                <IndexRoute component={InvoicesManage} onEnter={requireAuth}/>
                <Route path='InvoiceDetail' breadcrumbName='发票详情' component={InvoiceDetail} onEnter={requireAuth}/>
            </Route>
            <Route path='FinancialReportsDownload' component={FinancialReportsDownload} breadcrumbName='财报下载'/>
        </Route>
        <Route path="AuthorizationManage" breadcrumbName="权限管理">
            <Route path="UserManage" breadcrumbName="用户管理" component={UserManage}/>
            <Route path="RoleManage" breadcrumbName="角色管理" component={RoleManage}/>
        </Route>
        <Route path="RosterManage" breadcrumbName="名单管理">
            <Route path="BlackList" breadcrumbName="黑名单" component={BlackList}/>
            <Route path="WhiteList" breadcrumbName="优惠名单" component={WhiteList}/>
        </Route>
        <Route path="InspectionManage" breadcrumbName="稽查管理">
            <Route path="ScheduleManage" component={ScheduleManage} breadcrumbName="班次管理" onEnter={requireAuth}/>
            <Route path="InspectionGroup" breadcrumbName="稽查组管理">
                <IndexRoute component={InspectionGroup} onEnter={requireAuth}/>
                <Route path='AddInspectionGroup' component={AddInspectionGroup} breadcrumbName="新建稽查组"
                       onEnter={requireAuth}/>
                <Route path='EditInspectionGroup' component={EditInspectionGroup} breadcrumbName="编辑稽查组"
                       onEnter={requireAuth}/>
                <Route path='InspectionGroupDetail' component={InspectionGroupDetail} breadcrumbName="稽查组详情"
                       onEnter={requireAuth}/>
                <Route path='EditSchedule' component={EditSchedule} breadcrumbName="编辑排班" onEnter={requireAuth}/>
            </Route>
        </Route>
        <Route path="VipManage" breadcrumbName="会员管理">
            <Route path="VipList" breadcrumbName="会员列表">
                <IndexRoute component={VipList} onEnter={requireAuth}/>
                <Route path='VipDetail' breadcrumbName='会员详情' component={VipDetail} onEnter={requireAuth}/>
            </Route>
            <Route path='VipPoints' component={VipPoints} breadcrumbName='会员积分管理' onEnter={requireAuth}/>
        </Route>
        <Route path="SystemConfig" breadcrumbName="系统配置">
            <Route path="FinancialAccountParams" component={FinancialAccountParams} breadcrumbName="财务账号参数"
                   onEnter={requireAuth}/>
            <Route path="BusinessAccountParams" component={BusinessAccountParams} breadcrumbName="业务账号参数"
                   onEnter={requireAuth}/>
            <Route path="HolidayConfig" component={HolidayConfig} breadcrumbName="节假日配置"
                   onEnter={requireAuth}/>
            <Route path="CustomerService" breadcrumbName="客服配置">
                <IndexRoute component={CustomerService} onEnter={requireAuth}/>
                <Route path="CustomerServiceConfig" component={CustomerServiceConfig} breadcrumbName="配置"
                       onEnter={requireAuth}/>
            </Route>
        </Route>
        <Route path='403' component={Page403}/>
        <Route path='*' component={NotMatch}/>
    </Route>
);

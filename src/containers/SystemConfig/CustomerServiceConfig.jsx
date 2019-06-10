import React, {Component} from 'react';

import {Button, Spin, message, Card} from 'antd';
import './Style/system.css';
import {HttpClient} from "../../common/HttpClient";
import CustomServiceForm from './Components/CustomServiceForm.jsx';
import WebSiteForm from './Components/WebSiteForm.jsx'
import Exception from "../../components/Exception";

export default class CustomerServiceConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadComponent: false,
            pageLoading: true,
            customServiceInfo: [],
            webSite: [],
        };
    }

    // 组件挂载之前
    componentWillMount() {
    }

    // 组件挂载后
    componentDidMount() {
        HttpClient.query(`${window.MODULE_PARKING_INFO}/configureInfo/getCustomServiceInfo`, 'GET', null, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                const data = d.data;
                const customServiceInfo = data.customServiceInfo;
                const webSite = data.webSite;
                this.setState({
                    customServiceInfo,
                    webSite,
                    pageLoading: false,
                    loadComponent: true
                });
            } else {

            }
        })
    }

    // 组件卸载之前
    componentWillUnmount() {
    }

    // 提交
    submit() {
        const CustomServiceForm = this.CustomServiceFormRef.props.form;
        const WebSiteForm = this.WebSiteFormRef.props.form;
        CustomServiceForm.validateFields((CustomServiceFormErr, CustomServiceFormvalues) => {
            if (!CustomServiceFormErr) {
                WebSiteForm.validateFields((WebSiteFormErr, WebSiteFormValues) => {
                    if (!WebSiteFormErr) {
                        const {customServiceInfo} = this.CustomServiceFormRef.state;
                        const {webSite} = this.WebSiteFormRef.state;
                        let params = {
                            customServiceInfo: customServiceInfo,
                            webSite: webSite
                        };
                        // console.log(params);
                        this.setState({
                            pageLoading: true,
                        });
                        HttpClient.query(`${window.MODULE_PARKING_INFO}/centerConsole/configureAreaCustomServiceInfo`, 'POST', JSON.stringify(params), (d, type) => {
                            this.setState({
                                pageLoading: false,
                            });
                            if (type === HttpClient.requestSuccess) {
                                message.success(d.data);
                                window.location.hash = 'SystemConfig/CustomerService'
                            }
                        })
                    }
                })
            }
        })
    }

    render() {
        if (!window.checkPageEnable('customerConfig')) {
            return <Exception type='403'/>;
        }
        const {pageLoading, customServiceInfo, webSite, loadComponent} = this.state;
        return (
            <div className='page'>
                <div className='page-header'>
                    配置
                </div>
                <div className='page-content' style={{padding: 0, background: 'transparent'}}>
                    <Spin spinning={pageLoading} tip='加载中...'>
                        {/*客服电话*/}
                        <Card title="区域客服电话">
                            {
                                loadComponent && (
                                    <CustomServiceForm
                                        wrappedComponentRef={formRef => this.CustomServiceFormRef = formRef}
                                        customServiceInfo={customServiceInfo}
                                    />
                                )
                            }
                        </Card>
                        {/*官网*/}
                        <Card title="客服官网">
                            {
                                loadComponent && (
                                    <WebSiteForm
                                        wrappedComponentRef={formRef => this.WebSiteFormRef = formRef}
                                        webSite={webSite}
                                    />
                                )
                            }
                        </Card>
                    </Spin>
                    <div className="form-bottom-fixed"
                         style={this.props.collapsed ? {width: "calc(100% - 80px)"} : {width: "calc(100% - 256px)"}}>
                        <Button className="partnerList_search_button" onClick={() => {
                            window.history.back(-1)
                        }}>取 消</Button>
                        <Button type="primary" style={{width: 65}} onClick={this.submit.bind(this)}>提 交</Button>
                    </div>
                </div>
            </div>
        );
    }
}

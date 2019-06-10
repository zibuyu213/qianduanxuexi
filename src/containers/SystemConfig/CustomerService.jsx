import React, {Component} from 'react';
import {Button, Card, Row, Col, Spin} from 'antd';
import {HttpClient} from "../../common/HttpClient";
import Exception from "../../components/Exception";

// 客服配置展示页
export default class CustomerService extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
                    pageLoading: false
                })
            } else {

            }
        })
    }

    // 组件卸载之前
    componentWillUnmount() {
    }

    render() {
        if (!window.checkPageEnable('/CustomerService')) {
            return <Exception type='403'/>;
        }
        const {pageLoading, customServiceInfo, webSite} = this.state;
        return (
            <div className='page'>
                <div className='page-header'>
                    客服配置
                </div>
                <div className='page-content' style={{padding: 0, background: 'transparent'}}>
                    <Spin spinning={pageLoading} tip='加载中...'>
                        <Card title="客服配置"
                              extra={
                                  window.getPerValue('customerConfig') &&
                                  <Button type='primary' onClick={() => {
                                      window.location.hash = '/SystemConfig/CustomerService/CustomerServiceConfig'
                                  }}>
                                      配置
                                  </Button>}
                        >
                            <Row>
                                <Col span={24} style={{display: 'flex'}}>
                                    <div style={{fontSize: '14px', color: 'rgba(0,0,0,0.85)'}}>区域客服电话：</div>
                                    <div style={{flex: 1, color: 'rgba(0,0,0,0.65)'}}>
                                        {
                                            customServiceInfo && customServiceInfo.map((item, index) => {
                                                let elem = (
                                                    <div key={`${item.areaName}${index}`}>
                                                        <span>{item.areaName} </span>
                                                        {
                                                            item.tel && item.tel.map((telItem, telIndex) => {
                                                                const tel = (
                                                                    <span
                                                                        key={`${telItem}${telIndex}`}>{telItem}；</span>
                                                                );
                                                                return tel
                                                            })
                                                        }
                                                    </div>
                                                );
                                                return elem
                                            })
                                        }
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24} style={{display: 'flex'}}>
                                    <div style={{fontSize: '14px', color: 'rgba(0,0,0,0.85)'}}>客服官网：</div>
                                    <div style={{flex: 1, color: 'rgba(0,0,0,0.65)'}}>
                                        {
                                            webSite && webSite.map((item, index) => {
                                                let elem = (
                                                    <div key={`${item}${index}`}>
                                                        {item}；
                                                    </div>
                                                );
                                                return elem
                                            })
                                        }
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Spin>
                </div>
            </div>
        );
    }
}

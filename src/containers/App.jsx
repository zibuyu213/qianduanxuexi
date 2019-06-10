import React, {Component} from 'react'
import {LocaleProvider} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import IndexContainer from './IndexContainer/IndexContainer.jsx';
// import {HttpClient} from "../common/HttpClient";
import './App.css';

//首页
export default class App extends Component {

    constructor (props) {
        super(props);
        this.state = {}
    }

    componentWillMount () {
        window.LOGO_SRC = require('@static/images/logo_unicom.png');
        // 获取logo，名字
        /*HttpClient.query(`${window.MODULE_PARKING_INFO}/configureInfo/getLogoConfig`, 'GET', {
            operatorId: window.OPERATOR_ID,
            client: 'console'
        }, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                // window.LOGO_SRC = d.data.logo || require('../static/images/logo.png');
                window.LOGO_SRC = require('../../static/images/logo_unicom.png');
            } else {
                //失败----做除了报错之外的操作
            }
        });*/
        //window.addEventListener("resize", this.onResizeHandle);
    }

    componentDidMount () {
    }

    componentWillUnmount () {
        //window.removeEventListener("resize", this.onResizeHandle);
    }


    render () {
        let pathname = this.props.location.pathname.toLocaleLowerCase();
        let isLoginPage = pathname === '/login' || pathname === '/resetpassword';
        return (
            <LocaleProvider locale={zh_CN}>{
                isLoginPage ? this.props.children :
                    <IndexContainer routes={this.props.routes} children={this.props.children}/>
            }</LocaleProvider>
        )
    }
}

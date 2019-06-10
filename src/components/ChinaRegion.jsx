import React, {Component} from 'react';

import {Cascader} from 'antd';
import {HttpClient} from "../common/HttpClient";

export default class ChinaRegion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: []
        };
    }

    // 组件挂载之前
    componentWillMount() {
        this._isMounted = true;
        HttpClient.query(window.MODULE_PARKING_INFO + '/admin/adminRegion', 'GET', null, this.regionData.bind(this))
    }

    // 组件挂载后
    componentDidMount() {
    }

    // 组件卸载之前
    componentWillUnmount() {
        this._isMounted = false
    }

    // 获取行政区回调
    regionData(d, type) {
        if (type == HttpClient.requestSuccess) {
            //成功-------在这里做你的数据处理，需要提示的自己加
            if (d.success && this._isMounted) {
                this.setState({
                    options: d.data
                })
            }
        } else {
            //失败----做除了报错之外的操作
            // message.error('获取行政区失败')
        }
    }

    render() {
        const {options} = this.state;
        return (
            <Cascader {...this.props} options={options}/>
        );
    }
}

import React, {Component} from 'react';
import { Card, Row, Col, Icon,Table } from 'antd';


export default class VipDelLog extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    // 组件挂载之前
    componentWillMount () {
    }

    // 组件挂载后
    componentDidMount () {
    }

    // 组件卸载之前
    componentWillUnmount () {
    }

    render () {

        return (
            <div className='page'>
                <div className='page-header'>
                <div>会员注销记录</div>
                </div>
                <div className='page-content'>

                </div>
            </div>
        );
    }
}

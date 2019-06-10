import React, {Component} from 'react';

import {Modal} from 'antd';
import './style.css'

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // 组件挂载之前
    componentWillMount() {
    }

    // 组件挂载后
    componentDidMount() {
    }

    // 组件卸载之前
    componentWillUnmount() {
    }

    render() {
        const {} = this.state;
        const {visible, onCancel, imageUrl} = this.props;
        return (
            <Modal visible={visible} footer={null} onCancel={onCancel} closable={false} destroyOnClose={true} centered>
                <img alt="照片" style={{width: '100%'}}
                     src={imageUrl}/>
            </Modal>
        );
    }
}

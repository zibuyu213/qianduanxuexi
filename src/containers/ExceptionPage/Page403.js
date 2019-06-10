import React, {Component} from 'react';

import Exception from '../../components/Exception';
import {Button} from 'antd';

export default class Page403 extends Component {
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
        const goBackElem = (
            <Button type='primary' onClick={()=>{window.history.back(-1)}}>返回</Button>
        );
        return (
            <div className='page'>
                <Exception type={403} actions={goBackElem}/>
            </div>
        );
    }
}

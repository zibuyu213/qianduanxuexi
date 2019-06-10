import React, {Component} from 'react';

import ResetPasswordCar from './ResetPasswordCard/ResetPasswordCard.jsx';

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.params.id || '',
            mobile: undefined,
        };
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
        return (
            <div className='resetPasswordContainer'>
                <div className='content'>
                    <ResetPasswordCar context='忘记密码' />
                </div>
                <footer className='reset-footer'>Copyright © 2018 智而行科技有限公司</footer>
            </div>
        );
    }
}

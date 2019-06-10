import React, {Component} from 'react';

export default class NewButton extends Component {

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
        const styate = this.state;
        return (
                 <div type="primary" onClick={()=>{alert(this.state.tanchu);}}>{this.props.children}</div>
            );
    }
}

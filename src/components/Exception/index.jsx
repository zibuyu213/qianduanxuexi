import React, {createElement} from 'react';
import {Button} from 'antd';
import config from './typeConfig';
import './style.css';

class Excrption extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            backText: this.props.backText || '首页',
        };
    }

    render() {
        const {
            linkElement = 'a',
            type,
            title,
            desc,
            img,
            actions,
            ...rest
        } = this.props;
        const {backText} = this.state;
        const pageType = type in config ? type : '404';
        return (
            <div className='exception' {...rest}>
                <div className='imgBlock'>
                    <div
                        className='imgEle'
                        style={{backgroundImage: `url(${img || config[pageType].img})`}}
                    />
                </div>
                <div className='content'>
                    <h1>{title || config[pageType].title}</h1>
                    <div className='desc'>{desc || config[pageType].desc}</div>
                    <div className='actions'>
                        {actions ||
                        createElement(
                            linkElement,
                            {
                                to: '/',
                                href: '/',
                            },
                            <Button type="primary">{backText}</Button>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default Excrption;

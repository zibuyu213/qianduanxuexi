import React, { Component } from 'react';
import { Card } from "antd/lib/index";
import ActiveRegistrationBox from './ActiveRegistrationBox';
import ActivePerfectingBox from './ActivePerfectingBox';
import '../Style/Vip.css';
export default class PointsActiveRules extends Component {
    
    componentWillMount() {

    }

    componentDidMount() {
    }


    render() {
        return (
            <div className="page-content page-content-transparent">
                <Card bordered={false}>
                    <ActiveRegistrationBox />
                </Card>
                <Card bordered={false}>
                    <ActivePerfectingBox />
                </Card>
            </div>
        )
    }


}
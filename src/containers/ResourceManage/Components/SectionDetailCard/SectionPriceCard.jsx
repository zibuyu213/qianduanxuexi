import React, {Component} from 'react';
import {Card, message} from 'antd';
import {react} from 'react.eval';

import {CSS} from "../../Style/SectionDetails.css";

import SectionPriceRuleContent from './SectionPriceRuleContent'
import SectionPriceSettingContent from './SectionPriceSettingContent'
import BindChargeTimes from "./BindChargeTimes";


export default class SectionPriceCard extends Component {
    constructor (props) {
        super(props);

        react(this);
        message.config({
            duration: 1
        });


        this.state = {
            roadInfo: undefined
        }
    }


    componentWillMount () {

    }

    componentDidMount () {

    }

    setRoadInfo (roadInfo) {
        this.setState({
            roadInfo: roadInfo
        })
    }

    render () {
        console.log("price card roadInfo");
        console.log(this.state.roadInfo);

        return (
            <Card
                title='计费详情'
            >
                {this.state.roadInfo !== undefined ?
                    <div>
                        <BindChargeTimes parkingPrice={this.state.roadInfo.parkingPriceVO} parkingId={this.props.parkId}/>
                        {/*<SectionPriceSettingContent parkingPrice={this.state.roadInfo.parkingPriceVO} status={this.state.roadInfo.parkingState}/>*/}
                        <div className="sectionDetails_free_line"/>
                        <SectionPriceRuleContent parkingPrice={this.state.roadInfo.parkingPriceRuleList}
                                                 parkId={this.props.parkId}/>
                    </div>
                    :
                    ""
                }
            </Card>
        )
    }
}

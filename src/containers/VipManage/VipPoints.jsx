import React, {Component} from 'react';
import {HttpClient} from "../../common/HttpClient";
import Exception from "../../components/Exception";
import PointsConsumptionRules from './Components/PointsConsumptionRules.jsx';
import PointsRechargeRules from './Components/PointsRechargeRules.jsx';
import PointsActiveRules from './Components/PointsActiveRules.jsx';
import PointsClearRules from './Components/PointsClearRules.jsx';
import './Style/Vip.css';

const tabs = ['消费积分规则', '充值积分规则', '活跃积分规则', '积分清零规则'];
export default class VipPoints extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: 0,
            loading: true,
            gradeList: [],
        }
    }


    componentWillMount() {

    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        if (!window.checkPageEnable('vipAddEditRule')) return;
        HttpClient.query(window.MODULE_PARKING_PERSON_INFO + `/memberGrade/list`, "GET", null, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                //成功-------在这里做你的数据处理，需要提示的自己加
                this.setState({
                    loading: false,
                    gradeList: d.data,
                })

            }
        });
    }

    checkTab(index) {
        if (index === this.state.currentTab) {
            return 'active'
        } else {
            return ''
        }
    }

    chooseTab(index) {
        this.setState({
            currentTab: index
        })
    }

    getContent() {
        switch (this.state.currentTab) {
            case 0:
                return <PointsConsumptionRules gradeList={this.state.gradeList}/>;
            case 1:
                return <PointsRechargeRules gradeList={this.state.gradeList}/>;
            case 2:
                return <PointsActiveRules/>;
            case 3:
                return <PointsClearRules/>;
            default:
                return "";
        }
    }


    render() {
        if (!window.checkPageEnable('/VipPoints')) {
            return <Exception type='403'/>;
        }
        return (
            <div className='page'>
                <div className='page-header'>
                    <div>会员积分管理</div>
                    <div className='custom-tabs'>
                        {tabs.map((item, i) => {
                            return <a className={this.checkTab(i)} key={i}
                                      onClick={this.chooseTab.bind(this, i)}>{item}</a>
                        })}
                    </div>
                </div>
                {this.getContent()}
            </div>
        )
    }


}

import React, {Component, Fragment} from 'react';
import {Button, Card, List, Row, Select} from "antd";
import ProTypes from 'prop-types';

class VisualizationBerth extends Component {
    constructor(props) {
        super(props);
        this.payLoad = {};
    }


    state = {
        panelData: [
            { roadName: '工业九路', roadInfo: '泊位数量： 剩余31个，总共51个' },
            { roadName: '工业九路', roadInfo: '泊位数量： 剩余31个，总共51个' },
            { roadName: '工业九路', roadInfo: '泊位数量： 剩余31个，总共51个' },
            { roadName: '工业九路', roadInfo: '泊位数量： 剩余31个，总共51个' },
            { roadName: '工业九路', roadInfo: '泊位数量： 剩余31个，总共51个' },
            { roadName: '工业九路', roadInfo: '泊位数量： 剩余31个，总共51个' },
            { roadName: '工业九路', roadInfo: '泊位数量： 剩余31个，总共51个' },
            { roadName: '工业九路', roadInfo: '泊位数量： 剩余31个，总共51个' },
            { roadName: '工业九路', roadInfo: '泊位数量： 剩余31个，总共51个' },
            { roadName: '工业九路', roadInfo: '泊位数量： 剩余31个，总共51个' },
            { roadName: '工业九路', roadInfo: '泊位数量： 剩余31个，总共51个' },
            { roadName: '工业九路', roadInfo: '泊位数量： 剩余31个，总共51个' },
        ],
        selectArea1: '',
        selectArea2: '',
    };

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        const { panelData } = this.state;
        const Option = Select.Option;
        return (
            <Fragment>
                <Row type='flex' align='middle' style={{ marginBottom: 10 }}>
                    <label>区域：</label>
                    <Select
                        style={{ flexGrow: 1 }}
                        placeholder="请选择"
                        optionFilterProp="children"
                        onChange={(value) => this.payLoad.district = value}
                    >
                        <Option value="万秀区">万秀区</Option>
                        <Option value="长洲区">长洲区</Option>
                        <Option value="龙圩区">龙圩区</Option>
                    </Select>
                </Row>
                <Row type='flex' align='middle' style={{ marginBottom: 10 }}>
                    <label>片区：</label>
                    <Select
                        style={{ flexGrow: 1 }}
                        placeholder="请选择"
                        optionFilterProp="children"
                        onChange={(value) => this.payLoad.area = value}
                    >
                        <Option value="万秀区">万秀区</Option>
                        <Option value="长洲区">长洲区</Option>
                        <Option value="龙圩区">龙圩区</Option>
                    </Select>
                </Row>
                <Row style={{ marginBottom: 10 }}>
                    <Button type='primary' style={{ width: '100%' }}
                            onClick={this.props.berthSearch(this.payLoad)}>查询</Button>
                </Row>
                <Row>
                    <Card style={{ height: 520, overflowY: 'auto' }}>
                        <List
                            itemLayout="horizontal"
                            dataSource={panelData}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={<a>{item.roadName}</a>}
                                        description={item.roadInfo}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Row>
            </Fragment>
        );
    }
}

VisualizationBerth.proTypes = {
    berthSearch: ProTypes.func,
    berthList: ProTypes.array
};
export default VisualizationBerth;

import React, {Component, Fragment} from 'react';
import {Checkbox, Col, Row, Select} from "antd";

class VisualizationDevices extends Component {

    state = {};

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        const defaultCheckBoxKey = [1, 2, 3];
        const Option = Select.Option;
        return (
            <Fragment>
                <Row type='flex' align='middle' style={{ marginBottom: 20 }}>
                    <label>区域：</label>
                    <Select
                        onChange={(value) => this.props.selectDistrict(value)}
                        style={{ flexGrow: 1 }}
                        placeholder="请选择"
                        optionFilterProp="children"
                    >
                        <Option value="万秀区">万秀区</Option>
                        <Option value="长洲区">长洲区</Option>
                        <Option value="龙圩区">龙圩区</Option>
                    </Select>
                </Row>
                <Row type='flex' align='middle' style={{ marginBottom: 20 }}>
                    <label>片区：</label>
                    <Select
                        onChange={(value) => this.props.selectArea(value)}
                        style={{ flexGrow: 1 }}
                        placeholder="请选择"
                        optionFilterProp="children"
                    >
                        <Option value="万秀区">万秀区</Option>
                        <Option value="长洲区">长洲区</Option>
                        <Option value="龙圩区">龙圩区</Option>
                    </Select>
                </Row>
                <Row type='flex' align='middle' style={{ marginBottom: 20 }}>
                    <label>设备类型：</label>
                    <Select
                        onChange={(value) => this.props.selectDeviceType(value)}
                        style={{ flexGrow: 1 }}
                        placeholder="请选择"
                        optionFilterProp="children"
                    >
                        <Option value="万秀区">万秀区</Option>
                        <Option value="长洲区">长洲区</Option>
                        <Option value="龙圩区">龙圩区</Option>
                    </Select>
                </Row>
                <Row type='flex' align='middle' justify='space-around'>
                    <Checkbox.Group style={{ width: '100%' }} defaultValue={defaultCheckBoxKey}
                                    onChange={(e) => this.props.checkBoxChange(e)}>
                        <Col span={8}><Checkbox value={1}>正常</Checkbox></Col>
                        <Col span={8}><Checkbox value={2}>异常</Checkbox></Col>
                        <Col span={8}><Checkbox value={3}>断开</Checkbox></Col>
                    </Checkbox.Group>
                </Row>
            </Fragment>
        );
    }
}

export default VisualizationDevices;

import React, {Component} from 'react';

import {Card, Row, Col, Spin, Table, Button} from 'antd';
import {HttpClient} from "../../common/HttpClient";

export default class InspectionGroupDetail extends Component {
    constructor (props) {
        super(props);
        this.state = {
            inspectionGroupId: this.props.location.query.id,//稽查组Id
            loading: true,
            tableData: [],
            detailData: {},
        };
    }

    // 组件挂载之前
    componentWillMount () {
    }

    // 组件挂载后
    componentDidMount () {
        HttpClient.query(`${window.MODULE_PARKING_INSPECTION}/inspection/group/${this.state.inspectionGroupId}`, 'GET', null, this.handleQuery.bind(this))
    }

    // 处理请求回调
    handleQuery (d, type) {
        const data = d.data;
        if (type === HttpClient.requestSuccess) {
            //成功-------在这里做你的数据处理
            this.setState({
                detailData: data,
                tableData: data.inspectionGroupCheckPoints
            })
        } else {
            //失败----做除了报错之外的操作
        }
        this.setState({
            loading: false,
        })
    }

    // 组件卸载之前
    componentWillUnmount () {
    }

    //编辑稽查组
    editGroup () {
        window.location.hash = `/InspectionManage/InspectionGroup/EditInspectionGroup?id=${this.state.inspectionGroupId}`;
    }

    render () {
        const groupScheduleTypeEnum = ['通用班次', '工作日班次', '节假日班次'];
        const { tableData, loading, detailData } = this.state;
        const columns = [{ title: '考勤地址', dataIndex: 'checkPointAddress' }];
        let groupMembers = [];
        detailData.principalUserName && groupMembers.push(detailData.principalUserName);
        detailData.inspectionGroupMembers && detailData.inspectionGroupMembers.forEach(item => {
            groupMembers.push(item.userName)
        });
        return (
            <Spin spinning={loading} tip='加载中...'>
                <div className='page'>
                    <div className='page-header'>
                        {detailData.groupName}
                        <div style={{ float: 'right' }}>
                            <div style={{
                                textAlign: 'right',
                                color: 'rgba(0,0,0,0.45)',
                                lineHeight: '22px',
                                fontSize: '14px'
                            }}>
                                {
                                    window.getPerValue('inspectionEdit') && <Button type='primary'
                                                                             onClick={this.editGroup.bind(this)}>编辑</Button>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='page-content' style={{ padding: 0, background: 'transparent' }}>
                        <Card
                            title='稽查组详情'
                            className='detail-card'
                        >
                            <Row>
                                <Col span={8}>
                                    <label>稽查组名称：</label>
                                    <span>{detailData.groupName}</span>
                                </Col>
                                <Col span={8}>
                                    <label>稽查组负责人：</label>
                                    <span>{detailData.principalUserName}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8} className='detail-card-col'>
                                    <label>组内成员：</label>
                                    <span>{
                                        groupMembers.join('；')
                                    }</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>管辖路段/停车点：</label>
                                    <span>{
                                        detailData.inspectionGroupParkings && detailData.inspectionGroupParkings.map(item =>
                                            item.inspectionGroupParkingPoints && item.inspectionGroupParkingPoints.length > 0 ?
                                                (item.parkingName + '：' + item.inspectionGroupParkingPoints.map(pointItem => pointItem.parkingPointName).join('，')) : item.parkingName + '；'
                                        ).join('；')
                                    }</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8} style={{ display: 'flex' }}>
                                    <div style={{ fontSize: '14px', color: 'rgba(0,0,0,0.85)' }}>稽查班次：</div>
                                    <div style={{ flex: 1 }}>
                                        {
                                            detailData.inspectionGroupSchedules && detailData.inspectionGroupSchedules.map((item, index) => {
                                                let elem = (
                                                    <div key={index}>
                                                        <span>{groupScheduleTypeEnum[item.groupScheduleType]}：</span>
                                                        <span>{item.scheduleName}</span>
                                                    </div>
                                                );
                                                return elem
                                            })
                                        }
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <label>考勤方式：</label>
                                    <span>有效范围{detailData.checkPointEffectiveRang}米</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={16}>
                                    <Table dataSource={tableData} columns={columns} bordered pagination={false}
                                           rowKey={record => record.checkPointAddress}/>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8} className='detail-card-col'>
                                    <label>备注：</label>
                                    <span>
                                        {detailData.comments}
                                    </span>
                                </Col>
                            </Row>
                        </Card>
                    </div>
                </div>
            </Spin>
        );
    }
}

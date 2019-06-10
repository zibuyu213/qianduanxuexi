import React, {Component, Fragment} from 'react';

import {Button, Card, Row, Col, Select, Form, Radio, Input, Icon, Table, TreeSelect, message, Spin, Modal} from 'antd';
import {HttpClient} from "../../common/HttpClient";
import Exception from "../../components/Exception";
import AttendanceAddressModal from './Components/AttendanceAddressModal.jsx';
import CheckAddressModal from "./Components/CheckAddressModal";
import _ from 'lodash';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
let principalUserId = 1, groupName = '稽查组名称', checkPointEffectiveRang = 300, comments = '备注';
let inspectionGroupMembers = [];//稽查人员id
let inspectionGroupParkings = [];//路段和停车点id
let inspectionGroupSchedules = [];//班次id 和

class AddInspectionGroup extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: true,
            isCommonClass: true,//默认通用班次
            tableData: [],
            groupUserData: [],//部门人员数据
            roadParkingData: [],//路段停车点数据
            scheduleSelectData: [], //班次选择数据
            amapVisible: false,
            isInspectionSelectVisible: false, //稽查班次选择框显示隐藏
            checkPointsVisible: false,
        };
    }

    // 组件挂载之前
    componentWillMount () {
    }

    // 组件挂载后
    componentDidMount () {
        // 清空这几个数组，防止数据累计
        inspectionGroupMembers = [];//稽查人员id
        inspectionGroupParkings = [];//路段和停车点id
        inspectionGroupSchedules = [];//班次id 和
        // 获取部门人员
        HttpClient.query(`${window.MODULE_PARKING_INSPECTION}/inspection/getAllDepartmentUserList`, 'GET', null, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                const data = d.data;
                let treeData = [];
                if (data && data.length > 0) {
                    let list = _.toArray(data);
                    for (let item in list) {
                        const configList = this.configChargeManDataList(list[item]);
                        if (configList) treeData.push(configList)
                    }
                    // console.log(treeData);
                }
                this.setState({
                    groupUserData: treeData,
                    loading: false
                })
            }
        });
        // 获取路段停车点
        HttpClient.query(`${window.MODULE_PARKING_INSPECTION}/inspection/getAllParkingWithPointList`, 'GET', null, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                const data = d.data;
                if (data && data.length > 0) {
                    let list = _.toArray(data);
                    let treeData = [];
                    for (let item in list) {
                        const configList = this.configParkingDataList(list[item]);
                        if (configList) treeData.push(configList)
                    }
                    // console.log(treeData);
                    this.setState({
                        roadParkingData: treeData
                    })
                }
            }
        });
        // 获取班次列表
        const params = { pageSize: 0, pageNum: 0 };
        HttpClient.query(`${window.MODULE_PARKING_INSPECTION}/inspection/schedule`, 'GET', params, (d, type) => {
            // console.log('获取班次列表', d);
            const data = d.data;
            if (type === HttpClient.requestSuccess) {
                if (data.list) {
                    let list = _.toArray(data.list);
                    this.setState({
                        scheduleSelectData: list
                    })
                }
            }
        })
    }

    // 组织部门人员数据
    configChargeManDataList (item) {
        if (item.personList.length > 0) {
            let child = [];
            for (let i = 0; i < item.personList.length; i++) {
                let data = item.personList[i];
                const childData = {
                    title: data.userName,
                    value: `${item.id}_${data.userId}`,
                    key: `${item.id}_${data.userId}`,
                };
                child.push(childData);
            }
            return {
                title: item.departmentName,
                value: `department_${item.id}`,
                key: `department_${item.id}`,
                selectable: false,
                children: child
            };
        }
    }

    // 组织路段停车点数据
    configParkingDataList (item) {
        if (!item.parkingPointList) {
            return {
                title: item.parkingPointName,
                value: `parkingPoint_${item.id}`,
                key: `parkingPoint_${item.id}`,
                parentId: `parking_${item.parkingId}`,
            };
        } else {
            if (item.parkingPointList.length > 0) {
                let child = [];
                for (let i = 0; i < item.parkingPointList.length; i++) {
                    let data = item.parkingPointList[i];
                    child.push(this.configParkingDataList(data));
                }
                return {
                    title: item.parkingName,
                    value: `parking_${item.id}`,
                    key: `parking_${item.id}`,
                    children: child
                };
            }
        }
    }

    // 组件卸载之前
    componentWillUnmount () {
    }

    // 选择组内成员
    selectGroupMen (value, node, extra) {
        let userIds = [],
            allCheckedNodes = extra.allCheckedNodes;
        allCheckedNodes && allCheckedNodes.map(nodesItem => {
            if (nodesItem.children) {
                nodesItem.children.map(nodesItemChildren => {
                    let userId = parseInt(nodesItemChildren.node ? nodesItemChildren.node.key.split('_')[1] : nodesItemChildren.key.split('_')[1]);
                    userIds.push(userId)
                })
            } else {
                let userId = parseInt(nodesItem.node ? nodesItem.node.key.split('_')[1] : nodesItem.key.split('_')[1]);
                userIds.push(userId)
            }
        });
        inspectionGroupMembers = Array.from(new Set(userIds));
    }

    // 选择路段停车点
    selectRoadParking (value, node, extra) {
        // console.log(value, node, extra);
        let allCheckedNodes = extra.allCheckedNodes;
        let payLoad = [];
        allCheckedNodes && allCheckedNodes.map(nodesItem => {
            if (nodesItem.node) { //点击复选框
                if (nodesItem.children /*|| nodesItem.node.key.split('_')[0] === 'parking'*/) { // 选中整个路段
                    let parkingPoint = [];
                    nodesItem.children.forEach(child => {
                        parkingPoint.push({ parkingPointId: child.node.key.split('_')[1] })
                    });
                    let parking = {
                        parkingId: nodesItem.node.key.split('_')[1],
                        inspectionGroupParkingPoints: parkingPoint
                    };
                    payLoad.push(parking)
                } else { // 选中停车点
                    let parking = {
                        parkingId: nodesItem.node.props.parentId.split('_')[1],
                        inspectionGroupParkingPoints: [{ parkingPointId: nodesItem.node.key.split('_')[1] }]
                    };
                    payLoad.push(parking)
                }
            } else { //点击Tag上的×取消选择
                if (nodesItem.props.value.split('_')[0] === 'parking') { //整个路段
                    let points = [];
                    nodesItem.props.children.forEach(child => {
                        const pointObj = { parkingPointId: child.key.split('_')[1] };
                        points.push(pointObj)
                    });
                    let parking = {
                        parkingId: nodesItem.props.value.split('_')[1],
                        inspectionGroupParkingPoints: points
                    };
                    payLoad.push(parking)
                } else { //停车点
                    let parking = {
                        parkingId: nodesItem.props.parentId.split('_')[1],
                        inspectionGroupParkingPoints: [{ parkingPointId: nodesItem.props.value.split('_')[1] }]
                    };
                    payLoad.push(parking)
                }
            }
        });
        inspectionGroupParkings = payLoad;
        // console.log(inspectionGroupParkings);
        let roadParkingData = _.cloneDeep(this.state.roadParkingData);
        if (inspectionGroupParkings.length > 0) {
            inspectionGroupParkings.forEach(item => {
                roadParkingData.forEach(roadItem => {
                    if (item.parkingId != roadItem.value.split('_')[1]) {
                        roadItem['disabled'] = true;
                        if (roadItem.children) {
                            roadItem.children.forEach(child => {
                                child['disabled'] = true
                            })
                        }
                    }
                })
            });
        } else {
            roadParkingData.forEach(roadItem => {
                roadItem['disabled'] = false;
                if (roadItem.children) {
                    roadItem.children.forEach(child => {
                        child['disabled'] = false
                    })
                }
            })
        }
        this.setState({
            roadParkingData
        });
    }

    // 稽查班次变化
    inspectionClassChange (e) {
        const value = e.target.value;
        switch (value) {
            case 0:
                this.setState({
                    isCommonClass: true,
                    isInspectionSelectVisible: true
                });
                this.props.form.resetFields(['workingDay', 'restDay']);
                inspectionGroupSchedules = [];
                break;
            case 1:
                this.setState({
                    isCommonClass: false,
                    isInspectionSelectVisible: true
                });
                this.props.form.resetFields(['commonClass']);
                inspectionGroupSchedules = [];
                break;
        }
    }

    // 查看稽查点
    checkPoints () {
        this.setState({
            checkPointsVisible: true
        })
    }

    // 提交表单
    submit () {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.state.tableData.length === 0) {
                    message.error('请添加考勤地点！');
                    return
                }
                let members = [];
                inspectionGroupMembers.forEach((item, index) => {
                    if (item != principalUserId) {
                        members.push({ userId: item })
                    }
                });
                if (this.state.isCommonClass) {
                    let payload = [{ inspectionScheduleId: values.commonClass, groupScheduleType: 0 }];
                    inspectionGroupSchedules = payload
                } else {
                    let payLoad = [];
                    if (values.workingDay) {
                        payLoad.push({ inspectionScheduleId: values.workingDay, groupScheduleType: 1 });
                    }
                    if (values.restDay) {
                        payLoad.push({ inspectionScheduleId: values.restDay, groupScheduleType: 2 });
                    }
                    inspectionGroupSchedules = payLoad
                }
                const params = {
                    groupName: values.groupName, //稽查组名
                    checkPointEffectiveRang: values.checkPointEffectiveRang,
                    principalUserId: principalUserId,
                    inspectionGroupMembers: members,
                    inspectionGroupParkings: inspectionGroupParkings,
                    inspectionGroupSchedules: inspectionGroupSchedules,
                    inspectionGroupCheckPoints: this.state.tableData,
                    comments: values.comments,
                };
                // console.log('新增稽查组表单值：', params);
                this.setState({
                    loading: true
                });
                HttpClient.query(`${window.MODULE_PARKING_INSPECTION}/inspection/group`, 'POST', JSON.stringify(params), (d, type) => {
                    this.setState({
                        loading: false,
                    });
                    if (type === HttpClient.requestSuccess) {
                        //成功-------在这里做你的数据处理
                        message.success('新增成功');
                        location.hash = '/InspectionManage/InspectionGroup';
                        // 清空这几个数组，防止数据累计
                        inspectionGroupMembers = [];//稽查人员id
                        inspectionGroupParkings = [];//路段和停车点id
                        inspectionGroupSchedules = [];//班次id
                    } else {
                        //失败----做除了报错之外的操作
                    }
                })
            }
        })
    }

    mapOk () {
        const form = this.detailAddress.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            if (values.location) {
                let tableData = this.state.tableData;
                const currentPosition = parseFloat(values.location.lat) + parseFloat(values.location.lng);
                let isSamePosition = false;
                tableData.map(item => {
                    if ((parseFloat(item.checkPointLatitude) + parseFloat(item.checkPointLongitude)) === currentPosition) {
                        message.warning('请不要添加相同的考勤点');
                        isSamePosition = true
                    }
                });
                if (isSamePosition) return;
                tableData.unshift({
                    checkPointAddress: values.address,
                    checkPointLongitude: values.location.lng,
                    checkPointLatitude: values.location.lat
                });
                this.setState({
                    tableData,
                    amapVisible: false,
                });
            } else {
                message.warning('请在地图上选择考勤点坐标')
            }
        });
    }

    mapCancel () {
        this.setState({
            amapVisible: false,
        });
    }

    render () {
        if (!window.checkPageEnable('inspectionAdd')) {
            return <Exception type='403'/>;
        }
        const { tableData, groupUserData, roadParkingData, scheduleSelectData, isCommonClass, amapVisible, loading, isInspectionSelectVisible, checkPointsVisible } = this.state;
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                title: '考勤地址',
                dataIndex: 'checkPointAddress',
            }, {
                title: '操作',
                dataIndex: 'action',
                width: 100,
                render: (text, record, index) => (
                    <a onClick={() => {
                        console.log(record, index);
                        let data = this.state.tableData;
                        data.splice(index, 1);
                        this.setState({
                            tableData: data
                        })
                    }}>删除</a>
                )
            }
        ];
        let commonClass = null, otherClass = null;
        if (isCommonClass) {
            // 通用班次
            commonClass = (
                <div>
                    <Row gutter={32}>
                        <Col span={8}>
                            <FormItem>
                                <Row style={{ display: 'flex' }}>
                                    <Col>
                                        <label style={{ color: 'rgba(0,0,0,0.85)' }}>通用班次:</label>
                                    </Col>
                                    <Col style={{ flex: 1, paddingLeft: 10 }}>
                                        {getFieldDecorator('commonClass', {
                                            rules: [{
                                                required: isCommonClass,
                                                message: '请选择通用班次！'
                                            }]
                                        })(
                                            <Select placeholder='请输入' showSearch={true} optionFilterProp='children'>
                                                {scheduleSelectData.map(item => (
                                                    <Option key={item.id}>{item.scheduleName}</Option>))}
                                            </Select>
                                        )}
                                    </Col>
                                </Row>
                            </FormItem>
                        </Col>
                    </Row>
                </div>
            );
        } else {
            // 工作日/节假日班次
            otherClass = (
                <Fragment>
                    <Row gutter={32}>
                        <Col span={8}>
                            <FormItem>
                                <Row style={{ display: 'flex' }}>
                                    <Col>
                                        <label style={{ color: 'rgba(0,0,0,0.85)' }}>工作日班次:</label>
                                    </Col>
                                    <Col style={{ flex: 1, paddingLeft: 10 }}>
                                        {getFieldDecorator('workingDay', {
                                            rules: [{
                                                required: !isCommonClass,
                                                message: '请选择工作日班次！'
                                            }]
                                        })(
                                            <Select placeholder='请选择'>
                                                {scheduleSelectData.map(item => (
                                                    <Option key={item.id}>{item.scheduleName}</Option>))}
                                            </Select>
                                        )}
                                    </Col>
                                </Row>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={32}>
                        <Col span={8}>
                            <FormItem>
                                <Row style={{ display: 'flex' }}>
                                    <Col>
                                        <label style={{ color: 'rgba(0,0,0,0.85)' }}>节假日班次:</label>
                                    </Col>
                                    <Col style={{ flex: 1, paddingLeft: 10 }}>
                                        {getFieldDecorator('restDay', {
                                            rules: [{
                                                required: !isCommonClass,
                                                message: '请选择节假日班次！'
                                            }]
                                        })(
                                            <Select placeholder='请选择'>
                                                {scheduleSelectData.map(item => (
                                                    <Option key={item.id}>{item.scheduleName}</Option>))}
                                            </Select>
                                        )}
                                    </Col>
                                </Row>
                            </FormItem>
                        </Col>
                    </Row>
                </Fragment>
            );
        }
        return (
            <Spin spinning={loading} tip='加载中...'>
                <div>
                    <div className='page'>
                        <div className='page-header'>
                            新建稽查组
                        </div>
                        <div className='page-content' style={{ padding: 0, background: 'transparent' }}>
                            <Card
                                title='新建稽查组'
                            >
                                <Form>
                                    <Row gutter={32}>
                                        <Col span={8}>
                                            <FormItem label='稽查组名称'>
                                                {getFieldDecorator('groupName', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请输入稽查组名称！'
                                                    }, {
                                                        validator: (rule, value, callback) => {
                                                            let reg = /^[\w\u4e00-\u9fa5]+$/;
                                                            if (!reg.test(value)) {
                                                                value && callback('只能输入中英文或数字');
                                                            }
                                                            callback();
                                                        }
                                                    }, {
                                                        max: 10,
                                                        message: '输入内容需在10字以内',
                                                    }]
                                                })(
                                                    <Input placeholder='请输入'
                                                           onChange={(value => groupName = value)}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={32}>
                                        <Col span={8}>
                                            <FormItem label='稽查组负责人'>
                                                {getFieldDecorator('inspectionGroupChargeMan', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请选择稽查组负责人！'
                                                    }]
                                                })(
                                                    <TreeSelect
                                                        dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                                                        treeData={groupUserData}
                                                        treeNodeFilterProp='title'
                                                        placeholder="请输入"
                                                        showSearch={true}
                                                        allowClear
                                                        onChange={(value, node, extra) => {
                                                            if (value) {
                                                                principalUserId = parseInt(value.split('_')[1])
                                                            } else {
                                                                principalUserId = null
                                                            }
                                                        }}
                                                    />
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={32}>
                                        <Col span={8}>
                                            <FormItem label='组内成员'>
                                                {getFieldDecorator('groupMen', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请选择稽查组内成员！'
                                                    }]
                                                })(
                                                    <TreeSelect
                                                        showCheckedStrategy={SHOW_PARENT}
                                                        treeNodeFilterProp='title'
                                                        treeCheckable={true}
                                                        dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                                                        treeData={groupUserData}
                                                        placeholder="请输入"
                                                        allowClear
                                                        onChange={this.selectGroupMen.bind(this)}
                                                    />
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={32}>
                                        <Col span={8}>
                                            <FormItem label='管辖路段/停车点'>
                                                {getFieldDecorator('roadParking', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请选择管辖路段/停车点！'
                                                    }]
                                                })(
                                                    <TreeSelect
                                                        showCheckedStrategy={SHOW_PARENT}
                                                        treeNodeFilterProp='title'
                                                        treeCheckable={true}
                                                        dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                                                        treeData={roadParkingData}
                                                        placeholder="请输入"
                                                        allowClear
                                                        onChange={this.selectRoadParking.bind(this)}
                                                    />
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={32}>
                                        <Col span={8}>
                                            <FormItem label='稽查班次'>
                                                {getFieldDecorator('inspectionClass', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请选择稽查班次！'
                                                    }],
                                                })(
                                                    <RadioGroup onChange={this.inspectionClassChange.bind(this)}>
                                                        <Radio value={0}>通用班次</Radio>
                                                        <Radio value={1}>工作日/节假日班次</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    {isInspectionSelectVisible ? (isCommonClass ? commonClass : otherClass) : ''}
                                    <Row gutter={32}>
                                        <Col span={8}>
                                            <FormItem label='考勤方式'>
                                                <div style={{
                                                    fontSize: 14,
                                                    color: 'rgba(0,0,0,0.45)'
                                                }}>根据稽查地点考勤(可添加多个考勤点)：
                                                </div>
                                                <Row style={{ display: 'flex' }}>
                                                    <Col>
                                                        <label style={{ color: 'rgba(0,0,0,0.85)' }}>有效范围:</label>
                                                    </Col>
                                                    <Col style={{ flex: 1, paddingLeft: 10 }}>
                                                        {getFieldDecorator('checkPointEffectiveRang', {
                                                            rules: [{
                                                                required: true,
                                                                message: '请选择考勤范围！'
                                                            }],
                                                            // initialValue: 100,
                                                        })(
                                                            <Select placeholder='请选择'
                                                                    onChange={value => checkPointEffectiveRang = value}>
                                                                <Option value={100}>100米</Option>
                                                                <Option value={300}>300米</Option>
                                                                <Option value={500}>500米</Option>
                                                                <Option value={1000}>1000米</Option>
                                                            </Select>
                                                        )}
                                                    </Col>
                                                </Row>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={32}>
                                        <Col span={14}>
                                            <Button type='primary' onClick={() => {
                                                this.setState({
                                                    amapVisible: true
                                                })
                                            }}><Icon type='plus'/>添加考勤地点</Button>
                                            <label style={{
                                                marginLeft: 5,
                                                color: 'rgba(0,0,0,0.45)'
                                            }}>查询地点的经纬度使用高德地图{
                                                tableData.length > 0 && <a onClick={this.checkPoints.bind(this)}>查看</a>
                                            }</label>
                                        </Col>
                                    </Row>
                                    <Row gutter={32} style={{ marginTop: 20 }}>
                                        <Col span={14}>
                                            <Table dataSource={tableData} columns={columns} pagination={false}
                                                   bordered
                                                   rowKey={data => {
                                                       return data.checkPointLatitude + data.checkPointLongitude
                                                   }}/>
                                        </Col>
                                    </Row>
                                    <Row gutter={32} style={{ marginTop: 20 }}>
                                        <Col span={8}>
                                            <FormItem label='备注'>
                                                {getFieldDecorator('comments', {
                                                    rules: [{
                                                        max: 100,
                                                        message: '输入内容需在100字以内',
                                                    }]
                                                })(
                                                    <TextArea rows={4} placeholder='如有备注，请输入'
                                                              onChange={value => comments = value}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                        </div>
                    </div>
                    <div className="form-bottom-fixed"
                         style={this.props.collapsed ? { width: "calc(100% - 80px)" } : { width: "calc(100% - 256px)" }}>
                        <Button className="partnerList_search_button" onClick={() => {
                            history.back(-1)
                        }}>取 消</Button>
                        <Button type="primary" style={{ width: 65 }} onClick={this.submit.bind(this)}>提 交</Button>
                    </div>

                    {/*高德地图*/}
                    <Modal
                        visible={amapVisible}
                        title='添加考勤地址'
                        destroyOnClose
                        maskClosable={false}
                        onOk={this.mapOk.bind(this)}
                        onCancel={this.mapCancel.bind(this)}
                        bodyStyle={{ margin: 0 }}
                        width={900}
                    >
                        <AttendanceAddressModal
                            wrappedComponentRef={formRef => this.detailAddress = formRef}
                        />
                    </Modal>
                    {/*查看已选考勤点*/}
                    <Modal
                        visible={checkPointsVisible}
                        title='查看考勤地址'
                        destroyOnClose
                        maskClosable={false}
                        onOk={() => {
                            this.setState({
                                checkPointsVisible: false
                            })
                        }}
                        onCancel={() => {
                            this.setState({
                                checkPointsVisible: false
                            })
                        }}
                        footer={null}
                        bodyStyle={{ margin: 0 }}
                        width={900}
                    >
                        <CheckAddressModal
                            checkPoints={tableData}
                            effectiveRange={this.props.form.getFieldValue('checkPointEffectiveRang') || 0}
                        />
                    </Modal>
                </div>
            </Spin>
        );
    }
}

export default Form.create()(AddInspectionGroup)

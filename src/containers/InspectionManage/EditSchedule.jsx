import React, { Component } from 'react';

import { Button, Row, Col, DatePicker, Table, Badge, Popover, Menu, Card, Icon, message, Spin } from 'antd';
import moment from 'moment';
import './Styles/EditSchedule.css';
import { HttpClient } from "../../common/HttpClient";
import Exception from "../../components/Exception";

const MenuItem = Menu.Item;
const { MonthPicker } = DatePicker;
const workTypeEnum = ['早班', '中班', '晚班', '上班', '休'];
const groupScheduleType = ['通用班次', '工作日班次', '节假日班次'];//稽查组排班类型：0通用班次, 1工作日班次， 2假日班次
// const scheduleType = ['一班制', '二班制', '三班制']; //班次制度类型：0 一班制， 1二班制，2 三班制.
// let workTimeTypeId = {}; // 已选择的workTimeID
let workTimeTypeId = {}; // 已选择的workTimeID
let isSelectDropDown = false; //用户是否点击了dropDown子菜单

export default class EditSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inspectionGroupId: this.props.location.query.id || '',//稽查组Id
            inspectionGroupName: '',
            loading: true,
            spinning: false,
            tableData: [],//表格数据
            selectedKeys: [],//当前编辑单元格选中菜单
            currentCell: null,//当前编辑的单元格
            dateInfos: [],//表头日历信息
            isWorkDay: false,//是否是工作日
            groupSchedules: [],//班次信息
            currentMonth: moment().format('YYYY-MM'),
            spinTip: '加载中...',
            initWorkTimeTypeId: 0,
        };
    }

    // 组件挂载之前
    componentWillMount() {
    }

    // 组件挂载后
    componentDidMount() {
        this.getCalendar();
    }

    // 获取稽查组单月月排班日历信息
    getCalendar() {
        this.setState({
            spinTip: '加载中...'
        });
        HttpClient.query(`${window.MODULE_PARKING_INSPECTION}/inspection/schedule/manage/group/month/calendar`, 'GET', {
            inspectionGroupId: this.state.inspectionGroupId,
            workMonth: this.state.currentMonth
        }, this.handleQuery.bind(this));
    }

    // 获得表格数据data
    initialPayload() {
        // 获取稽查组所有人员单月排班信息
        HttpClient.query(`${window.MODULE_PARKING_INSPECTION}/inspection/schedule/manage/group/month`, 'GET', {
            inspectionGroupId: this.state.inspectionGroupId,
            workMonth: this.state.currentMonth
        }, (d, type) => {
            if (type == HttpClient.requestSuccess) {
                //成功-------在这里做你的数据处理
                const memberInfos = d.data.memberInfos;
                let tbdata = [];
                memberInfos.map(item => {
                    let tbobj = {};
                    tbobj['name'] = item.groupMemberName;
                    tbobj['groupMemberId'] = item.groupMemberId;
                    item.workScheduleDates.map(workItem => {
                        tbobj[workItem.workDate.split('-')[2]] = workItem.workTypes;
                    });
                    tbdata.push(tbobj);
                });
                // console.log(tbdata);
                this.setState({
                    tableData: tbdata,
                    loading: false,
                    inspectionGroupName: d.data.inspectionGroupName
                });
            } else {
                //失败----做除了报错之外的操作
            }
        });
    }

    // 组件卸载之前
    componentWillUnmount() {
    }

    // 处理请求回调
    handleQuery(d, type) {
        if (type == HttpClient.requestSuccess) {
            //成功-------在这里做你的数据处理
            const data = d.data;
            // Start 以下操作会改变原数组
            let dateInfos = data.dateInfos;
            let groupSchedules = data.groupSchedules;
            if (groupSchedules.length === 1) { // 通用班次
                dateInfos.forEach(dateInfosItem => {
                    dateInfosItem['dateSchedules'] = groupSchedules[0]
                })
            } else { //工作日和节假日班次
                dateInfos.forEach(dateInfosItem => {
                    groupSchedules.forEach(groupSchedulesItem => {
                        if (dateInfosItem.dateStatus === 0 && groupSchedulesItem.groupScheduleType === '1') { // 工作日
                            dateInfosItem['dateSchedules'] = groupSchedulesItem
                        } else if (dateInfosItem.dateStatus === 1 && groupSchedulesItem.groupScheduleType === '2') { // 节假日
                            dateInfosItem['dateSchedules'] = groupSchedulesItem
                        }
                    })
                })
            }
            // End 以上操作会改变原数组
            // console.log(data);
            this.setState({
                dateInfos: dateInfos, //表头日历信息
                groupSchedules: groupSchedules,
            });
            // 获得表格数据data
            this.initialPayload()
        } else {
            //失败----做除了报错之外的操作
            this.setState({
                loading: false,
            })
        }
    }

    // 选择月份
    monthChange(date, dateString) {
        this.setState({
            loading: true,
            currentMonth: dateString
        }, () => {
            // 获取稽查组单月月排班日历信息
            this.getCalendar();
        });
    }

    // 组合dropDown子菜单
    genMenuItemElem(item) {
        return (
            item.workScheduleTimes.map(TimeItem => (
                <MenuItem
                    key={TimeItem.workTimeType}
                    id={TimeItem.id}
                >
                    {workTypeEnum[TimeItem.workTimeType]}
                    {
                        this.state.selectedKeys.map(keysItem => {
                            if (keysItem == TimeItem.workTimeType) {
                                return (<Icon key={keysItem} type="check" />)
                            }
                        })
                    }
                </MenuItem>
            ))
        )
    }

    // 单元格菜单显示变化
    onPopoverVisibleChange(text, dateInfosItem, record, visible) {
        // text: 该单元格的值；即memberInfos里的workType
        // dateInfosItem: 该单元格
        // console.log(text, dateInfosItem);
        text = text.map(String);
        if (visible) { //下拉菜单显示
            workTimeTypeId = {};//在下一个单元格dropDown生成之前清空上一个workTimeTypeId
            dateInfosItem.dateSchedules.workScheduleTimes.forEach(workScheduleTime => {
                text.forEach(item => {
                    if (item == workScheduleTime.workTimeType) {
                        workTimeTypeId[item] = workScheduleTime.id
                    }
                })
            });
            this.setState({
                selectedKeys: text,
                currentCell: dateInfosItem,
            })
        } else { // 下拉菜单隐藏，调用修改接口
            if (isSelectDropDown) {
                let valueIds = Object.values(workTimeTypeId),
                    selectKeys = Object.keys(workTimeTypeId);
                // 当用户编辑排班发生变化时才调接口
                // console.log('当用户编辑排班发生变化时才调接口: ', selectKeys, text);
                if (selectKeys.sort().toString() !== text.sort().toString()) {
                    let rest = false;
                    selectKeys.map(key => {
                        if (key == '4') {
                            rest = true;
                            valueIds = [];
                        }
                    });
                    console.log(workTimeTypeId, valueIds);
                    let paramString = `?groupMemberId=${record.groupMemberId}&inspectionGroupId=${this.state.inspectionGroupId}&workDate=${dateInfosItem.date}&rest=${rest}&workScheduleTimeIds=${valueIds}`;
                    this.setState({
                        spinning: true
                    });
                    this.state.initWorkTimeTypeId = 0;
                    // return;
                    HttpClient.query(`${window.MODULE_PARKING_INSPECTION}/inspection/schedule/manage/group/month${paramString}`, 'PUT', null, (d, type) => {
                        if (type == HttpClient.requestSuccess) {
                            let tbdata = this.state.tableData;
                            tbdata.map(item => {
                                if (item.groupMemberId == record.groupMemberId) {
                                    item[dateInfosItem.date.split('-')[2]] = selectKeys.map(Number)
                                }
                            });
                            this.setState({
                                tableData: tbdata,
                            });
                            isSelectDropDown = false;
                            message.success(d.data);
                        }
                        this.setState({
                            spinning: false
                        });
                    });
                }
            }
        }
    }

    // dropDown选择
    dropDownSelect({ item, key, selectedKeys }) {
        isSelectDropDown = true;
        if (key == '4') {
            workTimeTypeId = {};
            workTimeTypeId[key] = true;
            this.setState({
                selectedKeys: [key]
            });
            return
        }
        workTimeTypeId[key] = item.props.id;
        if (selectedKeys.indexOf('4') === -1) {
            this.setState({
                selectedKeys
            })
        } else {
            selectedKeys.splice(selectedKeys.indexOf('4'), 1);
            delete workTimeTypeId['4'];
            this.setState({
                selectedKeys
            })
        }
        console.log(workTimeTypeId)
    }

    // dropDown取消选择
    dropDownDeselect({ item, key, selectedKeys }) {
        isSelectDropDown = true;
        delete workTimeTypeId[key];
        this.setState({
            selectedKeys
        });
        console.log(workTimeTypeId)
    }

    // 导入排班表
    batchUpload() {
        document.getElementById('upload-input').click();
    }

    // 导入排班表
    inputUpload(e) {
        // console.log('进入了input type=file函数');
        this.setState({
            loading: true,
            spinTip: '导入中...'
        });
        let file = e.target.files[0];
        let formData = new FormData();
        formData.append('files', file);
        formData.append('inspectionGroupId', this.state.inspectionGroupId.toString());
        HttpClient.query(window.MODULE_PARKING_INSPECTION + `/inspection/schedule/manage/import`, "POST", formData, (d, type) => {
            if (type == HttpClient.requestSuccess) {
                message.success(d.data);
                // 获取稽查组单月月排班日历信息
                this.getCalendar();
            } else {
                this.setState({
                    loading: false
                })
            }
            document.getElementById('upload-input').value = null; // 将input file的value设为null，以便下次触发onChange事件
        }, false, false);
    }

    render() {
        if (!window.checkPageEnable('inspectionClassEdit')) {
            return <Exception type='403' />;
        }
        const { tableData, selectedKeys, currentCell, dateInfos, groupSchedules, spinning, loading, currentMonth, inspectionGroupId, inspectionGroupName, spinTip } = this.state;
        let col = [];
        // 组合下拉菜单
        const _this = this;

        function genPopoverMenu(dateInfosItem) {
            let elem = groupSchedules.map(groupSchedulesItem => {
                if (groupSchedulesItem.groupScheduleType == 0) { //通用班次
                    return _this.genMenuItemElem(groupSchedulesItem)
                } else if (groupSchedulesItem.groupScheduleType == 1 && dateInfosItem.dateStatus == 0) { //工作日
                    return _this.genMenuItemElem(groupSchedulesItem)
                } else if (groupSchedulesItem.groupScheduleType == 2 && dateInfosItem.dateStatus == 1) { //节假日
                    return _this.genMenuItemElem(groupSchedulesItem)
                }
            });
            return (
                <Menu theme='light' multiple className='scheduleMenu'
                    selectedKeys={selectedKeys}
                    onSelect={_this.dropDownSelect.bind(_this)}
                    onDeselect={_this.dropDownDeselect.bind(_this)}
                >
                    {elem}
                    <Menu.Divider />
                    <MenuItem key={4}
                        id={4}
                    >休息{selectedKeys.map(item => item == '4' ?
                        <Icon key={item} type="check" /> : '')}</MenuItem>
                </Menu>
            )
        }

        // 组合列
        if (tableData.length > 0) {
            dateInfos.map((dateInfosItem) => {
                let data = {
                    title: () => (
                        <div className='customTableTitle' style={{
                            color: dateInfosItem.dateStatus == 1 ? 'red' : '',
                            border: moment().isSame(dateInfosItem.date, 'day') ? '1px solid rgba(24, 144, 255, 0.75)' : ''
                        }}>
                            <div>{dateInfosItem.date.split('-')[2]}</div>
                            <div style={{ fontSize: '12px' }}>{dateInfosItem.weekDay.split('')[1]}</div>
                        </div>
                    ),
                    dataIndex: dateInfosItem.date.split('-')[2],
                    render: (text, record, index) => {
                        const elem = moment().isBefore(dateInfosItem.date, 'day') ? (
                            <Popover placement='bottom' overlayClassName='schedulePopover'
                                content={genPopoverMenu(dateInfosItem)}
                                align={{ targetOffset: [0, 43] }}
                                trigger='click'
                                onVisibleChange={this.onPopoverVisibleChange.bind(this, text, dateInfosItem, record)}
                            >
                                <div style={{ backgroundColor: text && text.length === 0 ? 'white' : '' }}
                                    className={text && text.indexOf(4) === -1 ? 'scheduleText' : 'scheduleText afterTodayRestScheduleText'}
                                >
                                    {
                                        text && text.map(textItem => (
                                            <div key={textItem}>{workTypeEnum[textItem]}</div>))
                                    }
                                </div>
                            </Popover>
                        ) : (
                                <div style={{ backgroundColor: text && text.length === 0 ? '#fafafa' : '' }}
                                    className={text && text.indexOf(4) === -1 ? 'scheduleText overdueSchedule' : 'scheduleText restScheduleText'}
                                    onClick={(e, dateInfosItem) => {
                                        console.log(dateInfosItem)
                                    }}
                                >
                                    {
                                        text && text.map(textItem => <div key={textItem}>{workTypeEnum[textItem]}</div>)
                                    }
                                </div>
                            );
                        return elem;
                    },
                    className: 'schedule',
                    align: 'center',
                    width: 43,
                };
                col.push(data)
            });
        }
        const columns = [
            {
                title: () => (<label>姓名</label>),
                dataIndex: 'name',
                align: 'center',
                className: 'inspectorTD',
                render: (text, record, index) => (
                    <div className='inspector'>{text}</div>
                )
            },
            ...col
        ];
        return (
            <Spin spinning={loading} tip={spinTip}>
                <div className='page'>
                    <div className='page-header'>
                        {inspectionGroupName}
                    </div>
                    <div className='page-content' style={{ padding: 0, background: 'transparent' }}>
                        <Card
                            title='编辑排班'
                        >
                            <Row style={{ display: 'flex' }}>
                                <Col>
                                    <label style={{ color: 'rgba(0,0,0,0.85)' }}>班次说明:</label>
                                </Col>
                                <Col style={{ flex: 1 }}>
                                    <div style={{ paddingLeft: 30 }}>
                                        <div style={{ display: 'flex', alignItems: 'baseline' }}>
                                            <div
                                                style={{
                                                    backgroundColor: 'rgba(24,144,255,0.75)',
                                                    height: 10,
                                                    width: 10,
                                                    marginRight: 10
                                                }} />
                                            <div>
                                                {
                                                    groupSchedules.map((groupSchedulesItem, index) => {
                                                        let elem = (
                                                            <div key={index}
                                                                style={{
                                                                    display: index == 0 ? 'inline-block' : 'block'
                                                                }}>
                                                                {groupScheduleType[groupSchedulesItem.groupScheduleType]}：{groupSchedulesItem.scheduleName}
                                                                {
                                                                    groupSchedulesItem.workScheduleTimes.map(TimesItem =>
                                                                        ` ${TimesItem.workStartTime}-${TimesItem.workEndTime}   `
                                                                    )
                                                                }
                                                            </div>
                                                        );
                                                        return elem
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div
                                                style={{
                                                    backgroundColor: 'rgba(0,0,0,0.15)',
                                                    height: 10,
                                                    width: 10,
                                                    marginRight: 10
                                                }} />
                                            <label>休：休息</label>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row style={{ display: 'flex' }}>
                                <Col>
                                    <label style={{ color: 'rgba(0,0,0,0.85)' }}>日期说明:</label>
                                </Col>
                                <Col style={{ flex: 1 }}>
                                    <div style={{ paddingLeft: 30 }}>
                                        <span>
                                            <Badge dot style={{ backgroundColor: '#000000' }} offset={[-10, -3]} />
                                            <label>工作日</label>
                                        </span>
                                        <span style={{ marginLeft: 20 }}>
                                            <Badge status='error' text='节假日' />
                                        </span>
                                    </div>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 20 }}>
                                <Col span={12}>
                                    <MonthPicker onChange={this.monthChange.bind(this)}
                                        value={moment(currentMonth, 'YYYY-MM')}
                                        allowClear={false}
                                        defaultValue={moment().month('YYYY-MM')} />
                                </Col>
                                <Col span={12} style={{ textAlign: 'right' }}>
                                    <label>Excel排班：</label>
                                    <a target="_blank"
                                        href={`${HttpClient.ClientHost}${window.MODULE_PARKING_INSPECTION}/inspection/schedule/manage/export?workDate=${currentMonth}&inspectionGroupId=${inspectionGroupId}&token=Bearer ${window.customCookie.get('access_token')}`}>
                                        <Button type='primary'>
                                            第一步：导出排班列表
                                        </Button>
                                    </a>
                                    <label> > </label>
                                    <Button type="primary" style={{ marginLeft: 12 }}
                                        className="roster_button_add"
                                        onClick={this.batchUpload.bind(this)}
                                    >
                                        第二步：导入排班列表
                                    </Button>
                                    <input id='upload-input' onChange={this.inputUpload.bind(this)}
                                        type='file' style={{ display: 'none' }}
                                        accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    />
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 20 }}>
                                <Spin spinning={spinning} tip='修改中...'>
                                    <Table dataSource={tableData} columns={columns} bordered pagination={false}
                                        rowKey={(record) => {
                                            return record.groupMemberId
                                        }}
                                    />
                                </Spin>
                            </Row>
                        </Card>
                    </div>
                </div>
            </Spin>
        );
    }
}

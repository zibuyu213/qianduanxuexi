import React, {Component} from 'react';
import {Select, DatePicker, Button, Spin} from 'antd';
import moment from 'moment';
import Calendar from '../../components/Calendar/Calendar.jsx';
import {formatTime, formatNumberToTimePattern, examineIsOneDay} from '../../components/Calendar/CalendarFn';
import './Style/system.css';
import {HttpClient} from "../../common/HttpClient";
import {message} from "antd/lib/index";
import Exception from "../../components/Exception";
import _ from 'lodash';

const { MonthPicker } = DatePicker;
const Option = Select.Option;
const dateEnumArr = ['日', '一', '二', '三', '四', '五', '六'];
const monthFormat = "YYYY-MM";
const dayFormat = "YYYY-MM-DD";

export default class HolidayConfig extends Component {
    constructor (props, context) {
        super(props);
        this.state = {
            loading: false,
            importing: false,
            selectDate: new Date(),
            displayTime: moment().format(monthFormat),
            holidayArr: [],
        };
    }

    // 组件挂载之前
    componentWillMount () {
    }

    // 组件挂载后
    componentDidMount () {
        this.loadData();
    }

    /**
     * 加载数据
     */
    loadData (newDate) {
        this.setState({
            loading: true,
            importing: false,
        });
        let data = { date: newDate ? newDate : this.state.displayTime };
        HttpClient.query(window.MODULE_PARKING_INFO + `/centerConsole/getConfiguredHoliday`, "GET", data, this.configData.bind(this));
    }

    /**
     * 接口请求回调
     * @param d
     * @param type
     */
    configData (d, type) {
        if (type === HttpClient.requestSuccess) {
            //成功-------在这里做你的数据处理，需要提示的自己加
            let holidays = [];
            _.toArray(d.data.list).forEach(item => {
                if (parseInt(item.dateType) === 1) {
                    holidays.push(item.date);
                }
            });
            this.setState({
                loading: false,
                holidayArr: holidays,
            })

        } else {
            //失败----做除了报错之外的操作
            this.setState({
                loading: false,
            })
        }
    }

    onDateChange (date, dateString) {
        this.setState({
            displayTime: dateString
        });
        this.loadData(dateString)
    }

    onSelectDate (date, dateObj) {
        console.log(date, dateObj);
        this.setState({
            selectDate: dateObj.date,
            displayTime: moment(date).format(monthFormat),
        });
        if (dateObj.status === "prev" || dateObj.status === "next") {
            this.loadData(moment(date).format(monthFormat));
        }
    }

    selectChange (value) {
        let data = {
            date: moment(this.state.selectDate).format(dayFormat),
            dateType: value,//日期类型（ 1：节假日 、0:工作日）
        };
        HttpClient.query(window.MODULE_PARKING_INFO + `/centerConsole/configureHoliday`, "POST", JSON.stringify(data), (d, type) => {
            if (type === HttpClient.requestSuccess) {
                message.success(d.data);
                this.loadData();
            }
        });
    }

    //导入节假日表格
    importExcel () {
        document.getElementById('upload-input').click();
    }

    inputUpload (e) {
        this.setState({
            loading: true,
            importing: true,
        });
        let file = e.target.files[0];
        let formData = new FormData();
        formData.append('files', file);
        HttpClient.query(window.MODULE_PARKING_INFO + `/centerConsole/importHolidayExcel`, "POST", formData, (d, type) => {
            this.setState({
                loading: false,
            });
            if (type === HttpClient.requestSuccess) {
                message.success(d.data);
                this.loadData();
            }
            document.getElementById('upload-input').value = null;
        }, false, false);
    }

    render () {
        if (!window.checkPageEnable('/HolidayConfig')) {
            return <Exception type='403'/>;
        }
        return (
            <div className='page'>
                <div className='page-header'>
                    节假日配置
                </div>
                <div className='page-content'>
                    <Spin tip={this.state.importing ? "导入中.." : "加载中.."} spinning={this.state.loading}>
                        <div className='holiday-setting-menu'>
                            <MonthPicker value={moment(this.state.displayTime)} allowClear={false}
                                         onChange={this.onDateChange.bind(this)}/>
                            <div className='holiday-setting-calendar-menu-container'>
                                <div className="holiday-setting-calendar-menu-container-tips"
                                     style={{ marginRight: '16px' }}>
                                    <div className="icon-black-round"/>
                                    工作日
                                </div>
                                <div className="holiday-setting-calendar-menu-container-tips"
                                     style={{ marginRight: '48px' }}>
                                    <div className="icon-red-round"/>
                                    节假日
                                </div>
                                <a target='_blank' rel='noopener noreferrer' href={HttpClient.ClientHost + window.MODULE_PARKING_INFO + '/centerConsole/getTemplateFile?fileType=3&date=' + this.state.displayTime + `&token=Bearer ${window.customCookie.get('access_token')}`}>
                                    <Button style={{ marginLeft: 12 }}>
                                        下载模板
                                    </Button>
                                </a>
                                {window.getPerValue('holidayConfig') ?
                                    <Button style={{ marginLeft: 12 }} type="primary"
                                            onClick={this.importExcel.bind(this)}>导入节假日表</Button> : null}
                                <input id='upload-input' onChange={this.inputUpload.bind(this)}
                                       type='file' style={{ display: 'none' }}
                                       accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
                                <Button style={{ marginLeft: 12 }} type="primary">
                                    <a target="_blank" rel='noopener noreferrer'
                                       href={HttpClient.ClientHost + window.MODULE_PARKING_INFO + '/centerConsole/exportHolidayExcel?workDate=' + this.state.displayTime + `&token=Bearer ${window.customCookie.get('access_token')}`}>导出节假日表</a>
                                </Button>
                            </div>
                        </div>
                        <Calendar
                            displayTime={new Date(this.state.displayTime)}
                            className={window.getPerValue('holidayConfig') ? 'holiday-setting-calendar-has-extra' : ''}
                            holidayArr={this.state.holidayArr}
                            onSelectDate={this.onSelectDate.bind(this)}
                            extra={window.getPerValue('holidayConfig') ? (
                                <div className='holiday-setting-calendar-extra'>
                                    <h3 className='holiday-setting-calendar-extra-title'>{formatTime(this.state.selectDate, 'yyyy-mm-dd')}<span>星期{dateEnumArr[this.state.selectDate.getDay()]}</span>
                                    </h3>
                                    <div className='holiday-setting-calendar-extra-card'>
                                        <span>{formatNumberToTimePattern(this.state.selectDate.getDate())}</span></div>
                                    <p className='holiday-setting-calendar-extra-label'>设置节假日</p>
                                    <div className='holiday-setting-calendar-extra-option'>
                                        <Select onChange={this.selectChange.bind(this)}
                                                value={this.state.holidayArr.some(date => examineIsOneDay(new Date(date), this.state.selectDate)) ? "1" : "0"}
                                                style={{ width: '100%' }}>
                                            <Option value="0">工作日</Option>
                                            <Option value="1">节假日</Option>
                                        </Select>
                                    </div>
                                </div>
                            ) : ''}
                        />
                    </Spin>
                </div>
            </div>
        );
    }
}

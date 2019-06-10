import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatNumberToTimePattern, formatTime, examineIsOneDay } from './CalendarFn';
import './style/CalendarDate.css';

class CalendarDate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectDateArr: [],
        }
    }

    handleSelectDate(dateObj) {
        let { onSelectDate } = this.props;
        onSelectDate && onSelectDate(formatTime(dateObj.date, 'yyyy-mm-dd'), dateObj);
        this.setState({ selectDateArr: [dateObj.date] });
    }
    
    getDateCell(key, date, dateObj) {
        return (
            <td 
                className={(dateObj.isToday ? 'today ' : '') + (dateObj.status == 'cur' ? 'cur-month ' : '') + (dateObj.isSelected ? 'selected ' : '') + (dateObj.isHoliday ? 'holiday ' : '')}
                onClick={this.handleSelectDate.bind(this, dateObj)}
                key={key}>
                {formatNumberToTimePattern(date)}
            </td>
        );
    }

    getDateObject(status, date, displayTime, today) {
        let { selectDateArr } = this.state;
        let { holidayArr } = this.props;
        let newDate = new Date(displayTime);
        switch (status) {
            case 'prev':
                newDate.setDate(0);
                newDate.setDate(date);
                break;
            case 'cur':
                newDate.setDate(date);
                break;
            case 'next':
                newDate.setDate(1);
                newDate.setMonth(newDate.getMonth() + 1);
                newDate.setDate(date);
                break;
            default:
                newDate.setDate(date);
                break;
        }
        return {
            status,
            date: newDate,
            isToday: examineIsOneDay(newDate, today),
            isSelected: selectDateArr.some(date => examineIsOneDay(new Date(date), newDate)),
            isHoliday: holidayArr.some(date => examineIsOneDay(new Date(date), newDate)),
        };
    }

    getDateRow() {
        let today = new Date();
        let { displayTime } = this.props;
        let firstDay = new Date(`${displayTime.getFullYear()}/${displayTime.getMonth() + 1}/1`);
        let firstDayIndex = firstDay.getDay() || 7;
        firstDay.setDate(0);
        let prevMonthLastDate = firstDay.getDate();
        let nextYear = displayTime.getFullYear();
        let nextMonth = displayTime.getMonth() + 1;
        if (nextMonth >= 12) {
            nextMonth = 0;
            nextYear += 1;
        }
        let lastDay = new Date(`${nextYear}/${nextMonth + 1}/1`);
        lastDay.setDate(0);
        let lastDayIndex = lastDay.getDay() || 7;
        let startIndex = 2 - firstDayIndex;
        let endIndex = lastDay.getDate();

        let line_index = 1;
        let line_count = 1;
        let rows = [];
        let row = [];
        for (; startIndex <= endIndex; startIndex++ , line_index++) {
            let isCurrent = startIndex > 0;
            let status = isCurrent ? 'cur' : 'prev';
            let date = isCurrent ? startIndex : prevMonthLastDate + startIndex;
            row.push(this.getDateCell(startIndex, date, this.getDateObject(status, date, displayTime, today)));
            if (line_index == 7) {
                rows.push(<tr key={line_count++}>{row}</tr>);
                row = [];
                line_index = 0;
            }
        }
        if (row.length > 0) {
            for (let i = 1; i <= 7 - lastDayIndex;i++) {
                row.push(this.getDateCell(startIndex + i, i, this.getDateObject('next', i, displayTime, today)));
            }
            rows.push(<tr key={line_count++}>{row}</tr>);
            row = [];
        }

        return rows;
    }

    render() {

        return (
            <div className='calendar-date-container'>
                <table className='calendar-date-table'>
                    <thead className='calendar-date-header'>
                        <tr>
                            <th>一</th>
                            <th>二</th>
                            <th>三</th>
                            <th>四</th>
                            <th>五</th>
                            <th>六</th>
                            <th>日</th>
                        </tr>
                    </thead>
                    <tbody className='calendar-date-body'>{this.getDateRow()}</tbody>
                </table>
                <div className='calendar-date-extra'>{this.props.extra}</div>
            </div>
        );
    }
}

CalendarDate.defaultProps = {
    displayTime: new Date(),
    extra: '',
    onSelectDate: () => {},
    holidayArr: [],
};

CalendarDate.propTypes = {
    displayTime: PropTypes.any,
    extra: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    onSelectDate: PropTypes.func,
    holidayArr: PropTypes.array,
};

export default CalendarDate;
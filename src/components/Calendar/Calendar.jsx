import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CalendarDate from './CalendarDate';
import './style/Calendar.css';

class Calendar extends Component {
    constructor(props) {
        super(props);
        
    }
    
    getCalendar() {
        let {
            mode,
            className,
            displayTime,
            extra,
            onSelectDate,
            holidayArr,
            ...restProps
        } = this.props;

        if (mode == 'date') {
            return (
                <CalendarDate
                    displayTime={displayTime}
                    extra={extra}
                    holidayArr={holidayArr}
                    onSelectDate={onSelectDate}
                />
            );
        } else {
            return '';
        }
    }

    render() {
        let {
            className,
        } = this.props;
        
        return (
            <div className={className}>
                {this.getCalendar()}
            </div>
        );
    }
}

Calendar.defaultProps = {
    mode: 'date',
}

Calendar.propTypes = {
    mode: PropTypes.oneOf(['date']),
    className: PropTypes.string,
    displayTime: PropTypes.any,
    extra: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    onSelectDate: PropTypes.func,
    holidayArr: PropTypes.array,
};

export default Calendar;
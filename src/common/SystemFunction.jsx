import $ from 'jquery';

//全局公用方法定义
export var TimeUtils = (function () {
    //获取当前时间 时间戳
    function getCurrentTimestamp() {
        return new Date().getTime();
    }

    function convertDateStringToTimestamp(dateString) {
        return Date.parse(new Date(dateString));
    }

    function convertTimestampToStringWithDate(timestamp) {
        //获得时间
        var tempTime = getDateMap(timestamp);
        return tempTime.year + "-" + tempTime.month + "-" + tempTime.day;
    }

    /**
     * 获取最近N天日期
     * @param {int} N 整实数,负数获取今天之前 require=false
     * @param {int} M 整实数,负数获取今月之前 require=false
     * @param {Boolean} isDay 是否获取到天 require=false
     * */
    function getNearDay(N = 0, M = 0, isDay = true) {
        var today = new Date();
        var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * N;
        today.setTime(targetday_milliseconds); //关键代码
        var tYear = today.getFullYear();
        var tMonth = today.getMonth();
        var tDate = today.getDate();
        tMonth = handleMonth(tMonth + 1 + M);
        tDate = isDay ? '-' + handleMonth(tDate) : '';
        return `${tYear}-${tMonth}${tDate}`;
    }

    //private
    function handleMonth(month) {
        var m = month;
        if (month.toString().length === 1) {
            m = "0" + month;
        }
        return m;
    }

    //yyyy-MM-dd HH:mm:ss
    function convertTimestampToStringExactMinAndSecAndSplitByLine(timestamp) {
        //获得时间
        var tempTime = getDateMap(timestamp);
        return tempTime.year + "-" + tempTime.month + "-" + tempTime.day + "  " + tempTime.hours + ":" + tempTime.min + ":" + tempTime.sec;
    }

    //private
    function getDateMap(timestamp) {
        var date = new Date(timestamp);
        var tempTime = {
            year: date.getFullYear(),
            month: (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1),
            day: date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
            hours: date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
            min: date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
            sec: date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        };
        return tempTime;
    }

    return {
        getCurrentTimestamp: getCurrentTimestamp,
        convertDateStringToTimestamp: convertDateStringToTimestamp,
        convertTimestampToStringWithDate: convertTimestampToStringWithDate,
        convertTimestampToStringExactMinAndSecAndSplitByLine: convertTimestampToStringExactMinAndSecAndSplitByLine,
        getNearDay: getNearDay,
    }
}());

export var Global = (function () {
    function deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    //获取详情id
    function getUrlId(hashPath) {
        let pathArr = hashPath.split("/");//取array
        let idIndex = pathArr.length - 1;
        let id = pathArr[idIndex];
        return id
    }

    function getSider() {
        let sider = $(".ant-layout-sider")[0];
        return sider.offsetWidth;
    }

    //权限点match

    return {
        deepCopy: deepCopy,
        getUrlId: getUrlId,
        getSider: getSider,
    }

}());

export var StringUtil = (function () {
    // 获取不同编码字符串长度
    function getStrFullLength(str = ''){
        return str.split('').reduce((pre, cur) => {
            const charCode = cur.charCodeAt(0);
            if (charCode >= 0 && charCode <= 128) {
                return pre + 1
            }
            return pre + 2
        }, 0);
    }

    // 截取字符串
    function cutStrByFullLength(str = '', maxLength) {
        let showLength = 0;
        return str.split('').reduce((pre, cur) => {
            const charCode = cur.charCodeAt(0);
            if (charCode >= 0 && charCode <= 128) {
                showLength += 1
            } else {
                showLength += 2
            }
            if (showLength <= maxLength) {
                return pre + cur
            }
            return pre
        }, '')
    }

    return {
        getStrFullLength: getStrFullLength,
        cutStrByFullLength: cutStrByFullLength,
    }
}());

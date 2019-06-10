export function formatNumberToTimePattern(number) {
    return ('00' + number).slice(-2);
}

function getTime(time, format) {
    const type = format.slice(0, 1);
    let str = '';
    switch (type.toLowerCase()) {
        case 'y':
            str = time.getFullYear();
            break;
        case 'm':
            str = time.getMonth() + 1;
            break;
        case 'd':
            str = time.getDate();
            break;
        case 'h':
            str = time.getHours();
            break;
        case 'f':
            str = time.getMinutes();
            break;
        case 's':
            str = time.getSeconds();
            break;
        default:
            break;
    }
    str = ('0000' + str).slice(-format.length);
    return str;
}

// 格式化时间戳 'yyyy/m-dd hh:ff:ss'
export function formatTime(time, format) {
    if (!time) return '';
    time = new Date(time);
    const reg = /[^\w]/g;
    const markArr = format.match(reg);
    const contentArr = format.split(reg);
    let str = [];
    contentArr.forEach((item, index) => {
        index !== 0 && str.push(markArr[index - 1]);
        str.push(getTime(time, contentArr[index]));
    });
    return str.join('');
}

export function examineIsOneDay(date, targetDate) {
    return date.getFullYear() == targetDate.getFullYear() && date.getMonth() == targetDate.getMonth() && date.getDate() == targetDate.getDate()
}

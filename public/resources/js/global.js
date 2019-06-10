window.MODULE_PARKING_ORDERS = '/parking-orders'; //订单模块
window.MODULE_PARKING_PERSON_INFO = '/parking-person-info'; //用户模块
window.MODULE_PARKING_WALLET = '/parking-wallet'; //钱包
window.MODULE_PARKING_INFO = '/parking-info'; // 合作方
window.MODULE_PARKING_RESOURCE = '/parking-resource'; //路段
window.MODULE_PARKING_AUTHORITY = '/parking-authority'; //权限
window.MODULE_PARKING_INSPECTION = '/parking-inspection'; //稽查

window.OPERATOR_ID = 1; //运营id
window.UNIT_NAME = '小时';
window.LOGO_SRC = null; // logo地址
// window.LOGO_SRC = require('../static/media/logo.png');
window.OPERATOR_NAME = '城市路内停车管理';

window.isInvalidToLogin = false; // 控制失效message提示次数
window.currentIsSystemAdmin = false; // 当前用户类型是否是合作方
//权限点
window.permissions = {};

/**
 * 设置权限数据
 * @param obj
 */
window.setPermission = function (obj) {
    window.permissions = obj;
}

/**
 * 获取对应权限点
 * @param name
 * @returns {*}
 */
window.getPerValue = function (name) {
    return window.permissions[name];
}

// 合作公司列表
window.managePartnerList = [];

/**
 * 设置合作公司列表
 * @param arr
 */
window.setManagePartnerList = function (arr) {
    window.managePartnerList = arr
}

/**
 * 获取合作公司列表
 * @returns {*}
 */
window.getManagePartnerList = function () {
    return window.managePartnerList;
}

window.pageMenu = [];
window.newPageMenu = [];

/**
 * 设置菜单列表
 * @param arr
 */
window.setPageMenu = function (arr = []) {
    window.pageMenu = arr;
}

window.setNewPageMenu = function (arr = []) {
    let firstMenu = [];
    let secondMenu = [];
    let thirdMenu = [];
    arr.map(item => {
        if (item.name === "首页" || item.name === "报警管理" || item.name === "交易管理") {//日常运营
            firstMenu.push(item);
        } else if (item.name === "会员管理" || item.name === "名单管理") {//用户与营销
            secondMenu.push(item);
        } else {//配置中心
            thirdMenu.push(item);
        }
    });
    let newList = [];
    if (firstMenu.length > 0) {
        newList.push({
            name: "运营中心",
            list: firstMenu
        });
    }
    if (secondMenu.length > 0) {
        newList.push({
            name: "用户与营销",
            list: secondMenu
        });
    }
    if (thirdMenu.length > 0) {
        newList.push({
            name: "配置中心",
            list: thirdMenu
        });
    }
    window.newPageMenu = newList;
}

window.getFirstPage = function () {
    if (window.pageMenu.length > 0) {
        return window.pageMenu[0].path + window.pageMenu[0].childs[0].path;
    }
}

window.checkPageEnable = function (name) {
    let isPath = name.charAt(0) === '/';
    if (isPath) {
        return JSON.stringify(window.pageMenu).indexOf(name) >= 0;
    } else {
        return window.permissions[name];
    }
}


window.customCookie = {
    set: function (key, val, time) {//设置cookie方法
        var date = new Date(); //获取当前时间
        var expiresDays = time;  //将date设置为n天以后的时间
        date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000); //格式化为cookie识别的时间
        if (time) {
            document.cookie = key + "=" + val + ";expires=" + date.toGMTString();  //设置cookie
        } else {
            document.cookie = key + "=" + val
        }
    },
    get: function (key) {//获取cookie方法
        /*获取cookie参数*/
        var getCookie = document.cookie.replace(/[ ]/g, "");  //获取cookie，并且将获得的cookie格式化，去掉空格字符
        var arrCookie = getCookie.split(";"); //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
        var tips;  //声明变量tips
        for (var i = 0; i < arrCookie.length; i++) {   //使用for循环查找cookie中的tips变量
            var arr = arrCookie[i].split("=");   //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
            if (key == arr[0]) {  //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
                tips = arr[1];   //将cookie的值赋给变量tips
                break;   //终止for循环遍历
            }
        }
        return tips;
    },
    remove: function (key) { //删除cookie方法
        var date = new Date(); //获取当前时间
        date.setTime(date.getTime() - 10000); //将date设置为过去的时间
        document.cookie = key + "=v; expires =" + date.toGMTString();//设置cookie
    }
};

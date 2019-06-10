import $ from 'jquery';
import {message} from 'antd';

const Random = window.Mock.Random;
export var HttpClient = (function () {
    //请求类型【truth,mock】
    // var REQUEST = "mock";
     var REQUEST = "truth";

    var requestSuccess = 0;
    var requestDataError = 1;
    var requestServiceError = 2;

    //获取请求host
    var httpClientHost = '';
    console.log(process.env.NODE_ENV)
    switch (process.env.NODE_ENV) {
        case "development":
            //开发环境
            // httpClientHost = 'https://wzzctc.triplego.cn/api'; //梧州线上
            // httpClientHost = 'http://test01.triplego.cn:9527' //测试主机
            httpClientHost = 'https://tripark.triplego.cn/api'
            break;
        case "production":
            //大树 生产环境
            // httpClientHost = 'https://wzzctc.triplego.cn/api';
            httpClientHost = 'https://tripark.triplego.cn/api'
            break;
        default:
            break;
    }


    function fetchMock() {
        var mockdata = {
            /**
             * 登录接口
             * @param {String} username required=true
             * @param {String} password required=true
             * @param {String} grant_type required=true
             * */
            '/parking-authority/admin/token:POST':
                window.Mock.mock({
                    'data': {
                        'access_token': 'b607026a-ebc4-46e4-bdcb-f686e49d19a0',
                        "token_type": "bearer",
                        "refresh_token": "598332c7-deb4-4927-b9dd-4a6bc70e6b82",
                        "expires_in": 36777,
                        "scope": "server",
                        "userId": 8,
                        "username": "17686890507"
                    },
                    'success': true,
                }),
            /**
             * 中台-获取当前登录用户权限
             * @param {String} accessToken 用户当前查看的中台类型 required=true
             * */
            '/parking-info/centerConsole/login/getUserPermission:GET':
                window.Mock.mock({
                    'data': {
                        isSystemAdmin: true,  //是否是中台运营方管理员，
                        isPartnerAdmin: true, //是否是合作方管理员，
                        managePartnerList: [{
                            id: '1',//公司id
                            name: 'XXX公司名称',//公司名字
                        }], //管理的合作方列表
                        authList: {
                            parkingInUseStatus: true, //无权限时:	无占用情况card+不可进入占用详情页
                            parkingInCome: true, //无权限时:	无收入统计card
                            partnerCompanyDetail: true, //无权限时：	合作方列表页-不可进入合作方详情页面
                            partnerCompanyAdd: true, //无权限时：	合作方列表页：无“新增”按钮，合作方详情页不会出现“重新编辑”按钮
                            partnerCompanyVerify: true, //无权限时：	合作方详情页：右上角不会出现“审核”按钮
                            partnerCompanyAdminConfig: true, //无权限时：	合作方主账号列表页：无“新增按钮”，操作栏显示一条横杠
                            partnerCompanyStatusUpdate: true, //无权限时：	合作方列表页：操作栏显示一条横杠；查看详情页：合作方状态的单选框是不可点击状态
                            partnerCompanyContractDownload: true, //无权限时：	点击合同不可下载
                            sectionDetail: false, //无权限时：	不可进入详情页；操作一栏没有“编辑”按钮
                            sectionAdd: true, //无权限时：	路段资源列表页-没有“新增按钮”
                            sectionUpdate: true, //无权限时：	路段资源列表页-操作一栏没有“停/启用” （如果编辑和停启用权限都没有， 显示一条横杠）
                            sectionChargeRuleSet: true, //无权限时：	页面无“绑定计费规则”按钮；若未配置过，时段对应的数据都是“未设置”
                            chargeRuleUpdate: true, //无权限时：	计费规则不可编辑
                            chargeRuleAdd: true, //无权限时：	计费规则列表页没有“新建”按钮
                            chargeRuleStatusUpdate: true, //无权限时：	计费规则列表页-操作一栏没有
                            parkingRecordDetail: true, //无权限时：	不可进入详情页
                            financialReportDownload: true, //无权限时:	不可下载
                            departmentEdit: true, //无权限时:	隐藏相关按钮
                            departmentDelete: true, //无权限时:	隐藏相关按钮
                            adminEdit: true, //无权限时:	隐藏相关按钮
                            adminDelete: true, //无权限时:	隐藏相关按钮
                            roleEdit: true, //无权限时:	隐藏相关按钮
                            roleDelete: true, //无权限时:	隐藏相关按钮
                            blackListAddEdit: true,//可新增、导入、编辑黑名单
                            blackListDelete: true,//可删除黑名单
                            whiteListAddEdit: true,//可新增、导入、编辑优惠名单
                            whiteListDelete: true,//可删除优惠名单
                            scheduleAddEdit: true,//可新增、编辑班次、无删除班次权限
                            scheduleDelete: true,//可删除班次
                            inspectionAdd: true,//可新增稽查组
                            inspectionEdit: true,//可编辑稽查组信息，无编辑排班权限
                            inspectionClassEdit: true,//可编辑排班
                            inspectionDelete: true,  //可删除稽查组
                            financialAccountConfig: true,//配置财务账号参数
                            businessAccountConfig: true, //配置业务账号参数
                            holidayConfig: true, //	可导入节假日表、在页面操作配置
                            customerConfig: true, // 配置客服信息，电话/官网
                            vipDetail: true, //	可查看会员详情
                            vipAddEditRule: true, // 可新增所有积分规则，修改积分规则状态
                            vipClearRule: true, //	编辑修改积分清零规则
                        },
                        authMenu: [
                            //有 以一级权限： 首页统计分析 时 返回
                            {
                                "icon": "icon_home",
                                //有二级权限 泊位占用情况查看 时 返回
                                "childs": [
                                    {
                                        "name": "统计分析",
                                        "path": "/AnalysisIndex",
                                    },
                                ],
                                "name": "首页",
                                "path": "/Home",
                            },
                            //有一级权限 报警管理 时 返回
                            {
                                "icon": "icon_partner",
                                "childs": [
                                    //有二级权限 报警查看 时 返回
                                    {
                                        "name": "违停报警",
                                        "path": "/AbnormalParkingAlarm",

                                    }, {
                                        "name": "异常订单报警",
                                        "path": "/AbnormalOrderAlarm",

                                    }
                                ],
                                "name": "报警管理",
                                "path": "/AlarmManage",
                            },
                            //有一级权限 合作方管理 时 返回
                            {
                                "icon": "icon_partner",
                                "childs": [
                                    //有二级权限 合作方基本查看 时 返回
                                    {
                                        "name": "合作方列表",
                                        "path": "/PartnerList"
                                    },
                                    //有二级权限 合作方主账号信息查看 时 返回
                                    {
                                        "name": "合作方主账号",
                                        "path": "/PartnerAccounts"
                                    }
                                ],
                                "name": "合作方管理",
                                "path": "/PartnerManage",

                            },
                            //有一级权限 资源管理 或一级权限 计费规则 时 返回
                            {
                                "icon": "icon_resource",
                                "childs": [
                                    //有二级权限 路段查看 时 返回
                                    {
                                        "name": "路段资源",
                                        "path": "/SectionResource"
                                    },
                                    //有一级权限 计费规则 时 返回
                                    {
                                        "name": "计费规则",
                                        "path": "/ChargeRules"
                                    }
                                ],
                                "name": "资源管理",
                                "path": "/ResourceManage",
                            },
                            //有一级权限 停车记录 时 返回
                            {
                                //有二级权限 停车记录查看 时 返回
                                "icon": "icon_deal",
                                "childs": [
                                    {
                                        "name": "停车记录",
                                        "path": "/ParkingRecord"
                                    }
                                ],
                                "name": "交易管理",
                                "path": "/DealManage",

                            },
                            //有 二级权限：发票管理 或 二级权限： 财报信息查看 时 返回
                            {
                                "icon": "icon_deal",
                                "childs": [
                                    //有 二级权限： 发票信息查看 时 返回
                                    {
                                        "name": "发票管理",
                                        "path": "/InvoicesManage"
                                    },
                                    //有 二级权限： 财报信息查看 时 返回
                                    {
                                        "name": "财报下载",
                                        "path": "/FinancialReportsDownload"
                                    },
                                ],
                                "name": "财务管理",
                                "path": "/FinancialManage",

                            },
                            //有 一级权限： 权限管理 时 返回
                            {
                                "icon": "icon_resource",
                                "childs": [
                                    //有 二级权限： 查看部门人员 时 返回
                                    {
                                        "name": "用户管理",
                                        "path": "/UserManage"
                                    },
                                    //有 二级权限： 查看角色 时 返回
                                    {
                                        "name": "角色管理",
                                        "path": "/RoleManage"
                                    }
                                ],
                                "name": "权限管理",
                                "path": "/AuthorizationManage",
                            },
                            {
                                "icon": "icon_resource",
                                "childs": [
                                    //有 二级权限： 查看部门人员 时 返回
                                    {
                                        "name": "黑名单",
                                        "path": "/BlackList"
                                    },
                                    //有 二级权限： 查看角色 时 返回
                                    {
                                        "name": "优惠名单",
                                        "path": "/WhiteList"
                                    }
                                ],
                                "name": "名单管理",
                                "path": "/RosterManage",
                            },
                            //有 一级权限： 权限管理 时 返回
                            {
                                "icon": "icon_resource",
                                "childs": [
                                    //有 二级权限： 查看部门人员 时 返回
                                    {
                                        "name": "班次管理",
                                        "path": "/ScheduleManage"
                                    },
                                    {
                                        "name": "稽查组管理",
                                        "path": "/InspectionGroup"
                                    },
                                ],
                                "name": "稽查管理",
                                "path": "/InspectionManage",
                            },
                            //有 一级权限： 权限管理 时 返回
                            {
                                "icon": "icon_resource",
                                "childs": [
                                    //有 二级权限： 查看部门人员 时 返回
                                    {
                                        "name": "会员列表",
                                        "path": "/VipList"
                                    },
                                    //有 二级权限： 查看角色 时 返回
                                    {
                                        "name": "会员积分管理",
                                        "path": "/VipPoints"
                                    },
                                ],
                                "name": "会员管理",
                                "path": "/VipManage",
                            },
                            //有 一级权限： 权限管理 时 返回
                            {
                                "icon": "icon_resource",
                                "childs": [
                                    //有 二级权限： 查看部门人员 时 返回
                                    {
                                        "name": "财务账号参数",
                                        "path": "/FinancialAccountParams"
                                    },
                                    //有 二级权限： 查看角色 时 返回
                                    {
                                        "name": "业务账号参数",
                                        "path": "/BusinessAccountParams"
                                    },
                                    {
                                        "name": "节假日配置",
                                        "path": "/HolidayConfig"
                                    }, {
                                        "name": "客服配置",
                                        "path": "/CustomerService"
                                    }
                                ],
                                "name": "系统配置",
                                "path": "/SystemConfig",
                            }
                        ]
                    }
                }),
            /**
             * 修改密码
             * @param {String} password 修改后的密码 required=true
             * @param {String} mobileNumber 手机号 required=true
             * @param {String} verificationCode 验证码 required=true
             * */
            '/parking-authority/admin/updatePassword:POST':
                window.Mock.mock({
                    'data': '成功',
                    'success': true
                }),
            /**
             * 忘记密码
             * @param {String} password 修改后的密码 required=true
             * @param {String} mobileNumber 手机号 required=true
             * @param {String} verificationCode 验证码 required=true
             * */
            '/parking-authority/admin/ForgetPassWord/updatePassWord:POST':
                window.Mock.mock({
                    'data': '成功',
                    'success': true
                }),
            /**
             * 获取验证码
             * @param {String} mobileNumber 手机号 required=true
             * */
            '/parking-authority/admin/getVerificationCode:POST':
                window.Mock.mock({
                    'data': '成功',
                    'success': true
                }),
            /**
             * 合作方创建
             * requestParams json
             */
            '/parking-info/admin/company:POST':
                window.Mock.mock({
                    "data": "成功",
                    "success": true
                }),
            /*
             * 获取合作方列表
             * GET
             * int page     require = true
             * int size   require = true
             */
            '/parking-info/admin/company:GET':
                window.Mock.mock({
                    "data": {
                        "totalCount|100-200": 100,
                        "returnList|10": [
                            {
                                "companyId|+1": 1,
                                "partnerCompanyName": /资源[A-Z]{1}有限公司/,
                                "provinceName": "@province()",
                                "cityName": "@city()",
                                "areaName|2": "@county()",
                                "principalName|2-3": "@cword",
                                "principalPhone": "1589999999",
                                "businessStatus|1": [0, 1],
                                "reviewState|1": [0, 1, 2]
                            }
                        ]
                    },
                    "success": true
                }),

            '/parking-info/admin/reviewPassCompany:GET':
                window.Mock.mock({
                    "data|3-8": [
                        {
                            "id|+1": 1,
                            "partnerCompanyName": /资源[A-Z]{1}有限公司/,
                            "provinceName": "@province()",
                            "cityName": "@city()",
                            "areaName|2": "@county()",
                            "principalName|2-3": "@cword",
                            "principalPhone": "1589999999",
                            "businessStatus|1": [0, 1],
                            "reviewState|1": [0, 1, 2]
                        }
                    ],
                    "success": true
                }),
            /*
             * 获取合作方详情
             * GET
             * 公司id：companyId:Integer     require = true
             */
            '/parking-info/admin/company/1:GET':
                window.Mock.mock({
                    "data": {
                        "companyId": 1,
                        "reviewState|1": [0, 1, 2],
                        "reviewTime": "2018-08-08 13:23",
                        "adminUserId": 1,
                        "adminUserName": "默认管理员",
                        "failReason|100": "@cword",
                        "partnerCompanyName": /资源[A-Z]{1}有限公司/,//公司名:
                        "business": "IT",//所属行业:
                        "partnerCompanyTel": "0571-1111111",//公司电话:
                        "partnerCompanyEmail": "abc@163.com",//公司邮箱:
                        "registrationAuthority": /政府机关-[A-Z]{1}/,//登记机关:
                        "registeredCapital": /\d{2}万元/,//注册资本:
                        "provinceId": '110000',//行政区域：省：
                        "cityId": ['110100'],//市：
                        "areaId": ['110101'],//区县：
                        'provinceName': '@province()', //省名
                        'cityName': '@city()', //市名
                        'areaName': '@county()', //区,县名
                        "businessStatus|1": [0, 1],//经营状态 0:停用 1：启用
                        "englishName|2": "@word",//英文名：
                        "actualPayCapital": /\d{2}万元/,//实缴资本：
                        "establishment": '2015-05-15',//成立日期：
                        "staffSize|1-100": 1,//人员规模：
                        "unifiedSocialCreditCode": "@word",//统一社会信用代码：
                        "participantNumber|1-100": 1,//参保人数：
                        "taxpayerIdentNumber": "@word",//纳税人识别号：
                        "endDate": "@date()",//营业期限：end
                        "startDate": "@date()",//营业期限：start
                        "registrationNumber": "@word",//注册号：
                        "organizationCode": "@word",//组织机构代码：
                        "partnerCompanyType|1": ["有限责任公司", "股份有限公司"],//公司类型：
                        "address": "杭州市",//企业地址：
                        "businessScope|1": ["许可经营项目", "一般经营项目"],//经营范围：
                        "licenseUrl": "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",//营业执照：
                        "principalName|2-3": "@cword",//负责人名：
                        "principalGender|1": [0, 1, 2],//性别：0：男 1：女 2 未知
                        "principalTel": "0571-6666666",//负责人电话：
                        "principalPhone": "15800001111",//负责人手机号：
                        "principalAge": "40",//负责人年龄：
                        "principalIdNo": "33072411119999",//负责人身份证：
                        "principalDepartment": /管理部门-[A-Z]{1}/,//负责人部门：
                        "principalAddress": "杭州市",//负责人地址：
                        "accountName": "张三",//以下为结算信息-- 账户名：
                        "account_no": "张三",//账户账号：
                        "bankName|1": ["农业银行", "建设银行", "工商银行"],//开户银行：
                        "bankNo": /622848 00\d{11}/,//银行账号：
                        "payNoWx": "Grey",//微信账号：
                        "payNoAli": /Alipay[A-Z]{1}/,//支付宝账号：
                        "contractTime": "2011-01-11",//以下为合同信息--    合同签约时间：
                        "contractPhotoUrl": "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png", //合同pdf
                    },
                    "success": true
                }),
            /*
             * 合作方修改(审核状态,启停,重新提交等)
             * PUT
             */
            '/parking-info/admin/company/1:PUT':
                window.Mock.mock({
                    "data": {
                        companyId: 1
                    },
                    "success": true
                }),
            /**
             * 合作方主账号列表
             * GET
             * pageNum integer (query)页码
             * pageSize integer (query)一页多少数据
             * partnerCompanyName:合作方名称（string,required.false）
             * userName:用户名称（stirng,required.false）
             * mobile:手机号（string,required.false）
             */
            '/parking-info/admin/partner:GET':
                window.Mock.mock({
                    "data": {
                        "total|100-200": 100,
                        "list|10": [
                            {
                                "partnerCompanyId|+1": 1,
                                "partnerCompanyName": /资源[A-Z]{1}有限公司/,
                                "userName": /admin\d{1}/,
                                "mobile": "1589999999",
                            }
                        ]
                    },
                    "success": true
                }),
            /**
             * 查询合作方用户名称
             * GET
             *
             * mobile:手机号（string,required.true）
             */
            '/parking-info/admin/partner/getUserName:GET':
                window.Mock.mock({
                    "data": {
                        "userName": 'admin',
                        "isPartnerAdmin|1": [true, false],//是否是合作方管理员
                        "isSystemAdmin|1": [true, false],//是否是中台运营方管理员
                    },
                    "success": true
                }),
            /**
             * 合作方主账号新增
             * POST
             *partnerCompanyId:合作方id
             * userName:用户名称
             * mobile:登陆账号
             * password:登陆密码
             */
            '/parking-info/admin/partner:POST':
                window.Mock.mock({
                    "success": true
                }),
            /**
             * 关联合作方账号
             * PUT
             * partnerCompanyId:合作方id（string,required）
             * mobile:登陆账号（string,required）
             */
            '/parking-info/admin/partner/connectUserAndpartner:PUT':
                window.Mock.mock({
                    "success": true
                }),
            /**
             * 合作方编辑
             * PUT
             * partnerCompanyId:合作方id（string,required）
             * mobile:登陆账号（string,required）
             * userName:用户名称（stirng,required.false）
             * password:登陆密码（string,required.false)
             */
            '/parking-info/admin/partner/update:PUT':
                window.Mock.mock({
                    "success": true
                }),
            /**
             * 停车订单列表
             * GET
             * @param {int} pageNum Required=true 第几页
             * @param {int} pageSize Required=true 每页数量
             *
             * @param {String} parkName 路段名
             * @param {String} parkingSpaceNo 泊位编号
             * @param {String} startDate 开始日期 yyyy-MM-dd HH:mm:ss
             * @param {String} endDate 结束日期 yyyy-MM-dd HH:mm:ss
             * @param {String} mobile 手机号码
             * @param {String} plateNumber 车牌号
             *
             * @param {String} parkOrderId 订单号
             * @param {int} parkOrderStatus 订单状态
             *
             * @return {Object} data
             * */
            '/parking-orders/admin/business/parking/order:GET':
                window.Mock.mock({
                    'data': {
                        'endRow': 1,
                        'startRow': 1,
                        'firstPage': 1,
                        'hasNextPage': false,
                        'hasPreviousPage': false,
                        'isFirstPage': true,
                        'isLastPage': true,
                        'lastPage': 1,
                        'navigateFirstPage': 1,
                        'navigatePages': 8,
                        'navigatepageNums': [1],
                        'nextPage': 0,
                        'pageNum': 1, //当前页
                        'pageSize': 10, //每页的数量
                        'pages': 10, //总页数
                        'size': 2, //当前页的数量
                        'total|20': 30, //总记录数
                        'list|10': [{
                            'id': '@id()', // 订单号
                            'plateNumber': '@zip()', // 车牌号
                            'mobile': /^1[385][1-9]\d{8}/, // 手机号
                            'parkingName': /^No[0-5]{4}/, // 路段名称
                            'parkingSpaceNo': /^slm[0-9]{3}/, // 泊位编号
                            'parkOrderStatus|0-3': 1, // 订单状态
                            'realTime|10-500': 1, // 时长（分）
                        }]
                    },
                    'success': true,
                }),

            /**
             * 交易管理
             * 停车订单详情
             * @param {String} id 订单号
             * */
            '/parking-orders/admin/business/parking/order/1234:GET':
                window.Mock.mock({
                    'data': {
                        'id': 1,  //订单号: int
                        'plateNumber': '@zip()',   //车牌号: String
                        'mobile': /^1[385][1-9]\d{8}/,  //手机号：String
                        'parkingName': /^No[0-5]{4}/,   //路段名称：String
                        'parkingSpaceNo': /^slm[0-9]{3}/, //泊位编号：String
                        'parkOrderStatus|0-3': 1,  //订单状态：Integer 0：停车中 1：行程结束 2：退款中 3：欠费
                        'realTime|10-500': 1, //停车时长：Integer
                        'inTime': '@datetime()', //停入时间：String
                        'outTime': '@datetime()', //停出时间：String
                        'realPrice|1-100': 1, //实际应收：Integer
                        'receiveMoney|1-100': 1, //实际收到的费用：Integer
                        'appliedCouponAmount|1-50': 1, //优惠费用：Integer
                        'appliedCouponId': 1, // 优惠id
                        'reminderMoney|1-50': 1, //剩余待缴：Integer
                        'refundMoney': 0, //待退款费用
                        'totalPrice': 10, // 总费用
                        'provinceId': 1, //省份ID
                        'provinceName': '@province()', //省名
                        'cityId': 1, //市ID
                        'cityName': '@city()', //市名
                        'areaId': 1,    //区/县ID
                        'areaName': '@county()', //区/县名
                        'parkingSpaceLongitude': '116',  //泊位经度
                        'parkingSpaceLatitude': '30',    //泊位纬度
                        'hasRefund': false, // 是否已退款
                        'alreadyRefundMoney': 0, // 已退款费用
                        // 支付信息：
                        'parkOrderPayInfos|1-3': [{
                            'id': '@zip', // 支付信息id
                            'parkOrderId': '@zip',    //订单流水号：String
                            'thirdOrderId|1-4': 1,     //微信支付时微信的订单号：int
                            'payType|0-1': 2,          //支付方式 0钱包 1微信：Integer
                            'payAmount|1-100': 1,      //支付金额：Integer
                            'buyParkTime|1-10': 1,     //购买时间：String
                            'payTime': '@datetime()',  //支付时间：1540284979000 Int
                        }],
                        // 停车照片：
                        'parkOrderPhotos': [{
                            'deviceNo': Random.string('number', 15), //设备号：Int
                            "id|+1": 0,  //照片记录id
                            "parkOrderId": "1",	// 订单号
                            'photoUrls': ['/resources/images/upload.png', '/resources/images/upload.png', '/resources/images/upload.png'], //拍摄图片：String
                            'photoType|0-2': 1, //图片类型0：入场 1：出场 2：停车中：Integer
                            'createTime': '@datetime()', //拍摄时间：1540284979000 Int
                            'userName': '', //稽查员
                        }, {
                            'deviceNo': Random.string('number', 15), //设备号：Int
                            "id|+1": 0,  //照片记录id
                            "parkOrderId": "1",	// 订单号
                            'photoUrls': ['/resources/images/upload.png', '/resources/images/upload.png', '/resources/images/upload.png'], //拍摄图片：String
                            'photoType|0-2': 1, //图片类型0：入场 1：出场 2：停车中：Integer
                            'createTime': '@datetime()', //拍摄时间：1540284979000 Int
                            'userName': '', //稽查员
                        }, {
                            'deviceNo': '', //设备号：Int
                            "id|+1": 0,  //照片记录id
                            "parkOrderId": "1",	// 订单号
                            'photoUrls': ['/resources/images/upload.png', '/resources/images/upload.png', '/resources/images/upload.png'], //拍摄图片：String
                            'photoType': '', //图片类型0：入场 1：出场 2：停车中：Integer
                            'createTime': '@datetime()', //拍摄时间：1540284979000 Int
                            'userName': '稽查员9527', //稽查员
                        }]
                    }
                }),
            /**
             * 获取行政区接口
             *
             * @return {Object} data
             * */
            '/parking-info/admin/adminRegion:GET':
                window.Mock.mock({
                    'data': [{
                        "value": "130000",
                        "label": "河北省",
                        "children": [
                            {
                                "value": "130100",
                                "label": "石家庄市",
                                "children": [
                                    {
                                        "value": "130101",
                                        "label": "市辖区"
                                    },
                                    {
                                        "value": "130102",
                                        "label": "长安区"
                                    },
                                ]
                            },
                        ]
                    }],
                    success: true,
                }),

            /*-------------资源路段-------------------*/
            /**
             * 资源路段-新建
             *  parkingRecordNo 备案编号(string)
             *  parkingName  路段名称(string)
             *  streetName: 街道名称(string)
             *  provinceId: 省份id(int)
             *  cityId: 市Id(int)
             *  areaId: 区/县ID(int)
             *  partnerCompanyId: 所属公司(string)
             *  parkingState: 运行状态(int) 0：停用 1：启用
             *  parkingDesc: 范围/描述(string)
             */
            '/parking-resource/admin/resource/parking:POST':
                window.Mock.mock({
                    "data": "创建成功",
                    "success": true
                }),
            /**
             * 资源路段-停启用
             * id 停车场编号(string)
             * parkingState 运行状态(int) 0：停用 1：启用
             */
            // '/parking-resource/admin/resource/parking/updateBatch:PUT':
            //     window.Mock.mock({
            //         "data": "操作成功",
            //         "success": true
            //     }),
            '/parking-resource/admin/resource/parking/1:PUT':
                window.Mock.mock({
                    "data": "操作成功",
                    "success": true
                }),
            /**
             * 资源路段-批量停启用
             * parkingUpdateBatch (JSON)
             */
            '/parking-resource/admin/resource/parking:PUT':
                window.Mock.mock({
                    "data": "操作成功",
                    "success": true
                }),
            /**
             * 资源路段-列表
             * currentPage 从1开始
             * limit
             *
             * require = false :
             * parkingName
             * partnerCompanyId
             * provinceId
             * cityId
             * areaId
             * parkingState(0：停用 1：启用)
             */
            '/parking-resource/admin/resource/parking:GET':
                window.Mock.mock({
                    "data": {
                        "currentPage": 1, // 当前开始页(int)
                        "limit": 10, // 每页限制量(int)
                        "returnCount": 10, // 获取到的数据条数(int)
                        "totalCount": 143, // 总共数据条数(int)
                        "parkingSpaceTotal": 1000,
                        "returnList|10": [{
                            "id|+1": 1001, // 停车场编号(string)
                            "parkingRecordNo": /^slm[0-9]{3}/, // 备案编号(string)
                            "parkingName": /^No[0-5]{4}/, //路段名称(string)
                            "parkingLongitude": "110",//经度
                            "parkingLatitude": "36",//纬度
                            "partnerCompanyId|+1": 1,
                            "partnerCompanyName": /资源[A-Z]{1}有限公司/, //公司名:
                            "provinceName": "@province()", //省名
                            "cityName": "@city()", //城市名
                            "areaName|2": "@county()", //区域名
                            "parkingState|1": [0, 1], // 运行状态 (0：停用 1：启用)
                            "parkingSpaceTotal|30-50": 0, //泊位数量(int)
                            "parkingSpaceResidual|20-30": 0, //剩余车位数量(int)
                            "parkingPriceVO": {
                                "parkingPriceId": 10086,             //	integer	停车场计费id
                                "workdayForbidStartTime": "22:00",   //	string	工作日禁停起始时间
                                "workdayForbidEndTime": "24:00",     //	string	工作日禁停结束时间
                                "workdayFreeStartTime": "00:00",     //	string	工作日免费起始时间
                                "workdayFreeEndTime": "8:00",        //	string	工作日免费结束时间
                                "workdayDaytimeStartTime": "8:00",   //	string	工作日白天计费起始时间
                                "workdayDaytimeEndTime": "18:00",    //	string	工作日白天计费结束时间
                                "workdayNighttimeStartTime": "18:00",//	string	工作日夜间开始计费时间
                                "workdayNighttimeEndTime": "22:00",  //	string	工作日夜间结束计费时间
                                "weekendForbidStartTime": "23:00",   //	string	非工作日禁停起始时间
                                "weekendForbidEndTime": "24:00",     //	string	非工作日禁停结束时间
                                "weekendFreeStartTime": "00:00",     //	string	非工作日免费起始时间
                                "weekendFreeEndTime": "10:00",       //	string	非工作日免费结束时间
                                "weekendDaytimeStartTime": "10:00",  //	string	非工作日白天计费起始时间
                                "weekendDaytimeEndTime": "18:00",    //	string	非工作日白天计费结束时间
                                "weekendNighttimeStartTime": "18:00",//	string	非工作日夜间计费起始时间
                                "weekendNighttimeEndTime": "22:00"   //	string	非工作日夜间计费结束时间
                            }
                        }]
                    },
                    "success": true
                }),
            /**
             * 资源路段-列表
             * 获取全部-不分页！！！
             */
            '/parking-resource/admin/resource/parking/gets:GET':
                window.Mock.mock({
                    "data|10": [{
                        "id|+1": 1001, // 停车场编号(string)
                        "parkingRecordNo": /^slm[0-9]{3}/, // 备案编号(string)
                        "parkingName": /^No[0-5]{4}/, //路段名称(string)
                        "parkingLongitude": "110",//经度
                        "parkingLatitude": "36",//纬度
                        "partnerCompanyId|+1": 1,
                        "partnerCompanyName": /资源[A-Z]{1}有限公司/, //公司名:
                        "provinceName": "@province()", //省名
                        "cityName": "@city()", //城市名
                        "areaName|2": "@county()", //区域名
                        "parkingState|1": [0, 1], // 运行状态 (0：停用 1：启用)
                        "parkingSpaceTotal|30-50": 0, //泊位数量(int)
                        "parkingSpaceResidual|20-30": 0, //剩余车位数量(int)
                    }],
                    "success": true
                }),
            /**
             * 资源路段-详情
             */
            '/parking-resource/admin/resource/parking/1001:GET':
                window.Mock.mock({
                    "data": {
                        id: '1',    //停车场编号(string)
                        parkingRecordNo: /^slm[0-9]{3}/, //备案编号(string)
                        "parkingName|20": '@cword',     //路段名称(string)
                        "streetName|20": '@cword',//街道名称(string)
                        provinceId: 110000,  //省份id(int)
                        "provinceName": "@province()", //省名
                        "cityName": "@city()", //城市名
                        "areaName|2": "@county()", //区域名
                        cityId: 110010,      //市Id(int)
                        areaId: 110101,      //区/县ID(int)
                        "partnerCompanyName|20": '@cword',//所属公司(string)
                        "parkingState|1": [0, 1],     // 运行状态(int) 0：停用 1：启用
                        "parkingDesc|100": '@cword',//范围/描述(string)
                        "parkingSpaceTotal|10-30": 0,    //泊位数量(int)
                        "parkingPriceVO": {
                            "parkingPriceId": 10086,             //	integer	停车场计费id
                            "workdayForbidStartTime": "22:00",   //	string	工作日禁停起始时间
                            "workdayForbidEndTime": "24:00",     //	string	工作日禁停结束时间
                            "workdayFreeStartTime": "00:00",     //	string	工作日免费起始时间
                            "workdayFreeEndTime": "8:00",        //	string	工作日免费结束时间
                            "workdayDaytimeStartTime": "8:00",   //	string	工作日白天计费起始时间
                            "workdayDaytimeEndTime": "18:00",    //	string	工作日白天计费结束时间
                            "workdayNighttimeStartTime": "18:00",//	string	工作日夜间开始计费时间
                            "workdayNighttimeEndTime": "22:00",  //	string	工作日夜间结束计费时间
                            "weekendForbidStartTime": "23:00",   //	string	非工作日禁停起始时间
                            "weekendForbidEndTime": "24:00",     //	string	非工作日禁停结束时间
                            "weekendFreeStartTime": "00:00",     //	string	非工作日免费起始时间
                            "weekendFreeEndTime": "10:00",       //	string	非工作日免费结束时间
                            "weekendDaytimeStartTime": "10:00",  //	string	非工作日白天计费起始时间
                            "weekendDaytimeEndTime": "18:00",    //	string	非工作日白天计费结束时间
                            "weekendNighttimeStartTime": "18:00",//	string	非工作日夜间计费起始时间
                            "weekendNighttimeEndTime": "22:00",  //	string	非工作日夜间计费结束时间
                            "parkingPriceRuleList|1-3": [
                                {
                                    "id|+1": 1,
                                    "parkingPriceRuleId|+1": 100,        //	integer	计费规则id
                                    "parkingPriceRuleName|20": "@cword", //	integer	计费规则名
                                    "sort|+1": 1,                        //	integer	序号
                                    "startTime": "@datetime()",          //	integer	生效时间
                                    "endTime": "@datetime()",            //	integer	失效时间爱你
                                    "effective|1": [0, 1]                 //	integer	是否长期生效
                                }
                            ]
                        }
                    },
                    "success": true
                }),
            /**
             * 中台-资源 根据合作方获取停车场
             * @param {String} partnerCompanyId
             * */
            '/parking-resource/admin/resource/parking/getParkingByPartnerCompany:GET': window.Mock.mock({
                "success": true,
                'data|2-10': [{
                    "parkingName|3-8": '@cword', //所绑定路段
                    'id|+1': 1,
                }]
            }),
            /*-------------修改资源路段计费详情-------------------*/
            /**
             | parkingPriceId | integer |  停车场计费id  |
             | workdayForbidStartTime | string |  工作日禁停起始时间  |
             | workdayForbidEndTime | string |  工作日禁停结束时间  |
             | workdayFreeStartTime | string |  工作日免费起始时间  |
             | workdayFreeEndTime | string |  工作日免费结束时间  |
             | workdayDaytimeStartTime | string |  工作日白天计费起始时间  |
             | workdayDaytimeEndTime | string |  工作日白天计费结束时间  |
             | workdayNighttimeStartTime | string |  工作日夜间开始计费时间  |
             | workdayNighttimeEndTime | string |  工作日夜间结束计费时间  |
             | weekendForbidStartTime | string |  非工作日禁停起始时间  |
             | weekendForbidEndTime | string |  非工作日禁停结束时间  |
             | weekendFreeStartTime | string |  非工作日免费起始时间  |
             | weekendFreeEndTime | string |  非工作日免费结束时间  |
             | weekendDaytimeStartTime | string |  非工作日白天计费起始时间  |
             | weekendDaytimeEndTime | string |  非工作日白天计费结束时间  |
             | weekendNighttimeStartTime | string |  非工作日夜间计费起始时间  |
             | weekendNighttimeEndTime | string |  非工作日夜间计费结束时间 |
             */
            '/parking-resource/admin/resource/parking/parkingPrice:PUT':
                window.Mock.mock({
                    "data": "保存成功",
                    "success": true
                }),
            /*-------------停车场计费新增计费规则-------------------*/
            /**
             *  | parkingId | integer | 停车场id | Y |
             *  | parkingPriceRuleId | integer | 计费规则id | Y |
             *  | startTime | string | 生效时间 | N |
             *  | endTime | string | 失效时间 | N |
             *  | effective | boolean | 是否长期生效 | N |
             */
            '/parking-resource/admin/resource/parking/1001/parkingPrice:POST':
                window.Mock.mock({
                    "data": "绑定成功",
                    "success": true
                }),
            /*-------------停车场计费修改计费规则-------------------*/
            /**
             *  | parkingId | integer | 停车场id | Y |
             *  | parkingPriceRuleId | integer | 计费规则id | Y |
             *  | startTime | string | 生效时间 | N |
             *  | endTime | string | 失效时间 | N |
             *  | effective | boolean | 是否长期生效 | N |
             */
            '/parking-resource/admin/resource/parking/{parkingId}/parkingPrice/{id}:PUT':
                window.Mock.mock({
                    "data": "修改成功",
                    "success": true
                }),
            /*-------------停车场计费解绑计费规则-------------------*/
            '/parking-resource/admin/resource/parking/parkingPrice/parkingPriceRules/{id}:DELETE':
                window.Mock.mock({
                    "data": "解绑成功",
                    "success": true
                }),
            /*-------------资源路段停车点-------------------*/
            /**
             * 资源路段-新建停车点
             * 关联的停车场ID（Integer）:parkingId
             * 停车点编号(string)：parkingPointNo
             * 停车点名称(string)：parkingPointName
             */
            '/parking-resource/admin/resource/parking/point:POST':
                window.Mock.mock({
                    "data": "创建成功",
                    "success": true
                }),
            /**
             * 资源路段-更新停车点
             * 停车点ID（Integer）:id
             * 停车点编号(string)：parkingPointNo
             * 停车点名称(string)：parkingPointName
             */
            '/parking-resource/admin/resource/parking/point:PUT':
                window.Mock.mock({
                    "data": "更新成功",
                    "success": true
                }),
            /**
             * 资源路段-停车点列表
             */
            '/parking-resource/admin/resource/parking/point/1001:GET':
                window.Mock.mock({
                    "data|1-3": [{
                        "id|+1": 1,                    //停车场编号(string)：
                        parkingPointNo: /^No[0-5]{4}/, //停车点编号(string)：
                        parkingPointName: '@ctitle'    //停车点名称(string)：
                    }],
                    "success": true
                }),
            /*-------------资源路段泊位-------------------*/
            /**
             * 资源管理
             * 路段详情
             * 停车位列表
             *
             */
            '/parking-resource/admin/resource/parking/space:GET':
                window.Mock.mock({
                    "data": {
                        "currentPage": 1, // 当前开始页(int)
                        "limit": 10, // 每页限制量(int)
                        "returnCount": 10, // 获取到的数据条数(int)
                        "totalCount": 143, // 总共数据条数(int)
                        "returnList|10": [
                            {
                                "id|+1": 1,  //车位id Integer
                                // parkingPointNo: /^No[0-5]{4}/, //停车位编码 String
                                parkingSpaceNo: /^No[0-5]{4}/, //停车位编码 String
                                "parkingPointName|5-10": '@cword', // 停车位名称  String
                                parkingId: 1, //停车场id Integer
                                parkingSpaceLongitude: '1.1', //经度 String
                                parkingSpaceLatitude: '2.2', //维度 String
                                parkingPointId: 1, //停车区域 Integer
                                parkingSpaceStatus: 0, //车位状态 0：空闲 1： 占用 2：不可用
                                "parkingSpaceStatusName|1": ["空闲", "占用", "不可用"],
                                detectionWay: 0,  //监测方式0：地磁
                                createUser: 1, // 创建者id
                                createTime: '@datetime()', //创建时间
                                updateUser: 1, //更新用户
                                updateTime: '@datetime()' //更新时间
                            }
                        ]
                    },
                    "success": true
                }),
            /**
             * 资源管理
             * 路段详情
             * 停车位详情
             * id 停车场编号(string)
             */
            '/parking-resource/admin/resource/parking/point/space/01:GET':
                window.Mock.mock({
                    "data": [
                        {
                            id: '01',  //车位id Integer
                            parkingPointNo: 'NO.0001', //停车位编码 String
                            parkingPointName: '停车一', // 停车位名称  String
                            parkingId: 1, //停车场id Integer
                            parkingSpaceLongitude: '1.1', //经度 String
                            parkingSpaceLatitude: '2.2', //维度 String
                            parkingPointId: 1, //停车区域 Integer
                            parkingSpaceStatus: 0, //车位状态 0：空闲 1： 占用 2：维修中
                            detectionWay: 0,  //监测方式0：地磁
                            createUser: 1, // 创建者id
                            createTime: '@datetime()', //创建时间
                            updateUser: 1, //更新用户
                            updateTime: '@datetime()' //更新时间
                        }
                    ],
                    "success": true
                }),
            /**
             * 资源管理
             * 路段详情
             * 资源路段停车点中停车位批量更新
             * parkingSpaceUpdateBatch
             */
            '/parking-resource/admin/resource/parking/space:PUT':
                window.Mock.mock({
                    "data": "移动成功",
                    "success": true
                }),
            /**
             * 用户获取计费规则列表
             * | ruleName  | string | 计费规则名 | N |
             * | ruleNumber  | string | 计费规则编号 | N |
             * | ruleStatus  | boolean | 计费规则状态 true：有效 false：无效 | N |
             * | pageNum  | Integer | 一页多少数据 | Y |
             * | pageSize  | Integer | 一页多少数据 | Y |
             */
            '/parking-resource/parkingPriceRules:GET':
                window.Mock.mock({
                    "data": {
                        "total": 143, // 总共数据条数(int)
                        "list|10": [
                            {
                                "id|+1": 1,  //计费规则id
                                number: /^No[0-5]{4}/, //计费规则编号
                                "name|5-10": '@cword', // 计费规则名
                                "status|1": [true, false], //计费规则状态  true：有效 false：无效
                                "statusName|10-20": '@cword', //计费规则状态
                                "parkingNames|10-20": '@cword' //所绑定路段
                            }
                        ]
                    },
                    "success": true
                }),
            /**
             * 用户停启用计费规则
             * status    boolean    计费规则状态 true： 有效 false：无效    Y
             */
            '/parking-resource/parkingPriceRules/1001/status:PUT':
                window.Mock.mock({
                    "data": "操作成功",
                    "success": true
                }),
            /**
             * 获取计费规则详情
             */
            '/parking-resource/parkingPriceRules/1001:GET':
                window.Mock.mock({
                    "data": {
                        "id|+1": 1,                                 //计费规则id
                        number: /^No[0-5]{4}/,                      //计费规则编号
                        "name|5-10": '@cword',                      // 计费规则名
                        "status|1": [true, false],                   //计费规则状态  true：有效 false：无效
                        // 工作日计费规则
                        workDayPriceRuleVO: {
                            id: 1,                                   // | integer | 日计费规则id |
                            "upperLimitPrice|1": ["25", "30", "35"],   // | string | 封顶价 |
                            "daytimeFreeMin|10-30": 0,               // | integer | 白天免费时长 |
                            "daytimeType|1": [2],                // | integer  | 白天计费方式 0：按次收费 1：按时长收费 2：组合收费 |
                            // 小型车白天计费方式列表
                            "smallCarDaytimePriceTempleteList": [
                                {
                                    "id|+1": 1000,                  // | integer | 计费方式下每子项id |
                                    "sort|+1": 1,                   // | integer | 序号 |
                                    "hour1": 0,                     // | integer | 起始小时 |
                                    "hour2": 3,                     // | integer | 结束小时 |
                                    "price": "5",                   // | string | 单价 |
                                    "unit|1": ["次", "分钟"],      // | string | 单位 |
                                    "type|1": [0, 1],             // | integer | 计费方式 0：按次收费 1：按时长收费 2：组合收费 |
                                    //组合收费时 接下来的收费规则
                                    "child": []
                                },
                                {
                                    "id|+1": 1000,                  // | integer | 计费方式下每子项id |
                                    "sort|+1": 1,                   // | integer | 序号 |
                                    "hour1": 3,                     // | integer | 起始小时 |
                                    "hour2": 0,                     // | integer | 结束小时 |
                                    "price": "",                   // | string | 单价 |
                                    "unit": "",      // | string | 单位 |
                                    "type|1": [2],             // | integer | 计费方式 0：按次收费 1：按时长收费 2：组合收费 |
                                    //组合收费时 接下来的收费规则
                                    "child|2-4": [
                                        {
                                            "id|+1": 1000,                  // | integer | 计费方式下每子项id |
                                            "sort|+1": 1,                   // | integer | 序号 |
                                            "hour1": 0,                     // | integer | 起始小时 |
                                            "hour2": 3,                     // | integer | 结束小时 |
                                            "price": "5",                   // | string | 单价 |
                                            "unit": "分钟",      // | string | 单位 |
                                            "type": 1,             // | integer | 计费方式 0：按次收费 1：按时长收费 2：组合收费 |
                                            //组合收费时 接下来的收费规则
                                            "child": []
                                        }
                                    ]
                                }
                            ],
                            // 大型车白天计费方式列表
                            "bigCarDaytimePriceTempleteList": [
                                {
                                    "id|+1": 1000,                  // | integer | 计费方式下每子项id |
                                    "sort|+1": 1,                   // | integer | 序号 |
                                    "hour1": 0,                     // | integer | 起始小时 |
                                    "hour2": 3,                     // | integer | 结束小时 |
                                    "price": "5",                   // | string | 单价 |
                                    "unit|1": ["次", "分钟"],      // | string | 单位 |
                                    "type|1": [0, 1],             // | integer | 计费方式 0：按次收费 1：按时长收费 2：组合收费 |
                                    //组合收费时 接下来的收费规则
                                    "child": []
                                },
                                {
                                    "id|+1": 1000,                  // | integer | 计费方式下每子项id |
                                    "sort|+1": 1,                   // | integer | 序号 |
                                    "hour1": 3,                     // | integer | 起始小时 |
                                    "hour2": 0,                     // | integer | 结束小时 |
                                    "price": "",                   // | string | 单价 |
                                    "unit": "",      // | string | 单位 |
                                    "type|1": [2],             // | integer | 计费方式 0：按次收费 1：按时长收费 2：组合收费 |
                                    //组合收费时 接下来的收费规则
                                    "child|2-4": [
                                        {
                                            "id|+1": 1000,                  // | integer | 计费方式下每子项id |
                                            "sort|+1": 1,                   // | integer | 序号 |
                                            "hour1": 0,                     // | integer | 起始小时 |
                                            "hour2": 3,                     // | integer | 结束小时 |
                                            "price": "5",                   // | string | 单价 |
                                            "unit": "分钟",      // | string | 单位 |
                                            "type": 1,             // | integer | 计费方式 0：按次收费 1：按时长收费 2：组合收费 |
                                            //组合收费时 接下来的收费规则
                                            "child": []
                                        }
                                    ]
                                }
                            ],
                            "nighttimeFreeMin|10-30": 0,             // | integer | 夜间免费时长 |
                            "nighttimeType|1": [1],              // | integer | 夜间计费方式 0：按次收费 1：按时长收费 2：组合收费 |
                            // 小型车夜间计费方式列表
                            "smallCarNighttimePriceTempleteList|3-4": [
                                {
                                    "id|+1": 1000,                  // | integer | 计费方式下每子项id |
                                    "sort|+1": 1,                   // | integer | 序号 |
                                    "hour1": 0,                     // | integer | 起始小时 |
                                    "hour2": 3,                     // | integer | 结束小时 |
                                    "price": "0.05",                   // | string | 单价 |
                                    "unit|1": ["分钟"],      // | string | 单位 |
                                    "type|1": [1],             // | integer | 计费方式 0：按次收费 1：按时长收费 2：组合收费 |
                                    //组合收费时 接下来的收费规则
                                    "child": []
                                }
                            ],
                            // 大型车夜间计费方式列表
                            "bigCarNighttimePriceTempleteList|3-4": [
                                {
                                    "id|+1": 1000,                  // | integer | 计费方式下每子项id |
                                    "sort|+1": 1,                   // | integer | 序号 |
                                    "hour1": 0,                     // | integer | 起始小时 |
                                    "hour2": 3,                     // | integer | 结束小时 |
                                    "price": "0.1",                   // | string | 单价 |
                                    "unit|1": ["分钟"],      // | string | 单位 |
                                    "type|1": [1],             // | integer | 计费方式 0：按次收费 1：按时长收费 2：组合收费 |
                                    //组合收费时 接下来的收费规则
                                    "child": []
                                }
                            ]
                        },
                        // 非工作日计费规则
                        weekendPriceRuleVO: {
                            id: 1,                                   // | integer | 日计费规则id |
                            "upperLimitPrice|1": ["25", "30", "35"],   // | string | 封顶价 |
                            "daytimeFreeMin|10-30": 0,               // | integer | 白天免费时长 |
                            "daytimeType|1": [0],                // | integer  | 白天计费方式 0：按次收费 1：按时长收费 2：组合收费 |
                            // 小型车白天计费方式列表
                            "smallCarDaytimePriceTempleteList|3-4": [
                                {
                                    "id|+1": 1000,                  // | integer | 计费方式下每子项id |
                                    "sort|+1": 1,                   // | integer | 序号 |
                                    "hour1": 0,                     // | integer | 起始小时 |
                                    "hour2": 3,                     // | integer | 结束小时 |
                                    "price": "5",                   // | string | 单价 |
                                    "unit|1": ["次"],      // | string | 单位 |
                                    "type|1": [0],             // | integer | 计费方式 0：按次收费 1：按时长收费 2：组合收费 |
                                    //组合收费时 接下来的收费规则
                                    "child": []
                                }
                            ],
                            // 大型车白天计费方式列表
                            "bigCarDaytimePriceTempleteList|4-5": [
                                {
                                    "id|+1": 1000,                  // | integer | 计费方式下每子项id |
                                    "sort|+1": 1,                   // | integer | 序号 |
                                    "hour1": 0,                     // | integer | 起始小时 |
                                    "hour2": 3,                     // | integer | 结束小时 |
                                    "price": "5",                   // | string | 单价 |
                                    "unit|1": ["次"],      // | string | 单位 |
                                    "type|1": [0],             // | integer | 计费方式 0：按次收费 1：按时长收费 2：组合收费 |
                                    //组合收费时 接下来的收费规则
                                    "child": []
                                }
                            ],
                            "nighttimeFreeMin|10-30": 0,             // | integer | 夜间免费时长 |
                            "nighttimeType|1": [1],              // | integer | 夜间计费方式 0：按次收费 1：按时长收费 2：组合收费 |
                            // 小型车夜间计费方式列表
                            "smallCarNighttimePriceTempleteList|3-4": [
                                {
                                    "id|+1": 1000,                  // | integer | 计费方式下每子项id |
                                    "sort|+1": 1,                   // | integer | 序号 |
                                    "hour1": 0,                     // | integer | 起始小时 |
                                    "hour2": 3,                     // | integer | 结束小时 |
                                    "price": "0.05",                   // | string | 单价 |
                                    "unit|1": ["分钟"],      // | string | 单位 |
                                    "type|1": [1],             // | integer | 计费方式 0：按次收费 1：按时长收费 2：组合收费 |
                                    //组合收费时 接下来的收费规则
                                    "child": []
                                }
                            ],
                            // 大型车夜间计费方式列表
                            "bigCarNighttimePriceTempleteList|2-3": [
                                {
                                    "id|+1": 1000,                  // | integer | 计费方式下每子项id |
                                    "sort|+1": 1,                   // | integer | 序号 |
                                    "hour1": 0,                     // | integer | 起始小时 |
                                    "hour2": 3,                     // | integer | 结束小时 |
                                    "price": "0.15",                   // | string | 单价 |
                                    "unit|1": ["分钟"],      // | string | 单位 |
                                    "type|1": [1],             // | integer | 计费方式 0：按次收费 1：按时长收费 2：组合收费 |
                                    //组合收费时 接下来的收费规则
                                    "child": []
                                }
                            ]
                        }
                    },
                    "success": true
                }),
            /**
             * 新增计费规则详情
             * parkingPriceRulesJson
             */
            '/parking-resource/parkingPriceRules:POST':
                window.Mock.mock({
                    "data": "操作成功",
                    "success": true
                }),
            '/parking-resource/parkingPriceRules/1001:PUT':
                window.Mock.mock({
                    "data": "操作成功",
                    "success": true
                }),

            /**
             * 报警管理
             * 异常停车报警列表
             * @param {int} pageNum 开始页 Require=true
             * @param {int} pageSize 限制条数 Require=true
             * @param {String} startTime 报警开始时间 Require=false
             * @param {String} endTime 报警结束时间 Require=false
             * @param {int} warningType 报警类型 1：逆向停车 2：跨泊位停车 3：禁停时段停车 4：未付费停车 Require=false
             * @param {String} parkingSpaceNo 泊位号 Require=false
             * @param {String} deviceNo 设备编号 Require=false
             * @param {int} warningDisposeStatus 处理状态 0:待处理 1：已处理 Require=false
             * */
            '/parking-resource/admin/resource/parking/warning:GET':
                window.Mock.mock({
                    'data': {
                        pageNum: 1,//页码页
                        pageSize: 10,//限制数量
                        size: 10,//当前页数量
                        total: 30,//总记录数
                        isFirstPage: true,
                        isLastPage: false,
                        'list|10': [
                            {
                                'id|+1': 1,//报警Id
                                parkWarningDisposeId: 1,//处理详情id
                                'warningType|1-4': 1,//报警类型 1：逆向停车 2：跨泊位停车 3：禁停时段停车 4：未付费停车
                                'warningDisposeStatus|0-1': 0,//处理状态 0:待处理 1：已处理
                                warningDescribe: '',//报警具体描述
                                warningPhotos: [],//报警图片地址列表
                                deviceNo: '',//设备编号
                                'deviceType|0-4': 0,//设备类型 0：摄像头 1：UWB定位 2：UWB+摄像头双机 3：地磁检测器 4：车控机
                                deviceLatlong: '坐标',//设备相关地理位置
                                'parkingSpaceId|+1': 1,//停车位id
                                parkingSpaceNo: 'NO0001',//停车位编号
                                parkingName: '',//停车场名称
                                streetName: '',//街道名称
                                createTime: Random.date('yyyy-MM-dd HH:mm'),//创建时间
                                updateTime: Random.date('yyyy-MM-dd HH:mm'),//更新时间
                            },
                        ]
                    },
                    'success': true,
                }),
            /**
             * 报警管理
             * 报警消息详情
             * @param {int} parkWarningId 报警消息 Require=true
             * */
            '/parking-resource/admin/resource/parking/warning/NO0001:GET':
                window.Mock.mock({
                    'data': {
                        parkWarningDetail: {
                            id: 1,//报警id
                            parkWarningDisposeId: 1,//处理详情id
                            warningType: 2,//报警类型 1：逆向停车 2：跨泊位停车 3：禁停时段停车 4：未付费停车
                            warningDisposeStatus: 0,//处理状态 0:待处理 1：已处理
                            warningDescribe: Random.cparagraph(),//报警具体描述
                            warningPhotos: ['/resources/images/upload.png', '/resources/images/upload.png', '/resources/images/upload.png'],//报警图片地址列表
                            deviceNo: '@zip()',//设备编号
                            'deviceType|0-1': 1,//报警设备类型 0：摄像头 1：UWB定位 2：UWB+摄像头双机 3：地磁检测器 4：车控机
                            deviceLatlong: '坐标',//设备相关地理位置
                            parkingSpaceId: 1,//停车位id
                            parkingSpaceNo: 'NO0001',//停车位编号
                            parkingName: '',//停车场名称
                            streetName: '',//街道名称
                            createTime: '@date(yyyy-MM-dd HH:mm)',//创建时间
                            updateTime: '@date(yyyy-MM-dd HH:mm)',//更新时间
                        },
                        parkWarningDisposeDetail: {
                            id: 1,//处理详情id
                            adminUserId: 1,//处理人id
                            adminUserName: '张三',//处理人名称
                            disposeType: 1,//处理结果类型 0：误报 1：确认报警，发送报警给车主 2：确认报警，稽查人员创建订单
                            disposeInstructions: Random.cparagraph(),//处理说明
                            plateNumber: '',//处理车牌号
                            parkingSpaceNo: '',//处理泊位号
                            carType: 1,//车辆类型 0：小型车 1：大型车
                            parkInDate: '',//停车开始时间
                            disposePhotos: ['/resources/images/upload.png', '/resources/images/upload.png', '/resources/images/upload.png'],//处理图片地址列表
                            createUser: 1,//创建用户id
                            createTime: '@date(yyyy-MM-dd HH:mm:ss)',//创建时间
                            updateTime: '@date(yyyy-MM-dd HH:mm:ss)',//更新时间
                            extraChargeDetail: {
                                isLabel: false, //是否贴条
                                orderId: '@id()', //订单id
                                plateNumber: '@zip()', //车牌号
                                carType: 1, //车辆类型 0：小型车 1：大型车
                            }
                        }
                    }
                }),
            /**
             * 财务管理
             * 发票管理-用户获取发票列表
             * startTime
             * endTime
             * userPhone
             * invoiceTitle
             * invoiceType  发票类型 0：个人 1： 企业
             * invoiceStatus 发票状态 0：开票中 1：开票成功 2：开票失败
             * @param {int} pageSize 限制条数 Require=true
             * @param {int} pageNum 开始页 Require=true
             */
            '/parking-person-info/invoices/admin:GET':
                window.Mock.mock({
                    'data': {
                        "list|10": [{
                            "id|+1": 1,//发票id
                            "createTime": Random.datetime('yyyy-MM-dd HH:mm:ss'),//创建时间
                            "number": Random.zip(),//发票编号
                            'amount|0-100': 10,//发票金额
                            'status|1': [0, 1, 2],
                            "statusName|1": ['开票中', '开票成功', '开票失败'],//状态名
                            'userPhone': '13257779998',
                            'userEmail': '123123123@qq.com',
                            'invoiceType|1': [0, 1],//发票类型 0：个人 1： 企业
                            'invoiceTypeName|1': ['个人', '企业'],//name
                            'invoiceTitle|10': '@cword'//抬头
                        }],
                        "pageNum": 1,//页码页
                        "pageSize": 10,//限制数量
                        "size": 10,//当前页数量
                        "total": 20,//总记录数
                        "nextPage": 2,//下一页
                        "isFirstPage": true,//是否为第一页
                        "isLastPage": false,//是否为最后一页
                    },
                    "success": true,
                }),
            /**
             * 财务管理
             * 发票管理-获取某个发票详情
             * @param {int} id 发票id
             */
            '/parking-person-info/invoices/admin/1:GET':
                window.Mock.mock({
                    'data': {
                        "id": 1,//发票id
                        "createTime": Random.datetime('yyyy-MM-dd HH:mm:ss'),//创建时间
                        "number": Random.zip(),//发票编号
                        'amount|0-100': 10,//发票金额
                        'status|1': [0, 1, 2],
                        "statusName|1": ['开票中', '开票成功', '开票失败'],//状态名
                        "body": Random.cparagraph(),
                        'userPhone': '13257779998',
                        'userEmail': '1111@163.com',
                        'invoiceType|1': [0, 1],//发票类型 0：个人 1： 公司
                        'invoiceTypeName|1': ['个人', '公司'],//name
                        'invoiceTitle|10': '@cword',//抬头
                        'invoiceTaxpayerNo|20': '@cword',//发票税号
                    },
                    "success": true,
                }),
            /**
             * 财务管理
             * 发票管理-某个发票详情下绑定的支付流水订单列表
             * @param {int} id  发票id  Require=true
             * @param {int} pageSize 限制条数 Require=true
             * @param {int} pageNum 开始页 Require=true
             */
            '/parking-person-info/invoices/admin/1/parkOrderPayInfos:GET':
                window.Mock.mock({
                    'data': {
                        "list|10": [{
                            "parkOrderPayInfoId": '@id()',//订单支付流水id
                            "payTime": Random.datetime('yyyy-MM-dd HH:mm:ss'),//支付时间
                            "plateNumber": Random.zip(),//车牌号
                            'payMoney|0-100': 10,//支付金额
                        }],
                        "pageNum": 1,//页码页
                        "pageSize": 10,//限制数量
                        "size": 10,//当前页数量
                        "total": 20,//总记录数
                        "nextPage": 2,//下一页
                        "isFirstPage": true,//是否为第一页
                        "isLastPage": false,//是否为最后一页
                    },
                    "success": true,
                }),
            /**
             * 财务管理
             * 财报下载-停车记录明细表
             * @param {int} pageSize 限制条数 Require=true
             * @param {int} pageNum 开始页 Require=true
             * @param {String} endDate 结束时间 yyyy-MM-dd HH:mm:ss
             * @param {String} startDate 开始时间 yyyy-MM-dd HH:mm:ss
             * @param {int} parkId 路段id
             * @param {int} partnerCompanyId 合作方id
             * Header: application/x-www-form-urlencoded
             * */
            '/parking-orders/dataAnalysis/ordersDetailTable:GET':
                window.Mock.mock({
                    'data': {
                        "list|10": [{
                            orderId: '@guid()',//订单号
                            inTime: '@date("yyyy-MM-dd HH:mm:ss")',//进场时间
                            outTime: '@date("yyyy-MM-dd HH:mm:ss")',//出场时间
                            'realTime|1-60': 16,//停车时长 分钟
                            plateNumber: Random.zip(),//车牌号
                            parkingName: "No0001",//所属路段
                            'totalPrice|0-100': 10,//应收金额
                            'appliedCouponAmount|0-100': 10,//优惠金额
                            appliedCouponTypeName: "优惠类型",//优惠类型
                            'realPrice|0-100': 10,//实际应收总金额(元)
                            'receiveMoney|0-100': 10,//实际收到总金额(元)
                            'reminderMoney|0-100': 10,//当前尚欠费金额(元)
                            'refundMoney|0-100': 10,//当前已退金额(元)
                            'invoiceAmount|0-100': 10//实开发票金额(元)
                        }],
                        "pageNum": 1,//页码页
                        "pageSize": 10,//限制数量
                        "size": 10,//当前页数量
                        "total": 20,//总记录数
                        "nextPage": 2,//下一页
                        "isFirstPage": true,//是否为第一页
                        "isLastPage": false,//是否为最后一页
                    },
                    "success": true,
                    "error": {
                        "code": '',
                        "message": 'msg'
                    },
                }),
            /**
             * 财务管理
             * 财报下载-停车记录总表
             * @param {int} pageSize 限制条数 Require=true
             * @param {int} pageNum 开始页 Require=true
             * @param {String} endDate 结束时间 yyyy-MM-dd HH:mm:ss
             * @param {String} startDate 开始时间 yyyy-MM-dd HH:mm:ss
             * @param {int} parkId 路段id
             * @param {int} partnerCompanyId 合作方id
             * Header: application/x-www-form-urlencoded
             * */
            '/parking-orders/dataAnalysis/ordersTable:GET':
                window.Mock.mock({
                    'data': {
                        "list|10": [{
                            id: '@id()',
                            date: '@date("yyyy-MM-dd")',//时间
                            parkingName: "南京路",//路段
                            totalOrders: "60",//当日订单数
                            overdueOrders: 60,//当日欠缴订单数
                            realPrice: 10,//当日实际应收总金额(元)
                            receiveMoney: 10,//当日实际收到总金额(元)
                            reminderMoney: 10,//当日订单欠缴总金额(元)
                            refundMoney: 10,//当日订单退款总金额(元)
                        }],
                        "pageNum": 1,//页码页
                        "pageSize": 10,//限制数量
                        "size": 10,//当前页数量
                        "total": 20,//总记录数
                        "nextPage": 2,//下一页
                        "isFirstPage": true,//是否为第一页
                        "isLastPage": false,//是否为最后一页
                    },
                    "success": true,
                    "error": {
                        "code": '',
                        "message": 'msg'
                    },
                }),
            /**
             * 财务管理
             * 财报下载-停车记录明细列表导出
             * @param {String} endDate 结束时间 yyyy-MM-dd HH:mm:ss
             * @param {String} startDate 开始时间 yyyy-MM-dd HH:mm:ss
             * @param {int} parkId 路段id
             * @param {int} partnerCompanyId 合作方id
             * Header: application/x-www-form-urlencoded
             * */
            '/parking-orders/dataAnalysis/ordersDetailTableExcel:GET':
                window.Mock.mock({
                    'data': '返回excel',
                    "success": true,
                    "error": {
                        "code": '',
                        "message": 'msg'
                    },
                }),
            /**
             * 财务管理
             * 财报下载-停车记录总表导出
             * @param {String} endDate 结束时间 yyyy-MM-dd HH:mm:ss
             * @param {String} startDate 开始时间 yyyy-MM-dd HH:mm:ss
             * @param {int} parkId 路段id
             * @param {int} partnerCompanyId 合作方id
             * Header: application/x-www-form-urlencoded
             * */
            '/parking-orders/dataAnalysis/ordersTableExcel:GET':
                window.Mock.mock({
                    'data': '返回excel',
                    "success": true,
                    "error": {
                        "code": '',
                        "message": 'msg'
                    },
                }),


            //Giab create mock data (2018-11-1 12:38)
            /**
             * 获取泊位占用情况
             * partnerCompanyId    Integer    合作方id                        N
             * parkId            Integer    路段id                        N
             */
            '/parking-resource/admin/resource/parking/space/spaceUseState:GET':
                window.Mock.mock({
                    "success": true,
                    "error": {
                        "code": 0,
                        "message": "error message"
                    },
                    "data": {
                        "spareCount|400-500": 0,
                        "occupiedCount|200-300": 0,
                        "maintainingCount|0-20": 0
                    }
                }),
            /**
             * 获取泊位占用情况
             * partnerCompanyId    Integer    合作方id                        N
             * parkId            Integer    路段id                        N
             */
            '/parking-resource/admin/resource/parking/space/spaceUseState/list:GET':
                window.Mock.mock({
                    "success": true,
                    "error": {
                        "code": 0,
                        "message": "error message"
                    },
                    "data|1000-2000": [{
                        "id|+1": 1,  //车位id Integer
                        parkingSpaceNo: /^No[0-5]{4}/, //停车位编码 String
                        "parkingPointName|5-10": '@cword', // 停车位名称  String
                        parkingId: 1, //停车场id Integer
                        "parkingSpaceStatus|1": [0, 1, 2] //0：空闲 1： 占用 2：维修中
                    }]
                }),
            /**
             * 获取收益数据
             * partnerCompanyId    Integer    合作方id                        N
             * parkId            Integer    路段id                        N
             * type    Integer    #0:日，1:月，2：年                    Y
             * startDate        String    开始时间 yyyy-MM-dd HH:mm:ss    N
             * endDate            String    结束时间 yyyy-MM-dd HH:mm:ss    N
             */
            '/parking-orders/dataAnalysis/parkSpaceInCome:GET':
                window.Mock.mock({
                    "success": true,
                    "error": {
                        "code": 0,
                        "message": "error message"
                    },
                    "data|7-30": [{
                        "year": 2018,
                        "month": 1,
                        "day|+1": 1,
                        "receiveAmount|5-30": 0
                    }]
                }),
            /**
             * 权限管理-用户管理
             * 部门列表
             */
            '/parking-info/centerConsole/info/departmentList:GET':
                window.Mock.mock({
                    "data": {
                        "total": 140,
                        "list|10": [{
                            "id|+1": 1,//部门id
                            "departmentName|1": ["人事部", "开发部", "产品部"],
                            "personNumber|0-50": 1,
                            "personList|3-5": [
                                {
                                    "userId|+1": 1,
                                    "userName": "@name()",
                                    "userPhone": 15099991111,
                                    "roleName": "admin1,admin2"
                                }]
                        }]

                    },
                    "success": true
                }),
            /**
             * 权限管理-用户管理
             * 部门新增
             * departmentName
             */
            '/parking-info/centerConsole/info/addDepartment:POST':
                window.Mock.mock({
                    "data": "新增成功",
                    "success": true
                }),
            /**
             * 权限管理-用户管理
             * 部门修改
             * departmentId
             * departmentName
             */
            '/parking-info/centerConsole/info/updateDepartment:POST':
                window.Mock.mock({
                    "data": "修改成功",
                    "success": true
                }),
            /**
             * 权限管理-用户管理
             * 部门删除
             * departmentId
             */
            '/parking-info/centerConsole/info/deleteDepartment:POST':
                window.Mock.mock({
                    "data": "删除成功",
                    "success": true
                }),
            /**
             * 权限管理-用户管理
             * 部门详情
             * departmentId
             */
            '/parking-info/centerConsole/info/departmentDetail:POST':
                window.Mock.mock({
                    "data": {
                        "id": 1,//部门id
                        "departmentName": "人事部",
                        "personNumber": /\d{2}/,
                        "deparnmentRoleName": "1,2"
                    },
                    "success": true
                }),
            /**
             * 权限管理-用户管理
             * 角色列表
             */
            '/parking-info/centerConsole/info/roleList:GET':
                window.Mock.mock({
                    "data": {
                        "total": 3,
                        "list|3": [{
                            "id|+1": 1,//角色id
                            "name|+1": ["一级管理员", "二级管理员", "三级管理员"],//角色名称
                            "permissionsInfo": "权限1；权限2；权限3；权限4",//权限信息
                            "permissionIds": '1, 2, 3, 4'
                        }]

                    },
                    "success": true
                }),
            /**
             * 权限管理-用户管理
             * 人员详情
             * adminId
             */
            '/parking-info/centerConsole/info/queryAdmin:GET':
                window.Mock.mock({
                    "data": {
                        "id": 1,//人员id
                        "userName": "admin",
                        "departmentIds": [1, 2],
                        "departmentNames": "人事部,开发部",
                        "mobileNumber": "15869132231",
                        "roleIds": [{roleId: 1, roleName: 'admin'}, {roleId: 2, roleName: 'admin2'}]
                    },
                    "success": true
                }),
            /**
             * 权限管理-用户管理
             * 人员新增
             * userName  require
             * userPhone require
             * departmentIds require
             * password require
             * roleIds string '1,2,3'
             */
            '/parking-info/centerConsole/info/addUser:POST':
                window.Mock.mock({
                    "data": "新建成功",
                    "success": true
                }),
            /**
             * 权限管理-用户管理
             * 绑定合作方人员到运营方部门
             * mobileNumber  require
             * departmentIds require
             * roleIds string '1,2,3'
             */
            '/parking-info/centerConsole/info/bindUserToDepartment:POST':
                window.Mock.mock({
                    "data": "新建成功",
                    "success": true
                }),
            /**
             * 权限管理-用户管理
             * 人员修改
             * userId  require
             * userName  require
             * roleIds string '1,2,3'
             */
            '/parking-info/centerConsole/info/updateUser:POST':
                window.Mock.mock({
                    "data": "修改成功",
                    "success": true
                }),
            /**
             * 权限管理-用户管理
             * 人员删除
             * userId  require
             */
            '/parking-info/centerConsole/info/deleteUser:POST':
                window.Mock.mock({
                    "data": "删除成功",
                    "success": true
                }),
            /**
             * 权限管理-角色管理
             * 角色新增
             * roleName  require
             * rolePermissionIds require
             */
            '/parking-info/centerConsole/info/addRole:POST':
                window.Mock.mock({
                    "data": "新建成功",
                    "success": true
                }),
            /**
             * 权限管理-角色管理
             * 角色修改
             * roleId   require
             * roleName  require
             * rolePermissionIds require
             */
            '/parking-info/centerConsole/info/updateRole:POST':
                window.Mock.mock({
                    "data": "修改成功",
                    "success": true
                }),
            /**
             * 权限管理-角色管理
             * 角色删除
             * roleId   require
             */
            '/parking-info/centerConsole/info/deleteRole:POST':
                window.Mock.mock({
                    "data": "删除成功",
                    "success": true
                }),
            /**
             * 权限管理-角色管理
             * 权限列表****************!
             */
            '/parking-info/centerConsole/info/permissionsList:GET':
                window.Mock.mock({
                    "data": [
                        //有 以一级权限： 首页统计分析 时 返回
                        {
                            "id": 1,
                            "name": "首页",
                            "path": "/Home",
                            //有二级权限 泊位占用情况查看 时 返回
                            "childs": [
                                {
                                    "id": 2,
                                    "name": "统计分析",
                                    "path": "/AnalysisIndex",
                                },
                            ],
                        },
                        //有一级权限 报警管理 时 返回
                        {
                            "id": 3,
                            "name": "报警管理",
                            "path": "/AlarmManage",
                            "childs": [
                                //有二级权限 报警查看 时 返回
                                {
                                    "id": 4,
                                    "name": "违停报警",
                                    "path": "/AbnormalParkingAlarm",

                                },
                            ],
                        },
                        //有一级权限 合作方管理 时 返回
                        {
                            "id": 5,
                            "name": "合作方管理",
                            "path": "/PartnerManage",
                            "childs": [
                                //有二级权限 合作方基本查看 时 返回
                                {
                                    "id": 6,
                                    "name": "合作方列表",
                                    "path": "/PartnerList"
                                },
                                //有二级权限 合作方主账号信息查看 时 返回
                                {
                                    "id": 7,
                                    "name": "合作方主账号",
                                    "path": "/PartnerAccounts"
                                },
                            ],
                        }, //有一级权限 资源管理 或一级权限 计费规则 时 返回
                        {
                            "id": 8,
                            "name": "资源管理",
                            "path": "/ResourceManage",
                            "childs": [
                                //有二级权限 路段查看 时 返回
                                {
                                    "id": 9,
                                    "name": "路段资源",
                                    "path": "/SectionResource"
                                },
                                //有一级权限 计费规则 时 返回
                                {
                                    "id": 10,
                                    "name": "收费规则",
                                    "path": "/ChargeRules"
                                }
                            ],
                        },
                        {
                            "id": 11,
                            "name": "稽查管理",
                            "path": "/InspectionManage",
                            "childs": [
                                //有 二级权限： 查看角色 时 返回
                                {
                                    "id": 12,
                                    "name": "稽查组管理",
                                    "path": "/InspectionGroup"
                                }
                            ],
                        },
                        //有 一级权限： 权限管理 时 返回
                        {
                            "id": 13,
                            "name": "系统配置",
                            "path": "/SystemConfig",
                            "childs": [
                                //有 二级权限： 查看部门人员 时 返回
                                {
                                    "id": 14,
                                    "name": "财务账号参数",
                                    "path": "/FinancialAccountParams"
                                },
                                //有 二级权限： 查看角色 时 返回
                                {
                                    "id": 15,
                                    "name": "业务账号参数",
                                    "path": "/BusinessAccountParams"
                                }
                            ],
                        }
                    ],
                    "success": true
                }),
            /**
             * 名单管理-黑名单
             * 获取黑名单*************!
             * userName  false
             * mobile  false
             * plateNumber false
             */
            '/parking-info/centerConsole/info/blacklist:GET':
                window.Mock.mock({
                    "data": {
                        "pageNum": 1,
                        "pageSize": 10,
                        "size": 10,
                        "total|0-100": 100,
                        "list|10": [
                            {
                                "nameId|+1": 1,
                                "userName": "@name()",
                                "mobile": /^1[385][1-9]\d{8}/,
                                "plateNumber": "@zip()",
                                "forbidSection|3": [
                                    {
                                        "parkingId|+1": 1001,
                                        "parkingName|3": '@cword',
                                    }
                                ],
                            }
                        ]
                    },
                    "success": true,
                    "error": {}
                }),
            /**
             * 名单管理-黑名单
             * 新增黑名单*************!
             * userName
             * mobile
             * plateNumber
             * forbidSection
             */
            '/parking-info/centerConsole/info/blacklist:POST':
                window.Mock.mock({
                    "data": '添加成功',
                    "success": true,
                    "error": {}
                }),
            /**
             * 名单管理-黑名单
             * 修改黑名单*************!
             * userName
             * mobile
             * plateNumber
             * forbidSection
             */
            '/parking-info/centerConsole/info/blacklist/1:PUT':
                window.Mock.mock({
                    "data": '更新成功',
                    "success": true,
                    "error": {}
                }),
            /**
             * 名单管理-黑名单
             * 删除黑名单*************!
             */
            '/parking-info/centerConsole/info/blacklist/1:DELETE':
                window.Mock.mock({
                    "data": '删除成功',
                    "success": true,
                    "error": {}
                }),
            /**
             * 名单管理-黑名单
             * 批量插入黑名单*************!
             * filePath  QUERY
             */
            '/parking-info/centerConsole/info/importBlacklist:PUT':
                window.Mock.mock({
                    "data": '批量导入成功',
                    "success": true,
                    "error": {}
                }),
            /**
             * 名单管理-优惠名单
             * 获取优惠名单*************!
             * userName  false
             * mobile  false
             * plateNumber false
             */
            '/parking-info/centerConsole/info/coupons:GET':
                window.Mock.mock({
                    "data": {
                        "pageNum": 1,
                        "pageSize": 10,
                        "size": 10,
                        "total|0-100": 100,
                        "list|10": [
                            {
                                "nameId|+1": 1,
                                "userName": "@name()",
                                "mobile": /^1[385][1-9]\d{8}/,
                                "plateNumber": "@zip()",
                                "preferentialSection|3": [
                                    {
                                        "parkingId|+1": 1001,
                                        "parkingName|3": '@cword',
                                    }
                                ],
                                "couponAmount|1-100": 1,
                                "couponType|1": [0, 1],
                                "effectiveTime": "2017-11-30",
                                "invalidTime": "2018-11-30",
                            }
                        ]
                    },
                    "success": true,
                    "error": {}
                }),
            /**
             * 名单管理-优惠名单
             * 新增*************!
             * userName
             * mobile
             * plateNumber
             * preferentialSection
             * couponAmount
             * couponType
             * effectiveTime
             * invalidTime
             */
            '/parking-info/centerConsole/info/coupons:POST':
                window.Mock.mock({
                    "data": '添加成功',
                    "success": true,
                    "error": {}
                }),
            /**
             * 名单管理-优惠名单
             * 修改优惠名单*************!
             * userName
             * mobile
             * plateNumber
             * preferentialSection
             * couponAmount
             * couponType
             * effectiveTime
             * invalidTime
             */
            '/parking-info/centerConsole/info/coupons/1:PUT':
                window.Mock.mock({
                    "data": '更新成功',
                    "success": true,
                    "error": {}
                }),
            /**
             * 名单管理-优惠名单
             * 删除优惠名单*************!
             */
            '/parking-info/centerConsole/info/coupons/1:DELETE':
                window.Mock.mock({
                    "data": '删除成功',
                    "success": true,
                    "error": {}
                }),
            /**
             * 名单管理-优惠名单
             * 批量插入优惠名单*************!
             * filePath  QUERY
             */
            '/parking-info/centerConsole/info/importCoupons:PUT':
                window.Mock.mock({
                    "data": '批量导入成功',
                    "success": true,
                    "error": {}
                }),
            /**
             * 稽查管理-班次管理
             * 班次列表
             * scheduleName
             */
            '/parking-inspection/inspection/schedule:GET':
                window.Mock.mock({
                    "data": {
                        "pageNum": 1,
                        "pageSize": 10,
                        "size": 10,
                        "total|0-100": 100,
                        "list|10": [
                            {
                                "id|+1": 1,
                                "scheduleName": "@name()",
                                "comments": "评论",
                                "scheduleTimes": [
                                    {
                                        "workStartTime": "07:00",
                                        "workEndTime": "18:00",
                                        "workTimeType": 0,//天内班次：0早班, 1中班，2晚班，3全天, 4休息
                                        "id": 1
                                    }
                                ],
                                "scheduleType": 0,//班次制度类型：0 一班制， 1二班制，2 三班制
                            }
                        ]
                    },
                    "success": true,
                    "error": {}
                }),
            /**
             * 稽查管理-班次管理
             * 新增班次
             * scheduleName
             * scheduleType
             * scheduleTimes
             * comments
             */
            '/parking-inspection/inspection/schedule:POST':
                window.Mock.mock({
                    "data": '新增成功',
                    "success": true,
                    "error": {}
                }),
            /**
             * 稽查管理-班次管理
             * 编辑班次
             * scheduleName
             * scheduleType
             * scheduleTimes
             * comments
             */
            '/parking-inspection/inspection/schedule/1:PUT':
                window.Mock.mock({
                    "data": '保存成功',
                    "success": true,
                    "error": {}
                }),
            /**
             * 稽查管理-班次管理
             * 编辑班次
             * scheduleName
             * scheduleType
             * scheduleTimes
             * comments
             */
            '/parking-inspection/inspection/schedule/1:DELETE':
                window.Mock.mock({
                    "data": '删除成功',
                    "success": true,
                    "error": {}
                }),
            /**
             * 稽查管理-稽查组管理
             * 班次列表
             * scheduleName
             */
            '/parking-inspection/inspection/group:GET':
                window.Mock.mock({
                    "data": {
                        "pageNum": 1,
                        "pageSize": 10,
                        "total|0-100": 100,
                        "size": 10,
                        "list|10": [
                            {
                                "id|+1": 1,//稽查组ID
                                "principalUserId|+1": 1,//负责人id
                                "groupName": "@name()",
                                "principalUserName": "负责人",
                                "count|1-20": 1,
                                "comments": "评论评论评论评论",//评论
                                "inspectionGroupParkings|3": [//管辖路段/停车点
                                    {
                                        "parkingId|+1": 1,//路段id
                                        "parkingName|3": "@cword",
                                        "inspectionGroupParkingPoints|3": [
                                            {
                                                "parkingPointId|+1": 1,//停车点id
                                                "parkingPointName|3": '@cword'//停车点名称
                                            }
                                        ]
                                    }
                                ],
                                "inspectionGroupSchedules|3": [//排班
                                    {
                                        "inspectionScheduleId|+1": 1,
                                        "groupScheduleType|1": [0, 1, 2],//班次排班类型：0通用班次, 1工作日班次， 2假日班次
                                        // "scheduleType|1": [0, 1, 2],//班次制度类型：0 一班制， 1 二班制，2 三班制
                                        "scheduleName|1": ['一班制', '二班制', '三班制'],//班次名称
                                    }
                                ]
                            }
                        ]
                    },
                    "success": true,
                    "error": {}
                }),
            /**
             * 稽查管理-稽查组管理
             * 删除稽查组
             *
             */
            '/parking-inspection/inspection/group/1:DELETE':
                window.Mock.mock({
                    "data": '删除成功',
                    "success": true,
                    "error": {}
                }),
            /**
             * 会员管理-会员列表
             * memberId
             * mobile
             * userMemberGradeId
             */
            '/parking-person-info/member/vip:GET':
                window.Mock.mock({
                    "data": {
                        "pageNum": 1,
                        "pageSize": 10,
                        "total|0-100": 100,
                        "size": 10,
                        "list|10": [
                            {
                                "id|+1": 1,//用户ID
                                "name": "@name()",
                                "mobile": /^1[385][1-9]\d{8}/,
                                "sex|1": ["男", "女"],
                                "wxNumber": "@word",
                                "birthday": "1995-01-09",
                                "memberId|+1": 1,//会员ID
                                "memberGradeId": 1,
                                "memberGradeName": "普通会员",
                                "memberScore|1-100": 1,
                                "walletBalance|1-100": 1
                            }],
                    },
                    "success": true,
                    "error": {}
                }),
            /**
             * 会员管理-会员详情
             * ?id
             */
            '/parking-person-info/member/vip/1:GET':
                window.Mock.mock({
                    "data": {
                        "id": 1,//用户ID
                        "name": "@name()",
                        "mobile": /^1[385][1-9]\d{8}/,
                        "sex|1": ["男", "女"],
                        "plateNumberList|1-6":["浙A12345"],
                        "wxNumber": "@word",
                        "birthday": "1995-01-09",
                        "memberId": 1,//会员ID
                        "memberGradeId": 1,
                        "memberGradeName": "普通会员",
                        "memberScore|1-100": 1,
                        "walletBalance|1-100": 1,
                        "email": "12345678@qq.com",
                        "joinTime": "2018-01-10",
                        "address": "大傻大大时代大厦大厦大傻大大时代大厦大厦大傻大大时代大厦大厦大傻大大时代大厦大厦"
                    },
                    "success": true,
                    "error": {}
                }),
            /**
             * 会员管理-会员积分管理
             * 获取会员等级列表
             */
            '/parking-person-info/memberGrade/list:GET':
                window.Mock.mock({
                    "data": [{
                        "id": 1,
                        "memberGradeName": "普通会员"
                    }],
                    "success": true,
                    "error": {}
                }),
            /**
             * 会员管理-会员积分管理
             * 获取各类积分规则列表
             * typeQUERY 规则类型 1：消费积分 2：充值积分 3：活跃积分-新用户注册 4：活跃积分-个人信息完善
             * statusQUERY 生效状态 1:未生效 2:生效中 3:已失效 -1:全部
             */
            '/parking-person-info/memberScore/rule:GET':
                window.Mock.mock({
                    "data": {
                        "pageNum": 1,
                        "pageSize": 10,
                        "total|0-100": 100,
                        "size": 10,
                        "list|10": [{
                            "id|+1": 1,
                            "name": "规则-" + "@cword",
                            "startTime": "2018-11-11 00:00",
                            "endTime": "2020-11-11 23:59",
                            "status|1": [1, 2, 3],//生效状态 1:未生效 2:生效中 3:已失效
                            "minAmount|+1": 10,
                            "memberScore|+1": 10,
                            "rateArray": [{"memberGradeName": "普通会员", "rate": 1,}]
                        }]
                    },
                    "success": true,
                    "error": {}
                }),
            /**
             * 会员管理-会员积分管理
             * 新增各类积分规则
             */
            '/parking-person-info/memberScore/rule:POST':
                window.Mock.mock({
                    "data": "新增成功",
                    "success": true,
                    "error": {}
                }),
            /**
             * 会员管理-会员积分管理
             * 修改各类积分规则
             * scoreRuleId QUERY
             * status  QUERY
             */
            '/parking-person-info/memberScore/rule/change:POST':
                window.Mock.mock({
                    "data": "修改成功",
                    "success": true,
                    "error": {}
                }),
            /**
             * 系统配置-节假日配置
             * 获取日历节假日
             * date-require//要查看的节假日的月份
             */
            '/parking-info/centerConsole/getConfiguredHoliday:GET':
                window.Mock.mock({
                    "data": {
                        "list": [
                            {
                                "date": "2010-11-11",
                                "dateType": 0
                            }
                        ]
                    },
                    "success": true,
                    "error": {}
                }),
            /**
             * 系统配置-节假日配置
             * 配置节假日
             * date-require//日期
             * dateType-require//日期类型（ 1：节假日 、2:工作日）
             */
            '/parking-info/centerConsole/configureHoliday:POST':
                window.Mock.mock({
                    "success": true,
                    "data": "配置成功",
                    "error": {}
                }),
            /**
             * 系统配置-节假日配置
             * 导入节假日表格
             */
            '/parking-info/centerConsole/importHolidayExcel:POST':
                window.Mock.mock({
                    "success": true,
                    "data": "导入成功",
                    "error": {}
                }),
            /**
             * 系统配置-账务账号参数页面接口
             * 负责人：尹绪存
             */
            '/parking-info/centerConsole/getFinancialAccountParams:GET':
                window.Mock.mock({
                    "data": {
                        bankAccount: { //财务账号参数
                            accountType: '账户类型',//账户类型(1:企业收款账号、2:财政收款账号)
                            beneficiaryBank: '收款银行',//收款银行
                            collectAccount: '收款账号',//收款账号
                        },
                        wxPayAccount: {
                            publicAccountId: '微信公众号ID',//微信公众号ID
                            publicAccountKey: '微信公众号密钥',//微信公众号密钥
                            merChantNumber: '微信商户号',//微信商户号
                        },
                        billingAccountParams: {
                            salerTaxNum: '税号',//税号
                            salerTel: '开票方电话',//开票方电话
                            salerAddress: '地址',//地址
                            salerAccount: '销方银行账号和开户行地址',//销方银行账号和开户行地址
                            salerPlatformInterface: '第三方平台接口',//第三方平台接口
                            billingAccount: '开票账号',//开票账号
                        },
                    },
                    "success": true
                }),
            /**
             * 系统配置-获取运营方业务账号参数
             * 负责人：尹绪存
             */
            '/parking-info/centerConsole/getBusinessAccountParams:GET':
                window.Mock.mock({
                    "data": {
                        "mailAccountParams": {//邮箱账号
                            "sendMailAccount": "邮箱",//发信邮箱
                            "passwordOfMail": "邮箱密码",//邮箱登陆密码
                            "SMTPAddress": "SMTP地址",//SMTP地址
                            "SMTPPort": "端口",//SMTP端口
                            "status": "状态",//状态
                        },
                        "messageParams": {
                            "accessKeyId": "用户名",//用户名
                            "accessKeySecret": "密码",//密码
                            "signName": "签名",//签名
                        }
                    },
                    "success": true
                }),
            /**
             * 系统配置-财务账号参数-配置运营方收款账号信息
             * 负责人：尹绪存
             * @param {number} accountType 账号类型(1:企业收款账号、2:财政收款账号)
             * @param {String} beneficiaryBank 收款银行
             * @param {String} collectionAccount 收款账号
             */
            '/parking-info/centerConsole/configureBeneficiaryAccount:POST':
                window.Mock.mock({
                    "success": true,
                    "data": "配置成功",
                }),
            /**
             * 系统配置-财务账号参数-配置运营方第三方支付配置-微信
             * 负责人：尹绪存
             * @param {String} publicAccountId 微信公众号ID
             * @param {String} publicAccountKey 微信公众号密钥
             * @param {String} merChantNumber 微信商户号
             */
            '/parking-info/centerConsole/configureWxParams:POST':
                window.Mock.mock({
                    "success": true,
                    "data": "配置成功",
                }),
            /**
             * 系统配置-财务账号参数-运营方开票账号
             *  负责人：尹绪存
             * @param {String} salerTaxNum 销方税号
             * @param {String} salerTel 销方电话
             * @param {String} salerAddress 销方地址
             * @param {String} salerAccount 销方银行账号
             * @param {String} salerOpenBankAddress 销方开户行地址
             * @param {String} invoiceClerk 开票员
             * @param {String} appKey 诺诺平台appKey
             * @param {String} appSecret 诺诺平台appSecret
             */
            '/parking-info/centerConsole/configureBillingAccount:POST':
                window.Mock.mock({
                    "success": true,
                    "data": "配置成功",
                }),
            /**
             * 系统配置-业务账号参数-邮箱账号设置
             *  负责人：尹绪存
             * @param {String} sendMailAccount 发信邮箱
             * @param {String} passwordOfMail 邮箱登陆密码
             * @param {String} SMTPAddress SMTP服务器地址
             * @param {String} SMTPPort SMTP服务器端口
             * @param {number} status 状态（1:启用，2:停用）
             * @param {String} testMailAddress 测试邮件地址 required=false
             */
            '/parking-info/centerConsole/configureMailAccount:POST':
                window.Mock.mock({
                    "success": true,
                    "data": "配置成功",
                }),
            /**
             * 系统配置-业务账号参数-短信接口配置
             *  负责人：尹绪存
             * @param {String} accessKeyId 用户名
             * @param {String} accessKeySecret 用户密码
             * @param {String} signName 签名
             */
            '/parking-info/centerConsole/configureMeesgeParams:POST':
                window.Mock.mock({
                    "success": true,
                    "data": "配置成功",
                }),
            /**
             * 系统配置-业务账号参数-测试发送邮件
             *  负责人：尹绪存
             * @param {String} testMailAddress 用户名
             */
            '/parking-info/centerConsole/sendTestMail:POST':
                window.Mock.mock({
                    "success": true,
                    "data": "发送成功",
                }),

            /**
             * 稽查组管理-稽查组详情
             * id为稽查组id 陈杰
             */
            '/parking-inspection/inspection/group/1:GET':
                window.Mock.mock({
                    "success": true,
                    "data": {
                        "id": 6,
                        "principalUserId": "1",
                        "principalUserName": "核力量",
                        "principalUserMobile": "13222223333",
                        "groupName": "第一稽查组",
                        "checkPointEffectiveRang": 300,
                        "comments": "呵呵呵",
                        "inspectionGroupMembers|3": [
                            {
                                "userId": 1,
                                "userName": "我们1",
                                "mobile": "19888888888"
                            }
                        ],
                        "inspectionGroupParkings|2": [
                            {
                                "parkingId": 1,
                                "parkingName": "宝安区",
                                "inspectionGroupParkingPoints|3": [
                                    {
                                        "parkingPointId": 1,
                                        "parkingPointName": "沿山1"
                                    }
                                ]
                            }
                        ],
                        "inspectionGroupSchedules": [
                            {
                                "inspectionScheduleId": 1,
                                "groupScheduleType": 2,
                                "scheduleName": "新建测试"
                            }
                        ],
                        "inspectionGroupCheckPoints": [
                            {
                                "checkPointAddress": "发电方式",
                                "checkPointEffectiveRang": 300,
                                "checkPointLongitude": "2323432423",
                                "checkPointLatitude": "234324242"
                            }
                        ]
                    },
                }),
            /**
             * 稽查组管理-新建稽查组
             *  负责人：陈杰
             *
             * "comments": "", 备注
             *   "principalUserId": 1, 负责人id
             *   "groupName": "not null", 稽查组名
             *   "checkPointEffectiveRang": 1, 考勤检查范围
             *   "principalUserName": "", 稽查人员姓名
             *   "inspectionGroupMembers": [
             *       {
             *        "userId": 1,稽查人员id
             *        "userName": "",稽查人员姓名
             *        "mobile": ""稽查人员电话
             *       }
             *   ],
             *   "inspectionGroupParkings": [
             *       {
             *        "parkingId": 1,路段id
             *        "parkingName": "",路段名称
             *        inspectionGroupParkingPoints: [1, 2] 停车点id
             *       }
             *   ],
             *   "inspectionGroupSchedules": [
             *       {
             *        "inspectionScheduleId": 1,班次id
             *        "groupScheduleType": "1"考勤检查范围
             *       }
             *   ],
             *   "inspectionCheckPoints": [
             *       {
             *        "checkPointAddress": "",考勤点地址
             *        "checkPointLongitude": "",考勤点经度
             *        "checkPointLatitude": ""考勤点维度
             *       }
             *   ],
             *   "principalMobile": ""负责人手机号
             *
             */
            '/parking-inspection/inspection/group:POST':
                window.Mock.mock({
                    "success": true,
                    "data": "新建稽查组成功",
                }),
            /**
             * 排班管理-获取稽查组所有人员单月排班信息
             * 负责人：郑建锋
             * @param {String} workMonth yyyy-mm
             */
            '/parking-inspection/inspection/schedule/manage/group/month/calendar:GET':
                window.Mock.mock({
                    "success": true,
                    "data": {
                        "dateInfos|30": [ //日历信息
                            {
                                "dateStatus|0-1": 1,//日期类型状态:0节假日 1工作日
                                "weekDay": "周日",//周日
                                "date|+1": 1//yyyy-mm-dd
                            }
                        ],
                        "groupSchedules": [//班次信息
                            {
                                "groupScheduleType": 1, //稽查组排班类型：0通用班次, 1工作日班次， 2假日班次
                                "scheduleType": 2, //班次制度类型：0 一班制， 1二班制，2 三班制.
                                "scheduleName": "通用班次", //班次名称
                                "workScheduleTimes": [ //工作班次时间信息
                                    {
                                        "id": 80,//班次时间id
                                        "workStartTime": "工作开始时间",//工作开始时间
                                        "workEndTime": "工作结束时间",//工作结束时间
                                        "workTimeType": 0//班次时间类型：0早班, 1中班，2晚班,3全天
                                    }, {
                                        "id": 91,//班次时间id
                                        "workStartTime": "工作开始时间",//工作开始时间
                                        "workEndTime": "工作结束时间",//工作结束时间
                                        "workTimeType": 1//班次时间类型：0早班, 1中班，2晚班,3全天
                                    }, {
                                        "id": 11,//班次时间id
                                        "workStartTime": "工作开始时间",//工作开始时间
                                        "workEndTime": "工作结束时间",//工作结束时间
                                        "workTimeType": 2//班次时间类型：0早班, 1中班，2晚班,3全天
                                    }
                                ],
                            }, {
                                "groupScheduleType": 2, //稽查组排班类型：0通用班次, 1工作日班次， 2假日班次
                                "scheduleType": 1, //班次制度类型：0 一班制， 1二班制，2 三班制.
                                "scheduleName": "通用班次", //班次名称
                                "workScheduleTimes": [ //工作班次时间信息
                                    {
                                        "id": 50,//班次时间id
                                        "workStartTime": "工作开始时间",//工作开始时间
                                        "workEndTime": "工作结束时间",//工作结束时间
                                        "workTimeType": 0//班次时间类型：0早班, 1中班，2晚班,3全天
                                    }, {
                                        "id": 61,//班次时间id
                                        "workStartTime": "工作开始时间",//工作开始时间
                                        "workEndTime": "工作结束时间",//工作结束时间
                                        "workTimeType": 1//班次时间类型：0早班, 1中班，2晚班,3全天
                                    }
                                ],
                            }
                        ]
                    },
                }),
            /**
             * 排班管理-获取稽查组单月月排班日历信息
             * 负责人：郑建锋
             * @param {Number} inspectionGroupId
             * @param {String} workMonth yyyy-mm
             */
            '/parking-inspection/inspection/schedule/manage/group/month:GET':
                window.Mock.mock({
                    "success": true,
                    "data": {
                        "memberInfos": [//组员月内每日排班信息列表
                            {
                                "groupMemberId": 1,//组员id
                                "groupMemberName": '@cname()',//组员名称
                                "workScheduleDates|30": [ //排班班次时间信息
                                    {
                                        "workDate|+1": 1, //排班的日期:yyyy-mm-dd
                                        'workType': [0, 1], //班次时间类型：0早班, 1中班，2晚班,3全天,4休息
                                    }
                                ],
                            }, {
                                "groupMemberId": 2, //组员id
                                "groupMemberName": '@cname()', //组员名称
                                "workScheduleDates|30": [ //排班班次时间信息
                                    {
                                        "workDate|+1": 1,//排班的日期:yyyy-mm-dd
                                        'workType': [4],//班次时间类型：0早班, 1中班，2晚班,3全天,4休息
                                    }
                                ],
                            }
                        ]
                    },
                }),
            /**
             * 排班管理-获取稽查组单月月排班日历信息
             * 负责人：郑建锋
             * @param {Number} groupMemberId 需要修改的组员id
             * @param {String} workDate yyyy-mm-DD 当前选中的日期
             * @param {Array} workScheduleTimeIds 修改后的班次时间id列表 休息数组为空
             * @param {Number} inspectionGroupId 稽查组id
             * @param {Boolean} rest 是否为休息
             */
            '/parking-inspection/inspection/schedule/manage/group/month:PUT':
                window.Mock.mock({
                    "success": true,
                    "data": "编辑更新成功",
                    "error": {}
                }),
            /**
             * 导入排班表
             * 负责人：郑建锋
             * @param {Object} scheduleFile File类型文件
             */
            'parking-inspection/inspection/schedule/manage/import:GET':
                window.Mock.mock({
                    "success": true,
                    "data": "导入成功",
                    "error": {}
                }),
            /**
             * 导出排班表/centerConsole/getAllDepartmentList
             * 负责人：郑建锋
             * @param {Object} workDate 导出日期 YYYY-MM
             */
            'parking-inspection/inspection/schedule/manage/export:GET':
                window.Mock.mock({
                    "success": true,
                    "data": "导出成功",
                    "error": {}
                }),
            /**
             * 获取部门人员
             * 负责人：郑建锋
             */
            'parking-info/centerConsole/getAllDepartmentList:GET':
                window.Mock.mock({
                    "success": true,
                    "data": "",
                    "error": {}
                }),
            /**
             * 获取路段停车点
             * 负责人：郑建锋
             */
            'parking-resource/admin/resource/parking/gets/withParkingPoint:GET':
                window.Mock.mock({
                    "success": true,
                    "data": "",
                    "error": {}
                }),
            /**
             * 中台获取异常订单列表
             * 负责人：罗胡凯
             * @param {String} parkOrderId 订单id
             * @param {String} parkingSpaceNo 泊位编号
             * @param {String} plateNumber 车牌
             * @param {String} warningEndTime 报警筛选开始时间 yyyy-MM-dd HH:mm:ss
             * @param {String} warningEndTime 报警筛选结束时间 yyyy-MM-dd HH:mm:ss
             * @param {Number} parkOrderWarnType 报警类型 1:长期 2:异常
             * @param {Number} parkOrderWarnStatus 报警处理状态 1:待稽查处理 2:待中台处理 3:已处理 筛选全部的 不要带状态
             * @param {Number} pageNum 页码 Required
             * @param {Number} pageSize 一页多少数据 Required
             */
            '/parking-orders/parkOrder/exception/warnings:GET':
                window.Mock.mock({
                    "success": "",
                    "error": {
                        "code": 1,
                        "message": ""
                    },
                    "data": {
                        "pageNum": 1, //页码
                        "pageSize": 10, //每页数量
                        "size": 10, //当前页数量
                        "startRow": 1,
                        "endRow": 10,
                        "total": 11, //总记录数
                        "pages": 2, //总页数
                        "list|11": [
                            {
                                "parkOrderId|+1": 1234, //订单id
                                "type|1-2": 1, //报警类型 1:长期 2:异常
                                "parkingSpaceNo": /^slm[0-9]{3}/, //泊位编号
                                "plateNumber": /^carNo.[0-9]{5}/, //车牌
                                "parkingTime": "@datetime()", //停留时长
                                "status|1-3": 1, //状态 1:待稽查端处理2:待中台端处理 3:已处理
                                "id": '@id()', //报警id
                                "createTime": "@datetime()" //报警时间 yyyy-MM-dd HH:mm
                            }
                        ],
                        "prePage": 0, //前一页
                        "nextPage": 2, //下一页
                        "isFirstPage": true, //是否是第一页
                        "isLastPage": true, //是否为最后一页
                        "hasPreviousPage": true, //是否有前一页
                        "hasNextPage": true //是否有下一页
                    }
                }),
            /**
             * 获取某个报警详情
             * 负责人：罗胡凯
             */
            '/parking-orders/parkOrder/exception/warnings/1234:GET':
                window.Mock.mock({
                    "success": "",
                    "error": {
                        "code": 1,
                        "message": ""
                    },
                    "data": {
                        "id": 1,
                        "parkOrderId": "1234",
                        "type": 1,
                        "parkingSpaceNo": /^slm[0-9]{3}/, //泊位编号
                        "plateNumber": /^carNo.[0-9]{5}/, //车牌
                        "parkingTime": '@datetime()',
                        "parkingId": '@id()',
                        "status": 3, //报警状态 1:待稽查处 2:待中台处理 3:已处理
                        "remark": "",
                        "createTime": "@datetime()",
                        "inspectDispose": {
                            "id": '1234',
                            "type|1-2": 1, //处理类型 1：稽查处理 2：中台处理
                            "disposeResultType": 2, //处理结果 1：误报 2：确认报警
                            "remark": "",
                            "createTime": "@datetime()",
                            "disposePhotoList": [],
                            "adminUserName": "@cname()"
                        },
                        "manageDispose": {
                            "id": 12134,
                            "adminUserName": "@cname()",
                            "type": 1,
                            "disposeResultType": 1,
                            "createTime": "@datetime()",
                            "remark": "",
                            "disposePhotoList": []
                        }
                    }
                }),
            /**
             * 中台-关闭订单
             * 负责人：郑建锋
             * @param{String} remark 备注
             */
            '/parking-orders/parkOrder/exception/warnings/1234/close:PUT':
                window.Mock.mock({
                    "success": true,
                    "data": "",
                    "error": {}
                }),
            /**
             * 查看客服电话和网站
             * 负责人：尹绪存
             */
            '/parking-info/configureInfo/getCustomServiceInfo:GET':
                window.Mock.mock({
                    "success": true,
                    "data": {
                        "customServiceInfo": [
                            {
                                "areaName": "", //区域名称
                                "tel": [] //客服电话数组
                            }
                        ],
                        "webSite": [] //官网数组
                    },
                    "error": null
                }),
            /**
             * 配置客服电话与官网
             * 负责人：尹绪存
             * @param {Array} customServiceInfo:[{areaName: '', tel: ''}]
             * @param {Array} webSite:[]
             */
            '/parking-info/centerConsole/configureAreaCustomServiceInfo:POST':
                window.Mock.mock({
                    "success": true,
                    "data": "配置成功",
                    "error": null
                }),
            /**
             * 获取用户积分清零规则
             * 负责人：尹绪存
             */
            '/parking-person-info/memberScore/getMemberScoreCleanRule:GET':
                window.Mock.mock({
                    "success": true,
                    "data": {
                        "runTime": "", //运行时间 MM-dd
                        "effectMemberScoreTime": "" //生效的范围的时间 yyyy-MM-dd
                    },
                    "error": null
                }),
            /**
             * 配置用户积分清零规则
             * 负责人：尹绪存
             * @param {String} runTime 运行时间 MM-dd runTime >= effectMemberScoreTime
             * @param {String} effectMemberScoreTime 要清除的范围 MM-dd
             */
            '/parking-person-info/memberScore/configureScoreCleanRule:GET':
                window.Mock.mock({
                    "success": true,
                    "data": "配置规则成功",
                    "error": null
                }),
            /**
             * 获取所有获取部门人员
             */
            '/parking-inspection/inspection/getAllDepartmentUserList:GET':
                window.Mock.mock({
                    "success": true,
                    "data": [],
                    "error": null
                }),
            /**
             * 获取路段停车点
             */
            '/parking-inspection/inspection/getAllParkingWithPointList:GET':
                window.Mock.mock({
                    "success": true,
                    "data": [],
                    "error": null
                }),
            // 获取计费单位, 时段划分单位
            "/parking-info/operator:GET":
                window.Mock.mock({
                    "success": false,
                    "error": {
                        "code": 1,
                        "message": ""
                    },
                    "data": {
                        "id": 1,
                        "name": "",
                        "parkingPriceRuleTimeUnit": 1, // 时长收费单位数
                        "unitNumber": 1, // 时长收费单位数(换算后)
                        "unitName": "" //时长收费单位名(换算后)
                    }
                }),
            /**
             * 获取logo, 名称, favicon
             * @param {Number} operatorId 运营id required
             * @param {String} client 入口标志console:中台,check:稽查,mobile:车主 required
             * */
            "/parking-authority/configureInfo/getLogoConfig:GET":
                window.Mock.mock({
                    "success": false,
                    "data": {
                        "id": 1,
                        "operatorId": 1,
                        "logo": "", // logo链接
                        "name": "",
                        "favicon": "", // favicon链接
                        "client": "" // console:中台 check:稽查 mobile:车主
                    }
                }),
            /**
             * 获取费用申诉列表
             * @param {String} startTime 开始时间
             * @param {String} endTime 结束时间
             * @param {String} parkOrderId 订单号
             * @param {String} mobile 手机号
             * @param {Number} status 状态
             * @param {Number} pageSize 一页面大小
             * @param {Number} pageNum 一页list数据多少
             * */
            "/parking-orders/costAppeal/list:GET":
                window.Mock.mock({
                    "success": true,
                    "data": {
                        "pageNum": 1,
                        "pageSize": 1,
                        "total": 1,
                        "hasNextPage": false,
                        "list": [
                            {
                                "id": 1,
                                "parkOrderId": "",
                                "plateNumber": "",
                                "createTime": "",
                                "userMobile": "",
                                "status": 1
                            }
                        ]
                    },
                    "error": {
                        "code": 1,
                        "message": ""
                    }
                }),
            /**
             * 获取订单费用申诉详情
             * @param {String} parkOrderId 开始时间
             * */
            "/parking-orders/costAppeal/detail:GET":
                window.Mock.mock({
                    "success": true,
                    "data": {
                        "parkOrderId": "",
                        "status": 1,
                        "realTime": 1,
                        "latestCostAppeal": {
                            "userMobile": /^1[385][1-9]\d{8}/,
                            "plateNumber": /^1[385][1-9]\d{6}/,
                            "reason": "@cparagraph()",
                            "photos|1-3": Random.image('200x100', '#50B347', '#FFF', 'window.Mock.js'),
                            "id": 1
                        },
                        "latestCostAppealDispose": {
                            "createUserName": "@cname()",
                            "createTime": "@datetime()",
                            "status": 1,
                            "reason": "@cparagraph()",
                            "waiverAmount": 122
                        },
                        "costAppealHistory": [
                            {
                                "id": 1,
                                "status": 1,
                                "userMobile": /^1[385][1-9]\d{8}/,
                                "plateNumber": /^1[385][1-9]\d{6}/,
                                "reason": "@cparagraph()",
                                "createTime": "@datetime()",
                                "photos1-3": Random.image('200x100', '#50B347', '#FFF', 'window.Mock.js'),
                                "parkOrderCostAppealDisposeDTOs": [
                                    {
                                        "createUserName": "@cname()",
                                        "createTime": "@datetime()",
                                        "status|1-2": 1,
                                        "reason": "@cparagraph()",
                                        "waiverAmount": 100
                                    }
                                ]
                            }
                        ]
                    }
                }),
            /**
             * 获取费用申诉列表
             * @param {String} parkOrderId 订单号
             * @param {Number} status 处理状态 0拒绝 1通过
             * @param {String} waiverAmount 减免金额
             * */
            "/parking-orders/costAppeal/dispose:POST":
                window.Mock.mock({
                    "success": true,
                    "error": {
                        "code": 1,
                        "message": ""
                    },
                    "data": "处理成功"
                }),
            /**
             * 导出费用申诉列表
             * @param {String} startTime 订单号
             * @param {String} endTime 处理状态 0拒绝 1通过
             * @param {String} parkOrderId 减免金额
             * @param {String} mobile 订单号
             * @param {Number} status 0待处理 1通过 2拒绝 -1全部
             * @param {String} token 减免金额
             * */
            "/parking-orders/costAppeal/listForExcel:GET":
                window.Mock.mock({
                    "success": true,
                    "error": {
                        "code": 1,
                        "message": ""
                    },
                    "data": "处理成功"
                }),
        };
        return mockdata;
    }


    function query(url, rtype, data, callback, contentType = 'application/json;charset=UTF-8', processData = true) {
        if (REQUEST == "mock") {
            var mockdata = fetchMock();
            var d = mockdata[url + ":" + rtype];
            // console.log(">>>>>mock", url, rtype, data, d);
            callback(d, requestSuccess);
        } else if (REQUEST == "truth") {
            let headers = null;
            let header_token = null;
            if ((url === window.MODULE_PARKING_AUTHORITY + '/admin/token') || (url === window.MODULE_PARKING_AUTHORITY + '/configureInfo/getLogoConfig')) { // 判断是否是登录接口
                header_token = "Basic Y29uc29sZTpjb25zb2xl";
            } else {
                // let access_token = sessionStorage.getItem('access_token') || "";
                let access_token = window.customCookie.get('access_token') || '';
                header_token = "Bearer " + access_token;
            }
            headers = {"Authorization": header_token};
            // console.log(REQUEST + "--" + httpClientHost + url + "--Params:", data);
            $(function () {
                $.ajax({
                    "url": httpClientHost + url,
                    "async": true,
                    "cache": false,
                    "method": rtype,
                    "data": data,
                    "processData": processData,
                    "dataType": 'json',
                    "contentType": contentType,
                    "xhrFields": {
                        "withCredentials": true,
                    },
                    "headers": headers,
                    timeout: 40000,
                    "crossDomain": true,
                    success: function (d) {
                        if (d.success) {
                            //成功
                            // console.log(REQUEST + "--" + url + "--Success:", d);
                            callback(d, requestSuccess);
                        } else {
                            //可以处理d.error.code
                            if (d.error.code === 10014 || d.error.code === 10015) {// 登录失效 || 用户不存在
                                window.isInvalidToLogin = true;
                                sessionStorage.clear();
                                localStorage.clear();
                                window.setPageMenu([]);
                                window.setPermission({});
                                window.setManagePartnerList([]);
                                window.currentIsSystemAdmin = false;
                                if (d.error.code === 10014) {
                                    location.hash = '/Login';
                                } else {
                                    callback(d, requestSuccess);
                                    const hash = location.hash;
                                    if (!hash.match('Login')) {
                                        location.hash = '/Login';
                                    }
                                }
                            } else {
                                message.error(d.error.message);
                                callback(d, requestDataError);
                            }
                        }
                    },
                    error: function (e) {
                        //服务异常
                        console.error(REQUEST + "--" + url + "--Error:", e);
                        message.error("服务器异常！");
                        callback(e, requestServiceError);
                    }
                });
            })
        }
    }

    return {
        ClientHost: httpClientHost,
        GET: 'GET',
        POST: "POST",
        PUT: "PUT",
        DELETE: "DELETE",
        requestSuccess: requestSuccess,
        requestDataError: requestDataError,
        requestServiceError: requestServiceError,
        query: query,
        REQUEST: REQUEST
    }


}());

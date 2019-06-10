import React, {Component, Fragment} from 'react';
import $ from 'jquery';
import {Layout, Menu, Dropdown, Icon, Avatar, message, Modal, Select, Spin} from 'antd';
import {Link} from 'react-router';
import './Style/IndexContainer.css';
//请求
import {HttpClient} from '../../common/HttpClient.jsx';
import {HttpClientImmidIot} from "../../common/HttpClientImmidIot";
import Exception from "../../components/Exception";
// import GreyBreadcrumb from "../../components/GreyBreadcrumb";
import ResetPasswordCard from "../LoginContainer/ResetPasswordCard/ResetPasswordCard.jsx";
import _ from 'lodash';

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const Option = Select.Option;

export default class IndexContainer extends Component {
    constructor(props) {
        super(props);
        window.localStorage.setItem('NODE_ENV', process.env.NODE_ENV);
        message.config({
            top: $(window).height() / 2 - 30,
            duration: 3
        });
        let pathname = window.location.hash;
        let pathArr = _.split(pathname, '/');
        let openKeys = pathArr[2] ? [`/${pathArr[1]}`] : [];
        // console.log(pathArr, openKeys);
        this.requireContext = require.context("@static/images", false, /icon-menu-(\w*?)\.png/);
        this.menuIcon = this.requireContext.keys().map(this.requireContext);
        this.currentTabsData = []; //当前tabs的菜单数据
        this.state = {
            load: true,
            collapsed: false,
            showExit: false,//是否显示退出按钮
            visible: false,//显示退出询问
            resetPasswordVisible: false,//修改密码Model Visible
            isSystemAdmin: true,//是否是运营方
            isPartnerAdmin: false, //是否是合作方
            menuHeader: '', // 菜单头部标题
            openKeys: openKeys,
            oldOpenKeys: [],
            pathHash: window.location.hash,

            currentTabsData: [],//当前tabs的菜单数据
        };
    }

    // 组件挂载之前
    componentWillMount() {
        window.setPageMenu([0]); // 暂时给定一个值，在获取到菜单之前判断页面不要进403
        // 获取单位
        HttpClient.query(`${window.MODULE_PARKING_INFO}/operator`, 'GET', null, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                window.UNIT_NAME = d.data.unitName
            } else {
                //失败----做除了报错之外的操作
                console.error('获取单位失败，在IndexContainer中的请求')
            }
        })
    }

    componentDidMount() {
        let consoleType = null;
        if (localStorage.getItem('console_type') === 'partner_admin') {
            consoleType = localStorage.getItem('console_type');
        } else {
            consoleType = '';
            localStorage.setItem('console_type', '');
        }
        // 获取logo，名字
        HttpClient.query(`${window.MODULE_PARKING_INFO}/configureInfo/getLogoConfig`, 'GET', {
            operatorId: window.OPERATOR_ID,
            client: 'console'
        }, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                // 获取favicon
                const iconHref = d.data.favicon || 'resources/images/favicon.ico';
                this.getFavicon(iconHref);
                window.OPERATOR_NAME = d.data.name || '城市路内停车管理';
                this.setState({
                    operatorName: window.OPERATOR_NAME
                });
            } else {
                //失败----做除了报错之外的操作
            }
            // 获取权限点https:/parking-info/centerConsole/login/getUserPermission
            HttpClientImmidIot.query('/parking-info/centerConsole/login/getUserPermission', 'GET', { consoleType: consoleType }, this.getUserPermission.bind(this));
        });
    }

    getFavicon (iconHref) {
        let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = iconHref;
        document.getElementsByTagName('head')[0].appendChild(link);
    }

    getUserPermission(d, type){
        this.setState({
            load: false
        });
        const data = d.data;
        if (type === HttpClient.requestSuccess) {
            window.currentIsSystemAdmin = localStorage.getItem('console_type') === '' && data.isSystemAdmin; // 判断是否是运营方用户
            !window.currentIsSystemAdmin && localStorage.setItem('console_type', 'partner_admin'); // 如果当前用户不为运营方，重新设置localStorage为partner_admin
            window.setPermission(data.authList);
            if (data.isPartnerAdmin && data.managePartnerList.length > 0) {
                localStorage.setItem('partnerCompanyId', data.managePartnerList[0].id);
                localStorage.setItem('partnerCompanyName', data.managePartnerList[0].name)
            }
            window.setManagePartnerList(data.managePartnerList);
            window.setPageMenu(data.authMenu);
            window.setNewPageMenu(data.authMenu);
            localStorage.setItem('IOT_USER_NAME', data.userInfo ? data.userInfo.userName : '');
            this.setState({
                isSystemAdmin: data.isSystemAdmin,
                isPartnerAdmin: data.isPartnerAdmin,
                menuHeader: window.currentIsSystemAdmin ? `${this.state.operatorName}运营中台` : `${this.state.operatorName}合作方中台`,
            });

            _.toArray(data.authMenu).forEach(firstItem => {
                _.toArray(firstItem.childs).forEach(secondItem => {
                    if (secondItem.childs) {
                        if (location.hash.indexOf(secondItem.path) > -1) {
                            this.setState({
                                currentTabsData: secondItem.childs
                            });
                            // if (!location.hash.split('/')[3]) {
                            //     location.hash = location.hash + secondItem.childs[0].path;
                            // }
                        }
                    }
                })
            })

        } else {
            //失败----做除了报错之外的操作
            window.setPageMenu([]); // 无任何权限，进入403
        }
    }

    // 退出登录提示模态框
    showModal() {
        this.setState({
            visible: true,
        });
    }

    // 退出登录OK
    handleOk() {
        message.success('您已成功退出登录');
        sessionStorage.clear();
        localStorage.clear();
        window.customCookie.remove('access_token');
        window.setPageMenu([]);
        window.setNewPageMenu([]);
        window.setPermission({});
        window.setManagePartnerList([]);
        window.currentIsSystemAdmin = false;
        location.hash = '/Login';
    }

    // 退出登录Cancel
    handleCancel() {
        this.setState({
            visible: false,
        });
    }

    // 修改密码Cancel
    handleResetPasswordCancel() {
        this.setState({
            resetPasswordVisible: false,
        });
        // 重置resetPasswordCard表单
        this.refs.resetPasswordCard.resetFields();
    }

    // 获取侧边栏菜单
    getMenuGroup(menu, leftMenuSelectedKeys) {
        if (menu[0] !== 0) {
            return <Menu
                mode="inline"
                theme="dark"
                multiple={false}
                selectedKeys={[leftMenuSelectedKeys]}
                openKeys={this.state.openKeys}
                onOpenChange={this.onOpenChange.bind(this)}
                onSelect={this.onSelect.bind(this)}>
                {_.toArray(menu).map((item, i) => this.getMenu(item))}
            </Menu>;
        }
    }

    getMenu(obj) {
        let imgURL = null;
        for (let j = 0; j < this.requireContext.keys().length; j++) {
            if (obj.icon.indexOf(this.requireContext.keys()[j].split('/')[1]) > 0) {
                imgURL = this.menuIcon[j];
            }
        }
        if (_.toArray(obj.childs).length > 0) {
            return (
                <SubMenu key={obj.path}
                         title={
                             <div>
                                 <img className={this.state.collapsed ? 'index-menu-icon-collapsed' : 'index-menu-icon'}
                                      src={imgURL}/>
                                 <span
                                     className={this.state.collapsed ? 'index-menu-span-collapsed' : 'index-menu-span'}>{obj.name}</span>
                             </div>
                         }
                >
                    {_.toArray(obj.childs).map((data, index) => {
                            return (
                                <Menu.Item key={obj.path + data.path}>
                                    <Link key={obj.path + data.path}
                                          to={obj.path + data.path + `${data.childs ? data.childs[0].path : ''}`}
                                          onClick={this.menuItemClick.bind(this, data)}>
                                        {data.name}
                                    </Link>
                                </Menu.Item>
                            )
                        }
                    )}
                </SubMenu>
            )
        } else {
            return <Menu.Item key={obj.path}>
                <Link key={obj.path} to={obj.path}>
                    <img className='index-menu-icon' src={imgURL}/>
                    <span>{obj.name}</span>
                </Link>
            </Menu.Item>
        }
    }

    menuItemClick(data) {
        this.setState({
            currentTabsData: data.childs || []
        });
    }

    //头像点击
    userClick() {
        this.setState({
            showExit: !this.state.showExit
        })
    }

    // 点击切换用户类型菜单
    changeUserType() {
        this.setState({
            load: true,
        });
        if (localStorage.getItem('console_type') === 'partner_admin') {
            localStorage.setItem('console_type', '')
        } else {
            localStorage.setItem('console_type', 'partner_admin')
        }
        window.currentIsSystemAdmin = localStorage.getItem('console_type') === ''; // 判断是否是运营方用户
        const param = localStorage.getItem('console_type');
        HttpClient.query('/parking-info/centerConsole/login/getUserPermission', 'GET', { consoleType: param }, (d, type) => {
            const data = d.data;
            if (type === HttpClient.requestSuccess) {
                window.setPermission(data.authList);
                window.setManagePartnerList(data.managePartnerList);
                window.setPageMenu(data.authMenu);
                window.setNewPageMenu(data.authMenu);
                location.hash = "/";
                this.setState({
                    load: false,
                    isSystemAdmin: data.isSystemAdmin,
                    isPartnerAdmin: data.isPartnerAdmin,
                    menuHeader: window.currentIsSystemAdmin ? `${this.state.operatorName}运营中台` : `${this.state.operatorName}合作方中台`,
                });
            } else {
                //失败----做除了报错之外的操作
            }
        });
    }

    // 下拉子菜单点击
    dropDownMenuClick(e) {
        switch (e.key) {
            case '0':
                this.changeUserType();
                break;
            case '1':
                this.setState({
                    resetPasswordVisible: true
                });
                break;
            case '2':
                this.showModal();
                break
        }
    }

    // 合作方公司列表选择
    changeManagePartnerList(e) {
        localStorage.setItem('partnerCompanyName', e ? e.label : '');
        localStorage.setItem('partnerCompanyId', e ? e.key : '');
        this.setState({ load: true });
        setTimeout(() => {
            this.setState({
                load: false
            });
        }, 100);
    }

    onOpenChange(openKeys) {
        let last = [openKeys[openKeys.length - 1]];
        this.setState({ openKeys: last });
    }

    onSelect(item, key, selectedKeys) {
        this.setState({
            oldOpenKeys: this.state.openKeys
        });
    }

    toggleCollapsed() {
        this.setState({
            oldOpenKeys: this.state.openKeys
        });
        if (!this.state.collapsed) {
            this.setState({
                collapsed: !this.state.collapsed,
                openKeys: []
            });
        } else {
            this.setState({
                collapsed: !this.state.collapsed,
                openKeys: this.state.oldOpenKeys
            });
        }
    }

    render() {
        const { isSystemAdmin, isPartnerAdmin, resetPasswordVisible, menuHeader, currentTabsData } = this.state;
        let userName = window.localStorage.getItem("IOT_USER_NAME") || "admin";
        let pathHash = window.location.hash;
        let pathArr = _.split(pathHash, '/');
        //左侧菜单选中栏
        let leftMenuSelectedKeys = pathArr[2] ? `/${pathArr[1]}/${pathArr[2]}` : `/${pathArr[1]}`;
        //tab菜单选中key
        let tabMenuSelectedKes = pathArr[3] ? `/${pathArr[3]}` : '';
        let isExceptionPage = pathHash.indexOf('403') > -1;
        // console.log(leftMenuSelectedKeys);
        // 合作方管理公司列表
        const manageListOptions = window.getManagePartnerList().map(item => (
            <Option key={_.toString(item.id)} title={item.name} value={_.toString(item.id)}>{item.name}</Option>
        ));

        // 下拉子菜单
        let userType = (isSystemAdmin && isPartnerAdmin && manageListOptions.length > 0) && (window.currentIsSystemAdmin ? '合作方中台' : '运营中台');
        const DropdownMenu = (
            <Menu onClick={this.dropDownMenuClick.bind(this)}>
                {
                    userType && (
                        <Menu.Item key="0" style={{ color: '#1890FF' }}>
                            <Icon type="team" theme="outlined"/>{userType}
                        </Menu.Item>
                    )
                }
                <Menu.Item key="1">
                    <Icon type="lock" theme="outlined"/>修改密码
                </Menu.Item>
                <Menu.Divider/>
                <Menu.Item key="2">
                    <Icon type="logout" theme="outlined"/>退出登录
                </Menu.Item>
            </Menu>
        );
        // 获取菜单和内容
        const getContent = () => {
            if (window.pageMenu.length > 0 && window.pageMenu[0] === 0) { // 说明菜单数据还没获取完成
                return ''
            } else if (window.pageMenu.length === 0) { // 说明该用户没有任何权限
                return this.state.load ? null :
                    (this.props.children && !this.state.load) ? <Exception type='403' desc='抱歉，你暂无任何权限，请联系管理员'/>
                        : null
                // return <Exception type='403' desc='抱歉，你暂无任何权限，请联系管理员'/>
            } else if (window.pageMenu.length > 0) { // 菜单数据获取完成，且有权限
                return <Fragment>
                    <div style={{ margin: 0, minWidth: (this.state.collapsed ? 1360 : 1184) }}>
                        {/*<GreyBreadcrumb pathHash={pathHash}/>*/}
                        {/*tab菜单栏*/}
                        {
                            (isExceptionPage || currentTabsData.length === 0) ? '' : (
                                <div>
                                    <Menu selectedKeys={[tabMenuSelectedKes]} mode="horizontal"
                                          style={{ padding: '0 32px', minHeight: 48 }}>
                                        {
                                            currentTabsData.map(tabMenu =>
                                                <Menu.Item key={tabMenu.path}>
                                                    <Link key={tabMenu.path} to={[pathArr[1], pathArr[2]].join('/') + tabMenu.path}>
                                                        {tabMenu.name}
                                                    </Link>
                                                </Menu.Item>
                                            )
                                        }
                                    </Menu>
                                </div>
                            )
                        }
                    </div>
                    <Content style={{ margin: 0, minWidth: (this.state.collapsed ? 1360 : 1184) }}>
                        {/*{React.cloneElement(this.props.children, {collapsed: this.state.collapsed})}*/}
                        {
                            this.state.load ? null :
                                (this.props.children && !this.state.load) ? React.cloneElement(this.props.children, { collapsed: this.state.collapsed })
                                    : null
                        }
                    </Content>
                </Fragment>
            }
        };
        return (
            <Spin spinning={this.state.load}>
                <div>
                    {/*修改密码提示模态框*/}
                    <Modal
                        footer={null}
                        visible={resetPasswordVisible}
                        onCancel={this.handleResetPasswordCancel.bind(this)}
                    >
                        <ResetPasswordCard context='修改密码' ref='resetPasswordCard'
                                           style={{ backgroundColor: 'white', paddingTop: 30 }}/>
                    </Modal>
                    {/*退出登录提示模态框*/}
                    <Modal
                        title="退出登录"
                        visible={this.state.visible}
                        onOk={this.handleOk.bind(this)}
                        onCancel={this.handleCancel.bind(this)}
                    >
                        <p style={{ padding: "24px 24px" }}>确定退出该账号吗？</p>
                    </Modal>
                    <Layout>
                        <Sider width={256} trigger={null}
                               style={{
                                   overflow: 'auto',
                                   height: '100vh',
                                   background: "#001529",
                                   position: 'fixed',
                                   left: 0,
                                   zIndex: 500
                               }}
                               collapsible
                               collapsed={this.state.collapsed}>
                            <div className="logo">
                                <img src={window.LOGO_SRC} style={{ width: 40, height: 30 }}
                                     className={this.state.collapsed ? 'logo-img-collapsed' : 'logo-img'}/>
                                <span
                                    className={this.state.collapsed ? 'logo-span-collapsed' : 'logo-span'}>{menuHeader}</span>
                            </div>
                            <div style={{ clear: "both" }}/>
                            {this.getMenuGroup(window.pageMenu, leftMenuSelectedKeys)}
                        </Sider>
                        <Layout style={{ marginLeft: this.state.collapsed ? 80 : 256 }}>
                            <Header style={{
                                background: '#fff',
                                padding: 0,
                                borderBottom: "2px solid #F0F2F5",
                                boxShadow: " 0 1px 4px 0 rgba(0,21,41,0.12)"
                            }}>
                                <Icon
                                    className="trigger"
                                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                    onClick={this.toggleCollapsed.bind(this)}
                                />
                                {
                                    // 头部公司Select
                                    (!window.currentIsSystemAdmin && window.getManagePartnerList()[0]) && (
                                        <div className="head_one_company">
                                            {manageListOptions.length === 1 ?
                                                window.getManagePartnerList()[0].name : (
                                                    manageListOptions.length > 1 &&
                                                    <Select className='selectCompany'
                                                            defaultValue={{
                                                                key: localStorage.partnerCompanyId,
                                                                label: localStorage.partnerCompanyName
                                                            }}
                                                            labelInValue
                                                            onChange={this.changeManagePartnerList.bind(this)}>
                                                        {manageListOptions}
                                                    </Select>
                                                )
                                            }
                                        </div>
                                    )
                                }
                                <div className="user-info" onClick={this.userClick.bind(this)}>
                                    <Dropdown overlay={DropdownMenu} trigger={['click']}>
                                        <div>
                                            <Avatar size="small" style={{ marginRight: 16, verticalAlign: 'middle' }}
                                                    icon="user"/>{userName}，您好
                                        </div>
                                    </Dropdown>
                                </div>
                            </Header>
                            <div style={{ margin: 0, width: "100%", overflow: "auto" }}>
                                {getContent()}
                            </div>
                            <Footer className="parking-foot">
                                Copyright © 2018 智而行科技有限公司
                            </Footer>
                        </Layout>
                    </Layout>
                </div>
            </Spin>
        )
    }
}

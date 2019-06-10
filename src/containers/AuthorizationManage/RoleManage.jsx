import React, {Component} from 'react';
import {HttpClient} from '../../common/HttpClient.jsx';
import {
    Form, Modal, Input, Select, message, Button, Icon, Pagination, Spin,
    Table, Popconfirm, TreeSelect, Row, Col
} from "antd/lib/index";
import Exception from "../../components/Exception";
import _ from 'lodash';

const FormItem = Form.Item;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

//角色管理
class RoleManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            searchParams: {roleName: ''},//searchparam
            search: {},
            pageNum: 1,
            pageSize: 10,
            currentCount: 0,
            total: 0,
            dataList: [],
            modalType: 0,//0:new;1:edit
            visible: false,
            modalRoleId: null,//角色id
            modalRoleName: "",//角色名称
            modalRolePermission: '',//权限信息
            permissionTreeData: [],
        }
    }


    componentWillMount() {

    }


    componentDidMount() {
        if (window.checkPageEnable('/RoleManage')) {
            this.loadData();
            if (window.checkPageEnable('roleEdit')) this.loadPermissions();
        }
    }

    /**
     * 加载数据
     * @param page
     * @param size
     */
    loadData(page, size, searchData) {
        this.setState({
            loading: true,
        });
        const {search, pageNum, pageSize} = this.state;
        let data = searchData ? searchData : search;
        data.pageNum = page ? page : pageNum;
        data.pageSize = size ? size : pageSize;
        HttpClient.query(window.MODULE_PARKING_INFO + `/centerConsole/info/roleList`, "GET", data, this.configData.bind(this));
    }

    /**
     * 接口请求回调
     * @param d
     * @param type
     */
    configData(d, type) {
        if (type == HttpClient.requestSuccess) {
            //成功-------在这里做你的数据处理，需要提示的自己加
            this.setState({
                loading: false,
                total: d.data.total,
                currentCount: d.data.size,
                dataList: d.data.list,
            })
        } else {
            //失败----做除了报错之外的操作
            this.setState({
                loading: false,
            })
        }
    }

    loadPermissions() {
        HttpClient.query(window.MODULE_PARKING_INFO + `/centerConsole/info/permissionsList`,
            "GET", {}, (d, type) => {
                if (type == HttpClient.requestSuccess) {
                    let list = _.toArray(d.data);
                    let treeData = [];
                    for (let x in list) {
                        treeData.push(this.configList(list[x]))
                    }
                    this.setState({
                        permissionTreeData: treeData,
                    });
                }
            });
    }

    configList(item) {
        if (!item.childs || item.childs.length === 0) {
            return {
                title: item.name,
                value: item.id,
                key: item.id,
            };

        } else {
            let child = [];
            for (let i = 0; i < item.childs.length; i++) {
                let data = item.childs[i];
                child.push(this.configList(data));
            }
            return {
                title: item.name,
                value: item.id,
                key: item.id,
                children: child
            };
        }


    }

    //删除角色
    deleteRole(id) {
        let data = {roleId: id};
        HttpClient.query(window.MODULE_PARKING_INFO + `/centerConsole/info/deleteRole`, "POST", JSON.stringify(data), (d, type) => {
            if (type == HttpClient.requestSuccess) {
                message.success("删除成功");
                if (this.state.currentCount === 1 && this.state.pageNum > 1) {//最后一条
                    this.state.pageNum -= 1;
                }
                this.loadData();
            }
        });
    }

    //查询条件
    searchChange(name, e) {
        let obj = this.state.searchParams;
        obj[name] = e.target.value;
        this.setState({searchParams: obj});
    }

    // 搜索
    handleSearch() {
        const params = this.state.searchParams;
        this.setState({
            pageNum: 1,
            search: params,
        });
        this.loadData(1, this.state.pageSize, params);
    }

    // 重置
    handleReset() {
        this.setState({
            pageNum: 1,
            pageSize: 10,
            searchParams: {},
            search: {}
        });
        this.loadData(1, 10, {});

    }

    checkModal() {
        if (!this.state.submitLoading) {
            this.state.submitLoading = true;
            this.props.form.validateFields((err, fieldsValue) => {
                if (!err) {
                    if (this.state.modalType == 0) {//新建
                        let data = {
                            ...fieldsValue,
                            'rolePermissionIds': fieldsValue['rolePermissionIds'].join(','),
                        };
                        HttpClient.query(window.MODULE_PARKING_INFO + `/centerConsole/info/addRole`, "POST", JSON.stringify(data), (d, type) => {
                            this.state.submitLoading = false;
                            if (type == HttpClient.requestSuccess) {
                                this.setState({
                                    visible: false,
                                });
                                message.success("新建成功");
                                this.props.form.resetFields();
                                this.loadData();
                            }
                        });
                    } else {
                        let data = {
                            ...fieldsValue,
                            'roleId': this.state.modalRoleId,
                            'rolePermissionIds': fieldsValue['rolePermissionIds'].join(','),
                        };
                        HttpClient.query(window.MODULE_PARKING_INFO + `/centerConsole/info/updateRole`, "POST", JSON.stringify(data), (d, type) => {
                            this.state.submitLoading = false;
                            if (type == HttpClient.requestSuccess) {
                                this.setState({
                                    visible: false,
                                });
                                message.success("修改成功");
                                this.props.form.resetFields();
                                this.loadData();
                            }
                        });

                    }
                } else {
                    this.state.submitLoading = false;
                }
            });
        }
    }

    showModal(typeId, item = {}) {
        this.setState({
            visible: true,//modal
            modalType: typeId,
            modalRoleId: item.id,
            modalRoleName: item.name,//角色名称
            modalRolePermission: item && item.permissionIds ? item.permissionIds.split(',') : [],//权限信息_.toString(item.permissionIds).split(',')||[]
        });
    }

    hideModal() {
        this.props.form.resetFields();
        this.setState({
            visible: false
        })
    }

    // 分页
    onPageChange(page, pageSize) {
        this.setState({
            pageNum: page,
            pageSize: pageSize
        });
        this.loadData(page, pageSize);
    }

    // 切换页面条数
    onShowSizeChange(page, pageSize) {
        this.setState({
            pageNum: 1,
            pageSize: pageSize
        });
        this.loadData(1, pageSize);
    }

    filterSelect(input, option) {
        console.log(input);
        console.log(option)
    }

    render() {
        if (!window.checkPageEnable('/RoleManage')) {
            return <Exception type='403'/>;
        }
        const {searchParams, dataList} = this.state;
        const formModalLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 20},
            },
        };
        const columns = [
            {title: '角色名称', dataIndex: 'name', key: 'name',},
            {title: '角色权限', dataIndex: 'permissionsInfo', key: 'permissionsInfo', className: 'column-permission'},
        ];
        if (window.getPerValue('roleEdit') || window.getPerValue('roleDelete')) {
            columns.push({
                title: '操作',
                key: 'choose',
                render: (item) => (
                    <span className="table-operation">
                        {window.getPerValue('roleEdit') ? <a onClick={this.showModal.bind(this, 1, item)}>编辑</a> : null}
                        {window.getPerValue('roleEdit') && window.getPerValue('roleDelete') ?
                            <span style={{color: "#E9E9E9"}}> | </span> : null}
                        {window.getPerValue('roleDelete') ? <Popconfirm
                            placement="topRight"
                            title={`你确定删除此角色吗？`}
                            onConfirm={this.deleteRole.bind(this, item.id)}
                            okText="确定"
                            cancelText="取消">
                            <a>删除</a>
                        </Popconfirm> : null}
                    </span>
                ),
            });
        }
        const {getFieldDecorator} = this.props.form;
        return (
            <div className="page">
                <div className="page-header">角色管理</div>
                <div className="page-content">
                    {/*查询表单*/}
                    <Form>
                        <Row gutter={46}>
                            <Col span={8}>
                                <FormItem label='角色名称' labelCol={{span: 5}}
                                          wrapperCol={{span: 19}}>
                                    <Input placeholder="请输入"
                                           value={searchParams.roleName}
                                           onChange={this.searchChange.bind(this, 'roleName')}/>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem>
                                    <Button type="primary" className="author_search_button"
                                            onClick={this.handleSearch.bind(this)}>查询</Button>
                                    <Button className="author_search_button"
                                            onClick={this.handleReset.bind(this)}>重置</Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    {/*新建*/}
                    {window.getPerValue('roleEdit') ?
                        <div style={{height: 32, marginBottom: "16px"}}>
                            <Button type="primary" className="author_button_add"
                                    onClick={this.showModal.bind(this, 0)}>
                                <Icon type="plus"/>
                                新建角色
                            </Button>
                        </div> : null}
                    {/*table*/}
                    <Spin tip="加载中.." spinning={this.state.loading}>
                        <Table
                            className="roleManage_table"
                            rowKey='id'
                            columns={columns}
                            dataSource={dataList}
                            pagination={false}
                        />
                        {dataList && dataList.length > 0 ? (
                            <div>
                                <div className="partnerList_table_total">共{this.state.total}条</div>
                                <Pagination
                                    className="partnerList_table_pagination"
                                    showSizeChanger
                                    showQuickJumper
                                    total={this.state.total}
                                    current={this.state.pageNum}
                                    pageSize={this.state.pageSize}
                                    onChange={this.onPageChange.bind(this)}
                                    onShowSizeChange={this.onShowSizeChange.bind(this)}
                                />
                                <div style={{clear: 'both'}}/>
                            </div>
                        ) : ''}
                    </Spin>
                    {/*modal*/}
                    <Modal
                        title={this.state.modalType === 1 ? "编辑" : "新建"}
                        visible={this.state.visible}
                        onOk={this.checkModal.bind(this)}
                        onCancel={this.hideModal.bind(this)}
                        maskClosable={false}
                        destroyOnClose
                        okText="确 定"
                        cancelText="取 消">
                        <div style={{padding: "24px"}}>
                            <Form>
                                <FormItem label="角色名称" {...formModalLayout} required={true}>
                                    {getFieldDecorator(`roleName`, {
                                        initialValue: this.state.modalRoleName || "",
                                        rules: [{
                                            required: true,
                                            whitespace: true,
                                            message: '请输入角色名称',
                                        }, {
                                            max: 20,
                                            message: '输入内容需在20字以内',
                                        }],
                                    })(
                                        <Input placeholder="请输入"/>
                                    )}
                                </FormItem>
                                <FormItem label="角色权限" {...formModalLayout} required={true}>
                                    {getFieldDecorator(`rolePermissionIds`, {
                                        initialValue: this.state.modalRolePermission || "",
                                        rules: [{
                                            required: true,
                                            message: '请选择角色权限',
                                        }],
                                    })(
                                        <TreeSelect
                                            treeCheckable={true}
                                            getPopupContainer={triggerNode => triggerNode.parentNode}
                                            showCheckedStrategy={SHOW_PARENT}
                                            dropdownStyle={{maxHeight: 300, overflow: 'auto'}}
                                            treeData={this.state.permissionTreeData}
                                            placeholder="请选择"
                                            allowClear
                                            showSearch
                                            treeNodeFilterProp='title'
                                        />
                                    )}
                                </FormItem>
                            </Form>
                        </div>
                    </Modal>
                </div>
            </div>
        )
    }

}

export default Form.create()(RoleManage);

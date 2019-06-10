import React, {Component} from 'react';
import {
    message,
    Modal,
    Form,
    Row,
    Col,
    Button,
    Input,
    Icon,
    Spin,
    Table,
    Pagination,
    Popconfirm,
} from 'antd';
import {HttpClient} from '../../common/HttpClient.jsx';
import DepartmentModal from './Components/DepartmentModal.jsx';
import PersonModal from './Components/PersonModal.jsx';
//css
import './Style/Authorization.css';
import Exception from "../../components/Exception";
import _ from 'lodash';

const FormItem = Form.Item;


//用户管理
class UserManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchParams: {
                departmentName: '',
                userName: "",
                mobileNumber: "",
            },
            search: {},
            pageNum: 1,
            pageSize: 10,
            currentCount: 0,
            total: 0,
            dataList: [],
            expandedRowKeys: [],
            loading: true,
            departmentModalType: 0,//0新建1修改
            modalDepartmentName: "",
            personModalType: 0,//0新建1修改
            personModalData: {},
            departmentVisible: false,//modal
            personVisible: false,//modal
        }
    }


    componentWillMount() {

    }

    componentDidMount() {
        if (window.checkPageEnable('/UserManage')) {
            this.loadData();
        }
    }

    loadData(page, size, searchData) {
        this.setState({
            loading: true,
        });
        const {search, pageNum, pageSize} = this.state;
        let data = searchData ? searchData : search;
        data.pageNum = page ? page : pageNum;
        data.pageSize = size ? size : pageSize;
        HttpClient.query(window.MODULE_PARKING_INFO + `/centerConsole/info/departmentList`, "GET", data, this.configData.bind(this));
    }

    /**
     * 接口请求回调
     * @param d
     * @param type
     */
    configData(d, type) {
        if (type == HttpClient.requestSuccess) {
            //成功-------在这里做你的数据处理，需要提示的自己加
            if (this.state.searchParams.userName || this.state.searchParams.mobileNumber) {//展开
                let rowKeys = [];
                d.data.list.map(item => {
                    rowKeys.push(item.id)
                });
                this.setState({
                    loading: false,
                    total: d.data.total,
                    currentCount: d.data.size,
                    dataList: d.data.list,
                    expandedRowKeys: rowKeys
                })
            } else {
                this.setState({
                    loading: false,
                    total: d.data.total,
                    dataList: d.data.list,
                })
            }
        } else {
            //失败----做除了报错之外的操作
            this.setState({
                loading: false,
            })
        }
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
            expandedRowKeys: []
        });
        this.loadData(1, this.state.pageSize, params);
    }

    // 重置
    handleReset() {
        this.setState({
            pageNum: 1,
            pageSize: 10,
            searchParams: {},
            search: {},
            expandedRowKeys: []
        });
        this.loadData(1, 10, {});
    }

    onExpandChange(expanded, record) {
        let rowKeys = this.state.expandedRowKeys;
        let index = _.findIndex(rowKeys, function (o) {
            return o == record.id;
        });
        if (index < 0) {
            rowKeys.push(record.id)
        } else {
            rowKeys.splice(index, 1);
        }
        this.setState({
            expandedRowKeys: rowKeys
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

    //部门modal
    showModalDepartment(typeId, id, name) {
        this.setState({
            departmentVisible: true,//modal
            departmentModalType: typeId,
            modalDepartmentId: id,
            modalDepartmentName: name
        })
    }

    deleteDepartment(id) {
        let data = {departmentId: id};
        HttpClient.query(window.MODULE_PARKING_INFO + `/centerConsole/info/deleteDepartment`, "POST", JSON.stringify(data), (d, type) => {
            if (type == HttpClient.requestSuccess) {
                let rowKeys = this.state.expandedRowKeys;
                let index = _.findIndex(rowKeys, function (o) {
                    return o == id;
                });
                if (index >= 0) {
                    rowKeys.splice(index, 1);
                }
                this.setState({
                    expandedRowKeys: rowKeys,
                });
                message.success("删除成功");
                if (this.state.currentCount === 1 && this.state.pageNum > 1) {//最后一条
                    this.state.pageNum -= 1;
                }
                this.loadData();
            }
        });
    }

    checkModal() {
        this.setState({
            personVisible: false,
            departmentVisible: false,
        });
        this.loadData();
    }

    //人员modal
    showModalPerson(typeId, userId, e) {
        if (typeId > 0) {
            HttpClient.query(window.MODULE_PARKING_INFO + `/centerConsole/info/queryAdmin`, "GET", {adminId: userId}, (d, type) => {
                if (type == HttpClient.requestSuccess) {
                    //成功-------在这里做你的数据处理，需要提示的自己加
                    this.setState({
                        personVisible: true,//modal
                        personModalType: typeId,
                        personModalData: d.data || {},
                    })
                }
            });
        } else {
            this.setState({
                personVisible: true,//modal
                personModalType: typeId,
                personModalData: {},
            })
        }

    }

    /**
     * 删除人员
     * @param userId
     */
    deletePerson(id, e) {
        e.stopPropagation();
        let data = {userId: id};
        HttpClient.query(window.MODULE_PARKING_INFO + `/centerConsole/info/deleteUser`, "POST", JSON.stringify(data), (d, type) => {
            if (type == HttpClient.requestSuccess) {
                message.success("删除成功");
                this.loadData();
            }
        });
    }

    hideModal() {
        this.setState({
            departmentVisible: false,//modal
            personVisible: false,//modal
        })
    }

    render() {
        if (!window.checkPageEnable('/UserManage')) {
            return <Exception type='403'/>;
        }
        const {searchParams, dataList} = this.state;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19}
        };
        const expandedRowRender = (row) => {
            const columns = [
                {
                    title: '人员名称',
                    dataIndex: 'userName',
                    key: 'userName',
                    className: 'column-userName',
                    render: (value) => {
                        return <div className="column-userName">{value}</div>
                    }
                },
                {title: '手机号', dataIndex: 'userPhone', key: 'userPhone',className: 'column-mobile'},
                {title: '角色', dataIndex: 'roleName', key: 'roleName'},
            ];
            if (window.getPerValue('adminEdit') || window.getPerValue('adminDelete')) {
                columns.push({
                    title: '',
                    key: 'choose',
                    className: 'column-choose',
                    render: (item) => (
                        <div className="table-operation">
                            {window.getPerValue('adminEdit') ?
                                <a onClick={this.showModalPerson.bind(this, 1, item.userId)}>编辑</a> : null}
                            {window.getPerValue('adminEdit') && window.getPerValue('adminDelete') ?
                                <span style={{color: "#E9E9E9"}}> | </span> : null}
                            {window.getPerValue('adminDelete') ? <Popconfirm
                                placement="topRight"
                                title={`你确定删除此人员吗？`}
                                onConfirm={this.deletePerson.bind(this, item.userId)}
                                okText="确定"
                                cancelText="取消">
                                <a>删除</a>
                            </Popconfirm> : null
                            }
                        </div>
                    ),
                })
            }
            const data = row.personList;
            return (
                <Table
                    rowKey='userId'
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                />
            );
        };
        const columns = [{
            title: '部门名称',
            dataIndex: 'departmentName',
            className: 'column-departmentName',
        }, {
            title: '人数',
            dataIndex: 'personNumber',
            className: 'column-personNumber',
        }];
        if (window.getPerValue('departmentEdit') || window.getPerValue('departmentDelete')) {
            columns.push({
                title: '操作',
                key: 'action',
                className: 'column-action',
                render: (value, row) => {
                    return row.personList.length > 0 ?
                        <div className="table-operation">
                            {window.getPerValue('departmentEdit') ?
                                <a onClick={this.showModalDepartment.bind(this, 1, row.id, row.departmentName)}>编辑</a> :
                                <span>-</span>}
                        </div> :
                        <div className="table-operation">
                            {window.getPerValue('departmentEdit') ?
                                <a onClick={this.showModalDepartment.bind(this, 1, row.id, row.departmentName)}>编辑</a> : null}
                            {window.getPerValue('departmentEdit') && window.getPerValue('departmentDelete') ?
                                <span style={{color: "#E9E9E9"}}> | </span> : null}
                            {window.getPerValue('departmentDelete') ? <Popconfirm placement="topRight"
                                                                           title={`你确定删除此部门吗？`}
                                                                           onConfirm={this.deleteDepartment.bind(this, row.id)}
                                                                           okText="确定"
                                                                           cancelText="取消">
                                <a>删除</a>
                            </Popconfirm> : null}
                        </div>
                }
            });
        }
        return (
            <div className="page">
                <div className="page-header">用户管理</div>
                <div className="page-content">
                    {/*查询表单*/}
                    <Form>
                        <Row gutter={46}>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label='部门名称'>
                                    <Input placeholder="请输入" value={searchParams.departmentName}
                                           onChange={this.searchChange.bind(this, 'departmentName')}/>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label='人员名称'>

                                    <Input placeholder="请输入" value={searchParams.userName}
                                           onChange={this.searchChange.bind(this, 'userName')}/>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label='手机号'>
                                    <Input placeholder="请输入" value={searchParams.mobileNumber}
                                           onChange={this.searchChange.bind(this, 'mobileNumber')}/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={46}>
                            <Col span={8}/>
                            <Col span={8}/>
                            <Col span={8} style={{textAlign: 'right'}}>
                                <FormItem>
                                    <Button type="primary" className="author_search_button"
                                            onClick={this.handleSearch.bind(this)}>查询</Button>
                                    <Button style={{marginLeft: 8}} className="author_search_button"
                                            onClick={this.handleReset.bind(this)}>重置</Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    {/*新建*/}
                    <div style={{marginBottom: "16px"}}>
                        {window.getPerValue('departmentEdit') ?
                            <Button type="primary" className="author_button_add"
                                    onClick={this.showModalDepartment.bind(this, 0)}>
                                <Icon type="plus"/>
                                新建部门
                            </Button> : null}
                        {window.getPerValue('adminEdit') ?
                            <Button type="primary" className="author_button_add"
                                    onClick={this.showModalPerson.bind(this, 0)}>
                                <Icon type="plus"/>
                                新建人员
                            </Button> : null}
                    </div>
                    {/*table*/}
                    <Spin tip="加载中.." spinning={this.state.loading}>
                        <Table
                            className="userManage_table"
                            rowKey="id"
                            columns={columns}
                            expandedRowRender={expandedRowRender}
                            dataSource={dataList}
                            // expandRowByClick={true}
                            expandedRowKeys={this.state.expandedRowKeys}
                            onExpand={this.onExpandChange.bind(this)}
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
                    {
                        window.getPerValue('departmentEdit') && (
                            <DepartmentModal type={this.state.departmentModalType} visible={this.state.departmentVisible}
                                             departmentId={this.state.modalDepartmentId}
                                             departmentName={this.state.modalDepartmentName}
                                             onOk={this.checkModal.bind(this)} onCancel={this.hideModal.bind(this)}/>
                        )
                    }
                    {
                        window.getPerValue('adminEdit') && (
                            <PersonModal type={this.state.personModalType} visible={this.state.personVisible}
                                         dataResource={this.state.personModalData}
                                         onOk={this.checkModal.bind(this)} onCancel={this.hideModal.bind(this)}/>
                        )
                    }
                </div>
            </div>
        )
    }


}

export default Form.create()(UserManage);

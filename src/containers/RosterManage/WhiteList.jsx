import React, {Component, Fragment} from 'react';
// import moment from "moment/moment";
import {
    Form,
    Modal,
    Input,
    Select,
    message,
    Spin,
    Row,
    Col,
    Button,
    Table,
    Pagination,
    Icon,
    Popconfirm
} from "antd/lib/index";
import {HttpClient} from '../../common/HttpClient.jsx';
import WhiteListModal from './Components/WhiteListModal.jsx';
import Exception from "../../components/Exception";
import './Style/Roster.css';//css

const FormItem = Form.Item;

export default class WhiteList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            importing: false,
            pageNum: 1,
            pageSize: 10,
            total: 0,
            currentCount: 0,
            searchParams: {},
            search: {},
            dataList: [],
            createVisible: false,
            editVisible: false,
            modalData: {},
        }
    }


    componentWillMount () {

    }

    componentDidMount () {
        this.loadData();
    }

    loadData (page, size, searchData) {
        this.setState({
            loading: true,
            importing: false
        });
        const { pageNum, pageSize, search } = this.state;
        let data = searchData ? searchData : search;
        data.pageNum = page ? page : pageNum;
        data.pageSize = size ? size : pageSize;
        console.log(data);
        HttpClient.query(window.MODULE_PARKING_INFO + `/centerConsole/info/coupons`, "GET", data, this.configData.bind(this));
    }

    /**
     * 接口请求回调
     * @param d
     * @param type
     */
    configData (d, type) {
        if (type == HttpClient.requestSuccess) {
            //成功-------在这里做你的数据处理，需要提示的自己加
            this.setState({
                loading: false,
                total: d.data.total,
                dataList: d.data.list,
                currentCount: d.data.size,
            })

        } else {
            //失败----做除了报错之外的操作
            this.setState({
                loading: false,
            })
        }
    }

    //modal
    showModal (index, data) {
        switch (index) {//0-新建；1-编辑
            case 0:
                this.setState({
                    createVisible: true,
                    editVisible: false
                });
                break;
            case 1:
                this.setState({
                    createVisible: false,
                    editVisible: true,
                    modalData: data
                });
                break;
            default:
                break;
        }
    }

    checkModal () {
        this.setState({
            createVisible: false,
            editVisible: false,
        });
        this.loadData();
    }

    hideModal () {
        this.setState({
            createVisible: false,//modal
            editVisible: false,//modal
        })
    }

    //查询条件
    searchChange (name, e) {
        let obj = this.state.searchParams;
        obj[name] = e.target.value;
        this.setState({ searchParams: obj });
    }

    // 搜索
    handleSearch () {
        const params = this.state.searchParams;
        this.setState({
            pageNum: 1,
            search: params
        });
        this.loadData(1, this.state.pageSize, params);
    }

    // 重置
    handleReset () {
        this.setState({
            pageNum: 1,
            pageSize: 10,
            searchParams: {},
            search: {},
        });
        this.loadData(1, 10, {});
    }

    //批量导入
    batchUpload () {
        document.getElementById('upload-input').click();
    }

    inputUpload (e) {
        this.setState({
            loading: true,
            importing: true
        });
        let file = e.target.files[0];
        let formData = new FormData();
        formData.append('files', file);
        HttpClient.query(window.MODULE_PARKING_INFO + `/centerConsole/info/importCoupons`, "POST", formData, (d, type) => {
            this.setState({
                loading: false
            });
            if (type == HttpClient.requestSuccess) {
                message.success(d.data);
                this.loadData(1);
            }
            document.getElementById('upload-input').value = null;
        }, false, false);
    }

    // 分页
    onPageChange (page, pageSize) {
        this.setState({
            pageNum: page,
            pageSize: pageSize
        });
        this.loadData(page, pageSize);
    }

    // 切换页面条数
    onShowSizeChange (page, pageSize) {
        this.setState({
            pageNum: 1,
            pageSize: pageSize
        });
        this.loadData(1, pageSize);
    }

    //删除
    deletePerson (userId) {
        HttpClient.query(window.MODULE_PARKING_INFO + `/centerConsole/info/coupons/${userId}`, "DELETE", {}, (d, type) => {
            if (type == HttpClient.requestSuccess) {
                message.success(d.data);
                if (this.state.currentCount === 1 && this.state.pageNum > 1) {//最后一条
                    this.state.pageNum -= 1;
                }
                this.loadData();
            }
        });
    }


    render () {
        if (!window.checkPageEnable('/WhiteList')) {
            return <Exception type='403'/>;
        }
        const { searchParams, dataList, loading, total, pageNum, pageSize } = this.state;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
        };
        const columns = [{
            title: '姓名',
            dataIndex: 'userName',
            width: 150,
            fixed: "left"
        }, {
            title: '手机号',
            width: 150,
            dataIndex: 'mobile',
        }, {
            title: '车牌号',
            width: 150,
            dataIndex: 'plateNumber',
        }, {
            title: '优惠路段',
            className: 'column-sectionName',
            dataIndex: 'preferentialSection',
            render: (value) => {
                let roads = [];
                value.map(item => {
                    roads.push(item.parkingName)
                });
                roads = roads.join('；');
                return <div style={{ width: 330 }}>{roads}</div>
            }
        }, {
            title: '优惠金额',
            sorter: (a, b) => a.couponAmount - b.couponAmount,
            dataIndex: 'couponAmount',
            width: 150,
            render: (value, row) => {
                return <span>{row.couponType === 1 ? value + "元" : '全免'}</span>
            }
        }, {
            title: '生效时间范围',
            className: 'column-range-time',
            // dataIndex: 'effectiveTime',
            render: (value) => {
                if (value.timeType == 0) {
                    return <span>{value.effectiveTime} - {value.invalidTime}</span>
                } else {//长期生效
                    return <span>长期生效</span>
                }

            }
        }];
        if (window.getPerValue('whiteListAddEdit') || window.getPerValue('whiteListDelete')) {
            columns.push({
                key: 'action',
                title: '操作',
                width: 120,
                fixed: "right",
                render: (value, row) => {
                    return <div>
                        {window.getPerValue('whiteListAddEdit') ?
                            <a onClick={this.showModal.bind(this, 1, row)}>编辑</a> : null}
                        {window.getPerValue('whiteListAddEdit') && window.getPerValue('whiteListDelete') ?
                            <span style={{ color: "#E9E9E9" }}> | </span> : null}
                        {window.getPerValue('whiteListDelete') ?
                            <Popconfirm placement="topRight"
                                        title={`你确定将此人剔除优惠名单吗？`}
                                        onConfirm={this.deletePerson.bind(this, row.nameId)}
                                        okText="确定"
                                        cancelText="取消">
                                <a>删除</a>
                            </Popconfirm> : null}
                    </div>
                }
            });
        }
        return (
            <div className='page'>
                <div className='page-header'>
                    优惠名单
                </div>
                <div className='page-content'>
                    {/*查询表单*/}
                    <Form>
                        <Row gutter={46}>
                            <Col span={8}>
                                <FormItem label='姓名' labelCol={{ span: 3 }}
                                          wrapperCol={{ span: 19 }}>
                                    <Input placeholder="请输入" value={searchParams.userName}
                                           onChange={this.searchChange.bind(this, 'userName')}/>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label='手机号'>
                                    <Input placeholder="请输入" value={searchParams.mobile}
                                           onChange={this.searchChange.bind(this, 'mobile')}/>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label='车牌号'>
                                    <Input placeholder="请输入" value={searchParams.plateNumber}
                                           onChange={this.searchChange.bind(this, 'plateNumber')}/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={46}>
                            <Col span={8}/>
                            <Col span={8}/>
                            <Col span={8} style={{ textAlign: 'right' }}>
                                <FormItem>
                                    <Button type="primary" className="roster_search_button"
                                            onClick={this.handleSearch.bind(this)}>查询</Button>
                                    <Button style={{ marginLeft: 8 }} className="roster_search_button"
                                            onClick={this.handleReset.bind(this)}>重置</Button>
                                </FormItem>
                            </Col>
                        </Row>
                        {/*新建*/}
                        <Row style={{ marginBottom: "16px" }}>
                            <Col span={12}>
                                {window.getPerValue('whiteListAddEdit') ?
                                    <Button type="primary" className="roster_button_add"
                                            onClick={this.showModal.bind(this, 0)}>
                                        <Icon type="plus"/>
                                        新建
                                    </Button> : null}
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <a target="_blank"
                                   href={HttpClient.ClientHost + window.MODULE_PARKING_INFO + '/centerConsole/getTemplateFile?fileType=2' + `&token=Bearer ${window.customCookie.get('access_token')}`}>
                                    <Button className="roster_button_add">
                                        下载模板
                                    </Button>
                                </a>
                                {window.getPerValue('whiteListAddEdit') ?
                                    <Button type="primary" style={{ marginLeft: 12 }}
                                            className="roster_button_add"
                                            onClick={this.batchUpload.bind(this)}>
                                        批量导入
                                    </Button> : null}
                                <input id='upload-input' onChange={this.inputUpload.bind(this)}
                                       type='file' style={{ display: 'none' }}
                                       accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
                                <a target="_blank"
                                   href={HttpClient.ClientHost + window.MODULE_PARKING_INFO + `/centerConsole/info/exportCoupons?token=Bearer ${window.customCookie.get('access_token')}`}>
                                    <Button type="primary" style={{ marginLeft: 12 }} className="roster_button_add">
                                        导出名单
                                    </Button>
                                </a>
                            </Col>
                        </Row>
                    </Form>
                    {/*表格*/}
                    <Spin tip={this.state.importing ? "导入中.." : "加载中.."} spinning={loading}>
                        <Table
                            rowKey="nameId"
                            columns={columns}
                            scroll={{ x: '130%' }}
                            dataSource={dataList}
                            pagination={false}
                        />
                        {/*分页*/}
                        {dataList.length > 0 ? (
                            <div>
                                <div className="table_pagination_total">共{total}条</div>
                                <Pagination
                                    className="table_pagination"
                                    showSizeChanger
                                    showQuickJumper
                                    total={total}
                                    current={pageNum}
                                    pageSize={pageSize}
                                    onChange={this.onPageChange.bind(this)}
                                    onShowSizeChange={this.onShowSizeChange.bind(this)}
                                />
                                <div style={{ clear: 'both' }}>
                                </div>
                            </div>
                        ) : ''}
                    </Spin>
                    {/*modal*/}
                    {
                        window.getPerValue('whiteListAddEdit') && (
                            <Fragment>
                                <WhiteListModal type={0} visible={this.state.createVisible} data={{}}
                                                onOk={this.checkModal.bind(this)} onCancel={this.hideModal.bind(this)}/>
                                <WhiteListModal type={1} visible={this.state.editVisible} data={this.state.modalData}
                                                onOk={this.checkModal.bind(this)} onCancel={this.hideModal.bind(this)}/>
                            </Fragment>
                        )
                    }
                </div>
            </div>
        )
    }


}

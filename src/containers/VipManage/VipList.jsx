import React, {Component} from 'react';
import {Form, Input, Spin, Row, Col, Button, Table, Pagination, Select} from "antd/lib/index";
import {HttpClient} from '../../common/HttpClient.jsx';
import Exception from "../../components/Exception";
import './Style/Vip.css';//css

const FormItem = Form.Item;
const Option = Select.Option;

export default class VipList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0,
            currentCount: 0,
            searchParams: {},
            search: {},
            dataList: [],
            gradeList: []
        }
    }


    componentWillMount() {

    }

    componentDidMount() {
        this.loadData();
        HttpClient.query(window.MODULE_PARKING_PERSON_INFO + `/memberGrade/list`, "GET", null, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                //成功-------在这里做你的数据处理，需要提示的自己加
                this.setState({
                    gradeList: d.data,
                })
            }
        });
    }

    loadData(page, size, searchData) {
        this.setState({
            loading: true,
        });
        const {pageNum, pageSize, search} = this.state;
        let data = searchData ? searchData : search;
        data.pageNum = page ? page : pageNum;
        data.pageSize = size ? size : pageSize;
        HttpClient.query(window.MODULE_PARKING_PERSON_INFO + `/member/vip`, "GET", data, this.configData.bind(this));
    }

    /**
     * 接口请求回调
     * @param d
     * @param type
     */
    configData(d, type) {
        if (type === HttpClient.requestSuccess) {
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


    //查询条件
    searchChange(name, e) {
        let obj = this.state.searchParams;
        obj[name] = e.target.value;
        this.setState({searchParams: obj});
    }

    //查询条件
    searchSelectChange(name, value) {
        let obj = this.state.searchParams;
        obj[name] = value;
        this.setState({searchParams: obj});
    }

    // 搜索
    handleSearch() {
        const params = this.state.searchParams;
        this.setState({
            pageNum: 1,
            search: params
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
        });
        this.loadData(1, 10, {});
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

    detailClick(id) {
        window.location.hash = `/VipManage/VipList/VipDetail?id=${id}`
    }

    render() {
        if (!window.checkPageEnable('/VipList')) {
            return <Exception type='403'/>;
        }
        const {searchParams, dataList, loading, total, pageNum, pageSize, gradeList} = this.state;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19}
        };
        const columns = [{
            title: '姓名',
            className: "column-content-inspection",
            dataIndex: 'name',
            render: (value, row) => (
                <div>{window.getPerValue('vipDetail') ?
                    <span className="cursor-pointer" style={{color: '#1890FF'}}
                          onClick={this.detailClick.bind(this, row.id)}>{value}</span> :
                    <span>{value}</span>}
                </div>)
        }, {
            title: '电话',
            className: 'column-mobile',
            dataIndex: 'mobile',
        }, {
            title: '会员ID',
            className: "column-content-inspection",
            dataIndex: 'memberId',
        }, {
            title: '会员等级',
            className: "column-action-short",
            dataIndex: 'memberGradeName',
        }, {
            title: '当前积分',
            className: "column-action-short",
            dataIndex: 'memberScore',
        }, {
            title: '钱包余额',
            sorter: (a, b) => a.walletBalance - b.walletBalance,
            className: "column-content-price",
            dataIndex: 'walletBalance',
            render: (value) => {
                return <span>{value + " 元"}</span>
            }
        }, {
            title: '生日',
            className: 'column-content-inspection',
            dataIndex: 'birthday',
        }, {
            title: '性别',
            className: "column-action-short",
            dataIndex: 'sex',
        }];
        return (
            <div className='page'>
                <div className='page-header'>
                    会员列表
                </div>
                <div className='page-content'>
                    {/*查询表单*/}
                    <Form>
                        <Row gutter={46}>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label='会员ID'>
                                    <Input placeholder="请输入" value={searchParams.memberId}
                                           onChange={this.searchChange.bind(this, 'memberId')}/>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label='会员电话'>
                                    <Input placeholder="请输入" value={searchParams.mobile}
                                           onChange={this.searchChange.bind(this, 'mobile')}/>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label='会员等级'>
                                    <Select
                                        showSearch
                                        allowClear
                                        placeholder="请选择"
                                        optionFilterProp="children"
                                        value={searchParams.userMemberGradeId}
                                        onChange={this.searchSelectChange.bind(this, 'userMemberGradeId')}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {(gradeList || []).map((item, i) => {
                                            return <Option key={i} value={item.id}>{item.memberGradeName}</Option>
                                        })}
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={46}>
                            <Col span={8}/>
                            <Col span={8}/>
                            <Col span={8} style={{textAlign: 'right'}}>
                                <FormItem>
                                    <Button type="primary" className="roster_search_button"
                                            onClick={this.handleSearch.bind(this)}>查询</Button>
                                    <Button style={{marginLeft: 8}} className="roster_search_button"
                                            onClick={this.handleReset.bind(this)}>重置</Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    {/*表格*/}
                    <Spin tip="加载中.." spinning={loading}>
                        <Table
                            rowKey="id"
                            columns={columns}
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
                                <div style={{clear: 'both'}}>
                                </div>
                            </div>
                        ) : ''}
                    </Spin>
                </div>
            </div>
        )
    }


}
import React, {Component} from 'react';
import {Table, Pagination, Card, Input, Tag, message} from 'antd';
import {react} from  'react.eval';
import {custom} from "../../../../common/SystemStyle";
import {HttpClient} from '../../../../common/HttpClient.jsx';
import {Global} from "../../../../common/SystemFunction";
const Search = Input.Search;
const CheckableTag = Tag.CheckableTag;

const searchBarStyle = {
    width: '286px',
    height: '32px',
    borderRadius: '4px',
};

export default class SectionSpaceCard extends Component {
    constructor (props) {
        super(props);
        react(this);
        message.config({
            duration: 1
        });


        this.state = {
            pointNameList: ['全部'],
            pointObjectList: [],
            currentPoint: undefined,
            parkingSpaceNo: '',
            currentPage: 1,
            limit: 10,
            spaceList: [],
            total: 0,
            isLoading: false
        }
    }


    componentWillMount () {

    }

    componentDidMount () {
        this.queryParkingPointList();
    }

    //获取停车点
    queryParkingPointList () {
        this.setState({
            isLoading: true
        });
        let id = 1001;
        if (HttpClient.REQUEST === "truth") {
            id = this.props.parkId;
        }
        HttpClient.query(`/parking-resource/admin/resource/parking/point/` + id, "GET", null, this.fetchParkingPointList.bind(this));
    }

    fetchParkingPointList (e, type) {
        if (type === HttpClient.requestSuccess) {
            this.state.pointNameList = [];
            this.state.pointObjectList = [];
            e.data.map(point => {
                this.state.pointNameList.push(point.parkingPointName);
                this.state.pointObjectList.push(point);
            });
            //加载车位列表
            this.queryParkingSpaceList();
        } else {
            //失败停止菊花
            this.setState({
                isLoading: false
            });
        }
    }

    //获取停车点下的车位列表
    queryParkingSpaceList () {
        let params = {
            parkingId: this.props.parkId,
            currentPage: this.state.currentPage,
            limit: this.state.limit
        };
        //筛选
        if (this.state.currentPoint !== undefined) {
            params.parkingPointId = this.state.currentPoint.id;
        }
        //搜索
        if (this.state.parkingSpaceNo.length > 0) {
            params.parkingSpaceNo = this.state.parkingSpaceNo;
        }
        //请求
        HttpClient.query(`/parking-resource/admin/resource/parking/space`, "GET", params, this.fetchParkingSpaceList.bind(this));

    }

    fetchParkingSpaceList (e, type) {
        this.setState({
            isLoading: false
        });
        if (type === HttpClient.requestSuccess) {
            this.setState({
                spaceList: e.data.returnList,
                total: e.data.totalCount
            });
        }
    }


    //停车点选择
    handleParkingChange (tag, checked) {
        console.log(checked);
        this.state.parkingSpaceNo = '';
        if (tag === "全部") {
            this.state.currentPoint = undefined;
            this.setState({
                isLoading: true
            });
        } else {
            let selectPoint = this.state.pointObjectList.find(item => {
                return item.parkingPointName === tag;
            });
            this.state.currentPoint = Global.deepCopy(selectPoint);
            this.setState({
                isLoading: true
            });
        }
        this.state.currentPage = 1;
        this.queryParkingSpaceList();
    }

    checkStatusRender (tag) {
        if (this.state.currentPoint === undefined) {
            if (tag === "全部") {
                return true;
            }
        } else {
            if (this.state.currentPoint.parkingPointName === tag) {
                return true;
            }
        }
        return false;
    }

    /*泊位表格*/
    onPageChange (page, pageSize) {
        this.state.currentPage = page;
        this.state.limit = pageSize;
        this.setState({
            isLoading: true
        });
        this.queryParkingSpaceList();
    }

    onShowSizeChange (page, pageSize) {
        this.state.currentPage = 1;
        this.state.limit = pageSize;
        this.setState({
            isLoading: true
        });
        this.queryParkingSpaceList();
    };

    render () {
        const columns = [{
            title: '泊位号',
            dataIndex: 'parkingSpaceNo'
        }, {
            title: '所属停车点',
            dataIndex: 'parkingPointName'
        }, {
            title: '泊位状态',
            dataIndex: 'parkingSpaceStatusName',
            render: (text, row) => text || '--'
        }];

        return (
            <Card
                title='旗下泊位详情'
                extra={
                    <Search
                        placeholder="请输入泊位号"
                        onSearch={(value => {
                            this.setState({
                                isLoading: false
                            });
                            this.state.parkingSpaceNo = value;
                            this.state.currentPage = 1;
                            this.queryParkingSpaceList();
                        })}
                        style={searchBarStyle}
                    />}
            >
                {/*选择停车点*/}
                <div style={{ marginBottom: "24px", display: "flex" }}>
                    <div style={{
                        marginRight: 8,
                        fontSize: "14px",
                        color: "rgba(0,0,0,0.85)",
                        textAlign: "right"
                    }}>选择停车点:
                    </div>
                    <div style={{ flex: 1 }}>
                        {this.state.pointNameList.map((tag, index) => (
                            <CheckableTag
                                key={index}
                                checked={this.checkStatusRender(tag)}
                                onChange={checked => this.handleParkingChange(tag, checked)}
                            >
                                {tag}
                            </CheckableTag>
                        ))}
                    </div>
                </div>
                {/*列表*/}
                <Table
                    rowKey={data => {
                        return data.id
                    }}
                    columns={columns}
                    dataSource={this.state.spaceList}
                    pagination={false}
                    loading={this.state.isLoading}
                />
                {/*分页器*/}
                <div>
                    <div className="table_pagination_total">共{this.state.total}条</div>
                    <Pagination
                        className="table_pagination"
                        showSizeChanger
                        showQuickJumper
                        total={this.state.total}
                        current={this.state.currentPage}
                        onChange={this.onPageChange.bind(this)}
                        onShowSizeChange={this.onShowSizeChange.bind(this)}
                    />
                    <div style={custom.clear}/>
                </div>
            </Card>
        )
    }
}

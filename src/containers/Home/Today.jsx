import React, {Component} from 'react';
import {Card, Row, Col, Icon, Table} from 'antd';
import {Chart, Axis, Geom, Tooltip, Legend, Coord, Label, Guide} from 'bizcharts';
import DataSet from "@antv/data-set";
import MapofToday from './Components/MapofToday';
import {HttpClientImmidIot} from "../../common/HttpClientImmidIot";





export default class Today extends Component {
    constructor(props) {
        super(props);
        this.state = {
          firstdata:{
            a:0,
            b:0,
            c:0,
            dadas:'',
            42534:0,
          },
        data :[],
        bztdata : [],
        data2:[],
        ddtdata:[],
        numbers : [],
        };
    }

    // 组件挂载之前
    componentWillMount() {
    }

    // 组件挂载后
    componentDidMount() {
      HttpClientImmidIot.query('/today/data', 'GET', null, this.handleQueryData.bind(this));
      HttpClientImmidIot.query('/today/tabledata', 'GET', null, this.handleQueryData1.bind(this));
    }

    // 组件卸载之前
    componentWillUnmount() {
    }
    handleQueryData(d, type){
      this.setState({
          firstdata: d.data.firstdata,
      })
    }
    handleQueryData1(d, type){
      this.setState({
        data :d.data.data,
        bztdata : d.data.bztdata,
        data2:d.data.data2,
        ddtdata:d.data.ddtdata,
        numbers : d.data.numbers,
      })
    }
    render() {
        const {firstdata,data,bztdata,data2,ddtdata,numbers} = this.state;
        const columns = [{
            title: '排名',
            dataIndex: 'key',
        }, {
            title: '区域',
            dataIndex: 'name',
        }, {
            title: '消费金额',
            dataIndex: 'age',
        }, {
            title: '日涨幅',
            render: (text, record) => (
                <span style={{ color: 'gray' }}><Icon type="caret-up"
                                                      style={{ color: 'green' }}/>{record.address ? record.address : '--'} %</span>
            )
        }];

        const { DataView } = DataSet;
        const bzt = new DataView();
        bzt.source(bztdata).transform({
            type: 'percent',
            field: 'count',
            dimension: 'item',
            as: 'percent',
        });
        const bztcols = {
            percent: {
                formatter: val => {
                    val = val * 100 + '%';
                    return val;
                },
            },
        };

        const { Html } = Guide;

        const ds2 = new DataSet();
        const dv2 = ds2.createView().source(data2);
        dv2.transform({
            type: "fold",
            fields: ["路外停车"],
            // 展开字段集
            key: "city",
            // key字段
            value: "temperature" // value字段
        });
        const cols2 = {
            month: {
                range: [0, 1]
            }
        };
        const dd = new DataSet();
        const ddt = dd.createView().source(ddtdata);
        ddt.transform({
            type: 'fold',
            fields: ['red', 'blue', 'green'], // 展开字段集
            key: 'city', // key字段
            value: 'temperature', // value字段
        });
        const ddtcols = {
            month: {
                range: [0, 1],
            },
        }
        const cols3 = {
            percent: {
                formatter: val => {
                    val = val * 100 + "%";
                    return val;
                }
            }
        };
        const bijiao = (num) =>{
          const a = 400*num.money/12800.80;
          const style = {
            background:'#3AA1FF',
            width:a,
            height:25,
            float:'left',
            marginTop: 7,
            marginLeft: 11
          };
          return style;

        };
        const listItems = numbers.map((number) =>
          <Col xs={24} key={number.name}>
            <span style={{ fontSize: 14 ,float:'left',width:50}}>{number.name}</span>
            <div style={bijiao(number)}></div>
            <span style={{ fontSize: 14 ,float:'left',width:50,marginLeft:10}}>{number.money}</span>
          </Col>
        );
        return (
            <div className='page'>
                <div className='page-header'>
                    <div>仪表盘</div>
                </div>
                <div className='page-content'>
                    <Row gutter={24}>
                        <Col xs={5}>
                            <Row gutter={24}>
                                <Col xs={24}>
                                    <Card hoverable={true}>
                                        <Row gutter={24}>
                                            <Col xs={24}>
                                                <Icon type="dollar"
                                                      style={{ fontSize: '35px', color: '#08c', float: 'left' }}/>
                                                <span style={{
                                                    fontSize: 14,
                                                    float: 'left',
                                                    marginLeft: 10
                                                }}>今日消费金额(元)：</span>
                                            </Col>
                                            <Col xs={24} style={{paddingBottom:20,paddingTop:20}}>
                                                <span style={{
                                                    fontSize: 28,
                                                    color: 'red',
                                                    marginLeft: 45
                                                }}>{firstdata.a}</span>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col xs={24}>
                                    <Card hoverable={true}>
                                        <Row gutter={24}>
                                            <Col xs={24}>
                                                <Icon type="pound"
                                                      style={{ fontSize: '35px', color: '#08c', float: 'left' }}/>
                                                <span style={{
                                                    fontSize: 14,
                                                    float: 'left',
                                                    marginLeft: 10
                                                }}>今日交易次数(笔)：</span>
                                            </Col>
                                            <Col xs={24} style={{paddingBottom:20,paddingTop:20}}>
                                                <span style={{
                                                    fontSize: 28,
                                                    color: '#6B6B6B',
                                                    marginLeft: 45
                                                }}>{firstdata.c}</span>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={14}>
                            <MapofToday/>
                        </Col>
                        <Col xs={5}>
                            <Row gutter={24}>
                                <Col xs={24}>
                                    <Card hoverable={true}>
                                        <Row gutter={24}>
                                            <Col xs={24}>
                                                <Icon type="user"
                                                      style={{ fontSize: '35px', color: '#08c', float: 'left' }}/>
                                                <span style={{
                                                    fontSize: 14,
                                                    float: 'left',
                                                    marginLeft: 10
                                                }}>用户总数：</span>
                                            </Col>
                                            <Col xs={24} style={{paddingBottom:20,paddingTop:20}}>
                                                <span style={{
                                                    fontSize: 28,
                                                    color: 'red',
                                                    marginLeft: 45
                                                }}>{firstdata.b}</span>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col xs={24}>
                                    <Card hoverable={true}>
                                        <Row gutter={24}>
                                            <Col xs={24}>
                                                <Icon type="user-add"
                                                      style={{ fontSize: '35px', color: '#08c', float: 'left' }}/>
                                                <span style={{
                                                    fontSize: 14,
                                                    float: 'left',
                                                    marginLeft: 10
                                                }}>新增用户：</span>
                                            </Col>
                                            <Col xs={24} style={{paddingBottom:20,paddingTop:20}}>
                                                <span
                                                    style={{ fontSize: 28, color: '#6B6B6B', marginLeft: 45 }}>{firstdata.d}</span>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col xs={5}>
                            <Card hoverable={true}>
                                <Row gutter={24}>
                                    <Col xs={24}>
                                        <Icon type="profile"
                                              style={{ fontSize: '35px', color: '#08c', float: 'left' }}/>
                                        <span style={{ fontSize: 14, float: 'left', marginLeft: 10 }}>今日充值金额(元)：</span>
                                    </Col>
                                    <Col xs={24} style={{paddingBottom:20,paddingTop:20}}>
                                        <span style={{ fontSize: 28, color: 'red', marginLeft: 45 }}>{firstdata.e}</span>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col xs={5}>
                            <Card hoverable={true}>
                                <Row gutter={24}>
                                    <Col xs={24}>
                                        <Icon type="file-search"
                                              style={{ fontSize: '35px', color: '#08c', float: 'left' }}/>
                                        <span style={{ fontSize: 14, float: 'left', marginLeft: 10 }}>今日充值次数(笔)：</span>
                                    </Col>
                                    <Col xs={24} style={{paddingBottom:20,paddingTop:20}}>
                                        <span style={{ fontSize: 28, color: '#6B6B6B', marginLeft: 45 }}>{firstdata.f}</span>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col xs={4}>
                            <Card hoverable={true}>
                                <Row gutter={10}>
                                    <Col xs={24}>
                                        <Icon type="dollar" style={{ fontSize: '35px', color: '#08c', float: 'left' }}/>
                                        <span style={{ fontSize: 14, float: 'left', marginLeft: 10 }}>今日新增工单（张）：</span>
                                    </Col>
                                    <Col xs={24} style={{paddingBottom:20,paddingTop:20}}>
                                        <span style={{ fontSize: 28, color: '#6B6B6B', marginLeft: 45 }}>{firstdata.g}</span>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col xs={5}>
                            <Card hoverable={true}>
                                <Row gutter={24}>
                                    <Col xs={24}>
                                        <Icon type="picture"
                                              style={{ fontSize: '35px', color: '#08c', float: 'left' }}/>
                                        <span style={{ fontSize: 14, float: 'left', marginLeft: 10 }}>今日巡检照片(张)：</span>
                                    </Col>
                                    <Col xs={24} style={{paddingBottom:20,paddingTop:20}}>
                                        <span style={{ fontSize: 28, color: '#6B6B6B', marginLeft: 45 }}>{firstdata.h}</span>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col xs={5}>
                            <Card hoverable={true}>
                                <Row gutter={24}>
                                    <Col xs={24}>
                                        <Icon type="eye" style={{ fontSize: '35px', color: '#08c', float: 'left' }}/>
                                        <span style={{ fontSize: 14, float: 'left', marginLeft: 10 }}>今日巡查(人次)：</span>
                                    </Col>
                                    <Col xs={24} style={{paddingBottom:20,paddingTop:20}}>
                                        <span style={{ fontSize: 28, color: '#6B6B6B', marginLeft: 45 }}>{firstdata.i}</span>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col xs={12}>
                            <Card bordered={false}>
                                <span style={{ fontSize: 16 }}>今日各区消费分析</span>
                                <Table columns={columns} dataSource={data} size="middle" pagination={false}/>
                            </Card>
                        </Col>
                        <Col xs={12}>
                            <Card bordered={false}>
                                <span style={{ fontSize: 16 }}>今日消费渠道分布</span>
                                <Chart height={290} data={bzt} scale={bztcols} padding={[20, 10, 20, 100]} forceFit>
                                    <Coord type="theta" radius={0.75}/>
                                    <Axis name="percent"/>
                                    <Legend position="left"/>
                                    <Tooltip
                                        showTitle={false}
                                        itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}:{value}</li>"/>
                                    <Geom
                                        type="intervalStack"
                                        position="percent"
                                        color="item"
                                        tooltip={[
                                            'item*percent',
                                            (item, percent) => {
                                                percent = percent * 100 + '%';
                                                return {
                                                    name: item,
                                                    value: percent,
                                                };
                                            },
                                        ]}
                                        style={{ lineWidth: 1, stroke: '#fff' }}
                                    >
                                        <Label
                                            content="percent"
                                            formatter={(val, item) => {
                                                return item.point.item + ': ' + val;
                                            }}/>
                                    </Geom>
                                </Chart>
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col xs={12}>
                            <Card bordered={false}>
                                <span style={{ fontSize: 16 }}>各区停车利用率分析</span>
                                <Chart height={400} data={dv2} scale={cols2} padding={[80, 100, 80, 80]} forceFit>
                                    <Axis name="month"/>
                                    <Axis
                                        name="temperature"
                                        label={{
                                            formatter: val => `${val}`
                                        }}
                                    />
                                    <Tooltip
                                        crosshairs={{
                                            type: "y"
                                        }}
                                    />
                                    <Geom
                                        type="line"
                                        position="month*temperature"
                                        size={2}
                                        color={"city"}
                                        shape={"smooth"}
                                    />
                                    <Geom
                                        type="point"
                                        position="month*temperature"
                                        size={4}
                                        shape={"circle"}
                                        color={"city"}
                                        style={{
                                            stroke: "#fff",
                                            lineWidth: 1
                                        }}
                                    />
                                </Chart>
                            </Card>
                        </Col>
                        <Col xs={12}>
                            <Card bordered={false}>
                                <span style={{ fontSize: 16 }}>今日路内车场收入TOP 8</span>
                                <Row gutter={24} style={{marginTop:20}}>
                                {listItems}

                                </Row>
                            </Card>
                        </Col>
                    </Row>




                    <Row gutter={24}>
                        <Col xs={24}>
                            <Card bordered={false}>
                                <span style={{ fontSize: 16 }}>近30天平台收入变化趋势</span>
                                <Chart height={400} data={ddt} scale={ddtcols} forceFit>
                                    <Legend/>
                                    <Axis name="date"/>
                                    <Axis name="temperature" label={{ formatter: val => `${val}` }}/>
                                    <Tooltip crosshairs={{ type: 'y' }}/>
                                    <Geom type="line" position="month*temperature" size={2} color={'city'}/>
                                    <Geom
                                        type="point"
                                        position="month*temperature"
                                        size={4}
                                        shape={'circle'}
                                        color={'city'}
                                        style={{ stroke: '#fff', lineWidth: 1 }}/>
                                </Chart>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

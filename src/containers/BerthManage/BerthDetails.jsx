import React, { Component } from 'react';
import {
    Form,
    Row,
    Col,
    Select,
    Popover,
    Button,
    Divider,
    Card,
} from 'antd';
// import InfiniteScroll from 'react-infinite-scroller';
import ScrollArea from 'react-scrollbar';

const FormItem = Form.Item;

// 行政区枚举
const areaEnum = ['南山区', '福田区', '罗湖区'];
const areaData = ['Nanshan', 'Futian', 'Luohu'];
const streetData = {
    Nanshan: ['南山', '南头', '蛇口'],
    Futian: ['华强北', '梅林', '沙头'],
    Luohu: ['东门', '黄贝', '翠竹']
}


class BerthDetails extends Component {
    constructor(props) {
        super(props);
        const requireContext = require.context("../../static/images", false, /berth_(\w*?)\.png/)
        this.state = {
            streetEnum: [],
            imgData: requireContext.keys().map(requireContext),
        }
    }

    handleAreaChange(value) {
        this.setState({
            streetEnum: streetData[areaData[value]]
        })
    }


    render() {
        // if (!checkPageEnable('/ParkingRecord')) {
        //     return <Exception type='403' />;
        // }
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };

        const data = [
            'Racing car sprays burning fuel into crowd.',
            'Japanese princess to wed commoner.',
            'Australian walks 100km after outback crash.',
            'Man charged over missing wedding girl.',
            'Los Angeles battles huge wildfires.',
            'Los Angeles battles huge wildfires.',
            'Los Angeles battles huge wildfires.',
            'Los Angeles battles huge wildfires.',
            'Los Angeles battles huge wildfires.',
            'Los Angeles battles huge wildfires.',
            'Los Angeles battles huge wildfires.',
            'Los Angeles battles huge wildfires.',
            'Los Angeles battles huge wildfires.'
        ];

        const text = <div style={{ fontWeight: 700, textAlign: 'center' }}>详细信息</div>;
        const content = (
            <div>
                <p>手机号：13088888888</p>
                <p>申请方式：微信公众号</p>
                <p>申请时间：2019-05-05 15:20:00</p>
                <p>申请时长：20分钟</p>
                <p>预计离开时间：2019-05-05 17:20:00</p>
                <p>已停时长：1小时</p>
            </div>
        );
        const { streetEnum, imgData } = this.state;
        const berthState = ['正常', '空位', '故障', '正常', '未缴费', '等待缴费']


        return (
            <div className="page">
                <div className="page-header">
                    泊位详情
                </div>
                <div className="page-content ">
                    {/*查询表单参数*/}
                    <Form className="parking_search_form">
                        <Row gutter={46}>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label='行政区'>
                                    {getFieldDecorator('warning')(
                                        <Select placeholder='请选择' onChange={this.handleAreaChange.bind(this)}>
                                            {
                                                areaEnum.map((value, index) => {
                                                    return (
                                                        <Select.Option key={index}
                                                            value={index.toString()}>{value}</Select.Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label='片区'>
                                    {getFieldDecorator('warningTime')(
                                        <Select placeholder='请选择'>
                                            {
                                                streetEnum.map((value, index) =>
                                                    <Select.Option key={index}
                                                        value={index.toString()}>{value}</Select.Option>
                                                )
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label='收费规则'>
                                    <span>0~30分钟：1.80元，30-180分钟：3.60元/30分钟，超过180分钟：6元/30分钟；</span>
                                </FormItem>
                            </Col>

                        </Row>
                        <Row gutter={46} >
                            <Col span={24} style={{ textAlign: 'right' }}>
                                <Button type='primary'>查询</Button>
                                <Button style={{ marginLeft: '20px' }}>重置</Button>
                            </Col>
                        </Row>
                    </Form>

                    {/* <div style={{ overflow: 'auto', display: 'flex', width: '1500px', marginTop: '20px' }}>
                        <InfiniteScroll
                            initialLoad={false}
                            pageStart={0}
                            useWindow={false}
                            hasMore={false}
                            loadMore={false}
                            style={{ display: 'flex', paddingBottom: '30px' }}
                        >
                            {
                                data.map((item, index) => {
                                    return (
                                        <Popover placement="top" content={content} trigger="click">
                                            <Card
                                                hoverable
                                                style={{ width: 150, height: 140, margin: '0 10px' }}
                                                cover={<img style={{ width: '150px', height: '75px' }} src="resources/images/berth_paid.png" />}
                                                bodyStyle={{ padding: '0' }}
                                            >
                                                <p>
                                                    <span style={{ fontWeight: 700 }}>105200</span>
                                                    <span>正常</span>
                                                </p>
                                                <p>
                                                    <span>全日</span>
                                                    <span>电量：</span>
                                                    <span>100%</span>
                                                </p>
                                            </Card>
                                        </Popover>
                                    )
                                })
                            }
                        </InfiniteScroll>
                    </div> */}


                    <Divider orientation="left">泊位展示</Divider>


                    <ScrollArea
                        speed={0.8}
                        // className="area"
                        // contentClassName="content"
                        horizontal={true}
                        // vertical={true}
                        contentStyle={{ width: data.length * 170 }}
                        style={{ width: '1535px', marginTop: '20px' }}
                        // verticalContainerStyle={{ left: '0' }}
                        horizontalContainerStyle={{ background: '#d6ebff', borderRadius: '20px' }}
                        horizontalScrollbarStyle={{ background: '#0084ff', borderRadius: '20px' }}
                    >
                        {
                            data.map((item, index) => {
                                const i = parseInt(Math.random() * (5 + 1), 10);
                                return (
                                    <Popover placement="top" title={text} content={content} trigger="click" key={index}>
                                        <Card
                                            hoverable
                                            style={{ width: 150, height: 140, margin: '0 10px', display: 'inline-block' }}
                                            cover={<img style={{ width: '150px', height: '75px' }} src={imgData[i]} />}
                                            bodyStyle={{ padding: '0 15px' }}
                                            bordered={false}
                                        >
                                            <div>
                                                <span style={{ fontWeight: 700, fontSize: '16px' }}>105200</span>
                                                <span style={{ color: '#808080', float: 'right' }}>{berthState[i]}</span>
                                            </div>
                                            <div>
                                                <span style={{ color: '#808080' }}>全日</span>
                                                <span style={{ color: '#808080', float: 'right' }}>电量：
                                                <span style={{ color: 'green', fontWeight: 700 }}>100%</span>
                                                </span>
                                            </div>
                                        </Card>
                                    </Popover>
                                )
                            })
                        }
                    </ScrollArea>

                    <Row type="flex" justify="center" align="middle" gutter={48} style={{ height: '110px', background: '#c3c3c3', margin: '20px 0' }}>
                        <Col><div style={{ height: '30px', width: '30px', background: '#fff', borderRadius: '30px', textAlign: 'center', lineHeight: '30px' }}>东</div></Col>
                        <Col span={2}><hr style={{ height: '10px', background: '#fff' }}></hr></Col>
                        <Col span={2}><hr style={{ height: '10px', background: '#fff' }}></hr></Col>
                        <Col span={2}><hr style={{ height: '10px', background: '#fff' }}></hr></Col>
                        <Col span={2}><hr style={{ height: '10px', background: '#fff' }}></hr></Col>
                        <Col span={2}><hr style={{ height: '10px', background: '#fff' }}></hr></Col>
                        <Col span={2}><hr style={{ height: '10px', background: '#fff' }}></hr></Col>
                        <Col span={2}><hr style={{ height: '10px', background: '#fff' }}></hr></Col>
                        <Col span={2}><hr style={{ height: '10px', background: '#fff' }}></hr></Col>
                        <Col span={2}><hr style={{ height: '10px', background: '#fff' }}></hr></Col>
                        <Col span={2}><hr style={{ height: '10px', background: '#fff' }}></hr></Col>
                        <Col><div style={{ height: '30px', width: '30px', background: '#fff', borderRadius: '30px', textAlign: 'center', lineHeight: '30px' }}>西</div></Col>
                    </Row>


                    <ScrollArea
                        speed={0.8}
                        // className="area"
                        // contentClassName="content"
                        horizontal={true}
                        // vertical={true}
                        contentStyle={{ width: data.length * 170 }}
                        style={{ width: '1535px' }}
                        // verticalContainerStyle={{ left: '0' }}
                        horizontalContainerStyle={{ top: '0', background: '#d6ebff', borderRadius: '20px' }}
                        horizontalScrollbarStyle={{ background: '#0084ff', borderRadius: '20px' }}
                    >
                        {
                            data.map((item, index) => {
                                const i = parseInt(Math.random() * (5 + 1), 10);
                                return (
                                    <Popover placement="top" title={text} content={content} trigger="click" key={index}>
                                        <Card
                                            hoverable
                                            style={{ width: 150, height: 140, margin: '0 10px', marginTop: '32px', display: 'inline-block' }}
                                            cover={<img style={{ width: '150px', height: '75px' }} src={imgData[i]} />}
                                            bodyStyle={{ padding: '0 15px' }}
                                            bordered={false}
                                        >
                                            <div>
                                                <span style={{ fontWeight: 700, fontSize: '16px' }}>105200</span>
                                                <span style={{ color: '#808080', float: 'right' }}>{berthState[i]}</span>
                                            </div>
                                            <div>
                                                <span style={{ color: '#808080' }}>全日</span>
                                                <span style={{ color: '#808080', float: 'right' }}>电量：
                                                <span style={{ color: 'green', fontWeight: 700 }}>100%</span>
                                                </span>
                                            </div>
                                        </Card>
                                    </Popover>
                                )
                            })
                        }
                    </ScrollArea>
                </div>
            </div>
        );
    }
}

export default Form.create()(BerthDetails);

import React, {Component} from 'react';
import {
    Button, Form, Select, Table, Row, Col, DatePicker, Input, Spin, Pagination, Badge, Switch, Card, List, Timeline, Radio,
} from 'antd';
import {HttpClientImmidIot} from "../../../common/HttpClientImmidIot";


import moment from "moment";

const { Option } = Select;
const { TextArea } = Input;

const FormItem = Form.Item;

export default class ComplainWorkOrderDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uId:this.props.location.query.id?this.props.location.query.id:"--",
            shuju:{},
            tousu:{},
            lista:[],
            show:false,//显示处理页面
            switchover:1, //切换处理页面
        };
    }


    //加载数据
    loadData() {
        let uId = null;
        if (!this.state.uId) {
            uId = sessionStorage.getItem('uId_AppealDetail');
            sessionStorage.removeItem('uId_AppealDetail');
            this.setState({
                uId
            })
        } else {
            uId = this.state.uId
        };
        // params = this.filterOtherParams(params);
        HttpClientImmidIot.query(`/OperationsAndCenter/WorkOrder/ComplainWorkOrder/ComplainWorkOrderDetails?id=${uId}`, 'GET', null, this.handleQueryData.bind(this))
    }

    // 处理工单
    chuli(e) {
        this.setState({
            show: true,
        })
    }

    // 处理工单
    switchover(value, option) {
        this.setState({
            switchover:value,
        })
    }


    // loadData回调函数
    handleQueryData(d, type) {
        const data = d.data;
        if (type === HttpClientImmidIot.requestSuccess) {
            this.setState({
                shuju: data.shuju,
                tousu: data.tousu,
                lista: data.lista,
            })
        } else {
            //失败----做除了报错之外的操作
        }
    }




    //提交按钮
    tijiao(e) {
      alert("已提交");
    }


	// 组件挂载之前
    componentWillMount() {
    }

    // 组件挂载后
    componentDidMount() {
        this.loadData();
    }

    // 组件卸载之前
    componentWillUnmount() {
    }
    render() {
        const {switchover,show, uId,shuju,tousu,}= this.state;

        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19},
        };

        function handleChange(value) {
          console.log(`selected ${value}`);
        }

        const lista = [
            {shijian:'12点',neirong:'Create a servicessashdkjashdsd servicessashdkjashdsd'},
            {shijian:'12点',neirong:'Cre servicessashdkjashdsd'},
            {shijian:'12点',neirong:'Create servicessashdkjashdsd'},
            {shijian:'12点',neirong:'Create a servicessashdkj'},
        ];
        // {moment().format('YYYY-MM-DD HH:mm:ss')} Create a servicessashdkjashdsd servicessashdkjashdsd
        const listItems = lista.map((liststr) =>
                <Timeline.Item>
                    {liststr.shijian}{liststr.neirong}
                </Timeline.Item>
            );
        const chulijilu=()=>{
            if(show){
                if(switchover=="1"){
                    return (
                        <Card
                            title="工单处理"
                            className="baseInfo"
                            >
                            <Form>
                                <Row>
                                    <Col span={8}>
                                        <FormItem label='工单状态' {...formItemLayout}>
                                            <Select defaultValue="1" onChange={this.switchover.bind(this)}>
                                                <Option value="1">结案</Option>
                                                <Option value="2">处理中</Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={10} style={{marginLeft:25,paddingLeft:10}}>
                                        <div style={{background:"#F5F5F5", borderWidth:"1",borderStyle: "solid", borderColor: "rgba(215, 215, 215, 1)", borderRadius: "0",}}>
                                            温馨提示：该内容可能以短信方式发送给用户，请认真填写！
                                        </div>
                                    </Col>
                                </Row>
                                <Row style={{marginTop:"25px"}}>
                                    <Col span={8}>
                                        <FormItem label="常用意见" {...formItemLayout}>
                                            <Select defaultValue="1"  onChange={handleChange}>
                                                <Option value="1">请选择意见分类</Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span={6} style={{marginLeft:"10px"}}>
                                        <FormItem>
                                            <Select defaultValue="1"  onChange={handleChange}>
                                                <Option value="1">请选择意见分类</Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span={6} style={{marginLeft:"10px"}}>
                                        <Button>添加意见</Button>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8} >
                                        <FormItem label="结案内容" {...formItemLayout}>
                                            <TextArea rows={5}
                                                placeholder=""
                                            />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8} >
                                        <FormItem label="给用户发短信" {...formItemLayout}>
                                            <Radio.Group defaultValue={1}>
                                                <Radio value={1}>否</Radio>
                                                <Radio value={2}>是</Radio>
                                            </Radio.Group>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={4} style={{textAlign: "center"}}>
                                        <Button type="primary" onClick={(e)=>{this.tijiao(e)}}>
                                        <span>提交</span>
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                    )
                }else{
                    return (
                        <Card
                            title="工单处理"
                            className="baseInfo"
                            >
                            <Form>
                                <Row>
                                    <Col span={8}>
                                        <FormItem label='工单状态' {...formItemLayout}>
                                            <Select defaultValue="2" onChange={this.switchover.bind(this)}>
                                                <Option value="1">结案</Option>
                                                <Option value="2">处理中</Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <FormItem label="指派" {...formItemLayout}>
                                            <Select defaultValue="1"  onChange={handleChange}>
                                                <Option value="1">请选择</Option>
                                                <Option value="2">XX小姐</Option>
                                                <Option value="3">张三</Option>
                                                <Option value="4">李四</Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8} >
                                        <FormItem label="处理说明" {...formItemLayout}>
                                            <TextArea rows={5}
                                                placeholder=""
                                            />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={4} style={{textAlign: "center"}}>
                                        <Button type="primary" onClick={(e)=>{this.tijiao(e)}}>
                                        <span>提交</span>
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                    )
                }
            }else{
                return '';
            }
        }
    	return (
			<div className='page'>
                <div className="page-header">
                    <Row>
                        <Col span={8} style={{fontSize:"20px"}}>
                            <label>工单编号：</label>
                            <span>{uId}</span>
                        </Col>
                        <Col style={{textAlign: "right"}}>
                            <Button type="primary" onClick={()=>{window.history.back()}}>
                            <span>返回</span>
                            </Button>
                        </Col>
                    </Row>
                </div>
                <div className='page-content page-content-transparent'>
                    <Card
                        title="工单基本信息"
                        className="baseInfo"
                        >
                        <Row>
                            <Col span={8}>
                                <label>工单编号：</label>
                                <span>{uId}</span>
                            </Col>
                            <Col span={8}>
                                <label>工单标题：</label>
                                <span>{shuju.workorderHeadline?shuju.workorderHeadline:"--"}</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <label>工单级别：</label>
                                <span>{shuju.workorderPriority}</span>
                            </Col>
                            <Col span={8}>
                                <label>工单发起人：</label>
                                <span>{shuju.workorderInitiator}</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <label>投诉时间：</label>
                                <span>{shuju.creationTime}</span>
                            </Col>
                            <Col span={8}>
                                <label>投诉内容：</label>
                                <span>{shuju.contentrs}</span>
                            </Col>
                        </Row>
                    </Card>
                    <Card
                        title="投诉信息"
                        className="baseInfo"
                        >
                        <Row>
                            <Col span={8}>
                                <label>投诉类型：</label>
                                <span>{tousu.ComplaintsType}</span>
                            </Col>
                            <Col span={8}>
                                <label>投诉内容：</label>
                                <span>{tousu.Contentrs}</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <label>泊位号：</label>
                                <span>{tousu.TheBerthNo}</span>
                            </Col>
                            <Col span={8}>
                                <label>车牌号：</label>
                                <span>{tousu.LicensePlateNumber}</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <label>停车时间：</label>
                                <span>{tousu.StoppingTime}</span>
                            </Col>
                            <Col span={8}>
                                <label>联系电话：</label>
                                <span>{tousu.PhoneNumber}</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <label>照片：</label>
                                <img src={tousu.photo}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <label>投诉来源：</label>
                                <span>{tousu.comfrom}</span>
                            </Col>
                            <Col span={8}>
                                <label>投诉时间：</label>
                                <span>{shuju.creationTime}</span>
                            </Col>
                        </Row>
                    </Card>
                    <Card
                        title="处理记录"
                        className="baseInfo"
                        >
                        <Row>
                            <Col span={20}>
                                <Timeline>
                                {listItems}
                                </Timeline>
                            </Col>
                            <Col span={4} style={{textAlign: "center"}}>
                                <Button style={{Color:'white',marginTop:"80px",}} type="primary" onClick={(e)=>{this.chuli(e)}}>
                                <span>处理</span>
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                    {chulijilu()}
                </div>
			</div>
    		);
    }
}

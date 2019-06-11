import React, {Component} from 'react';
import {Button, Form,Table, Row, Col, Input, Spin,Card,Select,Radio,Timeline} from 'antd';
import {HttpClientImmidIot} from "../../../common/HttpClientImmidIot";

const { Option } = Select;
const FormItem=Form.Item;
const { TextArea } = Input;

export default class ComplainWorkOrderDetails extends Component {
  constructor (props) {
      super(props);
      this.state = {
          uId:this.props.location.query.id,
          xianshi:false,
          loading: false, //表格加载状态
          datum:{},
          lists:[],
      }
  }


  loadData() {
      let uId = null;
      this.setState({
          loading: true
      });

      if (!this.state.uId) {
          this.setState({
              uId
          })
      } else {
          uId = this.state.uId
      }
      HttpClientImmidIot.query(`/OperationsAndCenter/WorkOrder/FacilityMaintenance/FacilityMaintenanceDetails?id=${uId}`,'GET', null, this.handleQueryData.bind(this))
  }

  handleQueryData(d, type) {
      const data = d.data;
      if (type === HttpClientImmidIot.requestSuccess) {
          this.setState({
              datum: data.datum,
              lists:data.lists,
          })
      } else {
          //失败----做除了报错之外的操作
      }
      this.setState({
          loading: false,
      })
  }

  chuli(e){
    this.setState({
        xianshi:true,
    })
  }

  refer(){
      const refercon=this.state.refer;
      alert(refercon);
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
      const{uId,xianshi,loading,datum,lists}=this.state;
      const formItemLayout = {
          labelCol: {span: 5},
          wrapperCol: {span: 19},
      };

      // const lists=[
      //     {shijian:'12:00', neirong:'................'},
      //       {shijian:'12:00', neirong:'...........'},
      //         {shijian:'12:00', neirong:'........'},
      //           {shijian:'12:00', neirong:'............'},
      // ];

      const listItem=lists.map((str) =>
          <Timeline.Item>
              {str.shijian}{str.neirong}
          </Timeline.Item>
      );
      const gongdanchuli=()=>{
            if(xianshi){
                return(
                  <Card title='工单处理'>
                        <div style={{width:'55%',}}>
                              <Row>
                                      <Col span={24}>
                                            <FormItem label='工单状态' {...formItemLayout}>
                                                  <Select defaultValue="请选择" style={{ width:'200px'}}>
                                                        <Option value="1">自行处理中</Option>
                                                        <Option value="2">厂家处理中</Option>
                                                      </Select>
                                            </FormItem>
                                      </Col>
                                    <Col span={24} style={{marginTop:'20px'}}>
                                          <FormItem label='指派' {...formItemLayout}>
                                                <Select defaultValue="1" style={{ width:'200px',}}>
                                                      <Option value="1">请选择</Option>
                                                    </Select>
                                          </FormItem>
                                    </Col>
                                    <Col span={24}>
                                          <FormItem label='处理说明' {...formItemLayout}>
                                              <TextArea rows={6} style={{ width:'500px'}} onChange={(e) => {
                                                  this.state.refer = e.target.value;
                                              }} />
                                          </FormItem>
                                    </Col>
                                    <Col span={24}>
                                    <Button type='primary' onClick={this.refer.bind(this)} style={{marginLeft:'150px'}}>提交</Button>
                                    </Col>
                              </Row>
                        </div>
                  </Card>
                )
            }else{
              return '';
            }
      }

    	return (
            <div className='page'>
                <div className='page-header '>
                      <div style={{height:40}}>
                            <div style={{
                                  width:'60%',
                                  float:'left',
                            }}>
                                  <label>工单编号:</label>
                                  <span style={{marginLeft:'20px'}}>{this.state.uId}</span>
                            </div>
                            <div style={{
                                width:'5%',
                                float:'right',
                            }}>
                                <Button type='primary' onClick={()=>{window.history.back()}}>返回</Button>
                            </div>
                      </div>
                      <div className='page-content page-content-transparent'>
                            <Card title='设备信息' >
                                  <Row>
                                      <Col span={8} style={{marginLeft:'30px'}}>
                                          <label>路段名称:</label>
                                          <span>{datum.roadName || '---'}</span>
                                      </Col>
                                      <Col span={8} style={{marginLeft:'70px'}}>
                                          <label>关联车位:</label>
                                          <span>{datum.associatedParking}</span>
                                      </Col>
                                  </Row>
                                  <Row>
                                      <Col span={8} style={{marginLeft:'30px'}}>
                                          <label>设备类型:</label>
                                          <span>{datum.deviceType || '---'}</span>
                                      </Col>
                                      <Col span={8} style={{marginLeft:'70px'}}>
                                          <label>设备型号:</label>
                                          <span>{datum.unitType || '---'}</span>
                                      </Col>
                                  </Row>
                                  <Row>
                                      <Col span={8} style={{marginLeft:'30px'}}>
                                          <label>设备ID:</label>
                                          <span>{datum.deviceID || '---'}</span>
                                      </Col>
                                      <Col span={8} style={{marginLeft:'70px'}}>
                                          <label>硬件ID:</label>
                                          <span>{datum.hardwareID || '---'}</span>
                                      </Col>
                                      <Col span={8} style={{marginLeft:'30px'}}>
                                          <label>设备厂家:</label>
                                          <span>{datum.equipmentManufacturer || '---'}</span>
                                      </Col>
                                      <Col span={8} style={{marginLeft:'70px'}}>
                                          <label>设备地址:</label>
                                          <span>{datum.deviceAddress || '---'}</span>
                                      </Col>
                                      <Col span={8} style={{marginLeft:'30px'}}>
                                          <label>设备状态:</label>
                                          <span>{datum.equipmentStatus || '---'}</span>
                                      </Col>
                                  </Row>
                            </Card>
                            <Card title='工单基本信息' >
                                  <Row>
                                      <Col span={8} style={{marginLeft:'30px'}}>
                                          <label>工单编号:</label>
                                          <span >{this.state.uId || '---'}</span>
                                      </Col>
                                      <Col span={8} style={{marginLeft:'70px'}}>
                                          <label>工单标题:</label>
                                          <span >{datum.workorderHeadline || '---'}</span>
                                      </Col>

                                  </Row>
                                  <Row>
                                      <Col span={8} style={{marginLeft:'30px'}}>
                                          <label>工单内容:</label>
                                          <span>{datum.contentrs || '---'}</span>
                                      </Col>
                                      <Col span={8} style={{marginLeft:'70px'}}>
                                          <label>工单状态:</label>
                                          <span>{datum.orderStatus || '---'}</span>
                                      </Col>
                                  </Row>
                                  <Row>

                                      <Col span={8} style={{marginLeft:'30px'}}>
                                          <label>优先级:</label>
                                          <span>{datum.workorderPriority || '---'}</span>
                                      </Col>
                                  </Row>
                                  <Row>
                                      <Col span={8} style={{marginLeft:'30px'}}>
                                          <label>工单发起人:</label>
                                          <span>{datum.workorderInitiator || '手机APP'}</span>
                                      </Col>
                                      <Col span={8} style={{marginLeft:'70px'}}>
                                          <label>创建时间:</label>
                                          <span>{datum.creationTime || '2019-05-05 21:20'}</span>
                                      </Col>
                                  </Row>
                            </Card>
                            <Card title='处理记录'>
                              <Row>
                                <Col span={16} style={{marginLeft:'30px'}}>
                                  <Timeline>
                                      {listItem}
                                  </Timeline>
                                  </Col>
                                <Col span={6} style={{marginLeft:'30px'}}>
                                      <Button type='primary' onClick={(e)=>{this.chuli(e)}} style={{marginTop:'40px'}}>处理</Button>
                                  </Col>
                            </Row>
                            </Card>
                            {gongdanchuli()}

                      </div>
                </div>
            </div>
    		);
    }
}

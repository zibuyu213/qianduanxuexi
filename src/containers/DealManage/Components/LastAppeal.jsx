import React, {Component, Fragment} from 'react';
import {Card, Row, Col} from 'antd';
import ImagePreview from "../../../components/ImagePreview";

export default class LastAppeal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            latestCostAppeal: this.props.latestCostAppeal,
            // latestCostAppealDispose: this.props.latestCostAppealDispose,
            ImagePreviewVisible: false,
            imageUrl: '',
        }
    }

    // 组件挂载之前
    componentWillMount() {
    }

    // 组件挂载后
    componentDidMount() {
    }

    // 组件卸载之前
    componentWillUnmount() {
    }

    render() {
        const {latestCostAppeal, ImagePreviewVisible, imageUrl} = this.state;
        if (!latestCostAppeal) return <Card title='申诉信息'/>;
        const statusText = ['拒绝', '通过'];
        const latestCostAppealDispose = this.props.latestCostAppealDispose;
        return (
            <Fragment>
                <Card title='申诉信息' className='detail-card'>
                    <Row gutter={30}>
                        <Col span={8} className='detail-card-col'>
                            <label>联系电话：</label>
                            <span>{latestCostAppeal.userMobile}</span>
                        </Col>
                        <Col span={8} className='detail-card-col'>
                            <label>车牌号：</label>
                            <span>{latestCostAppeal.plateNumber}</span>
                        </Col>
                        <Col span={8} className='detail-card-col'>
                            <label>申诉时间：</label>
                            <span>{latestCostAppeal.createTime}</span>
                        </Col>
                    </Row>
                    <Row gutter={30}>
                        <Col span={8} className='detail-card-col'>
                            <label>申诉理由：</label>
                            <span>{latestCostAppeal.reason}</span>
                        </Col>
                        <Col span={16} className='detail-card-col'>
                            <label>证明照片：</label>
                            <span>
                                {
                                    latestCostAppeal.photos.map((item, index) => (
                                        <img src={item}
                                             key={index}
                                             onClick={(e) => {
                                                 this.setState({
                                                     ImagePreviewVisible: true,
                                                     imageUrl: e.target.src,
                                                 })
                                             }}
                                             style={{
                                                 verticalAlign: 'text-top',
                                                 marginRight: '10px',
                                                 width: 150, height: 100,
                                                 cursor: 'pointer'
                                             }}/>
                                    ))
                                }
                            </span>
                        </Col>
                    </Row>
                </Card>
                {
                    latestCostAppealDispose && (
                        <Card title='处理详情' className='detail-card'>
                            <Row gutter={30}>
                                <Col span={8} className='detail-card-col'>
                                    <label>处理人：</label>
                                    <span>{latestCostAppealDispose.createUserName}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>处理时间：</label>
                                    <span>{latestCostAppealDispose.createTime}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>处理结果：</label>
                                    <span>{statusText[latestCostAppealDispose.status]}</span>
                                </Col>
                            </Row>
                            <Row gutter={30}>
                                {
                                    latestCostAppealDispose.status === 1 && (
                                        <Col span={8} className='detail-card-col'>
                                            <label>减免金额：</label>
                                            <span>{latestCostAppealDispose.waiverAmount} 元</span>
                                        </Col>
                                    )
                                }
                                <Col span={8} className='detail-card-col'>
                                    <label>{latestCostAppealDispose.status === 1 ? '通过理由：' : '拒绝理由：'}</label>
                                    <span>{latestCostAppealDispose.reason}</span>
                                </Col>
                            </Row>
                        </Card>
                    )
                }
                <ImagePreview visible={ImagePreviewVisible} imageUrl={imageUrl} onCancel={() => {
                    this.setState({
                        ImagePreviewVisible: false,
                    })
                }}/>
            </Fragment>
        );
    }
}

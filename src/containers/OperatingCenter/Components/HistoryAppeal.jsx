import React, {Component, Fragment} from 'react';

import {Card, Row, Col} from 'antd';
import ImagePreview from "../../../components/ImagePreview";

export default class HistoryAppeal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            costAppealHistory: this.props.costAppealHistory, // 历史申诉信息列表
            ImagePreviewVisible: false,
            imageUrl: ''
        };
    }

    // 组件挂载之前
    componentWillMount () {
    }

    // 组件挂载后
    componentDidMount () {
    }

    // 组件卸载之前
    componentWillUnmount () {
    }

    getEmptyDOM () {
        return (<Card title='历史申诉信息' className='detail-card'>
            <Row>
                <Row gutter={30}>
                    <Col span={24} className='detail-card-col' style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className="analysis-chart-nodata-text" style={{ padding: '50px 0px' }}>
                            <img className="analysis-chart-nodata-icon"
                                 src="resources/images/icon_index_chart_nodata.png"/>
                            暂无数据
                        </div>
                    </Col>
                </Row>
            </Row>
            <Row>
                <Card title='历史处理详情' type='inner' className='detail-card'>
                    <Row gutter={30}>
                        <Col span={24} className='detail-card-col'
                             style={{ display: 'flex', justifyContent: 'center' }}>
                            <div className="analysis-chart-nodata-text" style={{ padding: '50px 0px' }}>
                                <img className="analysis-chart-nodata-icon"
                                     src="resources/images/icon_index_chart_nodata.png"/>
                                暂无数据
                            </div>
                        </Col>
                    </Row>
                </Card>
            </Row>
        </Card>)
    }

    render () {
        const { costAppealHistory, ImagePreviewVisible, imageUrl } = this.state;
        if (costAppealHistory.length === 0) {
            return this.getEmptyDOM()
        }
        const statusText = ['拒绝', '通过'];
        return (
            <Fragment>
                {
                    costAppealHistory.map((item, index) => (
                        <Fragment key={index}>
                            <Card title='历史申诉信息' className='detail-card'>
                                <Row>
                                    <Row gutter={30}>
                                        <Col span={8} className='detail-card-col'>
                                            <label>联系电话：</label>
                                            <span>{item.userMobile}</span>
                                        </Col>
                                        <Col span={8} className='detail-card-col'>
                                            <label>车牌号：</label>
                                            <span>{item.plateNumber}</span>
                                        </Col>
                                        <Col span={8} className='detail-card-col'>
                                            <label>申诉时间：</label>
                                            <span>{item.createTime}</span>
                                        </Col>
                                    </Row>
                                    <Row gutter={30}>
                                        <Col span={8} className='detail-card-col'>
                                            <label>申诉理由：</label>
                                            <span>{item.reason}</span>
                                        </Col>
                                        <Col span={16} className='detail-card-col'>
                                            <label>证明照片：</label>
                                            <span>
                                        {
                                            item.photos.length > 0 && item.photos.map((photo, index) => (
                                                <img src={photo}
                                                     key={photo + index}
                                                     onClick={(e) => {
                                                         e.preventDefault();
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
                                </Row>
                                <Row>
                                    {
                                        item.parkOrderCostAppealDisposeDTOs.map((DTO, index) => (
                                            <Card title='历史处理详情' className='detail-card' type='inner' key={DTO.createTime + index}>
                                                <Row gutter={30}>
                                                    <Col span={8} className='detail-card-col'>
                                                        <label>处理人：</label>
                                                        <span>{DTO.createUserName}</span>
                                                    </Col>
                                                    <Col span={8} className='detail-card-col'>
                                                        <label>处理时间：</label>
                                                        <span>{DTO.createTime}</span>
                                                    </Col>
                                                    <Col span={8} className='detail-card-col'>
                                                        <label>处理结果：</label>
                                                        <span>{statusText[DTO.status]}</span>
                                                    </Col>
                                                </Row>
                                                <Row gutter={30}>
                                                    <Col span={8} className='detail-card-col'>
                                                        <label>拒绝理由：</label>
                                                        <span>{DTO.reason}</span>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        ))
                                    }
                                </Row>
                            </Card>
                        </Fragment>
                    ))
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

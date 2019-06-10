import React, {Component} from 'react';

import {Spin} from 'antd';

export default class CheckAddressModal extends Component {
    constructor (props) {
        super(props);
        this.map = null;
        this.marker = null;
        this.state = {
            checkPoints: this.props.checkPoints || [],
            effectiveRange: this.props.effectiveRange || 0,
            mapLoading: true,
            mapComplete: 0, // 地图complete事件，防止重复添加地图覆盖物
        };
    }

    // 组件挂载之前
    componentWillMount () {
    }

    // 组件挂载后
    componentDidMount () {
        const checkPoints = this.state.checkPoints;
        const effectiveRange = this.state.effectiveRange;
        this.map = new window.AMap.Map('Container', {
            resizeEnable: true,
            zoom: 11,
            showIndoorMap: true
        });
        this.map.on('complete', () => {
            this.state.mapComplete += 1;
            if (checkPoints.length > 0 && this.state.mapComplete === 1) {
                checkPoints.forEach((item, index) => {
                    let markerContent = `<div style="display: flex; justify-content: center; flex-direction: column; align-items: center">
                            <div class='markerLngLat'>${index + 1}</div>
                            <span class='markerContent'>${item.checkPointAddress || ''}</span>
                        </div>`;
                    const marker = new window.AMap.Marker({
                        position: [parseFloat(item.checkPointLongitude), parseFloat(item.checkPointLatitude)],
                        content: markerContent,
                        topWhenClick: true,
                    });
                    const circle = new window.AMap.Circle({
                        center: new window.AMap.LngLat(parseFloat(item.checkPointLongitude), parseFloat(item.checkPointLatitude)),
                        strokeColor: "#F33",  //线颜色
                        strokeOpacity: 0.35,  //线透明度
                        strokeWeight: 2,  //线粗细度
                        fillColor: '#ee2200',
                        fillOpacity: 0.3,
                        radius: effectiveRange, // 圆半径
                    });
                    circle.setMap(this.map);
                    marker.setMap(this.map);
                });
            }
            this.map.setFitView();
            this.setState({
                mapLoading: false
            })
        });
    }

    // 组件卸载之前
    componentWillUnmount () {
        this.map.destroy()
    }

    render () {
        const { mapLoading } = this.state;
        return (
            <Spin spinning={mapLoading} tip='加载中...'>
                <div id='Container' style={{ width: '100%', height: '700px' }}>
                </div>
            </Spin>
        );
    }
}

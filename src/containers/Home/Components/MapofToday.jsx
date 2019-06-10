import React, {Component, Fragment} from 'react';
import {Button, Icon} from 'antd';
import shenzhenGeoJson from '@/static/450400.js';

export default class MapofToday extends Component {
    constructor(props) {
        super(props);
        this.mapInstance = null;
        this.trafficLayer = null;
        this.geoJson = null;
        this.state = {
            isGeoJsonMap: true,
        };
    }

    // 组件挂载之前
    componentWillMount() {
    }

    // 组件挂载后
    componentDidMount() {
        this.mapInstance = new window.AMap.Map('mapContainer', {
            resizeEnable: true,
            zoom: 8,
            center: [111.297604, 23.474803],
            // mapStyle: 'amap://styles/darkblue',
            showIndoorMap: true
        });
        // 生成梧州市行政区
        // this.getPolygon();
        let districtArray = [
            { adcode: '450405', berthinfo: 0.3 },
            { adcode: '450406', berthinfo: 0.4 },
            { adcode: '450403', berthinfo: 0.6 },
            { adcode: '450423', berthinfo: 0.5 },
            { adcode: '450481', berthinfo: 0.7 },
            { adcode: '450421', berthinfo: 0.8 },
            { adcode: '450422', berthinfo: 0.2 },
        ];
        districtArray.forEach(item => {
            this.getDistrict(item);
        });
        // this.getDistrict();
        //实时路况图层
        this.trafficLayer = new window.AMap.TileLayer.Traffic({
            zIndex: 10
        });
    }

    getDistrict(districtInfo) {
        // 地图插件
        this.mapInstance.plugin(["AMap.DistrictSearch"], () => {
            new window.AMap.DistrictSearch({
                extensions: 'all',
                // subdistrict: 0
            }).search(districtInfo.adcode, (status, result) => {
                // console.log(result);
                let holes = result.districtList[0].boundaries;
                let polygon = new window.AMap.Polygon({
                    path: holes,
                    strokeColor: 'white',
                    strokeWeight: 1,
                    fillColor: 'red',
                    fillOpacity: districtInfo.berthinfo
                });
                this.mapInstance.add(polygon);
                this.mapInstance.setCenter(result.districtList[0].center)
            })
        });
    }

    getPolygon() {
        this.geoJson = new window.AMap.GeoJSON({
            geoJSON: shenzhenGeoJson,
            // 还可以自定义getMarker和getPolyline
            getPolygon: (geojson, lnglats) => {
                console.log(geojson);
                // 计算面积
                let area = window.AMap.GeometryUtil.ringArea(lnglats[0]);
                const polygon = new window.AMap.Polygon({
                    path: lnglats,
                    fillOpacity: 1 - Math.sqrt(area / 8000000000),// 面积越大透明度越高
                    strokeColor: 'white',
                    strokeWeight: 2,
                    fillColor: 'red'
                });
                polygon.on('click', (e) => {
                    console.log(e)
                });
                return polygon;
            }
        });
        this.geoJson.setMap(this.mapInstance);
    }

    // 组件卸载之前
    componentWillUnmount() {
        this.mapInstance.destroy()
    }

    mapToggle(code) {
        if (code) { // 路况
            if (this.geoJson) {
                this.geoJson.setMap(null)
            }
            this.setState({
                isGeoJsonMap: false
            });
            this.trafficLayer.setMap(this.mapInstance);
        } else {
            if (this.trafficLayer) {
                this.trafficLayer.setMap(null);
            }
            this.setState({
                isGeoJsonMap: true
            });
            this.geoJson.setMap(this.mapInstance);
        }
    }

    render() {
        const { isGeoJsonMap } = this.state;
        const MyIcon = Icon.createFromIconfontCN({
            scriptUrl: '//at.alicdn.com/t/font_1180595_z33n9kulk9g.js', // 在 iconfont.cn 上生成
        });
        return (
            <div id='mapContainer' style={{ height: 370, width: '100%', position: 'relative' }}>
                {/*百分比*/}
                <div style={{
                    position: 'absolute',
                    zIndex: 100,
                    top: 10,
                    padding: '0 10px',
                    left: 'calc(50% - 70px)',
                    background: 'white'
                }}>{isGeoJsonMap ? '各区车位使用情况分布' : '实时交通路况图'}</div>
                {
                    isGeoJsonMap && (
                        <Fragment>
                            <div style={{
                                position: 'absolute',
                                top: 10,
                                left: 10,
                                zIndex: 100,
                                lineHeight: 'initial',
                                background: 'white',
                                padding: '5px 10px'
                            }}>
                                <div>车位占用百分比 <Icon type="heat-map"/></div>
                                <div>
                                    <span style={{
                                        display: 'inline-block',
                                        width: 20,
                                        height: 15,
                                        background: 'rgba(255, 0, 0, 0.2)'
                                    }}/>
                                    <span style={{ marginLeft: 10 }}>0~20%</span>
                                </div>
                                <div>
                                    <span style={{
                                        display: 'inline-block',
                                        width: 20,
                                        height: 15,
                                        background: 'rgba(255, 0, 0, 0.4)'
                                    }}/>
                                    <span style={{ marginLeft: 10 }}>20~40%</span>
                                </div>
                                <div>
                                    <span style={{
                                        display: 'inline-block',
                                        width: 20,
                                        height: 15,
                                        background: 'rgba(255, 0, 0, 0.6)'
                                    }}/>
                                    <span style={{ marginLeft: 10 }}>40~60%</span>
                                </div>
                                <div>
                                    <span style={{
                                        display: 'inline-block',
                                        width: 20,
                                        height: 15,
                                        background: 'rgba(255, 0, 0, 0.8)'
                                    }}/>
                                    <span style={{ marginLeft: 10 }}>60~80%</span>
                                </div>
                                <div>
                                    <span style={{
                                        display: 'inline-block',
                                        width: 20,
                                        height: 15,
                                        background: 'rgba(255, 0, 0, 1)'
                                    }}/>
                                    <span style={{ marginLeft: 10 }}>80~100%</span>
                                </div>
                            </div>
                        </Fragment>
                    )
                }
                {/*地图切换*/}
                <div style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    zIndex: 100,
                    lineHeight: 'initial',
                    padding: '5px 10px'
                }}>
                    <Button title='车位占用比地图' type='primary' onClick={this.mapToggle.bind(this, 0)}
                            style={{ marginRight: 10 }}><MyIcon type='iconMapicon'
                                                                style={{ color: 'white', fontSize: '16px' }}/></Button>
                    <Button title='实时路况图' type='primary' onClick={this.mapToggle.bind(this, 1)}><MyIcon
                        type='iconlukuang' style={{ color: 'white', fontSize: '16px' }}/></Button>
                </div>
            </div>
        );
    }
}

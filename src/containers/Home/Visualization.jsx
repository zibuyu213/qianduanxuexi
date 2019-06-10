import React, {Component, Suspense, lazy} from 'react';
import {Icon, Tabs} from 'antd';
import './Visualization.css';
import _ from 'lodash';
import {HttpClientImmidIot} from "../../common/HttpClientImmidIot";

const Berth = lazy(() => import('./Components/VisualizationBerth'));
const Users = lazy(() => import('./Components/VisualizationUsers'));
const Devices = lazy(() => import('./Components/VisualizationDevices'));

const defaultCheckBoxKey = ['A', 'B', 'C', 'D', 'E', 'F'];
export default class Visualization extends Component {
    constructor(props) {
        super(props);
        this.mapInstance = null;
        this.checkPoints = [
            { lnglat: [111.320542, 23.472962], address: '万秀区', streets: 97, berths: 300 },
            { lnglat: [111.274777, 23.485695], address: '长洲区', streets: 122, berths: 350 },
            { lnglat: [111.246035, 23.40996], address: '龙圩区', streets: 136, berths: 535 },
        ];
        this.markerGroup = null;
        this.masses = {};
        this.currentTab = '1';
        this.state = {
            isToggle: true,
            checkPointsInfo: '南山区：97个路段',
            districtBerthData: [], // 行政区泊位数据
            areaBerthData: [], //片区泊位数据
            streetBerthData: [], //街道泊位数据
        };
    }

    // 组件挂载之前
    componentWillMount() {
    }

    // 组件挂载后
    componentDidMount() {
        this.mapInstance = new window.AMap.Map('mapContainer', {
            resizeEnable: true,
            center: new window.AMap.LngLat(111.297604, 23.474803),
            // zoom: 13,
            showIndoorMap: true
        });
        // this.addCluster();
        HttpClientImmidIot.query('/visualization/berth', 'GET', null, (d, type) => {
            // console.log(d.data);
            this.districtSearch(d.data.name);
            if (d.data.subdistrict) {
                let areaBerthData = [], streetBerthData = [], districtBerthData = [];
                d.data.subdistrict.forEach(district => { //行政区泊位数据
                    // this.districtSearch(district.name);
                    districtBerthData.push({ name: district.name, berthNum: district.berthNum });
                    district.subdistrict.forEach(area => { // 片区泊位数据
                        areaBerthData.push({ name: area.name, location: area.location, berthNum: area.berthNum });
                        area.subdistrict.forEach(street => { // 街道泊位数据
                            // console.log(street);
                            streetBerthData.push(street)
                        })
                    });
                });
                this.setState({
                    districtBerthData,
                    areaBerthData,
                    streetBerthData
                })
            }
        });
    }

    districtSearch(searchName) {
        this.mapInstance.plugin(["AMap.DistrictSearch"], () => {
            new window.AMap.DistrictSearch({
                subdistrict: 0
            }).search(searchName, (status, result) => {
                // console.log(result);
            })
        });
    }

    showBerthDataOnMap() {
        const { districtBerthData, areaBerthData, streetBerthData } = this.state;
        console.log(districtBerthData, areaBerthData, streetBerthData);
        if (districtBerthData.length > 0) {
            districtBerthData.forEach(district => {
                this.districtSearch(district.name)
            });
            if (areaBerthData.length > 0) {
                this.addCluster(areaBerthData);
                if (streetBerthData.length > 0) {
                    this.addCluster(streetBerthData, true);
                }
            }
        }
    }

    addCluster(data, canClick = false) {
        const markers = [];
        data.forEach((item, index) => {
            let markerContent = `<div style="display: flex; justify-content: center; flex-direction: column; align-items: center">
                            <div class='markerLngLat'></div>
                            <span class='markerContent'>${item.name}：${item.berthNum || item.berthTotalNum}个泊位</span>
                        </div>`;
            const marker = new window.AMap.Marker({
                position: new window.AMap.LngLat(item.location[0], item.location[1]),
                content: markerContent,
                topWhenClick: true,
                extData: item
            });
            if (canClick) {
                marker.on('click', () => {
                    location.hash = '/Home/Visualization/BerthDetails'
                });
            }
            markers.push(marker);
        });
        const markerGroup = new window.AMap.OverlayGroup(markers);
        markerGroup.setMap(this.mapInstance)
    }

    // 组件卸载之前
    componentWillUnmount() {
        this.mapInstance.destroy()
    }

    // 随机生成设备点
    genPointData(otherInfo) {
        const leng = _.random(20, 30);
        const points = [];
        for (let i = 0; i < leng; i++) {
            let lng = _.random(111.097104, 111.426693); // 经度
            let lat = _.random(23.340821, 23.5764); // 纬度
            points.push({ lnglat: [lng, lat], status: _.random(1, 3), ...otherInfo })
        }
        return points
    }

    // 控制面板tab标签变化事件
    panelTabChange(activeKey) {
        this.currentTab = activeKey;
        this.mapInstance.clearInfoWindow();
        if (activeKey === '1') { // 泊位
            this.markerGroup.show();
        } else if (activeKey === '2') { // 人员
            this.markerGroup.hide();
        } else if (activeKey === '3') { // 设备
            this.markerGroup.hide();
            if (!_.isEmpty(this.masses)) {
                for (let massesKey in this.masses) {
                    this.masses[massesKey].show();
                }
            } else {
                const typeMapInfo = {
                    'A': ['zhongjiqi_green', '正常中继器'],
                    'B': ['wifi_green', '正常网关'],
                    'C': ['zhongjiqi_blue', '维修中继器'],
                    'D': ['wifi_blue', '维修网关'],
                    'E': ['zhongjiqi_red', '异常中继器'],
                    'F': ['wifi_red', '异常网关'],
                };
                const genStyle = function (type) {
                    return {
                        url: `../../static/mapIcons/${typeMapInfo[type][0]}.png`,
                        anchor: new window.AMap.Pixel(6, 6),
                        size: new window.AMap.Size(30, 30)
                    }
                };
                const infoWindow = new window.AMap.InfoWindow({
                    autoMove: true,
                    // isCustom: true,  //使用自定义窗体
                    // offset: new window.AMap.Pixel(16, -45)
                });
                defaultCheckBoxKey.forEach(item => {
                    const mass = new window.AMap.MassMarks(this.genPointData({ type: item }), {
                        opacity: 1,
                        zIndex: 111,
                        cursor: 'pointer',
                        style: genStyle(item)
                    });
                    mass.on('click', (e) => {
                        //构建信息窗体中显示的内容
                        const info = `<div style="max-width: 500px; padding: 10px">
                            <h3>${typeMapInfo[e.data.type][1]}</h3>
                            <p>坐标 : ${e.data.lnglat.lng}，${e.data.lnglat.lat}</p>
                            <p>地址 :北京市朝阳区望京阜荣街10号首开广场4层</p>
                        </div>`;
                        infoWindow.setContent(info);
                        infoWindow.open(this.mapInstance, new window.AMap.LngLat(e.data.lnglat.lng, e.data.lnglat.lat));
                    });
                    mass.setMap(this.mapInstance);
                    this.masses[item] = mass;
                });
            }
        }
    }

    //控制面板的显示隐藏
    panelToggle() {
        this.setState({
            isToggle: !this.state.isToggle
        })
    }

    berthSearch(data) {
        console.log(data)
    }

    usersSearch(data) {
        console.log(data)
    }

    // 设备复选框change事件
    checkBoxChange(values) {
        console.log(values);
        const xorArr = _.xor(values, defaultCheckBoxKey);
        for (let massesKey in this.masses) {
            this.masses[massesKey].show()
        }
        xorArr.forEach(item => {
            this.masses[item].hide()
        })
    }

    // 选择设备类型
    selectDeviceType(value) {
        console.log(value)
    }

    selectArea(value) {
        console.log(value)
    }

    selectDistrict(value) {
        console.log(value)
    }

    render() {
        const { isToggle } = this.state;
        const TabPane = Tabs.TabPane;
        if (this.currentTab === '1') {
            this.showBerthDataOnMap()
        }
        return (
            <div className='page'>
                <div className='page-header'>
                    <div>可视化</div>
                </div>
                <div className='page-content' style={{ padding: 0 }}>
                    <div id='mapContainer'
                         style={{ height: 'calc(100vh - 64px - 100px - 80px)', width: '100%', position: 'relative' }}>
                        <div className='visualPanel' style={isToggle ? { left: 10 } : { left: -300 }}>
                            <div style={{
                                width: 300,
                                height: 'calc(100vh - 64px - 100px - 80px - 20px)',
                                float: 'left',
                                background: 'white',
                                marginRight: 10,
                                padding: '0 15px'
                            }}>
                                <Tabs defaultActiveKey="1" onChange={this.panelTabChange.bind(this)}>
                                    <TabPane tab="泊位" key="1">
                                        <Suspense fallback={null}>
                                            <Berth berthList={[]}
                                                   berthSearch={(data) => this.berthSearch.bind(this, data)}/>
                                        </Suspense>
                                    </TabPane>
                                    <TabPane tab="人员" key="2">
                                        <Suspense fallback={null}>
                                            <Users usersList={[]}
                                                   searchUsers={data => this.usersSearch.bind(this, data)}/>
                                        </Suspense>
                                    </TabPane>
                                    <TabPane tab="设备" key="3">
                                        <Suspense fallback={null}>
                                            <Devices
                                                selectDeviceType={this.selectDeviceType.bind(this)}
                                                selectArea={this.selectArea.bind(this)}
                                                selectDistrict={this.selectDistrict.bind(this)}
                                                checkBoxChange={this.checkBoxChange.bind(this)}/>
                                        </Suspense>
                                    </TabPane>
                                </Tabs>
                            </div>
                            <Icon type="bars" style={{ fontSize: '24px', color: 'rgb(0,140,255)' }}
                                  onClick={this.panelToggle.bind(this)}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

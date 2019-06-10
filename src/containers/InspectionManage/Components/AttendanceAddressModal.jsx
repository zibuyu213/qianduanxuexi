import React, {Component, Fragment} from 'react';

import {Row, Input, Form, Menu, Dropdown, Spin, message} from 'antd';
import '../Styles/Inspection.css'

const FormItem = Form.Item;
const MenuItem = Menu.Item;

class AttendanceAddressModal extends Component {
    constructor (props) {
        super(props);
        this.mapInstance = null;
        this.autoComplete = null;
        this.placeSearch = null;
        this.AMapTool = null;
        this.POISelectMarker = null;
        this.AMapZoom = null;
        this.state = {
            dropDownVisible: false,
            POIMenu: [],
            data: this.props.data || [],
            mapLoading: true,
        };
    }

    // 组件挂载之前
    componentWillMount () {
    }

    // 组件挂载后
    componentDidMount () {
        this.mapInstance = new window.AMap.Map('Container', {
            resizeEnable: true,
            zoom: 11,
            showIndoorMap: true
        });
        this.mapInstance.on('complete', () => {
            const markerIcon = {
                icon: 'https://webapi.window.AMap.com/theme/v1.3/markers/n/mark_r.png',
                label: '自定义选点',
            };
            this.mapInstance.plugin(['window.AMap.MouseTool'], () => {
                this.AMapTool = new window.AMap.MouseTool(this.mapInstance);
                this.AMapTool.marker(markerIcon); // 启用marker工具
                this.AMapTool.on('draw', ({ type, obj }) => {
                    this.AMapTool.close(true); // 关闭marker工具
                    this.AMapTool.marker(markerIcon); // 启用marker工具
                    this.mapInstance.setFitView(obj);
                    this.mapInstance.setZoom(this.AMapZoom < 17 ? 17 : this.AMapZoom);
                    this.props.form.setFieldsValue({ location: obj.getPosition() });
                    if (this.POISelectMarker) {
                        this.POISelectMarker.hide();
                        this.mapInstance.clearInfoWindow()
                    }
                });
            });
            window.AMap.plugin('window.AMap.Autocomplete', () => {
                let autoOptions = {
                    input: 'search',
                };
                this.autoComplete = new window.AMap.Autocomplete(autoOptions);
            });
            window.AMap.plugin('window.AMap.PlaceSearch', () => {
                let autoOptions = {
                    city: '全国',
                    map: this.mapInstance
                };
                this.placeSearch = new window.AMap.PlaceSearch(autoOptions);
            });
            this.mapInstance.on('click', () => {
                if (this.AMapTool) {
                    this.AMapTool.marker(markerIcon);// 启用marker工具
                }
            });
            this.mapInstance.on('zoomend', () => {
                this.AMapZoom = this.mapInstance.getZoom();
            });
            this.setState({
                mapLoading: false,
            })
        })
    }

    // 组件卸载之前
    componentWillUnmount () {
        this.mapInstance.destroy()
    }

    // 自动补全
    autoInput () {
        let keyword = document.getElementById("search").value;
        if (keyword) {
            this.autoComplete.search(keyword, (status, result) => {
                if (status === 'complete') {
                    let tips = result.tips;
                    // console.log('提示地点：', tips);
                    let POIMenu = tips.map(item => (
                        <MenuItem data-tip={item}
                                  key={`${item.adcode}_${item.name}_${item.location.lng}_${item.location.lat}`}>
                            <div>{item.name}</div>
                            <div className='tipItem'>{item.district + item.address}</div>
                        </MenuItem>
                    ));
                    this.setState({
                        dropDownVisible: true,
                        POIMenu
                    });
                } else {
                    // message.warning('查询失败')
                }
            });
        } else {
            this.setState({
                dropDownVisible: false,
            });
        }
    }

    // 选中下拉列表中的兴趣点
    selectPOI (obj) {
        // console.log(obj);
        let name = obj.key.split('_')[1];
        this.placeSearch.search(name, (status, result) => {
            if (status === 'complete') {

            }else if (status === 'error') {
                message.warning(result)
            }else if (status === 'no_data') {
                message.warning('没有找到相关地点')
            }
        });
        this.props.form.setFieldsValue({ search: name });
        this.setState({
            dropDownVisible: false,
        });
        // marker点击事件
        this.placeSearch.on('markerClick', (a) => {
            // console.log('POI点击：', a);
            this.AMapTool.close(true); // 关闭marker工具
            if (this.POISelectMarker) {
                this.POISelectMarker.show();
            }
            this.mapInstance.setZoom(this.AMapZoom < 17 ? 17 : this.AMapZoom);
            const data = a.data;
            this.POISelectMarker = a.marker;
            if (data) {
                const detailAddress = `${data.pname}${data.cityname}${data.adname}${data.name}`;
                const location = data.location;
                this.props.form.setFieldsValue({ address: detailAddress, location: location });
            }
        })
    }

    render () {
        const { POIMenu, dropDownVisible, mapLoading } = this.state;
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const POIMenu1 = (
            <Menu onClick={this.selectPOI.bind(this)}>
                {
                    POIMenu.map(item => item)
                }
            </Menu>
        );
        return (
            <Spin spinning={mapLoading} tip='加载中...'>
                <Form>
                    <div style={{ width: '100%', height: '500px' }}>
                        <div id='Container' style={{ width: '100%', height: '500px' }}>
                            {/*输入地址栏*/}
                            <div style={{
                                width: 300,
                                height: 100,
                                padding: 20,
                                border: '1px solid #D9D9D9',
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                background: '#fff',
                                zIndex: 999,
                            }} id='panel'>
                                <FormItem label='输入地址'>
                                    <Dropdown overlay={POIMenu1} visible={dropDownVisible}>
                                        {getFieldDecorator('search', {
                                            rules: [{
                                                required: false,
                                                message: '输入地址！'
                                            }]
                                        })(
                                            <Input placeholder='请输入' onChange={this.autoInput.bind(this)}/>
                                        )}
                                    </Dropdown>
                                </FormItem>
                            </div>
                        </div>
                    </div>
                    <Row style={{ padding: 20 }}>
                        <FormItem label='详细地址'>
                            {getFieldDecorator('address', {
                                rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: '请输入地址！'
                                },{
                                    max: 50,
                                    message: '考勤地址最多输入50位！'
                                }],
                            })(
                                <Input placeholder='请输入'/>
                            )}
                        </FormItem>
                        <FormItem style={{ display: 'none' }}>
                            {getFieldDecorator('location')(
                                <Input placeholder='请输入'/>
                            )}
                        </FormItem>
                    </Row>
                </Form>
            </Spin>
        );
    }
}

export default Form.create()(AttendanceAddressModal)

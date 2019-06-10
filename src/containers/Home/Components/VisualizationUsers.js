import React, {Component, Fragment} from 'react';
import {Button, Input, Row, Tree} from "antd";
import ProTypes from 'prop-types';

class VisualizationUsers extends Component {

    constructor(props) {
        super(props);
        this.payLoad = {};
    }

    state = {};

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    // 人员树形选择器的选择事件
    onSelect(selectedKeys, info) {
        console.log('selected', selectedKeys, info);
    };

    // 人员树形选择器的checked事件
    onCheck(checkedKeys, info) {
        console.log('onCheck', checkedKeys, info);
    };

    render() {
        const { TreeNode } = Tree;
        const treeData = [
            {
                title: '梧州市',
                key: '0-0',
                content: '',
                children: [
                    {
                        title: '万秀区',
                        key: '0-0-1',
                        children: [
                            {
                                title: '人员1',
                                key: '0-0-1-0',
                                content: '',
                            },
                            { title: '人员2', key: '0-0-1-1' },
                            { title: '人员3', key: '0-0-1-2' },
                        ],
                    }, {
                        title: '长洲区',
                        key: '0-0-2',
                        children: [
                            { title: '人员1', key: '0-0-2-0' },
                            { title: '人员2', key: '0-0-2-1' },
                            { title: '人员3', key: '0-0-2-2' },
                        ],
                    }, {
                        title: '龙圩区',
                        key: '0-0-3',
                        children: [
                            { title: '人员1', key: '0-0-3-0' },
                            { title: '人员2', key: '0-0-3-1' },
                            { title: '人员3', key: '0-0-3-2' },
                        ],
                    }
                ],
            }];
        const renderTreeNodes = data => data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} />;
        });
        return (
            <Fragment>
                <Row type='flex' align='middle' style={{ marginBottom: 10 }}>
                    <label>姓名：</label>
                    <Input style={{ flexGrow: 1, width: 'unset' }} placeholder="请输入"
                           onChange={(e => this.payLoad.name = e.target.value)}/>
                </Row>
                <Row type='flex' align='middle' style={{ marginBottom: 10 }}>
                    <label>工号：</label>
                    <Input style={{ flexGrow: 1, width: 'unset' }} placeholder="请输入"
                           onChange={(e  => this.payLoad.jobNumber = e.target.value)}/>
                </Row>
                <Row style={{ marginBottom: 10 }}>
                    <Button style={{ width: '100%' }} type='primary'
                            onClick={this.props.searchUsers(this.payLoad)}>查询</Button>
                </Row>
                <Row style={{ height: 470, overflowY: 'auto' }}>
                    <Tree
                        defaultCheckedKeys={['0-0-2', '0-0-1']}
                        onSelect={this.onSelect.bind(this)}
                        onCheck={this.onCheck.bind(this)}
                    >
                        {renderTreeNodes(treeData)}
                    </Tree>
                </Row>
            </Fragment>
        );
    }
}

VisualizationUsers.proTypes = {
    searchUsers: ProTypes.func,
    usersList: ProTypes.array
};
export default VisualizationUsers;

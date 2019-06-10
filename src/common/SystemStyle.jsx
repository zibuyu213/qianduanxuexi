//全局样式定义
export var custom = (function() {
    const menuStyle = {
        width: "100%",
        height:"calc(100vh - 64px)",
        minHeight:"374px"
    };

    const logoStyle = {
        width:"120px",
        height:"32px",
        background: "rgba(255,255,255,0.2)",
        margin: "16px 28px 16px 0",
        float: "left"
    };

    const contentStyle = {
        background: '#fff',
        padding: 24,
        margin: 0,
        height:"calc(100vh-138px)"
    };

    const paginationStyle = {
        float:"right",
        marginTop:"22px"
    };

    const clear = {
        clear:"both"
    };

    const hide = {
        display:"none"
    };

    return {
        menuStyle: menuStyle,
        logoStyle: logoStyle,
        contentStyle: contentStyle,
        paginationStyle:paginationStyle,
        clear: clear,
        hide: hide,
    }
}());


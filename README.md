# parking_manage

#### 项目介绍
大树停车平台（中台管理端）

**一、项目目录结构**
 parking_manage 管理端： 使用React+Antd（https://ant.design/docs/react/introduce-cn）

 - 以车主端作为示例，主目录下有app、resources、node_modules三个目录。


 **_（一）app目录下放置客户端页面与功能的主要代码_**

```
    common 目录下主要放置大多数页面所需要的组件和公用文件,import后即可使用。
    这里说一下模拟数据请求，我们在index.html页面中引入了mock.js，在具体项目文件中引入common/HttpClient.jsx进行数据请求，可设置truth/mock两种类型：
    ————在"truth"环境下，真实请求后端接口获取数据。
    ————在"mock"环境下，Mock.js生成随机数据拦截Ajax 请求，达成前后端分离，让前端攻城师独立于后端进行开发，增加单元测试的真实性，通过随机数据，模拟各种场景。
    * 参考例子->IndexContainer/Components/Example.jsx *
    首先在文件中引入HttpClient，在组件初始化完成后（componentDidMount方法中）调用数据请求。
            HttpClient.query("/mapinfos", "POST", data, this.configData.bind(this));
            ————"/mapinfos"为接口名，"POST"表示post请求，configData为请求的回调方法
            ————configData（d,type）接收数据和判断成功与否，将数据渲染至页面
```
```
    config 目录下主要放置项目页面的路由配置文件route.jsx或redux相关文件。
```
```
    containers 目录下主要放置项目页面的构建代码，每一个子的文件夹都是一个独立的页面。
           ————ParkingApplication:我要停车
           ————PurseRecharge:钱包充值
           ————ParkingHistory:停车记录
           ————UserCenter:个人中心

```

```
    index.jsx为项目主入口的相关文件，为框架自带。主要配置了浏览历史等内容。
```


 **_（二）resources目录为项目的资源目录_**

```
    css 目录放置项目公有样式的文件。
```
```
    images 目录放置项目图片资源。
```
```
    js 目录放置项目公有或引入的js代码或者库，如用于mock与request的封装类request.js。
```

 **_（三）node_modules_**

```
    目录由node自动生成，用于管理通过npm安装的第三方库及其依赖。
```

- 主目录下还有以下文件

 **_（一）index.html_**

```
    项目入口页面。
```

 **_（二）package.json_**

```
    项目依赖管理以及脚本配置文件。
```

 **_（三）webpack.config.js_**

```
    项目打包配置文件，项目的入口、依赖资源、打包配置等都将在这里进行配置
```
**二、代码规范**

   **_(一)命名规范_**

>     1.工程目录下代码文件夹命名，每个单词的首字母均要求大写。如：ParkingApplication文件夹，所代表的就是停车申请模块的目录，目录下的文件即构建整个功能页的所有文件。

>     2.项目类命名，每个单词的首字母均要求大写。如ParkingApplication.jsx，则为申请页面。

>     3.工程目录下资源文件夹命名，每个单词之间使用下划线间隔，每个单词均不大写。如：user_style文件夹，所代表的就是个人中心的css文件都存放在该目录下。

>     4.图片文件的命名，如若是有对应页面的图片，命名规则为：页面名+下划线+功能，均是小写。如：index_message.png，所代表的就是首页的消息图标；如若是公有图片，则直接通过功能描述来命名，单词均为小写，单词之间使用下划线连接。如：left_back_icon.png，则为箭头朝左的返回图标。

>     5.项目代码内的方法，变量的命名都遵循驼峰命名的规则。

>     6.css文件中的classname的命名规范，要求以页面+下划线+功能的形式命名。如：purse_detail_item_status_icon，则表示钱包明细列表中每一项状态图标的样式名。

```
    注意：禁止使用中文拼音来对一切命名。
```

  **_（二）书写规范_**

>     1.等式左右需要键入空格。

>     2.使用let代替var。

>     3.简单的条件判断使用 a = b ? 0 : 1;

>     4.每句代码后必须加『;』。

  **_（三）注释规范_**

>     1.可独占一行, 前边不许有空行, 缩进与下一行代码保持一致

>     2.使用于以下场景

  -     难于理解的代码段

  -     可能存在错误的代码段

  -     浏览器特殊的HACK代码

  -     想吐槽的产品逻辑, 合作同事

  -     业务逻辑强相关的代码

#### 新手安装教程
    请先确保你已经安装了npm或是cnpm -_-
  ·    打开终端，进入你要操作的项目路径，例如 cd xxx/parking_app/parking_manage
  ·    若首次进入项目，先在终端输入 npm install ，回车，之后则可跳过这步直接启动
  ·    等执行完成之后，输入npm start ，回车，这样项目就启动好了
  ·    在浏览器上查看，例如：http://localhost:8000/#/
#### 全局相关
- 接口线上调用地址：http://47.92.233.11:9527 ，在HttpClient文件下统一配置
- 接口各个模块的前缀在global.js文件中定义
- 侧边栏菜单存储变量和生成函数在global中定义，以便全局访问
- 面包屑在components的GreyBreadcrumb中定义生成


#### 新增需求(合并的190308分支)
- 路段增加车检器参数
- 泊位管理(报警)

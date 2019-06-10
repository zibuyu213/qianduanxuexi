import {message} from 'antd';
import {HttpClient} from "./HttpClient";
import {TimeUtils, Global} from "./SystemFunction"

export function getUploadObj(option = {}) {
    option.root = option.root ? option.root : '';
    let g_dirname = option.root;
    let g_object_name = '';
    let config = {};
    // 获取签名
    this.getPromise = function (fn) {
        HttpClient.query(window.MODULE_PARKING_INFO+'/admin/getOssSign', "GET", {dir: option.root}, (d, type) => {
            if (type == HttpClient.requestSuccess) {
                //请求成功
                config = d.data;
                fn();
            } else {
                if (type === HttpClient.requestDataError) {
                    message.error(d.error.message);
                } else {
                    message.error("服务异常");
                }
            }
        });
    };

    /**
     * 上传文件到服务器
     * @param browse 触发文件选择对话框的DOM元素, 可为undefined
     * @param maxsize 文件最大大小限制，单位kb
     * @param filetype 文件类型(mime_types)限制，多个类型以,分割，"png,JPG,gif"
     * @param fileObj 文件对象
     * @param url OSS云服务器HOST地址
     * @param dir OSS服务器文件对象名称
     * @param policy OSS服务器policy
     * @param accessid OSS服务器accessid
     * @param signature OSS服务器signature
     * @param oncompelet(fileurl)
     * @param onprogress(file, percent)
     * @param onerror(file, code, content)) code说明(-600 文件大小超限, -601文件类型不符, -602文件已传, 其他)
     */
    this.uploadToOSS = function (fileObj, onprogress, oncompelet, onerror) {
        // var browseobj = browse;
        // if (!browseobj) {
        var browseobj = document.createElement("selectfiles");
        // }
        // 创建上传对象
        // console.log('uploadToOSS', fileObj)
        var upObj = new window.plupload.Uploader({
            runtimes: 'html5,flash,silverlight,html4',
            multi_selection: false,
            browse_button: browseobj,
            flash_swf_url: 'plupload-2.1.2/js/Moxie.swf',
            silverlight_xap_url: 'plupload-2.1.2/js/Moxie.xap',
            // url : url,
            url: 'http://oss.aliyuncs.com',

            // filters: {
            // 	mime_types : [ { title : "Image files", extensions : filetype } ], //只允许上传图片文件
            // 	max_file_size : maxsize + 'kb', // 最大只能上传(maxsize)kb的文件
            // 	prevent_duplicates : true //不允许选取重复文件
            // },

            init: {
                PostInit: function () {
                    // console.log("plupload->PostInit ok");
                    // 将文件加入上传队列
                    upObj.addFile(fileObj, fileObj.value);
                },

                FilesAdded: function (up, files) {
                    // console.log("plupload->FilesAdded", up, files);
                    // 启动文件传输
                    upObj.start();
                },

                BeforeUpload: function (up, file) {
                    // console.log("plupload->BeforeUpload", up, file);
                    let filename = file.name;
                    g_object_name = g_dirname;
                    if (filename != '') {
                        calculate_object_name(filename)
                    }

                    var new_multipart_params = {
                        'key': g_object_name,
                        'policy': config.policy,
                        'OSSAccessKeyId': config.accessId,
                        'success_action_status': '200', // 让服务端返回200, 不然，默认会返回204
                        'signature': config.signature,
                    };

                    upObj.setOption({
                        'url': config.host,
                        'multipart_params': new_multipart_params
                    });
                },

                UploadProgress: function (up, file) {
                    console.log("plupload->process=" + file.percent + "%");
                    if (onprogress) {
                        onprogress({percent: file.percent});
                    }
                },
                FileUploaded: function (up, file, info) {
                    // console.log('FileUploaded', up, file, info)
                    if (info.status == 200) {
                        option.success && option.success({data: config.host +"/"+ g_object_name, msg: "上传成功"});
                        // console.log(config.host + g_object_name)
                    }
                    else {
                        option.error && option.error(new Error(info.response), info.response);
                    }
                },

                UploadComplete: function (up, file) {
                    // console.log("plupload->complete");
                    // 传输完毕销毁资源
                    up.destroy();
                },

                Destroy: function (up) {
                    // console.log("plupload->destroy");
                },

                Error: function (up, err) {
                    // console.log("plupload->Error=", err);
                    if (onerror) {
                        onerror(err.code, err.response);
                    }
                }
            }
        });
        // 初始化
        upObj.init();
        upObj.disableBrowse(true);
    }

    //
    function random_string(len) {
        len = len || 32;
        let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        let maxPos = chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

    //
    // //创建文件名
    function calculate_object_name(filename) {
        let time = new Date();
        let time2 = TimeUtils.convertTimestampToStringWithDate(TimeUtils.getCurrentTimestamp());
        g_object_name = `${g_dirname}/${time2}/${time.getTime()}-${random_string(10)}/${filename}`;
        return ''
    }

    this.setOption = function (opt) {
        option = Object.assign({}, option, opt);
    };

}

//noinspection JSUnresolvedFunction
/**
 * Created with IntelliJ IDEA.
 * User: 松松
 * Date: 13-1-11
 * Time: 下午12:00
 * 接受用户上传的文件，每次只能上传一个文件
 */

var fs = require('fs');
var DB = require('db');
var path = require('path');
var im = require('imagemagick');
var GridStore = DB.mongodb.GridStore;
var ObjectID = DB.mongodb.ObjectID;

//最大只允许上传150MB的文件
var fileSize = 150 * 1024 * 1000;

exports.saveFile = function (req, res) {

    res.header('Content-Type', 'text/json;charset=utf-8');

    var files = Array.isArray(req.files.file) ? req.files.file : [req.files.file];

    var tempFile = [];

    var serverInfo = {
        err: []
    };

    //虽然本方法每次“只接收”一个文件，但expressjs仍然会接收所有文件放入回收站中。
    files = files.filter(function (f) {
        if (f.size <= fileSize) {
            tempFile.push(f.path);
            return true;
        } else {
            //大于fileSize的文件，直接删除
            fs.unlink(f.path);
            serverInfo.err.push('不能上传大于' + fileSize + '的文件');
            return false;
        }
    });

    if (!require('./login').isLogin(req)) {
        serverInfo.err.push('请先登陆');
        end();
        return;
    }

    if (files.length !== 1) {
        serverInfo.err.push('必须且只能上传1个文件');
        end();
        return;
    }

    files = files[0];

    if (files.size < 1) {
        serverInfo.err.push('不允许上传0字节文件');
        end();
        return;
    }

    var fileInfo = {};
    //生成一一对应的文件ID
    files.fileId = new ObjectID();

    fileInfo.name = files.name;
    fileInfo.path = path.basename(files.path);

    var options = {
        chunk_size: 102400,
        metadata: { }
    };

    //如果上传的是图片
    var extName = path.extname(files.name).substring(1).toLowerCase();
    if (extName === '') extName = 'unknown';

    console.log('文件名为：' + files.name, '文件扩展名是：' + extName);

    if (allowFile[extName]) {
        //检查是否为有效图片
        console.log('开始对' + files.name + '文件进行合法性效验');
        im.identify(['-format', '%wx%hx%m', files.path + '[0]'], function (err, output) {
                if (!err) {
                    console.log(files.name + '通过合法性效验');
                    output = output.trim().split('x');

                    files.width = parseInt(output[0], 10);
                    files.height = parseInt(output[1], 10);
                    //文件的真实格式
                    files.format = output[2].toLowerCase();

                    console.log('有效的图片文件，原始扩展名' + extName, '真实扩展名' + files.format);

                    options.metadata.origin_name = files.name.substring(0, files.name.lastIndexOf('.') + 1) + files.format;
                    options.metadata.ext = files.format;

                    options.metadata.width = files.width;
                    options.metadata.owner = req.session._id;
                    options.metadata.height = files.height;

                    //将meta信息发送会浏览器端
                    serverInfo.metadata = {
                        width: files.width,
                        height: files.height,
                        ext: files.format
                    };

                    //保存原始文件
                    var originFileName = files.fileId;
                    var gs = new GridStore(DB.dbServer, originFileName, originFileName, "w", options);
                    gs.writeFile(files.path, function (err) {
                        if (!err) {
                            end();
                        } else {
                            serverInfo.err.push('无法保存' + files.name);
                            end();
                        }
                    });
                } else {
                    console.log('无效的图片文件', err);
                    serverInfo.err.push('无效的图片文件');
                    end();
                }
            }
        )
    } else {
        //其它格式，直接进行转换
        saveOriginFile();
    }

    function end() {
        if (serverInfo.err.length < 1) {
            delete serverInfo.err;
            serverInfo.origin_name = files.name;
            serverInfo.size = files.size;
            serverInfo._id = files.fileId;
        }
        res.end(JSON.stringify(serverInfo, undefined, '    '));
        unlink(tempFile);
    }

    function saveOriginFile() {
        console.log('非图片格式，直接进行保存，文件类型是：' + extName);
        options.metadata.origin_name = files.name;
        var fileName = files.fileId;
        var gs = new GridStore(DB.dbServer, fileName, fileName, "w", options);
        gs.writeFile(files.path, function (err) {
            if (!err) {
                console.log(files.name + '保存成功');
            } else {
                serverInfo.err.push(fileName + '无法保存');
                console.log(files.name + '保存失败', err);
            }
            end();
        });
    }
};

var allowFile = {
    'jpg': 'image/jpg',
    'jpeg': 'image/jpg',
    'gif': 'image/gif',
    'png': 'image/png',
    'psd': 'image/psd',
    'bmp': 'image/bmp'
};

/*
 该方法并不能完全解决问题
 此处应该使用定时程序，来做处理
 */

function unlink(list) {
    if (list.length < 1) return;
    var cur = list.shift();
    fs.unlink(cur, function (err) {
        if (!err) {
            console.log(cur + '\t already unlink');
        } else {
            console.log('unlink fail', err);
        }
        if (list.length > 0) unlink(list);
    })
}

var app = require('app');

app.post('/save-file', exports.saveFile);

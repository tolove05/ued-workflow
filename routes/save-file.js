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

exports.saveFile = function (req, res) {

    res.header('Content-Type', 'text/html;charset=utf-8')

    var files = Array.isArray(req.files.file) ? req.files.file : [req.files.file];

    //每次只允许上传一个文件，多个文件，请客户端多次发送
    files = files[0];
    if (!files || !files.name) {
        res.end('您没有选择文件')
        return;
    }

    var fileInfo = {};
    //生成一一对应的文件ID
    files.fileId = new ObjectID().toString();

    fileInfo.name = files.name;
    fileInfo.path = path.basename(files.path);

    setTimeout(function () {
        res.end(JSON.stringify(fileInfo, undefined, '    '));
    }, 2000);

    var tempFile = [];

    tempFile.push(files.path);

    var options = {
        chunk_size: 102400,
        metadata: { }
    };

    var fileId = files.fileId;

    //如果上传的是图片
    var extName = path.extname(files.name).substring(1).toLowerCase();

    console.log('文件名为：' + files.name, '文件扩展名是：' + extName);

    if (allowFile[extName]) {
        //检查是否为有效图片
        console.log('检查是否为有效图片');
        im.identify(['-format', '%wx%hx%m', files.path + '[0]'], function (err, output) {
                if (!err) {

                    output = output.trim().split('x');

                    files.width = parseInt(output[0], 10);
                    files.height = parseInt(output[1], 10);
                    //文件的真实格式
                    files.format = output[2].toLowerCase();

                    console.log('有效的图片文件，原是扩展名' + extName, '真实扩展名' + files.format);

                    options.metadata.origin_name = files.name.substring(0, files.name.lastIndexOf('.') + 1) + files.format;
                    options.ext_name = files.format;

                    options.metadata.width = files.width;
                    options.metadata.height = files.height;

                    //保存原始文件
                    var gs = new GridStore(DB.dbServer, fileId + '_origin', fileId + '_origin', "w", options);
                    gs.writeFile(files.path, function (err) {
                        if (!err) {
                            convertAndSaveJPG(files, options, fileId);
                        } else {
                            console.log('PSD保存失败');
                            unlink(tempFile);
                        }
                    });
                } else {
                    console.log('无效的图片文件', err);
                    unlink(tempFile);
                }
            }
        )
    } else {
        //其它格式，直接进行转换
        console.log('非图片格式，直接进行保存，文件类型是：' + extName);
        var gs = new GridStore(DB.dbServer, fileId + '_origin', fileId + '_origin', "w", options);
        gs.writeFile(files.path, function (err) {
            if (!err) {
                console.log(files.name + '保存成功');
            } else {
                console.log(files.name + '保存失败', err);
            }
            unlink(tempFile);
        });
    }

    function convertAndSaveJPG(cur, options, fileId) {
        //转换为JPG格式
        console.log('将' + cur.name + '转换为jpg');
        var jpgPath = path.join(path.dirname(cur.path), fileId + '.jpg');
        options.content_type = 'image/jpeg';
        try {

            im.convert([cur.path + '[0]', '-quality', '0.8', jpgPath], function (err) {
                if (!err) {
                    console.log(cur.name + '已经成功转换为jpg');
                    tempFile.push(jpgPath);
                    var gs = new GridStore(DB.dbServer, fileId, fileId, "w", options);
                    gs.writeFile(jpgPath, function (err) {
                        if (!err) {
                            console.log(cur.name + '的jpg格式已经入库');
                            cur.path = jpgPath;
                        } else {
                            console.log(cur.name + '无法入库');
                        }
                        unlink(tempFile);
                    });
                } else {
                    console.log(cur.name + '转换到jpg失败', err);
                    unlink(tempFile);
                }
            });
        } catch (e) {
            console.log(e);
            unlink(tempFile);
        }
    }
}


var allowFile = {
    'jpg': 'image/jpg',
    'jpeg': 'image/jpg',
    'gif': 'image/gif',
    'png': 'image/png',
    'psd': 'image/psd'
};

/*
 该方法并不能完全解决问题
 此处应该使用定时程序，来做处理
 */
function unlink(list) {
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
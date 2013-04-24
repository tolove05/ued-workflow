//noinspection JSUnresolvedFunction
/**
 * Created with IntelliJ IDEA.
 * User: 松松
 * Date: 13-1-11
 * Time: 下午12:00
 * To change this template use File | Settings | File Templates.
 */

var fs = require('fs');
var DB = require('db');
var path = require('path');
var im = require('imagemagick');
var GridStore = DB.mongodb.GridStore;
var ObjectID = DB.mongodb.ObjectID;

exports.saveFile = function (req, res) {

    res.header('Content-Type', 'text/html;charset=utf-8')
    if (!req.files.file) {
        res.end('你必须上传至少一个文件')
        return;
    }

    var files = Array.isArray(req.files.file) ? req.files.file : [req.files.file];

    var fileInfo = {};
    //生成一一对应的文件ID
    files = files.map(function (item) {
        item.fileId = new ObjectID().toString();
        fileInfo.name = item.name;
        fileInfo.path = path.basename(item.path);
        return item
    });

    setTimeout(function () {
        res.end(JSON.stringify(fileInfo, undefined, '    '));
    }, 2000);

    //存为数组以方便递归处理
    _savePsd(files, req, res);

};

var allowFile = {
    'jpg': 'image/jpg',
    'jpeg': 'image/jpg',
    'gif': 'image/gif',
    'png': 'image/png',
    'psd': 'image/psd'
};

//递归保存每个文件日志、文件实体和对应缩略图
function _savePsd(files, req, res) {

    var tempFile = [];

    function save() {

        if (files.length < 1) {
            console.log('文件已经全部上传完毕，开始删除临时文件');
            unlink(tempFile);
            return;
        }

        var cur = files.shift();

        tempFile.push(cur.path);

        var options = {
            chunk_size: 102400,
            metadata: { }
        };

        var fileId = cur.fileId;

        //如果上传的是图片
        var extname = path.extname(cur.name).substring(1).toLowerCase();

        console.log('文件名为：' + cur.name, '文件扩展名是：' + extname);

        if (allowFile[extname]) {
            //检查是否为有效图片
            console.log('检查是否为有效图片');
            im.identify(['-format', '%wx%hx%m', cur.path + '[0]'], function (err, output) {
                    if (!err) {

                        output = output.trim().split('x');

                        cur.width = parseInt(output[0], 10);
                        cur.height = parseInt(output[1], 10);
                        //文件的真实格式
                        cur.format = output[2].toLowerCase();

                        console.log('有效的图片文件，原是扩展名' + extname, '真实扩展名' + cur.format);

                        options.metadata.origin_name = cur.name.substring(0, cur.name.lastIndexOf('.') + 1) + cur.format;
                        options.ext_name = cur.format;

                        options.metadata.width = cur.width;
                        options.metadata.height = cur.height;

                        //保存原始文件
                        var gs = new GridStore(DB.dbServer, fileId + '_origin', fileId + '_origin', "w", options);
                        gs.writeFile(cur.path, function (err) {
                            if (!err) {
                                convertAndSaveJPG(cur, options, fileId);
                            } else {
                                console.log('PSD保存失败');
                                save();
                            }
                        });
                    } else {
                        console.log('无效的图片文件', err);
                        save();
                    }
                }
            )
        } else {
            //其它格式，直接进行转换
            console.log('非图片格式，直接进行保存，文件类型是：' + extname);
            var gs = new GridStore(DB.dbServer, fileId + '_origin', fileId + '_origin', "w", options);
            gs.writeFile(cur.path, function (err) {
                if (!err) {
                    console.log(cur.name + '保存成功');
                } else {
                    console.log(cur.name + '保存失败', err);
                }
                save();
            });
        }
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
                        save();
                    });
                } else {
                    console.log(cur.name + '转换到jpg失败', err);
                    save();
                }
            });
        } catch (e) {
            console.log(e);
            save();
        }
    }

    save();

}


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
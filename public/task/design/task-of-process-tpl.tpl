#each(item in data)
<dl>
    <dt>
        #{user[item.user_id]}
        #if(item.type==2)
        <span class="label label-info">请求上级审核</span>
        #elseif(item.type==3)
        <span class="label label-warning">设计稿需要进行修改</span>
        #elseif(item.type==4)
        <span class="label label-success">恭喜，设计稿通过审核啦</span>
        #elseif(item.type==5)
        <span class="label label-danger">该需求被关闭</span>
        #end
    </dt>
    <dd>
        #if(item.content)
        <div class="content">#{item.content}</div>
        #end
        #if(item.files)
        <div class="files" style="border: solid 1px #eee">
            <h5>有#{item.files.length}个附件</h5>
            <table class="table table-condensed" style="font-size: 12px">
                #each(file,index,arr in item.files)
                #run var fileName=file.origin_name.substring(file.origin_name.indexOf('/')+1);
                <tr>
                    <td><a href="/read/#{file._id}" download="#{fileName}"> #{fileName} </a>
                        <span> #if(file.size<1024*1024) #{(file.size/1024).toFixed(2)}Kb #elseif(file.size>=1024*1204)  #{(file.size/(1024*1024)).toFixed(2)} Mb #end</span>
                    </td>
                    <td></td>
                    <td><a href="#{fileName}"></a></td>
                </tr>
                #end
            </table>
        </div>
        #end
    </dd>
</dl>
#end

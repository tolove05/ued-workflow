#if(typeof data==='object')
#if(data.length>0)
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
        <span class="J-moment moment" style="font-size: 12px;font-weight: normal"
              data-time-stamp="#{item.time_stamp}"></span>
    </dt>
    <dd>
        #if(item.content)
        <div class="content">#{item.content}</div>
        #end
        #if(item.files)
        <div class="files">
            <p>有#{item.files.length}个附件：
                #each(file,index,arr in item.files)
                #run var fileName=file.origin_name.substring(file.origin_name.indexOf('/')+1);
                <a href="/read/#{file._id}" download="#{fileName}"> #{fileName}
                    <span class="badge"> #if(file.size<1024*1024) #{(file.size/1024).toFixed(2)}Kb #elseif(file.size>=1024*1204)  #{(file.size/(1024*1024)).toFixed(2)} Mb #end</span></a>
                #end
            </p>
        </div>
        #end
    </dd>
</dl>
#end
#else
<div class="alert alert-danger">
    <h4>该任务还没有任何进度记录</h4>

    <p>#if(typeof msg!=='undefined')#{msg}#end </p>
</div>
#end
#end
#if(typeof err !=='undefined' && err instanceof Array)
<div class="alert alert-danger">
    <h4>没有任何数据</h4>

    <p>#{err.join('')}</p>
</div>
#end

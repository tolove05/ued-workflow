<form class="add-multiple-task" name="add-multiple-task">
    #if(step==1)
    <textarea name="excel-data" placeholder="粘贴Excel数据，为5列：设计师，任务名，需求方，任务时长，任务类型">#if(typeof textareaValue==='string')#{textareaValue}#end</textarea>
    <input type="button" class="btn btn-primary J-add-multiple-task J-next" value="开始分析数据" data-step="2">
    #elseif(step==2)
    <div class="content">
        <h3>总共有 #{sumLength}条任务#if(sumLength>12)，以下仅显示前12条#end。</h3>

        <p>你需要指定：设计师，任务名，需求方，任务时长，任务类型</p>
        <table>
            <tr>
                #each(row,i in data[0])
                <th class="J-menu" data-cell="#{i}">
                    <div class="wrapper">
                        <div class="fields-name">请选择</div>
                    </div>
                </th>
                #end
            </tr>
            #each(row,index in data)
            #if(index<12)
            <tr>
                #each(item in row)
                <td>
                    <div class="wrapper">#{item}</div>
                </td>
                #end
            </tr>
            #end
            #end
        </table>
        #if(sumLength>12)<p>多余的 #{sumLength-12} 条未显示</p>#end
    </div>
    <input type="button" name="step" class="btn btn-default J-add-multiple-task J-go-back" value="&lt;&lt; 重新粘贴数据" data-step="1">
    <input type="button" name="step" class="btn btn-primary J-add-multiple-task J-preview" value="预览数据 &gt;&gt;" data-step="3">
    #elseif(step==3)
    <div class="content" style="height: 400px;overflow: auto;">
        <div>
            <label><input type="radio" name="company" checked="checked" value="阿里巴巴">阿里巴巴</label>
            <label><input type="radio" name="company" value="京东">京东</label>
            <label><input type="radio" name="company" value="腾讯">腾讯</label>
            <label><input type="radio" name="company" value="其他">其他</label>
        </div>
        <table>
            <tr>
                #each(name in fieldsArray)
                <th>
                    <div class="wrapper">
                        <div class="fields-name">#{name}</div>
                    </div>
                </th>
                #end
            </tr>
            #each(row in data)
            <tr>
                #each(_row in row)
                <td>
                    <div class="wrapper">#{_row}</div>
                </td>
                #end
            </tr>
            #end
        </table>
    </div>
    <input type="button" name="step" class="btn btn-default J-add-multiple-task J-go-back" value="&lt;&lt;返回上一步" data-step="2">
    <input type="button" name="step" class="btn btn-primary J-add-multiple-task J-save" value="保存任务并通知设计师 &gt;&gt;" data-step="4">
    #elseif(step==4)
    <p>已经提交任务单：以下是服务器返回的详情：</p>
        #if(serverInfo.status<1)
            <p style="color:red;">发生错误：<br>#{serverInfo.err.join('<br>')}</p>
        #else
            <p style="color:green;">已经成功添加#{serverInfo.rows}个任务！</p>
            #if(serverInfo.taskError.length>0)
            <p>但是，有#{serverInfo.taskError.length} 条任务保存失败，具体原因如下：</p>
                #each(item in serverInfo.taskError)
                <p>#{item}</p>
                #end
                <p>已经将错误信息，保存在了通知列表处，您可以随时翻阅。</p>
            #end
        #end
    #end
</form>

<form class="add-multiple-task" name="add-multiple-task">
    #if(step==1)
    <textarea name="excel-data" placeholder="在这里粘贴Excel数据，注意：不能出现空单元格哦">#if(typeof textareaValue==='string')#{textareaValue}#end</textarea>
    <input type="button" class="btn J-add-multiple-task J-next" value="开始分析数据" data-step="2">
    #elseif(step==2)
    <div class="content">
        <h3>总共有 #{sumLength}条任务，以下仅显示前12条。</h3>

        <p>你需要指定：设计师，任务名，需求方，需求方电话，任务时长，任务类型</p>
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
    <input type="button" name="step" class="btn J-add-multiple-task J-go-back" value="&lt;&lt; 重新粘贴数据" data-step="1">
    <input type="button" name="step" class="btn J-add-multiple-task J-preview" value="预览数据 &gt;&gt;" data-step="3">
    #elseif(step==3)
    <div class="content" style="height: 400px;overflow: auto;">
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
    <input type="button" name="step" class="btn J-add-multiple-task J-go-back" value="&lt;&lt;返回上一步" data-step="1">
    <input type="button" name="step" class="btn J-add-multiple-task" value="保存任务并通知设计师 &gt;&gt;" data-step="4">
    #end
</form>

#each(item in data)
<dl>
    <dt>#{user[item.user_id]}</dt>
    <dd>
        <div class="content">#{item.content}</div>
        #if(item.files)
        <div class="files">
            <table class="table table-condensed" style="font-size: 12px">
                #each(file,index,arr in item.files)
                #run var fileName=file.substring(file.indexOf('/')+1);
                <tr>
                    <td>#{fileName}</td>
                    <td>#{item.files}</td>
                    <td><a href="#{fileName}"></a></td>
                </tr>
                #end
            </table>
        </div>
        #end
    </dd>
</dl>
#end

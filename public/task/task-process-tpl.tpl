#each(item in data)
<dl>
    <dt>#{user[item.user_id]}</dt>
    <dd>
        <div class="content">#{item.content}</div>
        #if(item.files)
        <div class="files">
            <ul>
                #each(file,index,arr in item.files)
                <li title="#{file}"><span>#{file.substring(file.indexOf('/')+1)}</span></li>
                #end
            </ul>
        </div>
        #end
    </dd>
</dl>
#end

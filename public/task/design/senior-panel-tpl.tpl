#if(step==1)
#each(item in data)
<a class="group J-group-triggers" data-id="#{item._id}" data-name="#{item.name}" href="#">#{item.name}</a>
#end
#elseif(step==2)
#each(user in users)
<a href="#" class="J-user-triggers" data-id="#{user._id}">#{user.name}</a>
#end
#end
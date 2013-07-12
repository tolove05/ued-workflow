#if(status===1)
<option value="null">--针对该任务的操作--</option>
<option value="1">发表回复</option>
#if(isSenior)
<option value="3">返回修改</option>
<option value="4">通过</option>
<option value="5">删除这个任务</option>
#end
#if((taskUserGroup.indexOf('设计师'\)>-1 || taskUserGroup.indexOf('设计组长'\)>-1\) && isOwn)
<option value="2">请求上级审核</option>
#end
#end
<div class="container">
    <div class="nav-collapse collapse bs-navbar-collapse">
        <ul class="nav navbar-nav">
            <li><a class="navbar-brand" id="current-login-user">#{name}</span>！</a>
            #if(group.indexOf('添加设计师任务单'\)>-1)
            <li><a class="J-add-single-task-of-design-trigger">添加单个设计师任务</a></li>
            <li><a class="J-add-multiple-task-of-design-trigger">批量设计师任务单</a></li>
            #end
            #if(group.indexOf('管理员'\)>-1)
            <li><a class="J-add-user">添加用户</a></li>
            #end
            #if(group.indexOf('设计组长'\)>-1)
            <li><a class="J-add-child-members">添加子成员</a></li>
            #end
            <li><a class="login-out">退出登陆</a></li>
        </ul>
    </div>
</div>

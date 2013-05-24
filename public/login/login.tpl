<div id="login">
    #if(model==='login')
    <form action="/login" method="post">
        <table>
            <tr>
                <th>用户名</th>
                <td><input name="name" type="text"/></td>
            </tr>
            <tr>
                <th>密码</th>
                <td><input name="pwd" type="password"/></td>
            </tr>
            <tr>
                <th></th>
                <td>
                    <input value="登陆" class="btn J-login" type="button"/>
                </td>
            </tr>
        </table>
        <a href="#" class="J-first-login first-login"> 第一次登陆请点击这里&gt;&gt;</a>
    </form>
    #elseif(model==='first-login')
    <form action="/set-pwd" method="post">
        <table>
            <tr>
                <th>请输入用户名</th>
                <td><input name="user" type="text" placeholder="任务单中的用户名"/></td>
            </tr>
            <tr>
                <th>输入密码</th>
                <td><input name="pwd1" type="password" placeholder="输入密码"></td>
            </tr>
            <tr>
                <th>再输一次</th>
                <td><input name="pwd2" type="password" placeholder="再输一次"></td>
            </tr>
            <tr>
                <th></th>
                <td>
                    <input value="下一步" class="btn J-init-user" type="button"/>
                </td>
            </tr>
        </table>
        <a href="#" class="J-back-to-login first-login">&lt;&lt;返回登陆界面</a>
    </form>
    #end
</div>
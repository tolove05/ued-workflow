<form action="/add-user" method="post" id="add-user-form">
    <table>
        <tr>
            <th>用户名</th>
            <td><input type="text" name="name"></td>
        </tr>
        <tr>
            <th>密码</th>
            <td><input type="password" name="pwd"></td>
        </tr>
        <tr>
            <th>请选择角色<br>不同的角色权限不同</th>
            <td>
                <select name="group">
                    <option value="0">请选择组员类型</option>
                    <option value="设计师">设计师</option>
                    <option value="设计组长">设计组长</option>
                    <option value="设计审核">设计审核</option>
                    <option value="前端">前端</option>
                    <option value="前端组长">前端组长</option>
                    <option value="经理助理">经理助理</option>
                    <option value="添加设计师任务单">添加设计师任务单</option>
                    <option value="管理员">管理员</option>
                </select>
            </td>
        </tr>
        <tr>
            <th>&nbsp;</th>
            <td><input type="button" class="btn J-add-user-post" value="保存用户"></td>
        </tr>
    </table>
</form>

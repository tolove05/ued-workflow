<form action="/add-user" method="post" class="form-horizontal">
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
            <th>组</th>
            <td>
                <select name="group">
                    <option value="1">用户</option>
                    <option value="9">管理员</option>
                </select>
            </td>
        </tr>
        <tr>
            <th>&nbsp;</th>
            <td><input type="button" class="J-add-user" value="保存用户"></td>
        </tr>
    </table>
</form>

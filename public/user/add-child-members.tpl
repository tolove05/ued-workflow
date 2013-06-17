<form action="/add-child-members" method="post" id="add-child-members-form">
    <table>
        <tr>
            <th>用户名</th>
            <td><input type="text" name="name" list="users">
                <datalist id="users">
                    #run for(var k in users) {
                    <option value="#{users[k]}"></option>
                    #run }
                </datalist>
            </td>
        </tr>
        <tr>
            <th>&nbsp;</th>
            <td><input type="button" class="btn J-add-child-members-post" value="添加下属"></td>
        </tr>
    </table>
</form>

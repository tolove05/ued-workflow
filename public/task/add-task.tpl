<form id="add-task" action="/add-task" method="post" class="modal form-horizontal">
    <table>
        <tr>
            <th>任务名称</th>
            <td><input type="text" name="name"></td>
        </tr>
        <tr>
            <th>选择用户</th>
            <td><input type="text" name="to"></td>
        </tr>
        <tr>
            <th>需求方</th>
            <td><input type="text" name="demand_side" placeholder=""></td>
        </tr>
        <tr>
            <th>小时数</th>
            <td><input type="text" name="timer" placeholder=""></td>
        </tr>
        <tr>
            <th></th>
            <td><input type="button" class="btn J-add-task" value="增加任务"></td>
        </tr>
    </table>

</form>
<form class="add-multiple-task" name="add-multiple-task">
    #if(step==1)
    <textarea name="excel-data" placeholder="请把Excel中的数据，粘贴到此处"></textarea>
    <input type="button" class="btn J-add-multiple-task" value="粘贴好数据后，请点击此处" data-step="1">
    #elseif(step==2)
    <table>
        <tr>
            <th>请选择</th>
            <th>请选择</th>
            <th>请选择</th>
            <th>请选择</th>
        </tr>
    </table>
    <input type="button" name="step" class="btn J-add-multiple-task" value="保存" data-step="2">
    #end
</form>

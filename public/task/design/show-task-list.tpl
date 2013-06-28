<div  class="list-group J-task-list">
    #each(item in data)
    <a class="list-group-item J-task-trigger" data-_id="#{item._id}">#{item.name}<span class="glyphicon glyphicon-chevron-right"></span></a>
    #end
</div>
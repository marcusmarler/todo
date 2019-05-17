
'use strict';

(function() {

    var todo     = document.getElementById("todo");
    var getTodos = localStorage.getItem("todos");
    
    var todos = [];
    if(getTodos !== null) {
        var todos = JSON.parse(getTodos);
    }

    function queryTodo(id) {

        for(let todo in todos) {
            if(id == todos[todo]["key"]) {
                return todo;
            }
        }
    }

    function updateTodo(id,key,val) {
        todo = queryTodo(id);
        todos[todo][key] = val;
        localStorage.setItem("todos",JSON.stringify(todos));
    }


    function deleteTodo(id) {
        var todo = queryTodo(id);
        todos.splice(todo,1);
        localStorage.setItem("todos",JSON.stringify(todos));
    }


    function todoTpl(id,title,complete) {

        var checked = "";
        var strike="";

        if(complete == 1) {
            strike  = "complete";
            checked = "checked";
        }

        return `<div data-id="${id}" class="item">
                   <input type="checkbox" ${checked}>
                   <span class="${strike}" contentEditable="true">${title}</span>
                   <button aria-label="Delete todo">&times;</button>
                </div>`;
    }


    // Create todo

    todo.addEventListener("keydown",function(e) {

        if(e.keyCode == 13) {

            var data = {
                "title": this.value,
                "key": Math.floor(Math.random() * 1000000000),
                "complete": 0
            }

            todos.push(data);
            localStorage.setItem("todos",JSON.stringify(todos));

            addToList(data);
            editTodo();
            complete();
            deleteTodoItem();
        }

    });
    

    // Add todo to list 

    function addToList(todo) {

        var todoList = document.querySelector('.todo-list');
        var todoItem = document.createElement('li');

        var id = todo["key"];
        var title = todo["title"];
        var complete = todo["complete"];

        todoItem.innerHTML = todoTpl(id,title,complete);
        todoList.appendChild(todoItem);
    }


    // List todos

    (function() {

        for(var todo in todos) {
            addToList(todos[todo]);
        }

    })();


    // Delete todo item

    function deleteTodoItem() {

        var deleteItem = document.querySelectorAll('li .item button');
        var list = document.querySelector(".todo-list");
        
        for(var i=0;i<deleteItem.length;i++) {

            deleteItem[i].addEventListener("click", function() {

                var id = this.parentNode.dataset.id;
                var todo = this.parentNode.parentNode;

                list.removeChild(todo);
                deleteTodo(id);

            });

        }

    }


    // Completed todo

    function complete() {

        var c = document.querySelectorAll('li input');
        for(var i=0;i<c.length;i++) {

            c[i].addEventListener("input", function() {

                var id = this.parentNode.dataset.id;

                if(this.checked) {
                    this.nextElementSibling.classList.add("complete");
                    updateTodo(id,"complete",1);
                }
                else {
                    this.nextElementSibling.classList.remove("complete");
                    updateTodo(id,"complete",0);
                }
            
            });

        }
    };


   // Edit todo

   function editTodo() {

        var todos = document.querySelectorAll(".todo-list li .item span");
        
        for(var i=0;i<todos.length;i++) {

            todos[i].addEventListener("blur", function(e) {
                var id = this.parentNode.dataset.id;
                var title = e.target.textContent;
                updateTodo(id,"title",title)
            });

        }

    }


    editTodo();
    complete();
    deleteTodoItem();

})();
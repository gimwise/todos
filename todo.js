const todoInputElement = document.querySelector('.todo-input');
const todoEnterBtn = document.querySelector('.enter');
const todoList = document.querySelector('.todo-list');
const completeAllBtn = document.querySelector('.complete-all-btn');
const leftItem = document.querySelector('.left-items');
const showAll = document.querySelector('.show-all-btn');
const showActive = document.querySelector('.show-active-btn');
const showCompleted = document.querySelector('.show-completed-btn');
const clearAll = document.querySelector('.clear-all-btn');

// todo를 모아놓은 객체 배열
// id, content, isCompleted
let todos = [];
let id = 1;

let isAllCompleted = false;

let curType = 'all';
// all, active, completed

const setTodos = (newTodos) => todos = newTodos;

const getAllTodos = () => {
    return todos;
}

// todo-input에 입력한 값 가져오기
const getInputValue = () => {
    // 엔터키 입력
    todoInputElement.addEventListener('keypress', (e) =>{
        if(e.key === 'Enter'){
            doTrimValue(e.target.value);
        }
    });
    // enter 버튼 클릭
    todoEnterBtn.addEventListener('click', () =>{
        doTrimValue(todoInputElement.value);
    });

    showAll.addEventListener('click', showType);

    showActive.addEventListener('click', showType);

    showCompleted.addEventListener('click', showType);

    clearAll.addEventListener('click', ()=>{
        const blankTodos = [];
        setTodos(blankTodos);
        paintTodos();
    });


    completeAllBtn.addEventListener('click', ()=> clickCompleteAll());
    setLeftItems();
};

const showType = (e)=>{
    const curElement = e.target;
    const type = e.target.id;

    if(curType == type) return;

    const prevElement = document.querySelector(`#${curType}`);
    prevElement.classList.remove('selected');

    curElement.classList.add('selected');
    curType = type;

    paintTodos();
};

// 앞뒤 공백 제거 후, 빈 문자열이 아닐 경우 할일 추가
const doTrimValue = (val) =>{
    const trimVal = String(val).trim();
    if( trimVal !== ''){
        pushTodos(trimVal);
    }
    else{
        alert("내용을 입력 후 클릭하세요");
    }
    todoInputElement.value = "";
};

// todos 객체 배열에 입력받는 값의 객체 추가
const pushTodos = (context) =>{
    const newId = id++;
    const newTodos = [...todos, { id : newId, content : context, isCompleted : false }];
    // console.log(newTodos);
    setTodos(newTodos);
    // console.log(todos);

    checkIsAllCompleted();
    paintTodos();
    setLeftItems();
}

// 현재 todos에 있는 객체로 todo-list 작성하기
const paintTodos = ()=>{
    // 지금까지 list에 있던 li 요소를 지운다
    todoList.innerHTML = null;

    switch(curType){
        case 'all' :
            const allTodos = getAllTodos();
            allTodos.forEach(todo => paintFilterTodo(todo));
            break;
        case 'active' :
            const activeTodos = getAllTodos().filter(todo => todo.isCompleted == false);
            activeTodos.forEach(todo => paintFilterTodo(todo));
            break;
        case 'completed' :
            const completedTodos = getAllTodos().filter(todo => todo.isCompleted == true);
            completedTodos.forEach(todo => paintFilterTodo(todo));
            break;
        default :
            break;
    }
};

const paintFilterTodo = (todo) =>{
        // 감싸줄 li 태그 생성, 클래스명 추가
        const liElement = document.createElement('li');
        liElement.classList.add('todo-item');
        // console.log(liElement);

        // 현재 객체가 완료된 객체면 클래스로 checked 추가
        if(todo.isCompleted){
            liElement.classList.add('checked');
        }

        // check button
        const checkElement = document.createElement('button');
        checkElement.classList.add('checkbox');
        checkElement.innerHTML = "✔︎";
        checkElement.addEventListener('click', ()=> completeTodo(todo.id));

        // content
        const contentElement = document.createElement('div');
        contentElement.classList.add('content');
        contentElement.innerHTML = todo.content;
        contentElement.addEventListener('dblclick', (e)=> dbclickTodo(e, todo.id));

        // delete button
        const deleteElement = document.createElement('button');
        deleteElement.classList.add('delBtn');
        deleteElement.innerHTML = "✕";
        deleteElement.addEventListener('click', () => deleteTodo(todo.id));
        
        // li 태그에 요소 합치기
        liElement.appendChild(checkElement);
        liElement.appendChild(contentElement);
        liElement.appendChild(deleteElement);

        // ul 태그에 현재 li 태그 합치기
        todoList.appendChild(liElement);
};

// todos 객체 배열에서 할일 삭제
const deleteTodo = (todoId) => {
    // 현재 삭제할 id 이외의 객체 가져오기
    const newTodos = getAllTodos().filter(todo => todo.id !== todoId);
    setTodos(newTodos);
    paintTodos();
    setLeftItems();
};

// todos 객체 배열에서 완료/미완료 처리
const completeTodo = (todoId) => {
    const newTodos = getAllTodos().map(todo => (todo.id === todoId) ? {...todo, isCompleted : !todo.isCompleted} : todo);
    setTodos(newTodos);
    paintTodos();
    checkIsAllCompleted();
    setLeftItems();
};

// todo-list에 input.edit-input 추가하기
const dbclickTodo = (e, todoId) => {
    const inputElement = document.createElement('input');
    inputElement.classList.add('edit-input');
    const content = e.target.innerHTML;
    inputElement.value = content;
    const curElement = e.target;
    const parentElement = curElement.parentNode;

    const clickBody = (e) => {
        if(e.target !== inputElement){
            parentElement.removeChild(inputElement);
        }
    }

    inputElement.addEventListener('keypress', (e)=>{
        if(e.key === "Enter"){
            if(String(e.target.value).trim() !== ""){
                updateTodo(e.target.value, todoId);
            }
            else{
                alert("현재 입력한 할 일이 없습니다!");
            }
        }
    });

    parentElement.appendChild(inputElement);

    document.body.addEventListener('click', clickBody);
}

// todos 객체 배열에서 할일 수정
const updateTodo = (content, todoId) => {
    const newTodos = getAllTodos().map(todo => todo.id === todoId ? {...todo, content} : todo );
    setTodos(newTodos);
    paintTodos();
}

// 완료 처리된 할일 객체 배열 반환
const getCompletedTodos = () =>{
    return todos.filter(todo => todo.isCompleted === true);
};

const activeAll = ()=>{
    completeAllBtn.classList.remove('checked');
    const newTodos = getAllTodos().map(todo => ({...todo, isCompleted : false}));
    setTodos(newTodos);
}

const completedAll = () => {
    completeAllBtn.classList.add('checked');
    const newTodos = getAllTodos().map(todo => ({...todo, isCompleted : true}));
    setTodos(newTodos);
}

// 전체 완료 여부에 따라 처리
const clickCompleteAll = () => {
    if(!getAllTodos().length) return; // todos배열의 길이가 0이면 return;

    if(isAllCompleted) activeAll(); // isAllCompleted가 true이면 todos를 전체 미완료 처리 
    else completedAll(); // isAllCompleted가 false이면 todos를 전체 완료 처리 
    isAllCompleted = !isAllCompleted;
    paintTodos(); // 새로운 todos를 렌더링

    setLeftItems();
}

// 할일 추가, completed 수정할 때 체크해서 checked 클래스 추가/삭제
const checkIsAllCompleted = () => {
    if(getAllTodos().length === getCompletedTodos().length){
        isAllCompleted = true;
        completeAllBtn.classList.add('checked');
    }
    else{
        isAllCompleted = false;
        completeAllBtn.classList.remove('checked');
    }
}

const setLeftItems = () => {
    const leftTodo = getAllTodos().filter(todo => todo.isCompleted == false);
    // console.log(leftTodo.length);
    leftItem.innerHTML = `🥕 오늘 할 일이 ${leftTodo.length}개 남아있습니다 🥕`;
}

getInputValue();



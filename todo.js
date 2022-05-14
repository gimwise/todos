const todoInputElement = document.querySelector('.todo-input');
const todoEnterBtn = document.querySelector('.enter');
const todoList = document.querySelector('.todo-list');
const completeAllBtn = document.querySelector('.complete-all-btn');
const leftItem = document.querySelector('.left-items');
const showAll = document.querySelector('.show-all-btn');
const showActive = document.querySelector('.show-active-btn');
const showCompleted = document.querySelector('.show-completed-btn');
const clearAll = document.querySelector('.clear-all-btn');

let todos = []; // todo를 모아놓은 객체 배열 {id, content, isCompleted}
let id = 1; // todo 객체의 id가 될 숫자

let isAllCompleted = false; // todos 속 모든 todo의 isCompleted가 true인지 저장하는 Boolean

let curType = 'all'; // 현재 필터값을 저장하는 string -> 'all', 'active', 'completed' 
// (선택)


// 현재 todos를 매개변수 newTodos로 바꿔주는 함수
const setTodos = (newTodos) => todos = newTodos; 

// 현재 todos 배열 전체를 반환하는 함수
const getAllTodos = () => {
    return todos;
}

// 현재 input에 입력된 value를 가져와서 처리하는 함수 -> 키보드 enter, 버튼 클릭 2가지로 수행
const getInputValue = () => {
    // todoInputElement에 'enter'키가 "keypress"됐을 때, doTrimValue() 실행
    todoInputElement.addEventListener('keypress', (e) =>{
        if(e.key === 'Enter'){
            doTrimValue(e.target.value);
        }
    });
    // input 옆 enter 버튼을 'click'했을 때, doTrimValue() 실행
    todoEnterBtn.addEventListener('click', () =>{
        doTrimValue(todoInputElement.value);
    });

    // show 3가지 버튼은을 'click'했을 때, showType() 실행
    showAll.addEventListener('click', showType); 

    showActive.addEventListener('click', showType);

    showCompleted.addEventListener('click', showType);

    // clearAll 버튼을 'click'했을 때, 현재 todos의 모든 내용을 지우기
    clearAll.addEventListener('click', ()=>{
        const blankTodos = [];
        setTodos(blankTodos);
        paintTodos();
        setLeftItems();
    });

    // completeAllBtn 버튼을 'click'했을 때, clickCompleteAll() 실행
    // (선택)
    completeAllBtn.addEventListener('click', ()=> clickCompleteAll());

    // 남은 할일 계산하기
    setLeftItems();
};

// 지금 누른 버튼의 id를 읽어와 paintTodos()하기 
// (선택)
const showType = (e)=>{
    const curElement = e.target; // 현재 누른 버튼 요소
    const type = e.target.id; // 현재 누른 버튼 요소의 id

    if(curType == type) return; // 현재 누른 버튼이 기존의 버튼과 같다면 아무일도 일어나지 않음

    const prevElement = document.querySelector(`#${curType}`); // 기존 버튼 요소를 가져와
    prevElement.classList.remove('selected'); // selected 클래스 지우기

    curElement.classList.add('selected'); // 현재 누른 버튼에 selected 클래스 추가하기
    curType = type; // 현재 type으로 curType 바꾸기

    paintTodos(); // 다시 paintTodos() 실행
};

// 앞뒤 공백 제거 후, 빈 문자열이 아닐 경우 pushTodos() 실행
const doTrimValue = (val) =>{ 
    const trimVal = String(val).trim(); // string으로 형 변환 후, 공백 제거
    if( trimVal !== ''){ // 빈 문자열이 아니면
        pushTodos(trimVal); // pushTodos()로 todos 배열에 추가하기
    }
    else{ // 빈 문자열이면
        alert("내용을 입력 후 클릭하세요"); // alert 창
    }
    todoInputElement.value = ""; // input의 value 없애기
};

// todos 객체 배열에 객체 추가
const pushTodos = (context) =>{
    const newId = id++; // 아이디 할당
    const newTodos = [...todos, { id : newId, content : context, isCompleted : false }]; // 새로운 객체 배열 만들기, spread operator
    setTodos(newTodos); // setTodos()로 새로운 배열을 todos로 결정하기

    checkIsAllCompleted(); // 
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



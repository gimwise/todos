const time = document.querySelector('.todo-title');

const setTime = ()=>{
    const date = new Date();
    // console.log(date);

    const hour = String(date.getHours()).padStart(2,"0");
    const min = String(date.getMinutes()).padStart(2, "0");
    let sec = String(date.getSeconds()).padStart(2, "0");

    // console.log(hour, min, sec);

    time.innerHTML = `${hour}:${min}:${sec}`;
}

setTime();
setInterval(setTime, 1000);
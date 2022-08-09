const puzzle = document.querySelector('.puzzle');
const starBtn = document.querySelector('.start');
const replayBtn = document.querySelector('.replay');
const finishText = document.querySelector('.finish');
const playTime = document.querySelector('.time span');

const tileCount = 16;

let tiles = [];
const dragged = {
    el: null,
    class: null,
    index: null,
}
let isPlaying = false;
let timeInterval = null;
let time = 0;

// functions
playGame();
function checkStatus(){
    const currentList = [...puzzle.children];
    const unMatchedList = currentList.filter((child, index) => Number(child.getAttribute("data-index")) !== index); 
    if(unMatchedList.length === 0){
        finishText.style.display = "block";
        isPlaying = false;
        clearInterval(timeInterval)
    }
}

function playGame(){
    isPlaying = true;
    time = 0;
    puzzle.innerHTML = ""; 
    finishText.style.display = "none";
    clearInterval(timeInterval)

    tiles = createTiles();
    tiles.forEach(tile=> puzzle.appendChild(tile))
    setTimeout(()=>{
        puzzle.innerHTML = "";
        shuffle(tiles).forEach(tile=> puzzle.appendChild(tile)) 
        timeInterval = setInterval(() => {
            playTime.innerText = time;
            time++;
        }, 1000)
    }, 500)
}

function createTiles(){
    const tempArray = [];
    Array(tileCount).fill().forEach((_, i) => {
        const li = document.createElement("li");
        li.setAttribute('data-index', i)
        li.setAttribute('draggable', 'true');
        li.classList.add(`list${i}`)
        tempArray.push(li)
    })
    return tempArray;
}

function shuffle(array){
    let index = array.length -1;
    while(index > 0){
        const randomIndex = Math.floor(Math.random()*(index+1));
        [array[index], array[randomIndex]] = [array[randomIndex], array[index]]
        index--;
    }
    return array;
}

// events
puzzle.addEventListener('dragstart', e => {
    if(!isPlaying) return; 
    const obj = e.target;
    dragged.el = obj;
    dragged.class= obj.className;
    dragged.index = [...obj.parentNode.children].indexOf(obj)
})
puzzle.addEventListener('dragover', e => {
    e.preventDefault();
})
puzzle.addEventListener('drop', e => {
    if(!isPlaying) return; 
    const obj = e.target;
    if(obj.className !== dragged.class){
        let originPlace;
        let isLast = false;

        if(dragged.el.nextSibling){
            originPlace = dragged.el.nextSibling
        } else {
            originPlace = dragged.el.previousSibling
            isLast = true;
        }    
        const droppedIndex = [...obj.parentNode.children].indexOf(obj);
            dragged.index > droppedIndex ? obj.before(dragged.el) : obj.after(dragged.el)
            isLast ? originPlace.after(obj) : originPlace.before(obj)
    }
   checkStatus();
})

starBtn.addEventListener('click', () => {
    playGame();
});
replayBtn.addEventListener('click',()=>{
    playGame();
});
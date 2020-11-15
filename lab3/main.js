"use strict";


 document.addEventListener('DOMContentLoaded', () => {
  if (performance.navigation.type == 1) { //on reload
    if(checkCookie('minNumber')){
      alert(`These Cookies have been created on this page: \n${document.cookie} \n They will be deleted`);
      setCookie('minNumber','',2);
      alert('Cookies were successfully deleted.');
      }
    }
  
  document.addEventListener('load', (event) => {
  	alert('Something loaded.');
  })
  swapText('navi', 'bottom-right'); // task 1
  const a = 3;
  const b = 2;
  const sinab =0.5;
  findAreaOfTriangle(a, b, sinab, 'middle'); // complete task 2
  //task 6
  makeEditableBlock('header');
  makeEditableBlock('left_block');
  makeEditableBlock('middle');
  makeEditableBlock('navi');
  makeEditableBlock('bottom-right');
  makeEditableBlock('footer');
  initEditableBlocks();
  //task 3
  let numArray =[];
  document.querySelector('#numBtn').addEventListener('click', () => {
    numArray.push(document.getElementById('numInput').value);
    document.getElementById('middle').insertAdjacentHTML("beforeend", `${document.getElementById('numInput').value} `);
  
    if (numArray.length==10){
        numArray.sort();
        let minNum = 1;
        for(let i = 0; i < 9; i++){
            if(numArray[i]==numArray[i+1]) {minNum++} 
            else {break}
        }
        alert(`There are ${minNum} minimal numbers.`);
        setCookie('minNumber', minNum, 2);
        numArray=[];
        document.getElementById('middle').insertAdjacentHTML("beforeend", '<br>');
    }
    
  });
  //task 4
  if(localStorage.getItem('textColor')) {
    document.querySelector('#middle').style.color = localStorage.getItem('textColor');
    document.querySelector('#colorInput').setAttribute('value', localStorage.getItem('textColor'))
  }
  document.querySelector('#colorInput').addEventListener('change', function(){
    console.log(this.value);
    document.querySelector('#middle').style.color = this.value;
    localStorage.setItem('textColor' ,this.value);
  })

 })

 const swapText = (id1, id2) => {
  let block1 = document.getElementById(id1);
  let block2 = document.getElementById(id2);
  let content1 = block1.innerHTML;
  block1.innerHTML = block2.innerHTML;
  block2.innerHTML = content1;
 }

 const findAreaOfTriangle = (sideA = 0, sideB = 0, sin = 0, outputId) => {
  let area = sideA * sideB* sin;
  document.getElementById(outputId).insertAdjacentHTML("beforeend", 
  `<p><strong>Area of Triangle equals:<br>${area}</strong></p>`
  );
 }

 const findMinDigit = (arr) => {
  let number = document.getElementById(inputId).value;
  return Array.from(number).sort()[0];
 }

 const initEditableBlocks = () => {
  Array.from(document.getElementsByClassName('editArea')).map((area) => {
    area.addEventListener('change', (event) => {
      const newContent = event.target.value;
        if (isHTML(newContent))localStorage.setItem(`${event.target.parentNode.id}Content`, newContent);
        else{
            Array.from(document.getElementsByClassName('editBtn')).map((btn) => {
    btn.addEventListener('click', (event) => {
      localStorage.removeItem(`${event.target.parentNode.id}Content`);
      document.location.reload();
        })
     })
  }
    })
  Array.from(document.getElementsByClassName('editBtn')).map((btn) => {
    btn.addEventListener('click', (event) => {
      localStorage.removeItem(`${event.target.parentNode.id}Content`);
      document.location.reload();
    })
  })
 })}

 const makeEditableBlock = (blockId) => {
   const content = localStorage.getItem(`${blockId}Content`) ? 
   localStorage.getItem(`${blockId}Content`) : 
   document.getElementById(blockId).innerHTML;
   document.getElementById(blockId).innerHTML = content;
   document.getElementById(blockId).insertAdjacentHTML('beforeend', 
   `<textarea class="editArea">${content}</textarea>
    <button type="submit" class="editBtn">Reset</button>`
   )
 }

 const setCookie = (name, data, expDays) => {
  const d = new Date();
  d.setDate(d.getDate() + expDays);
  document.cookie = `${name}=${data};expires=${d.toUTCString()};path=/`;
 }

 const checkCookie = (name) => {
  return (document.cookie.includes(name) && document.cookie!=`${name}=`);
 }

 const getCookie = (name) => {
   return checkCookie(name) ? document.cookie.split(';').find((c) => c.includes(name)).split('=')[1] : 0;
 }
 
 const isHTML = (str) => {
  var doc = new DOMParser().parseFromString(str, "text/html");
  return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
}


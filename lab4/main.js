async function changeContentWithDelay(array_of_ids){
    let temp_holder;
    let temp_holder2;
    let i;
    for(i = 0; i < array_of_ids.length - 1; i++){
        if(i==0){
            temp_holder = document.querySelector(array_of_ids[array_of_ids.length - 2 - i]).innerHTML;
            document.querySelector(array_of_ids[array_of_ids.length - 2 - i]).innerHTML = document.querySelector(array_of_ids[array_of_ids.length - 1 - i]).innerHTML;
            document.querySelector(array_of_ids[array_of_ids.length - 1 ]).innerHTML='';
            await delay((i+1)*5);
        }
        else{
            temp_holder2 = document.querySelector(array_of_ids[array_of_ids.length - 2 - i]).innerHTML;
            document.querySelector(array_of_ids[array_of_ids.length - 2 - i]).innerHTML = temp_holder;
            temp_holder = temp_holder2;
            await delay((i+1)*5);
        } 
    }
    document.querySelector(array_of_ids[array_of_ids.length - 1]).innerHTML = temp_holder;
}
function delay(s)
{
    return new Promise(resolve => setTimeout(resolve, 1000*s));
}
async function task2(){
    await delay(5);
    document.querySelector('#id1').style.background = 'pink';
    document.querySelector('#id6').style.background = 'pink';
    while(true){
        await delay(5);
        document.querySelector('#id3').style.background = '#FDEBD0';
        await delay(5);
        document.querySelector('#id3').style.background = '#E8DAEF';
    }
}

function createCommitFormTo(blockName)
{
    let form = document.createElement("form");
    form.id='git-commits-form';
    form.style = 'display:flex; flex-direction:column; border:solid 1px;';

    let username = document.createElement("input");
    username.setAttribute('type',"text");
    username.setAttribute('name',"username");
    username.setAttribute('placeholder',"Username");
    username.setAttribute('required',true);

    let repositoryName = document.createElement("input");
    repositoryName.setAttribute('type',"text");
    repositoryName.setAttribute('name',"repository-name");
    repositoryName.setAttribute('placeholder',"Repository name");
    repositoryName.setAttribute('required',true);

    let submit = document.createElement("button");
    submit.setAttribute('type',"submit");
    submit.textContent = "Get commits";

    form.append(username);
    form.append(repositoryName);
    form.append(submit);

    document.querySelector(blockName).append(form);
}
async function addCommitsToBlock(blockName)
{
    let username = document.querySelector('#git-commits-form > input[name="username"]').value;
    let repositoryName = document.querySelector('#git-commits-form > input[name="repository-name"]').value;

    let response = await fetch(`https://api.github.com/repos/${username}/${repositoryName}/commits`);
    
    let div = document.createElement('div');
    div.id="commits-content";
    div.style.height = "35%";
    div.style.overflow = "auto";

    let ul = document.createElement('ul');
    if (response.ok) 
    {
        response.json().then(data => data.forEach(c => 
            {
                let li = document.createElement('li');
                li.textContent = `${c.commit.author.name} : ${c.commit.message}`;
                ul.append(li);
            }));
        div.append(ul);
    }
    else 
    {
        let p = document.createElement('p');
        p.textContent = `Error : ${response.status}(${response.statusText})`;
        p.style = 'display:border-box; border: solid 0.3em red; padding = 1em;';
        div.append(p);
    }
    document.querySelector(blockName).appendChild(div);
}

function testFunc()
{
    // Insert code here...
}
async function callFunc(...functions)
{
    for (let index = 0; index < functions.length; index++)
    {
        await functions[index]();
        console.log(`The function №${index+1} has finished its work successfully.`)
    }
}
function createSortFormTo(blockName)
{
    let form = document.createElement("form");
    form.id='sort-form';
    form.style = 'display:flex; flex-direction:column; border:solid 1px rgb(150, 45, 45);';

    let listOfValues = document.createElement("input");
    listOfValues.setAttribute('type',"text");
    listOfValues.setAttribute('name',"list-of-values");
    listOfValues.setAttribute('placeholder',"List of values");
    listOfValues.setAttribute('required',true);

    let submit = document.createElement("button");
    submit.setAttribute('type',"submit");
    submit.textContent = "Sort";

    form.append(listOfValues);
    form.append(submit);

    document.querySelector(blockName).append(form);
}
function swap(items, firstIndex, secondIndex){
    const temp = items[firstIndex];
    items[firstIndex] = items[secondIndex];
    items[secondIndex] = temp;
}
function partition(items, left, right) {
    var pivot   = items[Math.floor((right + left) / 2)],
        i       = left,
        j       = right;
    while (i <= j) {
        while (items[i] < pivot) {
            i++;
        }
        while (items[j] > pivot) {
            j--;
        }
        if (i <= j) {
            swap(items, i, j);
            i++;
            j--;
        }
    }
    return i;
}
function quickSort(items, left, right) {
    var index;
    if (items.length > 1) {
        index = partition(items, left, right);
        if (left < index - 1) {
            quickSort(items, left, index - 1);
        }
        if (index < right) {
            quickSort(items, index, right);
        }
    }
    return items;
}
function sortListOfValuesToBlock(blockName)
{
    let listOfValues = document.querySelector('#sort-form > input[name="list-of-values"]').value;

    let regex = /\d+/g;
    let numberList = listOfValues.match(regex).map(Number);
    if(!numberList)
        console.log('Error: no number is a list');
    else
    {
        console.log('Entered list of numbers :');
        console.log(numberList.slice());
        console.log('Sorted list of numbers :')
        console.log(quickSort(numberList, 0, numberList.length - 1));
    }
}
/////////////////////////////////////////////////////////////////
window.addEventListener("load", function(event) {
    task2();
  });

changeContentWithDelay(["#id1", "#id2", "#id3", "#id4", "#id5", "#id6"])
createCommitFormTo('#id5');
createSortFormTo('#id4')
document.addEventListener('submit',function(event)
    {
        if(event?.target.id == 'git-commits-form')
        {
            event.preventDefault();
            if(document.querySelector('#commits-content'))
            {
                document.querySelector('#commits-content').remove();
            }
            addCommitsToBlock('#' + document.querySelector('#git-commits-form').parentNode.id);
            document.querySelector('#git-commits-form').reset();
        }
        if(event?.target.id == 'sort-form')
        {
            event.preventDefault();
            if(document.querySelector('#sort-content'))
            {
                document.querySelector('#sort-content').remove();
            }
            sortListOfValuesToBlock('#' + document.querySelector('#sort-form').parentNode.id);
            document.querySelector('#sort-form').reset();
        }
    });
callFunc(testFunc, function(){return delay(12)}, testFunc) 
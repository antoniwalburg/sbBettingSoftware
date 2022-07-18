function show_list() {
    let courses = document.getElementById("sportsDiv");

    if (courses.style.display == "block") {
        courses.style.display = "none";
    } else {
        courses.style.display = "block";
    }
}
const groupBy = (items, key) => items.reduce(
    (result, item) => ({
        ...result,
        [item[key]]: [
            ...(result[item[key]] || []),
            item,],
    }), {})

const iforbetApiUrl = ("http://api.iforbet.pl/rest/market/categories");
let obj;
fetch(iforbetApiUrl)
    .then(res => res.json())
    .then(data => obj = data)

    //error handle
    .then(function () {
        console.log("status -> ok");
    })
    .catch(function () {
        console.log("error");
    })

    .then(() => {
        const { data } = obj
        sortedData = groupBy(data, "sportName")
        keysSortedData = Object.keys(sortedData)
        function sortCategoryNamesByLevel(cateogryLevel) {
            return data.filter(function (e) {
                return e.level == cateogryLevel && (!e.sportName.includes("Esport"))
            });
        }
        function createEsports(name) {
            let esport = document.createElement("ul");
            let li = document.createElement("li");
            esport.appendChild(li);
            li.innerText = name;
            li.setAttribute('id','esportsLink');
            document.getElementById("sportsDiv").appendChild(esport);
    }
    createEsports("Esports");

        function getEsports(name, categoryLevel) {
            return data.filter(function (e) {
                if (e.sportName.includes(name) && e.level == categoryLevel) {
                    return e.categoryName;
                }
            })
        }
        //LEVEL_1
        let listLevelOne = document.createElement("ul");
        listLevelOne.setAttribute('class','navbar-sports')
        let categoryNameLevel1 = sortCategoryNamesByLevel(1);
        categoryNameLevel1.forEach(element => {
            let divone = document.createElement("div");
            const { categoryName, sportId, sportName } = element;
            divone.dataset.sportId = sportId;
            let itemLevelOne = document.createElement("li");
            itemLevelOne.innerText = categoryName + " »";
            itemLevelOne.dataset.sportId = sportId
            divone.appendChild(itemLevelOne);
            listLevelOne.appendChild(divone)

        });
        //LEVEL_2
        document.getElementById("sportsDiv").appendChild(listLevelOne);
        let categoryNameLevel2 = sortCategoryNamesByLevel(2);
            categoryNameLevel2.forEach(element => {
            
            const { categoryName, parentCategory, categoryId, sportId, level} = element;
            let listLevelTwo = document.createElement("ul");
            listLevelTwo.dataset.sportId = sportId;
            listLevelTwo.dataset.level = level;
            listLevelTwo.setAttribute('id', categoryId)
            const event = document.querySelector(`[data-sport-id='${sportId}']`)
            listLevelTwo.setAttribute('class','courses2')
            
            let itemLevelTwo = document.createElement("li");
            itemLevelTwo.innerText = categoryName + " »";
            itemLevelTwo.dataset.categoryId = categoryId
            listLevelTwo.appendChild(itemLevelTwo);
            document.querySelector(`[data-sport-id='${parentCategory}'`).appendChild(listLevelTwo)
        });

        categoryNameLevel1 = sortCategoryNamesByLevel(1);
        categoryNameLevel1.forEach(element => {
            const { categoryName, parentCategory, categoryId, sportId, level} = element;
            const event = document.querySelector(`li[data-sport-id='${sportId}']`)
            event.addEventListener('click', (parametr)=>{
                let courses2 = document.querySelectorAll(`ul[data-sport-id='${sportId}']`);
                courses2.forEach(function(item, index, arr){
                    let checkStyleValue = item.style.display == "block" 
                    ? item.style.display = "none" : item.style.display = "block";
                })
            })
        });
        //LEVEL_3
        let categoryNameLevel3 = sortCategoryNamesByLevel(3);
        categoryNameLevel3.forEach(element => { 
        const { categoryName, parentCategory, categoryId, sportId, level } = element
        let listLevelThree = document.createElement("ul");
        listLevelThree.dataset.sportId = sportId;
        listLevelThree.dataset.level = level;
        listLevelThree.setAttribute('id', categoryId);
        const event2 = document.querySelector(`[data-category-id='${parentCategory}']`)
        listLevelThree.setAttribute('class','courses3');  

        let itemLevelThree = document.createElement("li");
        itemLevelThree.innerText = categoryName;
        itemLevelThree.dataset.categoryId = categoryId
        listLevelThree.appendChild(itemLevelThree);
        document.querySelector(`[data-category-id='${parentCategory}'`).append(listLevelThree);
        });
        categoryNameLevel2 = sortCategoryNamesByLevel(2);
        categoryNameLevel2.forEach(element => {
            const { categoryName, parentCategory, categoryId, sportId } = element;
            const event2 = document.querySelector(`ul[data-category-id='${categoryId}']`)
            event2.addEventListener('click', (parametr)=>{
                let courses3 = document.querySelectorAll(`ul[data-category-id='${categoryId}']`);
                courses3.forEach(function(item, index, arr){
                    let checkStyleValue = item.style.display == "block" 
                    ? item.style.display = "none" : item.style.display = "block";
                });
            
            })
        });
})
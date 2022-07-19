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

let iforbetApiUrl = ("http://api.iforbet.pl/rest/market/categories");
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

    .then(function () {

        const { data } = obj
        sortedData = groupBy(data, "sportName")
        keysSortedData = Object.keys(sortedData)
        function sortCategoryNamesByLevel(cateogryLevel) {

            const invalidSportId = 18;
            return data.filter(function (e) {

                return e.level == cateogryLevel && (!e.sportName.includes("Esport")) && (e.sportId != invalidSportId)
                && e.sportId != (invalidSportId * 2) && e.categoryName != "Outrights";
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
        const dropDownAnimation = "dropdownAnimation"
        const hideAnimation = "hideAnimation"
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
                listLevelTwo.dataset.categoryId = categoryId;
                listLevelTwo.setAttribute('class','courses2')
                
                let itemLevelTwo = document.createElement("li");
                itemLevelTwo.innerText = categoryName + " »";
                itemLevelTwo.dataset.categoryId = categoryId
                itemLevelTwo.dataset.level = level;
                listLevelTwo.appendChild(itemLevelTwo);
                document.querySelector(`[data-sport-id='${parentCategory}'`).appendChild(listLevelTwo)
            });

        categoryNameLevel1 = sortCategoryNamesByLevel(1);
        categoryNameLevel1.forEach(element => {

            const { categoryName, parentCategory, categoryId, sportId, level} = element;
            const event = document.querySelector(`li[data-sport-id='${sportId}']`)
            event.addEventListener('click', (parametr)=>{

                let courses2 = document.querySelectorAll(`ul[data-sport-id='${sportId}'][data-level = '2']`);
                courses2.forEach(function(item, index, arr){

                    item.classList.toggle(dropDownAnimation);
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
            listLevelThree.dataset.categoryId = categoryId;
            listLevelThree.dataset.parentCategory = parentCategory;
            listLevelThree.setAttribute('id', categoryId);
            listLevelThree.setAttribute('class','courses3');  

            let itemLevelThree = document.createElement("li");
            itemLevelThree.innerText = categoryName;
            itemLevelThree.dataset.categoryId = categoryId
            listLevelThree.appendChild(itemLevelThree);
            document.querySelector(`[data-category-id='${parentCategory}'`).appendChild(listLevelThree);
            });

        categoryNameLevel2 = sortCategoryNamesByLevel(2);
        categoryNameLevel2.forEach(element => {

                const { categoryName, parentCategory, categoryId, sportId } = element;
                const event2 = document.querySelector(`li[data-category-id='${categoryId}']`)
                event2.addEventListener('click', (parametr)=>{

                    let courses3 = document.querySelectorAll(`ul[data-parent-category='${categoryId}'][data-level = '3']`);
                    const timeout = 670;
                    courses3.forEach(function(item, index, arr){
                        
                        if (item.style.display == "block") {
                            
                            item.classList.toggle(hideAnimation)
                            setTimeout(function() {

                                item.style.display = "none";
                                
                            },timeout)

                        } else {
                            
                            item.classList.toggle(dropDownAnimation);
                            item.style.display = "block";
                        }
                    });
                
                })
            })
})
//FILTER_WITH_OUT => ELEMENTS WITH-OUT PAR-CHILD
//FINAL
//ERROR ON HIDE-DROP LEVELS1-2 + ERROR ON MULTI CLICK LEVEL 1-3
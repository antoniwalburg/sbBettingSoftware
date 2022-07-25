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

let obj;
fetch('http://api.iforbet.pl/rest/market/categories')

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

            return data.filter(function (e) {
                return e.level == cateogryLevel && (!e.sportName.includes("Esport")) && e.categoryName != "Outrights";
            });
        }

        function element(template, mimeType) {
            return (new DOMParser)
              .parseFromString(template, mimeType)
              .body
              .firstElementChild;
          }
          function toHtml(template) {
            return element(template, 'text/html')
          } 
        let [categoryNameLevel1, categoryNameLevel2, categoryNameLevel3] = [sortCategoryNamesByLevel(1), sortCategoryNamesByLevel(2), sortCategoryNamesByLevel(3)];

        const timeout = 650;
        //level_1_elements
        const markup = document.createElement('ul');
        categoryNameLevel1.forEach(element => {

            const { categoryName, sportId } = element;
            let levelOne = `
            <div data-sport-id=${sportId}> 
                <li data-sport-id=${sportId}>${categoryName}
                    <span class="caret"></span>
                </li>
            </div>`; 
            markup.appendChild(toHtml(levelOne))
        
        });
        document.getElementById('sportsDiv').appendChild(markup);
        
        //level_2_elements
        categoryNameLevel2.forEach(element => {
            
            const { categoryName, parentCategory, categoryId, sportId, level} = element;
            let levelTwo = `
            <ul data-sport-id=${sportId} data-level=${level} data-category-id=${categoryId} class="courses2">
                <li data-category-id=${categoryId} data-level=${level}>${categoryName}
                    <span class="caret"></span>
                </li>
            </ul>`;
            document.querySelector(`[data-sport-id='${parentCategory}'`).appendChild(toHtml(levelTwo))
        })
        //Level_2_Events
        categoryNameLevel1.forEach(element => {
            const { sportId } = element;
            const event = document.querySelector(`li[data-sport-id='${sportId}']`)
            const caret = event.querySelector('.caret')
            event.addEventListener('click', ()=>{
                caret.classList.toggle('caret-rotate');
                let courses2 = document.querySelectorAll(`ul[data-sport-id='${sportId}'][data-level = '2']`);
                courses2.forEach(function (item){
                    return item.style.display == "block" ? item.classList.toggle('hideAnimation') && setTimeout(function() {
                        item.style.display = "none"; },timeout) && setTimeout(function() {
                            item.classList.remove('hideAnimation'),item.classList.remove('dropdownAnimation')},timeout) 
                            : item.classList.toggle('dropdownAnimation'), item.style.display = "block";
                    })
                })
            });
        //Level_3_elements
        categoryNameLevel3.forEach(element => {
            const { categoryName, parentCategory, categoryId, level } = element
            let levelThree = `
                <ul data-level=${level} data-category-id=${categoryId}
                data-parent-category=${parentCategory} class=courses3>
                    <li data-category-id=${categoryId}>${categoryName}</li>
                </ul>`
            document.querySelector(`[data-category-id='${parentCategory}'`).appendChild(toHtml(levelThree))
        })
        //Level_3_Events
        categoryNameLevel2.forEach(element => {
            const { categoryId } = element;
            const event2 = document.querySelector(`li[data-category-id='${categoryId}']`)
            const caretNext = event2.querySelector('.caret')
            event2.addEventListener('click', ()=>{
                //Task => Remove Duplicate ->->-> (94-97 : 121-124)
                //Tips => outside function callback()
                //Tips => For loop two categories at the same time
                //Tips => leave but optimalize conditione;
                caretNext.classList.toggle('caret-rotate');
                let courses3 = document.querySelectorAll(`ul[data-parent-category='${categoryId}'][data-level = '3']`);
                courses3.forEach(function (item){
                    return item.style.display == "block" ? item.classList.toggle('hideAnimation') && setTimeout(function() {
                        item.style.display = "none"; },timeout) && setTimeout(function() {
                            item.classList.remove('hideAnimation'),item.classList.remove('dropdownAnimation')},timeout) 
                            : item.classList.toggle('dropdownAnimation'), item.style.display = "block";
                });
            
            })
        })
        
    });
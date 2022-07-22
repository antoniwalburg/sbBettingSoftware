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

        function element(template, mimeType) {
            return (new DOMParser)
              .parseFromString(template, mimeType)
              .body
              .firstElementChild;
          }
          function toHtml(template) {
            return element(template, 'text/html')
          } 
        
        let categoryNameLevel1 = sortCategoryNamesByLevel(1);
        let categoryNameLevel2 = sortCategoryNamesByLevel(2);
        let categoryNameLevel3 = sortCategoryNamesByLevel(3);
        
        //level_1
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
        
        //level_2
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
        
    });
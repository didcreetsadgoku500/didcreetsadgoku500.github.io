let alertObj;
let alertHeading;
let alertBody;
let isVisible = true;
let current = {"id": ""};
const queryString = new URLSearchParams(window.location.search);


function main() {
    alertObj = document.getElementById("alert")
    alertHeading = document.getElementById("header")
    alertBody = document.getElementById("content")
    hideAlert()
    processFetch()
    setInterval(processFetch, 45000)
}

async function processFetch() {
    let latest = await getLatest()
    if (latest == "none") {
        hideAlert()
        return
    }

    if (latest.id == current.id) {
        hideAlert()    
        return
    }
    
    current.id = latest.id
    displayAlert(latest.properties.event, latest.properties.areaDesc)


}

async function getLatest() {
    let data = await queryAPI()
    data = await data.json()
    if (data.features.length < 1) {return "none"}
    let latest = data.features[0];
    data.features.forEach(element => {
        if (element.properties.sent > latest.properties.sent) {
            latest = element;
        }
    });
    return latest;
}



async function hideAlert() {
        if (isVisible == false) {
            return
        }

        await fadeOut()
        disableTransitions()
        collapseAlert()
        await new Promise(resolve => setTimeout(resolve, 50));

        isVisible = false;
        return
}

async function displayAlert(argHeading, argBody) {
    await hideAlert()
    enableTransitions()
    let sfx = new Audio('sad.mp3')
    sfx.play()


    alertHeading.textContent = argHeading
    alertBody.textContent = argBody
    await fadeIn()
    isVisible = true;
    expandAlert()


}

function expandAlert() {
    alertObj.style.setProperty("width", alertObj.scrollWidth)
}

function collapseAlert() {
    alertObj.style.setProperty("width", "6rem")
}

function enableTransitions() {
    alertObj.style.setProperty('transition', 'width 1.5s cubic-bezier(0.23, 1, 0.320, 1), opacity 0.5s cubic-bezier(0.23, 1, 0.320, 1) ')
}

function disableTransitions() {
    alertObj.style.setProperty('transition', 'none')
}

function fadeOut() {
    return new Promise((res, rej) => {
        alertObj.addEventListener('transitionend', function callee() {
            alertObj.removeEventListener('transitionend', callee);
            res()
        
          });
          alertObj.style.setProperty("opacity", "0")
    })

}

function fadeIn() {
    return new Promise((res, rej) => {
        alertObj.addEventListener('transitionend', function callee() {
            alertObj.removeEventListener('transitionend', callee);
            res()
        
          });
          alertObj.style.setProperty("opacity", "1")
    })

}

async function queryAPI() {
    if (queryString.has('area')) {
        return await fetch(`https://api.weather.gov/alerts/active?status=actual&message_type=alert&area=${queryString.getAll('area').join()}&urgency=Immediate&severity=Extreme,Severe&limit=500`)
    }
    else {
        return await fetch('https://api.weather.gov/alerts/active?status=actual&message_type=alert&urgency=Immediate&severity=Extreme,Severe&limit=500')
    }

}
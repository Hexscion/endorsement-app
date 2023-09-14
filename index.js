import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-1cc85-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementListInDB = ref(database, "endorsementList")

const endorsementIpEl = document.getElementById("endorsement-ip")
const fromIpEl = document.getElementById("from-ip")
const toIpEl = document.getElementById("to-ip")
const publishBtnEl = document.getElementById("publish-btn")
const endorsementListEl = document.getElementById("endorsement-list")

publishBtnEl.addEventListener("click", function() {
    let endorsementValue = endorsementIpEl.value
    let fromValue = fromIpEl.value
    let toValue = toIpEl.value
    let likesValue =  0
    push(endorsementListInDB, {endorsementValue, fromValue, toValue, likesValue})
    clearInputFieldEl()
})

onValue(endorsementListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        clearEndorsementListEl()
        for (let i = itemsArray.length-1; i >= 0; i--) {
            let currentItem = itemsArray[i]
            appendItemToEndorsementListEl(currentItem)
        }    
    } else {
        endorsementListEl.innerHTML = `<p>No endorsements to show... yet</p>`
    }
})

function clearEndorsementListEl() {
    endorsementListEl.innerHTML = ""
}

function clearInputFieldEl() {
    endorsementIpEl.value = ""
    fromIpEl.value = ""
    toIpEl.value = ""
}

function appendItemToEndorsementListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    let endorsementItemValue = itemValue.endorsementValue
    let fromItemValue = 'From ' + itemValue.fromValue
    let toItemValue = 'To ' + itemValue.toValue
    let likesItemValue = itemValue.likesValue
    let newDiv = document.createElement("div")
    newDiv.classList.add("endorsement-message-container")
    let newTo = document.createElement("h3")
    newTo.textContent = toItemValue
    let newEndorsement = document.createElement("p")
    newEndorsement.textContent = endorsementItemValue
    let newDiv1 = document.createElement("div")
    newDiv1.classList.add("endorsement-sub-container1")
    let newFrom = document.createElement("h3")
    newFrom.textContent = fromItemValue
    let newDiv2 = document.createElement("div")
    newDiv2.classList.add("endorsement-sub-container2")
    let newLike = document.createElement("i")
    if (localStorage.getItem(itemID) === 'true' ) {
        newLike.classList.add("fa-solid", "fa-heart")
    } else {
        newLike.classList.add("fa-regular", "fa-heart")
    }
    newLike.classList.add("fa-regular", "fa-heart")
    let newLikeCount = document.createElement("h3")
    newLikeCount.textContent = likesItemValue
    newLike.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `endorsementList/${itemID}/likesValue`)
        if (!localStorage.getItem(itemID) || localStorage.getItem(itemID) === 'false' ) {
            likesItemValue += 1
            localStorage.setItem(itemID, 'true')
        } else {
            likesItemValue -= 1
            localStorage.setItem(itemID, 'false')
        }
        set(exactLocationOfItemInDB, likesItemValue)
    })
    newDiv2.append(newLike, newLikeCount)
    newDiv1.append(newFrom, newDiv2)
    newDiv.append(newTo, newEndorsement, newDiv1)
    endorsementListEl.append(newDiv)
}
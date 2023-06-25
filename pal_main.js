
function rowConstructor(dv=0, rv = 0, gv = 0, bv = 0, av = 255) {
    var r = document.createElement("tr")
    r.draggable = true;
    r.addEventListener("dragstart", () => {start()});
    r.addEventListener("dragover", () => {dragover()});
    let red = tdHelperRGB()
    let green = tdHelperRGB()
    let blue = tdHelperRGB()
    let alpha = tdHelperRGB()
    red.value = rv
    green.value = gv
    blue.value = bv
    alpha.value = av
    let colorPicker = tdHelperColor()
    colorPicker.addEventListener("input", () => {updateNumbersToMatch(colorPicker, red,green,blue)})
    red.addEventListener("input", () => {updateColorToMatch(colorPicker, red,green,blue, alpha)})
    blue.addEventListener("input", () => {updateColorToMatch(colorPicker, red,green,blue, alpha)})
    green.addEventListener("input", () => {updateColorToMatch(colorPicker, red,green,blue, alpha)})
    alpha.addEventListener("input", () => {updateColorToMatch(colorPicker, red,green,blue, alpha)})
    updateColorToMatch(colorPicker, red,green,blue, alpha)
    r.appendChild(tdHelperDBZ(dv))
    r.appendChild(tdHelper(red))
    r.appendChild(tdHelper(green))
    r.appendChild(tdHelper(blue))
    r.appendChild(tdHelper(alpha))
    r.appendChild(tdHelper(colorPicker))
    return r
}

function updateNumbersToMatch(c, r, g, b) {
    r.value = parseInt(c.value[1] + c.value[2], 16)
    g.value = parseInt(c.value[3] + c.value[4], 16)
    b.value = parseInt(c.value[5] + c.value[6], 16)

}

function updateColorToMatch(c, r, g, b, a) {
    let rN = r.valueAsNumber.toString(16) 
    let gN = g.valueAsNumber.toString(16) 
    let bN = b.valueAsNumber.toString(16)
    if (rN.length < 2) {rN = "0" + rN}
    if (gN.length < 2) {gN = "0" + gN}
    if (bN.length < 2) {bN = "0" + bN}
    c.value = "#" + rN + gN + bN
    c.style.opacity = (a.valueAsNumber * 100 / 255) + "%"


}

function tdHelperRGB() {
    b = document.createElement("input")
    b.type = "number"
    b.max = 255
    b.min = 0
    b.value = 0
    return b

}
function tdHelperColor() {
    // var e = document.createElement("td")
    b = document.createElement("input")
    b.type = "color"
    // e.appendChild(b)
    return b
}

function tdHelper(n) {
    var e = document.createElement("td")
    e.appendChild(n)
    return e

}
function tdHelperDBZ(dv = 0) {
    var e = document.createElement("td")
    b = document.createElement("input")
    b.type = "number"
    b.value = dv
    e.appendChild(b)
    return e

}



function addRow() {
    document.getElementById("table").appendChild(rowConstructor())

}


function removeRow() {
    let table = document.getElementById("table")
    rowCount = table.childElementCount - 1
    if (rowCount > 0) {
        table.removeChild(table.children[table.childElementCount - 1])
    }


}

function loader() {
    addRow()
}



function downloadFile(content, fileName) {
    const link = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
 };


 function palDL() {
    let stringBody = `Product: ${products[currentProduct].Product}
Units: ${products[currentProduct].Units}
Step: 5
Scale: ${products[currentProduct].Scale || "1"}
Offset: ${products[currentProduct].Offset || "0"}

`
    let table = document.getElementById("table")

    for (let i = 1; i < table.childElementCount; i++) {
        let dBZ = table.children[i].children[0].children[0]
        let r = table.children[i].children[1].children[0]
        let g = table.children[i].children[2].children[0]
        let b = table.children[i].children[3].children[0]
        stringBody += `Color: ${dBZ.value} ${r.value} ${g.value} ${b.value}
`

    }


    downloadFile(stringBody, "myPalette.pal")

 }

 function wspalDL() {
    let stringBody = `Custom Palette

`
    let table = document.getElementById("table")

    for (let i = 1; i < table.childElementCount; i++) {
        let dBZ = table.children[i].children[0].children[0]
        let r = table.children[i].children[1].children[0]
        let g = table.children[i].children[2].children[0]
        let b = table.children[i].children[3].children[0]
        let a = table.children[i].children[4].children[0]
        stringBody += `${r.value},${g.value},${b.value},${a.value};${r.value},${g.value},${b.value},${a.value}|${dBZ.value} 
`

    }


    downloadFile(stringBody, "myPallete.wspal")

 }


function handleFileUpload(n) {
    let table = document.getElementById("table")
    rowCount = table.childElementCount - 1
    for (i = rowCount; i > 0; i--) {
        table.removeChild(table.children[table.childElementCount - 1])
    }




    let fr = new FileReader()
    fr.addEventListener("load", () => {
        let fname = n.name
        fname = fname.split(".")
        fname = fname[fname.length - 1]
        if (fname=="wspal") {wspalHandler(fr.result)}
        if (fname=="pal") {palHandler(fr.result)}
    })
    fr.readAsText(n)
}

function palHandler(n) {
    let lines = n.replace(/(?:\r\n|\r)+/g, "\n")
    lines = lines.split("\n")
    console.log(lines)
    for (let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].split(":")
        if (lines[i].length < 2) {continue}
        lines[i] = lines[i][1].split(" ")

        for (let j = lines[i].length - 1; j > -1; j--) {
            if (lines[i][j] == "") {
                lines[i].splice(j, 1)
            }

        }

        if (lines[i].length >= 4) {
            document.getElementById("table").appendChild(rowConstructor(lines[i][0], lines[i][1], lines[i][2], lines[i][3]))
        }
    }
}
function wspalHandler(n) {
    let lines = n.replace(/(?:\r\n|\r)+/g, "\n")
    lines = lines.split("\n")

    for (let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].split("|")
        if (lines[i].length < 2) {continue}
        let dbz = lines[i][1]
        lines[i] = lines[i][0].split(";")
        lines[i] = lines[i][0].split(",")
        if (lines[i].length == 4) {
            document.getElementById("table").appendChild(rowConstructor(dbz,lines[i][0], lines[i][1], lines[i][2], lines[i][3]))
        }

    
    }
}


function pushRow(n) {
    console.log(n)

}



var row;

function start(){  
  row = event.target; 
}
function dragover(){
  var e = event;
  e.preventDefault(); 
  
  let children= Array.from(e.target.parentNode.parentNode.children);
  
  if(children.indexOf(e.target.parentNode)>children.indexOf(row))
    e.target.parentNode.after(row);
  else
    e.target.parentNode.before(row);
}

let products = {
    "br1": {"Product":"BR", "Units": "dBZ"},
    "2mt1": {"Product": "2MT", "Units": "°F", "Scale": "1.8", "Offset": "32"},
    "2mt2": {"Product": "2MT", "Units": "°C"},
    "srv1": {"Product": "SRV", "Units": "m/s"},
    "srv2": {"Product": "SRV", "Units": "MPH", "Scale": "2.23694"},
    "cape1": {"Product": "CAPE", "Units": "J/kg"},
    "apcp1" : {"Product": "APCP1", "Units": "mm"},
    "apcp2" : {"Product": "APCP1", "Units": "Inches", "Scale": "0.03937"},
}

let currentProduct = "br1"

function updateUnits(m) {
    currentProduct = m
    document.getElementById("unitLabel").innerText = products[currentProduct].Units

}

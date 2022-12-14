
window.addEventListener("load", main)

let captchaString = randomCharacters(5)
let skewedString
let obj
const fontSize = 55

async function main() {

    const myCanvas = document.getElementById("canvas")
    const submitButton = document.querySelector("#submit")
    const captchaInput = document.querySelector("#captchaInput")
    submitButton.disabled = true
    captchaInput.addEventListener("input", () => {verifyCaptcha(captchaInput, submitButton)})
    submitButton.addEventListener("click", () => alert("Congratulations! You solved the captcha! 🥳"))

    obj = await izzzNoise(myCanvas.width, myCanvas.height)

    const ctx = canvas.getContext("2d");
    ctx.drawImage(obj.img, obj.x, obj.y)
    
    skewedString = skewText(captchaString)
    drawCaptcha(myCanvas, skewedString)
    setInterval(() => {
        updateCaptcha(myCanvas)
        submitButton.disabled = "true"
    }, 5000)
}

function verifyCaptcha(captchaInput, button) {
    if (captchaInput.value == captchaString) {
        button.disabled = false
    }
    else {
        console.log(captchaInput.value)
    }

}

function updateCaptcha(myCanvas) {
    myCanvas.getContext("2d")   .drawImage(obj.img, obj.x, obj.y)

    const i = Math.floor(Math.random() * captchaString.length)
    captchaString = setCharAt(captchaString, i, randomCharacters()[0])
    skewedString[i] = skewText(captchaString[i])[0]
    drawCaptcha(myCanvas, skewedString)
    
}

function randomCharacters(len=1) {
    let o = ""
    const validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const vLen = validChars.length
    for (i=0; i<len; i++) {
        o += validChars[Math.floor(Math.random() * vLen)]
    }
    return o
}

function skewText(captchaString) {
    
    //xScale, ySkew, xSkew, yScale, xPos, yPos
    //Scale = 1; Skew = positive and negative range; xPos = fontHeight * cos(angle); yPos = (canvasHeight + fontSize) / 2;
    let o = []
    for (i=0; i<captchaString.length; i++) {

        const xSkew = (Math.random() - 0.5) * 1.3   //1.3 = ~33 degrees
        const ySkew = (Math.random() - 0.5) * 1.3
        const xOffset = Math.max(fontSize * Math.sin(xSkew * Math.PI / 4), 0)
        const yOffset = (Math.random() - 0.5)
        
        o.push({"char": captchaString[i], "xSkew": xSkew, "ySkew": ySkew, "xOffset": xOffset, "yOffset": yOffset})

    }
    return o
}

function drawCaptcha(myCanvas, captchaString) {
    const tracking = myCanvas.width / (captchaString.length + 2)

    const ctx = myCanvas.getContext("2d");    
    for (i=0; i<captchaString.length; i++) {
        const char = captchaString[i]

        const xPos = char.xOffset +  (i + 1) * tracking
        const yPos = ((myCanvas.height + fontSize) / 2) + (char.yOffset * (0.5 * fontSize))

        ctx.setTransform(1, char.ySkew, char.xSkew, 1, xPos, yPos);
        ctx.font = fontSize + "px Architects Daughter"
        ctx.fillStyle = "#000000"
        ctx.fillText(char.char, 0, 0)
        ctx.resetTransform()
    }

    


}

function izzzNoise(w, h) {
        return new Promise((res, rej) => {
            img = new Image
            img.src = 'https://pbs.twimg.com/media/Ffd22lOXwAEDxid.jpg'
            img.onload = () => {
                const x = (Math.random() * (img.width - w) * -1) 
                const y = (Math.random() * (img.height - h) * -1) 
                res({"img": img, "x": x, "y":y})}

        })

        

    

}

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

//func to set up canvas initially
//func to create captcha image from string, then push to canvas
//func to generate new strings

function whatIsThis() {
    o = "This project was created for the Halloween 2022 \"Big Ooo Notation\" contest at CNU. The goal of the contest was to create the scariest project possible, by showing off poor code practices and unintuitive design choices. \n"
    o += "\nIn this project, the captcha image changes slightly every couple of seconds. It also uses a font that's totally (not) unreadable for robots (and is definitely readable for humans!) \n"
    o += "\nWhen you solve the captcha the \"Continue\" button will light up blue and become clickable. Try your best to solve it!"
    o += "\nAnd whatever you do, do NOT open your browser's console and type console.log(captchaString)"
    o += "\n;)\n\n\n"
    o += "Captcha background art from @czkalier on Twitter \n"
    o += "CSS modified from user @stack-findover on CodePen.io"
    o+= "\n\n(No login information is actually sent or recorded anywhere once you click the button)"
    alert(o)
}
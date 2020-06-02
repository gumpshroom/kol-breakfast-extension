var mainpane = window.frames[2]
var menupane = window.frames[1]
var lastMinVal = "none"
mainpane.onload = function() {
    mainpane = window.mainpane
    mainpane.addEventListener("beforeunload", function(event) {
        checkFrames()
    });
    /*new MutationObserver(function(mutations) {
        mutations.some(function(mutation) {
            console.log(mutation)
            if (mutation.type === 'childList') {
                console.log("!")
                //console.log('Old src: ', mutation.oldValue);
                //console.log('New src: ', mutation.target.src);
                checkFrames()
                return true;
            }

            return false;
        });
    }).observe(mainpane.document, {
        attributes: true,
        attributeOldValue: true,
        characterData: false,
        characterDataOldValue: false,
        childList: true,
        subtree: false
    });*/
}

function checkFrames() {
    if (mainpane.document.location.pathname === "/main.php") {


        var framedoc = mainpane.document
        var JSONpattern = /[{\[]{1}([,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]|".*?")+[}\]]{1}/g
        var pidpattern = /var playerid = ([0-9]+);/g
        var reminderPattern = /<b>Reminder:<\/b> (?<=\ )(.*?)(?=\<)<br>/g
        var remindBox = framedoc.querySelectorAll("td[bgcolor=\"orange\"]")[framedoc.querySelectorAll("td[bgcolor=\"orange\"]").length - 1].parentNode.parentNode.children[1].children[0].children[0].children[0].children[0].children[0].children[0].children[0]
        console.log(menupane.document.querySelectorAll("input[name=\"pwd\"]"))
        var pid = document.querySelectorAll("frame[name=\"charpane\"]")[0].contentDocument.documentElement.outerHTML
        pid = pid.split(pidpattern)[1]
        console.log("pid: " + pid)
        var pwd = menupane.document.querySelectorAll("input[name=\"pwd\"]")[0].value
        console.log("pwd: " + pwd)
        console.log(remindBox)
        if (remindBox) {
            var remindContentsRaw = remindBox.innerHTML.split(reminderPattern)
            var remindDOM = remindBox.innerHTML.split("<br>")
            for (var u = 0; u < remindDOM.length; u++) {
                remindDOM[u] = "<span id='reminder" + u + "'><b>" + remindDOM[u].slice(3, remindDOM[u].length) + "</span>"
            }
            remindBox.innerHTML = remindDOM.join("<br>")
            var remindersWithActions = []
            for (var p = 0; p < remindContentsRaw.length; p++) {
                if (remindContentsRaw[p] === "") {
                    remindContentsRaw.splice(p, 1)
                    p--
                }
            }
            console.log(remindContentsRaw)
            for (var i = 0; i < remindContentsRaw.length; i++) {
                var item = remindContentsRaw[i]
                if (item.includes(" ACTION=")) {
                    var raw = item.split(' ACTION=')
                    var obj = {
                        text: raw[0],
                        action: decodeEntities(raw[1]),
                        id: i
                    }
                    remindersWithActions.push(obj)
                }
            }
            console.log(remindersWithActions)

            for (var x = 0; x < remindersWithActions.length; x++) {
                var reminder = remindersWithActions[x]
                console.log(reminder)
                var script = framedoc.createElement("script")
                script.innerHTML = "function doMacro(command, pwd, pid, elem) {\n" +
                    "        var macro = command;\n" +
                    "        macro = macro.replace(/&amp;/g, '&');\n" +
                    "        if (!macro.match(/^\\//)) macro = '/' + macro;\n" +
                    "\n" +
                    "        var m, rep;\n" +
                    "        while (m = macro.match(/\\$\\d/)) {\n" +
                    "            var rep = prompt(\"Value for \"+m[0]+\"?\");\n" +
                    "            while (macro.indexOf(m[0]) != -1) {\n" +
                    "                macro = macro.replace(m[0], rep);\n" +
                    "            }\n" +
                    "        }\n" +
                    "\n" +
                    "        " +
                    "        var url = document.location.protocol+\"//\"+window.location.host+\"/submitnewchat.php?playerid=\" + pid + \"&pwd=\" + pwd + \"&graf=\" + (encodeURIComponent(\"/newbie \" + macro).replace(/%20/g, '+')) + '&pwd=' + pwd +\"&cli=1\";\n" +
                    "        httpGet(url);\n" +
                    "        elem.parentNode.innerHTML = elem.title + ' complete!'" +
                    "    }\n" +
                    "\n" +
                    "    function httpGet(theUrl)\n" +
                    "    {\n" +
                    "        var xmlHttp = new XMLHttpRequest();\n" +
                    "        xmlHttp.open( \"GET\", theUrl, false ); // false for synchronous request\n" +
                    "        xmlHttp.setRequestHeader('accept', '*/*');\n" +
                    "        xmlHttp.send( null );\n" +
                    "        console.log('sent GET to ' + theUrl);\n" +
                    "        return xmlHttp.responseText;\n" +
                    "    }\n" +
                    "function decodeEntities(encodedString) {\n" +
                    "    var textArea = document.createElement('textarea');\n" +
                    "    textArea.innerHTML = encodedString;\n" +
                    "    return textArea.value;\n" +
                    "}"

                var doMacroButton = framedoc.createElement("button")

                doMacroButton.setAttribute("onclick", "doMacro('" + reminder.action + "', '" + pwd + "', '" + pid + "', this)")
                doMacroButton.title = reminder.text
                doMacroButton.alt = reminder.text
                doMacroButton.innerText = reminder.text
                doMacroButton.setAttribute("class", "button bfast")
                framedoc.getElementById("reminder" + reminder.id).innerHTML = "<b>Reminder: </b>" + doMacroButton.outerHTML
                framedoc.getElementById("reminder" + reminder.id).appendChild(script)
            }

        }

        function decodeEntities(encodedString) {
            var textArea = document.createElement('textarea');
            textArea.innerHTML = encodedString;
            return textArea.value;
        }
    }
    if (mainpane.document.location.pathname === "/mall.php") {
        console.log("mall")
        var maxInput = mainpane.document.getElementsByName("max_price")[0]
        //console.log(maxInput)

        if(lastMinVal !== "none") {
            maxInput.value += " MIN=" + lastMinVal
        }
        if (maxInput.value.includes("MIN=")) {
            var min = parseInt(maxInput.value.split("MIN=")[1])
            setTimeout(function() {
                mainpane = window.frames[2]
                //console.log(mainpane.document.getElementById("searchresults"))
                if(mainpane.document.getElementById("searchresults")) {
                    var results = mainpane.document.getElementById("searchresults").querySelectorAll("table[class='itemtable']")
                    for (var x = 0; x < results.length; x++) {
                        var prices = results[x].firstChild.querySelectorAll("tr[class='graybelow']")
                        //console.log(prices)
                        //var firstPrice = parseInt(prices[0].querySelectorAll("td[class='small price']").innerText.split(" Meat")[0].join(","))
                        var priceStr = prices[prices.length - 1].querySelectorAll("td[class='small price']")[0].innerText
                        priceStr.replace(" Meat", "")
                        var lastPrice = parseInt(priceStr.split(",").join(""))
                        if (lastPrice < min) {
                            results[x].remove()
                        }
                        lastMinVal = min
                    }
                }
            }, 1000)

        } else {
            lastMinVal = "none"
        }
    }
    setTimeout(function() {
        mainpane = window.frames[2]
        //console.log(mainpane)
        mainpane.addEventListener("beforeunload", function(event) {
            checkFrames()
        });
    }, 500)

    console.log("checking, mainpane: " + mainpane.document.location.pathname)
}

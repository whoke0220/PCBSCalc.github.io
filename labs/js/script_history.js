function saveBuild(pcCase, cpu, ramChannel, ramSpeed, ram, gpuCount, gpuType, gpu, mobo, cost, budgetleft, score, systemWatts, type, comment) {
    sessionStorage.setItem(new Date().getTime(), JSON.stringify({
        "pcCase": pcCase,
        "cpu": cpu,
        "ramChannel": ramChannel,
        "ramSpeed": ramSpeed,
        "ram": ram,
        "gpuCount": gpuCount,
        "gpuType": gpuType,
        "gpu": gpu,
        "mobo": mobo,
        "cost": cost,
        "budgetleft": budgetleft,
        "score": score,
        "systemWatts": systemWatts,
        "type": type,
        "comment": comment
    }))
}
function savePcBuild(id, type, comment) {

    type = type
    comment = comment

    pcCase = id.cells[0].innerHTML
    cpu = id.cells[1].innerHTML
    ramChannel = id.cells[2].innerHTML
    ramSpeed = id.cells[3].innerHTML
    ram = id.cells[4].innerHTML
    gpuCount = id.cells[5].innerHTML
    gpuType = id.cells[6].innerHTML
    gpu = id.cells[7].innerHTML
    mobo = id.cells[8].innerHTML
    cost = id.cells[9].innerHTML
    budgetleft = id.cells[10].innerHTML
    score = id.cells[11].innerHTML
    systemWatts = id.cells[12].innerHTML

    saveBuild(pcCase, cpu, ramChannel, ramSpeed, ram, gpuCount, gpuType, gpu, mobo, cost, budgetleft, score, systemWatts, type, comment)
}
function updateHistory() {
    resetResultsTable(document.getElementById('table3DMarkScoreCalculatorHistory'), 0, 0)
    resetResultsTable(document.getElementById('tableBuildMakerSaves'), 0, 0)

    var list = Object.keys(sessionStorage)
    list.forEach(function (item) {
        var a = JSON.parse(sessionStorage[item])
        if (a.type == "div3DMarkScoreCalculatorForm") {
            var table = document.getElementById('table3DMarkScoreCalculatorHistory')
            table.insertRow(1)
            for (i = 0; i < 9; i++) {
                table.rows[1].insertCell(i)
            }
            table.rows[1].cells[0].className = "tdCpu"
            table.rows[1].cells[0].innerHTML = a.cpu

            table.rows[1].cells[1].className = "tdramChannel"
            table.rows[1].cells[1].innerHTML = a.ramChannel
            table.rows[1].cells[2].className = "tdRamSpeed"
            table.rows[1].cells[2].innerHTML = a.ramSpeed

            table.rows[1].cells[3].className = "tdGpuCount"
            table.rows[1].cells[3].innerHTML = a.gpuCount
            table.rows[1].cells[4].className = "tdGpuType"
            table.rows[1].cells[4].innerHTML = a.gpuType
            table.rows[1].cells[5].className = "tdGpuPart"
            table.rows[1].cells[5].innerHTML = a.gpu

            table.rows[1].cells[6].className = "tdCost"
            table.rows[1].cells[6].innerHTML = a.cost

            table.rows[1].cells[7].className = "tdScore"
            table.rows[1].cells[7].innerHTML = a.score

            table.rows[1].cells[8].className = "tdOther"
            table.rows[1].cells[8].innerHTML = a.systemWatts
        } else if (a.type == "build") {
            var table = document.getElementById('tableBuildMakerSaves')
            table.insertRow(1)
            for (i = 0; i < 14; i++) {
                table.rows[1].insertCell(i)
            }
            table.rows[1].cells[0].className = "tdCase"
            table.rows[1].cells[0].innerHTML = a.pcCase

            table.rows[1].cells[1].className = "tdCpu"
            table.rows[1].cells[1].innerHTML = a.cpu

            table.rows[1].cells[2].className = "tdramChannel"
            table.rows[1].cells[2].innerHTML = a.ramChannel
            table.rows[1].cells[3].className = "tdRamSpeed"
            table.rows[1].cells[3].innerHTML = a.ramSpeed
            table.rows[1].cells[4].className = "tdRamPart"
            table.rows[1].cells[4].innerHTML = a.ram

            table.rows[1].cells[5].className = "tdGpuCount"
            table.rows[1].cells[5].innerHTML = a.gpuCount
            table.rows[1].cells[6].className = "tdGpuType"
            table.rows[1].cells[6].innerHTML = a.gpuType
            table.rows[1].cells[7].className = "tdGpuPart"
            table.rows[1].cells[7].innerHTML = a.gpu

            table.rows[1].cells[8].className = "tdMobo"
            table.rows[1].cells[8].innerHTML = a.mobo

            table.rows[1].cells[9].className = "tdCost"
            table.rows[1].cells[9].innerHTML = a.cost
            table.rows[1].cells[10].className = "tdCost"
            table.rows[1].cells[10].innerHTML = a.budgetleft

            table.rows[1].cells[11].className = "tdScore"
            table.rows[1].cells[11].innerHTML = a.score

            table.rows[1].cells[12].className = "tdOther"
            table.rows[1].cells[12].innerHTML = a.systemWatts
            table.rows[1].cells[13].className = "tdOther"
            table.rows[1].cells[13].innerHTML = a.comment
        }
    })
}

var currSaves = 0
setInterval(function () {
    if (currSaves < sessionStorage.length) {
        currSaves = sessionStorage.length
        updateHistory()
    }
}, 100)
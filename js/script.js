function showThisPage(idToShow) {
    document.getElementById('div3DMarkScores').style.display = ((idToShow == 'div3DMarkScores') ? "block" : "none")
    document.getElementById('divBuildMaker').style.display = ((idToShow == 'divBuildMaker') ? "block" : "none")
    document.getElementById('divBuildUpgrader').style.display = ((idToShow == 'divBuildUpgrader') ? "block" : "none")
    document.getElementById('divPartFixer').style.display = ((idToShow == 'divPartFixer') ? "block" : "none")
    document.getElementById('divHistoryAndSaves').style.display = ((idToShow == 'divHistoryAndSaves') ? "block" : "none")
};

function blurBackground(id) {
    id.style.filter = "blur(8px)"
}

function unblurBackground(id) {
    id.style.filter = "blur(0px)"
}

function getScore(cpuScore, gpuScore) {
    return Math.floor(1 / ((0.85 / gpuScore) + (0.15 / cpuScore)))
}

function getWattage(gpuwattage, cpuwattage) {
    return gpuwattage + cpuwattage + 30
}

function showAvailableRamSpeed(cpu, ramslist) {
    var speedList = Object.keys(data.procs[cpu]['1'])
    for (i = 0; i < ramslist.options.length; i++) {
        if (speedList.includes(ramslist.options[i].value) == false) {
            ramslist.options[i].style.display = 'none'
        } else {
            ramslist.options[i].style.display = 'block'
        }
    }
}

function showAvailableRamChannel(cpu, channellist) {
    for (i = 0; i < channellist.options.length; i++) {
        if (data.procs[cpu][channellist.options[i].value]) {
            channellist.options[i].style.display = "block"
        } else {
            channellist.options[i].style.display = "none"
        }
    }
}

function socketsCompatible(socket1, socket2) {
    if (socket1 == "LGA 1151 (Skylake)" &&
        socket2 == "LGA 1151 (Kaby Lake)") {
        return true
    } else if (
        socket1 == "LGA 1151 (Kaby Lake)" &&
        socket2 == "LGA 1151 (Skylake)") {
        return true
    } else {
        return socket1 == socket2
    }
}

function motherboardSupportsMultiGPUType(motherboardSupportSLI, motherboardSupportCrossfire, gpuMultiGPU) {
    if (gpuMultiGPU == "SLI") {
        return (motherboardSupportSLI == "Yes")
    } else if (gpuMultiGPU == "CrossFire") {
        return (motherboardSupportCrossfire == "Yes")
    } else {
        return true
    }
}

function showAvailableMotherboard(cpuid, gpuid, gpuCount, motherboardlist, ramspeed) {
    for (mobo in motherboardlist.options) {
        if (mobo == "length" || mobo == "selectedIndex" || mobo == "add" || mobo == "remove" || mobo == "item" || mobo == "namedItem") {
            continue
        }
        if (socketsCompatible(data.procs[cpuid].cpuSocket, data.motherboards[motherboardlist.options[mobo].innerHTML].cpuSocket)) {
            if (gpuCount == "1") {
                motherboardlist.options[mobo].style.display = "block"
            } else {
                if (motherboardSupportsMultiGPUType(data.motherboards[motherboardlist.options[mobo].innerHTML].supportSLI, data.motherboards[motherboardlist.options[mobo].innerHTML].supportCrossfire, data.gpus[gpuid].multiGPU)) {
                    if (data.motherboards[motherboardlist.options[mobo].innerHTML].memorySpeedSteps.includes(ramspeed) || Number(ramspeed) < data.motherboards[motherboardlist.options[mobo].innerHTML].maxMemorySpeed) {
                        motherboardlist.options[mobo].style.display = "block"
                    } else {
                        motherboardlist.options[mobo].style.display = "none"
                    }
                } else {
                    motherboardlist.options[mobo].style.display = "none"
                }
            }
        } else {
            motherboardlist.options[mobo].style.display = "none"
        }
    }
}

function showAvailableMotherboard2(cpuid, gpu1, gpu2, motherboardlist) {

    if (data.procs[cpuid] == null) {
        return false
    }
    if (gpu1 == "" && gpu2 == "") {
        return false
    }
    if (gpu1 != "" && data.gpus[gpu1] == null) {
        return false
    }
    if (gpu2 != "" && data.gpus[gpu2] == null) {
        return false
    }

    var gpuCount = 0
    var evalGpu
    if (gpu1 != "") {
        gpuCount += 1
        evalGpu = gpu1
    }
    if (gpu2 != "") {
        gpuCount += 1
        evalGpu = gpu2
    }
    for (mobo in motherboardlist.options) {
        if (mobo == "length" || mobo == "selectedIndex" || mobo == "add" || mobo == "remove" || mobo == "item" || mobo == "namedItem") {
            continue
        }
        if (socketsCompatible(data.procs[cpuid].cpuSocket, data.motherboards[motherboardlist.options[mobo].innerHTML].cpuSocket)) {
            if (gpuCount == "1") {
                motherboardlist.options[mobo].style.display = "block"
            } else {
                if (motherboardSupportsMultiGPUType(data.motherboards[motherboardlist.options[mobo].innerHTML].supportSLI, data.motherboards[motherboardlist.options[mobo].innerHTML].supportCrossfire, data.gpus[evalGpu].multiGPU)) {
                    motherboardlist.options[mobo].style.display = "block"
                } else {
                    motherboardlist.options[mobo].style.display = "none"
                }
            }
        } else {
            motherboardlist.options[mobo].style.display = "none"
        }
    }
}

function calculate(showAlerts) {
    var form = document.getElementById('scoreCForm')

    var cpu = form.cpu1.value
    var rams = form.rams1.value
    var ramc = form.ramc1.value
    var gpu = form.gpu1.value
    var gpuCount = form.gpuCount1.value

    if (!data.procs[cpu]) {
        if (showAlerts) {
            alert("CPU not found.")
        }
        return false
    }
    if (!data.procs[cpu][ramc]) {
        if (showAlerts) {
            alert("RAM Channel not found for CPU.")
        }
        return false
    }
    if (!data.procs[cpu][ramc][rams]) {
        if (showAlerts) {
            alert("RAM Speed not found for CPU.")
        }
        return false
    }
    if (!data.gpus[gpu]) {
        if (showAlerts) {
            alert("GPU not found.")
        }
        return false
    }
    if (!data.gpus[gpu][gpuCount]) {
        if (showAlerts) {
            alert("Selected GPU does not support multi-GPU.")
        }
        return false
    }

    var systemScore = getScore(data.procs[cpu][ramc][rams], data.gpus[gpu][gpuCount].graphicsScore)
    var systemWattage = getWattage(data.gpus[gpu][gpuCount].wattage, data.procs[cpu].wattage)
    var cpuNewPrice = data.procs[cpu].price
    var cpuUsedPrice = data.procs[cpu].sellPrice
    var gpusNewPrice = data.gpus[gpu][gpuCount].price
    var gpusUsedPrice = data.gpus[gpu][gpuCount].sellPrice
    var gpuType = data.gpus[gpu].gpuType
    document.getElementById('cpuScoreResult1').innerText = data.procs[cpu][ramc][rams]
    document.getElementById('gpuScoreResult1').innerText = data.gpus[gpu][gpuCount].graphicsScore
    document.getElementById('totalScoreResult1').innerText = systemScore
    document.getElementById('gpuTypeResult1').innerText = gpuType
    document.getElementById('wattageResult1').innerText = systemWattage
    document.getElementById('cpuPrice1').innerText = cpuNewPrice
    document.getElementById('cpuUsedPrice1').innerText = cpuUsedPrice
    document.getElementById('gpuPrice1').innerText = gpusNewPrice
    document.getElementById('gpuUsedPrice1').innerText = gpusUsedPrice

    return [systemScore, systemWattage, cpuNewPrice + gpusNewPrice, gpuType]
}

function parts(proc, channel, ramspeed, ram, gpuCount, gpuType, gpu, mobo, cost, budgetleft, score, wattage) {
    var build = {
        "processor": proc,
        "channel": channel,
        "ramspeed": ramspeed,
        "ram": ram,
        "gpuCount": gpuCount,
        "gpuType": gpuType,
        "gpu": gpu,
        "mobo": mobo,
        "cost": cost,
        "budgetleft": budgetleft,
        "score": score,
        "wattage": wattage
    }
    return build
}

function suggestedFix(proc, gpu1Type, gpu1, gpu2Type, gpu2, mobo, cost, budgetleft, wattage) {
    var fix = {
        "processor": proc,
        "gpu1Type": gpu1Type,
        "gpu1": gpu1,
        "gpu2Type": gpu2Type,
        "gpu2": gpu2,
        "mobo": mobo,
        "cost": cost,
        "budgetleft": budgetleft,
        "wattage": wattage
    }
    return fix
}

var temp

function addSaveButton(target, id) {
    var button = document.createElement('BUTTON')
    button.id = id
    button.className = "buttonSave"
    button.onclick = function () {
        blurBackground(document.getElementById('buildMaker'))
        blurBackground(document.getElementById('buildMakerResults'))
        showSaver(document.getElementById('saveBuildBackground'))
        temp = this.id
    }
    var text = document.createTextNode('Save')
    button.append(text)
    target.append(button)
}

function showSaver(id) {
    id.style.display = "block"
}

function hideSaver(id) {
    id.style.display = "none"
}

function savePcBuild(id, type, comment) {

    type = type
    comment = comment

    cpu = id.cells[0].innerHTML
    ramc = id.cells[1].innerHTML
    rams = id.cells[2].innerHTML
    ram = id.cells[3].innerHTML
    gpuCount = id.cells[4].innerHTML
    gpuType = id.cells[5].innerHTML
    gpu = id.cells[6].innerHTML
    mobo = id.cells[7].innerHTML
    cost = id.cells[8].innerHTML
    budgetleft = id.cells[9].innerHTML
    score = id.cells[10].innerHTML
    wattage = id.cells[11].innerHTML

    saveBuild(cpu, ramc, rams, ram, gpuCount, gpuType, gpu, mobo, cost, budgetleft, score, wattage, type, comment)
}

function generateBuilds(showAlerts) {
    var form = document.getElementById('buildForm')

    var budget = Number(form.budget1.value)
    var resbudget = Number(form.resbudget1.value) || 400
    var score = Number(form.score1.value)
    var offset = Number(form.offset1.value) || 400
    var level = Number(form.level1.value)
    var results = Number(form.results1.value) || 200

    var selectedCPUSocket = form.selectedCPUSocket1.value
    var selectedGPUCount = form.selectedGPUCount1.value
    var selectedGPUType = form.selectedGPUType1.value
    var incmobo = form.incmobo1.checked
    var incram = form.incram1.checked
    var needoc = form.needoc1.checked

    if (isNaN(budget) || budget == 0) {
        if (showAlerts) {
            alert("Budget is required.")
        }
        return false
    }
    if (isNaN(score) || score == 0) {
        if (showAlerts) {
            alert("Score is required.")
        }
        return false
    }
    if (isNaN(level) || level == 0) {
        if (showAlerts) {
            alert("Level is required.")
        }
        return false
    }

    var builds = []
    for (cpu in data.procs) {
        if (data.procs[cpu].level <= level) {
            if (needoc == true && data.procs[cpu].canOverclock == "No") {
                continue
            }
            if (selectedCPUSocket != "Any" && selectedCPUSocket != data.procs[cpu].cpuSocket) {
                continue
            }
            for (ramchannel in data.procs[cpu]) {
                if (ramchannel != "1" && ramchannel != "2" && ramchannel != "3" && ramchannel != "4") {
                    continue
                }
                for (ramspeed in data.procs[cpu][ramchannel]) {
                    for (gpu in data.gpus) {
                        if (data.gpus[gpu].level > level) {
                            continue
                        }
                        if (selectedGPUType != "Any" && selectedGPUType != data.gpus[gpu].gpuType) {
                            continue
                        }
                        for (gpuCount in data.gpus[gpu]) {
                            if (gpuCount != "1" && gpuCount != "2") {
                                continue
                            }
                            if (selectedGPUCount != "Any" && selectedGPUCount != gpuCount) {
                                continue
                            }
                            var currentScore = getScore(data.procs[cpu][ramchannel][ramspeed], data.gpus[gpu][gpuCount].graphicsScore)
                            var currentPrice = data.procs[cpu].price + data.gpus[gpu][gpuCount].price
                            if (currentScore < score || currentPrice > (budget - resbudget)) {
                                continue
                            } else if (currentScore > (score + offset)) {
                                continue
                            }
                            var pickedmobo, pickedram

                            if (incmobo == true && incram == false) {
                                for (mobo in data.motherboards) {
                                    if (data.motherboards[mobo].level > level) {
                                        continue
                                    } else if (gpuCount == "2" && motherboardSupportsMultiGPUType(data.motherboards[mobo].supportSLI, data.motherboards[mobo].supportCrossfire, data.gpus[gpu].multiGPU) == false) {
                                        continue
                                    } else if (socketsCompatible(data.motherboards[mobo].cpuSocket, data.procs[cpu].cpuSocket) == false) {
                                        continue
                                    } else if (needoc == true && data.motherboards[mobo].canOverclock != "Yes") {
                                        continue
                                    } else if (data.motherboards[mobo].memorySpeedSteps.includes(ramspeed.toString()) == false) {
                                        continue
                                    }
                                    var tempCurrentPrice = currentPrice + data.motherboards[mobo].price
                                    if (tempCurrentPrice <= (budget - resbudget)) {
                                        currentPrice += data.motherboards[mobo].price
                                        pickedmobo = data.motherboards[mobo].fullName
                                        builds.push(parts(cpu, ramchannel, ramspeed, (pickedram || "-"), gpuCount, data.gpus[gpu].gpuType, gpu, (pickedmobo || "-"), currentPrice, (budget - currentPrice), currentScore, (data.procs[cpu].wattage + data.gpus[gpu][gpuCount].wattage)))
                                    }
                                }
                            } else if (incmobo == false && incram == true) {
                                for (rams in data.ram) {
                                    if (data.ram[rams].level > level) {
                                        continue
                                    } else if (data.ram[rams].frequency < Number(ramspeed)) {
                                        continue
                                    }
                                    var tempCurrentPrice = currentPrice + (data.ram[rams].price * ramchannel)
                                    if (tempCurrentPrice <= (budget - resbudget)) {
                                        currentPrice += (data.ram[rams].price * ramchannel)
                                        pickedram = data.ram[rams].fullName
                                        builds.push(parts(cpu, ramchannel, ramspeed, (pickedram || "-"), gpuCount, data.gpus[gpu].gpuType, gpu, (pickedmobo || "-"), currentPrice, (budget - currentPrice), currentScore, (data.procs[cpu].wattage + data.gpus[gpu][gpuCount].wattage)))
                                    }
                                }
                            } else if (incmobo == true && incram == true) {
                                for (mobo in data.motherboards) {
                                    if (data.motherboards[mobo].level > level) {
                                        continue
                                    } else if (gpuCount == "2" && motherboardSupportsMultiGPUType(data.motherboards[mobo].supportSLI, data.motherboards[mobo].supportCrossfire, data.gpus[gpu].multiGPU) == false) {
                                        continue
                                    } else if (socketsCompatible(data.motherboards[mobo].cpuSocket, data.procs[cpu].cpuSocket) == false) {
                                        continue
                                    } else if (needoc == true && data.motherboards[mobo].canOverclock != "Yes") {
                                        continue
                                    } else if (data.motherboards[mobo].memorySpeedSteps.includes(ramspeed.toString()) == false) {
                                        continue
                                    }
                                    var tempCurrentPrice = currentPrice + data.motherboards[mobo].price
                                    if (tempCurrentPrice <= (budget - resbudget)) {
                                        currentPrice += data.motherboards[mobo].price
                                        pickedmobo = data.motherboards[mobo].fullName
                                        for (rams in data.ram) {
                                            if (data.ram[rams].level > level) {
                                                continue
                                            } else if (data.ram[rams].frequency < Number(ramspeed)) {
                                                continue
                                            }
                                            var tempCurrentPrice = currentPrice + (data.ram[rams].price * ramchannel)
                                            if (tempCurrentPrice <= (budget - resbudget)) {
                                                currentPrice += (data.ram[rams].price * ramchannel)
                                                pickedram = data.ram[rams].fullName
                                                builds.push(parts(cpu, ramchannel, ramspeed, (pickedram || "-"), gpuCount, data.gpus[gpu].gpuType, gpu, (pickedmobo || "-"), currentPrice, (budget - currentPrice), currentScore, (data.procs[cpu].wattage + data.gpus[gpu][gpuCount].wattage)))
                                            }
                                        }
                                    }
                                }
                            } else {
                                builds.push(parts(cpu, ramchannel, ramspeed, (pickedram || "-"), gpuCount, data.gpus[gpu].gpuType, gpu, (pickedmobo || "-"), currentPrice, (budget - currentPrice), currentScore, (data.procs[cpu].wattage + data.gpus[gpu][gpuCount].wattage)))
                            }
                        }
                    }
                }
            }
        }
    }

    builds.sort(sortByCost)
    var resultsSorted = []
    if (builds.length <= results) {
        resultsSorted = builds
        results = builds.length
    } else {
        resultsSorted.push(builds[0])
        resultsSorted.push(builds[builds.length - 1])
        for (i = 0; i < results - 2; i++) {
            resultsSorted.push(builds[getRandomInt(1, builds.length - 2)])
        }
    }
    resultsSorted.sort(sortByCost)
    var table = document.getElementById('buildMakerTable')
    for (i = table.rows.length - 1; i >= 1; i--) {
        table.deleteRow(i)
    }
    for (i = 1; i < resultsSorted.length + 1; i++) {
        table.insertRow(i)
        for (a = 0; a < 13; a++) {
            table.rows[i].insertCell(a)
        }
    }
    for (i = 1; i < resultsSorted.length + 1; i++) {
        table.rows[i].cells[0].className = "tdCPU"
        table.rows[i].cells[0].innerHTML = resultsSorted[i - 1].processor

        table.rows[i].cells[1].className = "tdRAMCount"
        table.rows[i].cells[1].innerHTML = resultsSorted[i - 1].channel
        table.rows[i].cells[2].className = "tdRAMSpeed"
        table.rows[i].cells[2].innerHTML = resultsSorted[i - 1].ramspeed
        table.rows[i].cells[3].className = "tdRAMPart"
        table.rows[i].cells[3].innerHTML = resultsSorted[i - 1].ram

        table.rows[i].cells[4].className = "tdGPUCount"
        table.rows[i].cells[4].innerHTML = resultsSorted[i - 1].gpuCount
        table.rows[i].cells[5].className = "tdGPUType"
        table.rows[i].cells[5].innerHTML = resultsSorted[i - 1].gpuType
        table.rows[i].cells[6].className = "tdGPUPart"
        table.rows[i].cells[6].innerHTML = resultsSorted[i - 1].gpu

        table.rows[i].cells[7].className = "tdMotherboard"
        table.rows[i].cells[7].innerHTML = resultsSorted[i - 1].mobo

        table.rows[i].cells[8].className = "tdCost"
        table.rows[i].cells[8].innerHTML = resultsSorted[i - 1].cost
        table.rows[i].cells[9].className = "tdCost"
        table.rows[i].cells[9].innerHTML = resultsSorted[i - 1].budgetleft

        table.rows[i].cells[10].className = "tdScore"
        table.rows[i].cells[10].innerHTML = resultsSorted[i - 1].score

        table.rows[i].cells[11].className = "tdOther"
        table.rows[i].cells[11].innerHTML = resultsSorted[i - 1].wattage

        table.rows[i].cells[12].className = "tdOther"
        table.rows[i].cells[12] = addSaveButton(table.rows[i].cells[12], i)
    }

    if (showAlerts && resultsSorted.length == 0) {
        alert("No builds found.")
    }
}

function sortByCost(a, b) {
    if (a.cost < b.cost) {
        return -1;
    }
    if (a.cost > b.cost) {
        return 1;
    }
    return 0;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateUpgrades(showAlerts) {
    var form = document.getElementById('upgradeForm')

    var budget = Number(form.budget2.value)
    var resbudget = Number(form.resbudget2.value) || 0
    var score = Number(form.score2.value)
    var offset = Number(form.offset2.value) || 400
    var level = Number(form.level2.value)
    var results = Number(form.results2.value) || 200

    var currentProc = form.currentProc1.value
    var currentRamSpeed = form.currentRamS1.value
    var currentRamChannel = form.currentRamC1.value
    var currentGpu = form.currentGpu1.value
    var currentGpuCount = form.currentGpuCount1.value
    var currentMobo = form.currentMobo1.value

    var gpuCount = form.gpuCount2.value
    var gpuType = form.gpuType2.value

    if (isNaN(budget) || budget == 0) {
        if (showAlerts) {
            alert("Budget is required.")
        }
        return false
    }
    if (isNaN(score) || score == 0) {
        if (showAlerts) {
            alert("Score is required.")
        }
        return false
    }
    if (isNaN(level) || level == 0) {
        if (showAlerts) {
            alert("Level is required.")
        }
        return false
    }

    if (!data.procs[currentProc]) {
        if (showAlerts) {
            alert("CPU not found.")
        }
        return false
    }
    if (!data.procs[currentProc][currentRamChannel]) {
        if (showAlerts) {
            alert("RAM Channel not found for CPU.")
        }
        return false
    }
    if (!data.procs[currentProc][currentRamChannel][currentRamSpeed]) {
        if (showAlerts) {
            alert("RAM Speed not found for CPU.")
        }
        return false
    }
    if (!data.gpus[currentGpu]) {
        if (showAlerts) {
            alert("GPU not found.")
        }
        return false
    }
    if (!data.gpus[currentGpu][currentGpuCount]) {
        if (showAlerts) {
            alert("Selected GPU does not support multi-GPU.")
        }
        return false
    }
    if (socketsCompatible(data.motherboards[currentMobo].cpuSocket, data.procs[currentProc].cpuSocket) == false) {
        if (showAlerts) {
            alert("Selected CPU and Motherboard are incompatible.")
        }
        return false
    }

    var currentScore = getScore(data.procs[currentProc][currentRamChannel][currentRamSpeed], data.gpus[currentGpu][currentGpuCount].graphicsScore)
    if (currentScore > score) {
        alert("No upgrade is needed")
        return false
    }

    var upgrades = []

    /* CPU-only upgrade */
    for (cpu in data.procs) {
        if (socketsCompatible(data.procs[cpu].cpuSocket, data.motherboards[currentMobo].cpuSocket) == false) {
            continue
        } else if (data.procs[cpu].level > level) {
            continue
        }

        if (!data.procs[cpu][currentRamChannel]) {
            continue
        }
        if (!data.procs[cpu][currentRamChannel][currentRamSpeed]) {
            continue
        }

        var cost = data.procs[cpu].price
        if (cost > (budget - resbudget)) {
            continue
        }
        var newScore = getScore(data.procs[cpu][currentRamChannel][currentRamSpeed], data.gpus[currentGpu][currentGpuCount].graphicsScore)
        if ((newScore >= score) && (newScore < (score + offset))) {
            upgrades.push(parts(cpu, "-", "-", "-", "-", "-", "-", "-", cost, budget - cost, newScore, (data.procs[cpu].wattage + data.gpus[currentGpu][currentGpuCount].wattage)))
        }
    }

    /* GPU-only upgrade */
    for (gpu in data.gpus) {
        if (data.gpus[gpu].level > level) {
            continue
        }
        if (gpuType != "Any" && gpuType != data.gpus[gpu].gpuType) {
            continue
        }
        for (sf in data.gpus[gpu]) {
            if (sf != "1" && sf != "2") {
                continue
            }
            if (gpuCount != "Any" && gpuCount != sf) {
                continue
            }
            if (sf == "2" && motherboardSupportsMultiGPUType(data.motherboards[currentMobo].supportSLI, data.motherboards[currentMobo].supportCrossfire, data.gpus[gpu].multiGPU) == false) {
                continue
            }

            var cost
            cost = data.gpus[gpu][sf].price
            if (cost <= (budget - resbudget)) {
                var newScore = getScore(data.procs[currentProc][currentRamChannel][currentRamSpeed], data.gpus[gpu][sf].graphicsScore)
                if ((newScore >= score) && (newScore < (score + offset))) {
                    upgrades.push(parts("-", "-", "-", "-", sf, data.gpus[gpu].gpuType, gpu, "-", cost, budget - cost, newScore, (data.procs[currentProc].wattage + data.gpus[gpu][sf].wattage)))
                }
            }
            if (currentGpuCount == 1 && sf == "2" && data.gpus[currentGpu].fullName == data.gpus[gpu].fullName) {
                cost = data.gpus[gpu][1].price
                if (cost <= (budget - resbudget)) {
                    var newScore = getScore(data.procs[currentProc][currentRamChannel][currentRamSpeed], data.gpus[gpu][sf].graphicsScore)
                    if ((newScore >= score) && (newScore < (score + offset))) {
                        upgrades.push(parts("-", "-", "-", "-", "1 + 1", data.gpus[gpu].gpuType, gpu, "-", cost, budget - cost, newScore, (data.procs[currentProc].wattage + data.gpus[gpu][sf].wattage)))
                    }
                }
            }
        }
    }

    /* CPU and GPU upgrade */
    for (cpu in data.procs) {
        if (socketsCompatible(data.motherboards[currentMobo].cpuSocket, data.procs[cpu].cpuSocket) == false) {
            continue
        } else if (data.procs[cpu].level > level) {
            continue
        }

        if (!data.procs[cpu][currentRamChannel]) {
            continue
        }
        if (!data.procs[cpu][currentRamChannel][currentRamSpeed]) {
            continue
        }

        for (gpu in data.gpus) {
            if (data.gpus[gpu].level > level) {
                continue
            }
            if (gpuType != "Any" && gpuType != data.gpus[gpu].gpuType) {
                continue
            }
            for (sf in data.gpus[gpu]) {
                if (sf != "1" && sf != "2") {
                    continue
                }
                if (gpuCount != "Any" && gpuCount != sf) {
                    continue
                }
                if (sf == "2" && motherboardSupportsMultiGPUType(data.motherboards[currentMobo].supportSLI, data.motherboards[currentMobo].supportCrossfire, data.gpus[gpu].multiGPU) == false) {
                    continue
                }

                var cost
                cost = data.gpus[gpu][sf].price + data.procs[cpu].price
                if (cost <= (budget - resbudget)) {
                    var newScore = getScore(data.procs[cpu][currentRamChannel][currentRamSpeed], data.gpus[gpu][sf].graphicsScore)
                    if ((newScore >= score) && (newScore < (score + offset))) {
                        upgrades.push(parts(cpu, "-", "-", "-", sf, data.gpus[gpu].gpuType, gpu, "-", cost, budget - cost, newScore, (data.procs[cpu].wattage + data.gpus[gpu][sf].wattage)))
                    }
                }
                if (currentGpuCount == 1 && sf == "2" && data.gpus[currentGpu].fullName == data.gpus[gpu].fullName) {
                    cost = data.gpus[gpu][1].price + data.procs[cpu].price
                    if (cost <= (budget - resbudget)) {
                        var newScore = getScore(data.procs[cpu][currentRamChannel][currentRamSpeed], data.gpus[gpu][sf].graphicsScore)
                        if ((newScore >= score) && (newScore < (score + offset))) {
                            upgrades.push(parts(cpu, "-", "-", "-", "1 + 1", data.gpus[gpu].gpuType, gpu, "-", cost, budget - cost, newScore, (data.procs[cpu].wattage + data.gpus[gpu][sf].wattage)))
                        }
                    }
                }
            }
        }
    }

    /* motherboard change - CPU-only upgrade */
    for (mobo in data.motherboards) {
        if (data.motherboards[mobo].level > level) {
            continue
        }

        //if (data.motherboards[mobo].fullName == data.motherboards[currentMobo].fullName) {
        //    continue
        //}

        for (cpu in data.procs) {
            if (socketsCompatible(data.motherboards[mobo].cpuSocket, data.procs[cpu].cpuSocket) == false) {
                continue
            } else if (data.procs[cpu].level > level) {
                continue
            }

            if (!data.procs[cpu][currentRamChannel]) {
                continue
            }
            if (!data.procs[cpu][currentRamChannel][currentRamSpeed]) {
                continue
            }

            /* if old motherboard would have worked, skip */
            //if (socketsCompatible(data.motherboards[currentMobo].cpuSocket, data.procs[cpu].cpuSocket) == true) {
            //    continue
            //}

            var cost = data.motherboards[mobo].price + data.procs[cpu].price
            if (cost > (budget - resbudget)) {
                continue
            }
            var newScore = getScore(data.procs[cpu][currentRamChannel][currentRamSpeed], data.gpus[currentGpu][currentGpuCount].graphicsScore)
            if ((newScore >= score) && (newScore < (score + offset))) {
                upgrades.push(parts(cpu, "-", "-", "-", "-", "-", "-", mobo, cost, budget - cost, newScore, (data.procs[cpu].wattage + data.gpus[currentGpu][currentGpuCount].wattage)))
            }
        }
    }

    /* motherboard change - GPU-only upgrade */
    for (mobo in data.motherboards) {
        if (data.motherboards[mobo].level > level) {
            continue
        }

        if (socketsCompatible(data.motherboards[mobo].cpuSocket, data.procs[currentProc].cpuSocket) == false) {
            continue
        }

        //if (data.motherboards[mobo].fullName == data.motherboards[currentMobo].fullName) {
        //    continue
        //}

        for (gpu in data.gpus) {
            if (data.gpus[gpu].level > level) {
                continue
            }
            if (gpuType != "Any" && gpuType != data.gpus[gpu].gpuType) {
                continue
            }
            for (sf in data.gpus[gpu]) {
                if (sf != "1" && sf != "2") {
                    continue
                }
                if (gpuCount != "Any" && gpuCount != sf) {
                    continue
                }
                if (sf == "2" && motherboardSupportsMultiGPUType(data.motherboards[mobo].supportSLI, data.motherboards[mobo].supportCrossfire, data.gpus[gpu].multiGPU) == false) {
                    continue
                }

                /* if old motherboard would have worked, skip */
                //if (motherboardSupportsMultiGPUType(data.motherboards[currentMobo].supportSLI, data.motherboards[currentMobo].supportCrossfire, data.gpus[gpu].multiGPU) == true) {
                //    continue
                //}

                var cost
                cost = data.gpus[gpu][sf].price + data.motherboards[mobo].price
                if (cost <= (budget - resbudget)) {
                    var newScore = getScore(data.procs[currentProc][currentRamChannel][currentRamSpeed], data.gpus[gpu][sf].graphicsScore)
                    if ((newScore >= score) && (newScore < (score + offset))) {
                        upgrades.push(parts("-", "-", "-", "-", sf, data.gpus[gpu].gpuType, gpu, mobo, cost, budget - cost, newScore, (data.procs[currentProc].wattage + data.gpus[gpu][sf].wattage)))
                    }
                }
                if (currentGpuCount == 1 && sf == "2" && data.gpus[currentGpu].fullName == data.gpus[gpu].fullName) {
                    cost = data.gpus[gpu][1].price + data.motherboards[mobo].price
                    if (cost <= (budget - resbudget)) {
                        var newScore = getScore(data.procs[currentProc][currentRamChannel][currentRamSpeed], data.gpus[gpu][sf].graphicsScore)
                        if ((newScore >= score) && (newScore < (score + offset))) {
                            upgrades.push(parts("-", "-", "-", "-", "1 + 1", data.gpus[gpu].gpuType, gpu, mobo, cost, budget - cost, newScore, (data.procs[currentProc].wattage + data.gpus[gpu][sf].wattage)))
                        }
                    }
                }
            }
        }
    }

    /* motherboard change - CPU and GPU upgrade */
    for (mobo in data.motherboards) {
        if (data.motherboards[mobo].level > level) {
            continue
        }

        //if (data.motherboards[mobo].fullName == data.motherboards[currentMobo].fullName) {
        //    continue
        //}

        for (cpu in data.procs) {
            if (socketsCompatible(data.motherboards[mobo].cpuSocket, data.procs[cpu].cpuSocket) == false) {
                continue
            } else if (data.procs[cpu].level > level) {
                continue
            }

            if (!data.procs[cpu][currentRamChannel]) {
                continue
            }
            if (!data.procs[cpu][currentRamChannel][currentRamSpeed]) {
                continue
            }

            for (gpu in data.gpus) {
                if (data.gpus[gpu].level > level) {
                    continue
                }
                if (gpuType != "Any" && gpuType != data.gpus[gpu].gpuType) {
                    continue
                }
                for (sf in data.gpus[gpu]) {
                    if (sf != "1" && sf != "2") {
                        continue
                    }
                    if (gpuCount != "Any" && gpuCount != sf) {
                        continue
                    }
                    if (sf == "2" && motherboardSupportsMultiGPUType(data.motherboards[mobo].supportSLI, data.motherboards[mobo].supportCrossfire, data.gpus[gpu].multiGPU) == false) {
                        continue
                    }

                    /* if old motherboard would have worked, skip */
                    //if (socketsCompatible(data.motherboards[currentMobo].cpuSocket, data.procs[cpu].cpuSocket) == true &&
                    //    motherboardSupportsMultiGPUType(data.motherboards[currentMobo].supportSLI, data.motherboards[currentMobo].supportCrossfire, data.gpus[gpu].multiGPU) == true) {
                    //    continue
                    //}

                    var cost
                    cost = data.gpus[gpu][sf].price + data.motherboards[mobo].price + data.procs[cpu].price
                    if (cost <= (budget - resbudget)) {
                        var newScore = getScore(data.procs[cpu][currentRamChannel][currentRamSpeed], data.gpus[gpu][sf].graphicsScore)
                        if ((newScore >= score) && (newScore < (score + offset))) {
                            upgrades.push(parts(cpu, "-", "-", "-", sf, data.gpus[gpu].gpuType, gpu, mobo, cost, budget - cost, newScore, (data.procs[cpu].wattage + data.gpus[gpu][sf].wattage)))
                        }
                    }
                    if (currentGpuCount == 1 && sf == "2" && data.gpus[currentGpu].fullName == data.gpus[gpu].fullName) {
                        cost = data.gpus[gpu][1].price + data.motherboards[mobo].price + data.procs[cpu].price
                        if (cost <= (budget - resbudget)) {
                            var newScore = getScore(data.procs[cpu][currentRamChannel][currentRamSpeed], data.gpus[gpu][sf].graphicsScore)
                            if ((newScore >= score) && (newScore < (score + offset))) {
                                upgrades.push(parts(cpu, "-", "-", "-", "1 + 1", data.gpus[gpu].gpuType, gpu, mobo, cost, budget - cost, newScore, (data.procs[cpu].wattage + data.gpus[gpu][sf].wattage)))
                            }
                        }
                    }
                }
            }
        }
    }

    upgrades.sort(sortByCost)
    var resultsSorted = []
    if (upgrades.length <= results) {
        resultsSorted = upgrades
        results = upgrades.length
    } else {
        resultsSorted.push(upgrades[0])
        resultsSorted.push(upgrades[upgrades.length - 1])
        for (i = 0; i < results - 2; i++) {
            resultsSorted.push(upgrades[getRandomInt(1, upgrades.length - 2)])
        }
    }
    resultsSorted.sort(sortByCost)
    var table = document.getElementById('buildUpgraderTable')
    for (i = table.rows.length - 1; i >= 1; i--) {
        table.deleteRow(i)
    }
    for (i = 1; i < resultsSorted.length + 1; i++) {
        table.insertRow(i)
        for (a = 0; a < 9; a++) {
            table.rows[i].insertCell(a)
        }
    }
    for (i = 1; i < resultsSorted.length + 1; i++) {
        table.rows[i].cells[0].className = "tdCPU"
        table.rows[i].cells[0].innerHTML = resultsSorted[i - 1].processor

        //table.rows[i].cells[1].className = "tdRAMCount"
        //table.rows[i].cells[1].innerHTML = resultsSorted[i - 1].channel
        //table.rows[i].cells[2].className = "tdRAMSpeed"
        //table.rows[i].cells[2].innerHTML = resultsSorted[i - 1].ramspeed
        //table.rows[i].cells[3].className = "tdRAMPart"
        //table.rows[i].cells[3].innerHTML = resultsSorted[i - 1].ram

        table.rows[i].cells[1].className = "tdGPUCount"
        table.rows[i].cells[1].innerHTML = resultsSorted[i - 1].gpuCount
        table.rows[i].cells[2].className = "tdGPUType"
        table.rows[i].cells[2].innerHTML = resultsSorted[i - 1].gpuType
        table.rows[i].cells[3].className = "tdGPUPart"
        table.rows[i].cells[3].innerHTML = resultsSorted[i - 1].gpu

        table.rows[i].cells[4].className = "tdMotherboard"
        table.rows[i].cells[4].innerHTML = resultsSorted[i - 1].mobo

        table.rows[i].cells[5].className = "tdCost"
        table.rows[i].cells[5].innerHTML = resultsSorted[i - 1].cost
        table.rows[i].cells[6].className = "tdCost"
        table.rows[i].cells[6].innerHTML = resultsSorted[i - 1].budgetleft

        table.rows[i].cells[7].className = "tdScore"
        table.rows[i].cells[7].innerHTML = resultsSorted[i - 1].score

        table.rows[i].cells[8].className = "tdOther"
        table.rows[i].cells[8].innerHTML = resultsSorted[i - 1].wattage
    }

    if (showAlerts && resultsSorted.length == 0) {
        alert("No upgrades found.")
    }
}

function saveBuild(cpu, ramc, rams, ram, gpuCount, gpuType, gpu, mobo, cost, budgetleft, score, wattage, type, comment) {
    sessionStorage.setItem(new Date().getTime(), JSON.stringify({
        "cpu": cpu,
        "ramc": ramc,
        "rams": rams,
        "ram": ram,
        "gpuCount": gpuCount,
        "gpuType": gpuType,
        "gpu": gpu,
        "mobo": mobo,
        "cost": cost,
        "budgetleft": budgetleft,
        "score": score,
        "wattage": wattage,
        "type": type,
        "comment": comment
    }))
}

var currSaves = 0

setInterval(function () {
    if (currSaves < sessionStorage.length) {
        currSaves = sessionStorage.length
        updateHistory()
    }
}, 100)

function updateHistory() {
    var x = document.getElementById('scoreCalculatorHistoryTable')
    var y = document.getElementById('buildMakerHistoryTable')
    for (i = x.rows.length - 1; i >= 1; i--) {
        x.deleteRow(i)
    }
    for (i = y.rows.length - 1; i >= 1; i--) {
        y.deleteRow(i)
    }

    var list = Object.keys(sessionStorage)
    list.forEach(function (item) {
        var a = JSON.parse(sessionStorage[item])
        if (a.type == "scorecalculator") {
            var table = document.getElementById('scoreCalculatorHistoryTable')
            table.insertRow(1)
            for (i = 0; i < 9; i++) {
                table.rows[1].insertCell(i)
            }
            table.rows[1].cells[0].className = "tdCPU"
            table.rows[1].cells[0].innerHTML = a.cpu

            table.rows[1].cells[1].className = "tdRAMCount"
            table.rows[1].cells[1].innerHTML = a.ramc
            table.rows[1].cells[2].className = "tdRAMSpeed"
            table.rows[1].cells[2].innerHTML = a.rams

            table.rows[1].cells[3].className = "tdGPUCount"
            table.rows[1].cells[3].innerHTML = a.gpuCount
            table.rows[1].cells[4].className = "tdGPUType"
            table.rows[1].cells[4].innerHTML = a.gpuType
            table.rows[1].cells[5].className = "tdGPUPart"
            table.rows[1].cells[5].innerHTML = a.gpu

            table.rows[1].cells[6].className = "tdCost"
            table.rows[1].cells[6].innerHTML = a.cost

            table.rows[1].cells[7].className = "tdScore"
            table.rows[1].cells[7].innerHTML = a.score

            table.rows[1].cells[8].className = "tdOther"
            table.rows[1].cells[8].innerHTML = a.wattage
        } else if (a.type == "build") {
            var table = document.getElementById('buildMakerHistoryTable')
            table.insertRow(1)
            for (i = 0; i < 13; i++) {
                table.rows[1].insertCell(i)
            }
            table.rows[1].cells[0].className = "tdCPU"
            table.rows[1].cells[0].innerHTML = a.cpu

            table.rows[1].cells[1].className = "tdRAMCount"
            table.rows[1].cells[1].innerHTML = a.ramc
            table.rows[1].cells[2].className = "tdRAMSpeed"
            table.rows[1].cells[2].innerHTML = a.rams
            table.rows[1].cells[3].className = "tdRAMPart"
            table.rows[1].cells[3].innerHTML = a.ram

            table.rows[1].cells[4].className = "tdGPUCount"
            table.rows[1].cells[4].innerHTML = a.gpuCount
            table.rows[1].cells[5].className = "tdGPUType"
            table.rows[1].cells[5].innerHTML = a.gpuType
            table.rows[1].cells[6].className = "tdGPUPart"
            table.rows[1].cells[6].innerHTML = a.gpu

            table.rows[1].cells[7].className = "tdMotherboard"
            table.rows[1].cells[7].innerHTML = a.mobo

            table.rows[1].cells[8].className = "tdCost"
            table.rows[1].cells[8].innerHTML = a.cost
            table.rows[1].cells[9].className = "tdCost"
            table.rows[1].cells[9].innerHTML = a.budgetleft

            table.rows[1].cells[10].className = "tdScore"
            table.rows[1].cells[10].innerHTML = a.score

            table.rows[1].cells[11].className = "tdOther"
            table.rows[1].cells[11].innerHTML = a.wattage
            table.rows[1].cells[12].className = "tdOther"
            table.rows[1].cells[12].innerHTML = a.comment
        }
    })
}

var fixes

function pushFixIfValid(
    budget, resbudget, level, cpuBroken, gpu1Broken, gpu2Broken, moboBroken,
    originalCpu, newCpu, originalGpu1, newGpu1, originalGpu2, newGpu2, originalMobo, newMobo
) {
    var cost = 0
    var newGpu1Type = ""
    var newGpu2Type = ""
    if (newCpu != "") {
        if (data.procs[newCpu].level > level) {
            return false
        }
        if (cpuBroken && (data.procs[newCpu].partRankingScore < data.procs[originalCpu].partRankingScore)) {
            return false
        }
        cost += data.procs[newCpu].price
    }
    if (newGpu1 != "") {
        if (data.gpus[newGpu1].level > level) {
            return false
        }
        if (gpu1Broken && (data.gpus[newGpu1].partRankingScore < data.gpus[originalGpu1].partRankingScore)) {
            return false
        }
        cost += data.gpus[newGpu1][1].price
        newGpu1Type = data.gpus[newGpu1].gpuType
    }
    if (newGpu2 != "") {
        if (data.gpus[newGpu2].level > level) {
            return false
        }
        if (gpu2Broken && (data.gpus[newGpu2].partRankingScore < data.gpus[originalGpu2].partRankingScore)) {
            return false
        }
        cost += data.gpus[newGpu2][1].price
        newGpu2Type = data.gpus[newGpu2].gpuType
    }
    if (newMobo != "") {
        if (data.motherboards[newMobo].level > level) {
            return false
        }
        if (moboBroken && (data.motherboards[newMobo].price < data.motherboards[originalMobo].price)) {
            return false
        }
        cost += data.motherboards[newMobo].price
    }

    if (cost > (budget - resbudget)) {
        return false
    }

    evalCpu = (newCpu == "" ? originalCpu : newCpu)
    evalGpu1 = (newGpu1 == "" ? originalGpu1 : newGpu1)
    evalGpu2 = (newGpu2 == "" ? originalGpu2 : newGpu2)
    evalMobo = (newMobo == "" ? originalMobo : newMobo)

    if (socketsCompatible(data.motherboards[evalMobo].cpuSocket, data.procs[evalCpu].cpuSocket) == false) {
        return false
    }

    if (evalGpu1 != "" && evalGpu2 != "") {
        if (data.gpus[evalGpu1].multiGPU == "" || data.gpus[evalGpu2].multiGPU == "") {
            return false
        }
        if (data.gpus[evalGpu1].multiGPU != data.gpus[evalGpu2].multiGPU) {
            return false
        }

        if (motherboardSupportsMultiGPUType(data.motherboards[evalMobo].supportSLI, data.motherboards[evalMobo].supportCrossfire, data.gpus[evalGpu1].multiGPU) == false) {
            return false
        }
    }

    var gpuWattage = 0
    if (evalGpu1 != "") {
        gpuWattage += data.gpus[evalGpu1]["1"].wattage
    }
    if (evalGpu2 != "") {
        gpuWattage += data.gpus[evalGpu2]["1"].wattage
    }
    var systemWattage = getWattage(gpuWattage, data.procs[evalCpu].wattage)

    fixes.push(suggestedFix(newCpu, newGpu1Type, newGpu1, newGpu2Type, newGpu2, newMobo, cost, (budget - cost), systemWattage))
}

function generatePartFixes(showAlerts) {
    var form = document.getElementById('partFixerForm')

    var budget = Number(form.budgetPartFixer.value)
    var resbudget = Number(form.reservedBudgetPartFixer.value) || 0
    var level = Number(form.levelPartFixer.value)
    var results = Number(form.resultsLimitPartFixer.value) || 200

    var originalCpu = form.cpuPartFixer.value
    var originalGpu1 = form.gpu1PartFixer.value
    var originalGpu2 = form.gpu2PartFixer.value
    var originalMobo = form.motherboardPartFixer.value

    var cpuBroken = form.cpuBrokenPartFixer.checked
    var gpu1Broken = form.gpu1BrokenPartFixer.checked
    var gpu2Broken = form.gpu2BrokenPartFixer.checked
    var moboBroken = form.motherboardBrokenPartFixer.checked

    if (isNaN(budget) || budget == 0) {
        if (showAlerts) {
            alert("Budget is required.")
        }
        return false
    }
    if (isNaN(level) || level == 0) {
        if (showAlerts) {
            alert("Level is required.")
        }
        return false
    }

    if (!data.procs[originalCpu]) {
        if (showAlerts) {
            alert("CPU not found.")
        }
        return false
    }
    if (originalGpu1 != "" && !data.gpus[originalGpu1]) {
        if (showAlerts) {
            alert("GPU 1 not found.")
        }
        return false
    }
    if (originalGpu2 != "" && !data.gpus[originalGpu2]) {
        if (showAlerts) {
            alert("GPU 2 not found.")
        }
        return false
    }
    if (originalGpu1 == "" && originalGpu2 == "") {
        if (showAlerts) {
            alert("At least 1 GPU is required.")
        }
        return false
    }
    if (originalGpu1 != "" && originalGpu2 != "" && data.gpus[originalGpu1].chipset != data.gpus[originalGpu2].chipset) {
        if (showAlerts) {
            alert("GPU chipsets must be the same.")
        }
        return false
    }
    if (originalGpu1 != "" && originalGpu2 != "" && data.gpus[originalGpu1].multiGPU == null) {
        if (showAlerts) {
            alert("GPU does not support Multi-GPU.")
        }
        return false
    }

    if (socketsCompatible(data.motherboards[originalMobo].cpuSocket, data.procs[originalCpu].cpuSocket) == false) {
        if (showAlerts) {
            alert("Selected CPU and Motherboard are incompatible.")
        }
        return false
    }

    if (originalGpu1 != "" && originalGpu2 != "" && motherboardSupportsMultiGPUType(data.motherboards[originalMobo].supportSLI, data.motherboards[originalMobo].supportCrossfire, data.gpus[originalGpu1].multiGPU) == false) {
        if (showAlerts) {
            alert("Motherboard does not support this Multi-GPU type.")
        }
        return false
    }

    if (!cpuBroken && !gpu1Broken && !gpu2Broken && !moboBroken) {
        if (showAlerts) {
            alert("At least 1 part must be marked as Broken.")
        }
        return false
    }

    fixes = []
    for (replaceCpu = 0; replaceCpu <= 1; replaceCpu++) {

        if (cpuBroken && !replaceCpu) {
            continue
        }
        if (!cpuBroken && replaceCpu) {
            continue
        }

        for (replaceGpu1 = 0; replaceGpu1 <= 1; replaceGpu1++) {

            if (gpu1Broken && !replaceGpu1) {
                continue
            }
            if (!gpu1Broken && replaceGpu1) {
                continue
            }

            for (replaceGpu2 = 0; replaceGpu2 <= 1; replaceGpu2++) {

                if (gpu2Broken && !replaceGpu2) {
                    continue
                }
                if (!gpu2Broken && replaceGpu2) {
                    continue
                }

                for (replaceMobo = 0; replaceMobo <= 1; replaceMobo++) {

                    if (replaceMobo && (!cpuBroken && !moboBroken)) {
                        continue
                    }
                    if (moboBroken && !replaceMobo) {
                        continue
                    }

                    if (replaceCpu) {
                        for (newCpu in data.procs) {
                            if (replaceGpu1) {
                                for (newGpu1 in data.gpus) {
                                    if (replaceGpu2) {
                                        for (newGpu2 in data.gpus) {
                                            if (replaceMobo) {
                                                for (newMobo in data.motherboards) {
                                                    pushFixIfValid(
                                                        budget, resbudget, level, cpuBroken, gpu1Broken, gpu2Broken, moboBroken,
                                                        originalCpu, newCpu, originalGpu1, newGpu1, originalGpu2, newGpu2, originalMobo, newMobo)
                                                }
                                            }
                                            else {
                                                pushFixIfValid(
                                                    budget, resbudget, level, cpuBroken, gpu1Broken, gpu2Broken, moboBroken,
                                                    originalCpu, newCpu, originalGpu1, newGpu1, originalGpu2, newGpu2, originalMobo, "")
                                            }
                                        }
                                    }
                                    else {
                                        if (replaceMobo) {
                                            for (newMobo in data.motherboards) {
                                                pushFixIfValid(
                                                    budget, resbudget, level, cpuBroken, gpu1Broken, gpu2Broken, moboBroken,
                                                    originalCpu, newCpu, originalGpu1, newGpu1, originalGpu2, "", originalMobo, newMobo)
                                            }
                                        }
                                        else {
                                            pushFixIfValid(
                                                budget, resbudget, level, cpuBroken, gpu1Broken, gpu2Broken, moboBroken,
                                                originalCpu, newCpu, originalGpu1, newGpu1, originalGpu2, "", originalMobo, "")
                                        }
                                    }
                                }
                            }
                            else {
                                if (replaceGpu2) {
                                    for (newGpu2 in data.gpus) {
                                        if (replaceMobo) {
                                            for (newMobo in data.motherboards) {
                                                pushFixIfValid(
                                                    budget, resbudget, level, cpuBroken, gpu1Broken, gpu2Broken, moboBroken,
                                                    originalCpu, newCpu, originalGpu1, "", originalGpu2, newGpu2, originalMobo, newMobo)
                                            }
                                        }
                                        else {
                                            pushFixIfValid(
                                                budget, resbudget, level, cpuBroken, gpu1Broken, gpu2Broken, moboBroken,
                                                originalCpu, newCpu, originalGpu1, "", originalGpu2, newGpu2, originalMobo, "")
                                        }
                                    }
                                }
                                else {
                                    if (replaceMobo) {
                                        for (newMobo in data.motherboards) {
                                            pushFixIfValid(
                                                budget, resbudget, level, cpuBroken, gpu1Broken, gpu2Broken, moboBroken,
                                                originalCpu, newCpu, originalGpu1, "", originalGpu2, "", originalMobo, newMobo)
                                        }
                                    }
                                    else {
                                        pushFixIfValid(
                                            budget, resbudget, level, cpuBroken, gpu1Broken, gpu2Broken, moboBroken,
                                            originalCpu, newCpu, originalGpu1, "", originalGpu2, "", originalMobo, "")
                                    }
                                }
                            }
                        }
                    }
                    else {
                        if (replaceGpu1) {
                            for (newGpu1 in data.gpus) {
                                if (replaceGpu2) {
                                    for (newGpu2 in data.gpus) {
                                        if (replaceMobo) {
                                            for (newMobo in data.motherboards) {
                                                pushFixIfValid(
                                                    budget, resbudget, level, cpuBroken, gpu1Broken, gpu2Broken, moboBroken,
                                                    originalCpu, "", originalGpu1, newGpu1, originalGpu2, newGpu2, originalMobo, newMobo)
                                            }
                                        }
                                        else {
                                            pushFixIfValid(
                                                budget, resbudget, level, cpuBroken, gpu1Broken, gpu2Broken, moboBroken,
                                                originalCpu, "", originalGpu1, newGpu1, originalGpu2, newGpu2, originalMobo, "")
                                        }
                                    }
                                }
                                else {
                                    if (replaceMobo) {
                                        for (newMobo in data.motherboards) {
                                            pushFixIfValid(
                                                budget, resbudget, level, cpuBroken, gpu1Broken, gpu2Broken, moboBroken,
                                                originalCpu, "", originalGpu1, newGpu1, originalGpu2, "", originalMobo, newMobo)
                                        }
                                    }
                                    else {
                                        pushFixIfValid(
                                            budget, resbudget, level, cpuBroken, gpu1Broken, gpu2Broken, moboBroken,
                                            originalCpu, "", originalGpu1, newGpu1, originalGpu2, "", originalMobo, "")
                                    }
                                }
                            }
                        }
                        else {
                            if (replaceGpu2) {
                                for (newGpu2 in data.gpus) {
                                    if (replaceMobo) {
                                        for (newMobo in data.motherboards) {
                                            pushFixIfValid(
                                                budget, resbudget, level, cpuBroken, gpu1Broken, gpu2Broken, moboBroken,
                                                originalCpu, "", originalGpu1, "", originalGpu2, newGpu2, originalMobo, newMobo)
                                        }
                                    }
                                    else {
                                        pushFixIfValid(
                                            budget, resbudget, level, cpuBroken, gpu1Broken, gpu2Broken, moboBroken,
                                            originalCpu, "", originalGpu1, "", originalGpu2, newGpu2, originalMobo, "")
                                    }
                                }
                            }
                            else {
                                if (replaceMobo) {
                                    for (newMobo in data.motherboards) {
                                        pushFixIfValid(
                                            budget, resbudget, level, cpuBroken, gpu1Broken, gpu2Broken, moboBroken,
                                            originalCpu, "", originalGpu1, "", originalGpu2, "", originalMobo, newMobo)
                                    }
                                }
                                else {
                                    pushFixIfValid(
                                        budget, resbudget, level, cpuBroken, gpu1Broken, gpu2Broken, moboBroken,
                                        originalCpu, "", originalGpu1, "", originalGpu2, "", originalMobo, "")
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    fixes.sort(sortByCost)
    var resultsSorted = []
    if (fixes.length <= results) {
        resultsSorted = fixes
        results = fixes.length
    } else {
        resultsSorted.push(fixes[0])
        resultsSorted.push(fixes[fixes.length - 1])
        for (i = 0; i < results - 2; i++) {
            resultsSorted.push(fixes[getRandomInt(1, fixes.length - 2)])
        }
    }
    resultsSorted.sort(sortByCost)
    var table = document.getElementById('partFixerResultsTable')
    for (i = table.rows.length - 1; i >= 1; i--) {
        table.deleteRow(i)
    }
    for (i = 1; i < resultsSorted.length + 1; i++) {
        table.insertRow(i)
        for (a = 0; a < 9; a++) {
            table.rows[i].insertCell(a)
        }
    }
    for (i = 1; i < resultsSorted.length + 1; i++) {
        table.rows[i].cells[0].className = "tdCPU"
        table.rows[i].cells[0].innerHTML = resultsSorted[i - 1].processor

        table.rows[i].cells[1].className = "tdGPU1Type"
        table.rows[i].cells[1].innerHTML = resultsSorted[i - 1].gpu1Type
        table.rows[i].cells[2].className = "tdGPU1Part"
        table.rows[i].cells[2].innerHTML = resultsSorted[i - 1].gpu1

        table.rows[i].cells[3].className = "tdGPU2Type"
        table.rows[i].cells[3].innerHTML = resultsSorted[i - 1].gpu2Type
        table.rows[i].cells[4].className = "tdGPU2Part"
        table.rows[i].cells[4].innerHTML = resultsSorted[i - 1].gpu2

        table.rows[i].cells[5].className = "tdMotherboard"
        table.rows[i].cells[5].innerHTML = resultsSorted[i - 1].mobo

        table.rows[i].cells[6].className = "tdCost"
        table.rows[i].cells[6].innerHTML = resultsSorted[i - 1].cost
        table.rows[i].cells[7].className = "tdCost"
        table.rows[i].cells[7].innerHTML = resultsSorted[i - 1].budgetleft

        table.rows[i].cells[8].className = "tdOther"
        table.rows[i].cells[8].innerHTML = resultsSorted[i - 1].wattage
    }

    if (showAlerts && resultsSorted.length == 0) {
        alert("No fixes found.")
    }
}
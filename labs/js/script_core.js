function showPage(id) {
    document.getElementById('div3DMarkScoreCalculator').style.display = ((id == 'div3DMarkScoreCalculator') ? "block" : "none")
    document.getElementById('divBuildMaker').style.display = ((id == 'divBuildMaker') ? "block" : "none")
    document.getElementById('divBuildUpgrader').style.display = ((id == 'divBuildUpgrader') ? "block" : "none")
    document.getElementById('divPartReplacer').style.display = ((id == 'divPartReplacer') ? "block" : "none")
    document.getElementById('divHistoryAndSaves').style.display = ((id == 'divHistoryAndSaves') ? "block" : "none")
};

function blurBackground(id) {
    id.style.filter = "blur(8px)"
}

function unblurBackground(id) {
    id.style.filter = "blur(0px)"
}

function ProcessBuildMakerSave(saveBuild) {
    unblurBackground(document.getElementById('divBuildMakerForm'))
    unblurBackground(document.getElementById('divBuildMakerResults'))
    hideSaver(document.getElementById('divBuildMakerSaveForm'))
    if (saveBuild) {
        savePcBuild(
            document.getElementById('tableBuildMakerResults').rows[temp],
            'build',
            document.getElementById('formBuildMakerSave').inputBuildMakerSaveFormComment.value
        )
    }
}

function getScore(cpuScore, gpuScore) {
    return Math.floor(1 / ((0.85 / gpuScore) + (0.15 / cpuScore)))
}

function getSystemWatts(gpuWatts, cpuWatts) {
    return gpuWatts + cpuWatts + 30
}

function updateRamSpeedOptions(cpu, ramSpeedList) {
    var cpuRamSpeedList = Object.keys(data.procs[cpu]['1'])
    for (i = 0; i < ramSpeedList.options.length; i++) {
        if (cpuRamSpeedList.includes(ramSpeedList.options[i].value) == false) {
            ramSpeedList.options[i].style.display = 'none'
        } else {
            ramSpeedList.options[i].style.display = 'block'
        }
    }
}

function updateRamSpeedOptions3DMark() {
    var form = document.getElementById('form3DMarkScoreCalculator')
    updateRamSpeedOptions(
        form.input3DMarkCpu.value,
        form.select3DMarkRamSpeed
    )
}

function updateRamSpeedOptionsBuildUpgrader() {
    var form = document.getElementById('formBuildUpgrader')
    updateRamSpeedOptions(
        form.inputBuildUpgraderOriginalSystemCpu.value,
        form.selectBuildUpgraderOriginalSystemRamSpeed
    )
}

function updateRamChannelOptions(cpu, ramChannelList) {
    for (i = 0; i < ramChannelList.options.length; i++) {
        if (data.procs[cpu][ramChannelList.options[i].value]) {
            ramChannelList.options[i].style.display = "block"
        } else {
            ramChannelList.options[i].style.display = "none"
        }
    }
}

function updateRamChannelOptions3DMark() {
    var form = document.getElementById('form3DMarkScoreCalculator')
    updateRamChannelOptions(
        form.input3DMarkCpu.value,
        form.select3DMarkRamChannel
    )
}

function updateRamChannelOptionsBuildUpgrader() {
    var form = document.getElementById('formBuildUpgrader')
    updateRamChannelOptions (
        form.inputBuildUpgraderOriginalSystemCpu.value,
        form.selectBuildUpgraderOriginalSystemRamChannel
    )
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

function updateMotherboardOptions(cpu, gpu, gpuCount, motherboardlist, ramSpeed) {
    for (mobo in motherboardlist.options) {
        if (mobo == "length" || mobo == "selectedIndex" || mobo == "add" || mobo == "remove" || mobo == "item" || mobo == "namedItem") {
            continue
        }
        if (socketsCompatible(data.procs[cpu].cpuSocket, data.motherboards[motherboardlist.options[mobo].innerHTML].cpuSocket)) {
            if (gpuCount == "1") {
                motherboardlist.options[mobo].style.display = "block"
            } else {
                if (motherboardSupportsMultiGPUType(data.motherboards[motherboardlist.options[mobo].innerHTML].supportSLI, data.motherboards[motherboardlist.options[mobo].innerHTML].supportCrossfire, data.gpus[gpu].multiGPU)) {
                    if (data.motherboards[motherboardlist.options[mobo].innerHTML].memorySpeedSteps.includes(ramSpeed) || Number(ramSpeed) < data.motherboards[motherboardlist.options[mobo].innerHTML].maxMemorySpeed) {
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

function updateMotherboardOptionsBuildUpgrader() {
    var form = document.getElementById('formBuildUpgrader')
    updateMotherboardOptions(
        form.inputBuildUpgraderOriginalSystemCpu.value,
        form.inputBuildUpgraderOriginalSystemGpu.value,
        form.selectBuildUpgraderOriginalSystemGpuCount.value,
        form.selectBuildUpgraderOriginalSystemMobo,
        form.selectBuildUpgraderOriginalSystemRamSpeed.value
    )
}

function updateMotherboardOptions2(cpu, gpu1, gpu2, motherboardlist) {

    if (data.procs[cpu] == null) {
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
        if (socketsCompatible(data.procs[cpu].cpuSocket, data.motherboards[motherboardlist.options[mobo].innerHTML].cpuSocket)) {
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

function updateMotherboardOptionsPartReplacer() {
    var form = document.getElementById('formPartReplacer')
    updateMotherboardOptions2(
        form.inputPartReplacerOriginalSystemCpu.value,
        form.inputPartReplacerOriginalSystemGpu1.value,
        form.inputPartReplacerOriginalSystemGpu2.value,
        form.inputPartReplacerOriginalSystemMobo
    )
}

var calculatorSystemScore
var calculatorGpuType
var calculatorSystemWatts
var calculatorCpuPriceNew
var calculatorCpuPriceUsed
var calculatorGpusPriceNew
var calculatorGpusPriceUsed

function CalculatorCalculate() {
    var showAlerts = true

    var form = document.getElementById('form3DMarkScoreCalculator')

    var cpu = form.input3DMarkCpu.value
    var rams = form.select3DMarkRamSpeed.value
    var ramc = form.select3DMarkRamChannel.value
    var gpu = form.input3DMarkGpu.value
    var gpuCount = form.select3DMarkGpuCount.value

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

    calculatorSystemScore = getScore(data.procs[cpu][ramc][rams], data.gpus[gpu][gpuCount].graphicsScore)
    calculatorGpuType = data.gpus[gpu].gpuType
    calculatorSystemWatts = getSystemWatts(data.gpus[gpu][gpuCount].wattage, data.procs[cpu].wattage)
    calculatorCpuPriceNew = data.procs[cpu].price
    calculatorCpuPriceUsed = data.procs[cpu].sellPrice
    calculatorGpusPriceNew = data.gpus[gpu][gpuCount].price
    calculatorGpusPriceUsed = data.gpus[gpu][gpuCount].sellPrice

    document.getElementById('td3DMarkCpuScore').innerText = data.procs[cpu][ramc][rams]
    document.getElementById('td3DMarkGpuScore').innerText = data.gpus[gpu][gpuCount].graphicsScore
    document.getElementById('td3DMarkSystemScore').innerText = calculatorSystemScore
    document.getElementById('td3DMarkGpuType').innerText = calculatorGpuType
    document.getElementById('td3DMarkSystemWatts').innerText = calculatorSystemWatts
    document.getElementById('td3DMarkCpuPriceNew').innerText = calculatorCpuPriceNew
    document.getElementById('td3DMarkCpuPriceUsed').innerText = calculatorCpuPriceUsed
    document.getElementById('td3DMarkGpusPriceNew').innerText = calculatorGpusPriceNew
    document.getElementById('td3DMarkGpusPriceUsed').innerText = calculatorGpusPriceUsed

    return true
}

function CalculatorSaveBuild() {
    var form = document.getElementById('form3DMarkScoreCalculator')
    saveBuild(
        form.input3DMarkCpu.value,
        form.select3DMarkRamChannel.value,
        form.select3DMarkRamSpeed.value,
        '-',
        form.select3DMarkGpuCount.value,
        calculatorGpuType,
        form.input3DMarkGpu.value,
        '-',
        calculatorCpuPriceNew + calculatorGpusPriceNew,
        '-',
        calculatorSystemScore,
        calculatorSystemWatts,
        'div3DMarkScoreCalculatorForm',
        '-'
    )
}

function partsForBuild(cpu, ramChannel, ramSpeed, ram, gpuCount, gpuType, gpu, mobo, cost, budgetLeft, score, systemWatts) {
    var build = {
        "cpu": cpu,
        "ramChannel": ramChannel,
        "ramSpeed": ramSpeed,
        "ram": ram,
        "gpuCount": gpuCount,
        "gpuType": gpuType,
        "gpu": gpu,
        "mobo": mobo,
        "cost": cost,
        "budgetLeft": budgetLeft,
        "score": score,
        "systemWatts": systemWatts,
        "selected": false
    }
    return build
}

function partsForReplacer(cpu, gpu1Type, gpu1, gpu2Type, gpu2, mobo, cost, budgetLeft, systemWatts) {
    var parts = {
        "cpu": cpu,
        "gpu1Type": gpu1Type,
        "gpu1": gpu1,
        "gpu2Type": gpu2Type,
        "gpu2": gpu2,
        "mobo": mobo,
        "cost": cost,
        "budgetLeft": budgetLeft,
        "systemWatts": systemWatts,
        "selected": false
    }
    return parts
}

var temp

function addSaveButton(target, id) {
    var button = document.createElement('BUTTON')
    button.id = id
    button.className = "buttonSave"
    button.onclick = function () {
        blurBackground(document.getElementById('divBuildMakerForm'))
        blurBackground(document.getElementById('divBuildMakerResults'))
        showSaver(document.getElementById('divBuildMakerSaveForm'))
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

function numberOrDefault(inputString, defaultValue) {
    var result = null
    if ((inputString != "") && (!isNaN(Number(inputString)))) {
        result = Number(inputString)
    }
    else {
        result = defaultValue
    }
    return result
}

function BuildMakerGetBuilds() {
    var showAlerts = true

    var form = document.getElementById('formBuildMaker')

    var budgetTotal = Number(form.inputBuildMakerBudget.value)
    var budgetReserved = numberOrDefault(form.inputBuildMakerReservedBudget.value, 400)
    var budgetForParts = budgetTotal - budgetReserved

    var target3DMarkScore = Number(form.inputBuildMakerTarget3DMarkScore.value)
    var target3DMarkScoreOffset = numberOrDefault(form.inputBuildMakerTarget3DMarkScoreOffset.value, 400)
    var target3DMarkScoreMaximum = target3DMarkScore + target3DMarkScoreOffset

    var level = Number(form.inputBuildMakerLevel.value)
    var resultsRequested = numberOrDefault(form.inputBuildMakerResultsRequested.value, 200)

    var selectedCpuSocket = form.selectBuildMakerCpuSocket.value
    var selectedGpuCount = form.selectBuildMakerGpuCount.value
    var selectedGpuType = form.selectBuildMakerGpuType.value
    var includeMotherboard = form.inputBuildMakerIncludeMotherboard.checked
    var includeRamPart = form.inputBuildMakerIncludeRamPart.checked
    var needCpuOverclock = form.inputBuildMakerNeedCpuOverclock.checked

    if (isNaN(budgetTotal) || budgetTotal == 0) {
        if (showAlerts) {
            alert("Budget is required.")
        }
        return false
    }
    if (isNaN(target3DMarkScore) || target3DMarkScore == 0) {
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
    var buildScore
    var buildCost
    var selectedMotherboardName
    var selectedRamName
    for (cpu in data.procs) {
        if (data.procs[cpu].level <= level) {
            if (needCpuOverclock == true && data.procs[cpu].canOverclock == "No") {
                continue
            }
            if (selectedCpuSocket != "Any" && selectedCpuSocket != data.procs[cpu].cpuSocket) {
                continue
            }
            for (ramChannel in data.procs[cpu]) {
                if (ramChannel != "1" && ramChannel != "2" && ramChannel != "3" && ramChannel != "4") {
                    continue
                }
                for (ramSpeed in data.procs[cpu][ramChannel]) {
                    for (gpu in data.gpus) {
                        if (data.gpus[gpu].level > level) {
                            continue
                        }
                        if (selectedGpuType != "Any" && selectedGpuType != data.gpus[gpu].gpuType) {
                            continue
                        }
                        for (gpuCount in data.gpus[gpu]) {
                            if (gpuCount != "1" && gpuCount != "2") {
                                continue
                            }
                            if (selectedGpuCount != "Any" && selectedGpuCount != gpuCount) {
                                continue
                            }

                            buildScore = getScore(data.procs[cpu][ramChannel][ramSpeed], data.gpus[gpu][gpuCount].graphicsScore)
                            if (buildScore < target3DMarkScore) {
                                continue
                            }
                            if (buildScore > target3DMarkScoreMaximum) {
                                continue
                            }

                            buildCost = null
                            selectedMotherboardName = null
                            selectedRamName = null

                            if (includeMotherboard == false && includeRamPart == false) {
                                buildCost = data.procs[cpu].price + data.gpus[gpu][gpuCount].price
                                if (buildCost <= budgetForParts) {
                                    builds.push(partsForBuild(cpu, ramChannel, ramSpeed, (selectedRamName || "-"), gpuCount, data.gpus[gpu].gpuType, gpu, (selectedMotherboardName || "-"), buildCost, (budgetTotal - buildCost), buildScore, (data.procs[cpu].wattage + data.gpus[gpu][gpuCount].wattage)))
                                }
                            } else if (includeMotherboard == true && includeRamPart == false) {
                                for (mobo in data.motherboards) {
                                    if (data.motherboards[mobo].level > level) {
                                        continue
                                    } else if (gpuCount == "2" && motherboardSupportsMultiGPUType(data.motherboards[mobo].supportSLI, data.motherboards[mobo].supportCrossfire, data.gpus[gpu].multiGPU) == false) {
                                        continue
                                    } else if (socketsCompatible(data.motherboards[mobo].cpuSocket, data.procs[cpu].cpuSocket) == false) {
                                        continue
                                    } else if (needCpuOverclock == true && data.motherboards[mobo].canOverclock != "Yes") {
                                        continue
                                    } else if (data.motherboards[mobo].memorySpeedSteps.includes(ramSpeed.toString()) == false) {
                                        continue
                                    }
                                    buildCost = data.procs[cpu].price + data.gpus[gpu][gpuCount].price + data.motherboards[mobo].price
                                    if (buildCost <= budgetForParts) {
                                        selectedMotherboardName = data.motherboards[mobo].fullName
                                        builds.push(partsForBuild(cpu, ramChannel, ramSpeed, (selectedRamName || "-"), gpuCount, data.gpus[gpu].gpuType, gpu, (selectedMotherboardName || "-"), buildCost, (budgetTotal - buildCost), buildScore, (data.procs[cpu].wattage + data.gpus[gpu][gpuCount].wattage)))
                                    }
                                }
                            } else if (includeMotherboard == false && includeRamPart == true) {
                                for (rams in data.ram) {
                                    if (data.ram[rams].level > level) {
                                        continue
                                    } else if (data.ram[rams].frequency < Number(ramSpeed)) {
                                        continue
                                    }
                                    buildCost = data.procs[cpu].price + data.gpus[gpu][gpuCount].price + (data.ram[rams].price * ramChannel)
                                    if (buildCost <= budgetForParts) {
                                        selectedRamName = data.ram[rams].fullName
                                        builds.push(partsForBuild(cpu, ramChannel, ramSpeed, (selectedRamName || "-"), gpuCount, data.gpus[gpu].gpuType, gpu, (selectedMotherboardName || "-"), buildCost, (budgetTotal - buildCost), buildScore, (data.procs[cpu].wattage + data.gpus[gpu][gpuCount].wattage)))
                                    }
                                }
                            } else if (includeMotherboard == true && includeRamPart == true) {
                                for (mobo in data.motherboards) {
                                    if (data.motherboards[mobo].level > level) {
                                        continue
                                    } else if (gpuCount == "2" && motherboardSupportsMultiGPUType(data.motherboards[mobo].supportSLI, data.motherboards[mobo].supportCrossfire, data.gpus[gpu].multiGPU) == false) {
                                        continue
                                    } else if (socketsCompatible(data.motherboards[mobo].cpuSocket, data.procs[cpu].cpuSocket) == false) {
                                        continue
                                    } else if (needCpuOverclock == true && data.motherboards[mobo].canOverclock != "Yes") {
                                        continue
                                    } else if (data.motherboards[mobo].memorySpeedSteps.includes(ramSpeed.toString()) == false) {
                                        continue
                                    }
                                    buildCost = data.procs[cpu].price + data.gpus[gpu][gpuCount].price + data.motherboards[mobo].price
                                    if (buildCost <= budgetForParts) {
                                        for (rams in data.ram) {
                                            if (data.ram[rams].level > level) {
                                                continue
                                            } else if (data.ram[rams].frequency < Number(ramSpeed)) {
                                                continue
                                            }
                                            buildCost = data.procs[cpu].price + data.gpus[gpu][gpuCount].price + data.motherboards[mobo].price + (data.ram[rams].price * ramChannel)
                                            if (buildCost <= budgetForParts) {
                                                selectedMotherboardName = data.motherboards[mobo].fullName
                                                selectedRamName = data.ram[rams].fullName
                                                builds.push(partsForBuild(cpu, ramChannel, ramSpeed, (selectedRamName || "-"), gpuCount, data.gpus[gpu].gpuType, gpu, (selectedMotherboardName || "-"), buildCost, (budgetTotal - buildCost), buildScore, (data.procs[cpu].wattage + data.gpus[gpu][gpuCount].wattage)))
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    var results = getResultsLimitedAndSorted(builds, resultsRequested)
    var table = document.getElementById('tableBuildMakerResults')
    resetResultsTable(table, results.length, 13)

    for (i = 1; i < results.length + 1; i++) {
        table.rows[i].cells[0].className = "tdCpu"
        table.rows[i].cells[0].innerHTML = results[i - 1].cpu

        table.rows[i].cells[1].className = "tdRamCount"
        table.rows[i].cells[1].innerHTML = results[i - 1].ramChannel
        table.rows[i].cells[2].className = "tdRamSpeed"
        table.rows[i].cells[2].innerHTML = results[i - 1].ramSpeed
        table.rows[i].cells[3].className = "tdRamPart"
        table.rows[i].cells[3].innerHTML = results[i - 1].ram

        table.rows[i].cells[4].className = "tdGpuCount"
        table.rows[i].cells[4].innerHTML = results[i - 1].gpuCount
        table.rows[i].cells[5].className = "tdGpuType"
        table.rows[i].cells[5].innerHTML = results[i - 1].gpuType
        table.rows[i].cells[6].className = "tdGpuPart"
        table.rows[i].cells[6].innerHTML = results[i - 1].gpu

        table.rows[i].cells[7].className = "tdMobo"
        table.rows[i].cells[7].innerHTML = results[i - 1].mobo

        table.rows[i].cells[8].className = "tdCost"
        table.rows[i].cells[8].innerHTML = results[i - 1].cost
        table.rows[i].cells[9].className = "tdCost"
        table.rows[i].cells[9].innerHTML = results[i - 1].budgetLeft

        table.rows[i].cells[10].className = "tdScore"
        table.rows[i].cells[10].innerHTML = results[i - 1].score

        table.rows[i].cells[11].className = "tdOther"
        table.rows[i].cells[11].innerHTML = results[i - 1].systemWatts

        table.rows[i].cells[12].className = "tdOther"
        table.rows[i].cells[12] = addSaveButton(table.rows[i].cells[12], i)
    }

    if (showAlerts && results.length == 0) {
        alert("No builds found.")
    }
}

function resetResultsTable(table, dataRowsNeeded, cellsNeeded) {

    // Delete all rows except the header
    for (i = table.rows.length - 1; i >= 1; i--) {
        table.deleteRow(i)
    }

    // Create data rows
    for (i = 1; i < dataRowsNeeded + 1; i++) {
        table.insertRow(i)

        // Create cells
        for (a = 0; a < cellsNeeded; a++) {
            table.rows[i].insertCell(a)
        }
    }
}

function getResultsLimitedAndSorted(builds, resultsRequested) {
    builds.sort(sortByCost)
    var results = []
    if (builds.length <= resultsRequested) {
        // Don't need to limit
        results = builds
    } else {
        // Select cheapest
        results.push(builds[0])
        builds[0].selected = true

        // Select most expensive
        results.push(builds[builds.length - 1])
        builds[builds.length - 1].selected = true

        // Get a random one
        var randomIndex
        var resultFound
        for (resultNumber = 3; resultNumber <= resultsRequested; resultNumber++) {

            // Get random index
            randomIndex = getRandomInt(1, builds.length - 2)

            resultFound = false

            // Try to find a build at that index or higher
            if (resultFound == false) {
                for (i = randomIndex; i < builds.length - 1; i++) {
                    if (builds[i].selected == false) {
                        resultFound = true

                        results.push(builds[i])
                        builds[i].selected = true

                        break
                    }
                }
            }

            // Try to find a build at that index or lower
            if (resultFound == false) {
                for (i = randomIndex - 1; i > 0; i--) {
                    if (builds[i].selected == false) {
                        resultFound = true

                        results.push(builds[i])
                        builds[i].selected = true

                        break
                    }
                }
            }
        }

        // Sort results
        results.sort(sortByCost)
    }

    // Return sorted results
    return results
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

function BuildUpgraderGetUpgrades() {
    var showAlerts = true

    var form = document.getElementById('formBuildUpgrader')

    var budgetTotal = Number(form.inputBuildUpgraderBudget.value)
    var budgetReserved = numberOrDefault(form.inputBuildUpgraderReservedBudget.value, 0)
    var budgetForParts = budgetTotal - budgetReserved

    var target3DMarkScore = Number(form.inputBuildUpgraderTarget3DMarkScore.value)
    var target3DMarkScoreOffset = numberOrDefault(form.inputBuildUpgraderTarget3DMarkScoreOffset.value, 400)
    var target3DMarkScoreMaximum = target3DMarkScore + target3DMarkScoreOffset

    var level = Number(form.inputBuildUpgraderLevel.value)
    var resultsRequested = numberOrDefault(form.inputBuildUpgraderResultsRequested.value, 200)

    var originalSystemCpu = form.inputBuildUpgraderOriginalSystemCpu.value
    var originalSystemRamSpeed = form.selectBuildUpgraderOriginalSystemRamSpeed.value
    var originalSystemRamChannel = form.selectBuildUpgraderOriginalSystemRamChannel.value
    var originalSystemGpu = form.inputBuildUpgraderOriginalSystemGpu.value
    var originalSystemGpuCount = form.selectBuildUpgraderOriginalSystemGpuCount.value
    var originalSystemMobo = form.selectBuildUpgraderOriginalSystemMobo.value

    var selectedGpuCount = form.selectBuildUpgraderOptionsGpuCount.value
    var selectedGpuType = form.selectBuildUpgraderOptionsGpuType.value

    if (isNaN(budgetTotal) || budgetTotal == 0) {
        if (showAlerts) {
            alert("Budget is required.")
        }
        return false
    }
    if (isNaN(target3DMarkScore) || target3DMarkScore == 0) {
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

    if (!data.procs[originalSystemCpu]) {
        if (showAlerts) {
            alert("CPU not found.")
        }
        return false
    }
    if (!data.procs[originalSystemCpu][originalSystemRamChannel]) {
        if (showAlerts) {
            alert("RAM Channel not found for CPU.")
        }
        return false
    }
    //if (!data.procs[originalSystemCpu][originalSystemRamChannel][originalSystemRamSpeed]) {
    //    if (showAlerts) {
    //        alert("RAM Speed not found for CPU.")
    //    }
    //    return false
    //}
    if (!data.gpus[originalSystemGpu]) {
        if (showAlerts) {
            alert("GPU not found.")
        }
        return false
    }
    if (!data.gpus[originalSystemGpu][originalSystemGpuCount]) {
        if (showAlerts) {
            alert("Selected GPU does not support multi-GPU.")
        }
        return false
    }
    if (socketsCompatible(data.motherboards[originalSystemMobo].cpuSocket, data.procs[originalSystemCpu].cpuSocket) == false) {
        if (showAlerts) {
            alert("Selected CPU and Motherboard are incompatible.")
        }
        return false
    }

    var originalSystemRamSpeedForCalc = Math.min(originalSystemRamSpeed, data.motherboards[originalSystemMobo].maxMemorySpeed)
    var originalSystemScore = getScore(data.procs[originalSystemCpu][originalSystemRamChannel][originalSystemRamSpeedForCalc], data.gpus[originalSystemGpu][originalSystemGpuCount].graphicsScore)
    if (originalSystemScore > target3DMarkScore) {
        if (showAlerts) {
            alert("No upgrade is needed")
        }
        return false
    }

    var builds = []
    var buildScore
    var buildCost
    var selectedRamSpeedForCalc

    /* CPU-only upgrade */
    for (cpu in data.procs) {
        if (socketsCompatible(data.procs[cpu].cpuSocket, data.motherboards[originalSystemMobo].cpuSocket) == false) {
            continue
        } else if (data.procs[cpu].level > level) {
            continue
        }

        // Get Ram Speed that will be used for this selection
        selectedRamSpeedForCalc = originalSystemRamSpeedForCalc

        if (!data.procs[cpu][originalSystemRamChannel]) {
            continue
        }
        if (!data.procs[cpu][originalSystemRamChannel][selectedRamSpeedForCalc]) {
            continue
        }

        buildCost = data.procs[cpu].price
        if (buildCost > budgetForParts) {
            continue
        }

        buildScore = getScore(data.procs[cpu][originalSystemRamChannel][selectedRamSpeedForCalc], data.gpus[originalSystemGpu][originalSystemGpuCount].graphicsScore)
        if ((buildScore >= target3DMarkScore) && (buildScore < target3DMarkScoreMaximum)) {
            builds.push(partsForBuild(cpu, "-", "-", "-", "-", "-", "-", "-", buildCost, budgetTotal - buildCost, buildScore, (data.procs[cpu].wattage + data.gpus[originalSystemGpu][originalSystemGpuCount].wattage)))
        }
    }

    /* GPU-only upgrade */
    for (gpu in data.gpus) {
        if (data.gpus[gpu].level > level) {
            continue
        }
        if (selectedGpuType != "Any" && selectedGpuType != data.gpus[gpu].gpuType) {
            continue
        }
        for (gpuCount in data.gpus[gpu]) {
            if (gpuCount != "1" && gpuCount != "2") {
                continue
            }
            if (selectedGpuCount != "Any" && selectedGpuCount != gpuCount) {
                continue
            }
            if (gpuCount == "2" && motherboardSupportsMultiGPUType(data.motherboards[originalSystemMobo].supportSLI, data.motherboards[originalSystemMobo].supportCrossfire, data.gpus[gpu].multiGPU) == false) {
                continue
            }

            // Get Ram Speed that will be used for this selection
            selectedRamSpeedForCalc = originalSystemRamSpeedForCalc

            buildCost = data.gpus[gpu][gpuCount].price
            if (buildCost <= budgetForParts) {
                buildScore = getScore(data.procs[originalSystemCpu][originalSystemRamChannel][selectedRamSpeedForCalc], data.gpus[gpu][gpuCount].graphicsScore)
                if ((buildScore >= target3DMarkScore) && (buildScore < target3DMarkScoreMaximum)) {
                    builds.push(partsForBuild("-", "-", "-", "-", gpuCount, data.gpus[gpu].gpuType, gpu, "-", buildCost, budgetTotal - buildCost, buildScore, (data.procs[originalSystemCpu].wattage + data.gpus[gpu][gpuCount].wattage)))
                }
            }
            if (originalSystemGpuCount == 1 && gpuCount == "2" && data.gpus[originalSystemGpu].fullName == data.gpus[gpu].fullName) {
                buildCost = data.gpus[gpu][1].price
                if (buildCost <= budgetForParts) {
                    buildScore = getScore(data.procs[originalSystemCpu][originalSystemRamChannel][selectedRamSpeedForCalc], data.gpus[gpu][gpuCount].graphicsScore)
                    if ((buildScore >= target3DMarkScore) && (buildScore < target3DMarkScoreMaximum)) {
                        builds.push(partsForBuild("-", "-", "-", "-", "1 + 1", data.gpus[gpu].gpuType, gpu, "-", buildCost, budgetTotal - buildCost, buildScore, (data.procs[originalSystemCpu].wattage + data.gpus[gpu][gpuCount].wattage)))
                    }
                }
            }
        }
    }

    /* CPU and GPU upgrade */
    for (cpu in data.procs) {
        if (socketsCompatible(data.motherboards[originalSystemMobo].cpuSocket, data.procs[cpu].cpuSocket) == false) {
            continue
        } else if (data.procs[cpu].level > level) {
            continue
        }

        // Get Ram Speed that will be used for this selection
        selectedRamSpeedForCalc = originalSystemRamSpeedForCalc

        if (!data.procs[cpu][originalSystemRamChannel]) {
            continue
        }
        if (!data.procs[cpu][originalSystemRamChannel][selectedRamSpeedForCalc]) {
            continue
        }

        for (gpu in data.gpus) {
            if (data.gpus[gpu].level > level) {
                continue
            }
            if (selectedGpuType != "Any" && selectedGpuType != data.gpus[gpu].gpuType) {
                continue
            }
            for (gpuCount in data.gpus[gpu]) {
                if (gpuCount != "1" && gpuCount != "2") {
                    continue
                }
                if (selectedGpuCount != "Any" && selectedGpuCount != gpuCount) {
                    continue
                }
                if (gpuCount == "2" && motherboardSupportsMultiGPUType(data.motherboards[originalSystemMobo].supportSLI, data.motherboards[originalSystemMobo].supportCrossfire, data.gpus[gpu].multiGPU) == false) {
                    continue
                }

                buildCost = data.gpus[gpu][gpuCount].price + data.procs[cpu].price
                if (buildCost <= budgetForParts) {
                    buildScore = getScore(data.procs[cpu][originalSystemRamChannel][selectedRamSpeedForCalc], data.gpus[gpu][gpuCount].graphicsScore)
                    if ((buildScore >= target3DMarkScore) && (buildScore < target3DMarkScoreMaximum)) {
                        builds.push(partsForBuild(cpu, "-", "-", "-", gpuCount, data.gpus[gpu].gpuType, gpu, "-", buildCost, budgetTotal - buildCost, buildScore, (data.procs[cpu].wattage + data.gpus[gpu][gpuCount].wattage)))
                    }
                }
                if (originalSystemGpuCount == 1 && gpuCount == "2" && data.gpus[originalSystemGpu].fullName == data.gpus[gpu].fullName) {
                    buildCost = data.gpus[gpu][1].price + data.procs[cpu].price
                    if (buildCost <= budgetForParts) {
                        buildScore = getScore(data.procs[cpu][originalSystemRamChannel][selectedRamSpeedForCalc], data.gpus[gpu][gpuCount].graphicsScore)
                        if ((buildScore >= target3DMarkScore) && (buildScore < target3DMarkScoreMaximum)) {
                            builds.push(partsForBuild(cpu, "-", "-", "-", "1 + 1", data.gpus[gpu].gpuType, gpu, "-", buildCost, budgetTotal - buildCost, buildScore, (data.procs[cpu].wattage + data.gpus[gpu][gpuCount].wattage)))
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

        //if (data.motherboards[mobo].fullName == data.motherboards[originalSystemMobo].fullName) {
        //    continue
        //}

        // Get Ram Speed that will be used for this selection
        selectedRamSpeedForCalc = Math.min(originalSystemRamSpeed, data.motherboards[mobo].maxMemorySpeed)

        for (cpu in data.procs) {
            if (socketsCompatible(data.motherboards[mobo].cpuSocket, data.procs[cpu].cpuSocket) == false) {
                continue
            } else if (data.procs[cpu].level > level) {
                continue
            }

            if (!data.procs[cpu][originalSystemRamChannel]) {
                continue
            }
            if (!data.procs[cpu][originalSystemRamChannel][selectedRamSpeedForCalc]) {
                continue
            }

            /* if old motherboard would have worked, skip */
            //if (socketsCompatible(data.motherboards[originalSystemMobo].cpuSocket, data.procs[cpu].cpuSocket) == true) {
            //    continue
            //}

            buildCost = data.motherboards[mobo].price + data.procs[cpu].price
            if (buildCost > budgetForParts) {
                continue
            }
            buildScore = getScore(data.procs[cpu][originalSystemRamChannel][selectedRamSpeedForCalc], data.gpus[originalSystemGpu][originalSystemGpuCount].graphicsScore)
            if ((buildScore >= target3DMarkScore) && (buildScore < target3DMarkScoreMaximum)) {
                builds.push(partsForBuild(cpu, "-", "-", "-", "-", "-", "-", mobo, buildCost, budgetTotal - buildCost, buildScore, (data.procs[cpu].wattage + data.gpus[originalSystemGpu][originalSystemGpuCount].wattage)))
            }
        }
    }

    /* motherboard change - GPU-only upgrade */
    for (mobo in data.motherboards) {
        if (data.motherboards[mobo].level > level) {
            continue
        }

        if (socketsCompatible(data.motherboards[mobo].cpuSocket, data.procs[originalSystemCpu].cpuSocket) == false) {
            continue
        }

        //if (data.motherboards[mobo].fullName == data.motherboards[originalSystemMobo].fullName) {
        //    continue
        //}

        // Get Ram Speed that will be used for this selection
        selectedRamSpeedForCalc = Math.min(originalSystemRamSpeed, data.motherboards[mobo].maxMemorySpeed)

        for (gpu in data.gpus) {
            if (data.gpus[gpu].level > level) {
                continue
            }
            if (selectedGpuType != "Any" && selectedGpuType != data.gpus[gpu].gpuType) {
                continue
            }
            for (gpuCount in data.gpus[gpu]) {
                if (gpuCount != "1" && gpuCount != "2") {
                    continue
                }
                if (selectedGpuCount != "Any" && selectedGpuCount != gpuCount) {
                    continue
                }
                if (gpuCount == "2" && motherboardSupportsMultiGPUType(data.motherboards[mobo].supportSLI, data.motherboards[mobo].supportCrossfire, data.gpus[gpu].multiGPU) == false) {
                    continue
                }

                /* if old motherboard would have worked, skip */
                //if (motherboardSupportsMultiGPUType(data.motherboards[originalSystemMobo].supportSLI, data.motherboards[originalSystemMobo].supportCrossfire, data.gpus[gpu].multiGPU) == true) {
                //    continue
                //}

                buildCost = data.gpus[gpu][gpuCount].price + data.motherboards[mobo].price
                if (buildCost <= budgetForParts) {
                    buildScore = getScore(data.procs[originalSystemCpu][originalSystemRamChannel][selectedRamSpeedForCalc], data.gpus[gpu][gpuCount].graphicsScore)
                    if ((buildScore >= target3DMarkScore) && (buildScore < target3DMarkScoreMaximum)) {
                        builds.push(partsForBuild("-", "-", "-", "-", gpuCount, data.gpus[gpu].gpuType, gpu, mobo, buildCost, budgetTotal - buildCost, buildScore, (data.procs[originalSystemCpu].wattage + data.gpus[gpu][gpuCount].wattage)))
                    }
                }
                if (originalSystemGpuCount == 1 && gpuCount == "2" && data.gpus[originalSystemGpu].fullName == data.gpus[gpu].fullName) {
                    buildCost = data.gpus[gpu][1].price + data.motherboards[mobo].price
                    if (buildCost <= budgetForParts) {
                        buildScore = getScore(data.procs[originalSystemCpu][originalSystemRamChannel][selectedRamSpeedForCalc], data.gpus[gpu][gpuCount].graphicsScore)
                        if ((buildScore >= target3DMarkScore) && (buildScore < target3DMarkScoreMaximum)) {
                            builds.push(partsForBuild("-", "-", "-", "-", "1 + 1", data.gpus[gpu].gpuType, gpu, mobo, buildCost, budgetTotal - buildCost, buildScore, (data.procs[originalSystemCpu].wattage + data.gpus[gpu][gpuCount].wattage)))
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

        //if (data.motherboards[mobo].fullName == data.motherboards[originalSystemMobo].fullName) {
        //    continue
        //}

        // Get Ram Speed that will be used for this selection
        selectedRamSpeedForCalc = Math.min(originalSystemRamSpeed, data.motherboards[mobo].maxMemorySpeed)

        for (cpu in data.procs) {
            if (socketsCompatible(data.motherboards[mobo].cpuSocket, data.procs[cpu].cpuSocket) == false) {
                continue
            } else if (data.procs[cpu].level > level) {
                continue
            }

            if (!data.procs[cpu][originalSystemRamChannel]) {
                continue
            }
            if (!data.procs[cpu][originalSystemRamChannel][selectedRamSpeedForCalc]) {
                continue
            }

            for (gpu in data.gpus) {
                if (data.gpus[gpu].level > level) {
                    continue
                }
                if (selectedGpuType != "Any" && selectedGpuType != data.gpus[gpu].gpuType) {
                    continue
                }
                for (gpuCount in data.gpus[gpu]) {
                    if (gpuCount != "1" && gpuCount != "2") {
                        continue
                    }
                    if (selectedGpuCount != "Any" && selectedGpuCount != gpuCount) {
                        continue
                    }
                    if (gpuCount == "2" && motherboardSupportsMultiGPUType(data.motherboards[mobo].supportSLI, data.motherboards[mobo].supportCrossfire, data.gpus[gpu].multiGPU) == false) {
                        continue
                    }

                    /* if old motherboard would have worked, skip */
                    //if (socketsCompatible(data.motherboards[originalSystemMobo].cpuSocket, data.procs[cpu].cpuSocket) == true &&
                    //    motherboardSupportsMultiGPUType(data.motherboards[originalSystemMobo].supportSLI, data.motherboards[originalSystemMobo].supportCrossfire, data.gpus[gpu].multiGPU) == true) {
                    //    continue
                    //}

                    buildCost = data.gpus[gpu][gpuCount].price + data.motherboards[mobo].price + data.procs[cpu].price
                    if (buildCost <= budgetForParts) {
                        buildScore = getScore(data.procs[cpu][originalSystemRamChannel][selectedRamSpeedForCalc], data.gpus[gpu][gpuCount].graphicsScore)
                        if ((buildScore >= target3DMarkScore) && (buildScore < target3DMarkScoreMaximum)) {
                            builds.push(partsForBuild(cpu, "-", "-", "-", gpuCount, data.gpus[gpu].gpuType, gpu, mobo, buildCost, budgetTotal - buildCost, buildScore, (data.procs[cpu].wattage + data.gpus[gpu][gpuCount].wattage)))
                        }
                    }
                    if (originalSystemGpuCount == 1 && gpuCount == "2" && data.gpus[originalSystemGpu].fullName == data.gpus[gpu].fullName) {
                        buildCost = data.gpus[gpu][1].price + data.motherboards[mobo].price + data.procs[cpu].price
                        if (buildCost <= budgetForParts) {
                            buildScore = getScore(data.procs[cpu][originalSystemRamChannel][selectedRamSpeedForCalc], data.gpus[gpu][gpuCount].graphicsScore)
                            if ((buildScore >= target3DMarkScore) && (buildScore < target3DMarkScoreMaximum)) {
                                builds.push(partsForBuild(cpu, "-", "-", "-", "1 + 1", data.gpus[gpu].gpuType, gpu, mobo, buildCost, budgetTotal - buildCost, buildScore, (data.procs[cpu].wattage + data.gpus[gpu][gpuCount].wattage)))
                            }
                        }
                    }
                }
            }
        }
    }

    var results = getResultsLimitedAndSorted(builds, resultsRequested)
    var table = document.getElementById('tableBuildUpgraderResults')
    resetResultsTable(table, results.length, 9)

    for (i = 1; i < results.length + 1; i++) {
        table.rows[i].cells[0].className = "tdCpu"
        table.rows[i].cells[0].innerHTML = results[i - 1].cpu

        //table.rows[i].cells[?].className = "tdRamCount"
        //table.rows[i].cells[?].innerHTML = results[i - 1].ramChannel
        //table.rows[i].cells[?].className = "tdRamSpeed"
        //table.rows[i].cells[?].innerHTML = results[i - 1].ramSpeed
        //table.rows[i].cells[?].className = "tdRamPart"
        //table.rows[i].cells[?].innerHTML = results[i - 1].ram

        table.rows[i].cells[1].className = "tdGpuCount"
        table.rows[i].cells[1].innerHTML = results[i - 1].gpuCount
        table.rows[i].cells[2].className = "tdGpuType"
        table.rows[i].cells[2].innerHTML = results[i - 1].gpuType
        table.rows[i].cells[3].className = "tdGpuPart"
        table.rows[i].cells[3].innerHTML = results[i - 1].gpu

        table.rows[i].cells[4].className = "tdMobo"
        table.rows[i].cells[4].innerHTML = results[i - 1].mobo

        table.rows[i].cells[5].className = "tdCost"
        table.rows[i].cells[5].innerHTML = results[i - 1].cost
        table.rows[i].cells[6].className = "tdCost"
        table.rows[i].cells[6].innerHTML = results[i - 1].budgetLeft

        table.rows[i].cells[7].className = "tdScore"
        table.rows[i].cells[7].innerHTML = results[i - 1].score

        table.rows[i].cells[8].className = "tdOther"
        table.rows[i].cells[8].innerHTML = results[i - 1].systemWatts
    }

    if (showAlerts && results.length == 0) {
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

            table.rows[1].cells[1].className = "tdRamCount"
            table.rows[1].cells[1].innerHTML = a.ramc
            table.rows[1].cells[2].className = "tdRamSpeed"
            table.rows[1].cells[2].innerHTML = a.rams

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
            table.rows[1].cells[8].innerHTML = a.wattage
        } else if (a.type == "build") {
            var table = document.getElementById('tableBuildMakerSaves')
            table.insertRow(1)
            for (i = 0; i < 13; i++) {
                table.rows[1].insertCell(i)
            }
            table.rows[1].cells[0].className = "tdCpu"
            table.rows[1].cells[0].innerHTML = a.cpu

            table.rows[1].cells[1].className = "tdRamCount"
            table.rows[1].cells[1].innerHTML = a.ramc
            table.rows[1].cells[2].className = "tdRamSpeed"
            table.rows[1].cells[2].innerHTML = a.rams
            table.rows[1].cells[3].className = "tdRamPart"
            table.rows[1].cells[3].innerHTML = a.ram

            table.rows[1].cells[4].className = "tdGpuCount"
            table.rows[1].cells[4].innerHTML = a.gpuCount
            table.rows[1].cells[5].className = "tdGpuType"
            table.rows[1].cells[5].innerHTML = a.gpuType
            table.rows[1].cells[6].className = "tdGpuPart"
            table.rows[1].cells[6].innerHTML = a.gpu

            table.rows[1].cells[7].className = "tdMobo"
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

var partReplacerSolutions

function pushPartReplacerSolutionIfValid(
    budgetTotal, budgetReserved, level,
    originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
    originalSystemCpu, newCpu, originalSystemGpu1, newGpu1, originalSystemGpu2, newGpu2, originalSystemMobo, newMobo
) {
    var budgetForParts = budgetTotal - budgetReserved
    var partsCost = 0
    var newGpu1Type = ""
    var newGpu2Type = ""
    if (newCpu != "") {
        if (data.procs[newCpu].level > level) {
            return false
        }
        if (originalSystemCpuPartStatus == "Broken" &&
            originalSystemCpu != newCpu &&
            data.procs[newCpu].partRankingScore <= data.procs[originalSystemCpu].partRankingScore
        ) {
            return false
        }
        if (originalSystemCpuPartStatus == "Upgrade" &&
            data.procs[newCpu].partRankingScore <= data.procs[originalSystemCpu].partRankingScore
        ) {
            return false
        }

        partsCost += data.procs[newCpu].price
    }
    if (newGpu1 != "") {
        if (data.gpus[newGpu1].level > level) {
            return false
        }
        if (originalSystemGpu1PartStatus == "Broken" &&
            originalSystemGpu1 != newGpu1 &&
            data.gpus[newGpu1].partRankingScore <= data.gpus[originalSystemGpu1].partRankingScore
        ) {
            return false
        }
        if (originalSystemGpu1PartStatus == "Upgrade" &&
            data.gpus[newGpu1].partRankingScore <= data.gpus[originalSystemGpu1].partRankingScore
        ) {
            return false
        }

        partsCost += data.gpus[newGpu1][1].price
        newGpu1Type = data.gpus[newGpu1].gpuType
    }
    if (newGpu2 != "") {
        if (data.gpus[newGpu2].level > level) {
            return false
        }
        if (originalSystemGpu2PartStatus == "Broken" &&
            originalSystemGpu2 != newGpu2 &&
            data.gpus[newGpu2].partRankingScore <= data.gpus[originalSystemGpu2].partRankingScore
        ) {
            return false
        }
        if (originalSystemGpu2PartStatus == "Upgrade" &&
            data.gpus[newGpu2].partRankingScore <= data.gpus[originalSystemGpu2].partRankingScore
        ) {
            return false
        }

        partsCost += data.gpus[newGpu2][1].price
        newGpu2Type = data.gpus[newGpu2].gpuType
    }
    if (newMobo != "") {
        if (data.motherboards[newMobo].level > level) {
            return false
        }
        if (originalSystemMoboPartStatus == "Broken" &&
            originalSystemMobo != newMobo &&
            data.motherboards[newMobo].price < data.motherboards[originalSystemMobo].price
        ) {
            return false
        }
        if (originalSystemMoboPartStatus == "Upgrade" &&
            data.motherboards[newMobo].price <= data.motherboards[originalSystemMobo].price
        ) {
            return false
        }

        partsCost += data.motherboards[newMobo].price
    }

    if (partsCost > budgetForParts) {
        return false
    }

    evalCpu = (newCpu == "" ? originalSystemCpu : newCpu)
    evalGpu1 = (newGpu1 == "" ? originalSystemGpu1 : newGpu1)
    evalGpu2 = (newGpu2 == "" ? originalSystemGpu2 : newGpu2)
    evalMobo = (newMobo == "" ? originalSystemMobo : newMobo)

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
    var systemWatts = getSystemWatts(gpuWattage, data.procs[evalCpu].wattage)

    partReplacerSolutions.push(partsForReplacer(newCpu, newGpu1Type, newGpu1, newGpu2Type, newGpu2, newMobo, partsCost, (budgetTotal - partsCost), systemWatts))
}

function PartReplacerGetParts() {
    var showAlerts = true

    var form = document.getElementById('formPartReplacer')

    var budgetTotal = Number(form.inputPartReplacerBudget.value)
    var budgetReserved = numberOrDefault(form.inputPartReplacerReservedBudget.value, 0)
    var level = Number(form.inputPartReplacerLevel.value)
    var resultsRequested = numberOrDefault(form.inputPartReplacerResultsRequested.value, 200)

    var originalSystemCpu = form.inputPartReplacerOriginalSystemCpu.value
    var originalSystemCpuPartStatus = form.selectPartReplacerOriginalSystemCpuPartStatus.value

    var originalSystemGpu1 = form.inputPartReplacerOriginalSystemGpu1.value
    var originalSystemGpu1PartStatus = form.selectPartReplacerOriginalSystemGpu1PartStatus.value

    var originalSystemGpu2 = form.inputPartReplacerOriginalSystemGpu2.value
    var originalSystemGpu2PartStatus = form.selectPartReplacerOriginalSystemGpu2PartStatus.value

    var originalSystemMobo = form.inputPartReplacerOriginalSystemMobo.value
    var originalSystemMoboPartStatus = form.selectPartReplacerOriginalSystemMoboPartStatus.value

    if (isNaN(budgetTotal) || budgetTotal == 0) {
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

    if (!data.procs[originalSystemCpu]) {
        if (showAlerts) {
            alert("CPU not found.")
        }
        return false
    }
    if (originalSystemGpu1 != "" && !data.gpus[originalSystemGpu1]) {
        if (showAlerts) {
            alert("GPU 1 not found.")
        }
        return false
    }
    if (originalSystemGpu2 != "" && !data.gpus[originalSystemGpu2]) {
        if (showAlerts) {
            alert("GPU 2 not found.")
        }
        return false
    }
    if (originalSystemGpu1 == "" && originalSystemGpu2 == "") {
        if (showAlerts) {
            alert("At least 1 GPU is required.")
        }
        return false
    }
    if (originalSystemGpu1 != "" && originalSystemGpu2 != "" && data.gpus[originalSystemGpu1].chipset != data.gpus[originalSystemGpu2].chipset) {
        if (showAlerts) {
            alert("GPU chipsets must be the same.")
        }
        return false
    }
    if (originalSystemGpu1 != "" && originalSystemGpu2 != "" && data.gpus[originalSystemGpu1].multiGPU == null) {
        if (showAlerts) {
            alert("GPU does not support Multi-GPU.")
        }
        return false
    }
    if (originalSystemGpu1 != "" && originalSystemGpu2 != "" && data.gpus[originalSystemGpu2].multiGPU == null) {
        if (showAlerts) {
            alert("GPU does not support Multi-GPU.")
        }
        return false
    }

    if (socketsCompatible(data.motherboards[originalSystemMobo].cpuSocket, data.procs[originalSystemCpu].cpuSocket) == false) {
        if (showAlerts) {
            alert("Selected CPU and Motherboard are incompatible.")
        }
        return false
    }

    if (originalSystemGpu1 != "" && originalSystemGpu2 != "" && motherboardSupportsMultiGPUType(data.motherboards[originalSystemMobo].supportSLI, data.motherboards[originalSystemMobo].supportCrossfire, data.gpus[originalSystemGpu1].multiGPU) == false) {
        if (showAlerts) {
            alert("Motherboard does not support this Multi-GPU type.")
        }
        return false
    }

    if (originalSystemCpuPartStatus == "" &&
        originalSystemGpu1PartStatus == "" &&
        originalSystemGpu2PartStatus == "" &&
        originalSystemMoboPartStatus == "") {
        if (showAlerts) {
            alert("At least 1 part must have a status requiring replacing.")
        }
        return false
    }

    partReplacerSolutions = []
    for (replaceCpu = 0; replaceCpu <= 1; replaceCpu++) {

        // Cpu: Skip scenarios when needing to replace but not replacing
        if (originalSystemCpuPartStatus != "" && !replaceCpu) {
            continue
        }
        // Cpu: Skip scenarios when not needing to replace but replacing
        if (originalSystemCpuPartStatus == "" && replaceCpu) {
            continue
        }

        for (replaceGpu1 = 0; replaceGpu1 <= 1; replaceGpu1++) {

            // Gpu1: Skip scenarios when needing to replace but not replacing
            if (originalSystemGpu1PartStatus != "" && !replaceGpu1) {
                continue
            }
            // Gpu1: Skip scenarios when not needing to replace but replacing
            if (originalSystemGpu1PartStatus == "" && replaceGpu1) {
                continue
            }

            for (replaceGpu2 = 0; replaceGpu2 <= 1; replaceGpu2++) {

                // Gpu2: Skip scenarios when needing to replace but not replacing
                if (originalSystemGpu2PartStatus != "" && !replaceGpu2) {
                    continue
                }
                // Gpu2: Skip scenarios when not needing to replace but replacing
                if (originalSystemGpu2PartStatus == "" && replaceGpu2) {
                    continue
                }

                for (replaceMobo = 0; replaceMobo <= 1; replaceMobo++) {

                    // Mobo: Skip scenarios when needing to replace but not replacing
                    if (originalSystemMoboPartStatus != "" && !replaceMobo) {
                        continue
                    }
                    // Mobo: Skip scenarios when cannot replace but replacing
                    if ((originalSystemCpuPartStatus == "" && originalSystemMoboPartStatus == "") && replaceMobo) {
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
                                                    pushPartReplacerSolutionIfValid(
                                                        budgetTotal, budgetReserved, level,
                                                        originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                        originalSystemCpu, newCpu, originalSystemGpu1, newGpu1, originalSystemGpu2, newGpu2, originalSystemMobo, newMobo)
                                                }
                                            }
                                            else {
                                                pushPartReplacerSolutionIfValid(
                                                    budgetTotal, budgetReserved, level,
                                                    originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                    originalSystemCpu, newCpu, originalSystemGpu1, newGpu1, originalSystemGpu2, newGpu2, originalSystemMobo, "")
                                            }
                                        }
                                    }
                                    else {
                                        if (replaceMobo) {
                                            for (newMobo in data.motherboards) {
                                                pushPartReplacerSolutionIfValid(
                                                    budgetTotal, budgetReserved, level,
                                                    originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                    originalSystemCpu, newCpu, originalSystemGpu1, newGpu1, originalSystemGpu2, "", originalSystemMobo, newMobo)
                                            }
                                        }
                                        else {
                                            pushPartReplacerSolutionIfValid(
                                                budgetTotal, budgetReserved, level,
                                                originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                originalSystemCpu, newCpu, originalSystemGpu1, newGpu1, originalSystemGpu2, "", originalSystemMobo, "")
                                        }
                                    }
                                }
                            }
                            else {
                                if (replaceGpu2) {
                                    for (newGpu2 in data.gpus) {
                                        if (replaceMobo) {
                                            for (newMobo in data.motherboards) {
                                                pushPartReplacerSolutionIfValid(
                                                    budgetTotal, budgetReserved, level,
                                                    originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                    originalSystemCpu, newCpu, originalSystemGpu1, "", originalSystemGpu2, newGpu2, originalSystemMobo, newMobo)
                                            }
                                        }
                                        else {
                                            pushPartReplacerSolutionIfValid(
                                                budgetTotal, budgetReserved, level,
                                                originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                originalSystemCpu, newCpu, originalSystemGpu1, "", originalSystemGpu2, newGpu2, originalSystemMobo, "")
                                        }
                                    }
                                }
                                else {
                                    if (replaceMobo) {
                                        for (newMobo in data.motherboards) {
                                            pushPartReplacerSolutionIfValid(
                                                budgetTotal, budgetReserved, level,
                                                originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                originalSystemCpu, newCpu, originalSystemGpu1, "", originalSystemGpu2, "", originalSystemMobo, newMobo)
                                        }
                                    }
                                    else {
                                        pushPartReplacerSolutionIfValid(
                                            budgetTotal, budgetReserved, level,
                                            originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                            originalSystemCpu, newCpu, originalSystemGpu1, "", originalSystemGpu2, "", originalSystemMobo, "")
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
                                                pushPartReplacerSolutionIfValid(
                                                    budgetTotal, budgetReserved, level,
                                                    originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                    originalSystemCpu, "", originalSystemGpu1, newGpu1, originalSystemGpu2, newGpu2, originalSystemMobo, newMobo)
                                            }
                                        }
                                        else {
                                            pushPartReplacerSolutionIfValid(
                                                budgetTotal, budgetReserved, level,
                                                originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                originalSystemCpu, "", originalSystemGpu1, newGpu1, originalSystemGpu2, newGpu2, originalSystemMobo, "")
                                        }
                                    }
                                }
                                else {
                                    if (replaceMobo) {
                                        for (newMobo in data.motherboards) {
                                            pushPartReplacerSolutionIfValid(
                                                budgetTotal, budgetReserved, level,
                                                originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                originalSystemCpu, "", originalSystemGpu1, newGpu1, originalSystemGpu2, "", originalSystemMobo, newMobo)
                                        }
                                    }
                                    else {
                                        pushPartReplacerSolutionIfValid(
                                            budgetTotal, budgetReserved, level,
                                            originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                            originalSystemCpu, "", originalSystemGpu1, newGpu1, originalSystemGpu2, "", originalSystemMobo, "")
                                    }
                                }
                            }
                        }
                        else {
                            if (replaceGpu2) {
                                for (newGpu2 in data.gpus) {
                                    if (replaceMobo) {
                                        for (newMobo in data.motherboards) {
                                            pushPartReplacerSolutionIfValid(
                                                budgetTotal, budgetReserved, level,
                                                originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                originalSystemCpu, "", originalSystemGpu1, "", originalSystemGpu2, newGpu2, originalSystemMobo, newMobo)
                                        }
                                    }
                                    else {
                                        pushPartReplacerSolutionIfValid(
                                            budgetTotal, budgetReserved, level,
                                            originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                            originalSystemCpu, "", originalSystemGpu1, "", originalSystemGpu2, newGpu2, originalSystemMobo, "")
                                    }
                                }
                            }
                            else {
                                if (replaceMobo) {
                                    for (newMobo in data.motherboards) {
                                        pushPartReplacerSolutionIfValid(
                                            budgetTotal, budgetReserved, level,
                                            originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                            originalSystemCpu, "", originalSystemGpu1, "", originalSystemGpu2, "", originalSystemMobo, newMobo)
                                    }
                                }
                                else {
                                    pushPartReplacerSolutionIfValid(
                                        budgetTotal, budgetReserved, level,
                                        originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                        originalSystemCpu, "", originalSystemGpu1, "", originalSystemGpu2, "", originalSystemMobo, "")
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    var results = getResultsLimitedAndSorted(partReplacerSolutions, resultsRequested)
    var table = document.getElementById('tablePartReplacerResults')
    resetResultsTable(table, results.length, 9)

    for (i = 1; i < results.length + 1; i++) {
        table.rows[i].cells[0].className = "tdCpu"
        table.rows[i].cells[0].innerHTML = results[i - 1].cpu

        table.rows[i].cells[1].className = "tdGpu1Type"
        table.rows[i].cells[1].innerHTML = results[i - 1].gpu1Type
        table.rows[i].cells[2].className = "tdGpu1Part"
        table.rows[i].cells[2].innerHTML = results[i - 1].gpu1

        table.rows[i].cells[3].className = "tdGpu2Type"
        table.rows[i].cells[3].innerHTML = results[i - 1].gpu2Type
        table.rows[i].cells[4].className = "tdGpu2Part"
        table.rows[i].cells[4].innerHTML = results[i - 1].gpu2

        table.rows[i].cells[5].className = "tdMobo"
        table.rows[i].cells[5].innerHTML = results[i - 1].mobo

        table.rows[i].cells[6].className = "tdCost"
        table.rows[i].cells[6].innerHTML = results[i - 1].cost
        table.rows[i].cells[7].className = "tdCost"
        table.rows[i].cells[7].innerHTML = results[i - 1].budgetLeft

        table.rows[i].cells[8].className = "tdOther"
        table.rows[i].cells[8].innerHTML = results[i - 1].systemWatts
    }

    if (showAlerts && results.length == 0) {
        alert("No replacements found.")
    }
}
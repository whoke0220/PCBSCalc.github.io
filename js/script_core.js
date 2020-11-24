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

function updateRamSpeedOptions(cpu, ramSpeedList) {
    var cpuRamSpeedList =
        data.ramSpeeds[getCpuSocketForRamSpeeds(data.cpus[cpu].cpuSocket)]
    for (i = 0; i < ramSpeedList.options.length; i++) {
        if (!cpuRamSpeedList[ramSpeedList.options[i].value]) {
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

function updateRamChannelOptions(cpu, ramChannelList) {
    for (i = 0; i < ramChannelList.options.length; i++) {
        if (ramChannelList.options[i].value <= data.cpus[cpu].maxMemoryChannels) {
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

function caseSupportsMobo(pcCase, mobo) {
    if (
        pcCase == "" ||
        mobo == "" ||
        data.pcCases[pcCase] == null ||
        data.mobos[mobo] == null
    ) {
        return false
    } else {
        return data.pcCases[pcCase].motherboardSize.includes(data.mobos[mobo].motherboardSize)
    }
}

function caseSupportsGpu(pcCase, gpu, gpuCount) {
    if (
        pcCase == "" ||
        gpu == "" ||
        data.pcCases[pcCase] == null ||
        data.gpus[gpu] == null
    ) {
        return false
    } else {
        return (
            data.pcCases[pcCase].maxGpuLength >= data.gpus[gpu].length &&
            (
                gpuCount == 1 ||
                data.gpus[gpu].realSlotSize <= 2 ||
                data.pcCases[pcCase].motherboardSize.includes("S-ATX")
            )
        )
    }
}

function moboSupportsM2(mobo, m2) {
    if (
        mobo == "" ||
        m2 == "" ||
        data.mobos[mobo] == null ||
        data.storages[m2] == null
    ) {
        return false
    } else {
        return data.mobos[mobo].m2Slots > 0 && (data.storages[m2].includesHeatsink != "Yes" || data.mobos[mobo].m2SlotsSupportingHeatsinks > 0)
    }
}

function moboSupportsCpu(mobo, cpu) {
    if (
        mobo == "" ||
        cpu == "" ||
        data.mobos[mobo] == null ||
        data.cpus[cpu] == null
    ) {
        return false
    } else {
        var socket1 = data.mobos[mobo].cpuSocket
        var socket2 = data.cpus[cpu].cpuSocket
        return (
            (socket1 == "LGA 1151 (Skylake)" && socket2 == "LGA 1151 (Kaby Lake)") ||
            (socket2 == "LGA 1151 (Skylake)" && socket1 == "LGA 1151 (Kaby Lake)") ||
            (socket1 == socket2)
        )
    }
}

function moboSupportsGpu(mobo, gpu, gpuCount) {
    if (
        mobo == "" ||
        gpu == "" ||
        data.mobos[mobo] == null ||
        data.gpus[gpu] == null
    ) {
        return false
    }
    else {
        if (gpuCount == 1) {
            return true
        } else if (gpuCount == 2) {
            if (
                data.mobos[mobo].dualGpuMaxSlotSize == null ||
                data.mobos[mobo].dualGpuMaxSlotSize < data.gpus[gpu].realSlotSize
            ) {
                return false
            } else {
                var gpuMultiGpu = data.gpus[gpu].multiGPU
                if (gpuMultiGpu == "SLI") {
                    return data.mobos[mobo].supportSLI == "Yes"
                } else if (gpuMultiGpu == "CrossFire") {
                    return data.mobos[mobo].supportCrossfire == "Yes"
                } else {
                    return false
                }
            }
        } else {
            return false
        }
    }
}

function moboSupportsRamCount(mobo, ramCount) {
    if (
        mobo == "" ||
        data.mobos[mobo] == null
    ) {
        return false
    } else {
        return data.mobos[mobo].ramSlots >= ramCount
    }
}

function updateMoboOptions(moboList, pcCase, m2, cpu, gpu, gpuCount) {
    var show
    for (moboOption in moboList.options) {
        if (moboOption == "length" || moboOption == "selectedIndex" || moboOption == "add" || moboOption == "remove" || moboOption == "item" || moboOption == "namedItem") {
            continue
        }

        mobo = moboList.options[moboOption].innerHTML
        show = false
        if (
            (pcCase == "" || (data.pcCases[pcCase] != null && caseSupportsMobo(pcCase, mobo))) &&
            (moboSupportsCpu(mobo, cpu)) &&
            (moboSupportsGpu(mobo, gpu, gpuCount)) &&
            (m2 == "" || (data.storages[m2] != null && moboSupportsM2(mobo, m2)))
        ) {
            show = true
        }
        moboList.options[moboOption].style.display = (show ? "block" : "none")
    }
}

function updateMoboOptionsBuildUpgrader() {
    var form = document.getElementById('formBuildUpgrader')
    updateMoboOptions(
        form.selectBuildUpgraderOriginalSystemMobo,
        form.inputBuildUpgraderOriginalSystemCase.value,
        form.inputBuildUpgraderOriginalSystemM2.value,
        form.inputBuildUpgraderOriginalSystemCpu.value,
        form.inputBuildUpgraderOriginalSystemGpu.value,
        form.selectBuildUpgraderOriginalSystemGpuCount.value
    )
}

function updateMoboOptions2(moboList, pcCase, m2, cpu, gpu1, gpu2) {
    if ((data.cpus[cpu] == null) ||
        (gpu1 == "" && gpu2 == "") ||
        (gpu1 != "" && data.gpus[gpu1] == null) ||
        (gpu2 != "" && data.gpus[gpu2] == null)) {
        return false
    }

    var gpuCount = 0
    var gpu
    if (gpu1 != "") {
        gpuCount += 1
        gpu = gpu1
    }
    if (gpu2 != "") {
        gpuCount += 1
        gpu = gpu2
    }

    updateMoboOptions(moboList, pcCase, m2, cpu, gpu, gpuCount)
}

function updateMoboOptionsPartReplacer() {
    var form = document.getElementById('formPartReplacer')
    updateMoboOptions2(
        form.inputPartReplacerOriginalSystemMobo,
        form.inputPartReplacerOriginalSystemCase.value,
        form.inputPartReplacerOriginalSystemM2.value,
        form.inputPartReplacerOriginalSystemCpu.value,
        form.inputPartReplacerOriginalSystemGpu1.value,
        form.inputPartReplacerOriginalSystemGpu2.value
    )
}

var calculatorCpuScore
var calculatorGpuScore
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

    var selectedCpu = form.input3DMarkCpu.value
    var selectedRamSpeed = form.select3DMarkRamSpeed.value
    var selectedRamChannel = form.select3DMarkRamChannel.value
    var selectedGpu = form.input3DMarkGpu.value
    var selectedGpuCount = form.select3DMarkGpuCount.value

    if (!data.cpus[selectedCpu]) {
        if (showAlerts) {
            alert("CPU not found.")
        }
        return false
    }
    if (selectedRamChannel > data.cpus[selectedCpu].maxMemoryChannels) {
        if (showAlerts) {
            alert("CPU only supports " + data.cpus[selectedCpu].maxMemoryChannels + " RAM Channels.")
        }
        return false
    }
    if (!data.gpus[selectedGpu]) {
        if (showAlerts) {
            alert("GPU not found.")
        }
        return false
    }
    if (selectedGpuCount == "2" &&
        data.gpus[selectedGpu].multiGPU == null) {
        if (showAlerts) {
            alert("Selected GPU does not support multi-GPU.")
        }
        return false
    }

    calculatorCpuScore = getCpuScore(selectedCpu, selectedRamChannel, selectedRamSpeed)
    calculatorGpuScore = getGpuScore(selectedGpu, selectedGpuCount)
    calculatorSystemScore = getSystemScore(calculatorCpuScore, calculatorGpuScore)
    calculatorGpuType = data.gpus[selectedGpu].gpuType
    calculatorSystemWatts = getSystemWatts(selectedCpu, selectedGpu, selectedGpuCount)
    calculatorCpuPriceNew = data.cpus[selectedCpu].price
    calculatorCpuPriceUsed = data.cpus[selectedCpu].sellPrice
    calculatorGpusPriceNew = selectedGpuCount * data.gpus[selectedGpu].price
    calculatorGpusPriceUsed = selectedGpuCount * data.gpus[selectedGpu].sellPrice

    document.getElementById('td3DMarkCpuScore').innerText = calculatorCpuScore
    document.getElementById('td3DMarkGpuScore').innerText = calculatorGpuScore
    document.getElementById('td3DMarkSystemScore').innerText = calculatorSystemScore
    document.getElementById('td3DMarkGpuType').innerText = calculatorGpuType
    document.getElementById('td3DMarkSystemWatts').innerText = calculatorSystemWatts
    document.getElementById('td3DMarkCpuPriceNew').innerText = calculatorCpuPriceNew
    document.getElementById('td3DMarkCpuPriceUsed').innerText = calculatorCpuPriceUsed
    document.getElementById('td3DMarkGpusPriceNew').innerText = calculatorGpusPriceNew
    document.getElementById('td3DMarkGpusPriceUsed').innerText = calculatorGpusPriceUsed

    return true
}

function getCpuScoreOC(cpu, frequency, ramChannel, ramSpeed) {
    return Math.floor(
        (
            (data.cpus[cpu].coreClockMultiplier * frequency) +
            (data.cpus[cpu].memChannelsMultiplier * ramChannel) +
            (data.cpus[cpu].memClockMultiplier * ramSpeed) +
            (data.cpus[cpu].finalAdjustment)
        ) * 298
    )
}

function getCpuScore(cpu, ramChannel, ramSpeed) {
    return getCpuScoreOC(cpu, data.cpus[cpu].frequency, ramChannel, ramSpeed)
}

function getGpuScoreOC(gpu, gpuCount, coreFrequency, memFrequency) {

    var gt1CoreClockMultiplier
    var gt1MemClockMultiplier
    var gt1BenchmarkAdjustment
    var gt2CoreClockMultiplier
    var gt2MemClockMultiplier
    var gt2BenchmarkAdjustment

    if (gpuCount == "1") {
        gt1CoreClockMultiplier = data.gpus[gpu].GT1SingleCoreClockMultiplier
        gt1MemClockMultiplier = data.gpus[gpu].GT1SingleMemClockMultiplier
        gt1BenchmarkAdjustment = data.gpus[gpu].GT1SingleBenchmarkAdjustment
        gt2CoreClockMultiplier = data.gpus[gpu].GT2SingleCoreClockMultiplier
        gt2MemClockMultiplier = data.gpus[gpu].GT2SingleMemClockMultiplier
        gt2BenchmarkAdjustment = data.gpus[gpu].GT2SingleBenchmarkAdjustment
    } else if (gpuCount == "2") {
        gt1CoreClockMultiplier = data.gpus[gpu].GT1DualCoreClockMultiplier
        gt1MemClockMultiplier = data.gpus[gpu].GT1DualMemClockMultiplier
        gt1BenchmarkAdjustment = data.gpus[gpu].GT1DualBenchmarkAdjustment
        gt2CoreClockMultiplier = data.gpus[gpu].GT2DualCoreClockMultiplier
        gt2MemClockMultiplier = data.gpus[gpu].GT2DualMemClockMultiplier
        gt2BenchmarkAdjustment = data.gpus[gpu].GT2DualBenchmarkAdjustment
    }

    return Math.floor(
        164 /
        (
            (
                0.5 /
                (
                    (gt1CoreClockMultiplier * coreFrequency) +
                    (gt1MemClockMultiplier * memFrequency) +
                    (gt1BenchmarkAdjustment)
                )
            ) +
            (
                0.5 /
                (
                    (gt2CoreClockMultiplier * coreFrequency) +
                    (gt2MemClockMultiplier * memFrequency) +
                    (gt2BenchmarkAdjustment)
                )
            )
        )
    )
}

function getGpuScore(gpu, gpuCount) {
    if (gpuCount == "1") {
        return data.gpus[gpu].singleGPUGraphicsScore
    } else if (gpuCount == "2") {
        return data.gpus[gpu].doubleGPUGraphicsScore
    }
}

function getSystemScore(cpuScore, gpuScore) {
    return Math.floor(
        1 /
        (
            (0.85 / gpuScore) +
            (0.15 / cpuScore)
        )
    )
}

function getSystemWatts(cpu, gpu, gpuCount) {
    return (
        data.cpus[cpu].wattage +
        (gpuCount * data.gpus[gpu].wattage) +
        30
    )
}

function getSystemWattsDifferentGpus(cpu, gpu1, gpu2) {
    var gpu1Watts = 0
    if (gpu1 != "") {
        gpu1Watts = data.gpus[gpu1].wattage
    }
    var gpu2Watts = 0
    if (gpu2 != "") {
        gpu2Watts = data.gpus[gpu2].wattage
    }
    return (
        data.cpus[cpu].wattage +
        gpu1Watts +
        gpu2Watts +
        30
    )
}

function CalculatorSaveBuild() {
    var form = document.getElementById('form3DMarkScoreCalculator')
    saveBuild(
        '-',
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

function partsForBuild(pcCase, cpu, ramChannel, ramSpeed, ram, gpuCount, gpuType, gpu, mobo, budgetTotal, budgetReserved, cost, budgetLeft, score, systemWatts) {
    var build = {
        "pcCase": pcCase,
        "cpu": cpu,
        "ramChannel": ramChannel,
        "ramSpeed": ramSpeed,
        "ram": ram,
        "gpuCount": gpuCount,
        "gpuType": gpuType,
        "gpu": gpu,
        "mobo": mobo,
        "budgetTotal": budgetTotal,
        "budgetReserved": budgetReserved,
        "cost": cost,
        "budgetLeft": budgetLeft,
        "score": score,
        "systemWatts": systemWatts,
        "selected": false
    }
    return build
}

function partsForReplacer(cpu, gpu1Type, gpu1, gpu2Type, gpu2, mobo, budgetTotal, budgetReserved, cost, budgetLeft, systemWatts) {
    var parts = {
        "cpu": cpu,
        "gpu1Type": gpu1Type,
        "gpu1": gpu1,
        "gpu2Type": gpu2Type,
        "gpu2": gpu2,
        "mobo": mobo,
        "budgetTotal": budgetTotal,
        "budgetReserved": budgetReserved,
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

function pushBuildForCases(builds, includeCases, cpu, ramChannel, ramSpeed, ram, gpuCount, gpuType, gpu, mobo, budgetTotal, budgetReserved, buildCost, score, systemWatts) {
    if (!includeCases)
    {
        builds.push(partsForBuild("-", cpu, ramChannel, ramSpeed, ram, gpuCount, gpuType, gpu, mobo, budgetTotal, budgetReserved, buildCost, budgetTotal - buildCost, score, systemWatts))
    } else {
        for (pcCase in data.pcCases) {
            var caseCost = data.pcCases[pcCase].price
            if (
                caseSupportsMobo(pcCase, mobo) &&
                caseSupportsGpu(pcCase, gpu, gpuCount) &&
                buildCost + caseCost <= budgetTotal - budgetReserved
            ) {
                builds.push(partsForBuild(data.pcCases[pcCase].fullName, cpu, ramChannel, ramSpeed, ram, gpuCount, gpuType, gpu, mobo, budgetTotal, budgetReserved, buildCost + caseCost, budgetTotal - buildCost - caseCost, score, systemWatts))
            }
        }
    }
}

function BuildMakerGetBuilds() {
    var showAlerts = true

    var form = document.getElementById('formBuildMaker')
    var table = document.getElementById('tableBuildMakerResults')
    var tableCells = 14
    resetResultsTable(table, 0, tableCells)

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
    var includeCases = form.inputBuildMakerIncludeCases.checked
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
    for (cpu in data.cpus) {
        if (data.cpus[cpu].level > level) {
            continue
        }
        if (needCpuOverclock == true && data.cpus[cpu].canOverclock == "No") {
            continue
        }
        if (selectedCpuSocket != "Any" && selectedCpuSocket != data.cpus[cpu].cpuSocket) {
            continue
        }

        buildCost = data.cpus[cpu].price
        if (buildCost > budgetForParts) {
            continue
        }

        for (gpu in data.gpus) {
            if (data.gpus[gpu].level > level) {
                continue
            }
            if (selectedGpuType != "Any" && selectedGpuType != data.gpus[gpu].gpuType) {
                continue
            }
            for (gpuCount = 1; gpuCount <= 2; gpuCount++) {
                if (selectedGpuCount != "Any" && selectedGpuCount != gpuCount) {
                    continue
                }

                buildCost = data.cpus[cpu].price + (gpuCount * data.gpus[gpu].price)
                if (buildCost > budgetForParts) {
                    continue
                }

                for (ramChannel = 1; ramChannel <= data.cpus[cpu].maxMemoryChannels; ramChannel++) {
                    for (ramSpeed in data.ramSpeeds[getCpuSocketForRamSpeeds(data.cpus[cpu].cpuSocket)]) {

                        buildScore =
                            getSystemScore(
                                getCpuScore(cpu, ramChannel, ramSpeed),
                                getGpuScore(gpu, gpuCount)
                            )
                        if (buildScore < target3DMarkScore) {
                            continue
                        }
                        if (buildScore > target3DMarkScoreMaximum) {
                            continue
                        }

                        selectedMotherboardName = null
                        selectedRamName = null

                        if (includeMotherboard == false && includeRamPart == false) {
                            buildCost = data.cpus[cpu].price + (gpuCount * data.gpus[gpu].price)
                            if (buildCost <= budgetForParts) {
                                pushBuildForCases(builds, includeCases, cpu, ramChannel, ramSpeed, (selectedRamName || "-"), gpuCount, data.gpus[gpu].gpuType, gpu, (selectedMotherboardName || "-"), budgetTotal, budgetReserved, buildCost, buildScore, getSystemWatts(cpu, gpu, gpuCount))
                            }
                        } else if (includeMotherboard == true && includeRamPart == false) {
                            for (mobo in data.mobos) {
                                if (data.mobos[mobo].level > level) {
                                    continue
                                } else if (!moboSupportsCpu(mobo, cpu)) {
                                    continue
                                } else if (!moboSupportsGpu(mobo, gpu, gpuCount)) {
                                    continue
                                } else if (!moboSupportsRamCount(mobo, ramChannel)) {
                                    continue
                                } else if (needCpuOverclock == true && data.mobos[mobo].canOverclock != "Yes") {
                                    continue
                                } else if (data.mobos[mobo].memorySpeedSteps.includes(ramSpeed.toString()) == false) {
                                    continue
                                }
                                buildCost = data.cpus[cpu].price + (gpuCount * data.gpus[gpu].price) + data.mobos[mobo].price
                                if (buildCost <= budgetForParts) {
                                    selectedMotherboardName = data.mobos[mobo].fullName
                                    pushBuildForCases(builds, includeCases, cpu, ramChannel, ramSpeed, (selectedRamName || "-"), gpuCount, data.gpus[gpu].gpuType, gpu, (selectedMotherboardName || "-"), budgetTotal, budgetReserved, buildCost, buildScore, getSystemWatts(cpu, gpu, gpuCount))
                                }
                            }
                        } else if (includeMotherboard == false && includeRamPart == true) {
                            for (ram in data.rams) {
                                if (data.rams[ram].level > level) {
                                    continue
                                } else if (data.rams[ram].frequency != Number(ramSpeed)) {
                                    continue
                                }
                                buildCost = data.cpus[cpu].price + (gpuCount * data.gpus[gpu].price) + (ramChannel * data.rams[ram].price)
                                if (buildCost <= budgetForParts) {
                                    selectedRamName = data.rams[ram].fullName
                                    pushBuildForCases(builds, includeCases, cpu, ramChannel, ramSpeed, (selectedRamName || "-"), gpuCount, data.gpus[gpu].gpuType, gpu, (selectedMotherboardName || "-"), budgetTotal, budgetReserved, buildCost, buildScore, getSystemWatts(cpu, gpu, gpuCount))
                                }
                            }
                        } else if (includeMotherboard == true && includeRamPart == true) {
                            for (mobo in data.mobos) {
                                if (data.mobos[mobo].level > level) {
                                    continue
                                } else if (!moboSupportsCpu(mobo, cpu)) {
                                    continue
                                } else if (!moboSupportsGpu(mobo, gpu, gpuCount)) {
                                    continue
                                } else if (!moboSupportsRamCount(mobo, ramChannel)) {
                                    continue
                                } else if (needCpuOverclock == true && data.mobos[mobo].canOverclock != "Yes") {
                                    continue
                                } else if (data.mobos[mobo].memorySpeedSteps.includes(ramSpeed.toString()) == false) {
                                    continue
                                }
                                buildCost = data.cpus[cpu].price + (gpuCount * data.gpus[gpu].price) + data.mobos[mobo].price
                                if (buildCost <= budgetForParts) {
                                    for (ram in data.rams) {
                                        if (data.rams[ram].level > level) {
                                            continue
                                        } else if (data.rams[ram].frequency != Number(ramSpeed)) {
                                            continue
                                        }
                                        buildCost = data.cpus[cpu].price + (gpuCount * data.gpus[gpu].price) + data.mobos[mobo].price + (ramChannel * data.rams[ram].price)
                                        if (buildCost <= budgetForParts) {
                                            selectedMotherboardName = data.mobos[mobo].fullName
                                            selectedRamName = data.rams[ram].fullName
                                            pushBuildForCases(builds, includeCases, cpu, ramChannel, ramSpeed, (selectedRamName || "-"), gpuCount, data.gpus[gpu].gpuType, gpu, (selectedMotherboardName || "-"), budgetTotal, budgetReserved, buildCost, buildScore, getSystemWatts(cpu, gpu, gpuCount))
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
    resetResultsTable(table, results.length, tableCells)

    for (i = 1; i < results.length + 1; i++) {
        table.rows[i].cells[0].className = "tdCase"
        table.rows[i].cells[0].innerHTML = results[i - 1].pcCase

        table.rows[i].cells[1].className = "tdCpu"
        table.rows[i].cells[1].innerHTML = results[i - 1].cpu

        table.rows[i].cells[2].className = "tdramChannel"
        table.rows[i].cells[2].innerHTML = results[i - 1].ramChannel
        table.rows[i].cells[3].className = "tdRamSpeed"
        table.rows[i].cells[3].innerHTML = results[i - 1].ramSpeed
        table.rows[i].cells[4].className = "tdRamPart"
        table.rows[i].cells[4].innerHTML = results[i - 1].ram

        table.rows[i].cells[5].className = "tdGpuCount"
        table.rows[i].cells[5].innerHTML = results[i - 1].gpuCount
        table.rows[i].cells[6].className = "tdGpuType"
        table.rows[i].cells[6].innerHTML = results[i - 1].gpuType
        table.rows[i].cells[7].className = "tdGpuPart"
        table.rows[i].cells[7].innerHTML = results[i - 1].gpu

        table.rows[i].cells[8].className = "tdMobo"
        table.rows[i].cells[8].innerHTML = results[i - 1].mobo

        table.rows[i].cells[9].className = "tdCost"
        table.rows[i].cells[9].innerHTML = results[i - 1].cost
        table.rows[i].cells[10].className = "tdCost"
        table.rows[i].cells[10].innerHTML = results[i - 1].budgetLeft

        table.rows[i].cells[11].className = "tdScore"
        table.rows[i].cells[11].innerHTML = results[i - 1].score

        table.rows[i].cells[12].className = "tdOther"
        table.rows[i].cells[12].innerHTML = results[i - 1].systemWatts

        table.rows[i].cells[13].className = "tdOther"
        table.rows[i].cells[13] = addSaveButton(table.rows[i].cells[13], i)
    }

    if (showAlerts && results.length == 0) {
        alert("No builds found.")
    }
}

function getCpuSocketForRamSpeeds(cpuSocket) {
    var cpuSocketForRamSpeeds
    if (cpuSocket == "LGA 1151 (Skylake)") {
        cpuSocketForRamSpeeds = "LGA 1151 V1"
    } else if (cpuSocket == "LGA 1151 (Kaby Lake)") {
        cpuSocketForRamSpeeds = "LGA 1151 V1"
    } else if (cpuSocket == "LGA 1151 (Coffee Lake)") {
        cpuSocketForRamSpeeds = "LGA 1151 V2"
    } else {
        cpuSocketForRamSpeeds = cpuSocket
    }

    return cpuSocketForRamSpeeds
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
    var table = document.getElementById('tableBuildUpgraderResults')
    var tableCells = 9
    resetResultsTable(table, 0, tableCells)

    var budgetTotal = Number(form.inputBuildUpgraderBudget.value)
    var budgetReserved = numberOrDefault(form.inputBuildUpgraderReservedBudget.value, 0)
    var budgetForParts = budgetTotal - budgetReserved

    var target3DMarkScore = Number(form.inputBuildUpgraderTarget3DMarkScore.value)
    var target3DMarkScoreOffset = numberOrDefault(form.inputBuildUpgraderTarget3DMarkScoreOffset.value, 400)
    var target3DMarkScoreMaximum = target3DMarkScore + target3DMarkScoreOffset

    var level = Number(form.inputBuildUpgraderLevel.value)
    var resultsRequested = numberOrDefault(form.inputBuildUpgraderResultsRequested.value, 200)

    var originalSystemCase = form.inputBuildUpgraderOriginalSystemCase.value
    var originalSystemM2 = form.inputBuildUpgraderOriginalSystemM2.value
    var originalSystemCpu = form.inputBuildUpgraderOriginalSystemCpu.value
    var originalSystemRamSpeed = form.selectBuildUpgraderOriginalSystemRamSpeed.value
    var originalSystemRamSticks = Number(form.inputBuildUpgraderRamSticks.value)
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

    if (!data.cpus[originalSystemCpu]) {
        if (showAlerts) {
            alert("CPU not found.")
        }
        return false
    }
    if (!data.gpus[originalSystemGpu]) {
        if (showAlerts) {
            alert("GPU not found.")
        }
        return false
    }
    if (originalSystemGpuCount == "2" &&
        data.gpus[originalSystemGpu].multiGPU == null
    ) {
        if (showAlerts) {
            alert("Selected GPU does not support multi-GPU.")
        }
        return false
    }
    if (!moboSupportsCpu(originalSystemMobo, originalSystemCpu)) {
        if (showAlerts) {
            alert("Selected CPU and Motherboard are incompatible.")
        }
        return false
    }
    if (!moboSupportsGpu(originalSystemMobo, originalSystemGpu, originalSystemGpuCount)) {
        if (showAlerts) {
            alert("Motherboard does not support this Multi-GPU type.")
        }
        return false
    }
    if (!moboSupportsRamCount(originalSystemMobo, originalSystemRamSticks)) {
        if (showAlerts) {
            alert("Motherboard does not support this many RAM Sticks.")
        }
        return false
    }

    if (originalSystemCase != "") {
        if (!data.pcCases[originalSystemCase]) {
            if (showAlerts) {
                alert("Case not found.")
            }
            return false
        }
        if (!caseSupportsMobo(originalSystemCase, originalSystemMobo)) {
            if (showAlerts) {
                alert("Case does not support motherboard.")
            }
            return false
        }
        if (originalSystemGpu != "" && !caseSupportsGpu(originalSystemCase, originalSystemGpu, originalSystemGpuCount)) {
            if (showAlerts) {
                alert("Case does not support GPU(s).")
            }
            return false
        }
    }
    if (originalSystemM2 != "") {
        if (!data.storages[originalSystemM2]) {
            if (showAlerts) {
                alert("M.2 not found.")
            }
            return false
        }
        if (!moboSupportsM2(originalSystemMobo, originalSystemM2)) {
            if (showAlerts) {
                alert("Motheboard does not support this M.2.")
            }
            return false
        }
    }

    var originalSystemRamChannel = Math.min(originalSystemRamSticks, data.cpus[originalSystemCpu].maxMemoryChannels)
    var originalSystemRamSpeedForCalc = Math.min(originalSystemRamSpeed, data.mobos[originalSystemMobo].maxMemorySpeed)
    var originalSystemScore = getSystemScore(getCpuScore(originalSystemCpu, originalSystemRamChannel, originalSystemRamSpeedForCalc), getGpuScore(originalSystemGpu, originalSystemGpuCount))
    if (originalSystemScore > target3DMarkScore) {
        if (showAlerts) {
            alert("No upgrade is needed. However, the calculator will still list results for part replacements.")
        }
    }

    var pcCase = originalSystemCase
    var cpu
    var mobo
    var gpu
    var gpuCount
    var m2 = originalSystemM2

    var ramSpeed
    var ramChannel

    var builds = []
    var buildScore
    var buildCost

    /* CPU-only upgrade */
    mobo = originalSystemMobo
    gpu = originalSystemGpu
    gpuCount = originalSystemGpuCount
    ramSpeed = Math.min(originalSystemRamSpeed, data.mobos[mobo].maxMemorySpeed)
    for (cpu in data.cpus) {
        if (!moboSupportsCpu(mobo, cpu)) {
            continue
        } else if (data.cpus[cpu].level > level) {
            continue
        }

        buildCost = data.cpus[cpu].price
        if (buildCost > budgetForParts) {
            continue
        }

        ramChannel = Math.min(originalSystemRamSticks, data.cpus[cpu].maxMemoryChannels)

        buildScore = getSystemScore(getCpuScore(cpu, ramChannel, ramSpeed), getGpuScore(gpu, gpuCount))
        if ((buildScore >= target3DMarkScore) && (buildScore < target3DMarkScoreMaximum)) {
            pushBuildForCases(builds, false, cpu, "-", "-", "-", "-", "-", "-", "-", budgetTotal, budgetReserved, buildCost, buildScore, getSystemWatts(cpu, gpu, gpuCount))
        }
    }

    /* GPU-only upgrade */
    mobo = originalSystemMobo
    cpu = originalSystemCpu
    ramSpeed = Math.min(originalSystemRamSpeed, data.mobos[mobo].maxMemorySpeed)
    ramChannel = Math.min(originalSystemRamSticks, data.cpus[cpu].maxMemoryChannels)
    for (gpu in data.gpus) {
        if (data.gpus[gpu].level > level) {
            continue
        }
        if (selectedGpuType != "Any" && selectedGpuType != data.gpus[gpu].gpuType) {
            continue
        }
        for (gpuCount = 1; gpuCount <= 2; gpuCount++) {
            if (selectedGpuCount != "Any" && selectedGpuCount != gpuCount) {
                continue
            }
            if (!moboSupportsGpu(mobo, gpu, gpuCount)) {
                continue
            }
            if (pcCase != "" && !caseSupportsGpu(pcCase, gpu, gpuCount)) {
                continue
            }

            buildCost = (gpuCount * data.gpus[gpu].price)
            if (buildCost <= budgetForParts) {
                buildScore = getSystemScore(getCpuScore(cpu, ramChannel, ramSpeed), getGpuScore(gpu, gpuCount))
                if ((buildScore >= target3DMarkScore) && (buildScore < target3DMarkScoreMaximum)) {
                    pushBuildForCases(builds, false, "-", "-", "-", "-", gpuCount, data.gpus[gpu].gpuType, gpu, "-", budgetTotal, budgetReserved, buildCost, buildScore, getSystemWatts(cpu, gpu, gpuCount))
                }
            }
            if (originalSystemGpuCount == 1 && gpuCount == "2" && data.gpus[originalSystemGpu].fullName == data.gpus[gpu].fullName) {
                buildCost = data.gpus[gpu].price
                if (buildCost <= budgetForParts) {
                    buildScore = getSystemScore(getCpuScore(cpu, ramChannel, ramSpeed), getGpuScore(gpu, gpuCount))
                    if ((buildScore >= target3DMarkScore) && (buildScore < target3DMarkScoreMaximum)) {
                        pushBuildForCases(builds, false, "-", "-", "-", "-", "1 + 1", data.gpus[gpu].gpuType, gpu, "-", budgetTotal, budgetReserved, buildCost, buildScore, getSystemWatts(cpu, gpu, gpuCount))
                    }
                }
            }
        }
    }

    /* CPU and GPU upgrade */
    mobo = originalSystemMobo
    ramSpeed = Math.min(originalSystemRamSpeed, data.mobos[mobo].maxMemorySpeed)
    for (cpu in data.cpus) {
        if (!moboSupportsCpu(mobo, cpu)) {
            continue
        } else if (data.cpus[cpu].level > level) {
            continue
        }

        ramChannel = Math.min(originalSystemRamSticks, data.cpus[cpu].maxMemoryChannels)

        for (gpu in data.gpus) {
            if (data.gpus[gpu].level > level) {
                continue
            }
            if (selectedGpuType != "Any" && selectedGpuType != data.gpus[gpu].gpuType) {
                continue
            }
            for (gpuCount = 1; gpuCount <= 2; gpuCount++) {
                if (selectedGpuCount != "Any" && selectedGpuCount != gpuCount) {
                    continue
                }
                if (!moboSupportsGpu(mobo, gpu, gpuCount)) {
                    continue
                }
                if (pcCase != "" && !caseSupportsGpu(pcCase, gpu, gpuCount)) {
                    continue
                }

                buildCost = data.cpus[cpu].price + (gpuCount * data.gpus[gpu].price)
                if (buildCost <= budgetForParts) {
                    buildScore = getSystemScore(getCpuScore(cpu, ramChannel, ramSpeed), getGpuScore(gpu, gpuCount))
                    if ((buildScore >= target3DMarkScore) && (buildScore < target3DMarkScoreMaximum)) {
                        pushBuildForCases(builds, false, cpu, "-", "-", "-", gpuCount, data.gpus[gpu].gpuType, gpu, "-", budgetTotal, budgetReserved, buildCost, buildScore, getSystemWatts(cpu, gpu, gpuCount))
                    }
                }
                if (originalSystemGpuCount == 1 && gpuCount == "2" && data.gpus[originalSystemGpu].fullName == data.gpus[gpu].fullName) {
                    buildCost = data.cpus[cpu].price + data.gpus[gpu].price
                    if (buildCost <= budgetForParts) {
                        buildScore = getSystemScore(getCpuScore(cpu, ramChannel, ramSpeed), getGpuScore(gpu, gpuCount))
                        if ((buildScore >= target3DMarkScore) && (buildScore < target3DMarkScoreMaximum)) {
                            pushBuildForCases(builds, false, cpu, "-", "-", "-", "1 + 1", data.gpus[gpu].gpuType, gpu, "-", budgetTotal, budgetReserved, buildCost, buildScore, getSystemWatts(cpu, gpu, gpuCount))
                        }
                    }
                }
            }
        }
    }

    /* motherboard change - CPU-only upgrade */
    gpu = originalSystemGpu
    gpuCount = originalSystemGpuCount
    for (mobo in data.mobos) {
        if (data.mobos[mobo].level > level) {
            continue
        }
        if (pcCase != "" && !caseSupportsMobo(pcCase, mobo)) {
            continue
        }
        if (m2 != "" && !moboSupportsM2(mobo, m2)) {
            continue
        }

        //if (data.mobos[mobo].fullName == data.mobos[originalSystemMobo].fullName) {
        //    continue
        //}

        ramSpeed = Math.min(originalSystemRamSpeed, data.mobos[mobo].maxMemorySpeed)

        for (cpu in data.cpus) {
            if (!moboSupportsCpu(mobo, cpu)) {
                continue
            } else if (data.cpus[cpu].level > level) {
                continue
            }

            /* if old motherboard would have worked, skip */
            //if (moboSupportsCpu(originalSystemMobo, cpu)) {
            //    continue
            //}

            buildCost = data.mobos[mobo].price + data.cpus[cpu].price
            if (buildCost > budgetForParts) {
                continue
            }

            ramChannel = Math.min(originalSystemRamSticks, data.cpus[cpu].maxMemoryChannels)

            buildScore = getSystemScore(getCpuScore(cpu, ramChannel, ramSpeed), getGpuScore(gpu, gpuCount))
            if ((buildScore >= target3DMarkScore) && (buildScore < target3DMarkScoreMaximum)) {
                pushBuildForCases(builds, false, cpu, "-", "-", "-", "-", "-", "-", mobo, budgetTotal, budgetReserved, buildCost, buildScore, getSystemWatts(cpu, gpu, gpuCount))
            }
        }
    }

    /* motherboard change - GPU-only upgrade */
    cpu = originalSystemCpu
    ramChannel = Math.min(originalSystemRamSticks, data.cpus[cpu].maxMemoryChannels)
    for (mobo in data.mobos) {
        if (data.mobos[mobo].level > level) {
            continue
        }
        if (pcCase != "" && !caseSupportsMobo(pcCase, mobo)) {
            continue
        }
        if (m2 != "" && !moboSupportsM2(mobo, m2)) {
            continue
        }

        if (!moboSupportsCpu(mobo, cpu)) {
            continue
        }

        //if (data.mobos[mobo].fullName == data.mobos[originalSystemMobo].fullName) {
        //    continue
        //}

        ramSpeed = Math.min(originalSystemRamSpeed, data.mobos[mobo].maxMemorySpeed)

        for (gpu in data.gpus) {
            if (data.gpus[gpu].level > level) {
                continue
            }
            if (selectedGpuType != "Any" && selectedGpuType != data.gpus[gpu].gpuType) {
                continue
            }
            for (gpuCount = 1; gpuCount <= 2; gpuCount++) {
                if (selectedGpuCount != "Any" && selectedGpuCount != gpuCount) {
                    continue
                }
                if (!moboSupportsGpu(mobo, gpu, gpuCount)) {
                    continue
                }
                if (pcCase != "" && !caseSupportsGpu(pcCase, gpu, gpuCount)) {
                    continue
                }

                /* if old motherboard would have worked, skip */
                //if (moboSupportsGpu(originalSystemMobo, gpu, gpuCount)) {
                //    continue
                //}

                buildCost = data.mobos[mobo].price + (gpuCount * data.gpus[gpu].price)
                if (buildCost <= budgetForParts) {
                    buildScore = getSystemScore(getCpuScore(cpu, ramChannel, ramSpeed), getGpuScore(gpu, gpuCount))
                    if ((buildScore >= target3DMarkScore) && (buildScore < target3DMarkScoreMaximum)) {
                        pushBuildForCases(builds, false, "-", "-", "-", "-", gpuCount, data.gpus[gpu].gpuType, gpu, mobo, budgetTotal, budgetReserved, buildCost, buildScore, getSystemWatts(cpu, gpu, gpuCount))
                    }
                }
                if (originalSystemGpuCount == 1 && gpuCount == "2" && data.gpus[originalSystemGpu].fullName == data.gpus[gpu].fullName) {
                    buildCost = data.mobos[mobo].price + data.gpus[gpu].price
                    if (buildCost <= budgetForParts) {
                        buildScore = getSystemScore(getCpuScore(cpu, ramChannel, ramSpeed), getGpuScore(gpu, gpuCount))
                        if ((buildScore >= target3DMarkScore) && (buildScore < target3DMarkScoreMaximum)) {
                            pushBuildForCases(builds, false, "-", "-", "-", "-", "1 + 1", data.gpus[gpu].gpuType, gpu, mobo, budgetTotal, budgetReserved, buildCost, buildScore, getSystemWatts(cpu, gpu, gpuCount))
                        }
                    }
                }
            }
        }
    }

    /* motherboard change - CPU and GPU upgrade */
    for (mobo in data.mobos) {
        if (data.mobos[mobo].level > level) {
            continue
        }
        if (pcCase != "" && !caseSupportsMobo(pcCase, mobo)) {
            continue
        }
        if (m2 != "" && !moboSupportsM2(mobo, m2)) {
            continue
        }

        //if (data.mobos[mobo].fullName == data.mobos[originalSystemMobo].fullName) {
        //    continue
        //}

        ramSpeed = Math.min(originalSystemRamSpeed, data.mobos[mobo].maxMemorySpeed)

        for (cpu in data.cpus) {
            if (!moboSupportsCpu(mobo, cpu)) {
                continue
            } else if (data.cpus[cpu].level > level) {
                continue
            }

            ramChannel = Math.min(originalSystemRamSticks, data.cpus[cpu].maxMemoryChannels)

            for (gpu in data.gpus) {
                if (data.gpus[gpu].level > level) {
                    continue
                }
                if (selectedGpuType != "Any" && selectedGpuType != data.gpus[gpu].gpuType) {
                    continue
                }
                for (gpuCount = 1; gpuCount <= 2; gpuCount++) {
                    if (selectedGpuCount != "Any" && selectedGpuCount != gpuCount) {
                        continue
                    }
                    if (!moboSupportsGpu(mobo, gpu, gpuCount)) {
                        continue
                    }
                    if (pcCase != "" && !caseSupportsGpu(pcCase, gpu, gpuCount)) {
                        continue
                    }

                    /* if old motherboard would have worked, skip */
                    //if (moboSupportsCpu(originalSystemMobo, cpu) &&
                    //    moboSupportsGpu(originalSystemMobo, gpu, gpuCount)) {
                    //    continue
                    //}

                    buildCost = data.mobos[mobo].price + data.cpus[cpu].price + (gpuCount * data.gpus[gpu].price)
                    if (buildCost <= budgetForParts) {
                        buildScore = getSystemScore(getCpuScore(cpu, ramChannel, ramSpeed), getGpuScore(gpu, gpuCount))
                        if ((buildScore >= target3DMarkScore) && (buildScore < target3DMarkScoreMaximum)) {
                            pushBuildForCases(builds, false, cpu, "-", "-", "-", gpuCount, data.gpus[gpu].gpuType, gpu, mobo, budgetTotal, budgetReserved, buildCost, buildScore, getSystemWatts(cpu, gpu, gpuCount))
                        }
                    }
                    if (originalSystemGpuCount == 1 && gpuCount == "2" && data.gpus[originalSystemGpu].fullName == data.gpus[gpu].fullName) {
                        buildCost = data.mobos[mobo].price + data.cpus[cpu].price + data.gpus[gpu].price
                        if (buildCost <= budgetForParts) {
                            buildScore = getSystemScore(getCpuScore(cpu, ramChannel, ramSpeed), getGpuScore(gpu, gpuCount))
                            if ((buildScore >= target3DMarkScore) && (buildScore < target3DMarkScoreMaximum)) {
                                pushBuildForCases(builds, false, cpu, "-", "-", "-", "1 + 1", data.gpus[gpu].gpuType, gpu, mobo, budgetTotal, budgetReserved, buildCost, buildScore, getSystemWatts(cpu, gpu, gpuCount))
                            }
                        }
                    }
                }
            }
        }
    }

    var results = getResultsLimitedAndSorted(builds, resultsRequested)
    resetResultsTable(table, results.length, tableCells)

    for (i = 1; i < results.length + 1; i++) {
        table.rows[i].cells[0].className = "tdCpu"
        table.rows[i].cells[0].innerHTML = results[i - 1].cpu

        //table.rows[i].cells[?].className = "tdramChannel"
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

var partReplacerSolutions

function pushPartReplacerSolutionIfValid(
    budgetTotal, budgetReserved, level, originalSystemCase, originalSystemM2,
    originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
    originalSystemCpu, newCpu, originalSystemGpu1, newGpu1, originalSystemGpu2, newGpu2, originalSystemMobo, newMobo
) {
    var budgetForParts = budgetTotal - budgetReserved
    var partsCost = 0
    var newGpu1Type = ""
    var newGpu2Type = ""
    if (newCpu != "") {
        if (data.cpus[newCpu].level > level) {
            return false
        }
        if (originalSystemCpuPartStatus == "Broken" &&
            originalSystemCpu != newCpu &&
            data.cpus[newCpu].partRankingScore <= data.cpus[originalSystemCpu].partRankingScore
        ) {
            return false
        }
        if (originalSystemCpuPartStatus == "Upgrade" &&
            data.cpus[newCpu].partRankingScore <= data.cpus[originalSystemCpu].partRankingScore
        ) {
            return false
        }

        partsCost += data.cpus[newCpu].price
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
        if (originalSystemCase != "" && !caseSupportsGpu(originalSystemCase, newGpu1, 1)) {
            return false
        }

        partsCost += data.gpus[newGpu1].price
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
        if (originalSystemCase != "" && !caseSupportsGpu(originalSystemCase, newGpu2, 1)) {
            return false
        }

        partsCost += data.gpus[newGpu2].price
        newGpu2Type = data.gpus[newGpu2].gpuType
    }
    if (newMobo != "") {
        if (data.mobos[newMobo].level > level) {
            return false
        }
        if (originalSystemMoboPartStatus == "Broken" &&
            originalSystemMobo != newMobo &&
            data.mobos[newMobo].price < data.mobos[originalSystemMobo].price
        ) {
            return false
        }
        if (originalSystemMoboPartStatus == "Upgrade" &&
            data.mobos[newMobo].price <= data.mobos[originalSystemMobo].price
        ) {
            return false
        }
        if (originalSystemCase != "" && !caseSupportsMobo(originalSystemCase, newMobo)) {
            return false
        }
        if (originalSystemM2 != "" && !moboSupportsM2(newMobo, originalSystemM2)) {
            return false
        }

        partsCost += data.mobos[newMobo].price
    }

    if (partsCost > budgetForParts) {
        return false
    }

    evalCpu = (newCpu == "" ? originalSystemCpu : newCpu)
    evalGpu1 = (newGpu1 == "" ? originalSystemGpu1 : newGpu1)
    evalGpu2 = (newGpu2 == "" ? originalSystemGpu2 : newGpu2)
    evalMobo = (newMobo == "" ? originalSystemMobo : newMobo)

    evalGpuCount = ((evalGpu1 == "" ? 0 : 1) + (evalGpu2 == "" ? 0 : 1))

    if (!moboSupportsCpu(evalMobo, evalCpu)) {
        return false
    }

    if (evalGpu1 != "" && evalGpu2 != "") {
        if (data.gpus[evalGpu1].multiGPU == "" || data.gpus[evalGpu2].multiGPU == "") {
            return false
        }
        if (data.gpus[evalGpu1].multiGPU != data.gpus[evalGpu2].multiGPU) {
            return false
        }
        if (!moboSupportsGpu(evalMobo, evalGpu1, evalGpuCount)) {
            return false
        }
        if (originalSystemCase != "" && !caseSupportsGpu(originalSystemCase, evalGpu1, 2)) {
            return false
        }
    }

    partReplacerSolutions.push(partsForReplacer(newCpu, newGpu1Type, newGpu1, newGpu2Type, newGpu2, newMobo, budgetTotal, budgetReserved, partsCost, budgetTotal - partsCost, getSystemWattsDifferentGpus(evalCpu, evalGpu1, evalGpu2)))
}

function PartReplacerGetParts() {
    var showAlerts = true

    var form = document.getElementById('formPartReplacer')
    var table = document.getElementById('tablePartReplacerResults')
    var tableCells = 9
    resetResultsTable(table, 0, tableCells)

    var budgetTotal = Number(form.inputPartReplacerBudget.value)
    var budgetReserved = numberOrDefault(form.inputPartReplacerReservedBudget.value, 0)
    var level = Number(form.inputPartReplacerLevel.value)
    var resultsRequested = numberOrDefault(form.inputPartReplacerResultsRequested.value, 200)

    var originalSystemCase = form.inputPartReplacerOriginalSystemCase.value
    var originalSystemM2 = form.inputPartReplacerOriginalSystemM2.value

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

    if (!data.cpus[originalSystemCpu]) {
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
            alert("GPU 1 does not support Multi-GPU.")
        }
        return false
    }
    if (originalSystemGpu1 != "" && originalSystemGpu2 != "" && data.gpus[originalSystemGpu2].multiGPU == null) {
        if (showAlerts) {
            alert("GPU 2 does not support Multi-GPU.")
        }
        return false
    }

    if (!moboSupportsCpu(originalSystemMobo, originalSystemCpu)) {
        if (showAlerts) {
            alert("Selected CPU and Motherboard are incompatible.")
        }
        return false
    }

    if (originalSystemGpu1 != "" &&
        originalSystemGpu2 != "" &&
        !moboSupportsGpu(originalSystemMobo, originalSystemGpu1, 2)
    ) {
        if (showAlerts) {
            alert("Motherboard does not support this Multi-GPU type.")
        }
        return false
    }

    if (originalSystemCase != "") {
        if (!data.pcCases[originalSystemCase]) {
            if (showAlerts) {
                alert("Case not found.")
            }
            return false
        }
        if (!caseSupportsMobo(originalSystemCase, originalSystemMobo)) {
            if (showAlerts) {
                alert("Case does not support motherboard.")
            }
            return false
        }
        if (originalSystemGpu1 != "" && !caseSupportsGpu(originalSystemCase, originalSystemGpu1, 1)) {
            if (showAlerts) {
                alert("Case does not support GPU 1.")
            }
            return false
        }
        if (originalSystemGpu2 != "" && !caseSupportsGpu(originalSystemCase, originalSystemGpu2, 1)) {
            if (showAlerts) {
                alert("Case does not support GPU 2.")
            }
            return false
        }
        if (originalSystemGpu1 != "" && originalSystemGpu2 != "" && !caseSupportsGpu(originalSystemCase, originalSystemGpu1, 2)) {
            if (showAlerts) {
                alert("Case does not support these GPUs.")
            }
            return false
        }
    }
    if (originalSystemM2 != "") {
        if (!data.storages[originalSystemM2]) {
            if (showAlerts) {
                alert("M.2 not found.")
            }
            return false
        }
        if (!moboSupportsM2(originalSystemMobo, originalSystemM2)) {
            if (showAlerts) {
                alert("Motheboard does not support this M.2.")
            }
            return false
        }
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
                        for (newCpu in data.cpus) {
                            if (replaceGpu1) {
                                for (newGpu1 in data.gpus) {
                                    if (replaceGpu2) {
                                        for (newGpu2 in data.gpus) {
                                            if (replaceMobo) {
                                                for (newMobo in data.mobos) {
                                                    pushPartReplacerSolutionIfValid(
                                                        budgetTotal, budgetReserved, level, originalSystemCase, originalSystemM2,
                                                        originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                        originalSystemCpu, newCpu, originalSystemGpu1, newGpu1, originalSystemGpu2, newGpu2, originalSystemMobo, newMobo)
                                                }
                                            }
                                            else {
                                                pushPartReplacerSolutionIfValid(
                                                    budgetTotal, budgetReserved, level, originalSystemCase, originalSystemM2,
                                                    originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                    originalSystemCpu, newCpu, originalSystemGpu1, newGpu1, originalSystemGpu2, newGpu2, originalSystemMobo, "")
                                            }
                                        }
                                    }
                                    else {
                                        if (replaceMobo) {
                                            for (newMobo in data.mobos) {
                                                pushPartReplacerSolutionIfValid(
                                                    budgetTotal, budgetReserved, level, originalSystemCase, originalSystemM2,
                                                    originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                    originalSystemCpu, newCpu, originalSystemGpu1, newGpu1, originalSystemGpu2, "", originalSystemMobo, newMobo)
                                            }
                                        }
                                        else {
                                            pushPartReplacerSolutionIfValid(
                                                budgetTotal, budgetReserved, level, originalSystemCase, originalSystemM2,
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
                                            for (newMobo in data.mobos) {
                                                pushPartReplacerSolutionIfValid(
                                                    budgetTotal, budgetReserved, level, originalSystemCase, originalSystemM2,
                                                    originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                    originalSystemCpu, newCpu, originalSystemGpu1, "", originalSystemGpu2, newGpu2, originalSystemMobo, newMobo)
                                            }
                                        }
                                        else {
                                            pushPartReplacerSolutionIfValid(
                                                budgetTotal, budgetReserved, level, originalSystemCase, originalSystemM2,
                                                originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                originalSystemCpu, newCpu, originalSystemGpu1, "", originalSystemGpu2, newGpu2, originalSystemMobo, "")
                                        }
                                    }
                                }
                                else {
                                    if (replaceMobo) {
                                        for (newMobo in data.mobos) {
                                            pushPartReplacerSolutionIfValid(
                                                budgetTotal, budgetReserved, level, originalSystemCase, originalSystemM2,
                                                originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                originalSystemCpu, newCpu, originalSystemGpu1, "", originalSystemGpu2, "", originalSystemMobo, newMobo)
                                        }
                                    }
                                    else {
                                        pushPartReplacerSolutionIfValid(
                                            budgetTotal, budgetReserved, level, originalSystemCase, originalSystemM2,
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
                                            for (newMobo in data.mobos) {
                                                pushPartReplacerSolutionIfValid(
                                                    budgetTotal, budgetReserved, level, originalSystemCase, originalSystemM2,
                                                    originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                    originalSystemCpu, "", originalSystemGpu1, newGpu1, originalSystemGpu2, newGpu2, originalSystemMobo, newMobo)
                                            }
                                        }
                                        else {
                                            pushPartReplacerSolutionIfValid(
                                                budgetTotal, budgetReserved, level, originalSystemCase, originalSystemM2,
                                                originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                originalSystemCpu, "", originalSystemGpu1, newGpu1, originalSystemGpu2, newGpu2, originalSystemMobo, "")
                                        }
                                    }
                                }
                                else {
                                    if (replaceMobo) {
                                        for (newMobo in data.mobos) {
                                            pushPartReplacerSolutionIfValid(
                                                budgetTotal, budgetReserved, level, originalSystemCase, originalSystemM2,
                                                originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                originalSystemCpu, "", originalSystemGpu1, newGpu1, originalSystemGpu2, "", originalSystemMobo, newMobo)
                                        }
                                    }
                                    else {
                                        pushPartReplacerSolutionIfValid(
                                            budgetTotal, budgetReserved, level, originalSystemCase, originalSystemM2,
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
                                        for (newMobo in data.mobos) {
                                            pushPartReplacerSolutionIfValid(
                                                budgetTotal, budgetReserved, level, originalSystemCase, originalSystemM2,
                                                originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                originalSystemCpu, "", originalSystemGpu1, "", originalSystemGpu2, newGpu2, originalSystemMobo, newMobo)
                                        }
                                    }
                                    else {
                                        pushPartReplacerSolutionIfValid(
                                            budgetTotal, budgetReserved, level, originalSystemCase, originalSystemM2,
                                            originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                            originalSystemCpu, "", originalSystemGpu1, "", originalSystemGpu2, newGpu2, originalSystemMobo, "")
                                    }
                                }
                            }
                            else {
                                if (replaceMobo) {
                                    for (newMobo in data.mobos) {
                                        pushPartReplacerSolutionIfValid(
                                            budgetTotal, budgetReserved, level, originalSystemCase, originalSystemM2,
                                            originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                            originalSystemCpu, "", originalSystemGpu1, "", originalSystemGpu2, "", originalSystemMobo, newMobo)
                                    }
                                }
                                else {
                                    pushPartReplacerSolutionIfValid(
                                        budgetTotal, budgetReserved, level, originalSystemCase, originalSystemM2,
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
    resetResultsTable(table, results.length, tableCells)

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
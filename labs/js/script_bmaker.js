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
    if (!isLevelSet()) {
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
        if (!isLevelUnlocked(data.cpus[cpu].level)) {
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
            if (!isLevelUnlocked(data.gpus[gpu].level)) {
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
                                if (!isLevelUnlocked(data.mobos[mobo].level)) {
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
                                if (!isLevelUnlocked(data.rams[ram].level)) {
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
                                if (!isLevelUnlocked(data.mobos[mobo].level)) {
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
                                        if (!isLevelUnlocked(data.rams[ram].level)) {
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
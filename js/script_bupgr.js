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
    if (!isLevelSet()) {
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
        } else if (!isLevelUnlocked(data.cpus[cpu].level)) {
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
        } else if (!isLevelUnlocked(data.cpus[cpu].level)) {
            continue
        }

        ramChannel = Math.min(originalSystemRamSticks, data.cpus[cpu].maxMemoryChannels)

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
        if (!isLevelUnlocked(data.mobos[mobo].level)) {
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
            } else if (!isLevelUnlocked(data.cpus[cpu].level)) {
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
        if (!isLevelUnlocked(data.mobos[mobo].level)) {
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
        if (!isLevelUnlocked(data.mobos[mobo].level)) {
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
            } else if (!isLevelUnlocked(data.cpus[cpu].level)) {
                continue
            }

            ramChannel = Math.min(originalSystemRamSticks, data.cpus[cpu].maxMemoryChannels)

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
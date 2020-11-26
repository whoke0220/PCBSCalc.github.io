var partReplacerSolutions
        function PartReplacerGetParts() {
            var showAlerts = true

            var form = document.getElementById('formPartReplacer')
            var table = document.getElementById('tablePartReplacerResults')
            var tableCells = 9
            resetResultsTable(table, 0, tableCells)

            var budgetTotal = Number(form.inputPartReplacerBudget.value)
            var budgetReserved = numberOrDefault(form.inputPartReplacerReservedBudget.value, 0)
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
                                                                budgetTotal, budgetReserved, originalSystemCase, originalSystemM2,
                                                                originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                                originalSystemCpu, newCpu, originalSystemGpu1, newGpu1, originalSystemGpu2, newGpu2, originalSystemMobo, newMobo)
                                                        }
                                                    }
                                                    else {
                                                        pushPartReplacerSolutionIfValid(
                                                            budgetTotal, budgetReserved, originalSystemCase, originalSystemM2,
                                                            originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                            originalSystemCpu, newCpu, originalSystemGpu1, newGpu1, originalSystemGpu2, newGpu2, originalSystemMobo, "")
                                                    }
                                                }
                                            }
                                            else {
                                                if (replaceMobo) {
                                                    for (newMobo in data.mobos) {
                                                        pushPartReplacerSolutionIfValid(
                                                            budgetTotal, budgetReserved, originalSystemCase, originalSystemM2,
                                                            originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                            originalSystemCpu, newCpu, originalSystemGpu1, newGpu1, originalSystemGpu2, "", originalSystemMobo, newMobo)
                                                    }
                                                }
                                                else {
                                                    pushPartReplacerSolutionIfValid(
                                                        budgetTotal, budgetReserved, originalSystemCase, originalSystemM2,
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
                                                            budgetTotal, budgetReserved, originalSystemCase, originalSystemM2,
                                                            originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                            originalSystemCpu, newCpu, originalSystemGpu1, "", originalSystemGpu2, newGpu2, originalSystemMobo, newMobo)
                                                    }
                                                }
                                                else {
                                                    pushPartReplacerSolutionIfValid(
                                                        budgetTotal, budgetReserved, originalSystemCase, originalSystemM2,
                                                        originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                        originalSystemCpu, newCpu, originalSystemGpu1, "", originalSystemGpu2, newGpu2, originalSystemMobo, "")
                                                }
                                            }
                                        }
                                        else {
                                            if (replaceMobo) {
                                                for (newMobo in data.mobos) {
                                                    pushPartReplacerSolutionIfValid(
                                                        budgetTotal, budgetReserved, originalSystemCase, originalSystemM2,
                                                        originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                        originalSystemCpu, newCpu, originalSystemGpu1, "", originalSystemGpu2, "", originalSystemMobo, newMobo)
                                                }
                                            }
                                            else {
                                                pushPartReplacerSolutionIfValid(
                                                    budgetTotal, budgetReserved, originalSystemCase, originalSystemM2,
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
                                                            budgetTotal, budgetReserved, originalSystemCase, originalSystemM2,
                                                            originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                            originalSystemCpu, "", originalSystemGpu1, newGpu1, originalSystemGpu2, newGpu2, originalSystemMobo, newMobo)
                                                    }
                                                }
                                                else {
                                                    pushPartReplacerSolutionIfValid(
                                                        budgetTotal, budgetReserved, originalSystemCase, originalSystemM2,
                                                        originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                        originalSystemCpu, "", originalSystemGpu1, newGpu1, originalSystemGpu2, newGpu2, originalSystemMobo, "")
                                                }
                                            }
                                        }
                                        else {
                                            if (replaceMobo) {
                                                for (newMobo in data.mobos) {
                                                    pushPartReplacerSolutionIfValid(
                                                        budgetTotal, budgetReserved, originalSystemCase, originalSystemM2,
                                                        originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                        originalSystemCpu, "", originalSystemGpu1, newGpu1, originalSystemGpu2, "", originalSystemMobo, newMobo)
                                                }
                                            }
                                            else {
                                                pushPartReplacerSolutionIfValid(
                                                    budgetTotal, budgetReserved, originalSystemCase, originalSystemM2,
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
                                                        budgetTotal, budgetReserved, originalSystemCase, originalSystemM2,
                                                        originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                        originalSystemCpu, "", originalSystemGpu1, "", originalSystemGpu2, newGpu2, originalSystemMobo, newMobo)
                                                }
                                            }
                                            else {
                                                pushPartReplacerSolutionIfValid(
                                                    budgetTotal, budgetReserved, originalSystemCase, originalSystemM2,
                                                    originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                    originalSystemCpu, "", originalSystemGpu1, "", originalSystemGpu2, newGpu2, originalSystemMobo, "")
                                            }
                                        }
                                    }
                                    else {
                                        if (replaceMobo) {
                                            for (newMobo in data.mobos) {
                                                pushPartReplacerSolutionIfValid(
                                                    budgetTotal, budgetReserved, originalSystemCase, originalSystemM2,
                                                    originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
                                                    originalSystemCpu, "", originalSystemGpu1, "", originalSystemGpu2, "", originalSystemMobo, newMobo)
                                            }
                                        }
                                        else {
                                            pushPartReplacerSolutionIfValid(
                                                budgetTotal, budgetReserved, originalSystemCase, originalSystemM2,
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
        function pushPartReplacerSolutionIfValid(
            budgetTotal, budgetReserved, originalSystemCase, originalSystemM2,
            originalSystemCpuPartStatus, originalSystemGpu1PartStatus, originalSystemGpu2PartStatus, originalSystemMoboPartStatus,
            originalSystemCpu, newCpu, originalSystemGpu1, newGpu1, originalSystemGpu2, newGpu2, originalSystemMobo, newMobo
        ) {
            var budgetForParts = budgetTotal - budgetReserved
            var partsCost = 0
            var newGpu1Type = ""
            var newGpu2Type = ""
            if (newCpu != "") {
                if (!isLevelUnlocked(data.cpus[newCpu].level)) {
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
                if (!isLevelUnlocked(data.gpus[newGpu1].level)) {
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
                if (!isLevelUnlocked(data.gpus[newGpu2].level)) {
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
                if (!isLevelUnlocked(data.mobos[newMobo].level)) {
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

            partReplacerSolutions.push(partsForReplacer(newCpu, newGpu1Type, newGpu1, newGpu2Type, newGpu2, newMobo, budgetTotal, budgetReserved, partsCost, budgetTotal - partsCost, getSystemWattsExactParts(evalCpu, evalGpu1, evalGpu2)))
        }
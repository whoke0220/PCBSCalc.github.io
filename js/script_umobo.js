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
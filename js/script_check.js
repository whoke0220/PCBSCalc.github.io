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
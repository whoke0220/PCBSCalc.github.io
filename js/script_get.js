function getCaseOptions() {
    var pcCases = new Array()
    for (pcCase in data.pcCases) {
        pcCases.push(data.pcCases[pcCase].fullName)
    }
    pcCases =
        pcCases.sort(function (a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        })
    var options = '';
    for (var i = 0; i < pcCases.length; i++) {
        options += '<option value="' + pcCases[i] + '" />'
    }
    return options
}
function getMoboOptions(preselectedValue) {
    var mobos = new Array()
    for (mobo in data.mobos) {
        mobos.push(data.mobos[mobo].fullName)
    }
    mobos =
        mobos.sort(function (a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        })
    var options = '';
    for (var i = 0; i < mobos.length; i++) {
        options += '<option' + (mobos[i] == preselectedValue ? ' selected' : '') + '>' + mobos[i] + '</option>'
    }
    return options
}
function getStorageM2Options() {
    var storageM2s = new Array()
    for (storage in data.storages) {
        if (data.storages[storage].type == "M2") {
            storageM2s.push(data.storages[storage].fullName)
        }
    }
    storageM2s =
        storageM2s.sort(function (a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        })
    var options = '';
    for (var i = 0; i < storageM2s.length; i++) {
        options += '<option value="' + storageM2s[i] + '" />'
    }
    return options
}
function getCpuOptions() {
    var cpus = new Array()
    for (cpu in data.cpus) {
        cpus.push(data.cpus[cpu].fullName)
    }
    cpus =
        cpus.sort(function (a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        })
    var options = '';
    for (var i = 0; i < cpus.length; i++) {
        options += '<option value="' + cpus[i] + '" />'
    }
    return options
}
function getCpuSocketSortValue(cpuSocket) {
    var value
    switch (cpuSocket) {
        case "AM4":
            value = 1
            break
        case "TR4":
            value = 2
            break
        case "sTRX4":
            value = 3
            break
        case "FM2+":
            value = 4
            break
        case "LGA 2011-V3":
            value = 5
            break
        case "LGA 1151 (Skylake)":
            value = 6
            break
        case "LGA 1151 (Kaby Lake)":
            value = 7
            break
        case "LGA 1151 (Coffee Lake)":
            value = 8
            break
        case "LGA 1200":
            value = 9
            break
        case "LGA 2066":
            value = 10
            break
        case "FM2":
            value = 11
            break
        default:
            value = 0
            break
    }
    return value
}
function getCpuSocketOptions(includeAnyOption) {
    var cpuSockets = new Array()
    for (cpu in data.cpus) {
        if (!cpuSockets.includes(data.cpus[cpu].cpuSocket)) {
            cpuSockets.push(data.cpus[cpu].cpuSocket)
        }
    }
    cpuSockets =
        cpuSockets.sort(function (a, b) {
            return getCpuSocketSortValue(a) > getCpuSocketSortValue(b)
        });

    var options = '';
    if (includeAnyOption) {
        options += '<option value="Any" selected>Any</option>'
    }

    var optionText = new Array()
    for (var i = 0; i < cpuSockets.length; i++) {
        value = cpuSockets[i]
        var name
        switch (value) {
            case "AM4":
                name = "AMD - AM4 (Ryzen)"
                break
            case "TR4":
                name = "AMD - TR4 (1st/2nd Gen Threadripper)"
                break
            case "sTRX4":
                name = "AMD - sTRX4 (3rd+ Gen Threadripper)"
                break
            case "FM2+":
                name = "[HEM] AMD - FM2+ (Used for EPYC CPUs in-game)"
                break
            case "LGA 2011-V3":
                name = "[HEM] Intel - LGA 2011 V3 (Haswell-E, Haswell-EP)"
                break
            case "LGA 1151 (Skylake)":
                name = "Intel - LGA 1151 (Skylake)"
                break
            case "LGA 1151 (Kaby Lake)":
                name = "Intel - LGA 1151 (Kaby Lake)"
                break
            case "LGA 1151 (Coffee Lake)":
                name = "Intel - LGA 1151 (Coffee Lake)"
                break
            case "LGA 1200":
                name = "Intel - LGA 1200"
                break
            case "LGA 2066":
                name = "Intel - LGA 2066 (X-Series)"
                break
            case "FM2":
                name = "[HEM] Intel - FM2 (Used for Intel XEON CPUs in-game)"
                break
            default:
                name = "MISSING NAME: " + value
                break
        }
        optionText.push('<option value="' + value + '">' + name + '</option>')
    }
    for (var i = 0; i < optionText.length; i++) {
        options += optionText[i]
    }

    return options
}
function getGpuOptions() {
    var gpus = new Array()
    for (gpu in data.gpus) {
        gpus.push(data.gpus[gpu].fullName)
    }
    gpus =
        gpus.sort(function (a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        })
    var options = '';
    for (var i = 0; i < gpus.length; i++) {
        options += '<option value="' + gpus[i] + '" />'
    }
    return options
}
function getRamOptions(preselectedValue) {
    var ramSpeeds = new Array()
    var motherboardSpeedSteps
    for (mobo in data.mobos) {
        motherboardSpeedSteps = data.mobos[mobo].memorySpeedSteps
        for (var i = 0; i < motherboardSpeedSteps.length; i++) {
            if (!ramSpeeds.includes(data.mobos[mobo].memorySpeedSteps[i])) {
                ramSpeeds.push(data.mobos[mobo].memorySpeedSteps[i])
            }
        }
    }
    ramSpeeds =
        ramSpeeds.sort()
    var options = '';
    for (var i = 0; i < ramSpeeds.length; i++) {
        options += '<option' + (ramSpeeds[i] == preselectedValue ? ' selected' : '') + '>' + ramSpeeds[i] + '</option>'
    }
    return options
}
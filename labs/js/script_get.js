function getCPUDataListOptions() {
    var cpus = new Array()
    for (cpu in data.procs) {
        cpus.push(data.procs[cpu].fullName)
    }
    cpus = cpus.sort()
    var options = '';
    for (var i = 0; i < cpus.length; i++) {
        options += '<option value="' + cpus[i] + '" />'
    }
    return options
}
function getGPUDataListOptions() {
    var gpus = new Array()
    for (gpu in data.gpus) {
        gpus.push(data.gpus[gpu].fullName)
    }
    gpus = gpus.sort()
    var options = '';
    for (var i = 0; i < gpus.length; i++) {
        options += '<option value="' + gpus[i] + '" />'
    }
    return options
}
function getMoboDataListOptions() {
    var mobos = new Array()
    for (mobo in data.motherboards) {
        mobos.push(data.motherboards[mobo].fullName)
    }
    mobos = mobos.sort()
    var options = '';
    for (var i = 0; i < mobos.length; i++) {
        options += '<option value="' + mobos[i] + '" />'
    }
    return options
}
function getRAMSelectOptions(preselectedValue) {
    var ramSpeeds = new Array()
    var motherboardSpeedSteps
    for (mobo in data.motherboards) {
        motherboardSpeedSteps = data.motherboards[mobo].memorySpeedSteps
        for (var i = 0; i < motherboardSpeedSteps.length; i++) {
            if (!ramSpeeds.includes(data.motherboards[mobo].memorySpeedSteps[i])) {
                ramSpeeds.push(data.motherboards[mobo].memorySpeedSteps[i])
            }
        }
    }
    ramSpeeds = ramSpeeds.sort()
    var options = '';
    for (var i = 0; i < ramSpeeds.length; i++) {
        options += '<option' + (ramSpeeds[i] == preselectedValue ? ' selected' : '') + '>' + ramSpeeds[i] + '</option>'
    }
    return options
}
function getMoboSelectOptions(preselectedValue) {
    var mobos = new Array()
    for (mobo in data.motherboards) {
        mobos.push(data.motherboards[mobo].fullName)
    }
    mobos = mobos.sort()
    var options = '';
    for (var i = 0; i < mobos.length; i++) {
        options += '<option' + (mobos[i] == preselectedValue ? ' selected' : '') + '>' + mobos[i] + '</option>'
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
        case "LGA 2066":
            value = 9
            break
        default:
            value = 0
            break
    }
    return value
}
function getCPUSocketSelectOptions(includeAnyOption) {
    var cpuSockets = new Array()
    for (cpu in data.procs) {
        if (!cpuSockets.includes(data.procs[cpu].cpuSocket)) {
            cpuSockets.push(data.procs[cpu].cpuSocket)
        }
    }
    cpuSockets = cpuSockets.sort(function (a, b) {
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
                name = "AMD - FM2+ (Used for EPYC CPUs in-game)"
                break
            case "LGA 2011-V3":
                name = "Intel - LGA 2011 V3 (Haswell-E, Haswell-EP)"
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
            case "LGA 2066":
                name = "Intel - LGA 2066 (X-Series)"
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

function setDataListOptions() {
    document.getElementById('cpuList').innerHTML = getCPUDataListOptions()
    document.getElementById('gpuList').innerHTML = getGPUDataListOptions()
    document.getElementById('mobolist').innerHTML = getMoboDataListOptions()
}

var initialLoad = true
function setSelectOptions() {
    x1 = document.getElementById('scoreCForm').rams1.value
    document.getElementById('scoreCForm').rams1.innerHTML = getRAMSelectOptions((initialLoad ? 2133 : 0))
    if (!initialLoad) {
        document.getElementById('scoreCForm').rams1.value = x1
    }

    x2 = document.getElementById('buildForm').selectedCPUSocket1.value
    document.getElementById('buildForm').selectedCPUSocket1.innerHTML = getCPUSocketSelectOptions(true)
    if (!initialLoad) {
        document.getElementById('buildForm').selectedCPUSocket1.value = x2
    }

    x3 = document.getElementById('upgradeForm').currentRamS1.value
    document.getElementById('upgradeForm').currentRamS1.innerHTML = getRAMSelectOptions((initialLoad ? 2133 : 0))
    if (!initialLoad) {
        document.getElementById('upgradeForm').currentRamS1.value = x3
    }

    x4 = document.getElementById('upgradeForm').currentMobo1.value
    document.getElementById('upgradeForm').currentMobo1.innerHTML = getMoboSelectOptions(initialLoad ? "GIGABYTE B450 AORUS M" : "")
    if (!initialLoad) {
        document.getElementById('upgradeForm').currentMobo1.value = x4
    }

    x5 = document.getElementById('partFixerForm').motherboardPartFixer.value
    document.getElementById('partFixerForm').motherboardPartFixer.innerHTML = getMoboSelectOptions("")
    if (!initialLoad) {
        document.getElementById('partFixerForm').motherboardPartFixer.value = x5
    }
}

// Set Options on first load
setDataListOptions()
setSelectOptions()

// Store that we loaded
initialLoad = false
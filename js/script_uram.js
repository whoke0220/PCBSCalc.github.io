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
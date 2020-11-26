function getSystemWattsExactParts(cpu, gpu1, gpu2) {
    var systemWatts = 30
    if (cpu != "" && data.cpus[cpu] != null) {
        systemWatts += data.cpus[cpu].wattage
    }
    if (gpu1 != "" && data.gpus[gpu1] != null) {
        systemWatts += data.gpus[gpu1].wattage
    }
    if (gpu2 != "" && data.gpus[gpu2] != null) {
        systemWatts += data.gpus[gpu2].wattage
    }
    return systemWatts
}
function getSystemWatts(cpu, gpu, gpuCount) {
    return getSystemWattsExactParts(cpu, gpu, gpuCount == 2 ? gpu : "")
}
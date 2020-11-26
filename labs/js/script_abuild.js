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
function pushBuildForCases(builds, includeCases, cpu, ramChannel, ramSpeed, ram, gpuCount, gpuType, gpu, mobo, budgetTotal, budgetReserved, buildCost, score, systemWatts) {
    if (!includeCases) {
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
function CalculatorCalculate() {
    var showAlerts = true

    var form = document.getElementById('form3DMarkScoreCalculator')

    var selectedCpu = form.input3DMarkCpu.value
    var selectedRamSpeed = form.select3DMarkRamSpeed.value
    var selectedRamChannel = form.select3DMarkRamChannel.value
    var selectedGpu = form.input3DMarkGpu.value
    var selectedGpuCount = form.select3DMarkGpuCount.value

    if (!data.cpus[selectedCpu]) {
        if (showAlerts) {
            alert("CPU not found.")
        }
        return false
    }
    if (selectedRamChannel > data.cpus[selectedCpu].maxMemoryChannels) {
        if (showAlerts) {
            alert("CPU only supports " + data.cpus[selectedCpu].maxMemoryChannels + " RAM Channels.")
        }
        return false
    }
    if (!data.gpus[selectedGpu]) {
        if (showAlerts) {
            alert("GPU not found.")
        }
        return false
    }
    if (selectedGpuCount == "2" &&
        data.gpus[selectedGpu].multiGPU == null) {
        if (showAlerts) {
            alert("Selected GPU does not support multi-GPU.")
        }
        return false
    }

    var calculatorCpuScore = getCpuScore(selectedCpu, selectedRamChannel, selectedRamSpeed)
    var calculatorGpuScore = getGpuScore(selectedGpu, selectedGpuCount)
    var calculatorSystemScore = getSystemScore(calculatorCpuScore, calculatorGpuScore)
    var calculatorGpuType = data.gpus[selectedGpu].gpuType
    var calculatorSystemWatts = getSystemWatts(selectedCpu, selectedGpu, selectedGpuCount)
    var calculatorCpuPriceNew = data.cpus[selectedCpu].price
    var calculatorCpuPriceUsed = data.cpus[selectedCpu].sellPrice
    var calculatorGpusPriceNew = selectedGpuCount * data.gpus[selectedGpu].price
    var calculatorGpusPriceUsed = selectedGpuCount * data.gpus[selectedGpu].sellPrice

    document.getElementById('td3DMarkCpuScore').innerText = calculatorCpuScore
    document.getElementById('td3DMarkGpuScore').innerText = calculatorGpuScore
    document.getElementById('td3DMarkSystemScore').innerText = calculatorSystemScore
    document.getElementById('td3DMarkGpuType').innerText = calculatorGpuType
    document.getElementById('td3DMarkSystemWatts').innerText = calculatorSystemWatts
    document.getElementById('td3DMarkCpuPriceNew').innerText = calculatorCpuPriceNew
    document.getElementById('td3DMarkCpuPriceUsed').innerText = calculatorCpuPriceUsed
    document.getElementById('td3DMarkGpusPriceNew').innerText = calculatorGpusPriceNew
    document.getElementById('td3DMarkGpusPriceUsed').innerText = calculatorGpusPriceUsed

    // Save Build to History
    var form = document.getElementById('form3DMarkScoreCalculator')
    saveBuild(
        '-',
        form.input3DMarkCpu.value,
        form.select3DMarkRamChannel.value,
        form.select3DMarkRamSpeed.value,
        '-',
        form.select3DMarkGpuCount.value,
        calculatorGpuType,
        form.input3DMarkGpu.value,
        '-',
        calculatorCpuPriceNew + calculatorGpusPriceNew,
        '-',
        calculatorSystemScore,
        calculatorSystemWatts,
        'div3DMarkScoreCalculatorForm',
        '-'
    )
}
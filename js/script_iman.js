function numberOrDefault(inputString, defaultValue) {
    var result = null
    if ((inputString != "") && (!isNaN(Number(inputString)))) {
        result = Number(inputString)
    }
    else {
        result = defaultValue
    }
    return result
}
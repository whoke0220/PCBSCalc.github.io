// By default, do not use HEM parts
var includeHemParts = false

// By default, do not include parts that are not in the shop
var includePartsNotInShop = false

var data
function setData() {
    data = {
        "cpus": {},
        "gpus": {},
        "mobos": {},
        "rams": {},
        "ramSpeeds": {},
        "pcCases": {},
        "storages": {}
    }
    for (cpu in sourceData.cpus) {
        if ((includeHemParts || !sourceData.cpus[cpu].isHEMPart) &&
            (includePartsNotInShop || sourceData.cpus[cpu].inShop == "Yes")) {
            data.cpus[cpu] = sourceData.cpus[cpu]
        }
    }
    for (gpu in sourceData.gpus) {
        if ((includeHemParts || !sourceData.gpus[gpu].isHEMPart) &&
            (includePartsNotInShop || sourceData.gpus[gpu].inShop == "Yes")) {
            data.gpus[gpu] = sourceData.gpus[gpu]
        }
    }
    for (mobo in sourceData.mobos) {
        if ((includeHemParts || !sourceData.mobos[mobo].isHEMPart) &&
            (includePartsNotInShop || sourceData.mobos[mobo].inShop == "Yes")) {
            data.mobos[mobo] = sourceData.mobos[mobo]
        }
    }
    for (ram in sourceData.rams) {
        if ((includeHemParts || !sourceData.rams[ram].isHEMPart) &&
            (includePartsNotInShop || sourceData.rams[ram].inShop == "Yes")) {
            data.rams[ram] = sourceData.rams[ram]
        }
    }

    if (includeHemParts) {
        data.ramSpeeds = sourceData.ramSpeeds["HEM"]
    } else {
        data.ramSpeeds = sourceData.ramSpeeds["Base"]
    }

    for (pcCase in sourceData.pcCases) {
        if ((includeHemParts || !sourceData.pcCases[pcCase].isHEMPart) &&
            (includePartsNotInShop || sourceData.pcCases[pcCase].inShop == "Yes")) {
            data.pcCases[pcCase] = sourceData.pcCases[pcCase]
        }
    }
    for (storage in sourceData.storages) {
        if ((includeHemParts || !sourceData.storages[storage].isHEMPart) &&
            (includePartsNotInShop || sourceData.storages[storage].inShop == "Yes")) {
            data.storages[storage] = sourceData.storages[storage]
        }
    }
}

// Set the data on first load
setData()
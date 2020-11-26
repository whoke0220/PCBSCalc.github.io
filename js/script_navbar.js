function showPage(id) {
    document.getElementById('div3DMarkScoreCalculator').style.display = ((id == 'div3DMarkScoreCalculator') ? "block" : "none")
    document.getElementById('divBuildMaker').style.display = ((id == 'divBuildMaker') ? "block" : "none")
    document.getElementById('divBuildUpgrader').style.display = ((id == 'divBuildUpgrader') ? "block" : "none")
    document.getElementById('divPartReplacer').style.display = ((id == 'divPartReplacer') ? "block" : "none")
    document.getElementById('divHistoryAndSaves').style.display = ((id == 'divHistoryAndSaves') ? "block" : "none")
}
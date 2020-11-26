var settingOptionsOnLoad = true
        function setListOptions() {
            document.getElementById('listCases').innerHTML = getCaseOptions()
            document.getElementById('listCpus').innerHTML = getCpuOptions()
            document.getElementById('listGpus').innerHTML = getGpuOptions()
            document.getElementById('listMobos').innerHTML = getMoboOptions("")
            document.getElementById('listStorageM2s').innerHTML = getStorageM2Options()
        }
        function setSelectOptions() {
            x1 = document.getElementById('form3DMarkScoreCalculator').select3DMarkRamSpeed.value
            document.getElementById('form3DMarkScoreCalculator').select3DMarkRamSpeed.innerHTML = getRamOptions((settingOptionsOnLoad ? 2133 : 0))
            if (!settingOptionsOnLoad) {
                document.getElementById('form3DMarkScoreCalculator').select3DMarkRamSpeed.value = x1
            }

            x2 = document.getElementById('formBuildMaker').selectBuildMakerCpuSocket.value
            document.getElementById('formBuildMaker').selectBuildMakerCpuSocket.innerHTML = getCpuSocketOptions(true)
            if (!settingOptionsOnLoad) {
                document.getElementById('formBuildMaker').selectBuildMakerCpuSocket.value = x2
            }

            x3 = document.getElementById('formBuildUpgrader').selectBuildUpgraderOriginalSystemRamSpeed.value
            document.getElementById('formBuildUpgrader').selectBuildUpgraderOriginalSystemRamSpeed.innerHTML = getRamOptions((settingOptionsOnLoad ? 2133 : 0))
            if (!settingOptionsOnLoad) {
                document.getElementById('formBuildUpgrader').selectBuildUpgraderOriginalSystemRamSpeed.value = x3
            }

            x4 = document.getElementById('formBuildUpgrader').selectBuildUpgraderOriginalSystemMobo.value
            document.getElementById('formBuildUpgrader').selectBuildUpgraderOriginalSystemMobo.innerHTML = getMoboOptions(settingOptionsOnLoad ? "GIGABYTE B450 AORUS M" : "")
            if (!settingOptionsOnLoad) {
                document.getElementById('formBuildUpgrader').selectBuildUpgraderOriginalSystemMobo.value = x4
            }

            x5 = document.getElementById('formPartReplacer').inputPartReplacerOriginalSystemMobo.value
            document.getElementById('formPartReplacer').inputPartReplacerOriginalSystemMobo.innerHTML = getMoboOptions("")
            if (!settingOptionsOnLoad) {
                document.getElementById('formPartReplacer').inputPartReplacerOriginalSystemMobo.value = x5
            }
        }

        // Set Options on first load
        setListOptions()
        setSelectOptions()

        // Update some Options on first load
        updateMoboOptionsBuildUpgrader()

        // Store that we set them
        settingOptionsOnLoad = false
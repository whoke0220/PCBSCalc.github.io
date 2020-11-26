var level = 0
        function updateLevel() {
            level = 0
            var levelString = document.getElementById('formLevel').inputLevel.value
            if (levelString != "" && !isNaN(Number(levelString))) {
                level = Number(levelString)
            }
        }
        function isLevelSet() {
            return level > 0
        }
        function isLevelUnlocked(levelToCheck) {
            return levelToCheck <= level
        }
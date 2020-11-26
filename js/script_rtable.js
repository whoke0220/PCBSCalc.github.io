function resetResultsTable(table, dataRowsNeeded, cellsNeeded) {

    // Delete all rows except the header
    for (i = table.rows.length - 1; i >= 1; i--) {
        table.deleteRow(i)
    }

    // Create data rows
    for (i = 1; i < dataRowsNeeded + 1; i++) {
        table.insertRow(i)

        // Create cells
        for (a = 0; a < cellsNeeded; a++) {
            table.rows[i].insertCell(a)
        }
    }
}
function getResultsLimitedAndSorted(builds, resultsRequested) {
    builds.sort(sortByCost)
    var results = []
    if (builds.length <= resultsRequested) {
        // Don't need to limit
        results = builds
    } else {
        // Select cheapest
        results.push(builds[0])
        builds[0].selected = true

        // Select most expensive
        results.push(builds[builds.length - 1])
        builds[builds.length - 1].selected = true

        // Get a random one
        var randomIndex
        var resultFound
        for (resultNumber = 3; resultNumber <= resultsRequested; resultNumber++) {

            // Get random index
            randomIndex = getRandomInt(1, builds.length - 2)

            resultFound = false

            // Try to find a build at that index or higher
            if (resultFound == false) {
                for (i = randomIndex; i < builds.length - 1; i++) {
                    if (builds[i].selected == false) {
                        resultFound = true

                        results.push(builds[i])
                        builds[i].selected = true

                        break
                    }
                }
            }

            // Try to find a build at that index or lower
            if (resultFound == false) {
                for (i = randomIndex - 1; i > 0; i--) {
                    if (builds[i].selected == false) {
                        resultFound = true

                        results.push(builds[i])
                        builds[i].selected = true

                        break
                    }
                }
            }
        }

        // Sort results
        results.sort(sortByCost)
    }

    // Return sorted results
    return results
}
function sortByCost(a, b) {
    if (a.cost < b.cost) {
        return -1;
    }
    if (a.cost > b.cost) {
        return 1;
    }
    return 0;
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
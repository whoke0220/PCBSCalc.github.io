function getCpuScoreOC(cpu, frequency, ramChannel, ramSpeed) {
            return Math.floor(
                (
                    (data.cpus[cpu].coreClockMultiplier * frequency) +
                    (data.cpus[cpu].memChannelsMultiplier * ramChannel) +
                    (data.cpus[cpu].memClockMultiplier * ramSpeed) +
                    (data.cpus[cpu].finalAdjustment)
                ) * 298
            )
        }
        function getCpuScore(cpu, ramChannel, ramSpeed) {
            return getCpuScoreOC(cpu, data.cpus[cpu].frequency, ramChannel, ramSpeed)
        }
        function getGpuScoreOC(gpu, gpuCount, coreFrequency, memFrequency) {

            var gt1CoreClockMultiplier
            var gt1MemClockMultiplier
            var gt1BenchmarkAdjustment
            var gt2CoreClockMultiplier
            var gt2MemClockMultiplier
            var gt2BenchmarkAdjustment

            if (gpuCount == "1") {
                gt1CoreClockMultiplier = data.gpus[gpu].GT1SingleCoreClockMultiplier
                gt1MemClockMultiplier = data.gpus[gpu].GT1SingleMemClockMultiplier
                gt1BenchmarkAdjustment = data.gpus[gpu].GT1SingleBenchmarkAdjustment
                gt2CoreClockMultiplier = data.gpus[gpu].GT2SingleCoreClockMultiplier
                gt2MemClockMultiplier = data.gpus[gpu].GT2SingleMemClockMultiplier
                gt2BenchmarkAdjustment = data.gpus[gpu].GT2SingleBenchmarkAdjustment
            } else if (gpuCount == "2") {
                gt1CoreClockMultiplier = data.gpus[gpu].GT1DualCoreClockMultiplier
                gt1MemClockMultiplier = data.gpus[gpu].GT1DualMemClockMultiplier
                gt1BenchmarkAdjustment = data.gpus[gpu].GT1DualBenchmarkAdjustment
                gt2CoreClockMultiplier = data.gpus[gpu].GT2DualCoreClockMultiplier
                gt2MemClockMultiplier = data.gpus[gpu].GT2DualMemClockMultiplier
                gt2BenchmarkAdjustment = data.gpus[gpu].GT2DualBenchmarkAdjustment
            }

            return Math.floor(
                164 /
                (
                    (
                        0.5 /
                        (
                            (gt1CoreClockMultiplier * coreFrequency) +
                            (gt1MemClockMultiplier * memFrequency) +
                            (gt1BenchmarkAdjustment)
                        )
                    ) +
                    (
                        0.5 /
                        (
                            (gt2CoreClockMultiplier * coreFrequency) +
                            (gt2MemClockMultiplier * memFrequency) +
                            (gt2BenchmarkAdjustment)
                        )
                    )
                )
            )
        }
        function getGpuScore(gpu, gpuCount) {
            if (gpuCount == "1") {
                return data.gpus[gpu].singleGPUGraphicsScore
            } else if (gpuCount == "2") {
                return data.gpus[gpu].doubleGPUGraphicsScore
            }
        }
        function getSystemScore(cpuScore, gpuScore) {
            return Math.floor(
                1 /
                (
                    (0.85 / gpuScore) +
                    (0.15 / cpuScore)
                )
            )
        }
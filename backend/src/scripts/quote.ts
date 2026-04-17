import YahooMarketDataRepository from "../core/repositories/implementations/external/YahooMarketDataRepository";

const ticker = process.argv[2] || "ARRI11";

async function main() {
    const repository = new YahooMarketDataRepository();
    const quote = await repository.getQuote(ticker);
    const chart = await repository.getChart(
        ticker,
        new Date(Date.now() - 24 * 60 * 60 * 1000),
        new Date(),
        "5m",
    );

    console.log(JSON.stringify({
        quote,
        chartPoints: chart.length,
        firstChartPoint: chart[0],
        lastChartPoint: chart[chart.length - 1],
    }, null, 2));
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});

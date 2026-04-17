import YahooFinance from "yahoo-finance2";

export type MarketInterval = "1m" | "2m" | "5m" | "15m" | "30m" | "60m" | "1d" | "1wk" | "1mo";

export interface IMarketQuote {
    symbol: string;
    ticker: string;
    name?: string;
    price?: number;
    previousClose?: number;
    currency?: string;
    exchange?: string;
    marketTime?: Date;
}

export interface IMarketChartPoint {
    date: Date;
    open?: number;
    high?: number;
    low?: number;
    close?: number;
    volume?: number;
}

interface YahooQuote {
    shortName?: string;
    longName?: string;
    regularMarketPrice?: number;
    regularMarketPreviousClose?: number;
    currency?: string;
    fullExchangeName?: string;
    regularMarketTime?: Date;
}

interface YahooChartPoint {
    date: Date;
    open?: number | null;
    high?: number | null;
    low?: number | null;
    close?: number | null;
    volume?: number | null;
}

interface YahooChartResult {
    quotes: YahooChartPoint[];
}

export default class YahooMarketDataRepository {
    private readonly yahooFinance = new YahooFinance({
        suppressNotices: ["yahooSurvey"],
    });

    private toYahooSymbol(ticker: string): string {
        const normalizedTicker = ticker.trim().toUpperCase();

        return normalizedTicker.endsWith(".SA") ? normalizedTicker : `${normalizedTicker}.SA`;
    }

    async getQuote(ticker: string): Promise<IMarketQuote> {
        const symbol = this.toYahooSymbol(ticker);
        const quote = await this.yahooFinance.quote(symbol) as YahooQuote;

        return {
            symbol,
            ticker: symbol.replace(".SA", ""),
            name: quote.shortName || quote.longName,
            price: quote.regularMarketPrice,
            previousClose: quote.regularMarketPreviousClose,
            currency: quote.currency,
            exchange: quote.fullExchangeName,
            marketTime: quote.regularMarketTime,
        };
    }

    async getChart(
        ticker: string,
        period1: Date,
        period2: Date,
        interval: MarketInterval = "5m",
    ): Promise<IMarketChartPoint[]> {
        const symbol = this.toYahooSymbol(ticker);
        const result = await this.yahooFinance.chart(symbol, {
            period1,
            period2,
            interval,
            return: "array",
        }) as YahooChartResult;

        return result.quotes.map((quote) => ({
            date: quote.date,
            open: quote.open || undefined,
            high: quote.high || undefined,
            low: quote.low || undefined,
            close: quote.close || undefined,
            volume: quote.volume || undefined,
        }));
    }
}

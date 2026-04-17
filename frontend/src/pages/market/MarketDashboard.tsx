import { useCallback, useEffect, useMemo, useState } from "react"
import { Activity, Clock3, ExternalLink, FileText, RefreshCw, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

const API_BASE_URL = "http://localhost:4000/api/v1"
const TICKER = "ARRI11"
const DOCUMENT_TICKER = "KNCR11"
const DOCUMENT_MONTH = "2026-03"
const REFRESH_INTERVAL_MS = 10 * 60 * 1000

interface ApiResponse<T> {
  data: T
  message: string
}

interface MarketQuote {
  symbol: string
  ticker: string
  name?: string
  price?: number
  previousClose?: number
  currency?: string
  exchange?: string
  marketTime?: string
}

interface MarketChartPoint {
  date: string
  open?: number
  high?: number
  low?: number
  close?: number
  volume?: number
}

interface FundDocument {
  id: string
  ticker: string
  fundName: string
  cnpj: string
  category: string
  type: string
  referenceDate: string
  deliveredAt: string
  source: string
  externalUrl: string
}

function formatCurrency(value?: number) {
  if (value === undefined) return "-"

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

function formatTime(value?: string) {
  if (!value) return "-"

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

function formatClock(value?: Date) {
  if (!value) return "-"

  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(value)
}

function formatDate(value?: string) {
  if (!value) return "-"

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value))
}

function getChangePercent(quote?: MarketQuote) {
  if (!quote?.price || !quote.previousClose) return undefined

  return ((quote.price - quote.previousClose) / quote.previousClose) * 100
}

function PriceChart({ points }: { points: MarketChartPoint[] }) {
  const chart = useMemo(() => {
    const values = points
      .map((point) => point.close)
      .filter((value): value is number => typeof value === "number")

    if (values.length < 2) return null

    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1
    const width = 900
    const height = 320
    const padding = 28

    const coordinates = values.map((value, index) => {
      const x = padding + (index / (values.length - 1)) * (width - padding * 2)
      const y = height - padding - ((value - min) / range) * (height - padding * 2)

      return `${x.toFixed(2)},${y.toFixed(2)}`
    })

    return {
      line: coordinates.join(" "),
      area: `${padding},${height - padding} ${coordinates.join(" ")} ${width - padding},${height - padding}`,
      min,
      max,
      first: values[0],
      last: values[values.length - 1],
    }
  }, [points])

  if (!chart) {
    return (
      <div className="flex h-80 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
        Aguardando pontos suficientes para montar o gráfico.
      </div>
    )
  }

  const positive = chart.last >= chart.first
  const strokeColor = positive ? "#047857" : "#dc2626"
  const fillColor = positive ? "rgba(16, 185, 129, 0.16)" : "rgba(239, 68, 68, 0.14)"

  return (
    <div className="h-80 rounded-lg border border-slate-200 bg-white p-4">
      <svg viewBox="0 0 900 320" className="h-full w-full" role="img" aria-label="Gráfico intraday de ARRI11">
        <defs>
          <linearGradient id="chartArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={fillColor} />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        <line x1="28" x2="872" y1="292" y2="292" stroke="#e2e8f0" strokeWidth="1" />
        <line x1="28" x2="872" y1="160" y2="160" stroke="#eef2f7" strokeWidth="1" />
        <line x1="28" x2="872" y1="28" y2="28" stroke="#eef2f7" strokeWidth="1" />
        <polygon points={chart.area} fill="url(#chartArea)" />
        <polyline points={chart.line} fill="none" stroke={strokeColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        <text x="32" y="22" fill="#64748b" fontSize="18">
          {formatCurrency(chart.max)}
        </text>
        <text x="32" y="312" fill="#64748b" fontSize="18">
          {formatCurrency(chart.min)}
        </text>
      </svg>
    </div>
  )
}

export default function MarketDashboard() {
  const [quote, setQuote] = useState<MarketQuote>()
  const [chartPoints, setChartPoints] = useState<MarketChartPoint[]>([])
  const [documents, setDocuments] = useState<FundDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [documentsError, setDocumentsError] = useState<string | null>(null)
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date>()

  const loadMarketData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const now = new Date()
      const from = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      const query = new URLSearchParams({
        from: from.toISOString(),
        to: now.toISOString(),
        interval: "5m",
      })

      const [quoteResponse, chartResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/market/quote/${TICKER}`),
        fetch(`${API_BASE_URL}/market/chart/${TICKER}?${query}`),
      ])

      if (!quoteResponse.ok || !chartResponse.ok) {
        throw new Error("Nao foi possivel consultar a cotacao agora.")
      }

      const quotePayload = await quoteResponse.json() as ApiResponse<MarketQuote>
      const chartPayload = await chartResponse.json() as ApiResponse<MarketChartPoint[]>

      setQuote(quotePayload.data)
      setChartPoints(chartPayload.data)
      setLastUpdatedAt(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido ao atualizar os dados.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadDocuments = useCallback(async () => {
    setIsLoadingDocuments(true)
    setDocumentsError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/funds/${DOCUMENT_TICKER}/documents?month=${DOCUMENT_MONTH}`)

      if (!response.ok) {
        throw new Error("Nao foi possivel carregar os documentos do fundo.")
      }

      const payload = await response.json() as ApiResponse<FundDocument[]>

      setDocuments(payload.data)
    } catch (err) {
      setDocumentsError(err instanceof Error ? err.message : "Erro desconhecido ao carregar documentos.")
    } finally {
      setIsLoadingDocuments(false)
    }
  }, [])

  useEffect(() => {
    loadMarketData()
    loadDocuments()

    const interval = window.setInterval(loadMarketData, REFRESH_INTERVAL_MS)

    return () => window.clearInterval(interval)
  }, [loadDocuments, loadMarketData])

  const changePercent = getChangePercent(quote)
  const positiveChange = (changePercent || 0) >= 0

  return (
    <main className="min-h-screen bg-[#f5f7f9] text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-8 md:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
                <Activity className="size-4" />
                Monitor em teste
              </div>
              <h1 className="text-4xl font-bold tracking-normal text-slate-950 md:text-5xl">
                {TICKER}
              </h1>
              <p className="mt-2 max-w-2xl text-base text-slate-600">
                {quote?.name || "Fundo imobiliario"} na {quote?.exchange || "B3"} com dados consultados via Yahoo Finance.
              </p>
            </div>

            <Button
              type="button"
              onClick={loadMarketData}
              disabled={isLoading}
              className="h-11 w-full bg-slate-950 px-5 text-white hover:bg-slate-800 md:w-auto"
            >
              <RefreshCw className={isLoading ? "animate-spin" : ""} />
              {isLoading ? "Atualizando" : "Atualizar agora"}
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <span className="text-sm text-slate-500">Preco atual</span>
              <strong className="mt-2 block text-2xl font-semibold">{formatCurrency(quote?.price)}</strong>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <span className="text-sm text-slate-500">Variacao</span>
              <strong className={`mt-2 block text-2xl font-semibold ${positiveChange ? "text-emerald-700" : "text-red-600"}`}>
                {changePercent === undefined ? "-" : `${positiveChange ? "+" : ""}${changePercent.toFixed(2)}%`}
              </strong>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <span className="text-sm text-slate-500">Fechamento anterior</span>
              <strong className="mt-2 block text-2xl font-semibold">{formatCurrency(quote?.previousClose)}</strong>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <span className="text-sm text-slate-500">Horario do mercado</span>
              <strong className="mt-2 block text-2xl font-semibold">{formatTime(quote?.marketTime)}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-5 px-5 py-6 md:px-8">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-semibold">Grafico intraday</h2>
              <p className="mt-1 text-sm text-slate-500">
                Intervalo de 5 minutos, recorte das ultimas 24 horas. Atualizacao automatica a cada 10 minutos.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <Clock3 className="size-4 text-slate-500" />
                Atualizado: {formatClock(lastUpdatedAt)}
              </span>
              <span className="inline-flex items-center gap-2">
                <TrendingUp className="size-4 text-slate-500" />
                {chartPoints.length} pontos
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <PriceChart points={chartPoints} />
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-slate-500">
                <FileText className="size-4" />
                CVM/FNET
              </div>
              <h2 className="text-xl font-semibold">Documentos de {DOCUMENT_TICKER}</h2>
              <p className="mt-1 text-sm text-slate-500">
                Comunicados entregues em {DOCUMENT_MONTH}. Por enquanto este bloco esta hardcoded para validar o formato.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={loadDocuments}
              disabled={isLoadingDocuments}
              className="h-10 w-full md:w-auto"
            >
              <RefreshCw className={isLoadingDocuments ? "animate-spin" : ""} />
              Atualizar documentos
            </Button>
          </div>

          {documentsError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {documentsError}
            </div>
          )}

          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="grid grid-cols-[120px_1fr_120px] gap-3 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500">
              <span>Data</span>
              <span>Tipo</span>
              <span className="text-right">Arquivo</span>
            </div>

            {isLoadingDocuments ? (
              <div className="px-4 py-6 text-sm text-slate-500">
                Carregando documentos...
              </div>
            ) : documents.length === 0 ? (
              <div className="px-4 py-6 text-sm text-slate-500">
                Nenhum documento encontrado para este mes.
              </div>
            ) : (
              documents.map((document) => (
                <div
                  key={document.id}
                  className="grid grid-cols-[120px_1fr_120px] items-center gap-3 border-t border-slate-200 px-4 py-4 text-sm"
                >
                  <span className="font-medium text-slate-900">{formatDate(document.deliveredAt)}</span>
                  <div>
                    <p className="font-medium text-slate-900">{document.type}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {document.category} - referencia {formatDate(document.referenceDate)}
                    </p>
                  </div>
                  <a
                    href={document.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-end gap-2 font-medium text-emerald-700 hover:text-emerald-900"
                  >
                    Abrir
                    <ExternalLink className="size-4" />
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

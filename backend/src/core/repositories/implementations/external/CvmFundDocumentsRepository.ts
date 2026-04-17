export interface IFundDocument {
    id: string;
    ticker: string;
    fundName: string;
    cnpj: string;
    category: string;
    type: string;
    referenceDate: string;
    deliveredAt: string;
    source: "CVM/FNET";
    externalUrl: string;
}

interface FindByMonthParams {
    ticker: string;
    month: string;
}

const hardcodedDocuments: IFundDocument[] = [
    {
        id: "1136630",
        ticker: "KNCR11",
        fundName: "Kinea Rendimentos Imobiliarios FII",
        cnpj: "16.706.958/0001-32",
        category: "Informes Periodicos",
        type: "Informe Mensal",
        referenceDate: "2026-02-01",
        deliveredAt: "2026-03-13T16:20:13.080-03:00",
        source: "CVM/FNET",
        externalUrl: "https://fnet.bmfbovespa.com.br/fnet/publico/exibirDocumento?cvm=true&id=1136630",
    },
];

export default class CvmFundDocumentsRepository {
    async findByMonth({ ticker, month }: FindByMonthParams): Promise<IFundDocument[]> {
        const normalizedTicker = ticker.trim().toUpperCase();

        return hardcodedDocuments.filter((document) => (
            document.ticker === normalizedTicker &&
            document.deliveredAt.startsWith(month)
        ));
    }
}

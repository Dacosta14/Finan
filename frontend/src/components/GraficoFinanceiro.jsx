import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function GraficoFinanceiro({ receitas, despesas }) {
  const eventos = [
    ...receitas.map((r) => ({ data: r.data, valor: Number(r.valor) })),
    ...despesas.map((d) => ({ data: d.data, valor: -Number(d.valor) })),
  ].sort((a, b) => new Date(a.data) - new Date(b.data));

  const pontos = eventos.reduce((resultado, e) => {
    const saldoAtual = (resultado.at(-1)?.saldo ?? 0) + e.valor;

    resultado.push({
      data: new Date(e.data).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      }),
      saldo: Number(saldoAtual.toFixed(2)),
    });

    return resultado;
  }, []);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart
        data={pontos}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="corSaldo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#27272A"
          vertical={false}
        />
        <XAxis dataKey="data" stroke="#A1A1AA" fontSize={12} />
        <YAxis stroke="#A1A1AA" fontSize={12} />
        <Tooltip
          contentStyle={{
            background: "#18181B",
            border: "1px solid #27272A",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#F4F4F5" }}
          formatter={(value) => [`R$ ${value.toFixed(2)}`, "Saldo"]}
        />
        <Area
          type="monotone"
          dataKey="saldo"
          stroke="#8B5CF6"
          strokeWidth={2}
          fill="url(#corSaldo)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default GraficoFinanceiro;

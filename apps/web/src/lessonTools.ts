import type { ActionWidget } from './product/interactiveCurriculumTypes';
const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
export function buildTool(widget: ActionWidget, values: Record<string, string | number>) {
  const number = (id: string) => Number(values[id]) || 0;
  const text = (id: string) => String(values[id] || '').trim();
  const entries = widget.fields.map(field => `${field.label.en}: ${field.kind === 'select' ? field.options.find(option => option.value === values[field.id])?.label.en || text(field.id) : text(field.id)}`);
  const ready = widget.fields.every(field => field.kind !== 'text' || text(field.id).length >= (field.minLength || 1));
  let headline = 'Your decision, written down';
  let detail = widget.instruction.en;
  let summary = entries.join('\n');
  if (widget.engine === 'etf_fee_drag') {
    const a = number('balance') * (1.08 - number('lowFee') / 100) ** 20;
    const b = number('balance') * (1.08 - number('highFee') / 100) ** 20;
    headline = money(Math.abs(a - b));
    detail = `Fund A: ${money(a)} · Fund B: ${money(b)}. Assumes a constant 8% gross annual return for 20 years, fees deducted annually, no taxes or further deposits. An illustration, not a forecast.`;
    summary = `Compare costs and diversification, not last month's winner.\n${entries.join('\n')}\nIllustrated fee difference: ${headline} over 20 years.`;
  } else if (widget.engine === 'dca_plan') {
    headline = money(number('monthly') * 12);
    detail = 'Annual contribution budget. Keep the monthly amount sustainable; this tool does not place an order or connect to a broker.';
    summary = `My monthly contribution intention: ${money(number('monthly'))}.\n${entries.join('\n')}\nReview affordability before setting a recurring transfer.`;
  } else if (widget.engine === 'risk_budget') {
    const loss = number('portfolio') * number('riskPct') / 100;
    headline = money(loss / Math.max(.001, number('stopPct') / 100));
    detail = `Illustrated position for a ${money(loss)} risk budget and ${number('stopPct')}% price move. Gaps, slippage and liquidity mean a stop does not guarantee the loss limit. This is not a trade recommendation.`;
    summary = `${entries.join('\n')}\nIllustrated position: ${headline}. Losses can exceed this model's budget; reassess before using real money.`;
  } else if (widget.engine === 'model_router') {
    headline = text('risk') === 'high' ? 'Model proposes. Human approves.' : text('ambiguity') === 'high' ? 'Reasoning with context' : 'Fast model, structured output';
    summary = `${entries.join('\n')}\nRoute to test: ${headline}`;
  } else if (widget.engine === 'workflow_map') {
    headline = 'Trigger → Transform → Action';
    summary = `${text('trigger')} → ${text('transform')} → ${text('action')}`;
  } else if (widget.engine === 'agent_guardrails') {
    headline = 'Permission before impact';
  } else if (widget.engine === 'prompt_builder') {
    headline = ready ? 'A prompt you can test' : 'Give the model a clear contract';
    detail = 'Your prompt stays here until you choose to copy it into another tool. This exercise does not call an AI provider.';
  }
  return { headline, detail, summary, ready };
}

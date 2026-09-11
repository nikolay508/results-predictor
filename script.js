const calculatorInputs = {
  language: document.querySelector("#language-select"),
  timeUnit: document.querySelector("#time-unit"),
  currency: document.querySelector("#currency-select"),
  revenue: document.querySelector("#revenue-target"),
  averageOrderValue: document.querySelector("#average-order-value"),
  leadResponseRate: document.querySelector("#lead-response-rate"),
  prospectResponseRate: document.querySelector("#prospect-response-rate"),
  customerChurnRate: document.querySelector("#customer-churn-rate"),
  variableCost: document.querySelector("#variable-cost"),
  fixedCosts: document.querySelector("#fixed-costs"),
  startingCost: document.querySelector("#starting-cost"),
  periods: document.querySelector("#period-count"),
};

const resultElements = {
  clients: document.querySelector("#clients-result"),
  leads: document.querySelector("#leads-result"),
  prospects: document.querySelector("#prospects-result"),
  summaryClients: document.querySelector("#summary-clients"),
  summaryLeads: document.querySelector("#summary-leads"),
  summaryProspects: document.querySelector("#summary-prospects"),
  summaryRevenue: document.querySelector("#summary-revenue"),
  summaryExpenses: document.querySelector("#summary-expenses"),
  summaryProfit: document.querySelector("#summary-profit"),
  summaryRetention: document.querySelector("#summary-retention"),
  summaryRoi: document.querySelector("#summary-roi"),
  summaryTimeUnit: document.querySelector("#summary-time-unit"),
  summaryPeriodCount: document.querySelector("#summary-period-count"),
  chartCaption: document.querySelector("#chart-caption"),
};

const outputElements = {
  revenue: document.querySelector("#revenue-target-output"),
  averageOrderValue: document.querySelector("#average-order-value-output"),
  leadResponseRate: document.querySelector("#lead-response-rate-output"),
  prospectResponseRate: document.querySelector("#prospect-response-rate-output"),
  customerChurnRate: document.querySelector("#customer-churn-rate-output"),
  variableCost: document.querySelector("#variable-cost-output"),
  fixedCosts: document.querySelector("#fixed-costs-output"),
  startingCost: document.querySelector("#starting-cost-output"),
};

let currentLocale = "en-US";
let currentCurrency = "USD";

function formatNumber(value) {
  return new Intl.NumberFormat(currentLocale, { maximumFractionDigits: 2 }).format(value);
}

function formatCurrency(value) {
  return new Intl.NumberFormat(currentLocale, {
    style: "currency",
    currency: currentCurrency,
    maximumFractionDigits: 2,
  }).format(value);
}

function getTimeUnitLabel() {
  const labels = { week: "week", month: "month", day: "day" };
  return labels[calculatorInputs.timeUnit.value] || labels.week;
}

function readPositiveNumber(input) {
  const value = Number(input.value);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function calculateCampaign({ revenue, averageOrderValue, leadResponseRate, prospectResponseRate }) {
  const clients = averageOrderValue > 0 ? revenue / averageOrderValue : 0;
  const leads = leadResponseRate > 0 ? clients * 100 / leadResponseRate : 0;
  const prospects = prospectResponseRate > 0 ? leads * 100 / prospectResponseRate : 0;

  return { clients, leads, prospects };
}

function calculateExpenses({ clients, revenue, customerChurnRate, variableCost, fixedCosts, startingCost, periods }) {
  const churnMultiplier = Math.pow(1 - customerChurnRate / 100, periods);
  const projectedCustomers = clients * churnMultiplier;
  const expenses = startingCost + fixedCosts + projectedCustomers * variableCost;
  const profit = revenue * churnMultiplier - expenses;
  const roi = expenses > 0 ? profit / expenses * 100 : 0;

  return { projectedCustomers, expenses, profit, roi, retention: periods * churnMultiplier };
}

function updateCalculator() {
  const values = {
    revenue: readPositiveNumber(calculatorInputs.revenue),
    averageOrderValue: readPositiveNumber(calculatorInputs.averageOrderValue),
    leadResponseRate: readPositiveNumber(calculatorInputs.leadResponseRate),
    prospectResponseRate: readPositiveNumber(calculatorInputs.prospectResponseRate),
    customerChurnRate: readPositiveNumber(calculatorInputs.customerChurnRate),
    variableCost: readPositiveNumber(calculatorInputs.variableCost),
    fixedCosts: readPositiveNumber(calculatorInputs.fixedCosts),
    startingCost: readPositiveNumber(calculatorInputs.startingCost),
    periods: Number(calculatorInputs.periods.value) || 0,
  };
  const results = calculateCampaign(values);
  const expenses = calculateExpenses({ ...values, clients: results.clients });

  outputElements.revenue.textContent = formatCurrency(values.revenue);
  outputElements.averageOrderValue.textContent = formatCurrency(values.averageOrderValue);
  outputElements.leadResponseRate.textContent = `${formatNumber(values.leadResponseRate)}%`;
  outputElements.prospectResponseRate.textContent = `${formatNumber(values.prospectResponseRate)}%`;
  outputElements.customerChurnRate.textContent = `${formatNumber(values.customerChurnRate)}%`;
  outputElements.variableCost.textContent = formatCurrency(values.variableCost);
  outputElements.fixedCosts.textContent = formatCurrency(values.fixedCosts);
  outputElements.startingCost.textContent = formatCurrency(values.startingCost);

  resultElements.clients.textContent = formatNumber(results.clients);
  resultElements.leads.textContent = formatNumber(results.leads);
  resultElements.prospects.textContent = formatNumber(results.prospects);
  resultElements.summaryClients.textContent = formatNumber(expenses.projectedCustomers);
  resultElements.summaryLeads.textContent = formatNumber(results.leads);
  resultElements.summaryProspects.textContent = formatNumber(results.prospects);
  resultElements.summaryRevenue.textContent = formatCurrency(values.revenue * Math.pow(1 - values.customerChurnRate / 100, values.periods));
  resultElements.summaryExpenses.textContent = formatCurrency(expenses.expenses);
  resultElements.summaryProfit.textContent = formatCurrency(expenses.profit);
  resultElements.summaryRetention.textContent = `${formatNumber(expenses.retention)} ${getTimeUnitLabel()}s`;
  resultElements.summaryRoi.textContent = `${formatNumber(expenses.roi)}%`;
  resultElements.summaryTimeUnit.textContent = getTimeUnitLabel();
  resultElements.summaryPeriodCount.textContent = formatNumber(values.periods);
  resultElements.chartCaption.textContent = getTimeUnitLabel();
}

Object.values(calculatorInputs).forEach((input) => input.addEventListener("input", updateCalculator));
calculatorInputs.language.addEventListener("change", () => {
  currentLocale = calculatorInputs.language.value;
  document.documentElement.lang = currentLocale.slice(0, 2);
  updateCalculator();
});
calculatorInputs.currency.addEventListener("change", () => {
  currentCurrency = calculatorInputs.currency.value;
  updateCalculator();
});
updateCalculator();

window.calculateCampaign = calculateCampaign;
window.calculateExpenses = calculateExpenses;
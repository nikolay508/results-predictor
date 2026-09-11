# Results Predictor

Results Predictor is a lightweight email campaign planning dashboard for estimating the audience, cost, and return needed to reach a revenue target.

It runs entirely in the browser with plain HTML, CSS, and JavaScript. There is no build step, backend, database, or package installation required.

## Features

- Set a target revenue and average order value.
- Estimate required clients, leads, and prospects from response rates.
- Model customer churn, variable costs, fixed costs, and starting costs.
- View projected revenue, expenses, profit, retention, and return on investment.
- Switch between week, month, and day planning periods.
- Format values using USD, EUR, or GBP.
- Switch the display locale between English, Spanish, and German.
- Responsive three-column dashboard layout that adapts to smaller screens.

<img width="1506" height="755" alt="Screenshot 2026-09-11 at 12 49 17" src="https://github.com/user-attachments/assets/3ac43b01-7618-4246-a62a-5223e6237a82" />

## Getting Started

### Run locally

No dependencies are needed. Open `index.html` directly in a browser, or serve the folder with any local static server:

```bash
python3 -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

### Use the calculator

1. Choose the language, time unit, number of periods, and currency.
2. Enter the revenue and campaign assumptions in the Revenue section.
3. Add churn and cost assumptions in the Expenses section.
4. Review the calculated campaign requirements and summary on the right.

All calculations update immediately as values change.

## Calculation Model

The calculator uses the following relationships:

```text
Required clients   = Target revenue / Average order value
Required leads     = Required clients * 100 / Lead response rate
Required prospects = Required leads * 100 / Prospect response rate
```

Projected customer count is adjusted for churn across the selected number of periods:

```text
Churn multiplier    = (1 - Customer churn rate / 100) ^ Number of periods
Projected customers = Required clients * Churn multiplier
Expenses            = Starting cost + Fixed costs + Projected customers * Variable cost
Profit              = Target revenue * Churn multiplier - Expenses
ROI                 = Profit / Expenses * 100
```

## Project Structure

| File | Purpose |
| --- | --- |
| `index.html` | Dashboard markup, controls, and accessible labels |
| `style.css` | Responsive layout, visual styling, and dashboard components |
| `script.js` | Input handling, calculations, formatting, and live updates |
| `final-result-expectation.png` | Reference visual for the expected dashboard result |

## Notes

- The app is currently client-side only; it does not persist input values.
- The chart is a visual dashboard element and is not connected to a charting library or historical data source.
- The Export data and Load data controls are currently interface placeholders.
- The logo attribution shown in the interface is credited to Freepik.

## License

No license has been specified for this project yet.

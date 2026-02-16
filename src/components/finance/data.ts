import { SC } from "./theme";

export const itcDividendHistory = [
  { year: "2019", dividend: 10.15, price: 240 },
  { year: "2020", dividend: 10.15, price: 165 },
  { year: "2021", dividend: 11.5, price: 210 },
  { year: "2022", dividend: 12.25, price: 340 },
  { year: "2023", dividend: 13.25, price: 440 },
  { year: "2024", dividend: 15.0, price: 430 },
];

export const growthJourney = [
  { year: "2021", zomato: 100, itc: 100, coalIndia: 100 },
  { year: "2022", zomato: 45, itc: 162, coalIndia: 155 },
  { year: "2023", zomato: 120, itc: 210, coalIndia: 170 },
  { year: "2024", zomato: 200, itc: 205, coalIndia: 180 },
  { year: "2025", zomato: 230, itc: 195, coalIndia: 165 },
];

export const revenueGrowth = [
  { year: "FY21", zomato: 2120, itc: 49257, coalIndia: 96647 },
  { year: "FY22", zomato: 4192, itc: 60919, coalIndia: 107264 },
  { year: "FY23", zomato: 7079, itc: 69481, coalIndia: 133754 },
  { year: "FY24", zomato: 12114, itc: 70919, coalIndia: 135175 },
];

export const interestRateData = [
  { period: "Jan 2022", fed: 0.25, rbi: 4.0, diff: 3.75 },
  { period: "Jun 2022", fed: 1.75, rbi: 4.9, diff: 3.15 },
  { period: "Dec 2022", fed: 4.5, rbi: 6.25, diff: 1.75 },
  { period: "Jun 2023", fed: 5.25, rbi: 6.5, diff: 1.25 },
  { period: "Dec 2023", fed: 5.5, rbi: 6.5, diff: 1.0 },
  { period: "Jun 2024", fed: 5.5, rbi: 6.5, diff: 1.0 },
  { period: "Dec 2024", fed: 4.5, rbi: 6.5, diff: 2.0 },
  { period: "Feb 2025", fed: 4.5, rbi: 6.25, diff: 1.75 },
];

export const m1VsMarkets = [
  { year: "2019", usM1: 3.7, sp500: 3230, indiaM1: 25, nifty: 12168 },
  { year: "2020", usM1: 6.8, sp500: 3756, indiaM1: 30, nifty: 13982 },
  { year: "2021", usM1: 19.4, sp500: 4766, indiaM1: 35, nifty: 17354 },
  { year: "2022", usM1: 19.9, sp500: 3840, indiaM1: 37, nifty: 18105 },
  { year: "2023", usM1: 18.1, sp500: 4770, indiaM1: 39, nifty: 21732 },
  { year: "2024", usM1: 18.4, sp500: 5880, indiaM1: 42, nifty: 23645 },
];

export const stockProfiles = [
  {
    name: "ITC", type: "Dividend Stock", color: SC.invest, price: "430", pe: "27x",
    divYield: "3.5%", revGrowth: "~8%", tagline: "The Steady Compounder",
    method: "Dividend Discount Model (DDM)",
    desc: "ITC pays 15/share in dividends annually. If we expect dividends to grow at 6% per year and we want a 12% return, the Gordon Growth Model gives us: 15 / (0.12 - 0.06) = 250.",
    gordonExplainer: "If a company's cash flows grow every year, they're worth more than flat cash flows. The formula accounts for this by reducing the 'effective' discount. The smaller the gap between your required return and the growth rate, the higher the value -- which is why fast-growing companies command higher prices.",
    marketNote: "The market prices ITC at 430 -- well above 250. This means investors either expect higher dividend growth than 6% or are willing to accept a lower return than 12%.",
    insight: "For dividend stocks, the valuation math is transparent. You're buying a cash-generating machine. The only debate is the growth rate of that cash.",
    analogy: "The established dhaba -- packed every day, owner takes cash home every month. You value it by how much profit it hands you.",
  },
  {
    name: "Coal India", type: "Deep Value Stock", color: SC.thrive, price: "370", pe: "7x",
    divYield: "6.8%", revGrowth: "~3%", tagline: "The Cash Cow",
    method: "Earnings Yield / Asset Value",
    desc: "Coal India trades at just 7x earnings -- meaning if you bought the entire company, it would pay for itself from profits in just 7 years. It pays 25/share in dividends, a hefty 6.8% yield. But the market prices it cheaply because it believes coal demand will structurally decline as India shifts toward renewables.",
    insight: "Value stocks are cheap because the market expects their cash flows to shrink. The bet is: will they shrink as fast as the market thinks? If decline is slower than expected, you profit.",
    analogy: "The old gold jewellery shop -- still profitable, but the neighbourhood is changing. Cheap to buy, but is it cheap for a reason?",
  },
  {
    name: "Zomato", type: "Growth Stock", color: SC.build, price: "230", pe: "350x+",
    divYield: "0%", revGrowth: "~55%", tagline: "The Future Bet",
    method: "DCF on Projected Future Earnings",
    desc: "Zomato pays zero dividends and barely turns a profit today. Yet it's valued at over 2 lakh crore. Why? Investors project its revenue (growing at 50%+ year-over-year) will eventually translate into massive profits. The entire valuation rests on cash flows expected 5-10 years from now.",
    marketCapNote: "How does a 230 stock become a 2 lakh crore company? Because Zomato has roughly 880 crore shares outstanding. Stock price x total shares = market capitalisation (the total value the market places on the company). So 230 x 880 crore shares = approx. 2 lakh crore.",
    insight: "Growth stocks are the most sensitive to interest rates. Since all their value lies in the distant future, a higher discount rate crushes them disproportionately.",
    analogy: "The new cloud kitchen chain -- burning cash, opening 50 locations, no profit yet. But if it works, it'll be 10x bigger in 5 years.",
  },
];

export const assetComparison = [
  { factor: "Liquidity", stocks: "Seconds", realEstate: "Months to years" },
  { factor: "Price Discovery", stocks: "Continuous, transparent", realEstate: "Infrequent, opaque" },
  { factor: "Crash Visibility", stocks: "Immediate", realEstate: "Delayed, hidden" },
  { factor: "Income Stream", stocks: "Dividends (if any)", realEstate: "Rental income" },
  { factor: "Leverage Effect", stocks: "Margin calls force selling", realEstate: "Banks avoid forced sales" },
  { factor: "Inflation Erosion", stocks: "Visible in real returns", realEstate: "Hidden behind nominal prices" },
  { factor: "M1 Sensitivity", stocks: "High (fast repricing)", realEstate: "High (slow repricing)" },
  { factor: "Recovery Speed", stocks: "Months to years", realEstate: "Years to decades" },
];

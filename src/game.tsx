import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Button from '@mui/material/Button';
import {
    Card, CardContent, Typography, Grid, Box, Divider, Dialog, DialogTitle, DialogContent, DialogActions, ThemeProvider, createTheme, CssBaseline
} from '@mui/material';
import Papa from 'papaparse';

const news2 = `title,date,stock
"Hearing Some Users Reporting Facebook's WhatsApp, Instagram Down",2020-04-01,FB
P/E Ratio Insights for Facebook,2020-04-02,FB
"Facebook shares are trading lower. Movement appears market related, as equities move lower for the session amid continued coronavirus-related volatility.",2020-04-03,FB
"Barron's Picks And Pans: Post-Pandemic Ideas, Safe Dividends And More",2020-04-04,FB
Shares of several semiconductor and large technology stocks are trading higher with the broader market on optimism that coronavirus cases in several US hotspots appear to be reaching their peak.,2020-04-06,FB
"IVP, Sapphire Ventures Lead $100M Series E In CircleCI's Leading Software Solution",2020-04-07,FB
P/E Ratio Insights for Facebook,2020-04-08,FB
Why The Next Major Social Networks May Exist In Video Games,2020-04-09,FB
"Barron's Picks And Pans: Berkshire Hathaway, Disney, SoftBank And More",2020-04-12,FB
Facebook Option Traders Make $1M Bets On Multi-Year Rally,2020-04-13,FB
'World Health Organization Launches Messenger Experience to Help Deliver Accurate Information on COVID-19' -From Facebook Messenger Newsroom Earlier Tues.,2020-04-14,FB
"Amazon, Facebook Spokespeople Say Jeff Bezos, Mark Zuckerberg Joined White House Committee Call On Coronavirus Wed.",2020-04-15,FB
"Big Stocks Moving After Hours As Market Cheers Gilead, 'Reopening' Updates",2020-04-16,FB
"Gene Munster Dismisses Goldman's Apple Downgrade, Says Cupertino Has Long-Term Earnings Power",2020-04-17,FB
"Bulls And Bears Of The Week: Caterpillar, Facebook, Microsoft And More",2020-04-19,FB
"Credit Suisse Maintains Outperform on Facebook, Lowers Price Target to $234",2020-04-20,FB
Afternoon Market Stats in 5 Minutes,2020-04-21,FB
PreMarket Prep Stock Of The Day: Facebook,2020-04-22,FB
"With NHL Season On Ice, League Launches Esports Challenge: 'Extremely Fun To Watch'",2020-04-23,FB
"Forget Facebook, Snapchat, Twitter: TikTok Is The Breakout COVID-19 Social Media Platform",2020-04-24,FB
Large Facebook Option Trader Betting On Earnings Sell-Off,2020-04-25,FB
"Facebook To Release Q1 Earnings: Focus On Ad Revenue, User Data, Jio Investment",2020-04-27,FB
Blue Chip Stocks Resisting COVID-19,2020-04-28,FB
13 Stocks Moving In Wednesday's After-Hours Session,2020-04-29,FB
7 Times Elon Musk Wasn't Afraid To Speak His Mind,2020-04-30,FB`;


const news = `title,date,stock
Facebook launches Messenger app for Windows and macOS,2020-04-01,FB
Facebook's ad revenue reportedly drops amid COVID-19 crisis,2020-04-02,FB
Facebook releases new 'Quiet Mode' to help users manage screen time,2020-04-03,FB
Facebook invests $5.7 billion in India's Reliance Jio Platforms,2020-04-06,FB
Facebook launches new Gaming app to compete with Twitch and YouTube,2020-04-07,FB
Facebook to start warning users who interact with COVID-19 misinformation,2020-04-08,FB
Facebook sues software developer for selling fake Instagram likes,2020-04-09,FB
Facebook cancels all large events through June 2021 due to coronavirus,2020-04-10,FB
Facebook releases county-by-county COVID-19 symptom map in the US,2020-04-13,FB
Facebook partners with WHO to launch COVID-19 Information Center,2020-04-14,FB
Facebook to alert users who have interacted with COVID-19 misinformation,2020-04-15,FB
Facebook introduces new video chat features to compete with Zoom,2020-04-16,FB
Facebook cancels all physical events with 50 or more people through June 2021,2020-04-17,FB
Facebook launches gaming tournaments to support social distancing efforts,2020-04-20,FB
Facebook introduces new 'Care' reaction for COVID-19 support,2020-04-21,FB
Facebook releases first quarter earnings showing resilience amid pandemic,2020-04-22,FB
Facebook launches Messenger Rooms to compete with Zoom,2020-04-23,FB
Facebook's Libra cryptocurrency project faces major setback,2020-04-24,FB
Facebook expands its Community Help feature in response to COVID-19,2020-04-27,FB
Facebook announces members of its new Oversight Board,2020-04-28,FB
Facebook reports strong Q1 earnings despite COVID-19 impact,2020-04-29,FB
Facebook warns of 'significant reduction' in sales growth as ad demand drops,2020-04-30,FB`;
const stockPrices = `datetime,open,high,low,close,volume
2020-04-01,161.62,164.15,158.03,159.6,14362302
2020-04-02,159.1,161.35,155.92,158.2,15205788
2020-04-03,157.15,157.91,150.83,154.19,17481161
2020-04-06,160.15,166.2,158.51,165.55,18496393
2020-04-07,171.79,173.39,166.01,168.83,23702119
2020-04-08,171.25,175.0,167.74,174.28,15997650
2020-04-09,175.9,177.08,171.57,175.2,16888816
2020-04-13,173.67,175.0,169.45,174.79,14780919
2020-04-14,178.98,181.23,176.62,178.14,16041827
2020-04-15,175.19,178.19,172.82,176.91,12410156
2020-04-16,177.95,178.05,172.51,176.28,16092827
2020-04-17,179.2,180.28,176.66,179.26,14470092
2020-04-20,177.41,180.5,176.77,178.26,10844992
2020-04-21,175.25,175.38,168.34,170.68,17175137
2020-04-22,178.45,184.78,178.14,182.27,25785409
2020-04-23,184.08,187.05,183.15,185.15,15802785
2020-04-24,183.23,190.41,180.82,190.1,22384650
2020-04-27,192.66,193.75,187.41,187.5,22244483
2020-04-28,188.66,189.2,182.56,182.86,14824629
2020-04-29,190.93,196.91,190.0,193.99,29579145
2020-04-30,206.92,209.69,201.57,204.74,34762604
`;
// Simulated file reading function (replace with actual file reading in a real application)
const readNewsFile = () => {
    return news.split('\n').slice(1).map(line => {
        const [title, date, stock] = line.split(',');
        return { title: title.replace(/"/g, ''), date, stock };
    });
};

const readStockPriceFile = () => {
    return stockPrices.split('\n').slice(1).map(line => {
        const [date, price, , , ,] = line.split(',');
        return { date, price: parseFloat(price) };
    });
};

const calculateMetrics = (priceHistory, initialBalance, finalBalance, holdings) => {
    if (priceHistory.length < 2) {
        return {
            totalReturn: "N/A",
            annualizedReturn: "N/A",
            volatility: "N/A",
            sharpeRatio: "N/A"
        };
    }

    const startPrice = priceHistory[0].price;
    const endPrice = priceHistory[priceHistory.length - 1].price;
    const totalDays = priceHistory.length;

    // Calculate returns
    const totalValue = finalBalance + holdings * endPrice;
    const totalReturn = (totalValue - initialBalance) / initialBalance;
    const annualizedReturn = Math.pow(1 + totalReturn, 365 / totalDays) - 1;

    // Calculate volatility (standard deviation of daily returns)
    const dailyReturns = priceHistory.slice(1).map((day, index) =>
        (day.price - priceHistory[index].price) / priceHistory[index].price
    );
    const avgReturn = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
    const squaredDiffs = dailyReturns.map(r => Math.pow(r - avgReturn, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length;
    const volatility = Math.sqrt(variance * 252); // Annualized volatility

    // Calculate Sharpe Ratio (assuming risk-free rate of 2%)
    const riskFreeRate = 0.02;
    const sharpeRatio = volatility !== 0 ? (annualizedReturn - riskFreeRate) / volatility : 0;

    return {
        totalReturn: isFinite(totalReturn) ? (totalReturn * 100).toFixed(2) + '%' : "N/A",
        annualizedReturn: isFinite(annualizedReturn) ? (annualizedReturn * 100).toFixed(2) + '%' : "N/A",
        volatility: isFinite(volatility) ? (volatility * 100).toFixed(2) + '%' : "N/A",
        sharpeRatio: isFinite(sharpeRatio) ? sharpeRatio.toFixed(2) : "N/A"
    };
};

const InfoTooltip = ({ title, content, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <span
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            style={{ position: 'relative', borderBottom: '1px dotted #000', cursor: 'help' }}
        >
            {children}
            {isOpen && (
                <Box sx={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    zIndex: 1000,
                    width: '200px'
                }}>
                    <Typography variant="subtitle2">{title}</Typography>
                    <Typography variant="body2">{content}</Typography>
                </Box>
            )}
        </span>
    );
};

const formatCurrency = (value) => {
    return `$${value.toFixed(2)}`;
};


const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
};



// Create a cyberpunk theme
const cyberpunkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00ff00', // Neon green
        },
        secondary: {
            main: '#ff00ff', // Neon pink
        },
        background: {
            default: '#0a0a0a',
            paper: '#1a1a1a',
        },
        text: {
            primary: '#ffffff',
            secondary: '#00ffff', // Neon cyan
        },
    },
    typography: {
        fontFamily: '"Orbitron", "Roboto", "Helvetica", "Arial", sans-serif',
        h3: {
            textShadow: '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00',
        },
        h5: {
            textShadow: '0 0 5px #00ffff, 0 0 10px #00ffff',
        },
        h6: {
            textShadow: '0 0 3px #ff00ff, 0 0 6px #ff00ff',
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    boxShadow: '0 0 10px #00ffff, 0 0 20px #00ffff',
                    border: '1px solid #00ffff',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '0',
                    fontWeight: 'bold',
                    '&:hover': {
                        boxShadow: '0 0 10px #ff00ff, 0 0 20px #ff00ff',
                    },
                },
            },
        },
    },
});

const StockTradingGame = () => {
    const [balance, setBalance] = useState(1000);
    const [holdings, setHoldings] = useState(0);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [currentDate, setCurrentDate] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [countdown, setCountdown] = useState(null);
    const [pnl, setPnl] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [isFinalCountdown, setIsFinalCountdown] = useState(false);
    const [stockData, setStockData] = useState([]);
    const [newsData, setNewsData] = useState([]);
    const [newsHistory, setNewsHistory] = useState([]);
    const [showOnboarding, setShowOnboarding] = useState(true);
    const [onboardingStep, setOnboardingStep] = useState(0);
    const [showMetrics, setShowMetrics] = useState(false);
    const [metrics, setMetrics] = useState({});
    const [latestNews, setLatestNews] = useState(null);
    const [highlightedNews, setHighlightedNews] = useState(null);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const loadedNewsData = readNewsFile();
        const loadedPriceData = readStockPriceFile();
        setNewsData(loadedNewsData);
        setStockData(loadedPriceData);

        if (loadedPriceData.length > 0) {
            setCurrentDate(loadedPriceData[0].date);
            setCurrentPrice(loadedPriceData[0].price);

            const initialChartData = loadedPriceData.map(data => ({
                date: data.date,
                price: null,
                pnl: null
            }));
            setChartData(initialChartData);
        }

        let startCountdown = 3;
        const startTimer = setInterval(() => {
            if (startCountdown > 0) {
                setCountdown(startCountdown);
                startCountdown--;
            } else {
                clearInterval(startTimer);
                setCountdown(null);
                setGameStarted(true);
            }
        }, 1000);

        return () => clearInterval(startTimer);
    }, []);

    useEffect(() => {
        if (gameStarted && !gameOver) {
            const gameTimer = setInterval(() => {
                setCurrentDate(prevDate => {
                    const currentIndex = stockData.findIndex(data => data.date === prevDate);
                    if (currentIndex < stockData.length - 1) {
                        return stockData[currentIndex + 1].date;
                    } else {
                        clearInterval(gameTimer);
                        setIsFinalCountdown(true);
                        return prevDate;
                    }
                });
            }, 3000);

            return () => clearInterval(gameTimer);
        }
    }, [gameStarted, gameOver, stockData]);



    useEffect(() => {
        if (currentDate && stockData.length > 0) {
            const currentIndex = stockData.findIndex(data => data.date === currentDate);
            if (currentIndex !== -1) {
                const currentDataPoint = stockData[currentIndex];
                setCurrentPrice(currentDataPoint.price);
                const stockValue = holdings * currentDataPoint.price;
                const totalValue = balance + stockValue;
                const newPnl = totalValue - 1000;
                setPnl(newPnl);

                setChartData(prevData => {
                    const newData = [...prevData];
                    for (let i = 0; i <= currentIndex; i++) {
                        newData[i] = {
                            ...newData[i],
                            price: stockData[i].price,
                            pnl: i === currentIndex ? newPnl : newData[i].pnl
                        };
                    }
                    return newData;
                });

                const todayNews = newsData.filter(news => news.date === currentDate);
                if (todayNews.length > 0) {
                    setLatestNews(todayNews[0]);
                    setHighlightedNews(todayNews[0].title);
                    setTimeout(() => setHighlightedNews(null), 2000);
                    setNewsHistory(prevHistory => {
                        const updatedHistory = [...todayNews, ...prevHistory];
                        const uniqueHistory = updatedHistory.filter((news, index, self) =>
                            index === self.findIndex((t) => t.title === news.title)
                        );
                        return uniqueHistory.slice(0, 10);
                    });
                }

                if (currentDate === '2020-04-30') {
                    setIsFinalCountdown(true);
                    let endCountdown = 3;
                    const endTimer = setInterval(() => {
                        if (endCountdown > 0) {
                            setCountdown(endCountdown);
                            endCountdown--;
                        } else {
                            clearInterval(endTimer);
                            setCountdown('Game Over!');
                            setGameOver(true);
                            setIsFinalCountdown(false);
                            const finalMetrics = calculateMetrics(chartData.filter(data => data.price !== null), 1000, balance, holdings);
                            setMetrics(finalMetrics);
                            setShowMetrics(true);

                        }
                    }, 1000);
                }
            }
        }
    }, [currentDate, holdings, balance, stockData, newsData]);

    const handleBuy = () => {
        if (balance >= currentPrice && !gameOver) {
            setBalance(prevBalance => prevBalance - currentPrice);
            setHoldings(prevHoldings => prevHoldings + 1);
        }
    };

    const handleSell = () => {
        if (holdings > 0 && !gameOver) {
            setBalance(prevBalance => prevBalance + currentPrice);
            setHoldings(prevHoldings => prevHoldings - 1);
        }
    };
    const onboardingSteps = [
        {
            title: "Welcome to the Stock Trading Game!",
            content: "This game simulates trading a stock during April 2020. You'll see real historical data and news events."
        },
        {
            title: "Your Portfolio",
            content: "You start with $1000. Use this to buy stocks. Your goal is to maximize your profits by the end of the month."
        },
        {
            title: "Buying and Selling",
            content: "Use the 'Buy' button to purchase stocks at the current price, and 'Sell' to sell your holdings."
        },
        {
            title: "News Feed",
            content: "Pay attention to the news feed. Real events can impact stock prices!"
        },
        {
            title: "Performance Chart",
            content: "The chart shows the stock price and your profit/loss (PnL) over time."
        }
    ];

    const handleNextStep = () => {
        if (onboardingStep < onboardingSteps.length - 1) {
            setOnboardingStep(onboardingStep + 1);
        } else {
            setShowOnboarding(false);
        }
    };

    return (
        <ThemeProvider theme={cyberpunkTheme}>
            <CssBaseline />
            <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'background.default' }}>
                <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', py: 2 }}>
                    Cyber Trade 2077
                </Typography>
                <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
                    {/* Left Side: News Feed */}
                    <Box sx={{ width: '50%', p: 2, overflowY: 'auto' }}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>Neural Network Feed</Typography>
                                <Typography variant="h6" color="secondary" sx={{ mb: 2 }}>
                                    Current Timeframe: {formatDate(currentDate)}
                                </Typography>
                                {latestNews && (
                                    <Box sx={{ mb: 2, p: 2, backgroundColor: 'rgba(255, 255, 0, 0.1)', borderRadius: '4px', border: '1px solid #ffff00' }}>
                                        <Typography variant="subtitle1" fontWeight="bold" color="secondary">Breaking Data Stream:</Typography>
                                        <Typography variant="body1" fontWeight="bold">{latestNews.title}</Typography>
                                    </Box>
                                )}
                                <Divider sx={{ mb: 2, borderColor: 'primary.main' }} />
                                <Box sx={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
                                    {newsHistory.map((item, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                mb: 2,
                                                borderBottom: '1px solid #00ff00',
                                                pb: 2,
                                                backgroundColor: highlightedNews === item.title ? 'rgba(0, 255, 0, 0.1)' : 'transparent',
                                                transition: 'background-color 0.3s ease'
                                            }}
                                        >
                                            <Typography variant="subtitle2" color="text.secondary">
                                                {formatDate(item.date)}
                                            </Typography>
                                            <Typography variant="body1" fontWeight="bold" color="text.primary">
                                                {item.title}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Right Side: Chart and Portfolio */}
                    <Box sx={{ width: '50%', p: 2, display: 'flex', flexDirection: 'column' }}>
                        {/* Top: Chart */}
                        <Card sx={{ mb: 2, flexGrow: 1 }}>
                            <CardContent sx={{ height: '100%' }}>
                                <Typography variant="h5" gutterBottom>Quantum Flux Analysis</Typography>
                                <ResponsiveContainer width="100%" height="80%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fill: '#00ffff' }}
                                            tickFormatter={formatDate}
                                            stroke="#00ffff"
                                        />
                                        <YAxis
                                            tickFormatter={(value) => formatCurrency(value)}
                                            tick={{ fill: '#00ffff' }}
                                            stroke="#00ffff"
                                        />
                                        <Tooltip
                                            formatter={(value, name) => [formatCurrency(value), name]}
                                            labelFormatter={formatDate}
                                            contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#00ffff' }}
                                        />
                                        <Legend />
                                        <Line type="monotone" dataKey="price" stroke="#00ff00" name="Stock Price" dot={false} />
                                        <Line type="monotone" dataKey="pnl" stroke="#ff00ff" name="PnL" dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Bottom: Portfolio */}
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>Digital Asset Portfolio</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="body1">Crypto Balance: {formatCurrency(balance)}</Typography>
                                        <Typography variant="body1">DataChip Holdings: {holdings}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1" color={pnl >= 0 ? 'primary.main' : 'secondary.main'}>
                                            NetGain: {formatCurrency(pnl)}
                                        </Typography>
                                        <Typography variant="body1">Current Valuation: {formatCurrency(currentPrice)}</Typography>
                                    </Grid>
                                </Grid>
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleBuy}
                                        disabled={(!isFinalCountdown && gameOver) || balance < currentPrice}
                                    >
                                        Acquire
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleSell}
                                        disabled={(!isFinalCountdown && gameOver) || holdings === 0}
                                    >
                                        Liquidate
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>

                {/* Onboarding Dialog */}
                <Dialog open={showOnboarding} onClose={() => setShowOnboarding(false)}>
                    <DialogTitle sx={{ color: 'primary.main' }}>{onboardingSteps[onboardingStep].title}</DialogTitle>
                    <DialogContent>
                        <Typography>{onboardingSteps[onboardingStep].content}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleNextStep} color="primary">
                            {onboardingStep < onboardingSteps.length - 1 ? "Next" : "Start Simulation"}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Performance Metrics Dialog */}
                <Dialog open={showMetrics} onClose={() => setShowMetrics(false)}>
                    <DialogTitle sx={{ color: 'primary.main' }}>Simulation Performance</DialogTitle>
                    <DialogContent>
                        <Typography variant="h6" gutterBottom>Advanced Metrics:</Typography>
                        <Typography>
                            <InfoTooltip title="Total Return" content="The overall profit or loss on your investment, expressed as a percentage of your initial investment.">
                                Total Return: {metrics.totalReturn}
                            </InfoTooltip>
                        </Typography>
                        <Typography>
                            <InfoTooltip title="Annualized Return" content="Your return normalized to a one-year period, allowing comparison with other investments of different durations.">
                                Annualized Return: {metrics.annualizedReturn}
                            </InfoTooltip>
                        </Typography>
                        <Typography>
                            <InfoTooltip title="Volatility" content="A measure of the price fluctuations of the stock. Higher volatility implies higher risk.">
                                Volatility: {metrics.volatility}
                            </InfoTooltip>
                        </Typography>
                        <Typography>
                            <InfoTooltip title="Sharpe Ratio" content="A measure of risk-adjusted return. A higher Sharpe ratio indicates better return for the risk taken.">
                                Sharpe Ratio: {metrics.sharpeRatio}
                            </InfoTooltip>
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowMetrics(false)} color="primary">Close</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </ThemeProvider>
    );
};

export default StockTradingGame;
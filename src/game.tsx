import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Button from '@mui/material/Button';
import {
    Card, CardContent, Typography, Grid, Box, Divider, Dialog, DialogTitle, DialogContent, DialogActions, ThemeProvider, createTheme, CssBaseline,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import Sentiment from 'sentiment';

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
2020-04-30,206.92,209.69,201.57,204.74,34762604`;

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

const formatCurrency = (value) => {
    if (value === undefined || value === null) {
        return '$0.00';
    }
    return `$${Number(value).toFixed(2)}`;
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
};

const sentiment = new Sentiment();

const analyzeSentiment = (text) => {
    const result = sentiment.analyze(text);
    if (result.score > 0) return 'Positive';
    if (result.score < 0) return 'Negative';
    return 'Neutral';
};

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
    const [isFinalCountdown, setIsFinalCountdown] = useState(false);
    const [stockData, setStockData] = useState([]);
    const [newsData, setNewsData] = useState([]);
    const [newsHistory, setNewsHistory] = useState([]);
    const [showOnboarding, setShowOnboarding] = useState(true);
    const [onboardingStep, setOnboardingStep] = useState(0);
    const [latestNews, setLatestNews] = useState(null);
    const [highlightedNews, setHighlightedNews] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [gameReady, setGameReady] = useState(false);
    const [newsWithSentiment, setNewsWithSentiment] = useState([]);
    const [userTrades, setUserTrades] = useState([]);
    const [showSummary, setShowSummary] = useState(false);
    const [summaryData, setSummaryData] = useState([]);
    const [finalStats, setFinalStats] = useState({});

    useEffect(() => {
        const loadedNewsData = readNewsFile();
        const loadedPriceData = readStockPriceFile();
        setNewsData(loadedNewsData);
        setStockData(loadedPriceData);

        // Analyze sentiment for each news item
        const newsWithSentimentData = loadedNewsData.map(news => ({
            ...news,
            sentiment: analyzeSentiment(news.title)
        }));
        setNewsWithSentiment(newsWithSentimentData);

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
    }, []);

    useEffect(() => {
        if (gameReady && !gameOver) {
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
            }, 2000);

            return () => clearInterval(gameTimer);
        }
    }, [gameReady, gameOver, stockData]);

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
                        }
                    }, 1000);
                }
            }
        }
    }, [currentDate, holdings, balance, stockData, newsData]);

    useEffect(() => {
        if (gameOver) {
            const summary = newsWithSentiment.map(news => {
                const trade = userTrades.find(trade => trade.date === news.date);
                return {
                    date: news.date,
                    article: news.title,
                    sentiment: news.sentiment,
                    action: trade ? trade.type : 'No Action'
                };
            });
            setSummaryData(summary);

            const initialValue = 1000; // Starting balance
            const finalValue = balance + (holdings * (currentPrice || 0));
            const totalReturn = ((finalValue - initialValue) / initialValue) * 100;
            const totalTrades = userTrades.length;
            const profitableTrades = userTrades.filter(trade =>
                trade.type === 'Sell' && trade.price > trade.buyPrice
            ).length;

            setFinalStats({
                pnl: finalValue - initialValue,
                totalReturn: totalReturn,
                totalTrades: totalTrades,
                profitableTrades: profitableTrades,
                winRate: totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0,
                finalBalance: balance,
                finalHoldings: holdings,
                finalStockPrice: currentPrice || 0
            });

            setShowSummary(true);
        }
    }, [gameOver, newsWithSentiment, userTrades, balance, holdings, currentPrice]);
    const handleBuy = () => {
        if (balance >= currentPrice && !gameOver) {
            setBalance(prevBalance => prevBalance - currentPrice);
            setHoldings(prevHoldings => prevHoldings + 1);
            setUserTrades(prevTrades => [...prevTrades, { type: 'Buy', date: currentDate, price: currentPrice }]);
        }
    };

    const handleSell = () => {
        if (holdings > 0 && !gameOver) {
            setBalance(prevBalance => prevBalance + currentPrice);
            setHoldings(prevHoldings => prevHoldings - 1);
            setUserTrades(prevTrades => [...prevTrades, { type: 'Sell', date: currentDate, price: currentPrice }]);
        }
    };

    const handleNextStep = () => {
        if (onboardingStep < onboardingSteps.length - 1) {
            setOnboardingStep(onboardingStep + 1);
        } else {
            setShowOnboarding(false);
            setGameReady(true);
        }
    };

    const onboardingSteps = [
        {
            title: "Welcome to Cyber Trade 2077!",
            content: "This game simulates trading a stock during April 2020. You'll see real historical data and news events in a cyberpunk future setting."
        },
        {
            title: "Your Digital Asset Portfolio",
            content: "You start with $1000 in crypto-credits. Use this to buy DataChips (stocks). Your goal is to maximize your profits by the end of the month."
        },
        {
            title: "Quantum Trading",
            content: "Use the 'Acquire' button to purchase DataChips at the current price, and 'Liquidate' to sell your holdings."
        },
        {
            title: "Neural Network Feed",
            content: "Pay attention to the news feed. Real events can impact DataChip prices! Our AI analyzes the sentiment of each news item."
        },
        {
            title: "Quantum Flux Analysis",
            content: "The chart shows the DataChip price and your profit/loss (PnL) over time. Use this to inform your trading decisions."
        }
    ];

    return (
        <ThemeProvider theme={cyberpunkTheme}>
            <CssBaseline />
            <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'background.default', overflow: 'hidden' }}>
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
                                        <Line type="monotone" dataKey="price" stroke="#00ff00" name="DataChip Price" dot={false} />
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
                <Dialog open={showOnboarding} onClose={() => { }}>
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

                {/* End-Game Summary Dialog */}
                <Dialog open={showSummary} onClose={() => setShowSummary(false)} maxWidth="lg" fullWidth>
                    <DialogTitle sx={{ color: 'primary.main' }}>Simulation Summary</DialogTitle>
                    <DialogContent>
                        <TableContainer component={Paper} sx={{ mb: 4, backgroundColor: 'background.paper' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ color: 'primary.main' }}>Date</TableCell>
                                        <TableCell sx={{ color: 'primary.main' }}>Article</TableCell>
                                        <TableCell sx={{ color: 'primary.main' }}>Sentiment</TableCell>
                                        <TableCell sx={{ color: 'primary.main' }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {summaryData.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{formatDate(row.date)}</TableCell>
                                            <TableCell>{row.article}</TableCell>
                                            <TableCell sx={{
                                                color:
                                                    row.sentiment === 'Positive' ? 'success.main' :
                                                        row.sentiment === 'Negative' ? 'error.main' : 'text.secondary'
                                            }}>
                                                {row.sentiment}
                                            </TableCell>
                                            <TableCell>{row.action}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Typography variant="h6" gutterBottom sx={{ color: 'secondary.main' }}>Final Statistics:</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography>PnL: {formatCurrency(finalStats.pnl)}</Typography>
                                <Typography>Total Return: {finalStats.totalReturn?.toFixed(2)}%</Typography>
                                <Typography>Total Trades: {finalStats.totalTrades}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>Final Balance: {formatCurrency(finalStats.finalBalance)}</Typography>
                                <Typography>Final Holdings: {finalStats.finalHoldings}</Typography>
                                <Typography>Final DataChip Price: {formatCurrency(finalStats.finalStockPrice)}</Typography>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowSummary(false)} color="primary">Close</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </ThemeProvider>
    );
};

export default StockTradingGame;
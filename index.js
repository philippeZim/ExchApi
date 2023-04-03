const PORT = process.env.PORT || 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.get('/', (req, res) => {
    res.json('Welcome to my Exchange Rate API');
});



app.get('/exch/:base/:target/:amount?', (req, res) => {
    const base = req.params.base;
    const target = req.params.target;
    const amount = req.params.amount;
    axios.get(`https://www.google.com/finance/quote/${base}-${target}`)
        .then(response => {
            const html = response.data;
            //console.log(html);
            const $ = cheerio.load(html);
            $('div[class="YMlKec fxKbKc"]').each(function () {
                const rate = $(this).text();
                // convert to number
                var result = Number(rate);
                // multiply by amount if amount is provided
                if (amount){
                    result = result * amount;
                }
                // round to 4 decimal places
                result = Number(result.toFixed(4));
                res.json(result);
            });
        }).catch(err => console.log(err));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
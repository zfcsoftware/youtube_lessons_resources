var ProxyLists = require('proxy-lists');
const proxy_check = require('proxy-check');
const fs = require('fs')
const axios = require('axios')
const { HttpsProxyAgent } = require('https-proxy-agent')


// https://api.ipify.org/?format=json

const checkms = ({ host = '', port = '' }) => {
    return new Promise(async (resolve, reject) => {
        var agent = new HttpsProxyAgent(`http://${host}:${port}`);

        var startDate = Number(Date.now())

        var response = await axios.get('https://api.ipify.org/?format=json', {
            httpsAgent: agent,
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0'
            }
        })
            .then(response => {
                response = response.data
                if (response.ip && response.ip.length > 0) {
                    return response
                } else {
                    return false
                }
            })
            .catch(err => {
                return false
            })
        var endDate = Number(Date.now())
        var pr = host + ':' + port

        if (response !== false) {
            console.log('Çalışan proxy bulundu! => ' + pr)
            fs.appendFileSync('./success.txt', String(pr) + ':' + (endDate - startDate) + '\n')
        } else {
            fs.appendFileSync('./success.txt', String(pr) + ':-' + '\n')
        }

        resolve()

    })
}




const checkProxy = (arr) => {
    return new Promise(async (resolve, reject) => {
        for (var item of arr) {

            const proxy = {
                host: item.host,
                port: item.port
            }
            var pr = proxy.host + ':' + proxy.port

            var check = await proxy_check(proxy)
                .catch(err => {
                    return false
                })
            if (check === true) {
                checkms({
                    host: proxy.host,
                    port: proxy.port
                })
            } else {
                fs.appendFileSync('./error.txt', String(pr) + '\n')
            }

        }
        resolve()

    })
}







const getAll = () => {
    return new Promise((resolve, reject) => {


        ProxyLists.getProxies({
        })
            .on('data', function (proxies) {
                var clearData = []

                proxies.forEach(item => {
                    if (item && item.ipAddress && item.ipAddress.length > 0) {
                        clearData.push({
                            host: item.ipAddress,
                            port: item.port
                        })
                    }
                });

                checkProxy(clearData)
            })
            .on('error', function (error) {

            })
            .once('end', function () {
                resolve(true)
            });


    })
}



getAll()
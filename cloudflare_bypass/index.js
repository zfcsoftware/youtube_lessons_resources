const fs = require('fs')
const axios = require('axios')

const url = '<url>'

function parseHeaders(requestString) {
    const headers = requestString.split('\n').slice(1, -2);
    let userAgent, cookie;
    headers.forEach(header => {
        const [key, value] = header.split(': ');
        if (key.toLowerCase() === 'user-agent') {
            userAgent = value;
        } else if (key.toLowerCase() === 'cookie') {
            cookie = value;
        }
    });
    userAgent = userAgent.replace(/[^\t\x20-\x7e\x80-\xff]/g, '')
    cookie = cookie.replace(/[^\t\x20-\x7e\x80-\xff]/g, '')
    return { userAgent, cookie };
}




const refreshSession = ({ url = '' }) => {
    return new Promise(async (resolve, reject) => {
        try {
            var got = await import('cloudflare-scraper')
            got = got.default
            const response = await got.get(url);
            const { userAgent, cookie } = parseHeaders(String(response.request._request._header));
            fs.writeFileSync('./session.json', JSON.stringify({
                agent: userAgent,
                cookie: cookie
            }))
            resolve(true)
        } catch (err) {
            console.log(err.message);
            resolve(false)
        }
    })
}



const scrape = () => {
    return new Promise(async (resolve, reject) => {
        var session = false
        try {
            var ss = fs.readFileSync('./session.json', 'utf-8')
            ss = JSON.parse(ss)
            session = ss
        } catch (err) { }
        if (session === false) {
            resolve(false)
            return false
        }

        var response = await axios(url, {
            withCredentials: true,
            headers: {
                Cookie: session.cookie,
                'User-Agent': session.agent
            }
        })
            .then(response => {
                console.log('+ Cloudflare başarıyla bypass edildi.');
                return response.data
            })
            .catch(err => {
                console.log('- Cloudflare bypass edilemedi.');
                return false
            })
        resolve(response)
    })
}









scrape()
    .then(resp => {
        console.log(resp);
    })


refreshSession({
    url: url
})
setInterval(() => {
    refreshSession({
        url: url
    })
}, 5 * 1000 * 60);
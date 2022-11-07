const axios = require('axios')
const auth = {
    username: process.env.PROJECT_ID,
    password: process.env.API_TOKEN
}

const BASE_URL = `https://${process.env.SPACE_NAME}.signalwire.com/api/chat/tokens`

module.exports = async function (context, req) {
    try {
        const { username, code } = req.body

        if (!username || !code) {
            context.res = {
                status: 400,
                headers: {
                    "Access-Control-Allow-Origin": "http://127.0.0.1:8000",
                    "Access-Control-Allow-Methods": "POST,GET,PUT,OPTIONS",
                    "Content-Type": "application/json",
                },
                body: {
                    message: "Username or Game code is required"
                }
            }
        } else {
            const channelsPerms = {}

            channelsPerms[code] = { read: true, write: true }

            const response = await axios.post(BASE_URL, {
                ttl: 50,
                channels: channelsPerms,
                username,
                state: {}
            }, { auth })

            context.res = {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
                body: {
                    token: response.data.token
                }
            };
        }

    } catch (e) {
        context.res = {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
            body: { message: e.message }
        }
    }

}
import { encrypt, decrypt } from "./encrypt_decrypt";
import { server_addr } from './server_addr';

export function sendMessageExt(e, message, type, steg, key, sender, receiver, ses_id) {
    if (e) {
        e.preventDefault();
    }

    const enc_msg = encrypt(message, key);
    //fetch(`http://${server_addr}/message?msg=${encodeURIComponent(enc_msg)}&sender=${sender}&receiver=${receiver}&ses_id=${ses_id}&type=${type}&steg=${steg}`, {method: "POST"})
    //fetch(`http://${server_addr}/message?msg=${encodeURIComponent(enc_msg)}&receiver=${receiver}&type=${type}&steg=${steg}`, {
    fetch(`${server_addr}/start-message`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'token': sender,
            'ses_id': ses_id
        },
        body: JSON.stringify({
            msg: enc_msg,
            receiver: receiver,
            type: type,
            steg: steg
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.message) {
                console.log(data)
            }
            /*if (data.date) {
                async function fetchUntilDone() {
                    let response = await fetch(`${server_addr}/message?date=${encodeURIComponent(data.date)}`);
                    if (!response.done) {
                        await fetchUntilDone();
                    }
                }
                fetchUntilDone();
            }*/
        });
}
function xor_encrypt_decrypt(message, key) {
    var keyL = []
    for (var i = 0; i < key.length; i++) {
        keyL.push(key[i])
    }
    var output = []
    for (var i = 0; i < message.length; i++) {
        var char_code = message.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        output.push(String.fromCharCode(char_code));
    }
    return output.join("");
}

export function encrypt(message, key) {
    return xor_encrypt_decrypt(message, key);
}

export function decrypt(enc_message, key) {
    return xor_encrypt_decrypt(enc_message, key);
}

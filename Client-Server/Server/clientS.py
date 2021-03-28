from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import sqlite3
from datetime import datetime
import uuid
import json
from setupDb import db_setup, execute_query

'''
TODO:
    - Make the storage of tokens encrypted somehow
Ideas:
    - Users can choose whether to save chat session chat logs
        - Chat logs are only saved if both users agree
        - Chat logs are requested from the server when a user ends the session and both users consent to saving the chat logs
        - Chat logs are saved on the user(s)' computer 
    - When a chat session ends, the server deletes all message and session data for that session
'''

app = Flask(__name__)
cors = CORS(app)

"""
Parameters:
    - username: Requestor's username
    - token: Requestor's old token (can be empty if requestor has never used the application)
Functionality:
    - Returns a token for the requestor to use
Conditions:
    - If the token parameter is empty and username doesn't exist in User_Tokens, then generates and returns a token
    - If the token parameter is empty and username exists in User_Tokens, then server returns 'User already exists'
    - If the token parameter is the same as the username's token in User_Tokens, then generates a new token and returns that token
      while updating the value for token to the new one in User_Tokens
    - If the token parameter is non-empty but not the same as in User_Tokens, then server returns 'Permission denied'
"""
@app.route("/get-token", methods=["GET"])
def get_token():
    username = request.args.get('username')
    tok = request.args.get('token')
    sql = '''
        SELECT username, token
        FROM User_Tokens
        WHERE username = ?
    '''
    res = execute_query(sql, (username,), 'one')
    if res is None:
        token = str(uuid.uuid4())
        sql = '''
            INSERT INTO User_Tokens VALUES(?,?)
        '''
        execute_query(sql, (token, username), None)
        return jsonify({'token': token})
    else:
        username, token = res
        if token == tok:
            new_token = str(uuid.uuid4())
            sql = '''
                UPDATE User_Tokens
                SET token = ?
                WHERE username = ?
            '''
            execute_query(sql, (new_token, username), None)
            return jsonify({'token': new_token})
        elif token == '':
            return jsonify({'Message': 'Username already exists'})
        else:
            return jsonify({'Message': 'Permission denied.'})

"""
Parameters:
    - ses_id: A preferably valid session ID
    - target: The target who's public key is to be retrieved
Functionality:
    - Return the public key of the target
Conditions:
    - If ses_id doesn't exist in Sessions then returns 'Invalid Session ID.'
    - If ses_id is valid but target isn't in the participants of the Session then returns 'Permission denied.'
    - If target doesn't exist in User_Tokens then returns 'User doesn't exist'
    - If ses_id is valid and target is a participant of the Session then returns the public key of the target
"""
@app.route("/get-pkey", methods=["GET"])
def get_pkey():
    ses_id = request.args.get('ses_id')
    target = request.args.get('target')
    sql = '''
        SELECT token
        FROM User_Tokens
        WHERE username = ?
    '''
    res = execute_query(sql, (target,), 'one')
    if res is not None:
        target = res[0]
        sql = '''
            SELECT *
            FROM Sessions
            WHERE ses_id = ?
        '''
        res = execute_query(sql, (ses_id,), 'one')
        if res is not None:
            ses_id, participants = res
            if target in participants.split(','):
                sql = '''
                    SELECT public_key
                    FROM Public_Keys
                    WHERE token = ?
                '''
                pkey = execute_query(sql, (target,), 'one')[0]
                return jsonify({"pkey": pkey})
            else:
                return jsonify({"Message": "Permission denied."})
        else:
            return jsonify({"Message": "Invalid Session ID."})
    else:
        return jsonify({"Message:" "User doesn't exist."})

@app.route("/my-pkey", methods=["POST"])
def store_my_pkey():
    token = request.args.get('token')
    sql = '''
        SELECT username
        FROM User_Tokens
        WHERE token = ?
    '''
    res = execute_query(sql, (token,), 'one')
    if res is not None:
        pkey = request.args.get('pkey')
        sql = '''
            INSERT INTO Public_Keys VALUES(?,?)
        '''
        execute_query(sql, (token, pkey), None)
        return jsonify({"Success": True})
    else:
        return jsonify({"Message": "Invalid token."})

@app.route("/my-requests", methods=["GET"])
def get_chat_requests():
    token = request.args.get('token')
    sql = '''
        SELECT Requests.req_id, User_Tokens.username, Requests.granted
        FROM Requests
        LEFT OUTER JOIN User_Tokens
        ON (Requests.requesting = ? AND User_Tokens.token = Requests.requestor)
    '''
    res = execute_query(sql, (token,), 'all')
    if len(res) > 0:
        reqs = []
        for r in res:
            req_id, requestor, granted = r
            if granted == 0:
                reqs.append({'req_id': req_id, 'requestor': requestor})
        return jsonify({'requests': reqs})
    else:
        return jsonify({"Message": "No chat requests so far."})

@app.route("/request", methods=["POST"])
def request_chat():
    requestor = request.args.get('requestor')
    requesting = request.args.get('requesting')
    sql = '''
        SELECT token
        FROM User_Tokens
        WHERE username = ?
    '''
    res = execute_query(sql, (requesting,), 'one')
    if res is not None:
        requesting = res[0]
        sql = '''
            SELECT req_id
            FROM Requests
            WHERE (requestor = ? AND requesting = ?)
        '''
        res = execute_query(sql, (requesting, requestor), 'one')
        if res is None:
            sql = '''
                SELECT req_id
                FROM Requests
                WHERE (requestor = ? AND requesting = ?)
            '''
            res = execute_query(sql, (requestor, requesting), 'one')
            if res is None:
                sql = '''
                    INSERT INTO Requests VALUES(?,?,?,?)
                '''
                req_id = str(uuid.uuid4())
                execute_query(sql, (req_id, requestor, requesting, 0), None)
                return jsonify({"Success": True, "req_id": req_id})
            else:
                return jsonify({"Message": "You have already requested to chat with this person."})
        else:
            return jsonify({"Message": "This person has already requested to chat with you."})
    else:
        return jsonify({"Message": "User doesn't exist."})
    return jsonify({"Message": "Invalid token."})

@app.route("/accept-request", methods=["POST"])
def accept_request():
    req_id = request.args.get('req_id')
    token = request.args.get('token')
    sql = '''
        SELECT *
        FROM Requests
        WHERE req_id = ?
    '''
    res = execute_query(sql, (req_id,), 'one')
    if res is not None:
        req_id, requestor, requesting, granted = res
        if requesting == token and granted == 0:
            sql = '''
                UPDATE Requests
                SET granted = 1
                WHERE req_id = ?
            '''
            execute_query(sql, (req_id,), None)
            sql = '''
                INSERT INTO Sessions VALUES(?,?)
            '''
            ses_id = str(uuid.uuid4())
            execute_query(sql, (ses_id, requestor + ',' + requesting), None)
            return jsonify({"Success": True, "ses_id": ses_id})
        elif granted == 1:
            return jsonify({"Message": "Request already accepted."})
        else:
            return jsonify({"Message": "Permission denied."})
    else:
        return jsonify({"Message": "Invalid Request ID."})

@app.route("/check-request", methods=["GET"])
def check_req():
    req_id = request.args.get('req_id')
    token = request.args.get('token')
    sql = '''
        SELECT *
        FROM Requests
        WHERE req_id = ?
    '''
    res = execute_query(sql, (req_id,), 'one')
    if res is not None:
        req_id, requestor, requesting, granted = res
        if granted == 1 and requestor == token:
            sql = '''
                SELECT ses_id 
                FROM Sessions
                WHERE participants = ?
            '''
            ses_id = execute_query(sql, (requestor + ',' + requesting,), 'one')[0]
            return jsonify({"Message": "Chat Request has been accepted", "ses_id": ses_id})
        elif granted == 0 and requestor == token:
            return jsonify({"Message": "Chat Request not accepted yet."})
        else:
            return jsonify({"Message": "Permission denied."})
    else:
        return jsonify({"Message": "Invalid Request ID."})
    
@app.route("/message", methods=["POST"])
def rec_msg():
    msg = request.args.get("msg")
    sender = request.args.get("sender")
    receiver = request.args.get("receiver")
    time = request.args.get("time")
    ses_id = request.args.get("ses_id")
    sql = '''
        SELECT token
        FROM User_Tokens
        WHERE username = ?
    '''
    res = execute_query(sql, (receiver,), 'one')
    if res is not None:
        receiver = res[0]
        sql = '''
            SELECT participants
            FROM Sessions
            WHERE ses_id = ?
        '''
        res = execute_query(sql, (ses_id,), 'one')
        if res is not None:
            if receiver in res[0].split(','):
                sql = '''
                    INSERT INTO Messages VALUES(?,?,?,?,?)
                '''
                execute_query(sql, (ses_id, sender, receiver, msg.encode(), time), None)
                return jsonify({"Success": True})
            else:
                return jsonify({"Message": "Permission denied."})
        else:
            return jsonify({"Message": "Invalid Session ID."})
    else:
        return jsonify({"Message": "User doesn't exist."})

@app.route("/get-messages", methods=["GET"])
def get_msgs():
    #token = request.args.get('token')
    ses_id = request.args.get('ses_id')
    sql = '''
        SELECT Messages.session_id, Messages.message, Messages.time, User_Tokens.username
        FROM Messages
        LEFT OUTER JOIN User_Tokens
        ON (Messages.session_id = ? AND User_Tokens.token = Messages.sender)
    '''
    res = execute_query(sql, (ses_id,), 'all')
    if len(res) > 0:
        msgs = []
        for r in res:
            ses_id, msg, time, sender = r
            msgs.append({'ses_id': ses_id, 'msg': msg.decode(), 'time': time, 'sender': sender})
        print(msgs)
        return jsonify({'messages': msgs})
    else:
        return jsonify({"Message": "No messages yet."})

if __name__ == '__main__':

    try:
        f = open('StegChatDB.db')
        f.close()
    except:
        db_setup()

    app.run(host='0.0.0.0', port='5000')
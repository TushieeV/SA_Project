from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import sqlite3
from datetime import datetime
import uuid
import json
from setupDb import db_setup, execute_query
import logging
from flask_executor import Executor
from flask_socketio import SocketIO
from flask_socketio import send, emit

tok_sids = {}
user_sids = {}

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
executor = Executor(app)
socketio = SocketIO(app, cors_allowed_origins="*")
log = logging.getLogger('werkzeug')
log.disabled = True

@socketio.on('connect')
def handle_conn():
    print('Connected')
    #emit('authenticate')

@socketio.on('authenticate')
def handle_auth(body):
    global user_sids, tok_sids
    token = body['token']
    username = body['username']
    sql = '''
        SELECT token
        FROM User_Tokens
        WHERE token = ?
    '''
    res = execute_query(sql, (token,), 'one')
    if res is not None:
        user_sids[username] = request.sid
        tok_sids[token] = request.sid
        emit('connected', True)
    else:
        emit('connected', False)

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
#@app.route("/get-token", methods=["GET"])
@socketio.on('get-token')
def get_token(body):
    username = body['username']
    #tok = request.args.get('token')
    tok = None
    if 'token' in body: tok = body['token']
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
        socketio.sleep(1)
        emit('res-get-token', {'token': token})
        return
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
            socketio.sleep(1)
            emit('res-get-token', {'token': new_token})
            return
        elif token == '':
            emit('res-get-token', {'Message': 'Username already exists'})
            return
        else:
            emit('res-get-token', {'Message': 'Permission denied.'})

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
#@app.route("/get-pkey", methods=["GET"])
@socketio.on('get-pkey')
def get_pkey(body):
    ses_id = body['ses_id']
    target = body['target']
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
                emit('res-get-pkey', {"pkey": pkey, "target": body['target'], "ses_id": body['ses_id']})
                return
            else:
               emit('res-get-pkey', {"Message": "Permission denied."})
               return
        else:
            emit('res-get-pkey', {"Message": "Invalid Session ID."})
            return
    else:
        emit('res-get-pkey', {"Message:" "User doesn't exist."})
        return

#@app.route("/my-pkey", methods=["POST"])
@socketio.on('my-pkey')
def store_my_pkey(body):
    #token = request.args.get('token')
    token = body['token']
    sql = '''
        SELECT token
        FROM Public_Keys
        WHERE token = ?
    '''
    res = execute_query(sql, (token,), 'one')
    if res is not None:
        return
    sql = '''
        SELECT username
        FROM User_Tokens
        WHERE token = ?
    '''
    res = execute_query(sql, (token,), 'one')
    if res is not None and token is not None:
        #pkey = request.args.get('pkey')
        pkey = body['pkey']
        sql = '''
            INSERT INTO Public_Keys VALUES(?,?)
        '''
        execute_query(sql, (token, pkey), None)
        emit('res-my-pkey', {"Success": True})
        return
    else:
        emit('res-my-pkey', {"Message": "Invalid token."})
        return

#@app.route("/my-requests", methods=["GET"])
@socketio.on('my-requests')
def get_chat_requests(body):
    #token = request.args.get('token')
    token = body['token']
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
        emit('res-my-requests', {'requests': reqs})
        return
    else:
        emit('res-my-requests', {"Message": "No chat requests so far."})
        return

@socketio.on('request')
def request_chat(body):
    global user_sids, tok_sids
    #requestor = request.args.get('requestor')
    requestor = body['token']
    requesting = body['requesting']
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
                #return jsonify({"Success": True, "req_id": req_id})
                emit('request-res', {"Success": True, "req_id": req_id, "user": body['requesting']})
                emit('check-requests', room=tok_sids[requesting])
                return
            else:
                #return jsonify({"Message": "You have already requested to chat with this person."})
                emit('request-res', {"Message": "You have already requested to chat with this person."})
                return
        else:
            #return jsonify({"Message": "This person has already requested to chat with you."})
            emit('request-res', {"Message": "This person has already requested to chat with you."})
            return
    else:
        #return jsonify({"Message": "User doesn't exist."})
        emit('request-res', {"Message": "User doesn't exist."})
        return
    #return jsonify({"Message": "Invalid token."})
    emit('request-res', {"Message": "Invalid token."})

@socketio.on('accept-request')
def accept_request(body):
    req_id = body['obj']['req_id']
    #token = request.args.get('token')
    token = body['token']
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
            #return jsonify({"Success": True, "ses_id": ses_id})
            emit('res-accept-request', {"Success": True, "ses_id": ses_id, "obj": body['obj']})
            emit('request-accepted', {"req_id": req_id, "ses_id": ses_id}, room=tok_sids[requestor])
            return
        elif granted == 1:
            emit('res-accept-request', {"Message": "Request already accepted."})
            return
        else:
            emit('res-accept-request', {"Message": "Permission denied."})
            return
    else:
        emit('res-accept-request', {"Message": "Invalid Request ID."})

#@app.route("/check-request", methods=["GET"])
@socketio.on('check-request')
def check_req(body):
    req_id = body['obj']['req_id']
    #token = request.args.get('token')
    token = body['token']
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
            emit('res-check-request', {"Message": "Chat Request has been accepted", "ses_id": ses_id, "obj": body['obj']})
            return
        elif granted == 0 and requestor == token:
            emit('res-check-request', {"Message": "Chat Request not accepted yet."})
            return
        else:
            emit('res-check-request', {"Message": "Permission denied."})
            return
    else:
        emit('res-check-request', {"Message": "Invalid Request ID."})
        return

def msg_endpoint(body):
    #req = request.json
    
    msg = body['msg']
    sender = body['token']
    receiver = body['receiver']
    time = datetime.now().strftime('%d/%m/%Y %I:%M:%S %p')
    ses_id = body['ses_id']
    msg_type = body['type']
    steg = body['steg']
    
    sql = '''
        SELECT *
        FROM User_Tokens
        WHERE token = ?
    '''
    res = execute_query(sql, (sender,), 'one')
    if res is None:
        return jsonify({"Message": "Invalid token"})
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
                    SELECT *
                    FROM Messages
                    WHERE (
                        session_id = ? AND 
                        sender = ? AND 
                        receiver = ? AND 
                        message = ? AND 
                        time = ? AND 
                        type = ? AND 
                        steg = ?
                    )
                '''
                res = execute_query(sql, (ses_id, sender, receiver, msg.encode(), time, msg_type, steg), 'one')
                if res is None:
                    sql = '''
                        INSERT INTO Messages VALUES(?,?,?,?,?,?,?)
                    '''
                    execute_query(sql, (ses_id, sender, receiver, msg.encode(), time, msg_type, steg), None)
                    print("Messaged")
                    return {"Success": True}
                else:
                    return {"Message": "Duplicate message."}
            else:
                return {"Message": "Permission denied."}
        else:
            return {"Message": "Invalid Session ID."}
    else:
        return {"Message": "User doesn't exist."}

#@app.route("/start-message", methods=["POST"])
@socketio.on('start-message')
def rec_msg(body):
    rid = str(uuid.uuid4())
    executor.submit_stored(rid, msg_endpoint, body)
    emit('res-start-message', {"Success": True, "task_id": rid, "receiver": body['receiver'], "ses_id": body['ses_id']})
    
#@app.route("/message", methods=["GET"])
@socketio.on('check-start-message')
def chk_msg(body):
    if not executor.futures.done(body['task_id']):
        socketio.sleep(1)
        emit('res-check-start-message', {"done": False, "task_id": body['task_id'], "receiver": body['receiver'], "ses_id": body['ses_id']})
        return
    emit('res-check-start-message', {"done": True})
    emit('check-messages', {"ses_id": body['ses_id']}, room=user_sids[body['receiver']])

#@app.route("/get-messages", methods=["GET"])
def get_msgs(body):
    #ses_id = request.args.get('ses_id')
    ses_id = body['ses_id']
    last_msg = int(body['last_msg'])
    sql = '''
        SELECT *
        FROM Messages
        WHERE Messages.session_id = ?
    '''
    res = execute_query(sql, (ses_id,), 'all')
    if len(res) > 0:
        msgs = []
        for r in res:
            ses_id, sender, receiver, msg, time, msg_type, steg = r
            sql = '''
                SELECT username
                FROM User_Tokens
                where token = ?
            '''
            sender = execute_query(sql, (sender,), 'one')[0]
            receiver = execute_query(sql, (receiver,), 'one')[0]
            msgs.append({'ses_id': ses_id, 'msg': msg.decode(), 'time': time, 'sender': sender, 'receiver': receiver, 'type': msg_type, 'steg': steg})
        return {'messages': msgs[last_msg:]}
    else:
        return {"Message": "No messages yet."}

@socketio.on('get-messages')
def get_messages(body):
    rid = str(uuid.uuid4())
    executor.submit_stored(rid, get_msgs, body)
    emit('res-get-messages', {"task_id": rid})

@socketio.on('check-messages')
def check_messages(body):
    if not executor.futures.done(body['task_id']):
        socketio.sleep(1)
        emit('res-check-messages', {'done': False, 'task_id': body['task_id']})
        return
    future = executor.futures.pop(body['task_id'])
    emit('res-check-messages', {"Done": True, "results": future.result()})

def setup():
    try:
        f = open('StegChatDB.db')
        f.close()
    except:
        db_setup()  

if __name__ == '__main__':

    try:
        f = open('StegChatDB.db')
        f.close()
    except:
        db_setup()

    #app.run(host='0.0.0.0', port='5000')
    socketio.run(app, host='0.0.0.0', port=5000)
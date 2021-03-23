"""Script for Tkinter GUI chat client."""
from socket import AF_INET, socket, SOCK_STREAM
import tkinter
import time
from threading import Thread
import sqlite3

check_flag = True
msgs = []

def on_close():
    global check_flag
    check_flag = False
    top.destroy()

def check_msgs():
    global msgs
    conn = sqlite3.connect('messages.db')
    c = conn.cursor()
    sql = '''SELECT * FROM msgs'''
    while check_flag:
        c.execute(sql)
        for t in c.fetchall():
            sender, msg = t
            if t not in msgs:
                msgs.append(t)
                msg_list.insert(tkinter.END, sender + ": " + msg)
        time.sleep(0.5)

top = tkinter.Tk()
top.title("Chatter")

messages_frame = tkinter.Frame(top)
my_msg = tkinter.StringVar()  # For the messages to be sent.
my_msg.set("Type your messages here.")
scrollbar = tkinter.Scrollbar(messages_frame)  # To navigate through past messages.
# Following will contain the messages.
msg_list = tkinter.Listbox(messages_frame, height=15, width=50, yscrollcommand=scrollbar.set)
scrollbar.pack(side=tkinter.RIGHT, fill=tkinter.Y)
msg_list.pack(side=tkinter.LEFT, fill=tkinter.BOTH)
msg_list.pack()
messages_frame.pack()
top.protocol("WM_DELETE_WINDOW", on_close)

t = Thread(target=check_msgs)
t.start()
tkinter.mainloop()  # Starts GUI execution.
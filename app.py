from flask import Flask, render_template, request, jsonify, Response
import sqlite3
import os
from nocache import nocache

template_dir = os.path.abspath('pages')
app = Flask(__name__, template_folder=template_dir)
app._static_folder = os.path.abspath('static')

DATABASE = 'database.db'


@app.route('/createTables')
def createTables():
    conn = sqlite3.connect(DATABASE)

    conn.execute('CREATE TABLE IF NOT EXISTS menu (menuID INTEGER PRIMARY KEY AUTOINCREMENT, item TEXT, price NUMERIC)')

    conn.execute('CREATE TABLE IF NOT EXISTS orders (orderID INTEGER PRIMARY KEY AUTOINCREMENT, totalPrice FLOAT, isCompleted BOOLEAN, orderDetail JSON, timestamp DATETIME)')

    conn.close()
    return "ok"

@app.route('/')
@nocache
def home():
    return render_template('index.html')

@app.route('/customer')
@nocache
def customer():
    return render_template('customer.html')

@app.route('/employee')
@nocache
def employee():
    return render_template('employee.html')

@app.route('/orders')
@nocache
def orders():
    return render_template('orders.html')

@app.route('/orderDisplay')
@nocache
def orderDisplay():
    return render_template('orderDisplay.html')

@app.route('/editMenu')
@nocache
def editMenu():
    return render_template('editMenu.html')

@app.route('/selectMenu')
def selectMenu():
    conn = sqlite3.connect(DATABASE)
    cur = conn.cursor()
    with conn:
        cur.execute('SELECT * FROM menu')
    rows = cur.fetchall()
    conn.close()
    return jsonify(rows)

@app.route('/insertMenu', methods=['POST'])
def insertMenu():
    item = request.json.get('item')
    price = request.json.get('price')
    conn = sqlite3.connect(DATABASE)
    cur = conn.cursor()
    with conn:
        cur.execute('INSERT INTO menu(item, price) VALUES (?,?)',(item, price))
    conn.close()
    return "ok"

@app.route('/selectOrders')
def selectOrders():
    conn = sqlite3.connect(DATABASE)
    cur = conn.cursor()
    with conn:
        cur.execute('SELECT * FROM orders')
    rows = cur.fetchall()
    conn.close()
    return jsonify(rows)

@app.route('/insertOrders', methods=['POST'])
def insertOrders():
    id = ""
    detail = request.json.get('detail')
    total = request.json.get('total')
    isCompleted = request.json.get('isCompleted')
    time = request.json.get('time')
    conn = sqlite3.connect(DATABASE)
    cur = conn.cursor()
    with conn:
        cur.execute("INSERT INTO orders (totalPrice,isCompleted,orderDetail,timestamp) VALUES (?,?,?,?)",(total,isCompleted,detail,time))
        id = cur.lastrowid
    conn.close()
    return str(id) 

@app.route('/dropTables')
def dropTables():
    sql1 = "DROP TABLE orders"
    sql2 = "DROP TABLE menu"
    conn = sqlite3.connect(DATABASE)
    cur = conn.cursor()
    with conn:
        cur.execute(sql1)
        cur.execute(sql2)
    conn.close()
    return "ok"

@app.route('/getOrderStatus/<id>')
def getOrderStatus(id):
    conn = sqlite3.connect(DATABASE)
    cur = conn.cursor()
    with conn:
        cur.execute('SELECT isCompleted FROM orders WHERE orderID=?', (id))
    result = cur.fetchone()
    conn.close()
    if result is None:
        return str(-1)
    return str(result[0])

@app.route('/deleteOrder/<id>')
def deleteOrder(id):
    conn = sqlite3.connect(DATABASE)
    cur = conn.cursor()
    with conn:
        cur.execute('DELETE FROM orders WHERE orderID=? and isCompleted=0', (id))
    result = cur.rowcount
    conn.close()
    return str(result)

@app.route('/deleteItemInMenu/<id>')
def deleteItemInMenu(id):
    conn = sqlite3.connect(DATABASE)
    cur = conn.cursor()
    with conn:
        cur.execute('DELETE FROM menu WHERE menuID=?', (id))
    result = cur.rowcount
    conn.close()
    return str(result)

@app.route('/updateItemInMenu/<id>/<newPrice>', methods=['GET', 'PUT'])
def updateItemInMenu(id, newPrice):
    conn = sqlite3.connect(DATABASE)
    cur = conn.cursor()
    with conn:
        cur.execute('UPDATE menu SET price=? WHERE menuID = ?', (newPrice, id))
    conn.close()
    return "updated"

@app.route('/selectOrdersNotComplete')
def selectOrdersNotComplete():
    conn = sqlite3.connect(DATABASE)
    cur = conn.cursor()
    with conn:
        cur.execute('SELECT * FROM orders WHERE isCompleted=0')
    rows = cur.fetchall()
    conn.close()
    return jsonify(rows)

@app.route('/updateOrdersCompleted/<id>', methods=['GET', 'PUT'])
def updateOrdersCompleted(id):
    conn = sqlite3.connect(DATABASE)
    cur = conn.cursor()
    with conn:
        cur.execute('UPDATE orders SET isCompleted=1 WHERE orderID = ?', (id))
    conn.close()
    return "updated"

@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r

if __name__ == "__main__":
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    app.run()
from flask import Flask, jsonify
import psutil
from flask_cors import CORS  # Import Flask-CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/stats')
def get_stats():
    cpu_percent = psutil.cpu_percent()
    memory_percent = psutil.virtual_memory().percent
    processes = sorted(psutil.process_iter(attrs=['pid', 'name', 'cpu_percent']), key=lambda p: p.info['cpu_percent'], reverse=True)[:5]
    
    top_processes = [{"pid": p.info["pid"], "name": p.info["name"], "cpu": p.info["cpu_percent"]} for p in processes]
    
    return jsonify({"cpu": cpu_percent, "memory": memory_percent, "processes": top_processes})

if __name__ == '__main__':
    app.run(debug=True, port=5000)

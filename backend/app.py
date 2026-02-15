from flask import Flask, request, jsonify
from flask_cors import CORS
from calculator import Calculator

app = Flask(__name__)
CORS(app)


# Health Check Route
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "success",
        "message": "Calculator API Running"
    })


# Calculation Route (POST only)
@app.route("/calculate", methods=["POST"])
def calculate():

    # Ensure request is JSON
    if not request.is_json:
        return jsonify({
            "status": "error",
            "message": "Request must be JSON"
        }), 400

    data = request.get_json()

    # Validate expression presence
    if "expression" not in data:
        return jsonify({
            "status": "error",
            "message": "No expression provided"
        }), 400

    expression = data["expression"]

    result = Calculator.evaluate(expression)

    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)

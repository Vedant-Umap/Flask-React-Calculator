import ast
import operator as op

# Supported operators
allowed_operators = {
    ast.Add: op.add,
    ast.Sub: op.sub,
    ast.Mult: op.mul,
    ast.Div: op.truediv,
    ast.Mod: op.mod,
    ast.Pow: op.pow,
    ast.USub: op.neg
}


class Calculator:

    @staticmethod
    def evaluate(expression: str):

        try:
            node = ast.parse(expression, mode='eval')
            result = Calculator._evaluate_node(node.body)
            return {"result": result}
        except Exception:
            return {"error": "Invalid expression"}

    @staticmethod
    def _evaluate_node(node):

        if isinstance(node, ast.Constant):  # numbers
            return node.value

        elif isinstance(node, ast.BinOp):  # binary operations
            left = Calculator._evaluate_node(node.left)
            right = Calculator._evaluate_node(node.right)
            operator = allowed_operators[type(node.op)]
            return operator(left, right)

        elif isinstance(node, ast.UnaryOp):  # negative numbers
            operand = Calculator._evaluate_node(node.operand)
            operator = allowed_operators[type(node.op)]
            return operator(operand)

        else:
            raise TypeError("Unsupported operation")

import json
import os

def load_rules():
    rules_path = os.path.join(os.path.dirname(__file__), '../rules/adaptation_rules.json')
    with open(rules_path, 'r') as f:
        data = json.load(f)
    return data['rules']

def evaluate_rules(performance: dict) -> dict:
    rules = load_rules()
    
    consecutive_errors = performance.get('consecutive_errors', 0)
    consecutive_successes = performance.get('consecutive_successes', 0)
    error_rate = performance.get('error_rate', 0.0)
    
    triggered_rule = None
    
    for rule in rules:
        condition = rule['condition']
        
        if 'consecutive_errors >= 5' in condition and consecutive_errors >= 5:
            triggered_rule = rule
            break
        elif 'consecutive_errors >= 3' in condition and consecutive_errors >= 3:
            triggered_rule = rule
            break
        elif 'consecutive_successes >= 10' in condition and consecutive_successes >= 10:
            triggered_rule = rule
            break
        elif 'consecutive_successes >= 5' in condition and consecutive_successes >= 5:
            triggered_rule = rule
            break
        elif 'error_rate > 0.6' in condition and error_rate > 0.6:
            triggered_rule = rule
            break
    
    if triggered_rule:
        return {
            'rule_id': triggered_rule['id'],
            'action': triggered_rule['action'],
            'explanation': triggered_rule['explanation'],
            'rule_triggered': True
        }
    
    return {
        'rule_id': None,
        'action': 'maintain',
        'explanation': 'Performance is stable — no adjustment needed',
        'rule_triggered': False
    }
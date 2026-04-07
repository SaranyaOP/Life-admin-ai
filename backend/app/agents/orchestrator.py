from app.agents.task_agent import task_agent
from app.agents.planning_agent import planning_agent
from app.agents.memory_agent import save_memory

# 🔥 Simple cache (optional but useful)
cache = {}

def orchestrator(user_input: str):
    # ✅ Check cache first
    if user_input in cache:
        return cache[user_input]

    text = user_input.lower()

    # 🔥 Rule-based intent (NO API CALL)
    if "plan" in text or "prepare" in text:
        result = planning_agent(user_input)
    else:
        result = task_agent(user_input)

    # Save memory
    save_memory({
        "input": user_input,
        "output": result
    })

    # Save to cache
    cache[user_input] = result

    return result
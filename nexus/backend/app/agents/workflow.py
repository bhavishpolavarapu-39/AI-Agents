from typing import TypedDict, List, Dict, Any, Annotated
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages

class WorkflowState(TypedDict):
    messages: Annotated[List, add_messages]
    result: Dict[str, Any]

def analyzer_node(state): 
    state["result"] = {"status": "analyzed"}
    return state

def optimizer_node(state): 
    state["result"]["optimization"] = "complete"
    return state

def executor_node(state): 
    return state

def create_workflow():
    workflow = StateGraph(WorkflowState)
    workflow.add_node("analyzer", analyzer_node)
    workflow.add_node("optimizer", optimizer_node)
    workflow.add_node("executor", executor_node)
    workflow.set_entry_point("analyzer")
    workflow.add_edge("analyzer", "optimizer")
    workflow.add_edge("optimizer", "executor")
    workflow.add_edge("executor", END)
    return workflow.compile()

workflow = create_workflow()

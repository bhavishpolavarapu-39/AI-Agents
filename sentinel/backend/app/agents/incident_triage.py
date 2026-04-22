from typing import TypedDict, Optional, List, Dict, Any, Annotated
from datetime import datetime
import json
from anthropic import Anthropic
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages


class IncidentState(TypedDict):
    anomaly_data: Dict[str, Any]
    incident_id: Optional[int]
    is_real_incident: bool
    novelty_score: float
    affected_services: List[str]
    cascade_effects: List[Dict[str, Any]]
    root_cause: Optional[str]
    contributing_factors: List[str]
    remediation_plan: Dict[str, Any]
    automation_confidence: float
    requires_human_approval: bool
    timeline_events: List[Dict[str, Any]]
    messages: Annotated[List, add_messages]


def classifier_node(state: IncidentState) -> IncidentState:
    client = Anthropic()
    anomaly_prompt = f"Analyze if this is a real incident: {json.dumps(state['anomaly_data'])}. Return JSON with is_real_incident, novelty_score, and reasoning."
    
    try:
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            messages=[{"role": "user", "content": anomaly_prompt}]
        )
        result = json.loads(response.content[0].text)
        state["is_real_incident"] = result.get("is_real_incident", False)
        state["novelty_score"] = result.get("novelty_score", 0.0)
    except:
        state["is_real_incident"] = False
        state["novelty_score"] = 0.0
    return state


def correlator_node(state: IncidentState) -> IncidentState:
    if not state["is_real_incident"]:
        return state
    client = Anthropic()
    prompt = f"Identify cascade effects for service {state['anomaly_data'].get('service_name')}. Return JSON with affected_services and cascade_effects."
    
    try:
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}]
        )
        result = json.loads(response.content[0].text)
        state["affected_services"] = result.get("affected_services", [])
        state["cascade_effects"] = result.get("cascade_effects", [])
    except:
        state["affected_services"] = [state['anomaly_data'].get('service_name', 'unknown')]
    return state


def analyzer_node(state: IncidentState) -> IncidentState:
    if not state["is_real_incident"]:
        return state
    client = Anthropic()
    prompt = f"Analyze root cause for {state['anomaly_data'].get('service_name')}. Return JSON with root_cause, contributing_factors, and timeline."
    
    try:
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}]
        )
        result = json.loads(response.content[0].text)
        state["root_cause"] = result.get("root_cause")
        state["contributing_factors"] = result.get("contributing_factors", [])
        state["timeline_events"] = result.get("timeline", [])
    except:
        state["root_cause"] = "Unable to determine"
    return state


def remediation_node(state: IncidentState) -> IncidentState:
    if not state["is_real_incident"]:
        return state
    client = Anthropic()
    prompt = f"Create remediation plan for: {state['root_cause']}. Return JSON with immediate_actions, permanent_fix, automation_confidence, requires_approval."
    
    try:
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}]
        )
        result = json.loads(response.content[0].text)
        state["remediation_plan"] = result.get("remediation_plan", {})
        state["automation_confidence"] = result.get("automation_confidence", 0.0)
        state["requires_human_approval"] = result.get("requires_approval", True)
    except:
        state["remediation_plan"] = {}
        state["automation_confidence"] = 0.0
        state["requires_human_approval"] = True
    return state


def create_incident_triage_workflow():
    workflow = StateGraph(IncidentState)
    workflow.add_node("classifier", classifier_node)
    workflow.add_node("correlator", correlator_node)
    workflow.add_node("analyzer", analyzer_node)
    workflow.add_node("remediation", remediation_node)
    
    workflow.set_entry_point("classifier")
    workflow.add_edge("classifier", "correlator")
    workflow.add_edge("correlator", "analyzer")
    workflow.add_edge("analyzer", "remediation")
    workflow.add_edge("remediation", END)
    
    return workflow.compile()


incident_triage_workflow = create_incident_triage_workflow()

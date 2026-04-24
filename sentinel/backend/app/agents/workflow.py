"""
SENTINEL Workflow Module
Exports the incident triage workflow for consistency with other products
"""

from app.agents.incident_triage import incident_triage_workflow

# Main workflow export
workflow = incident_triage_workflow

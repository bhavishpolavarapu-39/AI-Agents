"""
SENTINEL Database Models
Infrastructure monitoring and incident management data models
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from enum import Enum
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Enum as SQLEnum, JSON, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field

Base = declarative_base()


# ============ Enums ============
class SeverityLevel(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"


class IncidentStatus(str, Enum):
    DETECTED = "detected"
    ACKNOWLEDGED = "acknowledged"
    INVESTIGATING = "investigating"
    MITIGATING = "mitigating"
    RESOLVED = "resolved"
    FALSE_POSITIVE = "false_positive"


class ComponentHealth(str, Enum):
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    CRITICAL = "critical"


# ============ SQLAlchemy Models ============
class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True)
    description = Column(Text)
    team_owner = Column(String(255))
    slo_target = Column(Float, default=99.9)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    metrics = relationship("Metric", back_populates="service")
    incidents = relationship("Incident", back_populates="service")
    health = relationship("ServiceHealth", back_populates="service", uselist=False)


class Metric(Base):
    __tablename__ = "metrics"

    id = Column(Integer, primary_key=True, index=True)
    service_id = Column(Integer, ForeignKey("services.id"))
    metric_name = Column(String(255), index=True)
    value = Column(Float)
    unit = Column(String(50))
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    tags = Column(JSON, default={})

    service = relationship("Service", back_populates="metrics")
    anomalies = relationship("Anomaly", back_populates="metric")


class Anomaly(Base):
    __tablename__ = "anomalies"

    id = Column(Integer, primary_key=True, index=True)
    metric_id = Column(Integer, ForeignKey("metrics.id"))
    detected_at = Column(DateTime, default=datetime.utcnow)
    anomaly_score = Column(Float)
    is_real = Column(Boolean, default=None)
    reason = Column(Text)
    metadata = Column(JSON, default={})

    metric = relationship("Metric", back_populates="anomalies")


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    service_id = Column(Integer, ForeignKey("services.id"))
    title = Column(String(512))
    description = Column(Text)
    severity = Column(SQLEnum(SeverityLevel), index=True)
    status = Column(SQLEnum(IncidentStatus), default=IncidentStatus.DETECTED, index=True)
    detected_at = Column(DateTime, default=datetime.utcnow)
    acknowledged_at = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    affected_services = Column(JSON, default=[])
    affected_users = Column(Integer, default=0)
    root_cause = Column(Text)
    timeline = Column(JSON, default=[])
    remediation_plan = Column(JSON, default={})
    automation_confidence = Column(Float, default=0.0)
    requires_human_approval = Column(Boolean, default=True)
    human_approved = Column(Boolean, default=False)
    approved_at = Column(DateTime, nullable=True)
    approved_by = Column(String(255), nullable=True)
    metadata = Column(JSON, default={})

    service = relationship("Service", back_populates="incidents")
    action_logs = relationship("ActionLog", back_populates="incident")


class ActionLog(Base):
    __tablename__ = "action_logs"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"))
    action_type = Column(String(255), index=True)
    action_name = Column(String(512))
    status = Column(String(50), default="pending")
    executed_at = Column(DateTime, nullable=True)
    error = Column(Text, nullable=True)
    rollback_plan = Column(Text)
    metadata = Column(JSON, default={})

    incident = relationship("Incident", back_populates="action_logs")


class ServiceHealth(Base):
    __tablename__ = "service_health"

    id = Column(Integer, primary_key=True, index=True)
    service_id = Column(Integer, ForeignKey("services.id"), unique=True)
    health_score = Column(Float)
    uptime_percent = Column(Float)
    error_rate = Column(Float)
    latency_p99 = Column(Float)
    last_incident = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    service = relationship("Service", back_populates="health")


# ============ Pydantic Schemas ============
class MetricBase(BaseModel):
    metric_name: str
    value: float
    unit: str
    tags: Dict[str, Any] = {}


class MetricCreate(MetricBase):
    service_id: int


class MetricResponse(MetricBase):
    id: int
    service_id: int
    timestamp: datetime

    class Config:
        from_attributes = True


class ServiceBase(BaseModel):
    name: str
    description: str
    team_owner: str
    slo_target: float = 99.9


class ServiceCreate(ServiceBase):
    pass


class ServiceResponse(ServiceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class IncidentBase(BaseModel):
    title: str
    description: str
    severity: SeverityLevel
    affected_services: List[str] = []
    affected_users: int = 0


class IncidentCreate(IncidentBase):
    service_id: int
    root_cause: Optional[str] = None
    remediation_plan: Dict[str, Any] = {}
    automation_confidence: float = 0.0


class IncidentUpdate(BaseModel):
    status: Optional[IncidentStatus] = None
    human_approved: Optional[bool] = None
    root_cause: Optional[str] = None
    remediation_plan: Optional[Dict[str, Any]] = None


class IncidentResponse(IncidentBase):
    id: int
    service_id: int
    status: IncidentStatus
    detected_at: datetime
    acknowledged_at: Optional[datetime]
    resolved_at: Optional[datetime]
    root_cause: Optional[str]
    remediation_plan: Dict[str, Any]
    automation_confidence: float
    requires_human_approval: bool
    human_approved: bool

    class Config:
        from_attributes = True


class ActionLogCreate(BaseModel):
    action_type: str
    action_name: str
    rollback_plan: str
    metadata: Dict[str, Any] = {}


class ActionLogResponse(ActionLogCreate):
    id: int
    incident_id: int
    status: str
    executed_at: Optional[datetime]
    error: Optional[str]

    class Config:
        from_attributes = True


class ServiceHealthResponse(BaseModel):
    id: int
    service_id: int
    health_score: float
    uptime_percent: float
    error_rate: float
    latency_p99: float
    last_incident: Optional[datetime]
    updated_at: datetime

    class Config:
        from_attributes = True


class DashboardSummary(BaseModel):
    health_score: float
    uptime_percent: float
    incidents_last_24h: int
    mean_time_to_detect_minutes: float
    mean_time_to_resolve_minutes: float
    alerts_firing: int
    slo_compliance: Dict[str, float]

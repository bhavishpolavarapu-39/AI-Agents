from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, Float
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class LegalCase(Base):
    __tablename__ = "legal_cases"
    id = Column(Integer, primary_key=True)
    case_id = Column(String(100), unique=True)
    case_type = Column(String(50))
    description = Column(Text)
    jurisdiction = Column(String(100))
    analysis = Column(Text)
    risks = Column(JSON)
    precedents = Column(JSON)
    draft = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class Contract(Base):
    __tablename__ = "contracts"
    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    parties = Column(JSON)
    key_clauses = Column(JSON)
    risk_score = Column(Float)
    compliance_status = Column(String(50))

class Precedent(Base):
    __tablename__ = "precedents"
    id = Column(Integer, primary_key=True)
    citation = Column(String(255))
    year = Column(Integer)
    court = Column(String(100))
    holding = Column(Text)
    relevance = Column(Float)

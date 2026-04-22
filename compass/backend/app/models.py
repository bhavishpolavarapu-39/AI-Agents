from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Entity(Base):
    __tablename__ = "compass_entities"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(512))
    status = Column(String(50), default="active")
    metadata = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Analysis(Base):
    __tablename__ = "compass_analysis"
    id = Column(Integer, primary_key=True, index=True)
    entity_id = Column(Integer)
    analysis_type = Column(String(100))
    result = Column(JSON, default={})
    timestamp = Column(DateTime, default=datetime.utcnow)

class Recommendation(Base):
    __tablename__ = "compass_recommendations"
    id = Column(Integer, primary_key=True, index=True)
    entity_id = Column(Integer)
    recommendation_text = Column(Text)
    priority = Column(String(50))
    status = Column(String(50), default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)

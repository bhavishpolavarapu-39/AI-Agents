from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True)
    user_id = Column(String(100), unique=True)
    name = Column(String(255))
    dob = Column(DateTime)
    medical_conditions = Column(JSON)
    medications = Column(JSON)

class VitalSign(Base):
    __tablename__ = "vital_signs"
    id = Column(Integer, primary_key=True)
    patient_id = Column(Integer)
    timestamp = Column(DateTime, default=datetime.utcnow)
    heart_rate = Column(Integer)
    systolic = Column(Integer)
    diastolic = Column(Integer)
    temperature = Column(Float)
    oxygen_saturation = Column(Float)
    respiratory_rate = Column(Integer)
    anomalies = Column(JSON)

class HealthScore(Base):
    __tablename__ = "health_scores"
    id = Column(Integer, primary_key=True)
    patient_id = Column(Integer)
    timestamp = Column(DateTime, default=datetime.utcnow)
    overall_score = Column(Float)
    components = Column(JSON)
    trend = Column(String(50))

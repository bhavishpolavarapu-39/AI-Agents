from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, Boolean, Float
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Research(Base):
    __tablename__ = "research"
    id = Column(Integer, primary_key=True)
    title = Column(String(512))
    description = Column(Text)
    field = Column(String(100))
    hypotheses = Column(JSON)
    literature = Column(JSON)
    experiments = Column(JSON)
    simulation_results = Column(JSON)
    publication_draft = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class Hypothesis(Base):
    __tablename__ = "hypotheses"
    id = Column(Integer, primary_key=True)
    research_id = Column(Integer)
    h0 = Column(Text)
    h1 = Column(Text)
    variables = Column(JSON)
    experimental_design = Column(String(100))
    power_estimate = Column(Float)
    confidence = Column(Float)

class Literature(Base):
    __tablename__ = "literature"
    id = Column(Integer, primary_key=True)
    research_id = Column(Integer)
    title = Column(String(512))
    authors = Column(String(512))
    year = Column(Integer)
    doi = Column(String(100))
    relevance_score = Column(Float)
    abstract = Column(Text)
    embeddings = Column(JSON)

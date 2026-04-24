"""Base Plugin Class"""
from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
from pydantic import BaseModel
from datetime import datetime

class PluginMetadata(BaseModel):
    id: str
    name: str
    description: str
    version: str
    author: str
    category: str
    supports_real_time: bool = False

class PluginResult(BaseModel):
    plugin_id: str
    plugin_name: str
    success: bool
    data: Dict[str, Any]
    recommendations: List[str] = []
    warnings: List[str] = []
    timestamp: datetime = datetime.now()
    execution_time_ms: float = 0.0

class PluginBase(ABC):
    @abstractmethod
    def get_metadata(self) -> PluginMetadata:
        pass
    @abstractmethod
    def validate_input(self, portfolio_data: Dict[str, Any]) -> bool:
        pass
    @abstractmethod
    async def run(self, portfolio_data: Dict[str, Any], market_data: Dict[str, Any], additional_params: Optional[Dict[str, Any]] = None) -> PluginResult:
        pass
    def _create_result(self, success: bool, data: Dict[str, Any], recommendations: List[str] = [], warnings: List[str] = [], execution_time_ms: float = 0.0) -> PluginResult:
        metadata = self.get_metadata()
        return PluginResult(plugin_id=metadata.id, plugin_name=metadata.name, success=success, data=data, recommendations=recommendations, warnings=warnings, execution_time_ms=execution_time_ms)

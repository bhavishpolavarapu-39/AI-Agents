"""
APEX Plugin System
Extensible architecture for portfolio analysis plugins
"""

from .base import PluginBase, PluginMetadata, PluginResult
from .rebalancer_plugin import PortfolioRebalancerPlugin
from .risk_analyzer_plugin import RiskAnalyzerPlugin
from .tax_optimizer_plugin import TaxOptimizerPlugin
from .market_watcher_plugin import MarketWatcherPlugin
from .ai_analyst_plugin import AIAnalystPlugin

__all__ = [
    "PluginBase",
    "PluginMetadata",
    "PluginResult",
    "PortfolioRebalancerPlugin",
    "RiskAnalyzerPlugin",
    "TaxOptimizerPlugin",
    "MarketWatcherPlugin",
    "AIAnalystPlugin",
]

# Plugin registry for easy access
PLUGINS = {
    "rebalancer": PortfolioRebalancerPlugin,
    "risk_analyzer": RiskAnalyzerPlugin,
    "tax_optimizer": TaxOptimizerPlugin,
    "market_watcher": MarketWatcherPlugin,
    "ai_analyst": AIAnalystPlugin,
}

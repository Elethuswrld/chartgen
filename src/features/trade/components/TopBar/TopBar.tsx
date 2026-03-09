import SymbolSearch from './SymbolSearch';
import TimeframeStrip from './TimeframeStrip';
import LayoutPresets from './LayoutPresets';
import IndicatorDrawer from './IndicatorDrawer';

export default function TopBar() {
  return (
    <div className="bg-gray-800 text-white p-4 flex items-center space-x-4">
      <SymbolSearch />
      <TimeframeStrip />
      <div className="flex-grow"></div>
      <LayoutPresets />
      <IndicatorDrawer />
    </div>
  );
}

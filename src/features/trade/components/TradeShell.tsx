
'use client';

import TopBar from './TopBar';
import LeftRail from './LeftRail';
import ChartCanvas from './ChartCanvas';
import RightPanel from './RightPanel';
import BottomTabs from './BottomTabs';
import { useUiStore } from '@/stores/uiStore';
import { Resizable } from 're-resizable';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

export default function TradeShell({ symbol }: { symbol: string }) {
  const layoutPreset = useUiStore(state => state.layoutPreset);

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      <TopBar />

      <div className="flex flex-grow">
        <LeftRail />

        <div className="flex-grow flex flex-col">
          <main className="flex-grow">
            <Allotment defaultSizes={[100, 30]}>
              <Allotment.Pane>
                <ChartCanvas />
              </Allotment.Pane>
              <Allotment.Pane visible={layoutPreset === 'default'}>
                <RightPanel />
              </Allotment.Pane>
            </Allotment>
          </main>

          <Resizable
            defaultSize={{
              width: '100%',
              height: 300,
            }}
            minHeight={100}
            maxHeight={600}
            enable={{ top: true }}
          >
            <BottomTabs />
          </Resizable>
        </div>
      </div>
    </div>
  );
}

import { PixelCalendar } from './components/PixelCalendar/PixelCalendar'
import { DigitalClock } from './components/DigitalClock/DigitalClock'

function App() {
  return (
    <main>
      <div className="clock-corner clock-corner--left">
        <DigitalClock timeZone="America/Vancouver" label="Vancouver" />
      </div>
      <div className="clock-corner clock-corner--right">
        <DigitalClock timeZone="Europe/London" label="Glasgow" />
      </div>
      <PixelCalendar />
    </main>
  )
}

export default App

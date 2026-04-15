export const fetchTelemetry = async (history) => {
  // Simulate network delay
  await new Promise(r => setTimeout(r, 600));

  const lastPoint = history.length > 0 
    ? history[history.length - 1] 
    : { temp: 26, current: 1.1 };

  // AI SIMULATION LOGIC: 10% chance of a "Thermal Spike" for the judges
  const isSpike = Math.random() > 0.90;
  
  let newTemp = isSpike 
    ? parseFloat(lastPoint.temp) + (Math.random() * 12 + 8) 
    : parseFloat(lastPoint.temp) + (Math.random() * 2 - 0.8);
    
  let newCurrent = isSpike
    ? parseFloat(lastPoint.current) + 1.8
    : parseFloat(lastPoint.current) + (Math.random() * 0.2 - 0.1);

  // Bounds checking
  if (!isSpike && newTemp > 34) newTemp -= 3;
  if (!isSpike && newTemp < 22) newTemp += 3;

  const currentData = {
    temp: parseFloat(newTemp).toFixed(1),
    current: parseFloat(newCurrent).toFixed(2),
    status: "AI_MONITOR_ACTIVE",
    time: new Date().toLocaleTimeString().slice(0, 8)
  };

  // Run AI Anomaly Detection
  const tempDelta = currentData.temp - lastPoint.temp;
  let risk = 'SAFE';

  if (tempDelta > 4 || currentData.temp > 48) {
    risk = 'DANGER';
  } else if (currentData.temp > 38) {
    risk = 'WARNING';
  }

  return { ...currentData, aiRisk: risk };
};